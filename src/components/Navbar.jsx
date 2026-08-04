import React from 'react';
import { Mic, BookOpen, MessageSquare, Puzzle, Sparkles, Bot, Volume2, CheckCircle2 } from './Icons';




export default function Navbar({ currentTab, setCurrentTab, totalItems, masteredCount }) {
  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.8rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            padding: '0.6rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)'
          }}>
            <Sparkles size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
              HSK4 <span style={{ color: '#818cf8' }}>Phrase Master</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Giao Tiếp Tiếng Trung 3.0 • Phrasal Learning</p>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="navbar-scroll-tabs">
          <button
            onClick={() => setCurrentTab('shadowing')}
            className={currentTab === 'shadowing' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            <Sparkles size={18} />
            <span>Luyện Nghe & AI Chấm Điểm</span>
          </button>

          <button
            onClick={() => setCurrentTab('chatbot')}
            className={currentTab === 'chatbot' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            <Volume2 size={18} />
            <span>🤖 AI Speaking Partner</span>
          </button>

          <button
            onClick={() => setCurrentTab('grammar')}
            className={currentTab === 'grammar' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            <BookOpen size={18} />
            <span>🧩 Ngữ Pháp HSK4</span>
          </button>

          <button
            onClick={() => setCurrentTab('articles')}
            className={currentTab === 'articles' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            <BookOpen size={18} />
            <span>📰 Bài Đọc & Báo HSK4</span>
          </button>

          <button
            onClick={() => setCurrentTab('library')}
            className={currentTab === 'library' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            <BookOpen size={18} />
            <span>Kho 981 Cụm Từ</span>
          </button>

          <button
            onClick={() => setCurrentTab('dialogue')}
            className={currentTab === 'dialogue' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            <MessageSquare size={18} />
            <span>💬 Hội Thoại Ngữ Cảnh</span>
          </button>

          <button
            onClick={() => setCurrentTab('builder')}
            className={currentTab === 'builder' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            <CheckCircle2 size={18} />
            <span>🧩 Ghép Cụm Từ</span>
          </button>
        </div>


        {/* User Progress Stats */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: 'rgba(30, 41, 59, 0.6)',
          padding: '0.4rem 0.8rem',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.8rem'
        }}>
          <div>
            <span style={{ color: '#94a3b8' }}>Đã làm chủ: </span>
            <strong style={{ color: '#10b981', fontWeight: 700 }}>{masteredCount}</strong> / {totalItems}
          </div>
        </div>
      </div>
    </header>
  );
}
