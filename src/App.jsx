import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ShadowingLab from './components/ShadowingLab';
import PhraseCardBrowser from './components/PhraseCardBrowser';
import DialogueRoleplay from './components/DialogueRoleplay';
import SentenceBuilder from './components/SentenceBuilder';
import AIChatbot from './components/AIChatbot';
import ArticleReader from './components/ArticleReader';

import hsk4Data from './data/hsk4_data.json';



export default function App() {
  const [currentTab, setCurrentTab] = useState('shadowing'); // Default home view: Shadowing Lab
  const [currentIndex, setCurrentIndex] = useState(0);
  const [masteredIds, setMasteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem('hsk4_mastered_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const masteredSet = new Set(masteredIds);
  const currentItem = hsk4Data[currentIndex] || hsk4Data[0];

  useEffect(() => {
    try {
      localStorage.setItem('hsk4_mastered_ids', JSON.stringify(masteredIds));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [masteredIds]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % hsk4Data.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + hsk4Data.length) % hsk4Data.length);
  };

  const handleRandom = () => {
    const rand = Math.floor(Math.random() * hsk4Data.length);
    setCurrentIndex(rand);
  };

  const handleMasterToggle = (id) => {
    setMasteredIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectForShadowing = (item) => {
    const idx = hsk4Data.findIndex(d => d.id === item.id);
    if (idx !== -1) {
      setCurrentIndex(idx);
      setCurrentTab('shadowing');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        totalItems={hsk4Data.length}
        masteredCount={masteredSet.size}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        {currentTab === 'shadowing' && (
          <ShadowingLab
            currentItem={currentItem}
            onNext={handleNext}
            onPrev={handlePrev}
            onRandom={handleRandom}
            totalItems={hsk4Data.length}
            onMasterToggle={handleMasterToggle}
            isMastered={masteredSet.has(currentItem.id)}
          />
        )}

        {currentTab === 'chatbot' && (
          <AIChatbot
            currentItem={currentItem}
          />
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
            onNext={handleNext}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        fontSize: '0.85rem',
        color: '#64748b'
      }}>
        HSK4 Phrase Master • Bộ giải pháp học Cụm từ & AI Chấm điểm Phát âm Giao tiếp Tiếng Trung 3.0
      </footer>

    </div>
  );
}
