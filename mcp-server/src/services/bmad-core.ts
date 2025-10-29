/**
 * Core BMAD service - interfaces with bmad-core system
 */

import path from 'path';
import {
  getBmadCorePath,
  getProjectBmadPath,
  isProjectBmadInstalled,
  pathExists,
  listFiles,
  findFiles,
} from '../utils/file-utils.js';
import {
  parseAgentFile,
  parseTaskFile,
  parseTemplateFile,
  parseWorkflowFile,
  parseChecklistFile,
} from '../utils/yaml-parser.js';
import { createLogger } from '../utils/logger.js';
import type {
  BmadAgent,
  BmadTask,
  BmadTemplate,
  BmadWorkflow,
  BmadChecklist,
  BmadTeam,
  BmadExpansionPack,
} from '../types/bmad.js';

const logger = createLogger('BmadCore');

export class BmadCoreService {
  private bmadCorePath: string;
  private agentsCache: Map<string, BmadAgent> = new Map();
  private tasksCache: Map<string, BmadTask> = new Map();
  private templatesCache: Map<string, BmadTemplate> = new Map();
  private workflowsCache: Map<string, BmadWorkflow> = new Map();
  private checklistsCache: Map<string, BmadChecklist> = new Map();

  constructor(corePath?: string) {
    this.bmadCorePath = corePath || getBmadCorePath();
    logger.info(`BMAD Core Path: ${this.bmadCorePath}`);
  }

  /**
   * Initialize the service and verify core path exists
   */
  async initialize(): Promise<boolean> {
    const exists = await pathExists(this.bmadCorePath);
    if (!exists) {
      logger.error(`BMAD core not found at: ${this.bmadCorePath}`);
      return false;
    }

    logger.info('BMAD Core Service initialized successfully');
    return true;
  }

  /**
   * Get all agents
   */
  async getAgents(includeExpansionPacks = false): Promise<BmadAgent[]> {
    const agents: BmadAgent[] = [];

    // Load core agents
    const agentsPath = path.join(this.bmadCorePath, 'agents');
    const agentFiles = await findFiles('*.md', agentsPath);

    for (const file of agentFiles) {
      try {
        const agent = await this.getAgent(path.basename(file, '.md'));
        if (agent) {
          agents.push(agent);
        }
      } catch (error) {
        logger.warn(`Failed to load agent: ${file}`, error);
      }
    }

    // Load expansion pack agents if requested
    if (includeExpansionPacks) {
      const expansionAgents = await this.getExpansionPackAgents();
      agents.push(...expansionAgents);
    }

    return agents;
  }

  /**
   * Get a specific agent by name
   */
  async getAgent(agentName: string): Promise<BmadAgent | null> {
    // Check cache first
    if (this.agentsCache.has(agentName)) {
      return this.agentsCache.get(agentName)!;
    }

    // Try loading from core
    const agentFile = path.join(this.bmadCorePath, 'agents', `${agentName}.md`);
    if (await pathExists(agentFile)) {
      const agent = await parseAgentFile(agentFile);
      this.agentsCache.set(agentName, agent);
      return agent;
    }

    // Try loading from expansion packs
    const expansionAgent = await this.findAgentInExpansionPacks(agentName);
    if (expansionAgent) {
      this.agentsCache.set(agentName, expansionAgent);
      return expansionAgent;
    }

    logger.warn(`Agent not found: ${agentName}`);
    return null;
  }

  /**
   * Get all tasks
   */
  async getTasks(): Promise<BmadTask[]> {
    const tasks: BmadTask[] = [];
    const tasksPath = path.join(this.bmadCorePath, 'tasks');

    if (!(await pathExists(tasksPath))) {
      return tasks;
    }

    const taskFiles = await findFiles('*.md', tasksPath);

    for (const file of taskFiles) {
      try {
        const taskName = path.basename(file, '.md');
        const task = await this.getTask(taskName);
        if (task) {
          tasks.push(task);
        }
      } catch (error) {
        logger.warn(`Failed to load task: ${file}`, error);
      }
    }

    return tasks;
  }

