import { describe, it, expect, vi, beforeEach } from 'vitest'
import { executeCommand, getCommands, type CommandContext } from './commands'
import * as api from './api'

// Mock the api module
vi.mock('./api', () => ({
  sendMessage: vi.fn(),
}))

describe('commands', () => {
  const createMockContext = (): CommandContext => ({
    writeLine: vi.fn(),
    write: vi.fn(),
    clear: vi.fn(),
  })

  beforeEach(() => {
    vi.resetAllMocks()
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
    it('should execute help command', async () => {
      const ctx = createMockContext()
      await executeCommand('help', ctx)
      expect(ctx.writeLine).toHaveBeenCalled()
    })

    it('should execute clear command', async () => {
      const ctx = createMockContext()
      await executeCommand('clear', ctx)
      expect(ctx.clear).toHaveBeenCalled()
    })

    it('should call sendMessage for unknown commands', async () => {
      const ctx = createMockContext()
      vi.mocked(api.sendMessage).mockResolvedValue('Response from LLM')

      await executeCommand('hello world', ctx)

      expect(api.sendMessage).toHaveBeenCalledWith('hello world')
      expect(ctx.writeLine).toHaveBeenCalledWith('Response from LLM')
    })

    it('should handle sendMessage errors', async () => {
      const ctx = createMockContext()
      vi.mocked(api.sendMessage).mockRejectedValue(new Error('Network error'))

      await executeCommand('hello', ctx)

      expect(ctx.writeLine).toHaveBeenCalledWith('Error: Network error')
    })

    it('should handle empty input', async () => {
      const ctx = createMockContext()
      await executeCommand('', ctx)
      expect(ctx.writeLine).not.toHaveBeenCalled()
      expect(api.sendMessage).not.toHaveBeenCalled()
    })

    it('should handle whitespace-only input', async () => {
      const ctx = createMockContext()
      await executeCommand('   ', ctx)
      expect(ctx.writeLine).not.toHaveBeenCalled()
      expect(api.sendMessage).not.toHaveBeenCalled()
    })

    it('should be case-insensitive for commands', async () => {
      const ctx = createMockContext()
      await executeCommand('HELP', ctx)
      expect(ctx.writeLine).toHaveBeenCalled()
      expect(api.sendMessage).not.toHaveBeenCalled()
    })
  })
})
