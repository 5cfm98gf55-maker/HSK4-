import React from 'react';
import { Sparkles, BookOpen, MessageSquare, CheckCircle2, User, Shield, Key } from './Icons';

export default function Navbar({
  currentTab,
  setCurrentTab,
  totalItems,
  masteredCount,
  currentUser,
  onOpenAuthModal,
  onOpenChangePass,
  onLogout
}) {
  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.85)',
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
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', margin: 0 }}>
              HSK4 <span style={{ color: '#818cf8' }}>Phrase Master</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Giao Tiếp Tiếng Trung 3.0 • Phrasal Learning</p>
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
            <span>✨ Luyện Nghe & AI Chấm Điểm</span>
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
            <span>📰 Bài Đọc HSK4</span>
          </button>

          <button
            onClick={() => setCurrentTab('library')}
            className={currentTab === 'library' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            <BookOpen size={18} />
            <span>📖 Kho 981 Cụm Từ</span>
          </button>

          <button
            onClick={() => setCurrentTab('dialogue')}
            className={currentTab === 'dialogue' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            <MessageSquare size={18} />
            <span>💬 Hội Thoại</span>
          </button>

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={currentTab === 'admin' ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', background: currentTab === 'admin' ? 'linear-gradient(135deg, #eab308, #ca8a04)' : 'rgba(234, 179, 8, 0.15)', color: currentTab === 'admin' ? '#0f172a' : '#fde047', border: '1px solid rgba(234, 179, 8, 0.3)' }}
            >
              <Shield size={18} />
              <span>👑 Bảng Admin</span>
            </button>
          )}
        </div>

        {/* User Auth & Progress Stats Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Mastered Counter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(30, 41, 59, 0.6)',
            padding: '0.4rem 0.8rem',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.8rem'
          }}>
            <span style={{ color: '#94a3b8' }}>Đã thuộc: </span>
            <strong style={{ color: '#10b981', fontWeight: 700 }}>{masteredCount}</strong> / {totalItems}
          </div>

          {/* User Account Controls */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                background: currentUser.role === 'admin' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                border: `1px solid ${currentUser.role === 'admin' ? 'rgba(234, 179, 8, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`,
                padding: '0.35rem 0.75rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <span style={{ color: currentUser.role === 'admin' ? '#fde047' : '#818cf8', fontWeight: 700 }}>
                  {currentUser.role === 'admin' ? '👑 Admin' : `🎓 ${currentUser.name}`}
                </span>
              </div>

              {currentUser.role !== 'admin' && (
                <button
                  onClick={onOpenChangePass}
                  title="Đổi Mật Khẩu"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: '#cbd5e1',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Key size={14} />
                  <span>Đổi Pass</span>
                </button>
              )}

              <button
                onClick={onLogout}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: 'none',
                  color: '#fca5a5',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                Đăng Xuất
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="btn-primary"
              style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}
            >
              <User size={16} />
              <span>Đăng Nhập / Đăng Ký</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
