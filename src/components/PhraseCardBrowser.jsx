import React, { useState, useMemo } from 'react';
import { Search, Volume2, Mic, Filter, CheckCircle2 } from './Icons';
import { getPosInfo } from '../utils/posUtils';

export default function PhraseCardBrowser({ data, onSelectForShadowing, masteredSet, onMasterToggle }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPos, setSelectedPos] = useState('ALL');

  // Extract unique POS
  const posList = useMemo(() => {
    const set = new Set();
    data.forEach(item => {
      if (item.pos) set.add(item.pos);
    });
    return ['ALL', ...Array.from(set)];
  }, [data]);

  // Filtered data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchSearch =
        item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.example.toLowerCase().includes(searchTerm.toLowerCase());

      const matchPos = selectedPos === 'ALL' || item.pos === selectedPos;

      return matchSearch && matchPos;
    });
  }, [data, searchTerm, selectedPos]);

  // Play Speech
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1280px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Header controls */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
              Kho 981 Từ Vựng & Cụm Từ HSK4 3.0
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
              Hiển thị {filteredData.length} / {data.length} cụm từ
            </p>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Tìm theo chữ Hán, Pinyin, nghĩa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.75rem 1rem 0.75rem 2.8rem',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {posList.map((pos) => {
            const pInfo = pos === 'ALL' ? null : getPosInfo(pos);
            return (
              <button
                key={pos}
                onClick={() => setSelectedPos(pos)}
                style={{
                  background: selectedPos === pos ? 'var(--accent-primary)' : 'rgba(30, 41, 59, 0.6)',
                  color: selectedPos === pos ? '#ffffff' : '#94a3b8',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontWeight: selectedPos === pos ? 600 : 400
                }}
              >
                {pos === 'ALL' ? '🌐 Tất cả loại từ' : `${pInfo.icon} ${pInfo.label} (${pos})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {filteredData.map((item) => {
          const isMastered = masteredSet.has(item.id);
          const posInfo = getPosInfo(item.pos);
          return (
            <div
              key={item.id}
              className="glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600 }}>#{item.id}</span>
                    <span
                      title={posInfo.note}
                      style={{
                        background: posInfo.bg,
                        color: posInfo.color,
                        border: `1px solid ${posInfo.border}`,
                        padding: '0.15rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}
                    >
                      <span>{posInfo.icon}</span>
                      <span>{posInfo.label}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => onMasterToggle(item.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isMastered ? '#10b981' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    <CheckCircle2 size={20} />
                  </button>
                </div>

                {/* Word & Pinyin */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                    <h3 className="zh-text" style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff' }}>
                      {item.word}
                    </h3>
                    <span style={{ fontSize: '1.1rem', color: '#a5b4fc', fontWeight: 500 }}>
                      {item.pinyin}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.95rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                    {item.meaning}
                  </p>
                </div>

                {/* Example sentence box */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  padding: '0.9rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  marginBottom: '1rem'
                }}>
                  <div className="zh-text" style={{ fontSize: '1rem', color: '#f8fafc', fontWeight: 500, marginBottom: '0.25rem' }}>
                    {item.example}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#818cf8', marginBottom: '0.25rem' }}>
                    {item.examplePinyin}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    "{item.exampleMeaning}"
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => speakText(item.example)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', justifyContent: 'center' }}
                >
                  <Volume2 size={16} /> Nghe Câu
                </button>
                <button
                  onClick={() => onSelectForShadowing(item)}
                  className="btn-primary"
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', justifyContent: 'center' }}
                >
                  <Mic size={16} /> Luyện Đọc
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
