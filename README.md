# Overview
This project is for a custom-made terminal emulator built in `JavaScript`, for use in web applications

> [!TIP]
> - 🚀 You can view the live demo [here](https://scarletti-ben.github.io/my-term)
> - 📁 You can view `terminal-widget.js` [here](./docs/components/terminal-widget.js)

# Information (WIP)
The most important file within this project is [`terminal-widget.js`](./docs/components/terminal-widget.js). The other files within this repository only serve to [showcase](https://scarletti-ben.github.io/my-term) the component on `GitHub` pages.

## Useful Snippets

- Imports from `terminal-widget.js`
  ```javascript
  import {
      TerminalWidget,
      TerminalShell,
      TerminalCommand,
      TerminalHijacker
  } from "./components/terminal-widget.js";
  ```
- Adding a terminal widget to a container 
  ```javascript
  // ~ Create terminal widget element
  const widget = new TerminalWidget();

  // ~ Get the container element to put the terminal widget into
  const container = document.getElementById('container');

  // ~ Add the terminal widget to the container
  container.appendChild(widget);
  ```

- Adding a shell to the terminal widget
  ```javascript
  // ~ Create a shell instance
  const shell = new TerminalShell('shell-name');

  // ~ Attach shell to terminal widget
  shell.attachTo(widget);
  ```

- Adding a command to the shell
  ```javascript
  // ~ Create a new command to clear the terminal widget screen
  const command = new TerminalCommand('clear', (widget, shell, command, ...args) => {
      widget.clearScreen();
  }),

  // ~ Add the new command to the shell
  shell.commands.push(command)
  ```

- Alternative methods for adding a widget to a container
```javascript
// ~ Create terminal widget within a container
const widget = TerminalWidget.create(container);

// ~ Create terminal widget and shell
const { widget , shell } = TerminalWidget.createDefault(container);
```

You can find a full example that uses some of the snippets above in [`index.js`](./docs/index.js)

> [!NOTE]
> You can also add a hijacker to a shell, though this feature is experimental and has not yet been documented

# Demos
- [Blackjack](https://scarletti-ben.github.io/my-term?demo=blackjack)

# Dependencies
This project currently does not have any dependencies

# License
This project is licensed under the MIT license - see [LICENSE](LICENSE) for details

# Project Metadata
```yaml
---
title: "my-term"
date: "2025-07-10"
last_modified_at: "2025-07-23"
description: "Custom-made terminal emulator built in JavaScript, for use in web applications"
categories: [
  miscellaneous
]
tags: [
  coding, dev, webdev, javascript, html, css, cli, command line interface, terminal, my-term, myterm, shell
]
---
```