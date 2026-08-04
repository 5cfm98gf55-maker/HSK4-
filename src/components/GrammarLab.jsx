import React, { useState } from 'react';
import { Sparkles, Volume2, CheckCircle2, Play, ChevronRight, HelpCircle, BookOpen } from './Icons';
import grammarData from '../data/hsk4_grammar.json';

export default function GrammarLab() {
  const [selectedGrammarId, setSelectedGrammarId] = useState(grammarData[0].id);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [speed, setSpeed] = useState(1.0);

  const currentGrammar = grammarData.find(g => g.id === selectedGrammarId) || grammarData[0];

  const speakText = (text) => {
    if (!text || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = speed;
    window.speechSynthesis.speak(utterance);
  };

  // Color mapping helper for visual sentence dissection
  const getComponentStyle = (type) => {
    switch (type) {
      case 'grammar':
        return {
          background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
          color: '#ffffff',
          boxShadow: '0 0 12px rgba(168, 85, 247, 0.4)',
          fontWeight: 800,
          border: '1px solid #c084fc'
        };
      case 'subject':
      case 'subject2':
        return {
          background: 'rgba(59, 130, 246, 0.25)',
          color: '#93c5fd',
          border: '1px solid rgba(59, 130, 246, 0.4)'
        };
      case 'predicate':
      case 'predicate2':
        return {
          background: 'rgba(16, 185, 129, 0.25)',
          color: '#6ee7b7',
          border: '1px solid rgba(16, 185, 129, 0.4)'
        };
      case 'object':
        return {
          background: 'rgba(245, 158, 11, 0.25)',
          color: '#fde68a',
          border: '1px solid rgba(245, 158, 11, 0.4)'
        };
      default:
        return {
          background: 'transparent',
          color: '#94a3b8'
        };
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '980px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            padding: '0.6rem',
            borderRadius: '12px',
            boxShadow: '0 0 15px rgba(236, 72, 153, 0.4)'
          }}>
            <BookOpen size={24} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>
              🧩 Phân Tích Ngữ Pháp HSK4 Trực Quan ({grammarData.length} Cấu Trúc)
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Bấm vào từng khối màu để xem Pinyin, Nghĩa Tiếng Việt & Nghe âm thanh riêng!
            </p>
          </div>
        </div>
      </div>

      {/* Grammar Rule Selector Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        {grammarData.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setSelectedGrammarId(item.id);
              setSelectedComponent(null);
              window.speechSynthesis.cancel();
            }}
            style={{
              background: selectedGrammarId === item.id ? 'linear-gradient(135deg, #a855f7, #ec4899)' : 'rgba(30, 41, 59, 0.7)',
              color: selectedGrammarId === item.id ? '#ffffff' : '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.6rem 1rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: selectedGrammarId === item.id ? 700 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {item.pattern} ({item.category})
          </button>
        ))}
      </div>

      {/* Main Grammar Card */}
      <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'left', position: 'relative' }}>
        
        {/* Title & Meaning */}
        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1.5rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                {currentGrammar.category}
              </span>
              <h1 className="zh-text" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginTop: '0.4rem' }}>
                {currentGrammar.pattern}
              </h1>
              <div style={{ fontSize: '1.1rem', color: '#a5b4fc', marginTop: '0.2rem' }}>
                Pinyin: {currentGrammar.pinyin}
              </div>
              <div style={{ fontSize: '1rem', color: '#38bdf8', fontWeight: 600, marginTop: '0.3rem' }}>
                👉 Nghĩa: {currentGrammar.meaning}
              </div>
            </div>

            {/* Formula Pill Box */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              padding: '0.9rem 1.25rem',
              borderRadius: '14px'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.2rem' }}>📐 Công Thức Cấu Trúc:</div>
              <div style={{ fontSize: '0.95rem', color: '#f8fafc', fontWeight: 700 }}>
                {currentGrammar.formula}
              </div>
            </div>
          </div>
        </div>

        {/* Memory Trick Alert Box */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(236, 72, 153, 0.15))',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '16px',
          padding: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.3rem' }}>
            {currentGrammar.memoryTrick}
          </div>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
            💬 <strong>Giải thích ngữ pháp:</strong> {currentGrammar.explanation}
          </p>
        </div>

        {/* Visual Color-Coded Sentence Dissection Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="#a855f7" /> 🎨 Sơ Đồ Phân Tích Khối Màu (Bấm vào khối để xem chi tiết):
            </h3>
            <button
              onClick={() => speakText(currentGrammar.exampleSentence.zh)}
              className="btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              <Volume2 size={16} /> Nghe Nguyên Câu
            </button>
          </div>

          {/* Color-Coded Interactive Sentence Blocks */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center', marginBottom: '1.25rem' }}>
              {currentGrammar.exampleSentence.components.map((comp, idx) => {
                if (comp.type === 'punct') return <span key={idx} className="zh-text" style={{ fontSize: '1.4rem', color: '#94a3b8' }}>{comp.text}</span>;
                
                const style = getComponentStyle(comp.type);
                const isSelected = selectedComponent && selectedComponent.text === comp.text;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedComponent(comp);
                      speakText(comp.text);
                    }}
                    style={{
                      ...style,
                      padding: '0.6rem 1rem',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: isSelected ? '0 0 20px rgba(168, 85, 247, 0.6)' : 'none'
                    }}
                  >
                    <span className="zh-text" style={{ fontSize: '1.35rem' }}>
                      {comp.text}
                    </span>
                    {comp.label && (
                      <span style={{ fontSize: '0.7rem', marginTop: '0.25rem', opacity: 0.9, fontWeight: 600 }}>
                        {comp.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sentence Translation & Pinyin */}
            <div style={{ fontSize: '0.95rem', color: '#a5b4fc', marginBottom: '0.3rem' }}>
              Pinyin: {currentGrammar.exampleSentence.pinyin}
            </div>
            <div style={{ fontSize: '0.95rem', color: '#f8fafc', fontStyle: 'italic', fontWeight: 500 }}>
              Dịch: "{currentGrammar.exampleSentence.vi}"
            </div>
          </div>
        </div>

        {/* Selected Component Block Inspector Modal */}
        {selectedComponent && selectedComponent.text && (
          <div className="glass-card animate-fade-in" style={{
            background: 'rgba(30, 41, 59, 0.95)',
            border: '1px solid rgba(168, 85, 247, 0.5)',
            padding: '1.25rem',
            borderRadius: '16px',
            marginBottom: '2rem',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#c084fc', textTransform: 'uppercase', fontWeight: 700 }}>
                📌 Thành phần ngữ pháp vừa bấm chọn: ({selectedComponent.label})
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.3rem' }}>
                <h3 className="zh-text" style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 700 }}>
                  {selectedComponent.text}
                </h3>
                <span style={{ fontSize: '1.05rem', color: '#a5b4fc', fontWeight: 500 }}>
                  {selectedComponent.pinyin}
                </span>
              </div>
              <p style={{ fontSize: '1rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                Dịch vế này: <strong style={{ color: '#38bdf8' }}>"{selectedComponent.meaning}"</strong>
              </p>
            </div>

            <button
              onClick={() => speakText(selectedComponent.text)}
              className="btn-primary"
              style={{ padding: '0.6rem 1.2rem', background: '#a855f7' }}
            >
              <Volume2 size={18} /> Nghe Vế Này
            </button>
          </div>
        )}

        {/* Component Legend Footer */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '1rem', background: 'rgba(30, 41, 59, 0.5)', padding: '1rem', borderRadius: '12px', fontSize: '0.8rem', color: '#94a3b8'
        }}>
          <div>🟣 <strong style={{ color: '#c084fc' }}>Khối Tím:</strong> Từ Ngữ Pháp HSK4</div>
          <div>🔵 <strong style={{ color: '#93c5fd' }}>Khối Xanh Dương:</strong> Chủ ngữ / Vế trước</div>
          <div>🟢 <strong style={{ color: '#6ee7b7' }}>Khối Xanh Lá:</strong> Động từ / Vế kết quả</div>
          <div>🟡 <strong style={{ color: '#fde68a' }}>Khối Vàng:</strong> Tân ngữ / Tác nhân</div>
        </div>

      </div>

    </div>
  );
}
