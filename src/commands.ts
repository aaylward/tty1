import { sendMessage } from './api';

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
];

export async function executeCommand(input: string, ctx: CommandContext): Promise<void> {
  const trimmed = input.trim();
  if (!trimmed) return;

  const parts = trimmed.split(/\s+/);
  const commandName = parts[0].toLowerCase();
  const args = parts.slice(1);

  const command = commands.find(cmd => cmd.name === commandName);

  if (command) {
    try {
      await command.handler(args, ctx);
    } catch (e) {
      ctx.writeLine(`Error executing command: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  } else {
    // Treat as message to LLM
    try {
      const response = await sendMessage(input);
      // Handle multiline response
      const lines = response.split('\n');
      lines.forEach(line => ctx.writeLine(line));
    } catch (e) {
      ctx.writeLine(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }
}

export function getCommands(): Command[] {
  return commands;
}
