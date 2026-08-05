import React, { useState } from 'react';
import { Sparkles, CheckCircle2, User, BookOpen, MessageSquare, Key, Mail, Shield } from './Icons';

export default function AdminDashboard({
  pendingUsers,
  approvedUsers,
  onApproveUser,
  onRejectUser,
  onResetUserPassword,
  allStudentsProgress
}) {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'students', 'logs'
  const [simulatedEmailLog, setSimulatedEmailLog] = useState(null);

  const handleApprove = (user) => {
    const generatedPass = `HSK4_${Math.floor(1000 + Math.random() * 9000)}`;
    onApproveUser(user.email, generatedPass);

    // Show simulated email dispatch notification
    setSimulatedEmailLog({
      to: user.email,
      name: user.name,
      password: generatedPass,
      sentAt: new Date().toLocaleTimeString()
    });
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '20px',
        padding: '1.8rem 2rem',
        marginBottom: '2rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.4)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', color: '#818cf8', marginBottom: '0.6rem' }}>
            <Shield size={14} /> 👑 QUẢN TRỊ VIÊN ADMIN HSK4
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Bảng Quản Lý Duyệt Học Viên & Tiến Độ Học Tập
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '0.4rem' }}>
            Duyệt đăng ký tự động cấp mật khẩu gửi qua Mail • Theo dõi sát sao kết quả từng học viên không bị lẫn lộn
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ background: '#0f172a', padding: '0.8rem 1.2rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#eab308' }}>{pendingUsers.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Chờ Admin Duyệt</div>
          </div>
          <div style={{ background: '#0f172a', padding: '0.8rem 1.2rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>{approvedUsers.length}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Học Viên Đã Duyệt</div>
          </div>
        </div>
      </div>

      {/* Simulated Email Sent Notification Banner */}
      {simulatedEmailLog && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 95, 70, 0.3))',
          border: '1px solid #10b981',
          borderRadius: '16px',
          padding: '1.2rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6ee7b7', fontWeight: 700, fontSize: '0.95rem' }}>
              <Mail size={18} /> ✅ Đã Giả Lập Gửi Email Mật Khẩu Thành Công!
            </div>
            <div style={{ color: '#e2e8f0', fontSize: '0.85rem', marginTop: '0.3rem' }}>
              Hệ thống đã tạo mật khẩu ban đầu: <strong style={{ background: '#0f172a', padding: '0.2rem 0.6rem', borderRadius: '6px', color: '#fde047', letterSpacing: '0.05em' }}>{simulatedEmailLog.password}</strong> và gửi đến email <strong>{simulatedEmailLog.to}</strong> ({simulatedEmailLog.name}).
            </div>
          </div>
          <button
            onClick={() => setSimulatedEmailLog(null)}
            style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Đóng Thông Báo
          </button>
        </div>
      )}

      {/* Admin Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.8rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'pending' ? 'linear-gradient(135deg, #eab308, #ca8a04)' : 'rgba(30, 41, 59, 0.6)',
            color: activeTab === 'pending' ? '#0f172a' : '#cbd5e1',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>⏳ Yêu Cầu Chờ Duyệt</span>
          {pendingUsers.length > 0 && (
            <span style={{ background: '#0f172a', color: '#fde047', padding: '0.18rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem' }}>
              {pendingUsers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('students')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'students' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(30, 41, 59, 0.6)',
            color: activeTab === 'students' ? '#fff' : '#cbd5e1',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>👨‍🎓 Quản Lý Học Viên & Tiến Độ</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.18rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem' }}>
            {approvedUsers.length}
          </span>
        </button>
      </div>

      {/* TAB 1: PENDING APPROVALS */}
      {activeTab === 'pending' && (
        <div>
          {pendingUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#1e293b', borderRadius: '16px', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
              <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ color: '#f8fafc', fontSize: '1.2rem', margin: 0 }}>Không Có Yêu Cầu Nào Chờ Duyệt</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.4rem' }}>Tất cả các học viên mới đăng ký đều đã được xử lý thành công.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.2rem' }}>
              {pendingUsers.map((user) => (
                <div key={user.email} style={{
                  background: '#1e293b',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                      <div>
                        <h4 style={{ color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{user.name}</h4>
                        <span style={{ color: '#818cf8', fontSize: '0.82rem' }}>{user.email}</span>
                      </div>
                      <span style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#fde047', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 600 }}>
                        Chờ Duyệt
                      </span>
                    </div>

                    <div style={{ background: '#0f172a', padding: '0.75rem', borderRadius: '10px', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '1rem' }}>
                      📌 <strong>Mục tiêu học:</strong> {user.goal || 'Luyện thi HSK4'}<br />
                      🕒 <strong>Thời gian gửi:</strong> {user.submittedAt || 'Mới đây'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={() => handleApprove(user)}
                      className="btn-primary"
                      style={{ flex: 1, padding: '0.6rem', fontSize: '0.82rem', justifyContent: 'center', background: 'linear-gradient(135deg, #10b981, #059669)' }}
                    >
                      <CheckCircle2 size={16} />
                      <span>Duyệt & Tạo Pass Gửi Mail</span>
                    </button>
                    <button
                      onClick={() => onRejectUser(user.email)}
                      style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.6rem 0.8rem', borderRadius: '10px', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      Từ Chối
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: APPROVED STUDENTS & PROGRESS TRACKING */}
      {activeTab === 'students' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {approvedUsers.map((student) => {
            const progress = allStudentsProgress[student.email] || {
              masteredCount: 0,
              shadowingAvgScore: 0,
              grammarCount: 0,
              articlesCount: 0
            };
            const masteredPercent = Math.min(100, Math.round((progress.masteredCount / 981) * 100));

            return (
              <div key={student.email} style={{
                background: '#1e293b',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.5rem'
              }}>
                {/* Student Info */}
                <div style={{ flex: '1 1 240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff' }}>
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 style={{ color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{student.name}</h4>
                      <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{student.email}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.4rem' }}>
                    Mật khẩu hiện tại: <span style={{ color: '#cbd5e1', background: '#0f172a', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{student.password}</span>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div style={{ flex: '2 1 360px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.8rem' }}>
                  {/* Mastered Phrases */}
                  <div style={{ background: '#0f172a', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Cụm từ thuộc:</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>{progress.masteredCount} / 981</div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '0.4rem', overflow: 'hidden' }}>
                      <div style={{ width: `${masteredPercent}%`, height: '100%', background: '#10b981' }}></div>
                    </div>
                  </div>

                  {/* Shadowing Score */}
                  <div style={{ background: '#0f172a', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Điểm Phát Âm AI:</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#818cf8' }}>
                      {progress.shadowingAvgScore ? `${progress.shadowingAvgScore}%` : 'Chưa luyện'}
                    </div>
                  </div>

                  {/* Grammar */}
                  <div style={{ background: '#0f172a', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Ngữ Pháp:</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>{progress.grammarCount} bài</div>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <button
                    onClick={() => {
                      const newPass = `HSK4_${Math.floor(1000 + Math.random() * 9000)}`;
                      onResetUserPassword(student.email, newPass);
                      setSimulatedEmailLog({
                        to: student.email,
                        name: student.name,
                        password: newPass,
                        sentAt: new Date().toLocaleTimeString()
                      });
                    }}
                    style={{
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.4)',
                      color: '#818cf8',
                      padding: '0.55rem 0.9rem',
                      borderRadius: '10px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    🔄 Reset Pass Gửi Mail
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
