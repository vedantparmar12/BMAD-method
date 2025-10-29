---
name: orchestrating-bmad-development
description: Orchestrate BMAD development iterations with Scrum Master creating stories, Developer implementing features, and QA validating quality. Use when implementing features, starting development cycles, or when the user mentions "start coding", "implement stories", or "BMAD development".
version: 1.0.0
dependencies: bmad-method MCP server
---

## Overview

This Skill guides you through BMAD's iterative development cycle using three specialized agents: Scrum Master → Developer → QA. This cycle repeats for each user story until the epic or project is complete.

**When to use:** After planning phase is complete, implementing features, iterative development.

**Prerequisites:** Planning documents must exist (project-brief.md, prd.md, architecture.md)

**MCP Tools Required:** `bmad_activate_agent`, `bmad_get_next_story`, `bmad_list_checklists`

## Development Cycle

### Iteration Pattern

```
1. SM creates user story from planning docs
2. Dev implements story task-by-task
3. QA validates implementation
4. If issues: Dev fixes, QA re-validates
5. If passed: Move to next story
6. Repeat until epic complete
```

**Critical:** Complete each story fully before starting the next. Never work on multiple stories simultaneously.

## Phase 1: Scrum Master - Story Creation

Activate the Scrum Master to create the next user story:

```
Use: bmad_activate_agent({
  agentName: "sm",
  projectPath: "[project-path]"
})
```

The Scrum Master will:
- Read planning documents (PRD, Architecture)
- Analyze completed stories (if any)
- Select next highest-priority feature
- Create detailed user story with:
  - Clear description
  - Acceptance criteria
  - Detailed implementation tasks
  - Dependencies
  - Estimated complexity

**Deliverable:** `docs/stories/story-{id}.md`

**Key sections:**
- Story ID and Title
- Description (user story format)
- Acceptance Criteria (testable)
- Implementation Tasks (ordered)
- Dependencies
- Definition of Done

### SM Best Practices

- Stories should be implementable in 2-8 hours
- Tasks should be sequential and atomic
- Each task should have clear completion criteria
- Reference architecture patterns
- Include both code and test tasks

## Phase 2: Developer - Implementation

Activate the Developer to implement the story:

```
Use: bmad_activate_agent({
  agentName: "dev",
  projectPath: "[project-path]",
  initialCommand: "*implement-story story-{id}"
})
```

### Task-by-Task Implementation

**CRITICAL:** The Developer must work ONE task at a time:

```
1. Read full story to understand context
2. Identify first incomplete task
3. Implement that task completely:
   - Write code
   - Write tests
   - Verify it works
   - Test manually if needed
4. Mark task as done
5. Move to next task
6. Repeat until all tasks complete
```

**Never:**
- Skip tasks
- Implement multiple tasks at once
- Write code without understanding the story
- Move on before completing current task

### Developer Responsibilities

The Developer will:
- Follow architecture guidelines
- Write clean, maintainable code
- Create tests alongside implementation
- Follow coding standards
- Document complex logic
- Verify each task works before proceeding

**Output locations:**
- Source code: `src/`
- Tests: `tests/` or `__tests__/`
- Documentation: Updated as needed

### Implementation Checklist

After each task:
- ✅ Code compiles/runs without errors
- ✅ Tests pass (unit and integration)
- ✅ Follows architecture patterns
- ✅ Code is readable and documented
- ✅ Meets acceptance criteria for that task

## Phase 3: QA - Quality Validation

Activate the QA agent to validate the implementation:

```
Use: bmad_activate_agent({
  agentName: "qa",
  projectPath: "[project-path]"
})
```

The QA agent will:
- Review code against story requirements
- Verify all acceptance criteria met
- Run all tests (unit, integration, e2e)
- Check code quality and standards
- Execute QA checklists
- Test edge cases
- Identify bugs or improvements

### QA Outcomes

**PASS:** Story complete and ready
- All acceptance criteria met
- All tests passing
- Code quality acceptable
- No critical issues
- → Move to next story

**FAIL:** Issues found that block acceptance
- Missing functionality
- Failing tests
- Critical bugs
- → Dev must fix, QA re-validates

**REFACTOR:** Works but needs improvement
- Code quality issues
- Performance concerns
- Maintainability problems
- → Dev refactors, QA re-validates

### QA Checklists

Available checklists via `bmad_list_checklists()`:
- `story-dod-checklist` - Definition of Done validation
- `code-quality-checklist` - Code review standards
- `test-coverage-checklist` - Test completeness
- `security-checklist` - Security best practices

## Iteration Management

### Starting a New Story

Before SM creates story:
1. Confirm previous story is complete (if any)
2. Verify planning documents are accessible
3. Ask user if specific epic or feature to focus on

### After Story Completion

After QA passes:
1. Congratulate the completion
2. Show progress: "[X] of [Y] stories complete"
3. Ask user: "Ready for the next story?"
4. If user says yes, loop back to SM phase
5. If user wants a break, save progress and pause

