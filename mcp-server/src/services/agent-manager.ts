/**
 * Agent Manager Service
 * Handles agent activation, dependency resolution, and context building
 */

import path from 'path';
import { bmadCoreService } from './bmad-core.js';
import { createLogger } from '../utils/logger.js';
import { readFile } from '../utils/file-utils.js';
import { estimateTokens } from '../utils/token-estimator.js';
import type { BmadAgent, BmadAgentActivationData, AgentCategory } from '../types/bmad.js';

const logger = createLogger('AgentManager');

export class AgentManager {
  /**
   * Get all agents with optional filtering
   */
  async listAgents(
    includeExpansionPacks = false,
    category?: AgentCategory
  ): Promise<BmadAgent[]> {
    const agents = await bmadCoreService.getAgents(includeExpansionPacks);

    if (!category || category === 'all') {
      return agents;
    }

    return agents.filter((agent) => this.matchesCategory(agent, category));
  }

  /**
   * Get a specific agent with full details
   */
  async getAgent(agentName: string, includeDependencies = false): Promise<BmadAgent | null> {
    const agent = await bmadCoreService.getAgent(agentName);

    if (!agent) {
      return null;
    }

    if (includeDependencies) {
      // Dependencies are already part of the agent object
      // We just need to ensure they're loaded
      await this.loadDependencies(agent);
    }

    return agent;
  }

  /**
   * Activate an agent with full context
   */
  async activateAgent(
    agentName: string,
    projectPath?: string,
    initialCommand?: string
  ): Promise<BmadAgentActivationData> {
    const agent = await bmadCoreService.getAgent(agentName);

    if (!agent) {
      throw new Error(`Agent not found: ${agentName}`);
    }

    // Load all dependencies
    const dependencies = await this.loadDependencies(agent);

    // Build activation prompt
    const activationPrompt = this.buildActivationPrompt(agent, projectPath, initialCommand);

    // Calculate token estimate
    const tokenEstimate = estimateTokens(activationPrompt);
    logger.info(`Agent ${agentName} activated (${tokenEstimate} tokens)`);

    return {
      agent,
      dependencies,
      activationPrompt,
    };
  }

  /**
   * Load agent dependencies (tasks, templates, checklists, data)
   */
  private async loadDependencies(agent: BmadAgent) {
    const dependencies: BmadAgentActivationData['dependencies'] = {
      tasks: [],
      templates: [],
      checklists: [],
      data: {},
    };

    if (!agent.dependencies || agent.dependencies.length === 0) {
      return dependencies;
    }

    for (const dep of agent.dependencies) {
      try {
        switch (dep.type) {
          case 'task':
            {
              const task = await bmadCoreService.getTask(dep.name);
              if (task) {
                dependencies.tasks?.push(task);
              }
            }
            break;

          case 'template':
            {
              const template = await bmadCoreService.getTemplate(dep.name);
              if (template) {
                dependencies.templates?.push(template);
              }
            }
            break;

          case 'checklist':
            {
              const checklist = await bmadCoreService.getChecklist(dep.name);
              if (checklist) {
                dependencies.checklists?.push(checklist);
              }
            }
            break;

          case 'data':
            {
              // Load data file content
              const dataPath = path.join(bmadCoreService['bmadCorePath'], 'data', `${dep.name}.md`);
              try {
                const content = await readFile(dataPath);
                if (!dependencies.data) dependencies.data = {};
                dependencies.data[dep.name] = content;
              } catch {
                logger.warn(`Data file not found: ${dep.name}`);
              }
            }
            break;

          case 'workflow':
            {
              const workflow = await bmadCoreService.getWorkflow(dep.name);
              if (workflow && dependencies.data) {
                dependencies.data[`workflow-${dep.name}`] = workflow;
              }
            }
            break;
        }
      } catch (error) {
        if (dep.required) {
          throw new Error(`Required dependency not found: ${dep.name}`);
        }
        logger.warn(`Optional dependency not found: ${dep.name}`, error);
      }
    }

    return dependencies;
  }

