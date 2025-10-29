/**
 * File system utilities for BMAD MCP Server
 */

import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import { createLogger } from './logger.js';

const logger = createLogger('FileUtils');

/**
 * Check if a path exists
 */
export async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read file content as string
 */
export async function readFile(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    logger.error(`Failed to read file: ${filePath}`, error);
    throw new Error(`Failed to read file: ${filePath}`);
  }
}

/**
 * Write content to file
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
  try {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf-8');
    logger.debug(`File written: ${filePath}`);
  } catch (error) {
    logger.error(`Failed to write file: ${filePath}`, error);
    throw new Error(`Failed to write file: ${filePath}`);
  }
}

/**
 * Copy file or directory
 */
export async function copy(src: string, dest: string): Promise<void> {
  try {
    await fs.copy(src, dest, { overwrite: true });
    logger.debug(`Copied: ${src} -> ${dest}`);
  } catch (error) {
    logger.error(`Failed to copy: ${src} -> ${dest}`, error);
    throw new Error(`Failed to copy: ${src} -> ${dest}`);
  }
}

/**
 * Find files matching a glob pattern
 */
export async function findFiles(pattern: string, cwd?: string): Promise<string[]> {
  try {
    const files = await glob(pattern, {
      cwd: cwd || process.cwd(),
      absolute: true,
      nodir: true,
    });
    return files;
  } catch (error) {
    logger.error(`Failed to find files with pattern: ${pattern}`, error);
    throw new Error(`Failed to find files with pattern: ${pattern}`);
  }
}

/**
 * Find directories matching a glob pattern
 */
export async function findDirectories(pattern: string, cwd?: string): Promise<string[]> {
  try {
    const dirs = await glob(pattern, {
      cwd: cwd || process.cwd(),
      absolute: true,
      nodir: false,
    });

    // Filter to only directories
    const dirResults = await Promise.all(
      dirs.map(async (dir) => {
        const stat = await fs.stat(dir);
        return stat.isDirectory() ? dir : null;
      })
    );

    return dirResults.filter((dir): dir is string => dir !== null);
  } catch (error) {
    logger.error(`Failed to find directories with pattern: ${pattern}`, error);
    throw new Error(`Failed to find directories with pattern: ${pattern}`);
  }
}

/**
 * Read all markdown files in a directory
 */
export async function readMarkdownFiles(dir: string): Promise<Map<string, string>> {
  const files = await findFiles('**/*.md', dir);
  const contents = new Map<string, string>();

  for (const file of files) {
    const content = await readFile(file);
    const relativePath = path.relative(dir, file);
    contents.set(relativePath, content);
  }

  return contents;
}

/**
 * Get file stats
 */
export async function getFileStats(filePath: string): Promise<fs.Stats | null> {
  try {
    return await fs.stat(filePath);
  } catch {
    return null;
  }
}

/**
 * Ensure directory exists
 */
export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

/**
 * Remove file or directory
 */
export async function remove(targetPath: string): Promise<void> {
  try {
    await fs.remove(targetPath);
    logger.debug(`Removed: ${targetPath}`);
  } catch (error) {
    logger.error(`Failed to remove: ${targetPath}`, error);
    throw new Error(`Failed to remove: ${targetPath}`);
  }
}

/**
 * List files in directory
 */
export async function listFiles(dirPath: string, recursive = false): Promise<string[]> {
  try {
    if (recursive) {
      return await findFiles('**/*', dirPath);
    }

    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => path.join(dirPath, entry.name));
  } catch (error) {
    logger.error(`Failed to list files in: ${dirPath}`, error);
    throw new Error(`Failed to list files in: ${dirPath}`);
  }
}

/**
 * List directories in directory
 */
export async function listDirectories(dirPath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(dirPath, entry.name));
  } catch (error) {
    logger.error(`Failed to list directories in: ${dirPath}`, error);
    throw new Error(`Failed to list directories in: ${dirPath}`);
  }
}

/**
 * Get BMAD core path
 */
export function getBmadCorePath(): string {
  // Try environment variable first
  if (process.env.BMAD_CORE_PATH) {
    return process.env.BMAD_CORE_PATH;
  }

  // Default to relative path from mcp-server
  return path.resolve(__dirname, '../../../bmad-core');
}

/**
 * Get project BMAD path
 */
export function getProjectBmadPath(projectPath: string): string {
  return path.join(projectPath, '.bmad-core');
}

/**
 * Check if project has BMAD installed
 */
export async function isProjectBmadInstalled(projectPath: string): Promise<boolean> {
  const bmadPath = getProjectBmadPath(projectPath);
  return await pathExists(bmadPath);
}

/**
 * Read JSON file
 */
export async function readJson<T = unknown>(filePath: string): Promise<T> {
  try {
    const content = await readFile(filePath);
    return JSON.parse(content) as T;
  } catch (error) {
    logger.error(`Failed to read JSON file: ${filePath}`, error);
    throw new Error(`Failed to read JSON file: ${filePath}`);
  }
}

/**
 * Write JSON file
 */
export async function writeJson(
  filePath: string,
  data: unknown,
  pretty = true
): Promise<void> {
  const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  await writeFile(filePath, content);
}

/**
 * Get file extension
 */
export function getFileExtension(filePath: string): string {
  return path.extname(filePath).toLowerCase();
}

/**
 * Get filename without extension
 */
export function getFileNameWithoutExt(filePath: string): string {
  return path.basename(filePath, path.extname(filePath));
}

/**
 * Resolve path relative to BMAD core
 */
export function resolveBmadPath(...segments: string[]): string {
  return path.join(getBmadCorePath(), ...segments);
}

/**
 * Count lines in file
 */
export async function countLines(filePath: string): Promise<number> {
  const content = await readFile(filePath);
  return content.split('\n').length;
}

/**
 * Get file size in bytes
 */
export async function getFileSize(filePath: string): Promise<number> {
  const stats = await getFileStats(filePath);
  return stats?.size ?? 0;
}
