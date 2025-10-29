/**
 * BMAD-METHOD Type Definitions
 * Comprehensive types for the BMAD framework components
 */

export interface BmadAgent {
  name: string;
  displayName: string;
  role: string;
  persona: string;
  primaryDomain: string;
  responsibilities: string[];
  activationInstructions: string[];
  commands: BmadCommand[];
  dependencies: BmadDependency[];
  worksWith?: string[];
  outputs?: string[];
  metadata?: {
    version?: string;
    category?: string;
    tags?: string[];
  };
}

export interface BmadCommand {
  name: string;
  description: string;
  syntax: string;
  example?: string;
  parameters?: CommandParameter[];
}

export interface CommandParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  default?: string | number | boolean;
}

export interface BmadDependency {
  type: 'task' | 'template' | 'checklist' | 'data' | 'workflow';
  name: string;
  path?: string;
  required: boolean;
}

export interface BmadTask {
  name: string;
  description: string;
  agents: string[];
  inputs?: TaskInput[];
  steps: TaskStep[];
  outputs?: TaskOutput[];
  validation?: string[];
  examples?: string[];
}

export interface TaskInput {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

export interface TaskStep {
  order: number;
  description: string;
  action: string;
  validation?: string;
}

export interface TaskOutput {
  name: string;
  type: string;
  description: string;
  location?: string;
}

export interface BmadTemplate {
  name: string;
  description: string;
  type: string;
  sections: TemplateSection[];
  variables?: TemplateVariable[];
  llmInstructions?: string[];
  validation?: string[];
}

export interface TemplateSection {
  name: string;
  title: string;
  description?: string;
  content?: string;
  subsections?: TemplateSection[];
  required: boolean;
}

export interface TemplateVariable {
  name: string;
  type: string;
  description: string;
  default?: string;
  required: boolean;
}

export interface BmadWorkflow {
  name: string;
  description: string;
  type: 'greenfield' | 'brownfield' | 'maintenance';
  phases: WorkflowPhase[];
  metadata?: {
    estimatedDuration?: string;
    complexity?: 'low' | 'medium' | 'high';
    prerequisites?: string[];
  };
}

export interface WorkflowPhase {
  name: string;
  description: string;
  agent: string;
  tasks: string[];
  deliverables: string[];
  nextPhase?: string;
  conditions?: string[];
}

export interface BmadChecklist {
  name: string;
  description: string;
  type: string;
  agent: string;
  items: ChecklistItem[];
  severity?: 'critical' | 'high' | 'medium' | 'low';
}

export interface ChecklistItem {
  id: string;
  description: string;
  category: string;
  validation: string;
  autoFixable: boolean;
  required: boolean;
}

export interface BmadTeam {
  name: string;
  description: string;
  agents: string[];
  workflow?: string;
  collaboration: TeamCollaboration[];
}

export interface TeamCollaboration {
  from: string;
  to: string;
  via: string;
  description: string;
}

export interface BmadExpansionPack {
  name: string;
  version: string;
  description: string;
  category: string;
  agents?: string[];
  templates?: string[];
  tasks?: string[];
  workflows?: string[];
  checklists?: string[];
  dependencies?: string[];
  author?: string;
  license?: string;
}

export interface BmadProject {
  name: string;
  path: string;
  bmadVersion: string;
  installedDate: string;
  ideType: 'cursor' | 'vscode' | 'claude-code' | 'windsurf' | 'other';
  expansionPacks?: string[];
  documents?: ProjectDocument[];
  stories?: UserStory[];
  currentPhase?: string;
  currentAgent?: string;
}

export interface ProjectDocument {
  type: string;
  path: string;
  createdDate: string;
  lastModified: string;
  author?: string;
  status?: 'draft' | 'review' | 'approved' | 'archived';
  sharded?: boolean;
  shards?: string[];
}

export interface UserStory {
  id: string;
  epic: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  tasks: StoryTask[];
  status: 'todo' | 'in-progress' | 'done' | 'blocked';
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedEffort?: string;
  actualEffort?: string;
}

export interface StoryTask {
  id: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  assignedTo?: string;
}

export interface BmadKnowledgeBase {
  concepts: KnowledgeSection[];
  patterns: KnowledgeSection[];
  bestPractices: KnowledgeSection[];
  examples: KnowledgeSection[];
  glossary: GlossaryEntry[];
}

export interface KnowledgeSection {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  relatedTopics?: string[];
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  context?: string;
  relatedTerms?: string[];
}

export interface BuildOptions {
  targets: ('agents' | 'teams' | 'expansion-packs' | 'all')[];
  outputDir?: string;
  minify?: boolean;
  includeMetadata?: boolean;
}

export interface BuildResult {
  success: boolean;
  outputFiles: string[];
  errors?: string[];
  warnings?: string[];
  buildTime: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  target: string;
}

export interface ValidationError {
  code: string;
  message: string;
  location?: string;
  severity: 'error' | 'critical';
}

export interface ValidationWarning {
  code: string;
  message: string;
  location?: string;
  suggestion?: string;
}

export interface ShardingOptions {
  maxTokensPerShard: number;
  preserveStructure: boolean;
  overlapLines?: number;
  outputDir?: string;
}

export interface ShardedDocument {
  originalPath: string;
  shardCount: number;
  shards: DocumentShard[];
  metadata: {
    totalTokens: number;
    createdDate: string;
    preservedStructure: boolean;
  };
}

export interface DocumentShard {
  index: number;
  filePath: string;
  tokenCount: number;
  startLine: number;
  endLine: number;
  content: string;
  context?: string;
}

export interface InstallOptions {
  projectPath: string;
  ideType: 'cursor' | 'vscode' | 'claude-code' | 'windsurf' | 'auto-detect';
  expansionPacks?: string[];
  skipGitCheck?: boolean;
  forceOverwrite?: boolean;
}

export interface InstallResult {
  success: boolean;
  installedPath: string;
  ideConfig?: string;
  expansionPacks?: string[];
  message: string;
}

export interface ProjectStatus {
  phase: string;
  currentAgent?: string;
  completedPhases: string[];
  documents: {
    total: number;
    byType: Record<string, number>;
    approved: number;
  };
  stories: {
    total: number;
    completed: number;
    inProgress: number;
    blocked: number;
  };
  metrics?: {
    velocity?: number;
    quality?: number;
    coverage?: number;
  };
}

export type AgentCategory = 'planning' | 'development' | 'quality' | 'orchestration' | 'all';
export type TemplateCategory = 'planning' | 'development' | 'quality' | 'documentation' | 'all';
export type WorkflowType = 'greenfield' | 'brownfield' | 'maintenance' | 'all';
