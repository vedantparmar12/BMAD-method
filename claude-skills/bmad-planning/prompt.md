# BMAD Planning Phase Skill

You are executing the BMAD planning phase for project: **{{projectName}}**

Project Type: {{projectType}}

## Your Mission

Guide the user through the complete planning phase using BMAD agents via the MCP server. Execute the following phases in sequence:

### Phase 1: Analyst - Create Project Brief

1. Use the MCP tool `bmad_activate_agent` to activate the Analyst agent:
   ```
   agentName: "analyst"
   projectPath: "{{projectPath}}"
   ```

2. The Analyst will:
   - Interview stakeholders (you'll facilitate this with the user)
   - Research domain and technical requirements
   - Create `docs/project-brief.md` with:
     - Problem statement
     - Target audience
     - Success criteria
     - Constraints and assumptions
     - High-level requirements

3. Save the project brief to `docs/project-brief.md`

### Phase 2: PM - Create PRD

1. Activate the PM agent:
   ```
   agentName: "pm"
   projectPath: "{{projectPath}}"
   ```

2. The PM will:
   - Read the project brief
   - Transform it into a detailed PRD
   - Define features and user stories
   - Prioritize requirements
   - Create `docs/prd.md`

3. Save the PRD to `docs/prd.md`

### Phase 3: Architect - Create Architecture

1. Activate the Architect agent:
   ```
   agentName: "architect"
   projectPath: "{{projectPath}}"
   ```

2. The Architect will:
   - Read PRD and project brief
   - Design system architecture
   - Create component diagrams
   - Define tech stack
   - Identify integration points
   - Create `docs/architecture.md`

3. Save the architecture doc to `docs/architecture.md`

{{#unless skipValidation}}
### Phase 4: PO - Validate Documents

1. Activate the PO agent:
   ```
   agentName: "po"
   projectPath: "{{projectPath}}"
   ```

2. The PO will:
   - Review all planning documents
   - Check for consistency
   - Validate against best practices
   - Provide feedback and approval
   - Execute quality checklists

3. If issues found, iterate with relevant agents to fix
{{/unless}}

## Execution Instructions

1. **Start with a summary**: Tell the user what you're about to do
2. **Execute phase by phase**: Don't skip ahead
3. **Use MCP tools**: Always use `bmad_activate_agent` for each phase
4. **Show agent outputs**: Display what each agent produces
5. **Facilitate user input**: When agents need information, ask the user
6. **Save documents**: Actually write the documents to the docs/ folder
7. **Provide progress updates**: Keep the user informed of status

## Available MCP Tools

- `bmad_activate_agent` - Activate a specific agent
- `bmad_get_agent` - Get agent information
- `bmad_list_templates` - See available templates
- `bmad_get_template` - Get a specific template
- `bmad_list_tasks` - See available tasks

## Success Criteria

Planning phase is complete when:
- ✅ Project brief created and comprehensive
- ✅ PRD created with clear features and priorities
- ✅ Architecture documented with diagrams
{{#unless skipValidation}}
- ✅ PO has validated all documents
{{/unless}}
- ✅ All documents saved in docs/ folder
- ✅ User confirms readiness to proceed to development

## Tips for Success

- **Ask clarifying questions**: Don't assume - ask the user for details
- **Use templates**: Leverage BMAD templates for document structure
- **Be thorough**: Planning saves time in development
- **Iterate if needed**: It's okay to go back and refine documents
- **Document decisions**: Capture the "why" behind choices

## Ready to Begin?

Start by introducing yourself and asking the user for:
1. Brief project description
2. Key stakeholders to consider
3. Any specific constraints or requirements
4. Timeline expectations (if any)

Then activate the Analyst agent and begin Phase 1!
