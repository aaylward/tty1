export async function sendMessage(message: string): Promise<string> {
  try {
    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: message }],
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const text = await response.text();
    if (!text) {
      return 'Received empty response from backend.';
    }

    try {
      const data = JSON.parse(text);
      // Try to extract content from common formats
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      }
      if (data.content) {
        return data.content;
      }
      return JSON.stringify(data, null, 2);
    } catch {
      return text;
    }
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}
