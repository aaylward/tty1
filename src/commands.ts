export interface CommandContext {
  writeLine: (text: string) => void;
  write: (text: string) => void;
  clear: () => void;
}

export type CommandHandler = (args: string[], ctx: CommandContext) => void | Promise<void>;

export interface Command {
  name: string;
  description: string;
  usage?: string;
  handler: CommandHandler;
}

const commands: Command[] = [
  {
    name: 'help',
    description: 'Display available commands',
    handler: (args, ctx) => {
      ctx.writeLine('Available commands:');
      ctx.writeLine('');
      commands.forEach(cmd => {
        ctx.writeLine(`  ${cmd.name.padEnd(15)} - ${cmd.description}`);
        if (cmd.usage) {
          ctx.writeLine(`                   Usage: ${cmd.usage}`);
        }
      });
      ctx.writeLine('');
    }
  },
  {
    name: 'clear',
    description: 'Clear the terminal screen',
    handler: (args, ctx) => {
      ctx.clear();
    }
  },
  {
    name: 'echo',
    description: 'Print text to the terminal',
    usage: 'echo <text>',
    handler: (args, ctx) => {
      ctx.writeLine(args.join(' '));
    }
  },
  {
    name: 'date',
    description: 'Display current date and time',
    handler: (args, ctx) => {
      ctx.writeLine(new Date().toString());
    }
  },
  {
    name: 'whoami',
    description: 'Display current user information',
    handler: (args, ctx) => {
      ctx.writeLine('guest');
    }
  },
  {
    name: 'uname',
    description: 'Display system information',
    handler: (args, ctx) => {
      ctx.writeLine('Web Terminal v1.0.0');
      ctx.writeLine(`Platform: ${navigator.platform}`);
      ctx.writeLine(`User Agent: ${navigator.userAgent}`);
    }
  },
  {
    name: 'calc',
    description: 'Simple calculator',
    usage: 'calc <expression>',
    handler: (args, ctx) => {
      const expression = args.join(' ');
      if (!expression) {
        ctx.writeLine('Usage: calc <expression>');
        return;
      }
      try {
        // Simple eval for basic math - in production, use a proper parser
        const result = Function('"use strict"; return (' + expression + ')')();
        ctx.writeLine(`${expression} = ${result}`);
      } catch {
        ctx.writeLine(`Error: Invalid expression`);
      }
    }
  },
  {
    name: 'random',
    description: 'Generate random number',
    usage: 'random [min] [max]',
    handler: (args, ctx) => {
      const min = args[0] ? parseInt(args[0]) : 0;
      const max = args[1] ? parseInt(args[1]) : 100;
      const random = Math.floor(Math.random() * (max - min + 1)) + min;
      ctx.writeLine(`${random}`);
    }
  },
  {
    name: 'lorem',
    description: 'Generate lorem ipsum text',
    usage: 'lorem [words]',
    handler: (args, ctx) => {
      const words = args[0] ? parseInt(args[0]) : 50;
      const loremWords = [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur',
        'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor',
        'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'
      ];
      const result: string[] = [];
      for (let i = 0; i < words; i++) {
        result.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
      }
      ctx.writeLine(result.join(' '));
    }
  },
];

export function executeCommand(input: string, ctx: CommandContext): void {
  const trimmed = input.trim();
  if (!trimmed) return;

  const parts = trimmed.split(/\s+/);
  const commandName = parts[0].toLowerCase();
  const args = parts.slice(1);

  const command = commands.find(cmd => cmd.name === commandName);

  if (command) {
    try {
      command.handler(args, ctx);
    } catch (e) {
      ctx.writeLine(`Error executing command: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  } else {
    ctx.writeLine(`Command not found: ${commandName}`);
    ctx.writeLine(`Type 'help' for available commands`);
  }
}

export function getCommands(): Command[] {
  return commands;
}