  /**
   * Get a specific task by name
   */
  async getTask(taskName: string): Promise<BmadTask | null> {
    if (this.tasksCache.has(taskName)) {
      return this.tasksCache.get(taskName)!;
    }

    const taskFile = path.join(this.bmadCorePath, 'tasks', `${taskName}.md`);
    if (await pathExists(taskFile)) {
      const task = await parseTaskFile(taskFile);
      this.tasksCache.set(taskName, task);
      return task;
    }

    logger.warn(`Task not found: ${taskName}`);
    return null;
  }

  /**
   * Get all templates
   */
  async getTemplates(): Promise<BmadTemplate[]> {
    const templates: BmadTemplate[] = [];
    const templatesPath = path.join(this.bmadCorePath, 'templates');

    if (!(await pathExists(templatesPath))) {
      return templates;
    }

    const templateFiles = await findFiles('*.yaml', templatesPath);

    for (const file of templateFiles) {
      try {
        const templateName = path.basename(file, '.yaml');
        const template = await this.getTemplate(templateName);
        if (template) {
          templates.push(template);
        }
      } catch (error) {
        logger.warn(`Failed to load template: ${file}`, error);
      }
    }

    return templates;
  }

  /**
   * Get a specific template by name
   */
  async getTemplate(templateName: string): Promise<BmadTemplate | null> {
    if (this.templatesCache.has(templateName)) {
      return this.templatesCache.get(templateName)!;
    }

    const templateFile = path.join(this.bmadCorePath, 'templates', `${templateName}.yaml`);
    if (await pathExists(templateFile)) {
      const template = await parseTemplateFile(templateFile);
      this.templatesCache.set(templateName, template);
      return template;
    }

    logger.warn(`Template not found: ${templateName}`);
    return null;
  }

  /**
   * Get all workflows
   */
  async getWorkflows(): Promise<BmadWorkflow[]> {
    const workflows: BmadWorkflow[] = [];
    const workflowsPath = path.join(this.bmadCorePath, 'workflows');

    if (!(await pathExists(workflowsPath))) {
      return workflows;
    }

    const workflowFiles = await findFiles('*.yaml', workflowsPath);

    for (const file of workflowFiles) {
      try {
        const workflowName = path.basename(file, '.yaml');
        const workflow = await this.getWorkflow(workflowName);
        if (workflow) {
          workflows.push(workflow);
        }
      } catch (error) {
        logger.warn(`Failed to load workflow: ${file}`, error);
      }
    }

    return workflows;
  }

  /**
   * Get a specific workflow by name
   */
  async getWorkflow(workflowName: string): Promise<BmadWorkflow | null> {
    if (this.workflowsCache.has(workflowName)) {
      return this.workflowsCache.get(workflowName)!;
    }

    const workflowFile = path.join(this.bmadCorePath, 'workflows', `${workflowName}.yaml`);
    if (await pathExists(workflowFile)) {
      const workflow = await parseWorkflowFile(workflowFile);
      this.workflowsCache.set(workflowName, workflow);
      return workflow;
    }

    logger.warn(`Workflow not found: ${workflowName}`);
    return null;
  }

  /**
   * Get all checklists
   */
  async getChecklists(): Promise<BmadChecklist[]> {
    const checklists: BmadChecklist[] = [];
    const checklistsPath = path.join(this.bmadCorePath, 'checklists');

    if (!(await pathExists(checklistsPath))) {
      return checklists;
    }

    const checklistFiles = await findFiles('*.md', checklistsPath);

    for (const file of checklistFiles) {
      try {
        const checklistName = path.basename(file, '.md');
        const checklist = await this.getChecklist(checklistName);
        if (checklist) {
          checklists.push(checklist);
        }
      } catch (error) {
        logger.warn(`Failed to load checklist: ${file}`, error);
      }
    }

    return checklists;
  }

  /**
   * Get a specific checklist by name
   */
  async getChecklist(checklistName: string): Promise<BmadChecklist | null> {
    if (this.checklistsCache.has(checklistName)) {
      return this.checklistsCache.get(checklistName)!;
    }

    const checklistFile = path.join(this.bmadCorePath, 'checklists', `${checklistName}.md`);
    if (await pathExists(checklistFile)) {
      const checklist = await parseChecklistFile(checklistFile);
      this.checklistsCache.set(checklistName, checklist);
      return checklist;
    }

    logger.warn(`Checklist not found: ${checklistName}`);
    return null;
  }

