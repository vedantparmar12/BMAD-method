# BMAD MCP Server - Complete Usage Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Quick Start](#quick-start)
5. [Complete Workflows](#complete-workflows)
6. [Tool Reference](#tool-reference)
7. [Claude Skills](#claude-skills)
8. [Advanced Usage](#advanced-usage)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

---

## Introduction

The BMAD MCP Server bridges the gap between AI assistants (like Claude) and the powerful BMAD-METHOD framework. It enables Claude to:

- **Activate specialized AI agents** for different development phases
- **Execute structured workflows** for planning and implementation
- **Access templates and tasks** to maintain consistency
- **Orchestrate complete development cycles** with minimal human intervention

### How BMAD Works

```
Planning Phase (Web UI)          Development Phase (IDE)
┌──────────────────┐            ┌─────────────────────┐
│  Analyst         │            │  Scrum Master       │
│  ↓               │            │  ↓                  │
│  PM              │  →→→→→→    │  Developer          │
│  ↓               │            │  ↓                  │
│  Architect       │            │  QA                 │
│  ↓               │            │  ↓                  │
│  PO (Validate)   │            │  Next Story         │
└──────────────────┘            └─────────────────────┘
```

The MCP server enables Claude to orchestrate this entire flow from your IDE!

---

## Installation

### Step 1: Build the MCP Server

```bash
cd /path/to/BMAD-METHOD/mcp-server
npm install
npm run build
```

### Step 2: Verify Build

```bash
# Should see dist/ directory with compiled JavaScript
ls dist/
# Output: index.js  server.js  services/  utils/  types/
```

---

## Configuration

### For Claude Code

1. Open your Claude Code configuration:
   - **Mac/Linux**: `~/.config/claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the BMAD MCP server:

```json
{
  "mcpServers": {
    "bmad-method": {
      "command": "node",
      "args": [
        "C:/Users/vedan/Desktop/mcp-rag/BMAD-Context/BMAD-METHOD/mcp-server/dist/index.js"
      ],
      "env": {
        "BMAD_CORE_PATH": "C:/Users/vedan/Desktop/mcp-rag/BMAD-Context/BMAD-METHOD/bmad-core",
        "BMAD_LOG_LEVEL": "info"
      }
    }
  }
}
```

**⚠️ IMPORTANT**: Use absolute paths, not relative ones!

### For Cursor

1. Open Cursor settings (Settings > MCP Servers)
2. Add configuration:

```json
{
  "name": "bmad-method",
  "command": "node",
  "args": ["/absolute/path/to/mcp-server/dist/index.js"],
  "env": {
    "BMAD_CORE_PATH": "/absolute/path/to/bmad-core"
  }
}
```

### Environment Variables

- **`BMAD_CORE_PATH`** (required): Absolute path to bmad-core directory
- **`BMAD_LOG_LEVEL`** (optional): `debug` | `info` | `warn` | `error` (default: `info`)
- **`BMAD_MAX_TOKEN_LIMIT`** (optional): Max tokens per response (default: `8000`)

### Step 3: Restart Your IDE

After configuration changes, restart your IDE to load the MCP server.

### Step 4: Verify Connection

In Claude, ask:

```
Can you list all available BMAD agents?
```

If configured correctly, Claude will use the `bmad_list_agents` tool and show you all agents!

---

## Quick Start

### Example 1: Explore Available Agents

**User**: "What BMAD agents are available for planning?"

**Claude** will call:
```typescript
bmad_list_agents({
  category: 'planning',
  includeExpansionPacks: false
})
```

**Result**: List of planning agents (Analyst, PM, Architect, PO)

### Example 2: Get Agent Details

**User**: "Tell me more about the Developer agent"

**Claude** will call:
```typescript
bmad_get_agent({
  agentName: 'dev',
  includeDependencies: true
})
```

**Result**: Complete developer agent definition with commands, responsibilities, and dependencies

### Example 3: Activate an Agent

**User**: "Activate the Analyst agent to start planning my new e-commerce project"

**Claude** will call:
```typescript
bmad_activate_agent({
  agentName: 'analyst',
  projectPath: '/path/to/project',
  initialCommand: '*create-doc project-brief'
})
```

**Result**: Agent activated with full context, ready to work!

---

## Complete Workflows

### Workflow 1: Greenfield Project (Full Cycle)

```
User → Claude → MCP Server → BMAD Agents → Deliverables
```

#### Phase 1: Planning (Web Mode or IDE)

1. **Start Planning**:
   ```
   "Let's start planning a new web application for task management"
   ```

2. **Analyst Phase**:
   - Claude activates Analyst
   - Analyst interviews you about requirements
   - Creates `docs/project-brief.md`

3. **PM Phase**:
   - Claude activates PM
   - PM reads project brief
   - Creates detailed `docs/prd.md`

4. **Architect Phase**:
   - Claude activates Architect
   - Architect designs system
   - Creates `docs/architecture.md`

5. **PO Validation**:
   - Claude activates PO
   - PO validates all documents
   - Provides approval or feedback

**Deliverables**: `project-brief.md`, `prd.md`, `architecture.md` (all approved)

#### Phase 2: Development (IDE Mode)

6. **First Story**:
   ```
   "Let's start implementing the first feature"
   ```
   - Claude activates Scrum Master
   - SM reads docs, creates `story-001.md`

7. **Implementation**:
   - Claude activates Developer
   - Dev implements story task-by-task
   - Writes code and tests

8. **Quality Check**:
   - Claude activates QA
   - QA validates implementation
   - Runs checklists

9. **Iterate**:
   - Repeat steps 6-8 until epic complete
   - Then move to next epic

**Deliverables**: Working code, tests, user stories

### Workflow 2: Using Claude Skills

Claude skills automate multi-agent workflows.

#### Planning Skill

```
"Use the bmad-planning skill to plan my new mobile app"
```

Claude will:
1. Activate skill prompt
2. Guide you through each phase
3. Activate Analyst → PM → Architect → PO sequentially
4. Save all documents
5. Validate completeness

#### Development Skill

```
"Use the bmad-development skill to implement the authentication epic"
```

Claude will:
1. Activate Scrum Master to create story
2. Activate Developer to implement
3. Activate QA to validate
4. Repeat for next story
5. Continue until epic complete

---

## Tool Reference

### Agent Tools

#### `bmad_list_agents`

List all available agents with optional filtering.

**Parameters**:
```typescript
{
  includeExpansionPacks?: boolean,  // Include expansion pack agents
  category?: 'planning' | 'development' | 'quality' | 'orchestration' | 'all'
}
```

**Example Usage**:
```
"Show me all development agents"
```

**Returns**:
```json
[
  {
    "name": "dev",
    "displayName": "BMad Developer",
    "role": "Full-Stack Developer",
    "category": "development",
    "commandCount": 8,
    "dependencyCount": 12
  }
]
```

#### `bmad_get_agent`

Get detailed information about a specific agent.

**Parameters**:
```typescript
{
  agentName: string,              // Required: 'dev', 'sm', 'analyst', etc.
  includeDependencies?: boolean   // Include full dependency content
}
```

**Example Usage**:
```
"Get full details about the QA agent including all dependencies"
```

#### `bmad_activate_agent`

Activate an agent with full context.

**Parameters**:
```typescript
{
  agentName: string,           // Required: agent to activate
  projectPath?: string,        // Optional: project directory
  initialCommand?: string      // Optional: command to run after activation
}
```

**Example Usage**:
```
"Activate the Developer agent for my project at /path/to/project"
```

**Returns**: Complete activation data including persona, commands, dependencies, and activation prompt

### Task Tools

#### `bmad_list_tasks`

List all available reusable tasks.

**Parameters**:
```typescript
{
  agentFilter?: string  // Optional: filter by agent name
}
```

**Example Usage**:
```
"What tasks are available for the Scrum Master?"
```

#### `bmad_get_task`

Get detailed information about a specific task.

**Parameters**:
```typescript
{
  taskName: string  // Required: task name
}
```

**Example Usage**:
```
"Show me the create-next-story task details"
```

### Template Tools

#### `bmad_list_templates`

List all document templates.

**Parameters**:
```typescript
{
  category?: 'planning' | 'development' | 'quality' | 'documentation' | 'all'
}
```

**Example Usage**:
```
"List all planning document templates"
```

#### `bmad_get_template`

Get a specific template definition.

**Parameters**:
```typescript
{
  templateName: string  // Required: template name (e.g., 'prd-tmpl')
}
```

**Example Usage**:
```
"Show me the PRD template structure"
```

### Workflow Tools

#### `bmad_list_workflows`

List all available workflows.

**Parameters**:
```typescript
{
  projectType?: 'greenfield' | 'brownfield' | 'maintenance' | 'all'
}
```

**Example Usage**:
```
"What workflows are available for greenfield projects?"
```

#### `bmad_get_workflow`

Get a specific workflow definition.

**Parameters**:
```typescript
{
  workflowName: string,         // Required: workflow name
  includeAgentDetails?: boolean // Include agent info for each phase
}
```

**Example Usage**:
```
"Get the greenfield-fullstack workflow with agent details"
```

### Knowledge Base Tools

#### `bmad_get_kb`

Access the complete BMAD knowledge base.

**Parameters**: None

**Example Usage**:
```
"What does the BMAD knowledge base say about context management?"
```

### Team & Pack Tools

#### `bmad_list_teams`

List all pre-configured agent teams.

**Example Usage**:
```
"Show me all available agent teams"
```

#### `bmad_list_expansion_packs`

List all available expansion packs.

**Example Usage**:
```
"What expansion packs are available?"
```

---

## Claude Skills

Claude skills are pre-built prompts that orchestrate multi-agent workflows automatically.

### Available Skills

1. **bmad-planning**: Complete planning phase (Analyst → PM → Architect → PO)
2. **bmad-development**: Development iteration (SM → Dev → QA → repeat)

### How to Use Skills

Skills are referenced in the `claude-skills/` directory. Claude can access them to understand the workflow patterns.

**Example**:
```
"Let's follow the BMAD planning workflow to plan my new SaaS application"
```

Claude will:
1. Recognize this matches the planning skill
2. Follow the skill's structured approach
3. Guide you through each agent phase
4. Save deliverables at each step

---

## Advanced Usage

### Custom Agent Activation

You can fine-tune agent activation:

```
"Activate the Developer agent with the initial command to implement story-005, working in the /path/to/my-app directory"
```

Claude will call:
```typescript
bmad_activate_agent({
  agentName: 'dev',
  projectPath: '/path/to/my-app',
  initialCommand: '*implement-story story-005'
})
```

### Sequential Agent Workflow

For complex scenarios, activate agents in sequence:

```
1. "Activate Architect to review the current architecture"
2. [Architect makes recommendations]
3. "Now activate Developer to implement those changes"
4. [Developer implements]
5. "Finally activate QA to validate"
6. [QA tests and approves]
```

### Combining Multiple Tools

```
"First list all planning templates, then show me the architecture template, and activate the Architect agent"
```

Claude will:
1. Call `bmad_list_templates({ category: 'planning' })`
2. Call `bmad_get_template({ templateName: 'architecture-tmpl' })`
3. Call `bmad_activate_agent({ agentName: 'architect' })`

---

## Troubleshooting

### Problem: "MCP server not connected"

**Solutions**:
1. Verify MCP server is built: `npm run build`
2. Check IDE configuration has absolute paths
3. Restart IDE after configuration changes
4. Check logs: Set `BMAD_LOG_LEVEL=debug`

### Problem: "Agent not found"

**Solutions**:
1. List agents to verify name: "List all agents"
2. Check spelling (it's case-sensitive)
3. Verify bmad-core path is correct

### Problem: "Tool execution failed"

**Solutions**:
1. Check MCP server logs in IDE
2. Verify BMAD core files exist
3. Ensure dependencies are installed
4. Try restarting MCP server

### Problem: "High token usage"

**Solutions**:
1. Reduce `BMAD_MAX_TOKEN_LIMIT`
2. Use `includeDependencies: false` when listing agents
3. Access specific items instead of listing all
4. Use targeted queries

---

## Best Practices

### 1. Follow the BMAD Flow

```
Planning first → then Development → with Quality checks
```

Don't skip planning! It saves time later.

### 2. One Agent at a Time

Activate one agent, complete their work, then move to the next. Don't try to activate multiple agents simultaneously.

### 3. Save Deliverables

After each agent phase, ensure documents are saved:
- `docs/project-brief.md`
- `docs/prd.md`
- `docs/architecture.md`
- `docs/stories/*.md`

### 4. Use Clear Commands

Instead of:
```
"Can you maybe help with development?"
```

Use:
```
"Activate the Developer agent to implement story-003"
```

### 5. Leverage Skills

For common workflows, use skills:
```
"Use the bmad-planning skill for this new project"
```

### 6. Provide Context

Help Claude help you:
```
"Activate the Developer agent for my React e-commerce app at /path/to/app. We're implementing the shopping cart feature."
```

### 7. Iterate Properly

In development:
1. SM creates story
2. Dev implements completely
3. QA validates
4. Fix issues if needed
5. THEN move to next story

Don't rush ahead!

### 8. Check Quality

Use QA agent after each story or epic:
```
"Activate QA to validate the authentication implementation"
```

### 9. Reference Docs

Agents work better when they have documents:
```
"Activate Developer. The PRD is at docs/prd.md and architecture is at docs/architecture.md"
```

### 10. Ask for Help

If stuck:
```
"Show me the BMAD knowledge base section on story creation"
```

---

## Example Sessions

### Session 1: Complete New Project

```
User: "I want to build a task management SaaS app"

Claude: "Great! Let's use BMAD to plan and implement it. I'll start by activating the Analyst agent."

[Analyst phase - creates project-brief.md]

Claude: "Analyst has created the project brief. Now let's activate the PM."

[PM phase - creates prd.md]

Claude: "PM has created the PRD. Now let's design the architecture."

[Architect phase - creates architecture.md]

Claude: "Excellent! Let's have the PO validate everything."

[PO phase - validates all docs]

Claude: "Planning complete! Ready to start development?"

User: "Yes, let's implement!"

Claude: "Activating Scrum Master to create the first story..."

[Iterative development begins]
```

### Session 2: Brownfield Enhancement

```
User: "I need to add a new payment system to my existing app"

Claude: "Let's activate the Architect to review the current system first."

[Architect reviews and proposes changes]

Claude: "Based on the architecture review, let's create a story for this."

[SM creates enhancement story]

Claude: "Activating Developer to implement the payment integration."

[Dev implements]

Claude: "Let's validate with QA."

[QA tests integration]

Claude: "Enhancement complete and tested!"
```

---

## Summary

The BMAD MCP Server transforms Claude into a powerful orchestrator of AI agents, enabling structured, high-quality software development with minimal context loss. By following BMAD's proven workflows and leveraging specialized agents, you can:

- Plan thoroughly before coding
- Maintain consistency across development
- Ensure quality at every step
- Scale development with clear processes
- Reduce technical debt
- Ship faster with confidence

**Ready to build something amazing? Start with:**

```
"List all BMAD agents and let's plan my next project!"
```

Happy building! 🚀
