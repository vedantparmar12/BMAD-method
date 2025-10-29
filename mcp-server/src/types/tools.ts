/**
 * MCP Tool Types for BMAD-METHOD
 * Defines input and output types for all MCP tools
 */

import type {
  BmadAgent,
  BmadTask,
  BmadTemplate,
  BmadWorkflow,
  BmadChecklist,
  BmadTeam,
  BmadExpansionPack,
  ProjectStatus,
  UserStory,
  BuildOptions,
  BuildResult,
  ValidationResult,
  ShardingOptions,
  ShardedDocument,
  InstallOptions,
  InstallResult,
} from './bmad.js';

/**
 * Standard tool response wrapper
 */
export interface ToolResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ToolError;
  metadata?: ResponseMetadata;
}

export interface ToolError {
  code: string;
  message: string;
  details?: unknown;
  stack?: string;
}

export interface ResponseMetadata {
  timestamp: string;
  executionTime: number;
  warnings?: string[];
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ============================================================================
// Installation & Configuration Tools
// ============================================================================

export interface BmadInstallInput {
  projectPath: string;
  ideType?: 'cursor' | 'vscode' | 'claude-code' | 'windsurf' | 'auto-detect';
  expansionPacks?: string[];
  options?: {
    skipGitCheck?: boolean;
    forceOverwrite?: boolean;
  };
}

export interface BmadGetConfigInput {
  projectPath?: string;
}

export interface BmadConfigData {
  installed: boolean;
  bmadCorePath?: string;
  version?: string;
  ideType?: string;
  expansionPacks?: string[];
  lastUpdated?: string;
}

// ============================================================================
// Agent Management Tools
// ============================================================================

export interface BmadListAgentsInput {
  includeExpansionPacks?: boolean;
  category?: 'planning' | 'development' | 'quality' | 'orchestration' | 'all';
}

export interface BmadAgentListItem {
  name: string;
  displayName: string;
  role: string;
  category: string;
  source: 'core' | string; // 'core' or expansion pack name
}

export interface BmadGetAgentInput {
  agentName: string;
  includeDependencies?: boolean;
}

export interface BmadActivateAgentInput {
  agentName: string;
  projectPath?: string;
  initialCommand?: string;
}

export interface BmadAgentActivationData {
  agent: BmadAgent;
  dependencies?: {
    tasks?: BmadTask[];
    templates?: BmadTemplate[];
    checklists?: BmadChecklist[];
    data?: Record<string, unknown>;
  };
  activationPrompt: string;
}

// ============================================================================
// Build System Tools
// ============================================================================

export interface BmadBuildWebBundlesInput extends BuildOptions {}

export interface BmadValidateInput {
  target?: string;
  strict?: boolean;
}

// ============================================================================
// Document Management Tools
// ============================================================================

export interface BmadCreateDocumentInput {
  templateName: string;
  outputPath: string;
  variables?: Record<string, string | number | boolean>;
  projectContext?: string;
}

export interface BmadCreateDocumentData {
  documentPath: string;
  templateUsed: string;
  sections: string[];
}

export interface BmadShardDocumentInput extends ShardingOptions {
  documentPath: string;
}

export interface BmadListTemplatesInput {
  category?: 'planning' | 'development' | 'quality' | 'documentation' | 'all';
}

export interface BmadTemplateListItem {
  name: string;
  description: string;
  type: string;
  category: string;
  variables: string[];
}

// ============================================================================
// Task & Workflow Tools
// ============================================================================

export interface BmadListTasksInput {
  category?: string;
  agentFilter?: string;
}

export interface BmadTaskListItem {
  name: string;
  description: string;
  agents: string[];
  category: string;
}

export interface BmadExecuteTaskInput {
  taskName: string;
  agentContext?: string;
  parameters?: Record<string, unknown>;
  projectPath?: string;
}

export interface BmadTaskExecutionData {
  taskName: string;
  status: 'success' | 'failed' | 'partial';
  outputs: Record<string, unknown>;
  steps: {
    order: number;
    description: string;
    status: 'completed' | 'failed' | 'skipped';
    result?: string;
  }[];
}

export interface BmadGetWorkflowInput {
  workflowName: string;
  includeAgentDetails?: boolean;
}

export interface BmadListWorkflowsInput {
  projectType?: 'greenfield' | 'brownfield' | 'maintenance' | 'all';
}

export interface BmadWorkflowListItem {
  name: string;
  description: string;
  type: string;
  phases: number;
  estimatedDuration?: string;
}

// ============================================================================
// Knowledge Base Tools
// ============================================================================

export interface BmadQueryKbInput {
  query: string;
  section?: 'all' | 'concepts' | 'patterns' | 'best-practices' | 'examples';
  maxResults?: number;
}

export interface BmadKbSearchResult {
  id: string;
  title: string;
  content: string;
  category: string;
  relevance: number;
  tags: string[];
}

export interface BmadGetKbSectionInput {
  section: string;
}

// ============================================================================
// Team & Expansion Pack Tools
// ============================================================================

export interface BmadListTeamsInput {
  includeCustom?: boolean;
}

export interface BmadTeamListItem {
  name: string;
  description: string;
  agentCount: number;
  workflow?: string;
}

export interface BmadGetTeamInput {
  teamName: string;
  includeAgentDetails?: boolean;
}

export interface BmadListExpansionPacksInput {
  includeInstalled?: boolean;
  category?: string;
}

export interface BmadExpansionPackListItem {
  name: string;
  version: string;
  description: string;
  category: string;
  installed: boolean;
}

export interface BmadInstallExpansionPackInput {
  packName: string;
  projectPath?: string;
  merge?: boolean;
}

// ============================================================================
// Quality Assurance Tools
// ============================================================================

export interface BmadListChecklistsInput {
  category?: string;
  agentFilter?: string;
}

export interface BmadChecklistListItem {
  name: string;
  description: string;
  type: string;
  agent: string;
  itemCount: number;
}

export interface BmadExecuteChecklistInput {
  checklistName: string;
  targetPath: string;
  agentContext?: string;
  autoFix?: boolean;
}

export interface BmadChecklistExecutionData {
  checklistName: string;
  targetPath: string;
  totalItems: number;
  passedItems: number;
  failedItems: number;
  skippedItems: number;
  results: ChecklistItemResult[];
  autoFixApplied?: number;
}

export interface ChecklistItemResult {
  id: string;
  description: string;
  status: 'passed' | 'failed' | 'skipped' | 'warning';
  message?: string;
  location?: string;
  autoFixed?: boolean;
}

// ============================================================================
// Project Context Tools
// ============================================================================

export interface BmadGetProjectStatusInput {
  projectPath?: string;
  includeMetrics?: boolean;
}

export interface BmadGetNextStoryInput {
  projectPath?: string;
  epicFilter?: string;
  includeContext?: boolean;
}

export interface BmadNextStoryData {
  story: UserStory;
  context?: {
    relatedDocuments: string[];
    dependencies: string[];
    estimatedComplexity: string;
  };
  recommendations?: string[];
}

// ============================================================================
// Type Guards
// ============================================================================

export function isToolResponse<T>(value: unknown): value is ToolResponse<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    typeof (value as ToolResponse).success === 'boolean'
  );
}

