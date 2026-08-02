import React, { useState, useEffect } from 'react';
import { Puzzle, RefreshCw, CheckCircle2, XCircle, Volume2, ArrowRight } from './Icons';


export default function SentenceBuilder({ currentItem, onNext }) {
  const [shuffledChunks, setShuffledChunks] = useState([]);
  const [selectedChunks, setSelectedChunks] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);

  // Shuffle chunks on item change
  useEffect(() => {
    resetGame();
  }, [currentItem]);

  const resetGame = () => {
    setIsCorrect(null);
    setSelectedChunks([]);

    // If item has chunks, scramble them; else scramble characters
    const targetChunks = (currentItem.chunks && currentItem.chunks.length > 1)
      ? [...currentItem.chunks]
      : currentItem.example.replace(/[.,!?，。？！]/g, '').split('');

    // Shuffle array
    const shuffled = [...targetChunks].sort(() => Math.random() - 0.5);
    setShuffledChunks(shuffled);
  };

  const handleSelectChunk = (chunk, index) => {
    if (isCorrect === true) return;

    setSelectedChunks(prev => [...prev, chunk]);
    setShuffledChunks(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeselectChunk = (chunk, index) => {
    if (isCorrect === true) return;

    setSelectedChunks(prev => prev.filter((_, i) => i !== index));
    setShuffledChunks(prev => [...prev, chunk]);
  };

  const checkAnswer = () => {
    const userBuilt = selectedChunks.join('');
    const targetClean = currentItem.example.replace(/[.,!?，。？！]/g, '');

    if (userBuilt === targetClean) {
      setIsCorrect(true);
      speakText(currentItem.example);
    } else {
      setIsCorrect(false);
    }
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      
      <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#34d399',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '0.75rem'
          }}>
            <Puzzle size={16} />
            <span>Thách Thức Ghép Câu Giao Tiếp</span>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            Sắp Xếp Cụm Từ Thành Câu Hoàn Chỉnh
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '0.5rem', fontStyle: 'italic' }}>
            Nghĩa câu: "{currentItem.exampleMeaning}"
          </p>
        </div>

        {/* Selected Chunks Workspace (Drop Zone) */}
        <div style={{
          minHeight: '100px',
          background: 'rgba(15, 23, 42, 0.7)',
          borderRadius: '16px',
          border: `2px dashed ${
            isCorrect === true ? '#10b981' : isCorrect === false ? '#ef4444' : 'rgba(99, 102, 241, 0.4)'
          }`,
          padding: '1.25rem',
          display: 'flex',
          justify: 'center',
          alignItems: 'center',
          gap: '0.6rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
          transition: 'all 0.3s ease'
        }}>
          {selectedChunks.length === 0 ? (
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Bấm các khối cụm từ bên dưới để ghép câu tại đây...
            </span>
          ) : (
            selectedChunks.map((chunk, idx) => (
              <button
                key={idx}
                onClick={() => handleDeselectChunk(chunk, idx)}
                className="btn-primary animate-fade-in"
                style={{
                  fontSize: '1.25rem',
                  padding: '0.6rem 1rem',
                  fontFamily: 'Noto Sans SC, sans-serif'
                }}
              >
                {chunk}
              </button>
            ))
          )}
        </div>

        {/* Available Scrambled Chunks Pool */}
        <div style={{
          display: 'flex',
          justify: 'center',
          gap: '0.6rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
          minHeight: '60px'
        }}>
          {shuffledChunks.map((chunk, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectChunk(chunk, idx)}
              className="btn-secondary"
              style={{
                fontSize: '1.2rem',
                padding: '0.6rem 1.1rem',
                fontFamily: 'Noto Sans SC, sans-serif',
                borderColor: 'rgba(99, 102, 241, 0.3)',
                background: 'rgba(30, 41, 59, 0.8)'
              }}
            >
              {chunk}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button onClick={resetGame} className="btn-secondary" style={{ padding: '0.75rem 1.25rem' }}>
            <RefreshCw size={18} /> Làm lại
          </button>

          <button
            onClick={checkAnswer}
            className="btn-primary"
            disabled={selectedChunks.length === 0}
            style={{ padding: '0.75rem 1.8rem' }}
          >
            Kiểm tra Đáp án
          </button>

          {isCorrect === true && (
            <button onClick={onNext} className="btn-primary" style={{ background: '#10b981' }}>
              Bài Tiếp theo <ArrowRight size={18} />
            </button>
          )}
        </div>

        {/* Feedback Display */}
        {isCorrect === true && (
          <div style={{
            marginTop: '1.5rem',
            color: '#34d399',
            fontWeight: 700,
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={24} />
            <span>Chính xác 100%! Bạn đã làm chủ cấu trúc câu này! 🎉</span>
          </div>
        )}

        {isCorrect === false && (
          <div style={{
            marginTop: '1.5rem',
            color: '#f87171',
            fontWeight: 600,
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <XCircle size={20} />
            <span>Chưa chính xác, hãy bấm "Làm lại" để thử lại thứ tự cụm từ!</span>
          </div>
        )}

      </div>

    </div>
  );
}
