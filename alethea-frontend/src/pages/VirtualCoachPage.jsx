import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../services/authService'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
  cream: '#faf7f2',
  charcoal: '#2c2c2c',
}

const VirtualCoachPage = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        id: 1,
        text: "Hi! I'm your AI nutrition coach. Ask me anything about nutrition, diet, or health!",
        isUser: false,
        timestamp: new Date()
      }
    ])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      text: input,
      isUser: true,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await API.post('/chat/chat', {
        message: input,
        conversation_id: conversationId
      })
      
      setConversationId(response.data.conversation_id)
      
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble responding. Please try again.",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      sendMessage()
    }
  }

  const suggestedQuestions = [
    "How many calories should I eat?",
    "Give me a weight loss tip",
    "What foods are high in protein?",
    "How much water should I drink?",
    "Calculate my BMI",
    "What should I eat today?"
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.cream, fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Header */}
      <div style={{ backgroundColor: c.white, borderBottom: `1px solid ${c.peach}15`, padding: '20px 32px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Link 
            to="/dashboard"
            style={{ 
              background: 'none', 
              border: 'none', 
              color: c.peach, 
              cursor: 'pointer', 
              fontSize: 13, 
              marginBottom: 12,
              textDecoration: 'none',
              display: 'inline-block'
            }}>
            ← Back to Dashboard
          </Link>
          <h1 style={{ color: c.dark, fontSize: 28, fontWeight: 800, margin: '8px 0 4px' }}>AI Virtual Coach</h1>
          <p style={{ color: c.taupe, marginTop: 4, fontSize: 14 }}>Your personal AI nutrition assistant</p>
        </div>
      </div>

      {/* Chat Container */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 32px', height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Messages Area */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          marginBottom: 20, 
          padding: '0 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '75%',
                  padding: '12px 18px',
                  borderRadius: 20,
                  backgroundColor: msg.isUser ? c.dark : c.white,
                  color: msg.isUser ? c.white : c.dark,
                  border: msg.isUser ? 'none' : `1px solid ${c.peach}25`,
                  boxShadow: msg.isUser ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{msg.text}</p>
                <p style={{ margin: '6px 0 0', fontSize: 10, opacity: 0.5 }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ 
                backgroundColor: c.white, 
                padding: '12px 18px', 
                borderRadius: 20,
                border: `1px solid ${c.peach}25`,
              }}>
                <p style={{ margin: 0, fontSize: 14, color: c.taupe }}>● ● ●</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length < 3 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: c.taupe, fontSize: 12, marginBottom: 12, fontWeight: 500 }}>Suggested questions</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(q)
                    setTimeout(() => sendMessage(), 100)
                  }}
                  style={{
                    backgroundColor: c.white,
                    border: `1px solid ${c.peach}30`,
                    borderRadius: 40,
                    padding: '8px 16px',
                    fontSize: 13,
                    cursor: 'pointer',
                    color: c.dark,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${c.peach}10`
                    e.currentTarget.style.borderColor = c.peach
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = c.white
                    e.currentTarget.style.borderColor = `${c.peach}30`
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div style={{ 
          display: 'flex', 
          gap: 12, 
          backgroundColor: c.white,
          borderRadius: 60,
          padding: '6px 6px 6px 20px',
          border: `1px solid ${c.peach}25`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about nutrition..."
            style={{
              flex: 1,
              border: 'none',
              padding: '12px 0',
              fontSize: 14,
              outline: 'none',
              backgroundColor: 'transparent',
              fontFamily: 'inherit',
            }}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              backgroundColor: c.dark,
              color: c.white,
              border: 'none',
              borderRadius: 50,
              padding: '10px 28px',
              cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
              opacity: (loading || !input.trim()) ? 0.5 : 1,
              fontWeight: 600,
              fontSize: 13,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading && input.trim()) {
                e.currentTarget.style.backgroundColor = c.charcoal
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && input.trim()) {
                e.currentTarget.style.backgroundColor = c.dark
              }
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default VirtualCoachPage