### Handling Failures

If QA fails validation:
1. Document specific issues found
2. Reactivate Developer with issue list
3. Dev addresses each issue
4. Reactivate QA to re-validate
5. Repeat until QA passes

**Do not** move to next story until current story passes QA.

## Examples

### Example 1: Authentication Epic

**Story 1:** User Registration

1. **SM:** Creates story with tasks:
   - Create User model and database schema
   - Implement registration API endpoint
   - Add password hashing and validation
   - Create registration form component
   - Write unit tests for User model
   - Write integration tests for registration flow

2. **Dev:** Implements each task sequentially:
   ```
   Task 1: User model ✓
   Task 2: API endpoint ✓
   Task 3: Password hashing ✓
   Task 4: Registration form ✓
   Task 5: Unit tests ✓
   Task 6: Integration tests ✓
   ```

3. **QA:** Validates:
   - Registration works end-to-end ✓
   - Password properly hashed ✓
   - Validation prevents invalid data ✓
   - Tests cover edge cases ✓
   - **PASS** - Story complete!

4. Ready for Story 2: User Login

### Example 2: Shopping Cart Feature

**Story:** Add items to cart

1. **SM:** Story with tasks for cart model, add item API, cart UI, persistence
2. **Dev:** Implements task-by-task with tests
3. **QA:** Tests adding items, quantity updates, persistence, cart total calculation
4. **Result:** Users can add products to cart

Next story: Remove items from cart

## Progress Tracking

Keep user informed with clear status updates:

```
📋 Story: User Authentication - Password Reset
📊 Progress: 4/7 tasks complete
✅ Completed:
   - Password reset request endpoint
   - Email token generation
   - Token validation
   - Reset password endpoint
🔄 Current: Creating password reset form
⏸️ Pending:
   - Write unit tests
   - Write integration tests
```

## User Interaction Points

### Before Starting
- Which epic/story to work on?
- Any specific priorities?

### During Development
- When Dev needs clarification on requirements
- When Dev needs design or UX decisions
- When Dev encounters technical blockers

### After QA
- Review QA findings
- Approve to move to next story
- Decide to fix issues vs. create follow-up story

### Between Stories
- Continue with next story?
- Take a break?
- Switch to different epic?

## Quality Standards

### Story Complete When:
- ✅ All tasks implemented and tested
- ✅ All acceptance criteria met
- ✅ All tests passing (unit, integration)
- ✅ Code follows architecture patterns
- ✅ Code reviewed for quality
- ✅ No critical bugs
- ✅ Documentation updated
- ✅ QA approved
- ✅ User confirmed satisfaction

### Code Quality Standards:
- Clean, readable code
- Proper error handling
- Security best practices followed
- Performance acceptable
- Maintainable and extensible
- Well-tested (>80% coverage for critical paths)

## Troubleshooting

**Story too large:** If a story seems too big (>8 tasks), ask SM to split it into multiple smaller stories.

**Blocked by dependency:** If Dev is blocked, note the blocker and either:
- Ask user for decision/input
- Temporarily move to different story
- Resolve blocker before continuing

**Tests failing:** Dev must fix failing tests before QA phase. Do not proceed with failing tests.

**QA keeps failing:** If a story fails QA 3+ times, consider:
- Requirements unclear (revisit PRD)
- Architecture issue (consult Architect)
- Story too complex (split into smaller stories)

**Missing context:** Agents need access to planning docs. Ensure:
- `docs/prd.md` exists and is complete
- `docs/architecture.md` exists and is complete
- Previous story files available for context

## Handling Special Cases

### Refactoring Tasks
If QA requests refactoring:
- Reactivate Dev with specific refactoring goals
- Dev improves code without changing functionality
- Rerun tests to ensure no regression
- QA re-validates

### Bug Fixes
If bugs found after story completion:
- Create new story for bug fix
- Or address in current sprint if critical

### Architecture Changes
If implementation reveals architecture issues:
- Pause development
- Consult with user
- May need to reactivate Architect
- Update architecture doc
- Resume with new guidance

## Epic Completion

When all stories in an epic are complete:
1. Celebrate completion!
2. Review what was built
3. Suggest running comprehensive QA across entire epic
4. Ask if user wants to:
   - Start next epic
   - Take a break
   - Deploy/release current work

## Next Actions

After development cycle:
- Continue with more stories
- Move to next epic
- Conduct comprehensive testing
- Prepare for deployment
- Plan next release

For advanced agent management, see [REFERENCE.md](REFERENCE.md)

## Tips for Success

- **One story at a time:** Don't parallel develop
- **Test as you go:** Don't save testing for end
- **Follow architecture:** It's there for a reason
- **Quality over speed:** Do it right the first time
- **Clear acceptance criteria:** Makes QA objective
- **Small, focused stories:** Easier to implement and test
- **Regular communication:** Keep user informed

## Related Skills

- `orchestrating-bmad-planning` - For creating the initial plan
- `managing-bmad-quality` - For comprehensive QA processes
