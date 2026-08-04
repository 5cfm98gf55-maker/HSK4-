import React, { useState } from 'react';
import { BookOpen, Volume2, Play, Sparkles, CheckCircle2, AlertCircle, ChevronRight } from './Icons';
import articlesData from '../data/hsk4_articles.json';


export default function ArticleReader() {
  const [selectedArticleId, setSelectedArticleId] = useState(articlesData[0].id);
  const [activeToken, setActiveToken] = useState(null);
  const [isPlayingFull, setIsPlayingFull] = useState(false);
  const [activeSentenceId, setActiveSentenceId] = useState(null);

  const currentArticle = articlesData.find(a => a.id === selectedArticleId) || articlesData[0];

  // Speak specific text
  const speakText = (text, onEndCallback) => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt không hỗ trợ Web Speech Synthesis');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(v => v.name.includes('Natural') || v.name.includes('Neural') || v.lang.includes('zh') || v.lang.includes('CN'));
    if (zhVoice) utterance.voice = zhVoice;

    if (onEndCallback) utterance.onend = onEndCallback;

    window.speechSynthesis.speak(utterance);
  };

  // Play full article audio sentence by sentence
  const playFullArticle = () => {
    if (isPlayingFull) {
      window.speechSynthesis.cancel();
      setIsPlayingFull(false);
      setActiveSentenceId(null);
      return;
    }

    setIsPlayingFull(true);
    let index = 0;

    const playNextSentence = () => {
      if (index < currentArticle.sentences.length) {
        const sentence = currentArticle.sentences[index];
        setActiveSentenceId(sentence.id);
        speakText(sentence.zh, () => {
          index++;
          playNextSentence();
        });
      } else {
        setIsPlayingFull(false);
        setActiveSentenceId(null);
      }
    };

    playNextSentence();
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '950px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Top Header */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #a855f7, #6366f1)',
            padding: '0.6rem',
            borderRadius: '12px',
            boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
          }}>
            <BookOpen size={24} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>
              📰 Luyện Đọc Bài Báo & Câu Dài HSK4
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Bấm vào bất kỳ từ nào để xem Pinyin, Nghĩa & Nghe phát âm từ đó
            </p>
          </div>
        </div>

        {/* Article Selector Dropdown */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {articlesData.map((art) => (
            <button
              key={art.id}
              onClick={() => {
                setSelectedArticleId(art.id);
                setActiveToken(null);
                window.speechSynthesis.cancel();
                setIsPlayingFull(false);
              }}
              style={{
                background: selectedArticleId === art.id ? 'var(--accent-primary)' : 'rgba(30, 41, 59, 0.7)',
                color: selectedArticleId === art.id ? '#ffffff' : '#94a3b8',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.5rem 0.9rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: selectedArticleId === art.id ? 600 : 400,
                cursor: 'pointer'
              }}
            >
              {art.category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Article Reader Workspace */}
      <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'left', position: 'relative' }}>
        
        {/* Article Title & Summary */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                {currentArticle.category}
              </span>
              <h1 className="zh-text" style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff', marginTop: '0.5rem' }}>
                {currentArticle.titleZh}
              </h1>
              <div style={{ fontSize: '1rem', color: '#a5b4fc', marginTop: '0.2rem' }}>
                {currentArticle.titlePinyin}
              </div>
              <div style={{ fontSize: '0.95rem', color: '#cbd5e1', fontStyle: 'italic', marginTop: '0.3rem' }}>
                "{currentArticle.titleVi}"
              </div>
            </div>

            {/* Audio Player Controls */}
            <button
              onClick={playFullArticle}
              className="btn-primary"
              style={{
                background: isPlayingFull ? 'var(--danger)' : 'linear-gradient(135deg, #a855f7, #6366f1)',
                padding: '0.75rem 1.25rem'
              }}
            >
              <Play size={18} />
              <span>{isPlayingFull ? 'Dừng Nghe Bài' : '🎧 Nghe Toàn Bài Báo'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Sentence Passages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '2.5rem' }}>
          {currentArticle.sentences.map((sen, sIdx) => (
            <div
              key={sen.id}
              style={{
                background: activeSentenceId === sen.id ? 'rgba(168, 85, 247, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                border: `1px solid ${activeSentenceId === sen.id ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                padding: '1.25rem',
                borderRadius: '16px',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Interactive Tokenized Chinese Sentence Text */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem', alignItems: 'baseline', marginBottom: '0.6rem' }}>
                <button
                  onClick={() => speakText(sen.zh)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#818cf8',
                    cursor: 'pointer',
                    marginRight: '0.5rem',
                    padding: '0.2rem'
                  }}
                  title="Nghe câu này"
                >
                  <Volume2 size={18} />
                </button>

                {sen.tokens.map((token, tIdx) => {
                  if (token.word === '，' || token.word === '。' || token.word === '！' || token.word === '？') {
                    return (
                      <span key={tIdx} className="zh-text" style={{ fontSize: '1.4rem', color: '#94a3b8' }}>
                        {token.word}
                      </span>
                    );
                  }

                  const isSelected = activeToken && activeToken.word === token.word;

                  return (
                    <span
                      key={tIdx}
                      onClick={() => {
                        setActiveToken(token);
                        if (token.word.trim()) speakText(token.word);
                      }}
                      className="zh-text"
                      style={{
                        fontSize: '1.4rem',
                        fontWeight: 600,
                        padding: '0.15rem 0.35rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        background: isSelected
                          ? 'var(--accent-primary)'
                          : token.isHsk4
                          ? 'rgba(168, 85, 247, 0.25)'
                          : 'rgba(255, 255, 255, 0.04)',
                        color: isSelected
                          ? '#ffffff'
                          : token.isHsk4
                          ? '#e9d5ff'
                          : '#f8fafc',
                        borderBottom: token.isHsk4 ? '2px solid #a855f7' : 'none'
                      }}
                      title={`Bấm để xem nghĩa từ: ${token.word}`}
                    >
                      {token.word}
                    </span>
                  );
                })}
              </div>

              {/* Full Sentence Pinyin & Translation */}
              <div style={{ fontSize: '0.9rem', color: '#a5b4fc', marginBottom: '0.3rem' }}>
                {sen.pinyin}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1', fontStyle: 'italic' }}>
                "{sen.vi}"
              </div>
            </div>
          ))}
        </div>

        {/* Selected Word Popover Inspector Modal */}
        {activeToken && activeToken.word.trim() && (
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Chi tiết từ vừa chọn:</span>
                {activeToken.isHsk4 && (
                  <span style={{ background: '#a855f7', color: 'white', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                    HSK4 Word
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.3rem' }}>
                <h3 className="zh-text" style={{ fontSize: '1.8rem', color: '#ffffff', fontWeight: 700 }}>
                  {activeToken.word}
                </h3>
                <span style={{ fontSize: '1.1rem', color: '#c084fc', fontWeight: 500 }}>
                  {activeToken.pinyin}
                </span>
              </div>
              <p style={{ fontSize: '1rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                Nghĩa: <strong>{activeToken.meaning}</strong>
              </p>
            </div>

            <button
              onClick={() => speakText(activeToken.word)}
              className="btn-primary"
              style={{ padding: '0.6rem 1.2rem', background: '#a855f7' }}
            >
              <Volume2 size={18} /> Nghe Từ Này
            </button>
          </div>
        )}

        {/* Article Vocabulary & Phrasal Notes Box */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Sparkles size={20} color="#a855f7" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
              💡 Ghi Chú Cụm Từ HSK4 Trong Bài Báo
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {currentArticle.vocabularyNotes.map((note, nIdx) => (
              <div
                key={nIdx}
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="zh-text" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#c084fc' }}>
                    {note.word}
                  </span>
                  <button
                    onClick={() => speakText(note.word)}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#a5b4fc' }}>{note.pinyin} • {note.meaning}</div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.4rem', fontStyle: 'italic' }}>
                  💬 Cụm từ: {note.collocation}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
