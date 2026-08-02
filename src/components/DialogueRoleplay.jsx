import React, { useState } from 'react';
import { MessageSquare, Volume2, Sparkles, RefreshCw } from './Icons';


export default function DialogueRoleplay({ currentItem }) {
  const [activeVoice, setActiveVoice] = useState(null);

  // Generate a situational dialogue context based on current item
  const dialogue = [
    {
      speaker: 'A (Bạn học/Đồng nghiệp)',
      avatar: '👨‍💼',
      zh: `请问，关于 ${currentItem.word} 的事情，你准备得怎么样了？`,
      pinyin: `Qǐngwèn, guānyú ${currentItem.pinyin} de shìqing, nǐ zhǔnbèi de zěnmeyàng le?`,
      vi: `Cho hỏi, về việc (${currentItem.meaning}), bạn chuẩn bị thế nào rồi?`
    },
    {
      speaker: 'B (Bạn)',
      avatar: '👩‍💻',
      zh: currentItem.example,
      pinyin: currentItem.examplePinyin,
      vi: currentItem.exampleMeaning
    },
    {
      speaker: 'A (Bạn học/Đồng nghiệp)',
      avatar: '👨‍💼',
      zh: `太好了！谢谢你的配合。`,
      pinyin: `Tài hǎo le! Xièxiè nǐ de pèihé.`,
      vi: `Tuyệt quá! Cảm ơn sự phối hợp của bạn.`
    }
  ];

  const speakText = (text, index) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.onstart = () => setActiveVoice(index);
    utterance.onend = () => setActiveVoice(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      
      <div className="glass-card" style={{ padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(139, 92, 246, 0.2)',
            color: '#a78bfa',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '0.75rem'
          }}>
            <Sparkles size={16} />
            <span>Mở Rộng Giao Tiếp Ngữ Cảnh</span>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
            Hội Thoại Thực Tế Cho Từ: <span style={{ color: '#818cf8' }}>{currentItem.word}</span>
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.3rem' }}>
            Thực hành nhập vai A & B để tăng phản xạ giao tiếp câu
          </p>
        </div>

        {/* Dialogue Messages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {dialogue.map((line, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                background: idx === 1 ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                border: `1px solid ${idx === 1 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                padding: '1.25rem',
                borderRadius: '16px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '2rem', lineHeight: 1 }}>{line.avatar}</div>

              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.4rem'
                }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: idx === 1 ? '#818cf8' : '#cbd5e1' }}>
                    {line.speaker}
                  </span>

                  <button
                    onClick={() => speakText(line.zh, idx)}
                    className="btn-secondary"
                    style={{
                      padding: '0.3rem 0.6rem',
                      fontSize: '0.8rem',
                      background: activeVoice === idx ? 'var(--accent-primary)' : 'transparent'
                    }}
                  >
                    <Volume2 size={14} /> Nghe
                  </button>
                </div>

                <div className="zh-text" style={{ fontSize: '1.3rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.2rem' }}>
                  {line.zh}
                </div>

                <div style={{ fontSize: '0.9rem', color: '#a5b4fc', marginBottom: '0.3rem' }}>
                  {line.pinyin}
                </div>

                <div style={{ fontSize: '0.875rem', color: '#94a3b8', fontStyle: 'italic' }}>
                  "{line.vi}"
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
