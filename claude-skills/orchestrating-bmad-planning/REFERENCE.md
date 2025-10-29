# BMAD Planning Phase - Reference Guide

## Agent Capabilities Deep Dive

### Analyst Agent

**Primary Role:** Research and ideation specialist

**Commands Available:**
- `*create-doc project-brief` - Create project brief from interview
- `*research` - Conduct domain research
- `*analyze-stakeholders` - Stakeholder analysis
- `*define-success` - Define success criteria
- `*kb` - Toggle knowledge base mode

**Best Practices:**
- Start with open-ended questions
- Probe for constraints and assumptions
- Research industry standards
- Document both functional and non-functional needs
- Consider multiple stakeholder perspectives

### PM (Product Manager) Agent

**Primary Role:** Product requirements definition

**Commands Available:**
- `*create-doc prd` - Create PRD from project brief
- `*prioritize` - Prioritize features
- `*define-stories` - Create epic-level user stories
- `*plan-releases` - Plan release schedule
- `*kb` - Toggle knowledge base mode

**Best Practices:**
- Use MoSCoW prioritization (Must, Should, Could, Won't)
- Write user stories in standard format: "As a [user], I want [goal] so that [benefit]"
- Include acceptance criteria for each feature
- Consider dependencies between features
- Think about MVP vs. future releases

### Architect Agent

**Primary Role:** System architecture design

**Commands Available:**
- `*create-doc architecture` - Create architecture document
- `*design-system` - Design system components
- `*select-stack` - Recommend technology stack
- `*define-apis` - Define API contracts
- `*kb` - Toggle knowledge base mode

**Best Practices:**
- Start with high-level architecture diagram
- Document both logical and physical architecture
- Justify technology choices
- Consider scalability from the start
- Define clear component boundaries
- Document integration patterns
- Include security architecture
- Plan for observability (logging, monitoring)

### PO (Product Owner) Agent

**Primary Role:** Document validation and approval

**Commands Available:**
- `*execute-checklist` - Run quality checklists
- `*validate-doc` - Validate specific document
- `*review` - Comprehensive review
- `*approve` - Approve documents
- `*request-changes` - Request specific changes

**Available Checklists:**
- `po-master-checklist` - Comprehensive validation
- `prd-validation-checklist` - PRD-specific checks
- `architecture-review-checklist` - Architecture validation

**Best Practices:**
- Review for consistency across documents
- Check alignment with BMAD best practices
- Validate completeness of each document
- Ensure traceability (requirements → architecture)
- Look for ambiguities or gaps
- Verify technical feasibility

## Document Templates

### Project Brief Template

```markdown
# Project Brief: [Project Name]

## Problem Statement
[Clear description of the problem being solved]

## Target Audience
- Primary: [Main user group]
- Secondary: [Additional user groups]

## Goals and Objectives
1. [Measurable goal 1]
2. [Measurable goal 2]
3. [Measurable goal 3]

## Success Criteria
- [Metric 1]: [Target value]
- [Metric 2]: [Target value]

## Constraints
- Budget: [Amount/constraints]
- Timeline: [Timeframe]
- Technical: [Technical constraints]
- Regulatory: [Compliance requirements]

## High-Level Requirements
### Functional
1. [Requirement 1]
2. [Requirement 2]

### Non-Functional
1. [Requirement 1]
2. [Requirement 2]

## Assumptions
1. [Assumption 1]
2. [Assumption 2]

## Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk 1] | [High/Med/Low] | [How to mitigate] |

## Stakeholders
- [Name/Role]: [Interest/Influence]
```

### PRD Template

```markdown
# Product Requirements Document: [Project Name]

## Executive Summary
[2-3 paragraph overview]

## Features

### Epic 1: [Epic Name]
**Priority:** [Must/Should/Could/Won't]
**Description:** [Detailed description]

**User Stories:**
1. As a [user type], I want [goal] so that [benefit]
   - Acceptance Criteria:
     - [ ] [Criterion 1]
     - [ ] [Criterion 2]

### Epic 2: [Epic Name]
...

## Non-Functional Requirements
- Performance: [Requirements]
- Security: [Requirements]
- Scalability: [Requirements]
- Accessibility: [Requirements]
- Compliance: [Requirements]

## Dependencies
- External: [External dependencies]
- Internal: [Internal dependencies]

## Release Plan
### Release 1 (MVP)
- Features: [List]
- Timeline: [Dates]

### Release 2
- Features: [List]
- Timeline: [Dates]
```

### Architecture Document Template

```markdown
# Architecture Document: [Project Name]

## System Overview
[High-level description with architecture diagram]

## Architecture Principles
1. [Principle 1]
2. [Principle 2]

## Component Architecture

### Frontend
- Framework: [Choice and rationale]
- State Management: [Approach]
- UI Library: [Choice]

### Backend
- Language/Framework: [Choice and rationale]
- Architecture Style: [Microservices/Monolith/etc.]
- API Design: [REST/GraphQL/gRPC]

### Database
- Primary: [Database choice and rationale]
- Caching: [Strategy]
- Search: [If applicable]

### Infrastructure
- Hosting: [Cloud provider]
- CI/CD: [Pipeline approach]
- Monitoring: [Tools and strategy]

## Data Models
[Key entity definitions and relationships]

## API Contracts
[Key API endpoint definitions]

## Security Architecture
- Authentication: [Approach]
- Authorization: [Approach]
- Data Protection: [Encryption, etc.]

## Deployment Architecture
[Deployment diagram and strategy]

## Scalability Strategy
[How system will scale]

## Disaster Recovery
[Backup and recovery plans]
```

## Common Patterns

### Pattern: Large Documents

If any document exceeds 4000 tokens (roughly 3000 words):

```
Use: bmad_shard_document({
  documentPath: "docs/prd.md",
  maxTokensPerShard: 4000,
  outputDir: "docs/shards"
})
```

This creates manageable chunks while preserving structure.

### Pattern: Iterative Refinement

If PO requests changes:

```
1. Identify which document needs changes
2. Reactivate the responsible agent (Analyst, PM, or Architect)
3. Provide specific feedback from PO
4. Agent makes revisions
5. Save updated document
6. Reactivate PO to re-validate
```

### Pattern: Document Consistency Check

Ensure alignment across documents:

```
Project Brief ← PRD ← Architecture

Check:
- Goals in brief match features in PRD
- PRD features map to architecture components
- Non-functional requirements addressed in architecture
- Constraints acknowledged throughout
```

## MCP Tool Reference

### bmad_activate_agent

```typescript
{
  agentName: string,           // Required: 'analyst', 'pm', 'architect', 'po'
  projectPath?: string,        // Optional: project directory
  initialCommand?: string      // Optional: command to execute
}
```

**Returns:** Complete agent context with persona, commands, and dependencies

### bmad_list_templates

```typescript
{
  category?: string  // Optional: 'planning', 'development', 'quality', 'all'
}
```

**Returns:** List of available templates

### bmad_get_template

```typescript
{
  templateName: string  // Required: e.g., 'prd-tmpl', 'architecture-tmpl'
}
```

**Returns:** Complete template structure

### bmad_shard_document

```typescript
{
  documentPath: string,
  maxTokensPerShard?: number,    // Default: 4000
  outputDir?: string,
  preserveStructure?: boolean    // Default: true
}
```

**Returns:** Sharded document with metadata

## Troubleshooting Common Issues

### Issue: Agent activation fails

**Symptoms:** Error when calling `bmad_activate_agent`

**Solutions:**
1. Verify MCP server is connected: Call `bmad_list_agents()`
2. Check agent name spelling (case-sensitive)
3. Ensure bmad-core path is correct in MCP config

### Issue: Documents lack detail

**Symptoms:** PO rejects documents as incomplete

**Solutions:**
1. Provide more context to agents during activation
2. Use agent-specific commands to add detail
3. Reference templates for expected sections
4. Ask clarifying questions to user

### Issue: Inconsistent documents

**Symptoms:** PO finds misalignment between documents

**Solutions:**
1. Ensure each agent reads previous documents
2. Explicitly ask agents to verify alignment
3. Use PO's consistency checklist
4. Have agents cross-reference earlier work

### Issue: User unclear on requirements

**Symptoms:** Analyst can't complete project brief

**Solutions:**
1. Use Analyst's interview techniques
2. Ask about similar existing solutions
3. Explore user personas and use cases
4. Break down into smaller scope if too broad

## Quality Metrics

### Project Brief Quality
- ✅ Problem clearly articulated
- ✅ Target audience well-defined
- ✅ Success criteria are measurable
- ✅ Constraints documented
- ✅ 3-5 pages in length

### PRD Quality
- ✅ All major features covered
- ✅ User stories have acceptance criteria
- ✅ Priorities assigned (MoSCoW)
- ✅ Dependencies identified
- ✅ Non-functional requirements defined
- ✅ 10-20 pages in length

### Architecture Quality
- ✅ System diagram included
- ✅ Technology choices justified
- ✅ Component boundaries clear
- ✅ Data models defined
- ✅ API contracts specified
- ✅ Security addressed
- ✅ Scalability considered
- ✅ 15-30 pages in length

## Best Practices Checklist

Before completing planning phase:

- [ ] User provided sufficient initial context
- [ ] Project brief addresses all template sections
- [ ] PRD features map to brief requirements
- [ ] Architecture supports PRD features
- [ ] All documents saved to docs/ directory
- [ ] Documents are well-formatted markdown
- [ ] PO executed validation checklists
- [ ] PO approved all documents
- [ ] User confirmed satisfaction with plan
- [ ] No known issues or gaps
- [ ] Ready to begin development phase

## Time Estimates

Typical planning phase duration (with AI assistance):

- **Simple projects** (e.g., CRUD app): 1-2 hours
- **Medium projects** (e.g., SaaS platform): 2-4 hours
- **Complex projects** (e.g., enterprise system): 4-8 hours

These times include:
- User interviews and clarifications
- Agent activations and work
- Document review and iteration
- PO validation and approval

## Related Resources

- BMAD Knowledge Base: Query with `bmad_get_kb()`
- Agent Details: Check with `bmad_get_agent({ agentName: "name" })`
- Workflows: View with `bmad_list_workflows()`
- Tasks: Explore with `bmad_list_tasks()`
