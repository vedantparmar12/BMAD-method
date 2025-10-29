# BMAD-METHOD Claude Skills - Complete Guide

## Overview

Claude skills for BMAD-METHOD have been created following official Claude documentation. These skills enable Claude to orchestrate complex multi-agent workflows automatically.

**Skills Location:** `claude-skills/`

**Format:** Each skill follows the official structure with a main `SKILL.md` file containing YAML frontmatter and markdown instructions.

---

## Available Skills

### 1. Orchestrating BMAD Planning

**Skill Name:** `orchestrating-bmad-planning`

**File:** `claude-skills/orchestrating-bmad-planning/SKILL.md`

**Purpose:** Guides Claude through the complete BMAD planning phase using four specialized agents in sequence.

**Workflow:**
```
Analyst → PM → Architect → PO
```

**When to Use:**
- Starting new projects
- Creating comprehensive project plans
- Establishing requirements and architecture
- User mentions "planning phase" or "project setup"

**Deliverables:**
- `docs/project-brief.md` - Problem statement and requirements
- `docs/prd.md` - Detailed product requirements
- `docs/architecture.md` - System design and tech stack

**Supporting Files:**
- `REFERENCE.md` - Detailed agent capabilities, templates, and troubleshooting

**Example Usage:**
```
User: "I want to build an e-commerce platform"

Claude will:
1. Activate Analyst to research requirements
2. Activate PM to create detailed PRD
3. Activate Architect to design system
4. Activate PO to validate all documents
5. Save all deliverables
```

---

### 2. Orchestrating BMAD Development

**Skill Name:** `orchestrating-bmad-development`

**File:** `claude-skills/orchestrating-bmad-development/SKILL.md`

**Purpose:** Guides Claude through iterative development cycles with three agents.

**Workflow:**
```
SM creates story → Dev implements → QA validates → Repeat
```

**When to Use:**
- After planning phase is complete
- Implementing features
- Iterative development cycles
- User mentions "start coding" or "implement"

**Deliverables:**
- `docs/stories/story-{id}.md` - User stories
- `src/**/*` - Source code
- `tests/**/*` - Test files

**Supporting Files:**
- `EXAMPLES.md` - Detailed implementation examples with code

**Example Usage:**
```
User: "Let's implement the authentication feature"

Claude will:
1. Activate SM to create authentication story
2. Activate Developer to implement task-by-task
3. Activate QA to validate implementation
4. Handle any issues and re-validate
5. Move to next story when complete
```

---

### 3. Managing BMAD Agents

**Skill Name:** `managing-bmad-agents`

**File:** `claude-skills/managing-bmad-agents/SKILL.md`

**Purpose:** Helps discover, activate, and work with BMAD's 10+ specialized agents.

**When to Use:**
- User asks about available agents
- Wants to activate a specific agent
- Needs help choosing the right agent
- Exploring BMAD capabilities

**Key Features:**
- Lists all 10+ BMAD agents with descriptions
- Provides decision tree for choosing agents
- Explains agent commands and capabilities
- Shows agent collaboration patterns
- Troubleshooting guidance

**Example Usage:**
```
User: "What agents are available?"

Claude will:
1. List all agents with categories
2. Explain what each agent does
3. Help user choose the right one
4. Activate selected agent
```

---

## Skill Structure (Official Format)

Each skill follows this structure:

### File Organization

```
skill-name/
├── SKILL.md        # Main skill file (required)
├── REFERENCE.md    # Additional details (optional)
└── EXAMPLES.md     # Concrete examples (optional)
```

### SKILL.md Format

```markdown
---
name: skill-name-format
description: Clear description with triggers (200-1024 chars)
version: 1.0.0
dependencies: bmad-method MCP server
---

## Overview
[What the skill does and when to use it]

## Main Content
[Instructions, workflows, examples]

## Related Skills
[Links to other skills]
```

### Key Requirements

**Name:**
- Lowercase with hyphens
- Gerund form (orchestrating, managing)
- Max 64 characters

**Description:**
- Explains what AND when to use
- Includes trigger words
- Max 1024 characters
- Third person voice

