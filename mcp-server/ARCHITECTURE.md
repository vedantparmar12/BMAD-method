# BMAD-METHOD MCP Server Architecture

## Overview
This MCP server exposes the complete BMAD-METHOD framework capabilities to AI assistants like Claude, enabling them to:
- Manage BMAD installations and configurations
- Build and deploy agents, teams, and expansion packs
- Execute agent workflows and tasks
- Create and manage documents from templates
- Access the BMAD knowledge base
- Orchestrate complete development cycles

## MCP Tools Specification

### 1. Installation & Configuration Tools

#### `bmad_install`
Install BMAD-METHOD into a project.
```typescript
{
  name: "bmad_install",
  description: "Install BMAD-METHOD framework into a project directory",
  inputSchema: {
    type: "object",
    properties: {
      projectPath: { type: "string", description: "Target project directory path" },
      ideType: {
        type: "string",
        enum: ["cursor", "vscode", "claude-code", "windsurf", "auto-detect"],
        description: "IDE type for configuration"
      },
      expansionPacks: {
        type: "array",
        items: { type: "string" },
        description: "Optional expansion packs to install"
      },
      options: {
        type: "object",
        properties: {
          skipGitCheck: { type: "boolean" },
          forceOverwrite: { type: "boolean" }
        }
      }
    },
    required: ["projectPath"]
  }
}
```

#### `bmad_get_config`
Get current BMAD configuration.
```typescript
{
  name: "bmad_get_config",
  description: "Retrieve current BMAD configuration and installation status",
  inputSchema: {
    type: "object",
    properties: {
      projectPath: { type: "string", description: "Project directory path" }
    }
  }
}
```

### 2. Agent Management Tools

#### `bmad_list_agents`
List all available agents with their metadata.
```typescript
{
  name: "bmad_list_agents",
  description: "List all available BMAD agents with their roles, personas, and capabilities",
  inputSchema: {
    type: "object",
    properties: {
      includeExpansionPacks: { type: "boolean", default: false },
      category: {
        type: "string",
        enum: ["planning", "development", "quality", "all"],
        description: "Filter agents by category"
      }
    }
  }
}
```

#### `bmad_get_agent`
Get detailed information about a specific agent.
```typescript
{
  name: "bmad_get_agent",
  description: "Retrieve complete agent definition including persona, commands, and dependencies",
  inputSchema: {
    type: "object",
    properties: {
      agentName: {
        type: "string",
        description: "Agent name (e.g., 'dev', 'sm', 'analyst')"
      },
      includeDependencies: {
        type: "boolean",
        default: false,
        description: "Include all dependency content (tasks, templates, checklists)"
      }
    },
    required: ["agentName"]
  }
}
```

#### `bmad_activate_agent`
Activate an agent with its full context.
```typescript
{
  name: "bmad_activate_agent",
  description: "Activate a BMAD agent by loading its complete definition and dependencies",
  inputSchema: {
    type: "object",
    properties: {
      agentName: { type: "string", description: "Agent to activate" },
      projectPath: { type: "string", description: "Project context path" },
      initialCommand: {
        type: "string",
        description: "Optional command to execute after activation"
      }
    },
    required: ["agentName"]
  }
}
```

### 3. Build System Tools

#### `bmad_build_web_bundles`
Build web bundles for agents and teams.
```typescript
{
  name: "bmad_build_web_bundles",
  description: "Build web-optimized bundles for use in ChatGPT, Claude, etc.",
  inputSchema: {
    type: "object",
    properties: {
      targets: {
        type: "array",
        items: {
          enum: ["agents", "teams", "expansion-packs", "all"]
        },
        default: ["all"]
      },
      outputDir: { type: "string", description: "Custom output directory" },
      minify: { type: "boolean", default: false }
    }
  }
}
```

#### `bmad_validate`
Validate agent definitions and dependencies.
```typescript
{
  name: "bmad_validate",
  description: "Validate all agent definitions, templates, and dependencies",
  inputSchema: {
    type: "object",
    properties: {
      target: {
        type: "string",
        description: "Specific agent or 'all' to validate everything"
      },
      strict: { type: "boolean", default: false }
    }
  }
}
```

