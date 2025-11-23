# tty1

A fullscreen, mobile-friendly web terminal built with React, TypeScript, Vite, and xterm.js.

## Features

- Fullscreen terminal interface
- Mobile-friendly and responsive
- Command history (up/down arrows)
- Custom command system
- Built-in commands: help, clear, echo, date, whoami, uname, calc, random, lorem

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Custom Commands

The terminal includes several built-in commands. To add your own custom commands, edit `src/commands.ts`:

```typescript
{
  name: 'mycommand',
  description: 'My custom command',
  usage: 'mycommand <args>',
  handler: (args, ctx) => {
    ctx.writeLine('Hello from my command!');
  }
}
```

## Tech Stack

- React
- TypeScript
- Vite
- xterm.js
- FitAddon for responsive terminal sizing
