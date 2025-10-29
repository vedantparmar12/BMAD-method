# BMAD-METHOD MCP Server

> **Model Context Protocol server for the BMAD-METHOD AI agent framework**

This MCP server exposes the complete BMAD-METHOD framework to AI assistants like Claude, enabling them to orchestrate AI agents, manage workflows, and execute structured development processes directly from your IDE.

## 🌟 Features

- **Agent Management**: List, activate, and interact with all 10+ BMAD agents
- **Task Execution**: Run structured tasks like document creation, validation, and code generation
- **Template Management**: Access and use document templates (PRD, Architecture, Stories, etc.)
- **Workflow Orchestration**: Execute complete development workflows (Greenfield, Brownfield, etc.)
- **Knowledge Base Access**: Query the BMAD knowledge base for patterns and best practices
- **Team Collaboration**: Work with pre-configured agent teams
- **Expansion Packs**: Extend functionality with domain-specific agents and workflows

## 📋 Prerequisites

- Node.js 20.0.0 or higher
- BMAD-METHOD framework installed (this MCP server is part of the BMAD-METHOD repository)
- An MCP-compatible IDE (Claude Code, Cursor, VS Code with MCP extension, Windsurf)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd mcp-server
npm install
```

### 2. Build the Server

```bash
npm run build
```

### 3. Configure Your IDE

#### For Claude Code

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "bmad-method": {
      "command": "node",
      "args": ["/absolute/path/to/BMAD-METHOD/mcp-server/dist/index.js"],
      "env": {
        "BMAD_CORE_PATH": "/absolute/path/to/BMAD-METHOD/bmad-core",
        "BMAD_LOG_LEVEL": "info"
      }
    }
  }
}
```

#### For Cursor

Add to your Cursor MCP settings:

```json
{
  "mcp": {
    "servers": [
      {
        "name": "bmad-method",
        "command": "node",
        "args": ["/absolute/path/to/BMAD-METHOD/mcp-server/dist/index.js"],
        "env": {
          "BMAD_CORE_PATH": "/absolute/path/to/BMAD-METHOD/bmad-core"
        }
      }
    ]
  }
}
```

### 4. Restart Your IDE

After configuration, restart your IDE to load the MCP server.

### 5. Test the Connection

In your IDE, try asking Claude:

```
List all available BMAD agents
```

Claude should now be able to use the MCP tools to interact with BMAD!

## 🛠️ Available MCP Tools

### Agent Management

- **`bmad_list_agents`** - List all available agents with filtering options
- **`bmad_get_agent`** - Get detailed information about a specific agent
- **`bmad_activate_agent`** - Activate an agent with full context and dependencies

### Task Management

- **`bmad_list_tasks`** - List all available reusable tasks
- **`bmad_get_task`** - Get detailed information about a specific task

### Template Management

- **`bmad_list_templates`** - List all document templates
- **`bmad_get_template`** - Get a specific template definition

### Workflow Management

- **`bmad_list_workflows`** - List all available workflows
- **`bmad_get_workflow`** - Get detailed workflow with phases

### Knowledge Base

- **`bmad_get_kb`** - Access the complete BMAD knowledge base

### Team & Expansion Packs

- **`bmad_list_teams`** - List all pre-configured agent teams
- **`bmad_list_expansion_packs`** - List available expansion packs

## 📚 Usage Examples

### Example 1: List All Agents

```typescript
// Claude can call this tool:
await mcp.tools.bmad_list_agents({
  includeExpansionPacks: false,
  category: 'all'
});

// Returns:
[
  {
    name: 'analyst',
    displayName: 'BMad Analyst',
    role: 'Research & Ideation Specialist',
    category: 'planning',
    commandCount: 5,
    dependencyCount: 3
  },
  // ... more agents
]
```

### Example 2: Activate Developer Agent

```typescript
await mcp.tools.bmad_activate_agent({
  agentName: 'dev',
  projectPath: '/path/to/project',
  initialCommand: '*implement-story story-001'
});

// Returns activation data with full agent context
```

### Example 3: Get Workflow

```typescript
await mcp.tools.bmad_get_workflow({
  workflowName: 'greenfield-fullstack',
  includeAgentDetails: true
});

// Returns complete workflow with all phases and agents
```

## 🎯 Claude Skills

Pre-built Claude skills are available in the `claude-skills/` directory:

### 1. BMAD Planning Phase

```
Use skill: bmad-planning
```

Guides you through:
- Analyst creates project brief
- PM creates PRD
- Architect designs system
- PO validates everything

### 2. BMAD Development Cycle

```
Use skill: bmad-development
```

Iterative development:
- SM creates user stories
- Dev implements features
- QA validates quality
- Repeat until complete

