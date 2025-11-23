import { useEffect, useRef } from 'react'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { executeCommand } from './commands'
import '@xterm/xterm/css/xterm.css'
import './Terminal.css'

const PROMPT = '\r\n$ '

function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const currentLineRef = useRef<string>('')
  const cursorPositionRef = useRef<number>(0)
  const historyRef = useRef<string[]>([])
  const historyIndexRef = useRef<number>(-1)

  useEffect(() => {
    if (!terminalRef.current) return

    // Create terminal instance
    const term = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#000000',
        foreground: '#ffffff',
        cursor: '#ffffff',
        cursorAccent: '#000000',
        selectionBackground: '#ffffff40',
      },
      allowTransparency: false,
      scrollback: 1000,
    })

    // Create fit addon
    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)

    // Open terminal
    term.open(terminalRef.current)
    fitAddon.fit()

    xtermRef.current = term
    fitAddonRef.current = fitAddon

    // Welcome message
    term.writeln('Web Terminal v1.0.0')
    term.writeln('Type "help" for available commands')
    term.write(PROMPT)

    // Handle terminal input
    term.onData((data) => {
      const code = data.charCodeAt(0)

      // Handle special keys
      if (code === 13) {
        // Enter key
        const input = currentLineRef.current.trim()

        if (input) {
          historyRef.current.push(input)
          historyIndexRef.current = historyRef.current.length
        }

        term.write('\r\n')

        // Execute command
        if (input) {
          executeCommand(input, {
            writeLine: (text: string) => term.writeln(text),
            write: (text: string) => term.write(text),
            clear: () => term.clear(),
          })
        }

        currentLineRef.current = ''
        cursorPositionRef.current = 0
        term.write(PROMPT)
      } else if (code === 127) {
        // Backspace
        if (cursorPositionRef.current > 0) {
          currentLineRef.current =
            currentLineRef.current.slice(0, cursorPositionRef.current - 1) +
            currentLineRef.current.slice(cursorPositionRef.current)
          cursorPositionRef.current--

          // Redraw line
          term.write('\b \b')
          const tail = currentLineRef.current.slice(cursorPositionRef.current)
          if (tail) {
            term.write(tail + ' ')
            for (let i = 0; i <= tail.length; i++) {
              term.write('\b')
            }
          }
        }
      } else if (code === 27) {
        // Escape sequences (arrow keys)
        if (data.length === 3) {
          const escapeSeq = data.charCodeAt(2)

          if (escapeSeq === 65) {
            // Up arrow - previous command in history
            if (historyIndexRef.current > 0) {
              historyIndexRef.current--
              const cmd = historyRef.current[historyIndexRef.current]

              // Clear current line
              while (cursorPositionRef.current > 0) {
                term.write('\b \b')
                cursorPositionRef.current--
              }

              // Write history command
              currentLineRef.current = cmd
              cursorPositionRef.current = cmd.length
              term.write(cmd)
            }
          } else if (escapeSeq === 66) {
            // Down arrow - next command in history
            if (historyIndexRef.current < historyRef.current.length) {
              historyIndexRef.current++
              let cmd = ''

              if (historyIndexRef.current < historyRef.current.length) {
                cmd = historyRef.current[historyIndexRef.current]
              }

              // Clear current line
              while (cursorPositionRef.current > 0) {
                term.write('\b \b')
                cursorPositionRef.current--
              }

              // Write history command
              currentLineRef.current = cmd
              cursorPositionRef.current = cmd.length
              term.write(cmd)
            }
          } else if (escapeSeq === 67) {
            // Right arrow
            if (cursorPositionRef.current < currentLineRef.current.length) {
              term.write('\x1b[C')
              cursorPositionRef.current++
            }
          } else if (escapeSeq === 68) {
            // Left arrow
            if (cursorPositionRef.current > 0) {
              term.write('\x1b[D')
              cursorPositionRef.current--
            }
          }
        }
      } else if (code >= 32) {
        // Printable characters
        currentLineRef.current =
          currentLineRef.current.slice(0, cursorPositionRef.current) +
          data +
          currentLineRef.current.slice(cursorPositionRef.current)

        term.write(data)
        const tail = currentLineRef.current.slice(cursorPositionRef.current + 1)
        if (tail) {
          term.write(tail)
          for (let i = 0; i < tail.length; i++) {
            term.write('\b')
          }
        }
        cursorPositionRef.current++
      }
    })

    // Handle window resize
    const handleResize = () => {
      fitAddon.fit()
    }

    window.addEventListener('resize', handleResize)

    // Handle orientation change on mobile
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        fitAddon.fit()
      }, 100)
    })

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      term.dispose()
    }
  }, [])

  return (
    <div className="terminal-container">
      <div ref={terminalRef} className="terminal" />
    </div>
  )
}

export default Terminal
