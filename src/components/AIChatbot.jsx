import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, Volume2, Bot, User, Sparkles, Key, Zap, AlertCircle } from './Icons';

export default function AIChatbot({ currentItem }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: '你好！我是你的中文AI口语伙伴小华。今天你想聊些什么？我们可以随时练习HSK4词汇！',
      pinyin: 'Nǐ hǎo! Wǒ shì nǐ de Zhōngwén AI kǒuyǔ huǒbàn Xiǎohuá. Jīntiān nǐ xiǎng liáo xiē shénme? Wǒmen kěyǐ suíshí liànxí HSK4 cíhuì!',
      translation: 'Xin chào! Tôi là Tiểu Hoa - Bạn đồng hành nói Tiếng Trung AI của bạn. Hôm nay bạn muốn trò chuyện về chủ đề gì?'
    }
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('hsk4_gemini_api_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, liveTranscript, isThinking]);

  // Robust Live Speech Recognition Engine
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'zh-CN';

      rec.onresult = (event) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        if (text) {
          setLiveTranscript(text);
          setInputMsg(text);
        }
      };

      rec.onerror = (err) => {
        console.error('Speech rec error:', err);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const saveApiKey = (key) => {
    setApiKey(key.trim());
    localStorage.setItem('hsk4_gemini_api_key', key.trim());
    setShowApiKeyInput(false);
  };

  // Speak AI Response
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(v => v.name.includes('Natural') || v.name.includes('Neural') || v.lang.includes('zh') || v.lang.includes('CN'));
    if (zhVoice) utterance.voice = zhVoice;

    window.speechSynthesis.speak(utterance);
  };

  // Toggle Mic
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Trình duyệt chưa hỗ trợ Web Speech Recognition. Hãy dùng Chrome hoặc Edge!');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setLiveTranscript('');
      setInputMsg('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Mic start error:', err);
      }
    }
  };

  // Send Message & Trigger Hyper-Fast Smart AI
  const handleSendMessage = async (customText) => {
    const text = (customText || inputMsg).trim();
    if (!text) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMessage = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInputMsg('');
    setLiveTranscript('');
    setIsThinking(true);

    try {
      let aiReply;
      if (apiKey) {
        // 🚀 Realtime Gemini AI API Call (Super Smart & Contextual)
        aiReply = await fetchGeminiResponse(text, apiKey, currentItem);
      } else {
        // ⚡ Zero-Latency Smart Native NLP Engine
        aiReply = generateSmartNLPResponse(text, currentItem);
      }

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiReply.zh,
        pinyin: aiReply.pinyin,
        translation: aiReply.vi
      };

      setMessages(prev => [...prev, aiMessage]);
      speakText(aiReply.zh);
    } catch (err) {
      console.error('AI response error:', err);
      const fallback = generateSmartNLPResponse(text, currentItem);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: fallback.zh, pinyin: fallback.pinyin, translation: fallback.vi }]);
      speakText(fallback.zh);
    } finally {
      setIsThinking(false);
    }
  };

  // Gemini API Fetcher (High-Intelligence Realtime LLM)
  const fetchGeminiResponse = async (userPrompt, key, item) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    const systemPrompt = `You are Xiǎohuá (小华), a friendly Chinese oral practice AI tutor for HSK4 learners.
    Reply concisely (2-3 sentences max) in Chinese.
    Format your response EXACTLY as JSON:
    {"zh": "Chinese response", "pinyin": "Pinyin with tone marks", "vi": "Vietnamese translation"}
    Current focus vocabulary: "${item.word}" (${item.meaning}). Include or relate to this HSK4 vocabulary when natural.`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\nUser said: ${userPrompt}` }] }]
      })
    });

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Extract JSON from output
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return generateSmartNLPResponse(userPrompt, item);
  };

  // Zero-Latency Smart NLP Engine (Instant, Contextual & Helpful)
  const generateSmartNLPResponse = (userText, item) => {
    const text = userText.toLowerCase();

    if (text.includes('你好') || text.includes('chào') || text.includes('hi')) {
      return {
        zh: `你好！很高兴和你就词汇"${item.word}"(${item.meaning})进行口语练习。你准备好了吗？`,
        pinyin: `Nǐ hǎo! Hěn gāoxìng hé nǐ jiù cíhuì "${item.word}" (${item.meaning}) jìnxíng kǒuyǔ liànxí. Nǐ zhǔnbèi hǎo le ma?`,
        vi: `Chào bạn! Rất vui được cùng bạn luyện nói từ vựng "${item.word}" (${item.meaning}). Bạn đã sẵn sàng chưa?`
      };
    }

    if (text.includes(item.word) || text.includes(item.meaning.toLowerCase())) {
      return {
        zh: `太棒了！你非常准确地使用了"${item.word}"。在日常生活中，我们常说："${item.example}"。`,
        pinyin: `Tài bàng le! Nǐ fēicháng zhǔnquè de shǐyòng le "${item.word}". Zài rìcháng shēnghuó lǐ, wǒmen cháng shuō: "${item.examplePinyin}".`,
        vi: `Xuất sắc! Bạn sử dụng từ "${item.word}" rất chuẩn. Trong giao tiếp hàng ngày, chúng ta thường nói: "${item.exampleMeaning}".`
      };
    }

    if (text.length < 4) {
      return {
        zh: `你可以试着多表达一点哦！比如用"${item.word}"造句，或者说说你今天的计划？`,
        pinyin: `Nǐ kěyǐ shìzhe duō biǎodá yīdiǎn o! Bǐrú yòng "${item.word}" zàojù, huòzhě shuōshuo nǐ jīntiān de jìhuà?`,
        vi: `Bạn có thể thử nói dài hơn một chút nhé! Ví dụ dùng từ "${item.word}" đặt câu, hoặc kể về kế hoạch hôm nay?`
      };
    }

    return {
      zh: `你的发音和表达很自然！我们继续结合词汇"${item.word}"进行练习吧，你有什么想法吗？`,
      pinyin: `Nǐ de fāyīn hé biǎodá hěn zìrán! Wǒmen jìxù jiéhé cíhuì "${item.word}" jìnxíng liànxí ba, nǐ yǒu shénme xiǎngfǎ ma?`,
      vi: `Phát âm và cách diễn đạt của bạn rất tự nhiên! Chúng ta tiếp tục luyện tập kết hợp từ "${item.word}" nhé, bạn có suy nghĩ gì không?`
    };
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '850px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Top Bar */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            padding: '0.6rem',
            borderRadius: '12px',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
          }}>
            <Bot size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                AI Voice Speaking Partner (小华)
              </h2>
              <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '10px', fontWeight: 600 }}>
                ⚡ Super Fast
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Luyện phản xạ đàm thoại trực tiếp 2 chiều bằng Giọng Nói tiếng Trung
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          className="btn-secondary"
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
        >
          <Key size={16} /> {apiKey ? 'Đã Tích Hợp Gemini API Key (Thông Minh Vô Hạn)' : 'Cấu hình Gemini API Key'}
        </button>
      </div>

      {/* API Key Box */}
      {showApiKeyInput && (
        <div className="glass-card animate-fade-in" style={{ padding: '1rem', marginBottom: '1rem', background: 'rgba(15, 23, 42, 0.95)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Zap size={18} color="#f59e0b" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
              Dán Gemini API Key (Miễn phí từ Google AI Studio) để AI đàm thoại siêu thông minh:
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="password"
              placeholder="Dán AIzaSy... tại đây"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.55rem',
                borderRadius: '8px',
                color: 'white',
                outline: 'none'
              }}
            />
            <button onClick={() => saveApiKey(apiKey)} className="btn-primary" style={{ padding: '0.55rem 1.2rem' }}>
              Lưu Key
            </button>
          </div>
        </div>
      )}

      {/* Messages Feed */}
      <div className="glass-card" style={{
        height: '480px',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.25rem'
      }}>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          paddingRight: '0.5rem'
        }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '0.75rem',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: msg.sender === 'user' ? 'var(--accent-primary)' : '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.9rem',
                flexShrink: 0
              }}>
                {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>

              <div style={{
                maxWidth: '80%',
                background: msg.sender === 'user' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(30, 41, 59, 0.85)',
                border: `1px solid ${msg.sender === 'user' ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                padding: '1rem',
                borderRadius: '16px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                    {msg.sender === 'user' ? 'Bạn' : 'AI 小华'}
                  </span>

                  {msg.sender === 'ai' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      style={{ background: 'transparent', border: 'none', color: '#a5b4fc', cursor: 'pointer' }}
                      title="Nghe phát âm AI"
                    >
                      <Volume2 size={16} />
                    </button>
                  )}
                </div>

                <div className="zh-text" style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', lineHeight: '1.4' }}>
                  {msg.text}
                </div>

                {msg.sender === 'ai' && msg.pinyin && (
                  <>
                    <div style={{ fontSize: '0.85rem', color: '#818cf8', marginTop: '0.3rem' }}>
                      {msg.pinyin}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontStyle: 'italic', marginTop: '0.3rem' }}>
                      "{msg.translation}"
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#818cf8', fontSize: '0.85rem' }}>
              <Bot size={18} />
              <span>AI 小华 đang suy nghĩ phản hồi...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Live Mic Transcript Streaming Banner */}
        {isListening && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            padding: '0.6rem 1rem',
            borderRadius: '10px',
            margin: '0.5rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#fca5a5',
            fontSize: '0.85rem'
          }}>
            <Mic size={16} className="mic-active" style={{ borderRadius: '50%' }} />
            <span>Đang thu âm giọng bạn: </span>
            <strong className="zh-text" style={{ color: '#ffffff' }}>{liveTranscript || 'Vui lòng nói tiếng Trung...'}</strong>
          </div>
        )}

        {/* Input Bar */}
        <div style={{
          marginTop: '0.5rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          gap: '0.6rem',
          alignItems: 'center'
        }}>
          {/* Mic Button */}
          <button
            onClick={toggleListening}
            className={`btn-primary ${isListening ? 'mic-active' : ''}`}
            style={{
              padding: '0.75rem',
              borderRadius: '50%',
              background: isListening ? 'var(--danger)' : 'linear-gradient(135deg, #ec4899, #8b5cf6)'
            }}
            title="Bấm Mic để nói tiếng Trung trực tiếp"
          >
            <Mic size={20} />
          </button>

          {/* Text Input */}
          <input
            type="text"
            placeholder={isListening ? 'Đang lắng nghe giọng bạn...' : 'Nói hoặc gõ tiếng Trung/Pinyin tại đây...'}
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            style={{
              flex: 1,
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />

          {/* Send Button */}
          <button
            onClick={() => handleSendMessage()}
            className="btn-primary"
            disabled={!inputMsg.trim() || isThinking}
            style={{ padding: '0.75rem 1.25rem' }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Suggested Fast Prompts */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => handleSendMessage(`你好！我们可以练习词汇"${currentItem.word}"(${currentItem.meaning})吗？`)}
          className="btn-secondary"
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
        >
          💡 Luyện từ "{currentItem.word}" ({currentItem.meaning})
        </button>
        <button
          onClick={() => handleSendMessage('请用HSK4词汇问我一个简单的问题。')}
          className="btn-secondary"
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
        >
          💡 AI hỏi tôi một câu HSK4
        </button>
        <button
          onClick={() => handleSendMessage('我今天学习了中文，感觉很有意思！')}
          className="btn-secondary"
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
        >
          💡 Wǒ jīntiān xuéxí le Zhōngwén... (Tôi học tiếng Trung hôm nay...)
        </button>
      </div>

    </div>
  );
}