### 4. Document Management Tools

#### `bmad_create_document`
Create a document from a template.
```typescript
{
  name: "bmad_create_document",
  description: "Create a new document from a BMAD template with variable substitution",
  inputSchema: {
    type: "object",
    properties: {
      templateName: {
        type: "string",
        description: "Template name (e.g., 'prd-tmpl', 'story-tmpl')"
      },
      outputPath: { type: "string", description: "Where to save the document" },
      variables: {
        type: "object",
        description: "Variables for template substitution"
      },
      projectContext: {
        type: "string",
        description: "Project path for context"
      }
    },
    required: ["templateName", "outputPath"]
  }
}
```

#### `bmad_shard_document`
Shard a large document into manageable chunks.
```typescript
{
  name: "bmad_shard_document",
  description: "Split large documents into shards to manage token limits",
  inputSchema: {
    type: "object",
    properties: {
      documentPath: { type: "string", description: "Document to shard" },
      maxTokensPerShard: { type: "number", default: 4000 },
      outputDir: { type: "string", description: "Where to save shards" },
      preserveStructure: { type: "boolean", default: true }
    },
    required: ["documentPath"]
  }
}
```

#### `bmad_list_templates`
List all available document templates.
```typescript
{
  name: "bmad_list_templates",
  description: "List all available document templates with descriptions",
  inputSchema: {
    type: "object",
    properties: {
      category: {
        type: "string",
        enum: ["planning", "development", "quality", "all"]
      }
    }
  }
}
```

### 5. Task & Workflow Tools

#### `bmad_list_tasks`
List all available tasks.
```typescript
{
  name: "bmad_list_tasks",
  description: "List all reusable tasks with their descriptions",
  inputSchema: {
    type: "object",
    properties: {
      category: { type: "string" },
      agentFilter: {
        type: "string",
        description: "Show tasks for specific agent"
      }
    }
  }
}
```

#### `bmad_execute_task`
Execute a specific BMAD task.
```typescript
{
  name: "bmad_execute_task",
  description: "Execute a BMAD task with given context and parameters",
  inputSchema: {
    type: "object",
    properties: {
      taskName: { type: "string", description: "Task to execute" },
      agentContext: {
        type: "string",
        description: "Which agent is executing this task"
      },
      parameters: {
        type: "object",
        description: "Task-specific parameters"
      },
      projectPath: { type: "string" }
    },
    required: ["taskName"]
  }
}
```

#### `bmad_get_workflow`
Get a workflow definition.
```typescript
{
  name: "bmad_get_workflow",
  description: "Retrieve a complete workflow definition with all phases",
  inputSchema: {
    type: "object",
    properties: {
      workflowName: {
        type: "string",
        description: "Workflow name (e.g., 'greenfield-fullstack')"
      },
      includeAgentDetails: { type: "boolean", default: false }
    },
    required: ["workflowName"]
  }
}
```

#### `bmad_list_workflows`
List all available workflows.
```typescript
{
  name: "bmad_list_workflows",
  description: "List all available project workflows",
  inputSchema: {
    type: "object",
    properties: {
      projectType: {
        type: "string",
        enum: ["greenfield", "brownfield", "all"]
      }
    }
  }
}
```

### 6. Knowledge Base Tools

#### `bmad_query_kb`
Query the BMAD knowledge base.
```typescript
{
  name: "bmad_query_kb",
  description: "Search the BMAD knowledge base for specific topics",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query" },
      section: {
        type: "string",
        enum: ["all", "concepts", "patterns", "best-practices", "examples"]
      },
      maxResults: { type: "number", default: 5 }
    },
    required: ["query"]
  }
}
```

#### `bmad_get_kb_section`
Get a specific section of the knowledge base.
```typescript
{
  name: "bmad_get_kb_section",
  description: "Retrieve a specific section from the BMAD knowledge base",
  inputSchema: {
    type: "object",
    properties: {
      section: {
        type: "string",
        description: "Section name or path"
      }
    },
    required: ["section"]
  }
}
```

### 7. Team & Expansion Pack Tools

