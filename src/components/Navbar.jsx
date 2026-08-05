import React, { useState } from 'react';
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.75rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '1360px',
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
            padding: '0.55rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', margin: 0 }}>
              HSK4 <span style={{ color: '#818cf8' }}>Phrase Master</span>
            </h1>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>Giao Tiếp Tiếng Trung 3.0 • Phrasal Learning</p>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="navbar-scroll-tabs" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentTab('shadowing')}
            className={currentTab === 'shadowing' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.8rem', whiteSpace: 'nowrap' }}
          >
            <Sparkles size={16} />
            <span>✨ Luyện Nghe & AI</span>
          </button>

          <button
            onClick={() => setCurrentTab('grammar')}
            className={currentTab === 'grammar' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.8rem', whiteSpace: 'nowrap' }}
          >
            <BookOpen size={16} />
            <span>🧩 Ngữ Pháp</span>
          </button>

          <button
            onClick={() => setCurrentTab('articles')}
            className={currentTab === 'articles' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.8rem', whiteSpace: 'nowrap' }}
          >
            <BookOpen size={16} />
            <span>📰 Bài Đọc</span>
          </button>

          <button
            onClick={() => setCurrentTab('library')}
            className={currentTab === 'library' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.8rem', whiteSpace: 'nowrap' }}
          >
            <BookOpen size={16} />
            <span>📖 Kho 981 Từ</span>
          </button>

          <button
            onClick={() => setCurrentTab('dialogue')}
            className={currentTab === 'dialogue' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.8rem', whiteSpace: 'nowrap' }}
          >
            <MessageSquare size={16} />
            <span>💬 Hội Thoại</span>
          </button>

          {/* Admin Tab Only Visible to Logged-in Admins */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={currentTab === 'admin' ? 'btn-primary' : 'btn-secondary'}
              style={{
                fontSize: '0.82rem',
                padding: '0.45rem 0.8rem',
                whiteSpace: 'nowrap',
                background: currentTab === 'admin' ? 'linear-gradient(135deg, #eab308, #ca8a04)' : 'rgba(234, 179, 8, 0.15)',
                color: currentTab === 'admin' ? '#0f172a' : '#fde047',
                border: '1px solid rgba(234, 179, 8, 0.4)',
                fontWeight: 700
              }}
            >
              <Shield size={16} />
              <span>👑 Bảng Admin</span>
            </button>
          )}
        </div>

        {/* Right Side: Progress Counter & Professional Account Control Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Mastered Progress Counter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(30, 41, 59, 0.7)',
            padding: '0.35rem 0.75rem',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.78rem'
          }}>
            <span style={{ color: '#94a3b8' }}>Đã thuộc:</span>
            <strong style={{ color: '#10b981', fontWeight: 700 }}>{masteredCount}</strong>
            <span style={{ color: '#64748b' }}>/ {totalItems}</span>
          </div>

          {/* ACCOUNT CONTROL BAR */}
          {currentUser ? (
            /* LOGGED IN ACCOUNT WIDGET */
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: currentUser.role === 'admin'
                    ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(202, 138, 4, 0.15))'
                    : 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(79, 70, 229, 0.15))',
                  border: `1px solid ${currentUser.role === 'admin' ? 'rgba(234, 179, 8, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`,
                  padding: '0.35rem 0.75rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '0.82rem',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: currentUser.role === 'admin' ? '#eab308' : '#6366f1',
                  color: currentUser.role === 'admin' ? '#0f172a' : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.75rem'
                }}>
                  {currentUser.role === 'admin' ? '👑' : currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.8rem', color: currentUser.role === 'admin' ? '#fde047' : '#818cf8', whiteSpace: 'nowrap' }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                    {currentUser.role === 'admin' ? 'Quản Trị Viên' : 'Học Viên'}
                  </div>
                </div>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginLeft: '0.2rem' }}>▼</span>
              </button>

              {/* Account Dropdown Menu */}
              {userMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  background: '#1e293b',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '14px',
                  padding: '0.5rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  minWidth: '200px',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem'
                }}>
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '0.2rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Đăng nhập với email:</div>
                    <div style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 600, wordBreak: 'break-all' }}>{currentUser.email}</div>
                  </div>

                  {currentUser.role === 'admin' ? (
                    <button
                      onClick={() => { setCurrentTab('admin'); setUserMenuOpen(false); }}
                      style={{
                        background: 'rgba(234, 179, 8, 0.15)',
                        border: 'none',
                        color: '#fde047',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Shield size={16} /> Bảng Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => { onOpenChangePass(); setUserMenuOpen(false); }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: 'none',
                        color: '#cbd5e1',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Key size={16} /> Đổi Mật Khẩu
                    </button>
                  )}

                  <button
                    onClick={() => { onLogout(); setUserMenuOpen(false); }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: 'none',
                      color: '#fca5a5',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginTop: '0.2rem'
                    }}
                  >
                    🚪 Đăng Xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* NOT LOGGED IN BUTTONS */
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                onClick={() => onOpenAuthModal('login')}
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', whiteSpace: 'nowrap' }}
              >
                <User size={15} />
                <span>Đăng Nhập</span>
              </button>

              <button
                onClick={() => onOpenAuthModal('register')}
                className="btn-primary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', whiteSpace: 'nowrap' }}
              >
                <span>Đăng Ký</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
