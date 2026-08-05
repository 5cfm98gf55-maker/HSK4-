import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ShadowingLab from './components/ShadowingLab';
import PhraseCardBrowser from './components/PhraseCardBrowser';
import DialogueRoleplay from './components/DialogueRoleplay';
import SentenceBuilder from './components/SentenceBuilder';
import ArticleReader from './components/ArticleReader';
import GrammarLab from './components/GrammarLab';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';

import hsk4Data from './data/hsk4_data.json';

const DEFAULT_ADMIN = {
  email: 'admin@hsk4.edu.vn',
  name: 'Admin Quản Trị HSK4',
  role: 'admin',
  password: 'admin123'
};

export default function App() {
  const [currentTab, setCurrentTab] = useState('shadowing');
  const [currentIndex, setCurrentIndex] = useState(0);

  // AUTH STATE: Read from localStorage or null
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hsk4_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Automatically open Auth Modal if user is NOT logged in!
  const [authModalOpen, setAuthModalOpen] = useState(() => {
    try {
      return !localStorage.getItem('hsk4_current_user');
    } catch (e) {
      return true;
    }
  });

  const [authModalMode, setAuthModalMode] = useState('login'); // 'login', 'register', 'change_password'

  // Open Auth Modal whenever currentUser becomes null (e.g. after logout)
  useEffect(() => {
    if (!currentUser) {
      setAuthModalOpen(true);
      setAuthModalMode('login');
    }
  }, [currentUser]);

  // PENDING & APPROVED USERS STATE
  const [pendingUsers, setPendingUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('hsk4_pending_users');
      return saved ? JSON.parse(saved) : [
        { name: 'Trần Văn Nam', email: 'vannam@gmail.com', goal: 'Luyện thi HSK4 & Giao tiếp phản xạ', submittedAt: '10:30 Hôm nay' },
        { name: 'Nguyễn Thị Mai', email: 'mainguyen@gmail.com', goal: 'Học Tiếng Trung Công Việc', submittedAt: '14:15 Hôm nay' }
      ];
    } catch (e) {
      return [];
    }
  });

  const [approvedUsers, setApprovedUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('hsk4_approved_users');
      return saved ? JSON.parse(saved) : [
        { name: 'Lê Hoàng Anh', email: 'hoanganh@gmail.com', password: 'HSK4_Pass2026', registeredAt: '01/08/2026' }
      ];
    } catch (e) {
      return [];
    }
  });

  // PER-USER MASTERED SET
  const userKey = currentUser?.email ? currentUser.email.replace(/[@.]/g, '_') : 'guest';
  const [masteredSet, setMasteredSet] = useState(() => {
    try {
      const saved = localStorage.getItem(`hsk4_mastered_ids_${userKey}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      return new Set();
    }
  });

  // Reload mastered set when currentUser changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`hsk4_mastered_ids_${userKey}`);
      setMasteredSet(saved ? new Set(JSON.parse(saved)) : new Set());
    } catch (e) {
      setMasteredSet(new Set());
    }
  }, [userKey]);

  // Save mastered IDs per user
  useEffect(() => {
    try {
      localStorage.setItem(`hsk4_mastered_ids_${userKey}`, JSON.stringify(Array.from(masteredSet)));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [masteredSet, userKey]);

  // Save Pending & Approved Users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hsk4_pending_users', JSON.stringify(pendingUsers));
      localStorage.setItem('hsk4_approved_users', JSON.stringify(approvedUsers));
      if (currentUser) {
        localStorage.setItem('hsk4_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('hsk4_current_user');
      }
    } catch (e) {
      console.error('Failed saving user databases:', e);
    }
  }, [pendingUsers, approvedUsers, currentUser]);

  // LOGIN HANDLER
  const handleLogin = (emailInput, passwordInput) => {
    // Check Admin
    if (emailInput.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase() && passwordInput === DEFAULT_ADMIN.password) {
      const adminObj = DEFAULT_ADMIN;
      setCurrentUser(adminObj);
      setAuthModalOpen(false);
      return { success: true };
    }

    // Check Approved Users
    const foundUser = approvedUsers.find(u => u.email.toLowerCase() === emailInput.toLowerCase());
    if (!foundUser) {
      const isPending = pendingUsers.some(u => u.email.toLowerCase() === emailInput.toLowerCase());
      if (isPending) {
        return { success: false, message: 'Tài khoản của bạn đang chờ Admin phê duyệt. Vui lòng kiểm tra lại sau!' };
      }
      return { success: false, message: 'Email chưa được đăng ký hoặc chưa được Admin phê duyệt.' };
    }

    if (foundUser.password !== passwordInput) {
      return { success: false, message: 'Mật khẩu nhập không chính xác.' };
    }

    const userObj = { ...foundUser, role: 'student' };
    setCurrentUser(userObj);
    setAuthModalOpen(false);
    return { success: true };
  };

  // REGISTER REQUEST HANDLER
  const handleRegisterRequest = (newRequest) => {
    setPendingUsers(prev => [
      ...prev.filter(u => u.email !== newRequest.email),
      { ...newRequest, submittedAt: new Date().toLocaleTimeString() }
    ]);
  };

  // CHANGE PASSWORD HANDLER
  const handleChangePassword = (oldPass, newPass) => {
    if (!currentUser) return { success: false, message: 'Chưa đăng nhập.' };

    if (currentUser.role === 'admin') {
      return { success: false, message: 'Tài khoản Admin Demo không hỗ trợ đổi pass tại đây.' };
    }

    if (currentUser.password !== oldPass) {
      return { success: false, message: 'Mật khẩu hiện tại không đúng.' };
    }

    setApprovedUsers(prev => prev.map(u => {
      if (u.email === currentUser.email) {
        return { ...u, password: newPass };
      }
      return u;
    }));

    setCurrentUser(prev => ({ ...prev, password: newPass }));
    return { success: true };
  };

  // ADMIN APPROVE USER
  const handleApproveUser = (email, generatedPass) => {
    const targetUser = pendingUsers.find(u => u.email === email);
    if (!targetUser) return;

    const newApproved = {
      name: targetUser.name,
      email: targetUser.email,
      password: generatedPass,
      registeredAt: new Date().toLocaleDateString()
    };

    setApprovedUsers(prev => [...prev.filter(u => u.email !== email), newApproved]);
    setPendingUsers(prev => prev.filter(u => u.email !== email));
  };

  // ADMIN REJECT USER
  const handleRejectUser = (email) => {
    setPendingUsers(prev => prev.filter(u => u.email !== email));
  };

  // ADMIN RESET PASSWORD
  const handleResetUserPassword = (email, newPass) => {
    setApprovedUsers(prev => prev.map(u => {
      if (u.email === email) {
        return { ...u, password: newPass };
      }
      return u;
    }));
  };

  // LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem('hsk4_current_user');
    setCurrentUser(null);
    setCurrentTab('shadowing');
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const handleMasterToggle = (id) => {
    setMasteredSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % hsk4Data.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + hsk4Data.length) % hsk4Data.length);
  };

  const handleSelectForShadowing = (index) => {
    setCurrentIndex(index);
    setCurrentTab('shadowing');
  };

  const currentItem = hsk4Data[currentIndex] || hsk4Data[0];

  // Build progress object for Admin Dashboard
  const allStudentsProgress = {};
  approvedUsers.forEach(u => {
    const key = u.email.replace(/[@.]/g, '_');
    try {
      const savedMastered = localStorage.getItem(`hsk4_mastered_ids_${key}`);
      const count = savedMastered ? JSON.parse(savedMastered).length : 0;
      allStudentsProgress[u.email] = {
        masteredCount: count,
        shadowingAvgScore: Math.floor(82 + Math.random() * 15),
        grammarCount: Math.floor(Math.random() * 8),
        articlesCount: Math.floor(Math.random() * 5)
      };
    } catch (e) {
      allStudentsProgress[u.email] = { masteredCount: 0, shadowingAvgScore: 0, grammarCount: 0, articlesCount: 0 };
    }
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-main)', paddingBottom: '3rem' }}>
      {/* Top Navbar Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        totalItems={hsk4Data.length}
        masteredCount={masteredSet.size}
        currentUser={currentUser}
        onOpenAuthModal={(mode = 'login') => { setAuthModalMode(mode); setAuthModalOpen(true); }}
        onOpenChangePass={() => { setAuthModalMode('change_password'); setAuthModalOpen(true); }}
        onLogout={handleLogout}
      />

      {/* Main Tab View Router */}
      <main style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {currentTab === 'shadowing' && (
          <ShadowingLab
            allData={hsk4Data}
            currentIndex={currentIndex}
            onNext={handleNext}
            onPrev={handlePrev}
            masteredSet={masteredSet}
            onMasterToggle={handleMasterToggle}
            onSelectIndex={setCurrentIndex}
          />
        )}

        {currentTab === 'grammar' && (
          <GrammarLab />
        )}

        {currentTab === 'articles' && (
          <ArticleReader />
        )}

        {currentTab === 'library' && (
          <PhraseCardBrowser
            data={hsk4Data}
            onSelectForShadowing={handleSelectForShadowing}
            masteredSet={masteredSet}
            onMasterToggle={handleMasterToggle}
          />
        )}

        {currentTab === 'dialogue' && (
          <DialogueRoleplay
            currentItem={currentItem}
          />
        )}

        {currentTab === 'builder' && (
          <SentenceBuilder
            currentItem={currentItem}
          />
        )}

        {currentTab === 'admin' && currentUser?.role === 'admin' && (
          <AdminDashboard
            pendingUsers={pendingUsers}
            approvedUsers={approvedUsers}
            onApproveUser={handleApproveUser}
            onRejectUser={handleRejectUser}
            onResetUserPassword={handleResetUserPassword}
            allStudentsProgress={allStudentsProgress}
          />
        )}
      </main>

      {/* Auth Modal (Login / Register / Change Pass) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authModalMode}
        onLoginSuccess={handleLogin}
        onRegisterRequest={handleRegisterRequest}
        onChangePasswordSuccess={handleChangePassword}
        currentUser={currentUser}
      />

      {/* Footer Branding */}
      <footer style={{ textAlign: 'center', marginTop: '4rem', color: '#64748b', fontSize: '0.8rem' }}>
        HSK4 Phrase Master • Hệ thống Quản trị Học viên & Luyện Phản Xạ Tiếng Trung 3.0
      </footer>
    </div>
  );
}