#### `bmad_list_teams`
List available team configurations.
```typescript
{
  name: "bmad_list_teams",
  description: "List all pre-configured agent teams",
  inputSchema: {
    type: "object",
    properties: {
      includeCustom: { type: "boolean", default: false }
    }
  }
}
```

#### `bmad_get_team`
Get team configuration details.
```typescript
{
  name: "bmad_get_team",
  description: "Retrieve team configuration with all member agents",
  inputSchema: {
    type: "object",
    properties: {
      teamName: { type: "string", description: "Team name" },
      includeAgentDetails: { type: "boolean", default: false }
    },
    required: ["teamName"]
  }
}
```

#### `bmad_list_expansion_packs`
List available expansion packs.
```typescript
{
  name: "bmad_list_expansion_packs",
  description: "List all available expansion packs with descriptions",
  inputSchema: {
    type: "object",
    properties: {
      includeInstalled: { type: "boolean", default: true },
      category: { type: "string" }
    }
  }
}
```

#### `bmad_install_expansion_pack`
Install an expansion pack.
```typescript
{
  name: "bmad_install_expansion_pack",
  description: "Install a BMAD expansion pack",
  inputSchema: {
    type: "object",
    properties: {
      packName: { type: "string", description: "Expansion pack name" },
      projectPath: { type: "string" },
      merge: {
        type: "boolean",
        default: true,
        description: "Merge with existing or keep separate"
      }
    },
    required: ["packName"]
  }
}
```

### 8. Quality Assurance Tools

#### `bmad_list_checklists`
List all quality checklists.
```typescript
{
  name: "bmad_list_checklists",
  description: "List all available quality assurance checklists",
  inputSchema: {
    type: "object",
    properties: {
      category: { type: "string" },
      agentFilter: { type: "string" }
    }
  }
}
```

#### `bmad_execute_checklist`
Execute a quality checklist.
```typescript
{
  name: "bmad_execute_checklist",
  description: "Execute a quality checklist against a document or code",
  inputSchema: {
    type: "object",
    properties: {
      checklistName: { type: "string", description: "Checklist to execute" },
      targetPath: {
        type: "string",
        description: "Document or code to validate"
      },
      agentContext: { type: "string" },
      autoFix: { type: "boolean", default: false }
    },
    required: ["checklistName", "targetPath"]
  }
}
```

### 9. Project Context Tools

#### `bmad_get_project_status`
Get current project status and progress.
```typescript
{
  name: "bmad_get_project_status",
  description: "Get comprehensive project status including documents, stories, and progress",
  inputSchema: {
    type: "object",
    properties: {
      projectPath: { type: "string" },
      includeMetrics: { type: "boolean", default: true }
    }
  }
}
```

#### `bmad_get_next_story`
Get the next story to implement.
```typescript
{
  name: "bmad_get_next_story",
  description: "Retrieve the next user story to implement based on project status",
  inputSchema: {
    type: "object",
    properties: {
      projectPath: { type: "string" },
      epicFilter: { type: "string", description: "Filter by epic name" },
      includeContext: { type: "boolean", default: true }
    }
  }
}
```

## Server Architecture

```
mcp-server/
├── src/
│   ├── index.ts                    # MCP server entry point
│   ├── server.ts                   # Core MCP server setup
│   ├── tools/                      # Tool implementations
│   │   ├── installation.ts         # Install & config tools
│   │   ├── agents.ts              # Agent management tools
│   │   ├── build.ts               # Build system tools
│   │   ├── documents.ts           # Document tools
│   │   ├── tasks.ts               # Task & workflow tools
│   │   ├── knowledge-base.ts      # KB tools
│   │   ├── teams.ts               # Team tools
│   │   ├── quality.ts             # QA tools
│   │   └── project.ts             # Project context tools
│   ├── services/                   # Business logic
│   │   ├── bmad-core.ts           # Interface to bmad-core
│   │   ├── agent-manager.ts       # Agent operations
│   │   ├── build-manager.ts       # Build operations
│   │   ├── doc-manager.ts         # Document operations
│   │   ├── workflow-engine.ts     # Workflow execution
│   │   └── kb-search.ts           # Knowledge base search
│   ├── utils/                      # Utilities
│   │   ├── file-utils.ts          # File operations
│   │   ├── yaml-parser.ts         # YAML parsing
│   │   ├── token-estimator.ts     # Token counting
│   │   ├── dependency-resolver.ts  # Resolve dependencies
│   │   └── logger.ts              # Logging
│   └── types/                      # TypeScript types
│       ├── bmad.ts                # BMAD-specific types
│       ├── mcp.ts                 # MCP protocol types
│       └── tools.ts               # Tool types
├── package.json
├── tsconfig.json
└── README.md
```