  /**
   * Get all teams
   */
  async getTeams(): Promise<BmadTeam[]> {
    const teams: BmadTeam[] = [];
    const teamsPath = path.join(this.bmadCorePath, 'agent-teams');

    if (!(await pathExists(teamsPath))) {
      return teams;
    }

    const teamFiles = await findFiles('*.yaml', teamsPath);

    for (const file of teamFiles) {
      try {
        const team = await parseTemplateFile(file) as unknown as BmadTeam;
        teams.push(team);
      } catch (error) {
        logger.warn(`Failed to load team: ${file}`, error);
      }
    }

    return teams;
  }

  /**
   * Get expansion packs
   */
  async getExpansionPacks(): Promise<BmadExpansionPack[]> {
    const packs: BmadExpansionPack[] = [];
    const expansionPacksPath = path.join(this.bmadCorePath, '../expansion-packs');

    if (!(await pathExists(expansionPacksPath))) {
      return packs;
    }

    const packDirs = await findFiles('*/package.json', expansionPacksPath);

    for (const packFile of packDirs) {
      try {
        const packDir = path.dirname(packFile);
        const packName = path.basename(packDir);

        // Try to load pack metadata
        const metadataFile = path.join(packDir, 'pack-metadata.yaml');
        if (await pathExists(metadataFile)) {
          const metadata = await parseTemplateFile(metadataFile) as unknown as BmadExpansionPack;
          packs.push(metadata);
        } else {
          // Create basic pack info
          packs.push({
            name: packName,
            version: '1.0.0',
            description: `BMAD expansion pack: ${packName}`,
            category: 'general',
          });
        }
      } catch (error) {
        logger.warn(`Failed to load expansion pack: ${packFile}`, error);
      }
    }

    return packs;
  }

  /**
   * Check if project has BMAD installed
   */
  async isProjectInitialized(projectPath: string): Promise<boolean> {
    return await isProjectBmadInstalled(projectPath);
  }

  /**
   * Get knowledge base content
   */
  async getKnowledgeBase(): Promise<string> {
    const kbFile = path.join(this.bmadCorePath, 'data', 'bmad-kb.md');
    if (await pathExists(kbFile)) {
      const { readFile } = await import('../utils/file-utils.js');
      return await readFile(kbFile);
    }
    return '';
  }

  /**
   * Clear all caches
   */
  clearCaches(): void {
    this.agentsCache.clear();
    this.tasksCache.clear();
    this.templatesCache.clear();
    this.workflowsCache.clear();
    this.checklistsCache.clear();
    logger.debug('All caches cleared');
  }

  /**
   * Helper: Find agent in expansion packs
   */
  private async findAgentInExpansionPacks(agentName: string): Promise<BmadAgent | null> {
    const expansionPacksPath = path.join(this.bmadCorePath, '../expansion-packs');
    if (!(await pathExists(expansionPacksPath))) {
      return null;
    }

    const agentFiles = await findFiles(`*/agents/${agentName}.md`, expansionPacksPath);
    if (agentFiles.length > 0) {
      return await parseAgentFile(agentFiles[0]);
    }

    return null;
  }

  /**
   * Helper: Get all agents from expansion packs
   */
  private async getExpansionPackAgents(): Promise<BmadAgent[]> {
    const agents: BmadAgent[] = [];
    const expansionPacksPath = path.join(this.bmadCorePath, '../expansion-packs');

    if (!(await pathExists(expansionPacksPath))) {
      return agents;
    }

    const agentFiles = await findFiles('*/agents/*.md', expansionPacksPath);

    for (const file of agentFiles) {
      try {
        const agent = await parseAgentFile(file);
        agents.push(agent);
      } catch (error) {
        logger.warn(`Failed to load expansion pack agent: ${file}`, error);
      }
    }

    return agents;
  }
}

// Export singleton instance
export const bmadCoreService = new BmadCoreService();