**Body:**
- Under 500 lines
- Progressive disclosure (link to REFERENCE.md for details)
- Concrete examples
- Clear section headings

---

## How Claude Uses These Skills

### Automatic Discovery

Claude will use these skills when:
1. User request matches description triggers
2. Skill capabilities align with user's goal
3. MCP server is connected

### Skill Loading

```
User Request
    ↓
Claude reads YAML frontmatter
    ↓
Description matches user intent?
    ↓ Yes
Claude loads SKILL.md body
    ↓
Follows instructions
    ↓
Loads REFERENCE.md if needed
```

### Progressive Disclosure

- **Level 1:** YAML description (always read)
- **Level 2:** SKILL.md body (read when skill invoked)
- **Level 3:** REFERENCE.md (read when more detail needed)
- **Level 4:** EXAMPLES.md (read for concrete patterns)

---

## Using Skills in Claude

### Method 1: Natural Language

Simply describe what you want:

```
"I want to plan a new web application"
→ Claude uses orchestrating-bmad-planning

"Let's start implementing features"
→ Claude uses orchestrating-bmad-development

"What agents are available?"
→ Claude uses managing-bmad-agents
```

### Method 2: Explicit Request

Directly ask for a skill:

```
"Use the BMAD planning skill to plan my project"
"Follow the BMAD development workflow"
"Help me choose the right BMAD agent"
```

### Method 3: Continuing Workflow

Skills can chain together:

```
1. User: "Plan and build a mobile app"
2. Claude uses orchestrating-bmad-planning
3. Planning completes
4. Claude suggests: "Ready to start development?"
5. User: "Yes"
6. Claude uses orchestrating-bmad-development
```

---

## Skill Interactions

### Skill Chaining

```
managing-bmad-agents
    ↓ (user chooses planning)
orchestrating-bmad-planning
    ↓ (planning complete)
orchestrating-bmad-development
    ↓ (implementation)
Back to managing-bmad-agents (for specific agents)
```

### Skill References

Skills reference each other:

```markdown
## Related Skills
- `orchestrating-bmad-planning` - For creating plans
- `managing-bmad-agents` - For agent details
```

---

## Installation & Usage

### Step 1: Ensure MCP Server is Running

Skills require the BMAD MCP server to be configured and running.

```bash
cd mcp-server
npm install
npm run build
```

Configure in Claude Code (see `mcp-server/INSTALLATION_TEST.md`)

### Step 2: Skills Are Ready to Use

Skills are referenced from the `claude-skills/` directory. No additional installation needed - Claude can access them when the MCP server is connected.

### Step 3: Test Skills

**Test planning skill:**
```
"Let's plan a new project using BMAD"
```

**Test development skill:**
```
"Start BMAD development cycle"
```

**Test agent management:**
```
"Show me all BMAD agents"
```

---

## Best Practices

### When Using Skills

✅ **Do:**
- Let Claude follow the skill workflow
- Provide requested information when asked
- Confirm before moving between phases
- Review deliverables at each step

❌ **Don't:**
- Try to rush through phases
- Skip validation steps
- Start development without planning
- Interrupt agent workflows

### Customizing Workflows

Skills provide structure but allow flexibility:

```
Standard: Analyst → PM → Architect → PO
Custom: Analyst → PM → Skip Architect → SM
(For rapid prototyping)
```

Claude will adapt based on your needs.

### Getting Help

If unsure:
```
"What should I do next with BMAD?"
"Which BMAD agent should I use?"
"Show me the BMAD workflow"
```

Claude will guide you using the skills.

---

## Troubleshooting

### Skill Not Activating

**Issue:** Claude doesn't use a skill when expected

**Solutions:**
1. Be more explicit: "Use the BMAD planning skill"
2. Verify MCP server is connected
3. Check that request matches skill description
4. Try rephrasing with trigger words

### Skill Execution Issues

**Issue:** Skill starts but encounters problems

**Solutions:**
1. Ensure planning docs exist (for development skill)
2. Verify MCP server connection
3. Check bmad-core path is correct
4. Review skill's REFERENCE.md for troubleshooting

### Agent Not Activating Within Skill

**Issue:** Skill tries to activate agent but fails