## Claude Skills Architecture

```
claude-skills/
├── bmad-planning/                  # Planning phase skills
│   ├── skill.yaml
│   └── prompts/
│       ├── create-project-brief.md
│       ├── create-prd.md
│       ├── create-architecture.md
│       └── validate-docs.md
├── bmad-development/               # Development phase skills
│   ├── skill.yaml
│   └── prompts/
│       ├── create-next-story.md
│       ├── implement-story.md
│       ├── run-qa.md
│       └── prepare-next-iteration.md
├── bmad-workflow/                  # Complete workflow skills
│   ├── skill.yaml
│   └── prompts/
│       ├── greenfield-project.md
│       ├── brownfield-enhancement.md
│       └── epic-implementation.md
└── bmad-assistant/                 # General assistant skills
    ├── skill.yaml
    └── prompts/
        ├── explain-concept.md
        ├── troubleshoot.md
        └── best-practices.md
```

## Integration Points

### With Existing BMAD Tools
- Reuses `tools/lib/dependency-resolver.js` for agent dependencies
- Integrates with `tools/builders/web-builder.js` for bundle generation
- Uses `tools/installer/` for installation operations
- Leverages existing YAML parsers and file utilities

### With IDEs
- Claude Code: Direct MCP integration via `claude_desktop_config.json`
- Cursor: MCP server as custom tool provider
- VS Code: Through Claude Code extension or MCP bridge
- Windsurf: MCP protocol support

### With Web UIs
- Can generate web bundles on-demand
- Provides APIs for custom web interfaces
- Supports batch operations for planning phase

## Workflow Examples

### Example 1: Complete Greenfield Project
```typescript
// 1. Install BMAD
await mcp.call('bmad_install', {
  projectPath: '/path/to/project',
  ideType: 'claude-code'
});

// 2. Get workflow
const workflow = await mcp.call('bmad_get_workflow', {
  workflowName: 'greenfield-fullstack'
});

// 3. Activate Analyst
await mcp.call('bmad_activate_agent', {
  agentName: 'analyst',
  initialCommand: '*create-doc project-brief'
});

// 4. Continue through workflow phases...
```

### Example 2: Create and Implement Story
```typescript
// 1. Activate Scrum Master
await mcp.call('bmad_activate_agent', {
  agentName: 'sm',
  projectPath: '/path/to/project'
});

// 2. Get next story
const story = await mcp.call('bmad_get_next_story', {
  projectPath: '/path/to/project',
  includeContext: true
});

// 3. Activate Developer
await mcp.call('bmad_activate_agent', {
  agentName: 'dev',
  initialCommand: `*implement-story ${story.id}`
});

// 4. Run QA
await mcp.call('bmad_activate_agent', {
  agentName: 'qa',
  initialCommand: '*validate-story'
});
```

## Error Handling

All tools return structured responses:
```typescript
type ToolResponse = {
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    executionTime: number;
    warnings?: string[];
  };
}
```

## Configuration

### MCP Server Config
```json
{
  "mcpServers": {
    "bmad-method": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"],
      "env": {
        "BMAD_CORE_PATH": "/path/to/bmad-core",
        "BMAD_LOG_LEVEL": "info",
        "BMAD_MAX_TOKEN_LIMIT": "8000"
      }
    }
  }
}
```

## Next Steps
1. Implement core MCP server with tool routing
2. Create service layer for BMAD operations
3. Implement individual tool handlers
4. Create Claude skills with MCP tool integration
5. Add comprehensive testing
6. Create documentation and examples
