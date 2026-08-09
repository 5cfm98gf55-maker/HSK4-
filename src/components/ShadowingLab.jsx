import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, CheckCircle2, Mic, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, Settings } from './Icons';
import { evaluateSpeech } from '../utils/phoneticsEvaluator';
import { getPosInfo } from '../utils/posUtils';

export default function ShadowingLab({
  allData,
  currentIndex,
  onNext,
  onPrev,
  masteredSet,
  onMasterToggle,
  onSelectIndex
}) {
  const [filterMode, setFilterMode] = useState('unmastered'); // 'unmastered' | 'mastered' | 'all'
  const [localIndex, setLocalIndex] = useState(0);

  // Audio & Speech States
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  // Speech Recognition States
  const [isRecording, setIsRecording] = useState(false);
  const [speechResult, setSpeechResult] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const recognitionRef = useRef(null);
  const accumulatedRef = useRef('');

  // Mobile Touch Swipe Gesture Refs
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const onTouchStart = (e) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minDistance = 50;
    if (distance > minDistance) {
      handleNext(); // Swipe Left -> Next
    } else if (distance < -minDistance) {
      handlePrev(); // Swipe Right -> Prev
    }
  };

  // Filter dataset based on active filterMode
  const filteredData = (allData || []).filter(item => {
    const isMastered = masteredSet ? masteredSet.has(item.id) : false;
    if (filterMode === 'mastered') return isMastered;
    if (filterMode === 'unmastered') return !isMastered;
    return true; // 'all'
  });

  const currentDataset = filteredData.length > 0 ? filteredData : allData;
  const safeIndex = localIndex >= currentDataset.length ? 0 : localIndex;
  const currentItem = currentDataset[safeIndex] || allData[0];

  const handleNext = () => {
    setSpeechResult(null);
    setTranscript('');
    setLocalIndex((prev) => (prev + 1) % currentDataset.length);
  };

  const handlePrev = () => {
    setSpeechResult(null);
    setTranscript('');
    setLocalIndex((prev) => (prev - 1 + currentDataset.length) % currentDataset.length);
  };

  // Load native Chinese voices
  useEffect(() => {
    const loadVoices = () => {
      if (!('speechSynthesis' in window)) return;
      const voices = window.speechSynthesis.getVoices();
      const zhVoices = voices.filter(v => 
        v.lang.toLowerCase().includes('zh') || 
        v.lang.toLowerCase().includes('cn') ||
        v.name.includes('Chinese') ||
        v.name.includes('Mandarin')
      );
      setAvailableVoices(zhVoices);
      if (zhVoices.length > 0 && !selectedVoiceURI) {
        const bestVoice = zhVoices.find(v => v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Google')) || zhVoices[0];
        setSelectedVoiceURI(bestVoice.voiceURI);
      }
    };

    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'zh-CN';

      rec.onresult = (e) => {
        let finalStr = '';
        let interimStr = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const trans = e.results[i][0].transcript;
          if (e.results[i].isFinal) {
            finalStr += trans;
          } else {
            interimStr += trans;
          }
        }
        if (finalStr) {
          accumulatedRef.current += finalStr;
        }
        setTranscript(accumulatedRef.current + interimStr);
      };

      rec.onerror = (e) => {
        console.error('Speech recognition error:', e.error);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Speak audio helper
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt không hỗ trợ Web Speech Synthesis');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = speed;
    utterance.pitch = pitch;

    if (selectedVoiceURI && availableVoices.length > 0) {
      const v = availableVoices.find(voice => voice.voiceURI === selectedVoiceURI);
      if (v) utterance.voice = v;
    }

    window.speechSynthesis.speak(utterance);
  };

  // Toggle mic recording
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Trình duyệt của bạn không hỗ trợ Web Speech Recognition. Vui lòng dùng Google Chrome.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      const userSpoken = accumulatedRef.current || transcript;
      const targetSentence = currentItem.example || currentItem.exampleZh || currentItem.word;
      if (userSpoken.trim() && currentItem) {
        const evalRes = evaluateSpeech(targetSentence, userSpoken);
        setSpeechResult(evalRes);
      }
    } else {
      accumulatedRef.current = '';
      setTranscript('');
      setSpeechResult(null);
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start recognition:', err);
      }
    }
  };

  const isMastered = masteredSet ? masteredSet.has(currentItem.id) : false;

  const handleMasterClick = () => {
    onMasterToggle(currentItem.id);
    if (!isMastered) {
      setToastMessage('🎉 Đã thêm vào Sổ Từ Đã Làm Chủ! Bạn có thể chuyển sang chế độ "✅ Đã Làm Chủ" để ôn tập bất cứ lúc nào.');
      setTimeout(() => setToastMessage(''), 4000);
      if (filterMode === 'unmastered' && currentDataset.length > 1) {
        handleNext();
      }
    }
  };

  const unmasteredCount = allData ? allData.length - (masteredSet ? masteredSet.size : 0) : 0;
  const masteredCount = masteredSet ? masteredSet.size : 0;

  const exampleChinese = currentItem ? (currentItem.example || currentItem.exampleZh || '') : '';
  const exampleTranslation = currentItem ? (currentItem.exampleMeaning || currentItem.exampleVi || '') : '';
  const exampleChunks = currentItem ? (currentItem.chunks || currentItem.phrasalChunks || []) : [];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Filter Bucket Tabs Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setFilterMode('unmastered'); setLocalIndex(0); }}
            style={{
              background: filterMode === 'unmastered' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'rgba(30, 41, 59, 0.7)',
              color: filterMode === 'unmastered' ? '#ffffff' : '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.6rem 1.1rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: filterMode === 'unmastered' ? 700 : 400,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <span>🔥 Đang Học</span>
            <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '0.1rem 0.5rem', borderRadius: '10px', fontSize: '0.75rem' }}>
              {unmasteredCount}
            </span>
          </button>

          <button
            onClick={() => { setFilterMode('mastered'); setLocalIndex(0); }}
            style={{
              background: filterMode === 'mastered' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(30, 41, 59, 0.7)',
              color: filterMode === 'mastered' ? '#ffffff' : '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.6rem 1.1rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: filterMode === 'mastered' ? 700 : 400,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <span>✅ Sổ Từ Đã Làm Chủ</span>
            <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '0.1rem 0.5rem', borderRadius: '10px', fontSize: '0.75rem' }}>
              {masteredCount}
            </span>
          </button>

          <button
            onClick={() => { setFilterMode('all'); setLocalIndex(0); }}
            style={{
              background: filterMode === 'all' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'rgba(30, 41, 59, 0.7)',
              color: filterMode === 'all' ? '#ffffff' : '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.6rem 1.1rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: filterMode === 'all' ? 700 : 400,
              cursor: 'pointer'
            }}
          >
            🌐 Tất Cả ({allData ? allData.length : 0})
          </button>
        </div>

        <button
          onClick={() => setShowVoiceSettings(!showVoiceSettings)}
          className="btn-secondary"
          style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
        >
          <Settings size={16} /> Giọng Đọc ({speed}x)
        </button>
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="glass-card animate-fade-in" style={{
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid #10b981',
          color: '#6ee7b7',
          padding: '0.8rem 1.2rem',
          borderRadius: '12px',
          marginBottom: '1.25rem',
          fontSize: '0.88rem',
          fontWeight: 600,
          textAlign: 'center'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Voice Settings Drawer */}
      {showVoiceSettings && (
        <div className="glass-card animate-fade-in" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.95)' }}>
          <h4 style={{ fontSize: '0.95rem', color: '#c084fc', marginBottom: '0.75rem', fontWeight: 600 }}>
            🎙️ Tùy Chỉnh Giọng Đọc Tiếng Trung (Voice & Speed)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
                Chọn Giọng Đọc Bản Xứ:
              </label>
              <select
                value={selectedVoiceURI}
                onChange={(e) => setSelectedVoiceURI(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(30, 41, 59, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem'
                }}
              >
                {availableVoices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
                Tốc độ đọc mẫu:
              </label>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <button
                  onClick={() => setSpeed(1.0)}
                  style={{
                    background: speed === 1.0 ? 'var(--accent-primary)' : 'rgba(30, 41, 59, 0.8)',
                    color: 'white', border: 'none', padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer'
                  }}
                >
                  1.0x (Thường)
                </button>
                <button
                  onClick={() => setSpeed(0.75)}
                  style={{
                    background: speed === 0.75 ? 'var(--accent-primary)' : 'rgba(30, 41, 59, 0.8)',
                    color: 'white', border: 'none', padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer'
                  }}
                >
                  0.75x (Chậm)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Flashcard Container */}
      <div
        className="glass-card"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ padding: '2.5rem', textAlign: 'center', position: 'relative' }}
      >
        {/* Touch Swipe Hint */}
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem', userSelect: 'none' }}>
          👈 Vuốt màn hình trái / phải để đổi từ nhanh trên điện thoại 👉
        </div>

        {/* Mastered Toggle Badge */}
        <button
          onClick={handleMasterClick}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: isMastered ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            color: isMastered ? '#10b981' : '#94a3b8',
            border: `1px solid ${isMastered ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s ease'
          }}
        >
          <CheckCircle2 size={16} />
          <span>{isMastered ? 'Đã làm chủ (Sổ từ)' : 'Đánh dấu đã thuộc'}</span>
        </button>

        {/* Flashcard Index Header & Word Type Badge */}
        {(() => {
          const posInfo = getPosInfo(currentItem?.pos);
          return (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <span style={{
                  background: 'rgba(168, 85, 247, 0.2)',
                  color: '#c084fc',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}>
                  #{safeIndex + 1} / {currentDataset.length}
                </span>

                {/* Styled POS Badge */}
                <span style={{
                  background: posInfo.bg,
                  color: posInfo.color,
                  border: `1px solid ${posInfo.border}`,
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <span>{posInfo.icon}</span>
                  <span>{posInfo.label} ({posInfo.en})</span>
                </span>
              </div>

              {/* Main Chinese Phrase & Pinyin */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h1 className="zh-text zh-hero-text" style={{ fontSize: '3.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem', letterSpacing: '0.02em' }}>
                  {currentItem ? currentItem.word : ''}
                </h1>
                <div style={{ fontSize: '1.5rem', color: '#c084fc', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {currentItem ? currentItem.pinyin : ''}
                </div>
                <div style={{ fontSize: '1.25rem', color: '#f8fafc', fontWeight: 600 }}>
                  {currentItem ? currentItem.meaning : ''}
                </div>
              </div>

              {/* Grammar & POS Annotation Note Box */}
              <div style={{
                background: 'rgba(30, 41, 59, 0.7)',
                border: `1px solid ${posInfo.border}`,
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                margin: '0 auto 1.8rem auto',
                maxWidth: '680px',
                textAlign: 'left',
                fontSize: '0.82rem',
                color: '#cbd5e1',
                lineHeight: '1.5'
              }}>
                <strong style={{ color: posInfo.color, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  {posInfo.icon} Chú thích Loại từ [{posInfo.label} • {posInfo.en}]:
                </strong>{' '}
                <span>{posInfo.note}</span>
              </div>
            </>
          );
        })()}

        {/* Word Audio Button */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <button
            onClick={() => speakText(currentItem.word)}
            className="btn-primary"
            style={{ padding: '0.7rem 1.5rem' }}
          >
            <Volume2 size={20} />
            <span>Phát âm Từ</span>
          </button>
        </div>

        {/* Context Sentence Example Box */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '1.5rem',
          textAlign: 'left',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            💬 CÂU VÍ DỤ NGỮ CẢNH GIAO TIẾP:
          </div>

          <div className="zh-text" style={{ fontSize: '1.5rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.3rem' }}>
            {exampleChinese}
          </div>
          <div style={{ fontSize: '1rem', color: '#a5b4fc', marginBottom: '0.3rem' }}>
            {currentItem ? currentItem.examplePinyin : ''}
          </div>
          <div style={{ fontSize: '1rem', color: '#cbd5e1', fontStyle: 'italic', marginBottom: '1rem' }}>
            "{exampleTranslation}"
          </div>

          {/* Phrasal Chunk Badges */}
          {exampleChunks && exampleChunks.length > 0 && (
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: '#818cf8' }}>🧩 Cụm từ thành phần:</span>
              {exampleChunks.map((chunk, cIdx) => (
                <button
                  key={cIdx}
                  onClick={() => speakText(chunk)}
                  style={{
                    background: 'rgba(168, 85, 247, 0.2)',
                    color: '#e9d5ff',
                    border: '1px solid rgba(168, 85, 247, 0.4)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  🔊 {chunk}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Audio Recording & Speech Evaluator Section */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <button
            onClick={() => speakText(exampleChinese || (currentItem ? currentItem.word : ''))}
            className="btn-secondary"
            style={{ padding: '0.75rem 1.25rem' }}
          >
            <Volume2 size={18} />
            <span>Nghe Cả Câu</span>
          </button>

          <button
            onClick={toggleRecording}
            className="btn-primary"
            style={{
              background: isRecording ? 'var(--danger)' : 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              padding: '0.75rem 1.5rem',
              boxShadow: isRecording ? '0 0 20px rgba(239, 68, 68, 0.5)' : '0 4px 15px rgba(236, 72, 153, 0.4)'
            }}
          >
            <Mic size={20} />
            <span>{isRecording ? '🛑 Bấm Tắt Mic & Chấm Điểm' : '🎙️ Bấm Mic Đọc Câu Này'}</span>
          </button>
        </div>

        {/* Live Mic Transcript Output */}
        {isRecording && (
          <div className="animate-fade-in" style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', color: '#fca5a5' }}>
            🎙️ <strong>Đang thu âm...</strong> Đọc xong bấm nút đỏ phía trên để nhận điểm AI!
            {transcript && (
              <div className="zh-text" style={{ fontSize: '1.2rem', color: '#ffffff', marginTop: '0.5rem' }}>
                Giọng bạn đang thu: "{transcript}"
              </div>
            )}
          </div>
        )}

        {/* AI Speech Score Output Card */}
        {speechResult && (
          <div className="glass-card animate-fade-in" style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(168, 85, 247, 0.5)', padding: '1.5rem', borderRadius: '16px', marginTop: '1.5rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
                🎯 Kết Quả Đánh Giá Phát Âm AI:
              </h3>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: (speechResult.totalScore || 0) >= 75 ? '#10b981' : '#f59e0b' }}>
                {speechResult.totalScore || 0} / 100 Điểm
              </div>
            </div>

            <div style={{ fontSize: '0.95rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
              {speechResult.feedbackMsg}
            </div>

            {/* Sub Score Breakdown Badges */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                Chính xác: {speechResult.accuracyScore}%
              </span>
              <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                Đầy đủ: {speechResult.completenessScore}%
              </span>
              <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                Lưu khoát: {speechResult.fluencyScore}%
              </span>
            </div>

            {/* Character Match Breakdown */}
            {speechResult.characterDetails && speechResult.characterDetails.length > 0 && (
              <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '1rem', borderRadius: '12px', marginTop: '0.75rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Phân tích từng chữ Hán:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {speechResult.characterDetails.map((charObj, idx) => {
                    const isMatched = charObj.status === 'correct';
                    return (
                      <span
                        key={idx}
                        className="zh-text"
                        style={{
                          fontSize: '1.3rem',
                          padding: '0.2rem 0.4rem',
                          borderRadius: '6px',
                          background: isMatched ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                          color: isMatched ? '#6ee7b7' : '#fca5a5',
                          border: `1px solid ${isMatched ? '#10b981' : '#ef4444'}`
                        }}
                      >
                        {charObj.char}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}


        {/* Bottom Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button onClick={handlePrev} className="btn-secondary">
            <ChevronLeft size={20} /> Từ Trước
          </button>

          <button onClick={handleNext} className="btn-primary">
            Từ Tiếp Theo <ChevronRight size={20} />
          </button>
        </div>

      </div>

    </div>
  );
}
