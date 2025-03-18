import * as vscode from "vscode";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

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
      const viteConfigPath = path.join(workspacePath, "vite.config.ts");
      const indexCssPath = path.join(workspacePath, "src", "index.css");

      try {
        vscode.window.showInformationMessage("Installing Tailwind CSS...");

        // Install dependencies
        execSync("npm install tailwindcss @tailwindcss/vite", {
          cwd: workspacePath,
          stdio: "inherit",
        });

        // Modify vite.config.ts
        if (fs.existsSync(viteConfigPath)) {
          let viteConfig = fs.readFileSync(viteConfigPath, "utf8");

          if (
            !viteConfig.includes("import tailwindcss from '@tailwindcss/vite'")
          ) {
            viteConfig = `import tailwindcss from '@tailwindcss/vite';\n${viteConfig}`;
          }

          viteConfig = viteConfig.replace(
            /plugins:\s*\[\s*/,
            "plugins: [tailwindcss(), "
          );

          fs.writeFileSync(viteConfigPath, viteConfig, "utf8");
          vscode.window.showInformationMessage(
            "Updated vite.config.ts with TailwindCSS."
          );
        } else {
          vscode.window.showErrorMessage(
            "vite.config.ts not found. Make sure you're in a Vite project."
          );
        }

        // Modify src/index.css
        if (fs.existsSync(indexCssPath)) {
          fs.writeFileSync(indexCssPath, '@import "tailwindcss";\n', "utf8");
          vscode.window.showInformationMessage(
            "Updated src/index.css with Tailwind import."
          );
        } else {
          vscode.window.showErrorMessage(
            "src/index.css not found. Make sure you're in a Vite project."
          );
        }

        vscode.window.showInformationMessage("Tailwind setup complete!");
      } catch (error) {
        vscode.window.showErrorMessage("Error setting up Tailwind: " + error);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
