# BMAD MCP Server - Installation & Testing Guide

## Quick Installation Steps

### 1. Install Dependencies

```bash
cd C:\Users\vedan\Desktop\mcp-rag\BMAD-Context\BMAD-METHOD\mcp-server
npm install
```

Expected output:
```
added XX packages
```

### 2. Build the Server

```bash
npm run build
```

Expected output:
```
Successfully compiled TypeScript
dist/ directory created
```

Verify build:
```bash
dir dist
```

You should see:
- index.js
- server.js
- services/
- utils/
- types/

### 3. Configure Claude Code

**Windows Configuration Path**:
```
C:\Users\vedan\AppData\Roaming\Claude\claude_desktop_config.json
```

**Configuration to Add**:
```json
{
  "mcpServers": {
    "bmad-method": {
      "command": "node",
      "args": [
        "C:\\Users\\vedan\\Desktop\\mcp-rag\\BMAD-Context\\BMAD-METHOD\\mcp-server\\dist\\index.js"
      ],
      "env": {
        "BMAD_CORE_PATH": "C:\\Users\\vedan\\Desktop\\mcp-rag\\BMAD-Context\\BMAD-METHOD\\bmad-core",
        "BMAD_LOG_LEVEL": "debug"
      }
    }
  }
}
```

**⚠️ Important Notes**:
- Use double backslashes `\\` for Windows paths in JSON
- Or use forward slashes `/` which work on all platforms
- These must be absolute paths, not relative

**Alternative with forward slashes** (recommended):
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
        "BMAD_LOG_LEVEL": "debug"
      }
    }
  }
}
```

### 4. Restart Claude Code

Close and reopen Claude Code completely for the configuration to take effect.

---

## Testing the Installation

### Test 1: Verify MCP Server Loads

After restarting Claude Code, check the MCP server status:

**In Claude Code, type**:
```
What MCP servers are currently connected?
```

**Expected**: Claude should report that `bmad-method` server is connected.

### Test 2: List Agents

**In Claude Code, type**:
```
Can you list all available BMAD agents?
```

**Expected Response**:
Claude will use the `bmad_list_agents` tool and return a list including:
- bmad-orchestrator
- bmad-master
- analyst
- pm
- architect
- ux-expert
- po
- sm
- dev
- qa

### Test 3: Get Agent Details

**In Claude Code, type**:
```
Show me detailed information about the Developer agent
```

**Expected Response**:
Claude will use `bmad_get_agent` with `agentName: "dev"` and return:
- Agent name and display name
- Role and responsibilities
- Available commands
- Dependencies
- Primary domain

### Test 4: List Templates

**In Claude Code, type**:
```
What document templates are available in BMAD?
```

**Expected Response**:
Claude will use `bmad_list_templates` and return templates like:
- prd-tmpl
- architecture-tmpl
- story-tmpl
- project-brief-tmpl
- etc.

### Test 5: Activate an Agent

**In Claude Code, type**:
```
Activate the Analyst agent
```

**Expected Response**:
Claude will use `bmad_activate_agent` with `agentName: "analyst"` and return:
- Complete agent context
- Agent persona
- Activation instructions
- Available commands
- An activation prompt

### Test 6: Get Workflow

**In Claude Code, type**:
```
Show me the greenfield-fullstack workflow
```

**Expected Response**:
Claude will use `bmad_get_workflow` and return:
- Workflow name and description
- All phases
- Agents involved in each phase
- Deliverables

---

## Troubleshooting Installation

### Problem: Cannot find module '@modelcontextprotocol/sdk'

**Solution**:
```bash
cd mcp-server
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Problem: TypeScript compilation errors

**Solution**:
```bash
# Install TypeScript globally if needed
npm install -g typescript

# Rebuild
npm run build
```

### Problem: MCP server not showing in Claude Code

**Checklist**:
1. ✅ Paths in config are absolute (not relative)
2. ✅ Paths use forward slashes or double backslashes
3. ✅ `dist/index.js` exists after build
4. ✅ Claude Code was restarted after config change
5. ✅ No JSON syntax errors in config file

