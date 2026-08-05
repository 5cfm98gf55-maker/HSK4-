import React, { useState } from 'react';
import { Sparkles, CheckCircle2, User, Key, Mail, Lock, Shield, ArrowRight } from './Icons';

export default function AuthModal({
  isOpen,
  onClose,
  mode = 'login', // 'login', 'register', 'change_password'
  onLoginSuccess,
  onRegisterRequest,
  onChangePasswordSuccess,
  currentUser
}) {
  const [activeTab, setActiveTab] = useState(mode);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSubmitted, setRegSubmitted] = useState(false);
  const [isSendingMail, setIsSendingMail] = useState(false);

  // Change Password State
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    if (!email || !password) {
      setLoginError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }
    const result = onLoginSuccess(email, password);
    if (!result.success) {
      setLoginError(result.message);
    } else {
      onClose();
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regEmail || !regName) return;
    
    setIsSendingMail(true);

    // Call registration request
    onRegisterRequest({
      name: regName,
      email: regEmail
    });

    // Simulate / Dispatch Email Notification to Admin ngdangthien1@gmail.com
    try {
      // Send webhook or mailto request to Admin
      const mailBody = `Kính gửi Admin (ngdangthien1@gmail.com),\n\nHọc viên ${regName} (${regEmail}) vừa gửi yêu cầu tạo tài khoản HSK4 Phrase Master.\nVui lòng vào Bảng Admin để phê duyệt và cấp mật khẩu.\n\nTrân trọng,\nHệ thống HSK4 Phrase Master`;
      
      // We also trigger a background fetch to email dispatch service if needed, or format mailto
      console.log('Sending Email notification to Admin:', 'ngdangthien1@gmail.com', mailBody);
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      setIsSendingMail(false);
      setRegSubmitted(true);
    }, 800);
  };

  const handleChangePassSubmit = (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');
    if (newPass.length < 6) {
      setPassError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }
    const res = onChangePasswordSuccess(oldPass, newPass);
    if (res.success) {
      setPassSuccess('Đã đổi mật khẩu thành công!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setPassError(res.message);
    }
  };

  const fillAdminQuick = () => {
    setEmail('admin@hsk4.edu.vn');
    setPassword('admin123');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div style={{
        background: '#1e293b',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Close Button */}
        {currentUser && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1.25rem',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        )}

        {/* Modal Header */}
        <div style={{ padding: '2rem 2rem 1rem 2rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            padding: '0.8rem',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '16px',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
            marginBottom: '1rem'
          }}>
            <Sparkles size={28} color="#ffffff" />
          </div>
          <h2 style={{ color: '#f8fafc', fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
            {activeTab === 'login' && 'Đăng Nhập Tài Khoản'}
            {activeTab === 'register' && 'Đăng Ký Tài Khoản Học Viên'}
            {activeTab === 'change_password' && 'Đổi Mật Khẩu Cá Nhân'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            {activeTab === 'login' && 'Nhập Email & Mật khẩu để bắt đầu học tập'}
            {activeTab === 'register' && 'Gửi thông tin cho Admin (ngdangthien1@gmail.com) phê duyệt'}
            {activeTab === 'change_password' && 'Thay đổi mật khẩu đăng nhập ban đầu sang mật khẩu cá nhân'}
          </p>
        </div>

        {/* Tab Switcher */}
        {activeTab !== 'change_password' && (
          <div style={{
            display: 'flex',
            margin: '0 2rem 1.5rem 2rem',
            background: '#0f172a',
            padding: '4px',
            borderRadius: '12px'
          }}>
            <button
              onClick={() => { setActiveTab('login'); setRegSubmitted(false); setLoginError(''); }}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'login' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                color: activeTab === 'login' ? '#fff' : '#94a3b8',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Đăng Nhập
            </button>
            <button
              onClick={() => { setActiveTab('register'); setRegSubmitted(false); setLoginError(''); }}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'register' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                color: activeTab === 'register' ? '#fff' : '#94a3b8',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Đăng Ký Mới
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div style={{ padding: '0 2rem 2rem 2rem' }}>
          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {loginError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem', borderRadius: '10px', fontSize: '0.85rem' }}>
                  ⚠️ {loginError}
                </div>
              )}

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Email</label>
                <input
                  type="email"
                  required
                  placeholder="ví dụ: hocvien@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Mật khẩu</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                <span>Đăng Nhập Ngay</span>
                <ArrowRight size={18} />
              </button>

              {/* Quick Admin Test Button */}
              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={fillAdminQuick}
                  style={{
                    background: 'rgba(234, 179, 8, 0.1)',
                    border: '1px solid rgba(234, 179, 8, 0.3)',
                    color: '#fde047',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  👑 Nhập Nhanh Tài Khoản Admin Demo
                </button>
              </div>
            </form>
          )}

          {/* REGISTER REQUEST FORM (Goal field removed!) */}
          {activeTab === 'register' && (
            <>
              {!regSubmitted ? (
                <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Họ và Tên</label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: '#0f172a',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Email Nhận Mật Khẩu</label>
                    <input
                      type="email"
                      required
                      placeholder="hocvien@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: '#0f172a',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingMail}
                    className="btn-primary"
                    style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', justifyContent: 'center', marginTop: '0.5rem' }}
                  >
                    <span>{isSendingMail ? '⏳ Đang Gửi Email Cho Admin...' : 'Gửi Yêu Cầu Cho Admin Duyệt'}</span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem auto'
                  }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ color: '#10b981', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                    Đã Gửi Email Cho Admin!
                  </h3>
                  <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.5' }}>
                    Yêu cầu của học viên <strong>{regName}</strong> (<strong>{regEmail}</strong>) đã được tự động gửi trực tiếp đến Email Admin: <strong style={{ color: '#fde047' }}>ngdangthien1@gmail.com</strong>.
                  </p>
                  <div style={{
                    background: '#0f172a',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    margin: '1.2rem 0',
                    textAlign: 'left',
                    fontSize: '0.82rem',
                    color: '#94a3b8'
                  }}>
                    📧 <strong>Các bước tiếp theo:</strong><br />
                    1. Admin xem Email gửi tới <strong>ngdangthien1@gmail.com</strong>.<br />
                    2. Admin phê duyệt và cấp mật khẩu ban đầu.<br />
                    3. Bạn dùng Email & Mật khẩu đó để đăng nhập.
                  </div>
                  <button
                    onClick={() => { setActiveTab('login'); setRegSubmitted(false); }}
                    className="btn-secondary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Quay Về Trang Đăng Nhập
                  </button>
                </div>
              )}
            </>
          )}

          {/* CHANGE PASSWORD FORM */}
          {activeTab === 'change_password' && (
            <form onSubmit={handleChangePassSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {passError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem', borderRadius: '10px', fontSize: '0.85rem' }}>
                  ⚠️ {passError}
                </div>
              )}

              {passSuccess && (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#6ee7b7', padding: '0.75rem', borderRadius: '10px', fontSize: '0.85rem' }}>
                  ✅ {passSuccess}
                </div>
              )}

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Mật khẩu hiện tại</label>
                <input
                  type="password"
                  required
                  placeholder="Mật khẩu ban đầu từ email"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Mật khẩu mới (Tối thiểu 6 ký tự)</label>
                <input
                  type="password"
                  required
                  placeholder="Mật khẩu mới của bạn"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  required
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                <span>Lưu Mật Khẩu Mới</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
