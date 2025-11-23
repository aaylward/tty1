import { describe, it, expect, vi } from 'vitest'
import { executeCommand, getCommands, type CommandContext } from './commands'

describe('commands', () => {
  const createMockContext = (): CommandContext => ({
    writeLine: vi.fn(),
    write: vi.fn(),
    clear: vi.fn(),
  })

  describe('getCommands', () => {
    it('should return array of commands', () => {
      const commands = getCommands()
      expect(commands).toBeInstanceOf(Array)
      expect(commands.length).toBeGreaterThan(0)
    })

    it('should have help command', () => {
      const commands = getCommands()
      const helpCmd = commands.find(cmd => cmd.name === 'help')
      expect(helpCmd).toBeDefined()
      expect(helpCmd?.description).toBeTruthy()
    })
  })

  describe('executeCommand', () => {
    it('should execute help command', () => {
      const ctx = createMockContext()
      executeCommand('help', ctx)
      expect(ctx.writeLine).toHaveBeenCalled()
    })

    it('should execute clear command', () => {
      const ctx = createMockContext()
      executeCommand('clear', ctx)
      expect(ctx.clear).toHaveBeenCalled()
    })

    it('should execute echo command', () => {
      const ctx = createMockContext()
      executeCommand('echo hello world', ctx)
      expect(ctx.writeLine).toHaveBeenCalledWith('hello world')
    })

    it('should execute date command', () => {
      const ctx = createMockContext()
      executeCommand('date', ctx)
      expect(ctx.writeLine).toHaveBeenCalled()
    })

    it('should execute whoami command', () => {
      const ctx = createMockContext()
      executeCommand('whoami', ctx)
      expect(ctx.writeLine).toHaveBeenCalledWith('guest')
    })

    it('should execute uname command', () => {
      const ctx = createMockContext()
      executeCommand('uname', ctx)
      expect(ctx.writeLine).toHaveBeenCalled()
    })

    it('should execute calc command with valid expression', () => {
      const ctx = createMockContext()
      executeCommand('calc 2 + 2', ctx)
      expect(ctx.writeLine).toHaveBeenCalledWith('2 + 2 = 4')
    })

    it('should handle calc command with invalid expression', () => {
      const ctx = createMockContext()
      executeCommand('calc invalid', ctx)
      expect(ctx.writeLine).toHaveBeenCalledWith('Error: Invalid expression')
    })

    it('should execute random command', () => {
      const ctx = createMockContext()
      executeCommand('random', ctx)
      expect(ctx.writeLine).toHaveBeenCalled()
    })

    it('should execute random command with range', () => {
      const ctx = createMockContext()
      executeCommand('random 1 10', ctx)
      expect(ctx.writeLine).toHaveBeenCalled()
      const output = (ctx.writeLine as ReturnType<typeof vi.fn>).mock.calls[0][0]
      const num = parseInt(output)
      expect(num).toBeGreaterThanOrEqual(1)
      expect(num).toBeLessThanOrEqual(10)
    })

    it('should execute lorem command', () => {
      const ctx = createMockContext()
      executeCommand('lorem', ctx)
      expect(ctx.writeLine).toHaveBeenCalled()
    })

    it('should handle unknown command', () => {
      const ctx = createMockContext()
      executeCommand('unknown', ctx)
      expect(ctx.writeLine).toHaveBeenCalledWith('Command not found: unknown')
    })

    it('should handle empty input', () => {
      const ctx = createMockContext()
      executeCommand('', ctx)
      expect(ctx.writeLine).not.toHaveBeenCalled()
    })

    it('should handle whitespace-only input', () => {
      const ctx = createMockContext()
      executeCommand('   ', ctx)
      expect(ctx.writeLine).not.toHaveBeenCalled()
    })

    it('should be case-insensitive', () => {
      const ctx = createMockContext()
      executeCommand('HELP', ctx)
      expect(ctx.writeLine).toHaveBeenCalled()
    })
  })
})
