/**
 * BMAD-METHOD MCP Server
 * Exposes BMAD framework capabilities through Model Context Protocol
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { bmadCoreService } from './services/bmad-core.js';
import { agentManager } from './services/agent-manager.js';
import { createLogger } from './utils/logger.js';
import { ErrorCodes, type ToolResponse } from './types/tools.js';

const logger = createLogger('McpServer');

export class BmadMcpServer {
  private server: Server;
  private tools: Map<string, Tool> = new Map();

  constructor() {
    this.server = new Server(
      {
        name: 'bmad-method',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    this.registerTools();
  }

  /**
   * Initialize the server
   */
  async initialize(): Promise<void> {
    logger.info('Initializing BMAD MCP Server...');

    const initialized = await bmadCoreService.initialize();
    if (!initialized) {
      throw new Error('Failed to initialize BMAD Core Service');
    }

    logger.info('BMAD MCP Server initialized successfully');
  }

  /**
   * Start the server
   */
  async start(): Promise<void> {
    await this.initialize();

    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    logger.info('BMAD MCP Server started and listening on stdio');
  }

  /**
   * Setup request handlers
   */
  private setupHandlers(): void {
    // List tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      logger.debug('Listing tools');
      return {
        tools: Array.from(this.tools.values()),
      };
    });

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      logger.info(`Tool called: ${name}`);
      logger.debug('Tool arguments:', args);

      try {
        const result = await this.executeTool(name, args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        logger.error(`Tool execution failed: ${name}`, error);

        const errorResponse: ToolResponse = {
          success: false,
          error: {
            code: ErrorCodes.UNKNOWN_ERROR,
            message: error instanceof Error ? error.message : 'Unknown error occurred',
            stack: error instanceof Error ? error.stack : undefined,
          },
          metadata: {
            timestamp: new Date().toISOString(),
            executionTime: 0,
          },
        };

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(errorResponse, null, 2),
            },
          ],
          isError: true,
        };
      }
    });

    // Error handler
    this.server.onerror = (error) => {
      logger.error('Server error:', error);
    };

    // Close handler
    process.on('SIGINT', async () => {
      logger.info('Shutting down BMAD MCP Server...');
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Register all MCP tools
   */
  private registerTools(): void {
    logger.debug('Registering tools...');

    // Agent Management Tools
    this.registerTool({
      name: 'bmad_list_agents',
      description: 'List all available BMAD agents with their roles and capabilities',
      inputSchema: {
        type: 'object',
        properties: {
          includeExpansionPacks: {
            type: 'boolean',
            description: 'Include agents from expansion packs',
            default: false,
          },
          category: {
            type: 'string',
            enum: ['planning', 'development', 'quality', 'orchestration', 'all'],
            description: 'Filter agents by category',
            default: 'all',
          },
        },
      },
    });

    this.registerTool({
      name: 'bmad_get_agent',
      description: 'Get detailed information about a specific agent',
      inputSchema: {
        type: 'object',
        properties: {
          agentName: {
            type: 'string',
            description: "Agent name (e.g., 'dev', 'sm', 'analyst')",
          },
          includeDependencies: {
            type: 'boolean',
            description: 'Include full dependency content',
            default: false,
          },
        },
        required: ['agentName'],
      },
    });

    this.registerTool({
      name: 'bmad_activate_agent',
      description: 'Activate a BMAD agent with full context and dependencies',
      inputSchema: {
        type: 'object',
        properties: {
          agentName: {
            type: 'string',
            description: 'Agent to activate',
          },
          projectPath: {
            type: 'string',
            description: 'Project context path (optional)',
          },
          initialCommand: {
            type: 'string',
            description: 'Command to execute after activation (optional)',
          },
        },
        required: ['agentName'],
      },
    });

    // Task Management Tools
    this.registerTool({
      name: 'bmad_list_tasks',
      description: 'List all available BMAD tasks',
      inputSchema: {
        type: 'object',
        properties: {
          agentFilter: {
            type: 'string',
            description: 'Filter tasks by agent (optional)',
          },
        },
      },
    });

    this.registerTool({
      name: 'bmad_get_task',
      description: 'Get detailed information about a specific task',
      inputSchema: {
        type: 'object',
        properties: {
          taskName: {
            type: 'string',
            description: 'Task name',
          },
        },
        required: ['taskName'],
      },
    });

    // Template Management Tools
    this.registerTool({
      name: 'bmad_list_templates',
      description: 'List all available document templates',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['planning', 'development', 'quality', 'documentation', 'all'],
            description: 'Filter templates by category',
            default: 'all',
          },
        },
      },
    });

    this.registerTool({
      name: 'bmad_get_template',
      description: 'Get a specific template definition',
      inputSchema: {
        type: 'object',
        properties: {
          templateName: {
            type: 'string',
            description: 'Template name',
          },
        },
        required: ['templateName'],
      },
    });

    // Workflow Management Tools
    this.registerTool({
      name: 'bmad_list_workflows',
      description: 'List all available project workflows',
      inputSchema: {
        type: 'object',
        properties: {
          projectType: {
            type: 'string',
            enum: ['greenfield', 'brownfield', 'maintenance', 'all'],
            description: 'Filter by project type',
            default: 'all',
          },
        },
      },
    });

    this.registerTool({
      name: 'bmad_get_workflow',
      description: 'Get a specific workflow definition',
      inputSchema: {
        type: 'object',
        properties: {
          workflowName: {
            type: 'string',
            description: 'Workflow name',
          },
          includeAgentDetails: {
            type: 'boolean',
            description: 'Include full agent details for each phase',
            default: false,
          },
        },
        required: ['workflowName'],
      },
    });

    // Knowledge Base Tools
    this.registerTool({
      name: 'bmad_get_kb',
      description: 'Get the complete BMAD knowledge base',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    });

    // Team Management Tools
    this.registerTool({
      name: 'bmad_list_teams',
      description: 'List all available agent teams',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    });

    // Expansion Pack Tools
    this.registerTool({
      name: 'bmad_list_expansion_packs',
      description: 'List all available expansion packs',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    });

    logger.info(`Registered ${this.tools.size} tools`);
  }

  /**
   * Register a single tool
   */
  private registerTool(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }

  /**
   * Execute a tool
   */
  private async executeTool(name: string, args: Record<string, unknown>): Promise<ToolResponse> {
    const startTime = Date.now();

    try {
      let data: unknown;

      switch (name) {
        // Agent tools
        case 'bmad_list_agents':
          data = await this.handleListAgents(args);
          break;

        case 'bmad_get_agent':
          data = await this.handleGetAgent(args);
          break;

        case 'bmad_activate_agent':
          data = await this.handleActivateAgent(args);
          break;

        // Task tools
        case 'bmad_list_tasks':
          data = await this.handleListTasks(args);
          break;

        case 'bmad_get_task':
          data = await this.handleGetTask(args);
          break;

        // Template tools
        case 'bmad_list_templates':
          data = await this.handleListTemplates(args);
          break;

        case 'bmad_get_template':
          data = await this.handleGetTemplate(args);
          break;

        // Workflow tools
        case 'bmad_list_workflows':
          data = await this.handleListWorkflows(args);
          break;

        case 'bmad_get_workflow':
          data = await this.handleGetWorkflow(args);
          break;

        // Knowledge base tools
        case 'bmad_get_kb':
          data = await this.handleGetKnowledgeBase(args);
          break;

        // Team tools
        case 'bmad_list_teams':
          data = await this.handleListTeams(args);
          break;

        // Expansion pack tools
        case 'bmad_list_expansion_packs':
          data = await this.handleListExpansionPacks(args);
          break;

        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      const executionTime = Date.now() - startTime;

      return {
        success: true,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          executionTime,
        },
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      return {
        success: false,
        error: {
          code: this.getErrorCode(error),
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error,
        },
        metadata: {
          timestamp: new Date().toISOString(),
          executionTime,
        },
      };
    }
  }

  // Tool handlers

  private async handleListAgents(args: Record<string, unknown>) {
    const includeExpansionPacks = (args.includeExpansionPacks as boolean) || false;
    const category = (args.category as string) || 'all';

    const agents = await agentManager.listAgents(includeExpansionPacks, category as any);

    return agents.map((agent) => agentManager.getAgentSummary(agent));
  }

  private async handleGetAgent(args: Record<string, unknown>) {
    const agentName = args.agentName as string;
    const includeDependencies = (args.includeDependencies as boolean) || false;

    if (!agentName) {
      throw new Error('agentName is required');
    }

    const agent = await agentManager.getAgent(agentName, includeDependencies);

    if (!agent) {
      throw new Error(`Agent not found: ${agentName}`);
    }

    return agent;
  }

  private async handleActivateAgent(args: Record<string, unknown>) {
    const agentName = args.agentName as string;
    const projectPath = args.projectPath as string | undefined;
    const initialCommand = args.initialCommand as string | undefined;

    if (!agentName) {
      throw new Error('agentName is required');
    }

    return await agentManager.activateAgent(agentName, projectPath, initialCommand);
  }

  private async handleListTasks(args: Record<string, unknown>) {
    const tasks = await bmadCoreService.getTasks();

    const agentFilter = args.agentFilter as string | undefined;
    if (agentFilter) {
      return tasks.filter((task) => task.agents.includes(agentFilter));
    }

    return tasks.map((task) => ({
      name: task.name,
      description: task.description,
      agents: task.agents,
    }));
  }

  private async handleGetTask(args: Record<string, unknown>) {
    const taskName = args.taskName as string;

    if (!taskName) {
      throw new Error('taskName is required');
    }

    const task = await bmadCoreService.getTask(taskName);

    if (!task) {
      throw new Error(`Task not found: ${taskName}`);
    }

    return task;
  }

  private async handleListTemplates(args: Record<string, unknown>) {
    const templates = await bmadCoreService.getTemplates();
    const category = args.category as string | undefined;

    // Simple filtering by name/type - can be enhanced
    if (category && category !== 'all') {
      return templates.filter((t) => t.type?.toLowerCase().includes(category.toLowerCase()));
    }

    return templates.map((template) => ({
      name: template.name,
      description: template.description,
      type: template.type,
      sections: template.sections?.length || 0,
      variables: template.variables?.map((v) => v.name) || [],
    }));
  }

  private async handleGetTemplate(args: Record<string, unknown>) {
    const templateName = args.templateName as string;

    if (!templateName) {
      throw new Error('templateName is required');
    }

    const template = await bmadCoreService.getTemplate(templateName);

    if (!template) {
      throw new Error(`Template not found: ${templateName}`);
    }

    return template;
  }

  private async handleListWorkflows(args: Record<string, unknown>) {
    const workflows = await bmadCoreService.getWorkflows();
    const projectType = args.projectType as string | undefined;

    if (projectType && projectType !== 'all') {
      return workflows.filter((w) => w.type === projectType);
    }

    return workflows.map((workflow) => ({
      name: workflow.name,
      description: workflow.description,
      type: workflow.type,
      phaseCount: workflow.phases?.length || 0,
    }));
  }

  private async handleGetWorkflow(args: Record<string, unknown>) {
    const workflowName = args.workflowName as string;
    const includeAgentDetails = (args.includeAgentDetails as boolean) || false;

    if (!workflowName) {
      throw new Error('workflowName is required');
    }

    const workflow = await bmadCoreService.getWorkflow(workflowName);

    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowName}`);
    }

    if (includeAgentDetails && workflow.phases) {
      // Load agent details for each phase
      for (const phase of workflow.phases) {
        const agent = await bmadCoreService.getAgent(phase.agent);
        if (agent) {
          (phase as any).agentDetails = agentManager.getAgentSummary(agent);
        }
      }
    }

    return workflow;
  }

  private async handleGetKnowledgeBase(_args: Record<string, unknown>) {
    return await bmadCoreService.getKnowledgeBase();
  }

  private async handleListTeams(_args: Record<string, unknown>) {
    const teams = await bmadCoreService.getTeams();
    return teams.map((team) => ({
      name: team.name,
      description: team.description,
      agents: team.agents,
      agentCount: team.agents?.length || 0,
    }));
  }

  private async handleListExpansionPacks(_args: Record<string, unknown>) {
    return await bmadCoreService.getExpansionPacks();
  }

  // Helper methods

  private getErrorCode(error: unknown): string {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return ErrorCodes.NOT_FOUND;
      }
      if (error.message.includes('required')) {
        return ErrorCodes.INVALID_INPUT;
      }
    }
    return ErrorCodes.UNKNOWN_ERROR;
  }
}
