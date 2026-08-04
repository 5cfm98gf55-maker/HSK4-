import React, { useState, useEffect, useRef } from 'react';
import { Play, Mic, ChevronLeft, ChevronRight, Shuffle, Volume2, Award, Sparkles, AlertCircle, CheckCircle2, Settings, HelpCircle } from './Icons';
import { evaluateSpeech } from '../utils/phoneticsEvaluator';

export default function ShadowingLab({ currentItem, onNext, onPrev, onRandom, totalItems, onMasterToggle, isMastered }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [transcript, setTranscript] = useState('');
  const [evalResult, setEvalResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Voice selection states
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);

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
      onNext(); // Swipe Left -> Next
    } else if (distance < -minDistance) {
      onPrev(); // Swipe Right -> Prev
    }
  };


  // Load and filter native Chinese voices from browser
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

  // Initialize Web Speech Recognition in Manual-Toggle Mode
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true; // Stay ON while user is reading the full sentence
      rec.interimResults = true; // Stream live transcript
      rec.lang = 'zh-CN';

      rec.onresult = (event) => {
        let fullText = '';
        for (let i = 0; i < event.results.length; i++) {
          fullText += event.results[i][0].transcript;
        }
        setTranscript(fullText);
        accumulatedRef.current = fullText;
        // NOTE: We DO NOT evaluate here automatically! Evaluation happens ONLY when user clicks Mic to Stop.
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMsg('Vui lòng cho phép quyền truy cập Micro trên trình duyệt để luyện phát âm!');
          setIsRecording(false);
        }
      };

      rec.onend = () => {
        // If mic ended naturally while user was still recording (e.g. browser timeout), restart unless user stopped it manually
      };

      recognitionRef.current = rec;
    } else {
      setErrorMsg('Trình duyệt hiện tại chưa hỗ trợ Web Speech Recognition. Bạn nên dùng Chrome hoặc Edge để chấm điểm phát âm tốt nhất.');
    }
  }, [currentItem]);

  // Reset state on item change
  useEffect(() => {
    setTranscript('');
    accumulatedRef.current = '';
    setEvalResult(null);
    setErrorMsg('');
  }, [currentItem]);

  // Speak Chinese Text
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

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  // Toggle Recording: Click Mic to START -> Read Sentence -> Click Mic to STOP -> Evaluate!
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Chức năng nhận diện giọng nói không khả dụng trên trình duyệt này.');
      return;
    }

    if (isRecording) {
      // USER CLICKED TO STOP RECORDING -> NOW EVALUATE!
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsRecording(false);

      const finalSpoken = accumulatedRef.current || transcript;
      if (finalSpoken && finalSpoken.trim()) {
        const res = evaluateSpeech(finalSpoken, currentItem.example, currentItem.examplePinyin);
        setEvalResult(res);
        if (res.totalScore >= 85 && !isMastered) {
          onMasterToggle(currentItem.id);
        }
      } else {
        setErrorMsg('Chưa nghe thấy giọng đọc. Vui lòng bấm Mic, đọc hết câu rồi bấm nút Mic lần nữa để Tắt & Chấm điểm.');
      }
    } else {
      // USER CLICKED TO START RECORDING
      setTranscript('');
      accumulatedRef.current = '';
      setEvalResult(null);
      setErrorMsg('');
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start mic:', err);
      }
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
      
      {/* Top Header & Navigation */}
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            background: 'rgba(99, 102, 241, 0.2)',
            color: '#818cf8',
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            # {currentItem.id} / {totalItems}
          </span>
          <span style={{
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#cbd5e1',
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            fontSize: '0.85rem'
          }}>
            {currentItem.pos}
          </span>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            className="btn-secondary"
            style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
            title="Tùy chỉnh giọng đọc tiếng Trung"
          >
            <Settings size={16} /> Giọng đọc ({availableVoices.length})
          </button>

          <button
            onClick={() => setShowCriteriaModal(true)}
            className="btn-secondary"
            style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
            title="Xem tiêu chí chấm điểm"
          >
            <HelpCircle size={16} /> Tiêu chí AI Chấm Điểm
          </button>

          <button onClick={onPrev} className="btn-secondary" style={{ padding: '0.5rem 0.8rem' }}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={onRandom} className="btn-secondary" style={{ padding: '0.5rem 0.8rem' }}>
            <Shuffle size={18} /> Ngẫu nhiên
          </button>
          <button onClick={onNext} className="btn-secondary" style={{ padding: '0.5rem 0.8rem' }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Voice Customization Drawer */}
      {showVoiceSettings && (
        <div className="glass-card animate-fade-in" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: 'rgba(15, 23, 42, 0.9)' }}>
          <h4 style={{ fontSize: '0.95rem', color: '#818cf8', marginBottom: '0.75rem', fontWeight: 600 }}>
            🎙️ Tùy Chỉnh Giọng Đọc Bản Xứ (Voice Accent Tuning)
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>
                Chọn Giọng Người Trung Quốc:
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
                Độ Cao Ngữ Điệu (Pitch): {pitch}x
              </label>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.05"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div
        className="glass-card"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ padding: '2.5rem', textAlign: 'center', position: 'relative' }}
      >
        {/* Mobile Touch Swipe Hint */}
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem', userSelect: 'none' }}>
          👈 Vuốt màn hình trái / phải để đổi từ nhanh trên điện thoại 👉
        </div>

        
        {/* Mastered Toggle */}
        <button
          onClick={() => onMasterToggle(currentItem.id)}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: isMastered ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${isMastered ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
            color: isMastered ? '#10b981' : '#94a3b8',
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <CheckCircle2 size={16} />
          <span>{isMastered ? 'Đã làm chủ' : 'Đánh dấu thuộc'}</span>
        </button>

        {/* Word Display */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 className="zh-text" style={{ fontSize: '3.5rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.05em' }}>
            {currentItem.word}
          </h2>
          <div style={{ fontSize: '1.5rem', color: '#818cf8', fontWeight: 500, marginTop: '0.3rem' }}>
            {currentItem.pinyin}
          </div>
          <div style={{ fontSize: '1.2rem', color: '#cbd5e1', marginTop: '0.5rem', fontWeight: 500 }}>
            {currentItem.meaning}
          </div>
        </div>

        {/* Speaker Controls */}
        <div style={{
          display: 'flex',
          justify: 'center',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => speakText(currentItem.word)}
            className="btn-primary"
            style={{ borderRadius: '50px', padding: '0.75rem 1.5rem' }}
          >
            <Volume2 size={20} />
            <span>Phát âm Từ</span>
          </button>

          {/* Speed Selector */}
          <div style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '10px',
            padding: '0.25rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button
              onClick={() => setSpeed(1.0)}
              style={{
                background: speed === 1.0 ? 'var(--accent-primary)' : 'transparent',
                color: 'white',
                border: 'none',
                padding: '0.3rem 0.7rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              1.0x (Thường)
            </button>
            <button
              onClick={() => setSpeed(0.75)}
              style={{
                background: speed === 0.75 ? 'var(--accent-primary)' : 'transparent',
                color: 'white',
                border: 'none',
                padding: '0.3rem 0.7rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              0.75x (Chậm)
            </button>
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(255, 255, 255, 0.08)', margin: '2rem 0' }} />

        {/* Real Context Example Sentence */}
        <div>
          <h3 style={{ fontSize: '0.95rem', color: '#94a3b8', textTransform: 'uppercase', tracking: '0.05em', marginBottom: '1rem' }}>
            💬 Câu Ví Dụ Ngữ Cảnh Giao Tiếp:
          </h3>

          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '1.5rem'
          }}>
            <div className="zh-text" style={{ fontSize: '1.8rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem', lineHeight: '1.5' }}>
              {currentItem.example}
            </div>

            <div style={{ fontSize: '1.1rem', color: '#a5b4fc', marginBottom: '0.5rem', fontWeight: 400 }}>
              {currentItem.examplePinyin}
            </div>

            <div style={{ fontSize: '1.05rem', color: '#cbd5e1', fontStyle: 'italic' }}>
              "{currentItem.exampleMeaning}"
            </div>
          </div>

          {/* Phrasal Chunks */}
          {currentItem.chunks && currentItem.chunks.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.6rem' }}>
                🧩 Cụm từ thành phần (Phrasal Chunks):
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                {currentItem.chunks.map((chunk, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={() => speakText(chunk)}
                    className="btn-secondary"
                    style={{
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.95rem',
                      background: 'rgba(99, 102, 241, 0.15)',
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                      color: '#c7d2fe'
                    }}
                  >
                    <Volume2 size={14} />
                    <span className="zh-text">{chunk}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Recording Stream Banner */}
          {isRecording && (
            <div className="animate-fade-in" style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              padding: '0.8rem 1.25rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.85rem', color: '#fca5a5', marginBottom: '0.3rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Mic size={16} className="mic-active" style={{ borderRadius: '50%' }} />
                <span>Đang thu âm giọng đọc của bạn... (Hãy đọc hết câu rồi bấm nút bên dưới để Tắt Mic & Chấm điểm)</span>
              </div>
              <div className="zh-text" style={{ fontSize: '1.3rem', color: '#ffffff', fontWeight: 600, marginTop: '0.2rem' }}>
                {transcript || '...' }
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => speakText(currentItem.example)}
              className="btn-primary"
              disabled={isPlaying}
              style={{ padding: '0.9rem 1.8rem', fontSize: '1rem' }}
            >
              <Play size={20} />
              <span>Nghe Cả Câu</span>
            </button>

            <button
              onClick={toggleRecording}
              className={`btn-primary ${isRecording ? 'mic-active' : ''}`}
              style={{
                padding: '0.9rem 1.8rem',
                fontSize: '1rem',
                background: isRecording ? 'var(--danger)' : 'linear-gradient(135deg, #ec4899, #8b5cf6)'
              }}
            >
              <Mic size={20} />
              <span>
                {isRecording
                  ? '🛑 BẤM VÀO ĐÂY ĐỂ TẮT MIC & CHẤM ĐIỂM'
                  : '🎙️ BẤM MIC ĐỂ BẮT ĐẦU ĐỌC'}
              </span>
            </button>
          </div>

          {errorMsg && (
            <div style={{
              marginTop: '1rem',
              color: '#f87171',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

        </div>
      </div>

      {/* AI Voice Evaluation Breakdown Card */}
      {evalResult && (
        <div className="glass-card animate-fade-in" style={{
          marginTop: '2rem',
          padding: '2rem',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          background: 'rgba(30, 41, 59, 0.95)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Award size={28} color="#10b981" />
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc' }}>
                  Kết Quả AI Chấm Điểm Phát Âm Sư Phạm
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Đánh giá đa chiều bởi Agent Sư phạm Tiếng Trung & Ngữ âm
                </p>
              </div>
            </div>

            <div className="score-badge" style={{ fontSize: '1.25rem' }}>
              {evalResult.totalScore} / 100 Điểm
            </div>
          </div>

          {/* Sub-Scores */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>🎯 Hán tự & Thanh điệu (40%)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#38bdf8', marginTop: '0.2rem' }}>
                {evalResult.accuracyScore}%
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>🧩 Đầy đủ & Ngắt Cụm (35%)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#a78bfa', marginTop: '0.2rem' }}>
                {evalResult.completenessScore}%
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>⚡ Lưu khoát & Nhịp đọc (25%)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#34d399', marginTop: '0.2rem' }}>
                {evalResult.fluencyScore}%
              </div>
            </div>
          </div>

          {/* Spoken Text & Character Match */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            padding: '1.25rem',
            borderRadius: '12px',
            marginBottom: '1rem',
            textAlign: 'left'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
              Giọng bạn đã đọc:
            </div>
            <div className="zh-text" style={{ fontSize: '1.3rem', color: '#67e8f9', fontWeight: 500, marginBottom: '1rem' }}>
              {transcript || accumulatedRef.current || '...' }
            </div>

            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
              Chi tiết đối soát từng chữ:
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {evalResult.characterDetails.map((item, idx) => (
                <span
                  key={idx}
                  className="zh-text"
                  style={{
                    fontSize: '1.2rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    background: item.status === 'correct' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: item.status === 'correct' ? '#34d399' : '#f87171',
                    border: `1px solid ${item.status === 'correct' ? '#10b981' : '#ef4444'}`
                  }}
                >
                  {item.char}
                </span>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: evalResult.totalScore >= 80 ? '#34d399' : evalResult.totalScore >= 60 ? '#fbbf24' : '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: 'center',
            marginTop: '1rem'
          }}>
            <Sparkles size={18} />
            <span>{evalResult.feedbackMsg}</span>
          </div>
        </div>
      )}

      {/* Criteria Modal */}
      {showCriteriaModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem'
        }}>
          <div className="glass-card animate-fade-in" style={{ maxWidth: '600px', width: '100%', padding: '2rem', background: '#1e293b' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1rem' }}>
              📊 Tiêu Chí AI Chấm Điểm Phát Âm Sư Phạm
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '10px' }}>
                <strong style={{ color: '#38bdf8' }}>1. Độ chính xác Hán tự & Thanh điệu (40%):</strong>
                <p style={{ marginTop: '0.3rem', color: '#94a3b8' }}>
                  Đối soát trực tiếp từng âm tiết Hán tự và pinyin thu âm với câu chuẩn để đảm bảo người học phát âm đúng thanh điệu và phụ âm/nguyên âm.
                </p>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '10px' }}>
                <strong style={{ color: '#a78bfa' }}>2. Độ trọn vẹn Cụm từ (35%):</strong>
                <p style={{ marginTop: '0.3rem', color: '#94a3b8' }}>
                  Kiểm tra xem người học có đọc đủ câu, ngắt nghỉ đúng các khối cụm từ (Phrasal Chunks) thay vì đọc từng chữ rời rạc hay bỏ dở câu.
                </p>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '10px' }}>
                <strong style={{ color: '#34d399' }}>3. Độ lưu khoát & Nhịp đọc (25%):</strong>
                <p style={{ marginTop: '0.3rem', color: '#94a3b8' }}>
                  Đánh giá tốc độ và độ liền mạch trong nhịp đọc giao tiếp, thưởng điểm cho các chuỗi từ được phát âm mượt mà không bị lặp từ.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCriteriaModal(false)}
              className="btn-primary"
              style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}
            >
              Đã hiểu & Quay lại Luyện đọc
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
