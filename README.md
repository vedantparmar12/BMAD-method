# BMAD Method

> **B**uild **M**ore **A**gent **D**riven - A Structured Multi-Agent Framework for Software Development

[![Version](https://img.shields.io/badge/version-4.30.3-blue.svg)](https://github.com/vedantparmar12/BMAD-method)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](package.json)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Agent Teams](#agent-teams)
- [Workflows](#workflows)
- [Expansion Packs](#expansion-packs)
- [MCP Server](#mcp-server)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [Documentation](#documentation)
- [License](#license)

## 🎯 Overview

BMAD Method is a sophisticated multi-agent system designed to streamline software development through structured workflows and specialized AI agents. It provides a comprehensive framework for managing both **greenfield** (new projects) and **brownfield** (existing projects) development scenarios.

### What is BMAD?

BMAD orchestrates multiple specialized AI agents that work together to handle different aspects of software development:

- **Product Management**: Requirements gathering, user story creation
- **Architecture**: System design, technical decisions
- **Development**: Implementation, code review
- **Quality Assurance**: Testing, validation
- **Project Management**: Sprint planning, task tracking

## ✨ Features

### Core Features

- 🤖 **Multi-Agent Architecture**: 10+ specialized agents for different development roles
- 📝 **Structured Workflows**: Pre-defined workflows for common development scenarios
- 🎨 **Template System**: YAML-based templates for consistent documentation
- 🔧 **Task Automation**: Automated task execution with checklists
- 📊 **Progress Tracking**: Built-in monitoring and reporting
- 🎯 **Brownfield Support**: Specialized tools for working with existing codebases

### Advanced Capabilities

- **Elicitation Methods**: Advanced requirement gathering techniques
- **Brainstorming Support**: Facilitated ideation sessions
- **Document Generation**: Automated PRD, architecture docs, and user stories
- **Change Management**: Structured approach to code modifications
- **Knowledge Base**: Integrated BMAD knowledge and best practices

## 📁 Project Structure

```
BMAD-method/
├── bmad-core/                 # Core framework components
│   ├── agents/                # Agent definitions (10 agents)
│   ├── agent-teams/           # Pre-configured team compositions
│   ├── checklists/            # Quality checklists
│   ├── data/                  # Knowledge base and guidelines
│   ├── tasks/                 # Task definitions
│   ├── templates/             # Document templates (12 templates)
│   └── workflows/             # Workflow definitions (6 workflows)
│
├── expansion-packs/           # Additional specialized capabilities
│   ├── bmad-2d-phaser-game-dev/
│   ├── bmad-2d-unity-game-dev/
│   └── bmad-infrastructure-devops/
│
├── mcp-server/                # Model Context Protocol server
│   ├── src/
│   │   ├── services/          # Core services
│   │   ├── types/             # TypeScript definitions
│   │   └── utils/             # Utility functions
│   └── package.json
│
├── claude-skills/             # Claude AI integration skills
│   ├── bmad-development/
│   ├── bmad-planning/
│   └── orchestrating-*/
│
├── tools/                     # CLI and build tools
│   ├── installer/             # Installation utilities
│   ├── builders/              # Build scripts
│   └── upgraders/             # Version migration tools
│
└── docs/                      # Documentation
    ├── core-architecture.md
    ├── expansion-packs.md
    ├── GUIDING-PRINCIPLES.md
    └── versions.md
```

## 🚀 Installation

### Prerequisites

- Node.js >= 16.0.0
- npm or yarn
- Git

### Install via NPX

```bash
npx bmad-method
```

### Install Globally

```bash
npm install -g bmad-method
```

### Install from Source

```bash
# Clone the repository
git clone https://github.com/vedantparmar12/BMAD-method.git
cd BMAD-method

# Install dependencies
npm install

# Build the project
npm run build
```

## 🎓 Quick Start

### 1. Initialize a New Project

```bash
bmad init
```

### 2. Select Your Team

Choose from pre-configured teams:
- **team-all**: Full team with all agents
- **team-fullstack**: Frontend and backend development
- **team-no-ui**: Backend-focused team
- **team-ide-minimal**: Minimal IDE setup

### 3. Choose Your Workflow

Select a workflow based on your project type:

**Greenfield (New Projects):**
- `greenfield-fullstack`: Complete full-stack application
- `greenfield-service`: Backend service
- `greenfield-ui`: Frontend application

**Brownfield (Existing Projects):**
- `brownfield-fullstack`: Enhance existing full-stack app
- `brownfield-service`: Modify backend service
- `brownfield-ui`: Update frontend application

### 4. Start Development

```bash
bmad start --workflow greenfield-fullstack
```

## 🧠 Core Concepts

### Agents

BMAD includes 10 specialized agents:

1. **BMAD Master** - Overall orchestration and coordination
2. **BMAD Orchestrator** - Workflow management
3. **Product Owner (PO)** - Requirements and user stories
4. **Product Manager (PM)** - Strategic planning
5. **Business Analyst** - Requirements analysis
6. **Architect** - Technical design
7. **Developer** - Implementation
8. **QA Engineer** - Testing and validation
9. **Scrum Master (SM)** - Process facilitation
10. **UX Expert** - User experience design

### Workflows

Workflows define the sequence of tasks and agent interactions:

```yaml
name: greenfield-fullstack
description: Complete full-stack application development
phases:
  - discovery
  - planning
  - architecture
  - development
  - testing
  - deployment
```

### Templates

YAML-based templates ensure consistent documentation:

- **PRD Template**: Product requirements document
- **Architecture Template**: Technical design document
- **Story Template**: User story format
- **Project Brief**: High-level overview
- **And more...**

### Checklists

Quality gates for different phases:

- **Story Draft Checklist**: Validate user stories
- **Story DOD Checklist**: Definition of done
- **Architect Checklist**: Architecture review
- **PM Checklist**: Project management validation
- **Change Checklist**: Code modification review

## 👥 Agent Teams

### Team Compositions

#### Full Team (team-all)
Includes all 10 agents for comprehensive coverage.

```yaml
name: team-all
agents:
  - bmad-master
  - bmad-orchestrator
  - po
  - pm
  - analyst
  - architect
  - dev
  - qa
  - sm
  - ux-expert
```

#### Fullstack Team (team-fullstack)
Optimized for full-stack development.

```yaml
name: team-fullstack
agents:
  - po
  - architect
  - dev
  - qa
  - ux-expert
```

#### Backend Team (team-no-ui)
Focused on backend services.

```yaml
name: team-no-ui
agents:
  - po
  - architect
  - dev
  - qa
```

#### Minimal IDE Team (team-ide-minimal)
Lightweight setup for IDE integration.

```yaml
name: team-ide-minimal
agents:
  - dev
  - architect
```

## 🔄 Workflows

### Greenfield Workflows

#### 1. Greenfield Fullstack

Complete application development from scratch.

**Phases:**
1. **Brainstorming** - Initial ideation
2. **Requirements** - Detailed PRD creation
3. **Architecture** - System design
4. **Implementation** - Story-by-story development
5. **Testing** - QA validation
6. **Deployment** - Production release

**Involved Agents:** All team members

#### 2. Greenfield Service

Backend-focused service development.

**Key Activities:**
- API design
- Database schema
- Business logic
- Integration points

#### 3. Greenfield UI

Frontend-focused application development.

**Key Activities:**
- UI/UX design
- Component architecture
- State management
- Responsive design

### Brownfield Workflows

#### 1. Brownfield Fullstack

Enhance existing full-stack applications.

**Phases:**
1. **Analysis** - Codebase understanding
2. **Planning** - Change impact assessment
3. **Implementation** - Careful modifications
4. **Testing** - Regression testing
5. **Documentation** - Update existing docs

#### 2. Brownfield Service

Modify existing backend services.

**Focus Areas:**
- Code quality improvement
- Performance optimization
- Feature additions
- Bug fixes

#### 3. Brownfield UI

Update existing frontend applications.

**Focus Areas:**
- UI/UX improvements
- Component refactoring
- Accessibility enhancements
- Performance optimization

## 🎮 Expansion Packs

### Available Expansion Packs

#### 1. BMAD 2D Phaser Game Development

Specialized framework for Phaser.js game development.

**Includes:**
- Game Designer agent
- Game Developer agent
- Game-specific workflows
- Level design templates
- Game architecture patterns

**Setup:**
```bash
bmad install-expansion bmad-2d-phaser-game-dev
```

#### 2. BMAD 2D Unity Game Development

Framework for Unity 2D game development.

**Includes:**
- Unity-specific agents
- C# development guidelines
- Unity architecture templates
- Game design workflows

**Setup:**
```bash
bmad install-expansion bmad-2d-unity-game-dev
```

#### 3. BMAD Infrastructure DevOps

Infrastructure and DevOps automation.

**Includes:**
- Infrastructure Platform agent
- DevOps checklists
- Architecture templates
- Validation workflows

**Setup:**
```bash
bmad install-expansion bmad-infrastructure-devops
```

### Creating Custom Expansion Packs

Structure:
```
expansion-packs/
└── my-custom-pack/
    ├── config.yaml
    ├── agents/
    ├── workflows/
    ├── templates/
    ├── checklists/
    └── data/
```

## 🌐 MCP Server

### Model Context Protocol Integration

The MCP server provides a standardized interface for AI model interactions.

#### Architecture

```typescript
// Server setup
import { Server } from '@modelcontextprotocol/sdk/server';
import { BmadCore } from './services/bmad-core';

const server = new Server({
  name: 'bmad-mcp-server',
  version: '1.0.0'
});
```

#### Key Services

**Agent Manager** (`agent-manager.ts`):
- Agent lifecycle management
- Task routing
- State management

**BMAD Core** (`bmad-core.ts`):
- Workflow execution
- Template processing
- Document generation

#### Running the MCP Server

```bash
cd mcp-server
npm install
npm run build
npm start
```

#### Configuration

```yaml
# mcp-server/config.yaml
server:
  port: 3000
  host: localhost
agents:
  enabled: true
  max_concurrent: 5
logging:
  level: info
```

## ⚙️ Configuration

### Core Configuration

`bmad-core/core-config.yaml`:

```yaml
version: 4.30.3
agents_dir: ./bmad-core/agents
teams_dir: ./bmad-core/agent-teams
workflows_dir: ./bmad-core/workflows
templates_dir: ./bmad-core/templates
checklists_dir: ./bmad-core/checklists
data_dir: ./bmad-core/data
```

### IDE Configuration

`tools/installer/config/ide-agent-config.yaml`:

```yaml
ide:
  vscode:
    enabled: true
    extensions:
      - yaml
      - markdown
  cursor:
    enabled: true
  agents:
    default_team: team-fullstack
```

### Installation Configuration

`tools/installer/config/install.config.yaml`:

```yaml
installation:
  type: full
  components:
    - bmad-core
    - mcp-server
    - claude-skills
  expansion_packs: []
  output_dir: ./dist
```

## 🛠️ CLI Commands

### Basic Commands

```bash
# Initialize project
bmad init

# List available agents
bmad agents list

# List available workflows
bmad workflows list

# Start a workflow
bmad start --workflow <workflow-name>

# Check version
bmad --version

# Get help
bmad --help
```

### Advanced Commands

```bash
# Custom team creation
bmad team create my-team --agents dev,qa,architect

# Document generation
bmad generate-doc --type prd --template project-brief

# Workflow execution
bmad execute --workflow greenfield-fullstack --phase planning

# Agent interaction
bmad agent run --agent po --task create-story

# Validation
bmad validate --checklist story-dod
```

## 🧪 Development

### Project Scripts

```json
{
  "scripts": {
    "build": "Build the project",
    "test": "Run tests",
    "lint": "Lint code",
    "format": "Format code with Prettier",
    "release": "Create release with semantic-release",
    "prepare": "Setup husky hooks"
  }
}
```

### Running Tests

```bash
npm test
```

### Code Quality

```bash
# Lint
npm run lint

# Format
npm run format

# Type check
npm run type-check
```

## 📚 Documentation

### Core Documentation

- [Core Architecture](docs/core-architecture.md)
- [Guiding Principles](docs/GUIDING-PRINCIPLES.md)
- [Expansion Packs](docs/expansion-packs.md)
- [Versioning & Releases](docs/versioning-and-releases.md)
- [Version History](docs/versions.md)

### User Guides

- [BMAD Core User Guide](bmad-core/user-guide.md)
- [Working in the Brownfield](bmad-core/working-in-the-brownfield.md)
- [Claude Skills Guide](CLAUDE_SKILLS_GUIDE.md)
- [MCP Server Usage](mcp-server/USAGE_GUIDE.md)

### Technical Documentation

- [MCP Server Architecture](mcp-server/ARCHITECTURE.md)
- [Installation & Testing](mcp-server/INSTALLATION_TEST.md)
- [MCP Server Summary](MCP_SERVER_SUMMARY.md)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Areas

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🧪 Test coverage
- 🎨 UI/UX enhancements
- 🔧 Tool improvements
- 🎮 New expansion packs

### Development Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/BMAD-method.git
cd BMAD-method

# Install dependencies
npm install

# Create a branch
git checkout -b feature/my-feature

# Make changes and test
npm test
npm run lint

# Commit and push
git commit -m "Description of changes"
git push origin feature/my-feature
```

## 📦 Dependencies

### Core Dependencies

- `@kayvan/markdown-tree-parser`: ^1.5.0
- `chalk`: ^4.1.2
- `commander`: ^14.0.0
- `fs-extra`: ^11.3.0
- `glob`: ^11.0.3
- `inquirer`: ^8.2.6
- `js-yaml`: ^4.1.0
- `ora`: ^5.4.1

### Dev Dependencies

- `@semantic-release/changelog`: ^6.0.3
- `@semantic-release/git`: ^10.0.1
- `husky`: ^9.1.7
- `lint-staged`: ^16.1.1
- `prettier`: ^3.5.3
- `semantic-release`: ^22.0.0
- `yaml-lint`: ^1.7.0

## 📈 Metrics

- **Total Files**: 208
- **Agents**: 10 core agents + expansion agents
- **Workflows**: 6 core workflows + expansion workflows
- **Templates**: 12 core templates + expansion templates
- **Checklists**: 6 core checklists
- **Languages**: TypeScript, JavaScript, YAML, Markdown

## 🔒 Security

For security issues, please see our [Security Policy](.github/SECURITY.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- The Claude AI team for AI capabilities
- The Model Context Protocol community
- All contributors and users of BMAD Method

## 📞 Support

- 📧 Issues: [GitHub Issues](https://github.com/vedantparmar12/BMAD-method/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/vedantparmar12/BMAD-method/discussions)
- 📖 Documentation: [docs/](docs/)

## 🗺️ Roadmap

- [ ] Enhanced agent collaboration
- [ ] Real-time workflow monitoring
- [ ] Cloud deployment support
- [ ] Additional expansion packs
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Integration with popular IDEs

---

**Built with ❤️ by the BMAD community**

**Version**: 4.30.3 | **Last Updated**: October 2025
