/**
 * Token estimation utilities for context window management
 */

import { createLogger } from './logger.js';

const logger = createLogger('TokenEstimator');

/**
 * Estimate tokens in text using character-based heuristic
 * This is a rough approximation - actual token count may vary by model
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;

  // Base estimation: ~4 characters per token for English text
  // Adjusted for code which typically has more tokens due to special characters
  const baseTokens = text.length / 3.5;

  // Count special characters that typically consume more tokens
  const specialChars = (text.match(/[{}()\[\];,.<>!@#$%^&*+=|\\\/`~]/g) || []).length;

  // Count whitespace separately as it affects tokenization
  const whitespace = (text.match(/\s+/g) || []).length;

  // Estimate total tokens
  const estimatedTokens = Math.ceil(baseTokens + specialChars * 0.3 + whitespace * 0.2);

  return estimatedTokens;
}

/**
 * Estimate tokens in code with language-specific adjustments
 */
export function estimateCodeTokens(code: string, language?: string): number {
  const baseEstimate = estimateTokens(code);

  // Language-specific multipliers
  const multipliers: Record<string, number> = {
    javascript: 1.1,
    typescript: 1.15,
    python: 1.0,
    java: 1.2,
    cpp: 1.25,
    rust: 1.2,
    go: 1.1,
  };

  const multiplier = language ? multipliers[language.toLowerCase()] || 1.1 : 1.1;

  return Math.ceil(baseEstimate * multiplier);
}

/**
 * Check if text fits within token limit
 */
export function fitsInTokenLimit(text: string, limit: number): boolean {
  return estimateTokens(text) <= limit;
}

/**
 * Split text into chunks that fit within token limit
 */
export interface TextChunk {
  content: string;
  tokens: number;
  startIndex: number;
  endIndex: number;
}

export function chunkTextByTokens(
  text: string,
  maxTokens: number,
  overlapTokens = 0
): TextChunk[] {
  const chunks: TextChunk[] = [];

  // Split by paragraphs first (double newline)
  const paragraphs = text.split(/\n\n+/);

  let currentChunk = '';
  let currentTokens = 0;
  let startIndex = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    const paragraphTokens = estimateTokens(paragraph);

    // If a single paragraph exceeds limit, split it by sentences
    if (paragraphTokens > maxTokens) {
      // Save current chunk if it has content
      if (currentChunk) {
        chunks.push({
          content: currentChunk.trim(),
          tokens: currentTokens,
          startIndex,
          endIndex: startIndex + currentChunk.length,
        });
        currentChunk = '';
        currentTokens = 0;
        startIndex += currentChunk.length;
      }

      // Split large paragraph by sentences
      const sentences = splitBySentences(paragraph);
      for (const sentence of sentences) {
        const sentenceTokens = estimateTokens(sentence);

        if (currentTokens + sentenceTokens > maxTokens && currentChunk) {
          chunks.push({
            content: currentChunk.trim(),
            tokens: currentTokens,
            startIndex,
            endIndex: startIndex + currentChunk.length,
          });

          // Add overlap from previous chunk
          if (overlapTokens > 0 && chunks.length > 0) {
            const overlapText = getOverlapText(currentChunk, overlapTokens);
            currentChunk = overlapText + sentence;
            currentTokens = estimateTokens(currentChunk);
          } else {
            currentChunk = sentence;
            currentTokens = sentenceTokens;
          }

          startIndex += currentChunk.length - (overlapTokens > 0 ? overlapText.length : 0);
        } else {
          currentChunk += (currentChunk ? ' ' : '') + sentence;
          currentTokens += sentenceTokens;
        }
      }
    } else {
      // Check if adding this paragraph would exceed limit
      if (currentTokens + paragraphTokens > maxTokens && currentChunk) {
        chunks.push({
          content: currentChunk.trim(),
          tokens: currentTokens,
          startIndex,
          endIndex: startIndex + currentChunk.length,
        });

        // Add overlap from previous chunk
        if (overlapTokens > 0 && chunks.length > 0) {
          const overlapText = getOverlapText(currentChunk, overlapTokens);
          currentChunk = overlapText + '\n\n' + paragraph;
          currentTokens = estimateTokens(currentChunk);
        } else {
          currentChunk = paragraph;
          currentTokens = paragraphTokens;
        }

        startIndex += currentChunk.length - (overlapTokens > 0 ? overlapText.length : 0);
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
        currentTokens += paragraphTokens;
      }
    }
  }

  // Add final chunk
  if (currentChunk) {
    chunks.push({
      content: currentChunk.trim(),
      tokens: currentTokens,
      startIndex,
      endIndex: startIndex + currentChunk.length,
    });
  }

  logger.debug(`Split text into ${chunks.length} chunks`, {
    totalTokens: chunks.reduce((sum, chunk) => sum + chunk.tokens, 0),
    maxTokens,
  });

  return chunks;
}