See `claude-skills/` directory for skill definitions and prompts.

## ⚙️ Configuration

### Environment Variables

- `BMAD_CORE_PATH`: Path to bmad-core directory (default: `../bmad-core`)
- `BMAD_LOG_LEVEL`: Logging level (`debug`, `info`, `warn`, `error`) (default: `info`)
- `BMAD_MAX_TOKEN_LIMIT`: Maximum tokens for responses (default: `8000`)

### Custom Configuration

You can customize the server behavior by setting these variables in your IDE's MCP configuration.

## 🧪 Development

### Project Structure

```
mcp-server/
├── src/
│   ├── index.ts              # Entry point
│   ├── server.ts             # Core MCP server
│   ├── services/             # Business logic
│   │   ├── bmad-core.ts      # BMAD core interface
│   │   └── agent-manager.ts  # Agent operations
│   ├── tools/                # Tool implementations
│   ├── utils/                # Utilities
│   │   ├── logger.ts         # Logging
│   │   ├── file-utils.ts     # File operations
│   │   ├── yaml-parser.ts    # YAML parsing
│   │   └── token-estimator.ts # Token counting
│   └── types/                # TypeScript types
├── dist/                     # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

### Build Commands

```bash
npm run build       # Compile TypeScript
npm run dev         # Watch mode for development
npm run lint        # Run ESLint
npm run lint:fix    # Fix linting issues
npm run format      # Format code with Prettier
npm test            # Run tests (when implemented)
```

### Running in Development

```bash
# Start in watch mode
npm run dev

# In another terminal, test with MCP client
npx @modelcontextprotocol/cli connect node dist/index.js
```

## 📖 How It Works

### Architecture

```
┌─────────────────┐
│   Claude/IDE    │
└────────┬────────┘
         │ MCP Protocol
┌────────▼────────┐
│   MCP Server    │
│  (this package) │
└────────┬────────┘
         │
    ┌────▼─────┐
    │ Services │
    └────┬─────┘
         │
┌────────▼─────────────┐
│    BMAD Core         │
│  - Agents            │
│  - Tasks             │
│  - Templates         │
│  - Workflows         │
└──────────────────────┘
```

### Request Flow

1. **User asks Claude** something like "List all BMAD agents"
2. **Claude recognizes** it should use the `bmad_list_agents` MCP tool
3. **MCP server receives** the tool call via stdio
4. **Server routes** to appropriate handler
5. **Service layer** interacts with BMAD core (reads files, parses YAML, etc.)
6. **Response sent back** to Claude with structured data
7. **Claude presents** the information to the user

## 🐛 Troubleshooting

### Server Not Starting

Check that:
- Node.js 20+ is installed: `node --version`
- Dependencies are installed: `npm install`
- Server is built: `npm run build`

### MCP Server Not Connecting

1. **Check IDE configuration**: Verify paths are absolute, not relative
2. **Check logs**: Set `BMAD_LOG_LEVEL=debug` to see detailed logs
3. **Verify BMAD_CORE_PATH**: Ensure it points to the correct directory
4. **Restart IDE**: Changes to MCP config require restart

### Tool Execution Errors

- **Agent not found**: Verify agent name is correct (use `bmad_list_agents` to see all)
- **File not found**: Check that BMAD core is properly installed
- **Parse errors**: YAML files may have syntax issues

View logs in your IDE's MCP server output panel for detailed error information.

## 🤝 Contributing

Contributions are welcome! To add new tools or features:

1. **Add tool definition** in `src/server.ts` (`registerTools()` method)
2. **Implement handler** in `src/server.ts` or create new service
3. **Update types** in `src/types/tools.ts` if needed
4. **Test thoroughly** with different agents and workflows
5. **Update documentation** in this README

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [BMAD-METHOD Repository](https://github.com/bmadcode/BMAD-METHOD)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Code](https://claude.com/claude-code)

## 💡 Tips for Best Results

1. **Start with Planning**: Use the `bmad-planning` skill for new projects
2. **Follow the Workflow**: BMAD is designed for sequential execution (planning → development → QA)
3. **One Agent at a Time**: Activate and complete with one agent before moving to the next
4. **Use Skills**: Pre-built skills handle common workflows automatically
5. **Read Agent Instructions**: Each agent has specific activation instructions
6. **Trust the Process**: BMAD's structured approach prevents context loss and maintains quality

## 📞 Support

For issues, questions, or feature requests:

- Open an issue on the [BMAD-METHOD repository](https://github.com/bmadcode/BMAD-METHOD/issues)
- Check the [BMAD documentation](https://github.com/bmadcode/BMAD-METHOD#readme)
- Review the knowledge base: `await mcp.tools.bmad_get_kb()`

---

**Built with ❤️ for the AI-assisted development community**
