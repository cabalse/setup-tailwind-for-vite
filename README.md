# setup-tailwind-for-vite README

This simple extension adds Tailwind to a new unmodified VITE React project. Run this extension when you have created a new project using "npm create vite@latest".
The extension does the following:

1. Runs "npm install --d tailwindcss @tailwindcss/vite".
2. Adds the following lines to vite.config.ts "import tailwindcss from '@tailwindcss/vite'" to the top of the file and "tailwindcss()," to the plugin section.
3. Clear the index.css file and add the line "@import "tailwindcss"";

## Features

Nothing more than described above.

## Requirements

Requires the React VITE project to be new and follow the template project as of VITE version 6.2.0.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release
