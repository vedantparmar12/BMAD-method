#!/usr/bin/env node

/**
 * BMAD-METHOD MCP Server
 * Entry point for the Model Context Protocol server
 */

import { BmadMcpServer } from './server.js';
import { logger } from './utils/logger.js';

async function main() {
  try {
    logger.info('Starting BMAD-METHOD MCP Server...');

    const server = new BmadMcpServer();
    await server.start();

    // Server will run until interrupted
  } catch (error) {
    logger.error('Fatal error starting server:', error);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

main();