**Solutions:**
1. Verify agent name is correct
2. Check MCP server logs
3. Ensure bmad-core/agents/ has agent files
4. Try listing agents first: `bmad_list_agents()`

---

## Skill Maintenance

### Updating Skills

To update a skill:

1. Edit the relevant `SKILL.md` file
2. Update version number in YAML frontmatter
3. Document changes in version control
4. Test with Claude

### Adding New Skills

To create a new skill:

1. Create directory: `claude-skills/new-skill-name/`
2. Create `SKILL.md` with proper YAML frontmatter
3. Add description with trigger words
4. Write clear instructions with examples
5. Optional: Add `REFERENCE.md` for details
6. Optional: Add `EXAMPLES.md` for concrete examples

### Skill Templates

Use existing skills as templates:
- Planning skill: Multi-phase workflows
- Development skill: Iterative cycles
- Agent management: Discovery and activation

---

## Skill Architecture

### Design Philosophy

BMAD skills follow these principles:

1. **Progressive Disclosure:** Load detail only when needed
2. **Conciseness:** Assume Claude's base knowledge
3. **Concrete Examples:** Show don't just tell
4. **Clear Triggers:** Explicit description matching
5. **Composability:** Skills work together

### Information Hierarchy

```
YAML Frontmatter (Always Read)
    ├── Name (skill identifier)
    ├── Description (when to use + triggers)
    └── Dependencies (required tools)
         ↓
SKILL.md Body (Read when invoked)
    ├── Overview
    ├── Workflows
    ├── Examples
    └── Links to additional files
         ↓
REFERENCE.md (Read when detail needed)
    ├── Deep dives
    ├── Templates
    └── Troubleshooting
         ↓
EXAMPLES.md (Read for concrete patterns)
    ├── Complete examples
    ├── Code samples
    └── Real scenarios
```

---

## Quick Reference

### All Skills Summary

| Skill | Purpose | Agents Used | Deliverables |
|-------|---------|-------------|--------------|
| **orchestrating-bmad-planning** | Create project plan | Analyst, PM, Architect, PO | planning docs |
| **orchestrating-bmad-development** | Implement features | SM, Dev, QA | code + stories |
| **managing-bmad-agents** | Discover & activate agents | Any | guidance |

### Workflow Sequences

**New Project:**
```
orchestrating-bmad-planning → orchestrating-bmad-development
```

**Exploration:**
```
managing-bmad-agents → (choose specific workflow)
```

**Active Development:**
```
orchestrating-bmad-development (repeated iterations)
```

### Common Commands

```
"Use BMAD planning skill" → orchestrating-bmad-planning
"Start BMAD development" → orchestrating-bmad-development
"Show BMAD agents" → managing-bmad-agents
"What agents are available?" → managing-bmad-agents
"Let's plan a project" → orchestrating-bmad-planning
"Implement next feature" → orchestrating-bmad-development
```

---

## Next Steps

1. **Install MCP Server** (if not already done)
   - See `mcp-server/INSTALLATION_TEST.md`

2. **Test Skills**
   ```
   "Show me all BMAD agents"
   "Let's plan a new project"
   ```

3. **Use in Real Projects**
   ```
   "I want to build [your idea] using BMAD"
   ```

4. **Explore Advanced Usage**
   - Read REFERENCE.md files for deep dives
   - Check EXAMPLES.md for patterns
   - Customize workflows as needed

---

## Resources

- **Skill Files:** `claude-skills/*/SKILL.md`
- **MCP Server:** `mcp-server/`
- **Documentation:** `mcp-server/USAGE_GUIDE.md`
- **Installation:** `mcp-server/INSTALLATION_TEST.md`
- **Architecture:** `mcp-server/ARCHITECTURE.md`

---

## Support

If you encounter issues:

1. Check MCP server connection
2. Review skill's REFERENCE.md
3. Verify planning docs exist (for development)
4. Ask Claude: "Help me troubleshoot this BMAD skill issue"

---

**Skills created following official Claude documentation:**
- https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices
- https://support.claude.com/en/articles/12512198-how-to-create-custom-skills

**Ready to use BMAD with Claude Skills! 🚀**