/**
 * Split text by sentences
 */
function splitBySentences(text: string): string[] {
  // Simple sentence splitting - can be enhanced with NLP libraries
  return text
    .split(/([.!?]+\s+)/)
    .reduce((sentences: string[], part, i, arr) => {
      if (i % 2 === 0) {
        const sentence = part + (arr[i + 1] || '');
        if (sentence.trim()) {
          sentences.push(sentence);
        }
      }
      return sentences;
    }, []);
}

/**
 * Get overlap text from end of previous chunk
 */
function getOverlapText(text: string, overlapTokens: number): string {
  const sentences = splitBySentences(text);
  let overlap = '';
  let tokens = 0;

  // Take sentences from the end until we reach desired overlap
  for (let i = sentences.length - 1; i >= 0; i--) {
    const sentence = sentences[i];
    const sentenceTokens = estimateTokens(sentence);

    if (tokens + sentenceTokens <= overlapTokens) {
      overlap = sentence + overlap;
      tokens += sentenceTokens;
    } else {
      break;
    }
  }

  return overlap;
}

/**
 * Chunk code by logical blocks (functions, classes, etc.)
 */
export function chunkCodeByBlocks(code: string, maxTokens: number): TextChunk[] {
  const chunks: TextChunk[] = [];
  const lines = code.split('\n');

  let currentChunk: string[] = [];
  let currentTokens = 0;
  let startLine = 0;
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineTokens = estimateTokens(line);

    // Track brace depth to avoid splitting inside blocks
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    braceDepth += openBraces - closeBraces;

    // Check if adding this line would exceed limit
    if (currentTokens + lineTokens > maxTokens && currentChunk.length > 0) {
      // Only split if we're not inside a block
      if (braceDepth === 0) {
        chunks.push({
          content: currentChunk.join('\n'),
          tokens: currentTokens,
          startIndex: startLine,
          endIndex: i,
        });

        currentChunk = [line];
        currentTokens = lineTokens;
        startLine = i;
      } else {
        currentChunk.push(line);
        currentTokens += lineTokens;
      }
    } else {
      currentChunk.push(line);
      currentTokens += lineTokens;
    }
  }

  // Add final chunk
  if (currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join('\n'),
      tokens: currentTokens,
      startIndex: startLine,
      endIndex: lines.length,
    });
  }

  return chunks;
}

/**
 * Get token usage summary for multiple texts
 */
export interface TokenUsageSummary {
  totalTokens: number;
  items: Array<{
    name: string;
    tokens: number;
    percentage: number;
  }>;
}

export function getTokenUsageSummary(items: Map<string, string>): TokenUsageSummary {
  const tokenCounts = new Map<string, number>();
  let totalTokens = 0;

  for (const [name, content] of items.entries()) {
    const tokens = estimateTokens(content);
    tokenCounts.set(name, tokens);
    totalTokens += tokens;
  }

  const summary: TokenUsageSummary = {
    totalTokens,
    items: [],
  };

  for (const [name, tokens] of tokenCounts.entries()) {
    summary.items.push({
      name,
      tokens,
      percentage: (tokens / totalTokens) * 100,
    });
  }

  // Sort by token count descending
  summary.items.sort((a, b) => b.tokens - a.tokens);

  return summary;
}

/**
 * Truncate text to fit within token limit
 */
export function truncateToTokenLimit(
  text: string,
  maxTokens: number,
  suffix = '\n... (truncated)'
): string {
  if (estimateTokens(text) <= maxTokens) {
    return text;
  }

  const suffixTokens = estimateTokens(suffix);
  const targetTokens = maxTokens - suffixTokens;

  // Binary search for the right length
  let low = 0;
  let high = text.length;
  let result = '';

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const candidate = text.substring(0, mid);
    const tokens = estimateTokens(candidate);

    if (tokens <= targetTokens) {
      result = candidate;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return result + suffix;
}

/**
 * Get recommended chunk size based on model context window
 */
export function getRecommendedChunkSize(contextWindow: number): number {
  // Use 50% of context window to leave room for prompts and responses
  return Math.floor(contextWindow * 0.5);
}