  /**
   * Build activation prompt for agent
   */
  private buildActivationPrompt(
    agent: BmadAgent,
    projectPath?: string,
    initialCommand?: string
  ): string {
    const sections: string[] = [];

    // Agent header
    sections.push(`# ${agent.displayName || agent.name}`);
    sections.push(`**Role:** ${agent.role}`);
    sections.push('');

    // Persona
    if (agent.persona) {
      sections.push('## Persona');
      sections.push(agent.persona);
      sections.push('');
    }

    // Responsibilities
    if (agent.responsibilities && agent.responsibilities.length > 0) {
      sections.push('## Responsibilities');
      agent.responsibilities.forEach((resp) => {
        sections.push(`- ${resp}`);
      });
      sections.push('');
    }

    // Activation Instructions
    if (agent.activationInstructions && agent.activationInstructions.length > 0) {
      sections.push('## Activation Instructions');
      agent.activationInstructions.forEach((inst, i) => {
        sections.push(`${i + 1}. ${inst}`);
      });
      sections.push('');
    }

    // Available Commands
    if (agent.commands && agent.commands.length > 0) {
      sections.push('## Available Commands');
      agent.commands.forEach((cmd) => {
        sections.push(`### ${cmd.name}`);
        sections.push(cmd.description);
        sections.push(`**Syntax:** \`${cmd.syntax}\``);
        if (cmd.example) {
          sections.push(`**Example:** \`${cmd.example}\``);
        }
        sections.push('');
      });
    }

    // Project Context
    if (projectPath) {
      sections.push('## Project Context');
      sections.push(`Working in project: ${projectPath}`);
      sections.push('');
    }

    // Initial Command
    if (initialCommand) {
      sections.push('## Initial Task');
      sections.push(`Execute command: ${initialCommand}`);
      sections.push('');
    }

    // Dependencies Info
    if (agent.dependencies && agent.dependencies.length > 0) {
      sections.push('## Dependencies Available');
      const taskDeps = agent.dependencies.filter((d) => d.type === 'task');
      const templateDeps = agent.dependencies.filter((d) => d.type === 'template');
      const checklistDeps = agent.dependencies.filter((d) => d.type === 'checklist');

      if (taskDeps.length > 0) {
        sections.push('**Tasks:** ' + taskDeps.map((d) => d.name).join(', '));
      }
      if (templateDeps.length > 0) {
        sections.push('**Templates:** ' + templateDeps.map((d) => d.name).join(', '));
      }
      if (checklistDeps.length > 0) {
        sections.push('**Checklists:** ' + checklistDeps.map((d) => d.name).join(', '));
      }
      sections.push('');
    }

    // Collaboration
    if (agent.worksWith && agent.worksWith.length > 0) {
      sections.push('## Collaborates With');
      agent.worksWith.forEach((collaborator) => {
        sections.push(`- ${collaborator}`);
      });
      sections.push('');
    }

    return sections.join('\n');
  }

  /**
   * Match agent to category
   */
  private matchesCategory(agent: BmadAgent, category: AgentCategory): boolean {
    const categoryKeywords: Record<AgentCategory, string[]> = {
      planning: ['analyst', 'pm', 'architect', 'ux', 'po'],
      development: ['dev', 'developer', 'engineer'],
      quality: ['qa', 'quality', 'test'],
      orchestration: ['orchestrator', 'master', 'scrum'],
      all: [],
    };

    const keywords = categoryKeywords[category] || [];
    const agentNameLower = agent.name.toLowerCase();
    const agentRoleLower = agent.role.toLowerCase();

    return keywords.some(
      (keyword) => agentNameLower.includes(keyword) || agentRoleLower.includes(keyword)
    );
  }

  /**
   * Get agent summary for listing
   */
  getAgentSummary(agent: BmadAgent) {
    return {
      name: agent.name,
      displayName: agent.displayName,
      role: agent.role,
      primaryDomain: agent.primaryDomain,
      commandCount: agent.commands?.length || 0,
      dependencyCount: agent.dependencies?.length || 0,
      category: this.inferCategory(agent),
    };
  }

  /**
   * Infer category from agent
   */
  private inferCategory(agent: BmadAgent): string {
    const categories: AgentCategory[] = ['planning', 'development', 'quality', 'orchestration'];

    for (const category of categories) {
      if (this.matchesCategory(agent, category)) {
        return category;
      }
    }

    return 'general';
  }
}

export const agentManager = new AgentManager();