export function isToolError(value: unknown): value is ToolError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'message' in value &&
    typeof (value as ToolError).code === 'string' &&
    typeof (value as ToolError).message === 'string'
  );
}

// ============================================================================
// Error Codes
// ============================================================================

export const ErrorCodes = {
  // General errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',

  // Installation errors
  INSTALL_FAILED: 'INSTALL_FAILED',
  IDE_NOT_DETECTED: 'IDE_NOT_DETECTED',
  INVALID_PROJECT_PATH: 'INVALID_PROJECT_PATH',

  // Agent errors
  AGENT_NOT_FOUND: 'AGENT_NOT_FOUND',
  AGENT_LOAD_FAILED: 'AGENT_LOAD_FAILED',
  DEPENDENCY_NOT_FOUND: 'DEPENDENCY_NOT_FOUND',
  ACTIVATION_FAILED: 'ACTIVATION_FAILED',

  // Build errors
  BUILD_FAILED: 'BUILD_FAILED',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  BUNDLE_GENERATION_FAILED: 'BUNDLE_GENERATION_FAILED',

  // Document errors
  TEMPLATE_NOT_FOUND: 'TEMPLATE_NOT_FOUND',
  DOCUMENT_CREATION_FAILED: 'DOCUMENT_CREATION_FAILED',
  SHARDING_FAILED: 'SHARDING_FAILED',
  INVALID_DOCUMENT: 'INVALID_DOCUMENT',

  // Task/Workflow errors
  TASK_NOT_FOUND: 'TASK_NOT_FOUND',
  TASK_EXECUTION_FAILED: 'TASK_EXECUTION_FAILED',
  WORKFLOW_NOT_FOUND: 'WORKFLOW_NOT_FOUND',
  WORKFLOW_EXECUTION_FAILED: 'WORKFLOW_EXECUTION_FAILED',

  // Project errors
  PROJECT_NOT_INITIALIZED: 'PROJECT_NOT_INITIALIZED',
  PROJECT_STATUS_UNAVAILABLE: 'PROJECT_STATUS_UNAVAILABLE',
  STORY_NOT_FOUND: 'STORY_NOT_FOUND',

  // Expansion pack errors
  EXPANSION_PACK_NOT_FOUND: 'EXPANSION_PACK_NOT_FOUND',
  EXPANSION_PACK_INSTALL_FAILED: 'EXPANSION_PACK_INSTALL_FAILED',

  // File system errors
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
  FILE_READ_ERROR: 'FILE_READ_ERROR',
  FILE_WRITE_ERROR: 'FILE_WRITE_ERROR',
  DIRECTORY_NOT_FOUND: 'DIRECTORY_NOT_FOUND',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
