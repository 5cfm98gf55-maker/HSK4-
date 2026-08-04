import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ShadowingLab from './components/ShadowingLab';
import PhraseCardBrowser from './components/PhraseCardBrowser';
import DialogueRoleplay from './components/DialogueRoleplay';
import SentenceBuilder from './components/SentenceBuilder';
import ArticleReader from './components/ArticleReader';
import GrammarLab from './components/GrammarLab';

import hsk4Data from './data/hsk4_data.json';

export default function App() {
  const [currentTab, setCurrentTab] = useState('shadowing');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [masteredSet, setMasteredSet] = useState(() => {
    try {
      const saved = localStorage.getItem('hsk4_mastered_ids');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      return new Set();
    }
  });

  // Save mastered IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hsk4_mastered_ids', JSON.stringify(Array.from(masteredSet)));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [masteredSet]);

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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-main)', paddingBottom: '3rem' }}>
      {/* Top Navbar Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        totalItems={hsk4Data.length}
        masteredCount={masteredSet.size}
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
      </main>

      {/* Footer Branding */}
      <footer style={{ textAlign: 'center', marginTop: '4rem', color: '#64748b', fontSize: '0.8rem' }}>
        HSK4 Phrase Master • Bộ giải pháp học Cụm từ & AI Chấm điểm Phát âm Giao tiếp Tiếng Trung 3.0
      </footer>
    </div>
  );
}