**Verify config syntax**:
```bash
# On Windows, validate JSON:
python -m json.tool "%APPDATA%\Claude\claude_desktop_config.json"
```

### Problem: "Agent not found" errors

**Solution**:
1. Verify `BMAD_CORE_PATH` points to correct directory
2. Check that `bmad-core/agents/` contains .md files
3. Set `BMAD_LOG_LEVEL` to `debug` to see detailed logs

**Test path manually**:
```bash
dir C:\Users\vedan\Desktop\mcp-rag\BMAD-Context\BMAD-METHOD\bmad-core\agents
```

Should show: analyst.md, pm.md, dev.md, etc.

### Problem: Server crashes on startup

**Check logs**:
1. Look in Claude Code's MCP server output panel
2. Look for error messages in the console

**Common issues**:
- Missing `bmad-core` directory
- Incorrect path separators
- Permission issues

**Solution**:
```bash
# Ensure bmad-core exists
dir C:\Users\vedan\Desktop\mcp-rag\BMAD-Context\BMAD-METHOD\bmad-core

# Check it has subdirectories
dir C:\Users\vedan\Desktop\mcp-rag\BMAD-Context\BMAD-METHOD\bmad-core
```

Should show:
- agents/
- tasks/
- templates/
- workflows/
- checklists/
- data/

---

## Verifying Each Component

### Verify Package Installation

```bash
cd mcp-server
npm list --depth=0
```

Should show all dependencies including:
- @modelcontextprotocol/sdk
- chalk
- fs-extra
- glob
- js-yaml
- zod

### Verify TypeScript Compilation

```bash
npm run build
```

Should complete without errors and create `dist/` folder.

### Verify Server Can Start

```bash
node dist/index.js
```

**Expected**: Server should start and log:
```
[timestamp] [BMAD-MCP] INFO: Starting BMAD-METHOD MCP Server...
[timestamp] [BMAD-MCP] INFO: BMAD Core Path: ...
[timestamp] [BMAD-MCP] INFO: BMAD Core Service initialized successfully
[timestamp] [BMAD-MCP] INFO: Registered X tools
[timestamp] [BMAD-MCP] INFO: BMAD MCP Server started and listening on stdio
```

Press Ctrl+C to stop the test.

### Verify BMAD Core Access

```bash
node -e "console.log(require('fs').readdirSync('C:/Users/vedan/Desktop/mcp-rag/BMAD-Context/BMAD-METHOD/bmad-core/agents'))"
```

Should output array of agent files: `['analyst.md', 'architect.md', ...]`

---

## Testing with MCP CLI (Optional)

If you have the MCP CLI tool installed, you can test directly:

```bash
npx @modelcontextprotocol/cli connect node dist/index.js
```

Then in the CLI:
```
> tools list
> tools call bmad_list_agents {}
> tools call bmad_get_agent {"agentName": "dev"}
```

---

## Next Steps After Successful Installation

1. **Try the Planning Workflow**:
   ```
   "Let's use BMAD to plan a new web application"
   ```

2. **Explore Agents**:
   ```
   "Show me what each BMAD agent does"
   ```

3. **Use a Skill**:
   ```
   "Use the BMAD planning skill to plan my project"
   ```

4. **Activate an Agent**:
   ```
   "Activate the Developer agent to start coding"
   ```

---

## Success Criteria

Your installation is successful when:

- ✅ MCP server builds without errors
- ✅ Configuration file is valid JSON
- ✅ Claude Code shows bmad-method server connected
- ✅ You can list agents successfully
- ✅ You can get agent details
- ✅ You can activate agents
- ✅ All MCP tools are available

---

## Getting Help

If you encounter issues:

1. **Check Logs**: Set `BMAD_LOG_LEVEL: "debug"` in config
2. **Verify Paths**: Ensure all paths are absolute and correct
3. **Rebuild**: Try `npm run build` again
4. **Restart**: Completely close and reopen Claude Code
5. **Test Manually**: Try running `node dist/index.js` to see errors

For further assistance, check:
- `README.md` - General information
- `USAGE_GUIDE.md` - Detailed usage instructions
- `ARCHITECTURE.md` - Technical architecture details

---

**You're ready to use BMAD with Claude! 🎉**
