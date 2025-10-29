---
name: orchestrating-bmad-planning
description: Orchestrate the BMAD planning phase using specialized AI agents (Analyst, PM, Architect, PO) to create comprehensive project documentation. Use when starting new projects or when the user mentions "planning phase", "project setup", or "BMAD planning".
version: 1.0.0
dependencies: bmad-method MCP server
---

## Overview

This Skill guides you through BMAD's structured planning phase using four specialized agents in sequence: Analyst → PM → Architect → PO. The result is a complete set of validated planning documents ready for development.

**When to use:** Starting new projects, creating project plans, establishing requirements and architecture.

**MCP Tools Required:** `bmad_activate_agent`, `bmad_list_templates`, `bmad_get_kb`

## Planning Phase Workflow

### Phase 1: Analyst - Project Brief

Activate the Analyst agent to research and document initial requirements:

```
Use: bmad_activate_agent({ agentName: "analyst" })
```

The Analyst will:
- Interview stakeholders (facilitate with user)
- Research domain requirements
- Identify constraints and assumptions
- Define success criteria

**Deliverable:** `docs/project-brief.md`

**Key sections to ensure:**
- Problem Statement
- Target Audience
- Success Criteria
- High-level Requirements
- Constraints

### Phase 2: PM - Product Requirements Document

Activate the PM agent to transform the brief into detailed requirements:

```
Use: bmad_activate_agent({ agentName: "pm" })
```

The PM will:
- Read and analyze project-brief.md
- Define detailed features and user stories
- Establish priorities and dependencies
- Create acceptance criteria
- Plan releases/milestones

**Deliverable:** `docs/prd.md`

**Key sections to ensure:**
- Feature List with Priorities
- User Stories (Epic level)
- Non-functional Requirements
- Dependencies
- Release Plan

### Phase 3: Architect - System Design

Activate the Architect agent to design the system:

```
Use: bmad_activate_agent({ agentName: "architect" })
```

The Architect will:
- Read PRD and project brief
- Design system architecture
- Define component structure
- Select tech stack
- Identify integration points
- Document patterns and standards

**Deliverable:** `docs/architecture.md`

**Key sections to ensure:**
- System Overview (with diagrams)
- Component Architecture
- Technology Stack
- Data Models
- API Contracts
- Deployment Architecture
- Security Considerations

### Phase 4: PO - Validation

Activate the Product Owner agent to validate all documents:

```
Use: bmad_activate_agent({ agentName: "po" })
```

The PO will:
- Review all planning documents
- Check for consistency and completeness
- Validate against BMAD quality checklists
- Provide approval or feedback
- Request revisions if needed

**Action:** Iterate on any documents with issues until PO approves.

## Execution Strategy

### Sequential Activation

**Critical:** Complete each phase fully before moving to the next. Do not skip ahead.

```
1. Activate Analyst
2. Wait for project-brief.md completion
3. Save document
4. Activate PM
5. Wait for prd.md completion
6. Save document
7. Activate Architect
8. Wait for architecture.md completion
9. Save document
10. Activate PO for validation
11. Address any feedback
12. Confirm approval
```

### User Interaction Points

Ask the user for:
- Initial project description and goals
- Stakeholder needs and constraints
- Technical preferences or requirements
- Clarification when agents need decisions
- Approval before moving to next phase

### Document Management

Save all documents to `docs/` directory:
- `docs/project-brief.md`
- `docs/prd.md`
- `docs/architecture.md`

If documents are large (>4000 tokens), offer to shard them using `bmad_shard_document`.

## Examples

### Example 1: E-commerce SaaS

**User:** "I want to build an e-commerce platform for small businesses"

**You:**
1. Activate Analyst: "Let me activate the BMAD Analyst to research your requirements"
2. Analyst creates project-brief.md with problem statement, target audience (small businesses), key features
3. Activate PM: "Now I'll activate the PM to create detailed requirements"
4. PM creates prd.md with features like product catalog, shopping cart, payment processing, order management
5. Activate Architect: "Let me design the system architecture"
6. Architect creates architecture.md with microservices design, React frontend, Node.js backend, PostgreSQL database
7. Activate PO: "Finally, let's validate all documents"
8. PO reviews and approves

**Result:** Complete planning documentation for e-commerce platform

### Example 2: Mobile Fitness App

**User:** "Plan a mobile app for tracking workouts"

**You:**
1. Analyst phase: Research fitness tracking requirements, user personas, success metrics
2. PM phase: Define features (workout logging, progress tracking, social features, nutrition)
3. Architect phase: Design mobile-first architecture (React Native, GraphQL API, MongoDB)
4. PO phase: Validate completeness and consistency

**Result:** Ready-to-implement fitness app plan

## Quality Checks

Before completing planning phase, verify:

- ✅ All three documents created and saved
- ✅ Project brief clearly defines the problem
- ✅ PRD has prioritized features with acceptance criteria
- ✅ Architecture is detailed with tech stack decisions
- ✅ Documents are consistent with each other
- ✅ PO has approved all documents
- ✅ User confirms satisfaction with plan

## Troubleshooting

**Agent not activating:** Verify MCP server is connected. Try: `bmad_list_agents()`

**Missing context:** Agents work better when they can read previous documents. Ensure documents are saved before activating next agent.

**Document too large:** Use `bmad_shard_document` to split into manageable chunks.

**PO finds issues:** Don't proceed to development. Go back to the relevant agent (Analyst, PM, or Architect) and address the issues.

## Next Steps

After planning phase completion:
1. Confirm user approval of all documents
2. Offer to transition to development phase
3. Suggest: "Ready to start implementation? I can use the `orchestrating-bmad-development` Skill to begin building."

For development phase, see [DEVELOPMENT.md](DEVELOPMENT.md)

## Tips for Success

- **Be thorough in planning:** Time spent here saves rework later
- **Ask clarifying questions:** Better to ask than assume
- **Use templates:** Leverage BMAD templates for consistency (`bmad_list_templates`)
- **Save frequently:** Write documents as they're created
- **Validate completeness:** Each document should stand on its own
- **Get user buy-in:** Confirm approval before moving phases

## Related Skills

- `orchestrating-bmad-development` - For implementing the plan
- `managing-bmad-agents` - For advanced agent orchestration
