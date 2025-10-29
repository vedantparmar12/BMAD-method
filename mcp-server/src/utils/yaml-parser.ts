/**
 * YAML parsing utilities for BMAD agent definitions
 */

import yaml from 'js-yaml';
import { readFile } from './file-utils.js';
import { createLogger } from './logger.js';
import type { BmadAgent, BmadTask, BmadTemplate, BmadWorkflow, BmadChecklist } from '../types/bmad.js';

const logger = createLogger('YamlParser');

/**
 * Parse YAML content
 */
export function parseYaml<T = unknown>(content: string): T {
  try {
    return yaml.load(content) as T;
  } catch (error) {
    logger.error('Failed to parse YAML', error);
    throw new Error('Failed to parse YAML content');
  }
}

/**
 * Stringify to YAML
 */
export function stringifyYaml(data: unknown): string {
  try {
    return yaml.dump(data, {
      indent: 2,
      lineWidth: 100,
      noRefs: true,
    });
  } catch (error) {
    logger.error('Failed to stringify YAML', error);
    throw new Error('Failed to stringify to YAML');
  }
}

/**
 * Extract YAML front matter from markdown
 */
export function extractYamlFrontMatter(content: string): { yaml: string | null; markdown: string } {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);

  if (match) {
    return {
      yaml: match[1],
      markdown: match[2],
    };
  }

  return {
    yaml: null,
    markdown: content,
  };
}

/**
 * Extract YAML block from markdown with markers
 */
export function extractYamlBlock(content: string, blockName?: string): string | null {
  const pattern = blockName
    ? new RegExp(`\`\`\`yaml:${blockName}\\s*\\n([\\s\\S]*?)\\n\`\`\``, 'i')
    : /```yaml\s*\n([\s\S]*?)\n```/i;

  const match = content.match(pattern);
  return match ? match[1].trim() : null;
}

/**
 * Parse agent definition from markdown file
 */
export async function parseAgentFile(filePath: string): Promise<BmadAgent> {
  try {
    const content = await readFile(filePath);
    const { yaml: frontMatter, markdown } = extractYamlFrontMatter(content);

    let agentData: Partial<BmadAgent>;

    if (frontMatter) {
      agentData = parseYaml<Partial<BmadAgent>>(frontMatter);
    } else {
      // Try to extract YAML block from markdown
      const yamlBlock = extractYamlBlock(content);
      if (yamlBlock) {
        agentData = parseYaml<Partial<BmadAgent>>(yamlBlock);
      } else {
        throw new Error('No YAML data found in agent file');
      }
    }

    // Validate required fields
    if (!agentData.name || !agentData.role) {
      throw new Error('Agent must have name and role defined');
    }

    return {
      name: agentData.name,
      displayName: agentData.displayName || agentData.name,
      role: agentData.role,
      persona: agentData.persona || '',
      primaryDomain: agentData.primaryDomain || 'general',
      responsibilities: agentData.responsibilities || [],
      activationInstructions: agentData.activationInstructions || [],
      commands: agentData.commands || [],
      dependencies: agentData.dependencies || [],
      worksWith: agentData.worksWith,
      outputs: agentData.outputs,
      metadata: agentData.metadata,
    };
  } catch (error) {
    logger.error(`Failed to parse agent file: ${filePath}`, error);
    throw new Error(`Failed to parse agent file: ${filePath}`);
  }
}

/**
 * Parse task definition from markdown file
 */
export async function parseTaskFile(filePath: string): Promise<BmadTask> {
  try {
    const content = await readFile(filePath);
    const { yaml: frontMatter } = extractYamlFrontMatter(content);

    if (!frontMatter) {
      const yamlBlock = extractYamlBlock(content);
      if (!yamlBlock) {
        throw new Error('No YAML data found in task file');
      }
      return parseYaml<BmadTask>(yamlBlock);
    }

    return parseYaml<BmadTask>(frontMatter);
  } catch (error) {
    logger.error(`Failed to parse task file: ${filePath}`, error);
    throw new Error(`Failed to parse task file: ${filePath}`);
  }
}

/**
 * Parse template definition from YAML file
 */
export async function parseTemplateFile(filePath: string): Promise<BmadTemplate> {
  try {
    const content = await readFile(filePath);
    return parseYaml<BmadTemplate>(content);
  } catch (error) {
    logger.error(`Failed to parse template file: ${filePath}`, error);
    throw new Error(`Failed to parse template file: ${filePath}`);
  }
}

/**
 * Parse workflow definition from YAML file
 */
export async function parseWorkflowFile(filePath: string): Promise<BmadWorkflow> {
  try {
    const content = await readFile(filePath);
    return parseYaml<BmadWorkflow>(content);
  } catch (error) {
    logger.error(`Failed to parse workflow file: ${filePath}`, error);
    throw new Error(`Failed to parse workflow file: ${filePath}`);
  }
}

/**
 * Parse checklist definition from markdown file
 */
export async function parseChecklistFile(filePath: string): Promise<BmadChecklist> {
  try {
    const content = await readFile(filePath);
    const { yaml: frontMatter } = extractYamlFrontMatter(content);

    if (!frontMatter) {
      const yamlBlock = extractYamlBlock(content);
      if (!yamlBlock) {
        throw new Error('No YAML data found in checklist file');
      }
      return parseYaml<BmadChecklist>(yamlBlock);
    }

    return parseYaml<BmadChecklist>(frontMatter);
  } catch (error) {
    logger.error(`Failed to parse checklist file: ${filePath}`, error);
    throw new Error(`Failed to parse checklist file: ${filePath}`);
  }
}

/**
 * Safe YAML parse with error handling
 */
export function safeParseYaml<T = unknown>(content: string, defaultValue: T): T {
  try {
    return parseYaml<T>(content);
  } catch {
    return defaultValue;
  }
}

/**
 * Validate YAML structure
 */
export function validateYamlStructure(content: string): { valid: boolean; error?: string } {
  try {
    parseYaml(content);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown YAML error',
    };
  }
}

/**
 * Merge YAML objects deeply
 */
export function mergeYamlObjects<T extends Record<string, unknown>>(base: T, override: Partial<T>): T {
  const result = { ...base };

  for (const key in override) {
    const overrideValue = override[key];
    const baseValue = base[key];

    if (
      overrideValue &&
      typeof overrideValue === 'object' &&
      !Array.isArray(overrideValue) &&
      baseValue &&
      typeof baseValue === 'object' &&
      !Array.isArray(baseValue)
    ) {
      result[key] = mergeYamlObjects(
        baseValue as Record<string, unknown>,
        overrideValue as Record<string, unknown>
      ) as T[Extract<keyof T, string>];
    } else {
      result[key] = overrideValue as T[Extract<keyof T, string>];
    }
  }

  return result;
}
