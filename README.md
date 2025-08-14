# setup-tailwind-for-vite README

This extension adds Tailwind CSS to new VITE React projects, supporting both JavaScript and TypeScript. Run this extension when you have created a new project using "npm create vite@latest".

The extension automatically detects your project type and does the following:

1. **Detects Project Type**: Automatically identifies if your project is JavaScript or TypeScript based on configuration files and dependencies.
2. **Installs Dependencies**: Runs "npm install tailwindcss @tailwindcss/vite".
3. **Configures Vite**:
   - For existing projects: Modifies your vite.config.ts/js to include Tailwind
   - For new projects: Creates a proper vite.config.ts/js with Tailwind configuration
4. **Sets up CSS**: Creates or updates src/index.css with Tailwind imports
5. **Creates Tailwind Config**: Generates a tailwind.config.js with proper content paths for both JS and TS files

## Features

- **Automatic Project Detection**: Works with both JavaScript and TypeScript React projects
- **Smart Configuration**: Handles existing and new Vite configurations
- **Flexible File Support**: Works with vite.config.ts, vite.config.js, or vite.config.mjs
- **Complete Setup**: Creates all necessary configuration files if they don't exist
- **TypeScript Aware**: Generates proper TypeScript configurations when needed

## Usage

Run the extension using the command palette [Ctrl+Shift+P] and type "Setup Tailwind: VITE (JS/TS)"

## Requirements

Requires a React VITE project (new or existing) that follows the template project structure as of VITE version 6.2.0.

## Supported Project Types

- **JavaScript React**: Projects with .js files and no TypeScript configuration
- **TypeScript React**: Projects with .ts/.tsx files, tsconfig.json, or TypeScript dependencies

## Release Notes

### 1.2.0

- Added TypeScript project support
- Automatic project type detection
- Support for multiple Vite config file formats (.ts, .js, .mjs)
- Automatic creation of missing configuration files
- Improved error handling and user feedback
- Updated command title to reflect JS/TS support

### 1.0.0

- Minor changes

### 1.0.0

Initial release
