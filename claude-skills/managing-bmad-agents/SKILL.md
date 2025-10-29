---
name: managing-bmad-agents
description: Discover, activate, and work with BMAD AI agents for various development tasks. Use when the user asks about available agents, wants to activate a specific agent, or needs help choosing the right agent for a task.
version: 1.0.0
dependencies: bmad-method MCP server
---

## Overview

This Skill helps you discover and work with BMAD's 10+ specialized AI agents. Each agent has a specific role, persona, and set of capabilities designed for different phases of software development.

**When to use:** Exploring agents, activating specific agents, understanding agent capabilities, choosing the right agent.

**MCP Tools Required:** `bmad_list_agents`, `bmad_get_agent`, `bmad_activate_agent`

## Available Agents

### Planning Phase Agents

**Analyst** - Research & Ideation Specialist
- Role: Gather requirements, research domain, create project briefs
- Use when: Starting projects, understanding requirements
- Output: project-brief.md

**PM (Product Manager)** - Requirements Definition
- Role: Transform briefs into detailed product requirements
- Use when: Defining features, creating user stories, planning releases
- Output: prd.md

**Architect** - System Design Expert
- Role: Design system architecture, select tech stack
- Use when: Architecting systems, technical design decisions
- Output: architecture.md

**UX Expert** - User Experience Designer
- Role: Design user interfaces, create wireframes, define UX patterns
- Use when: UI/UX design, user flow definition
- Output: ux-design.md, wireframes

**PO (Product Owner)** - Quality Validator
- Role: Validate documents, approve deliverables, run checklists
- Use when: Validating plans, ensuring quality, approving phases
- Output: Approval, feedback, validation reports

### Development Phase Agents

**SM (Scrum Master)** - Story Creator
- Role: Create user stories from planning documents
- Use when: Breaking down features into implementable stories
- Output: story-{id}.md files

**Dev (Developer)** - Full-Stack Implementation
- Role: Implement features, write code, create tests
- Use when: Building features, writing code, implementing stories
- Output: Source code, tests

**QA (Quality Assurance)** - Testing & Validation
- Role: Test implementations, validate quality, run checklists
- Use when: Validating implementations, ensuring quality
- Output: Test results, bug reports, quality assessments

### Orchestration Agents

**BMad Orchestrator** - Master Coordinator
- Role: Coordinate multiple agents, manage complex workflows
- Use when: Complex multi-agent workflows, project coordination
- Output: Coordination plans, workflow execution

**BMad Master** - Universal Task Executor
- Role: Execute any BMAD task, universal problem solver
- Use when: General tasks, troubleshooting, flexible execution
- Output: Task-specific outputs

## Discovering Agents

### List All Agents

To see all available agents:

```
Use: bmad_list_agents({ includeExpansionPacks: false })
```

**Returns:** Summary of all agents with names, roles, and categories.

### Filter by Category

To find agents for specific purposes:

```
Use: bmad_list_agents({ category: "planning" })
Use: bmad_list_agents({ category: "development" })
Use: bmad_list_agents({ category: "quality" })
```

### Get Agent Details

To learn about a specific agent:

```
Use: bmad_get_agent({
  agentName: "dev",
  includeDependencies: true
})
```

**Returns:** Complete agent information including:
- Role and responsibilities
- Available commands
- Dependencies (tasks, templates, checklists)
- Persona description
- Collaboration patterns

## Activating Agents

### Basic Activation

Activate an agent with minimal parameters:

```
Use: bmad_activate_agent({ agentName: "analyst" })
```

### Activation with Context

Provide project context for better results:

```
Use: bmad_activate_agent({
  agentName: "dev",
  projectPath: "/path/to/project"
})
```

### Activation with Initial Command

Start the agent with a specific task:

```
Use: bmad_activate_agent({
  agentName: "sm",
  projectPath: "/path/to/project",
  initialCommand: "*create-doc story"
})
```

## Agent Commands

Each agent has specific commands available after activation. Common command patterns:

### Document Creation Commands

```
*create-doc [template-name]    # Create document from template
*create-doc project-brief       # Analyst creates project brief
*create-doc prd                 # PM creates PRD
*create-doc architecture        # Architect creates architecture
*create-doc story               # SM creates user story
```

### Task Execution Commands

```
*task [task-name]              # Execute specific task
*implement-story [id]           # Dev implements story
*validate-story                 # QA validates implementation
```

### Checklist Commands

```
*execute-checklist [name]      # Run quality checklist
*execute-checklist po-master   # PO runs master checklist
*execute-checklist story-dod   # Check story definition of done
```

### Utility Commands

```
*help                          # Show agent's available commands
*kb                            # Toggle knowledge base mode
*exit                          # Exit agent persona
```

## Choosing the Right Agent

### Decision Tree

**Need to understand requirements?**
→ Use **Analyst**

**Have requirements, need detailed features?**
→ Use **PM**

**Need to design the system?**
→ Use **Architect**

**Need UI/UX design?**
→ Use **UX Expert**

