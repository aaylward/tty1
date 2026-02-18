import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendMessage } from './api'

describe('sendMessage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    global.fetch = vi.fn()
  })

  it('calls the correct API endpoint', async () => {
    const mockResponse = {
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ content: 'Hello' })),
    } as unknown as Response
    vi.mocked(global.fetch).mockResolvedValue(mockResponse)

    await sendMessage('hello')

    expect(global.fetch).toHaveBeenCalledWith('https://gpt.muchq.com/microgpt/v1/chat', expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'hello' }],
        max_tokens: 100,
      }),
    }))
  })
})
