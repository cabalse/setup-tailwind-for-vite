import * as vscode from "vscode";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface ProjectInfo {
  isTypeScript: boolean;
  viteConfigPath: string;
  viteConfigExtension: string;
  indexCssPath: string;
}

function detectProjectType(workspacePath: string): ProjectInfo {
  // Check for TypeScript configuration files
  const tsConfigPath = path.join(workspacePath, "tsconfig.json");
  const jsConfigPath = path.join(workspacePath, "jsconfig.json");
  const packageJsonPath = path.join(workspacePath, "package.json");
  
  let isTypeScript = false;
  
  // Check if tsconfig.json exists
  if (fs.existsSync(tsConfigPath)) {
    isTypeScript = true;
  }
  
  // Check package.json for TypeScript dependencies
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      if (dependencies.typescript || dependencies['@types/react'] || dependencies['@types/node']) {
        isTypeScript = true;
      }
    } catch (error) {
      // Silently handle package.json read errors
    }
  }
  
  // Determine Vite config file path and extension
  let viteConfigPath = "";
  let viteConfigExtension = "";
  
  const possibleConfigs = [
    "vite.config.ts",
    "vite.config.js",
    "vite.config.mjs"
  ];
  
  for (const config of possibleConfigs) {
    const fullPath = path.join(workspacePath, config);
    if (fs.existsSync(fullPath)) {
      viteConfigPath = fullPath;
      viteConfigExtension = path.extname(config);
      break;
    }
  }
  
  // If no config found, default to TypeScript if project is TypeScript
  if (!viteConfigPath) {
    if (isTypeScript) {
      viteConfigPath = path.join(workspacePath, "vite.config.ts");
      viteConfigExtension = ".ts";
    } else {
      viteConfigPath = path.join(workspacePath, "vite.config.js");
      viteConfigExtension = ".js";
    }
  }
  
  const indexCssPath = path.join(workspacePath, "src", "index.css");
  
  return {
    isTypeScript,
    viteConfigPath,
    viteConfigExtension,
    indexCssPath
  };
}

function createViteConfig(workspacePath: string, projectInfo: ProjectInfo): void {
  const { viteConfigPath, viteConfigExtension, isTypeScript } = projectInfo;
  
  if (fs.existsSync(viteConfigPath)) {
    // Modify existing config
    let viteConfig = fs.readFileSync(viteConfigPath, "utf8");
    
    if (!viteConfig.includes("import tailwindcss from '@tailwindcss/vite'")) {
      viteConfig = `import tailwindcss from '@tailwindcss/vite';\n${viteConfig}`;
    }
    
    viteConfig = viteConfig.replace(
      /plugins:\s*\[\s*/,
      "plugins: [tailwindcss(), "
    );
    
    fs.writeFileSync(viteConfigPath, viteConfig, "utf8");
    vscode.window.showInformationMessage(
      `Updated ${path.basename(viteConfigPath)} with TailwindCSS.`
    );
  } else {
    // Create new config file
    const configContent = isTypeScript 
      ? `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})`
      : `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})`;
    
    fs.writeFileSync(viteConfigPath, configContent, "utf8");
    vscode.window.showInformationMessage(
      `Created ${path.basename(viteConfigPath)} with TailwindCSS configuration.`
    );
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "setup-tailwind-for-vite" is now active!'
  );

  const disposable = vscode.commands.registerCommand(
    "setup-tailwind-for-vite.run",
    () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage(
          "No workspace detected. Open a Vite project."
        );
        return;
      }

      const workspacePath = workspaceFolders[0].uri.fsPath;
      
      try {
        // Detect project type and configuration
        const projectInfo = detectProjectType(workspacePath);
        
        const projectType = projectInfo.isTypeScript ? "TypeScript" : "JavaScript";
        vscode.window.showInformationMessage(
          `Detected ${projectType} project. Installing Tailwind CSS...`
        );

        // Install dependencies
        execSync("npm install tailwindcss @tailwindcss/vite", {
          cwd: workspacePath,
          stdio: "inherit",
        });

        // Handle Vite configuration
        createViteConfig(workspacePath, projectInfo);

        // Modify src/index.css
        if (fs.existsSync(projectInfo.indexCssPath)) {
          fs.writeFileSync(projectInfo.indexCssPath, '@import "tailwindcss";\n', "utf8");
          vscode.window.showInformationMessage(
            "Updated src/index.css with Tailwind import."
          );
        } else {
          // Create index.css if it doesn't exist
          const cssDir = path.dirname(projectInfo.indexCssPath);
          if (!fs.existsSync(cssDir)) {
            fs.mkdirSync(cssDir, { recursive: true });
          }
          fs.writeFileSync(projectInfo.indexCssPath, '@import "tailwindcss";\n', "utf8");
          vscode.window.showInformationMessage(
            "Created src/index.css with Tailwind import."
          );
        }

        // Create Tailwind config file if it doesn't exist
        const tailwindConfigPath = path.join(workspacePath, "tailwind.config.js");
        if (!fs.existsSync(tailwindConfigPath)) {
          const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
          fs.writeFileSync(tailwindConfigPath, tailwindConfig, "utf8");
          vscode.window.showInformationMessage(
            "Created tailwind.config.js with content paths for both JS and TS files."
          );
        }

        vscode.window.showInformationMessage(
          `Tailwind setup complete for ${projectType} project!`
        );
      } catch (error) {
        vscode.window.showErrorMessage("Error setting up Tailwind: " + error);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