**Need to validate planning docs?**
→ Use **PO**

**Ready to create implementation stories?**
→ Use **SM**

**Ready to write code?**
→ Use **Dev**

**Need to test/validate code?**
→ Use **QA**

**Need to coordinate multiple agents?**
→ Use **BMad Orchestrator**

**General task or troubleshooting?**
→ Use **BMad Master**

### Task-Based Selection

| Task | Agent | Why |
|------|-------|-----|
| Create project plan | Analyst → PM → Architect | Planning phase sequence |
| Break feature into stories | SM | Story creation specialist |
| Implement authentication | Dev | Code implementation |
| Review code quality | QA | Quality validation |
| Fix architectural issue | Architect | System design expert |
| Validate all documents | PO | Quality assurance |
| General question | BMad Master | Universal problem solver |

## Agent Collaboration

Agents work best in specific sequences:

### Planning Sequence
```
Analyst → PM → Architect → [UX Expert] → PO
```

Each agent builds on previous work.

### Development Sequence
```
SM → Dev → QA (repeat)
```

Iterative cycle for each story.

### Quality Sequence
```
Dev → QA → [Dev fixes] → QA (validation loop)
```

Ensure quality before completion.

## Examples

### Example 1: Start New Project

**User:** "I want to build a task management app"

**You:**
```
Let me help you get started with BMAD. I'll activate the Analyst agent
to gather requirements.

Use: bmad_activate_agent({ agentName: "analyst" })
```

Then guide through: Analyst → PM → Architect → PO

### Example 2: Continue Existing Project

**User:** "I have my planning docs. Let's start implementing."

**You:**
```
Great! Since planning is complete, I'll activate the Scrum Master
to create the first user story.

Use: bmad_activate_agent({
  agentName: "sm",
  projectPath: "/path/to/project"
})
```

### Example 3: User Unsure What to Do

**User:** "I'm not sure which agent I need"

**You:**
```
Let me show you all available agents and we can choose together.

Use: bmad_list_agents({ category: "all" })

Based on what you're trying to accomplish, here's what I recommend:
- If starting: Use Analyst for requirements
- If planning: Use PM for features
- If implementing: Use SM then Dev
- If testing: Use QA
```

### Example 4: Agent Not Working as Expected

**User:** "The Developer agent seems stuck"

**You:**
```
Let me get the full details about the Developer agent to help
troubleshoot.

Use: bmad_get_agent({
  agentName: "dev",
  includeDependencies: true
})

Based on the agent details, it looks like the Dev agent needs:
1. Access to the user story file
2. Architecture document for guidance
3. Clear acceptance criteria

Let's make sure these are available...
```

## Best Practices

### Agent Activation

✅ **Do:**
- Activate one agent at a time
- Provide project context when available
- Use initial commands for specific tasks
- Let agents complete before moving to next

❌ **Don't:**
- Activate multiple agents simultaneously
- Skip planning agents
- Activate agents without understanding their role
- Move to next agent before current completes

### Agent Interaction

✅ **Do:**
- Read agent's activation instructions
- Use agent-specific commands
- Provide information when agent asks
- Save agent outputs before moving on

❌ **Don't:**
- Ignore agent's questions
- Skip recommended steps
- Assume agent has information not provided
- Forget to save deliverables

### Workflow Management

✅ **Do:**
- Follow BMAD's sequential workflows
- Complete each phase fully
- Validate before moving forward
- Keep user informed of progress

❌ **Don't:**
- Jump phases (planning → coding without design)
- Rush through validation
- Skip quality checks
- Leave phases incomplete

## Troubleshooting

**Agent not found:**
- Check spelling (case-sensitive)
- Use `bmad_list_agents()` to see all available
- Verify MCP server is connected

**Agent activation fails:**
- Confirm MCP server connection
- Check project path is valid
- Verify bmad-core path in MCP config

**Agent produces poor results:**
- Provide more context during activation
- Ensure previous documents are available
- Use agent-specific commands
- Check if agent has required dependencies

**Not sure which agent:**
- Use this Skill's decision tree
- Ask user for more context about goal
- Start with Analyst if very early
- Use BMad Master for general questions

## Advanced Usage

### Custom Agent Workflows

You can create custom sequences:

```
1. Analyst (brief) → PM (PRD)
2. Skip Architect, go directly to SM
3. SM → Dev (rapid prototyping)
4. Later: Architect reviews and documents
```

### Parallel Agent Work

For large projects:

```
- Architect designs backend
- UX Expert designs frontend
- Both work in parallel
- SM combines into stories
```

### Agent Re-activation

If you need to revisit:

```
1. Complete initial work
2. Discover issues later
3. Reactivate original agent
4. Agent makes updates
5. PO re-validates
```

## Related Skills

- `orchestrating-bmad-planning` - Complete planning workflow
- `orchestrating-bmad-development` - Complete development workflow

For detailed agent capabilities, use: `bmad_get_agent({ agentName: "name", includeDependencies: true })`
