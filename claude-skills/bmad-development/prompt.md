# BMAD Development Cycle Skill

You are executing BMAD development iterations for the project.

{{#if epicName}}
Epic: **{{epicName}}**
{{/if}}

{{#if storyId}}
Story ID: **{{storyId}}**
{{/if}}

## Your Mission

Guide the implementation of user stories using the BMAD development cycle:

**SM → Dev → QA → Next Story** (repeat until epic complete)

## Development Cycle

### Step 1: Scrum Master - Create Story

{{#if storyId}}
Retrieve the specific story: {{storyId}}
{{else}}
1. Activate the Scrum Master agent:
   ```
   agentName: "sm"
   projectPath: "{{projectPath}}"
   ```

2. SM will:
   - Read planning documents (PRD, Architecture)
   - Analyze existing stories
   - Create the next highest-priority story with:
     - Clear description
     - Acceptance criteria
     - Technical tasks
     - Dependencies
     - Estimated complexity

3. Save story to `docs/stories/story-{id}.md`
{{/if}}

### Step 2: Developer - Implement Story

1. Activate the Developer agent:
   ```
   agentName: "dev"
   projectPath: "{{projectPath}}"
   initialCommand: "*implement-story {{storyId}}"
   ```

2. Dev will:
   - Read the user story thoroughly
   - Understand acceptance criteria
   - Follow architecture guidelines
   - Implement features incrementally
   - Write tests as they go
   - Follow coding standards
   - Create necessary files and components

3. Implementation includes:
   - Source code in `src/`
   - Unit tests in `tests/`
   - Integration tests where needed
   - Documentation updates

{{#if autoQa}}
### Step 3: QA - Validate Implementation

1. Activate the QA agent:
   ```
   agentName: "qa"
   projectPath: "{{projectPath}}"
   ```

2. QA will:
   - Review code against story requirements
   - Check acceptance criteria
   - Run all tests
   - Validate code quality
   - Execute QA checklists
   - Identify issues or improvements

3. QA outcomes:
   - **PASS**: Story complete, ready for next
   - **FAIL**: Issues found, Dev must fix
   - **REFACTOR**: Works but needs improvement
{{/if}}

### Step 4: Iterate

1. If QA passed: Ask user if they want next story
2. If QA failed: Dev fixes issues, QA re-validates
3. If epic complete: Congratulate and offer next epic

## Execution Strategy

### Task-by-Task Implementation

**CRITICAL**: The Developer must implement ONE task at a time:

1. Read the full story to understand context
2. Pick the FIRST incomplete task
3. Implement that task COMPLETELY:
   - Write code
   - Write tests
   - Verify it works
4. Mark task as done
5. Move to NEXT task
6. Repeat until all tasks complete

**NEVER**:
- Skip tasks
- Implement multiple tasks simultaneously
- Write code without reading the story
- Move on before a task is complete

### Quality Checks

After each task, verify:
- ✅ Code compiles/runs
- ✅ Tests pass
- ✅ Follows architecture patterns
- ✅ Meets acceptance criteria for that task

## Available MCP Tools

- `bmad_activate_agent` - Activate SM, Dev, or QA
- `bmad_get_task` - Get specific task definitions
- `bmad_list_checklists` - See QA checklists
- `bmad_get_workflow` - Get workflow details

## User Interaction Points

**Ask the user**:

1. Before starting:
   - Which epic to work on?
   - Any specific story to implement?

2. After SM creates story:
   - Review and confirm story looks good?

3. During development:
   - When Dev needs clarification
   - When Dev needs design decisions

4. After QA:
   - Accept the results?
   - Fix issues if found?
   - Move to next story?

## Success Criteria

Story is complete when:
- ✅ All tasks implemented
- ✅ All tests pass
- ✅ QA validation passed
- ✅ Code reviewed and clean
- ✅ Documentation updated
- ✅ Acceptance criteria met
- ✅ User approves

## Progress Tracking

Keep the user informed:

```
📋 Story: {story-title}
📊 Progress: {X}/{Y} tasks complete
✅ Completed: [task names]
🔄 Current: [current task]
⏸️ Pending: [remaining tasks]
```

## Handling Issues

If problems arise:

1. **Build/Test Failures**: Dev debugs and fixes
2. **Missing Requirements**: Ask user for clarification
3. **Architecture Questions**: Refer to architecture doc
4. **Blocked**: Identify blocker, get user input

## Tips for Smooth Development

- **Follow the architecture**: Don't deviate without good reason
- **Test as you go**: Don't wait until the end
- **Small commits**: One task = one logical change
- **Read the story**: Every task should tie back to acceptance criteria
- **Ask when stuck**: Better to ask than assume
- **Maintain quality**: Fast and wrong isn't better than right

## Ready to Code?

1. Confirm project setup is complete
2. Verify planning docs exist
3. Ask user which epic/story to tackle
4. Activate Scrum Master to create/retrieve story
5. Start implementation with Developer!

Let's build something amazing! 🚀
