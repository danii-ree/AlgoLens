'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Visualizer = dynamic(() => import('./components/Visualizer'), { ssr: false });
const CodeLab = dynamic(() => import('./components/CodeLab'), { ssr: false });
const QuizMode = dynamic(() => import('./components/QuizMode'), { ssr: false });
const Reference = dynamic(() => import('./components/Reference'), { ssr: false });

import { Microscope, Code, Puzzle, BookOpen, Sun, Moon } from 'lucide-react';

type NavSection = 'visualizer' | 'codelab' | 'quiz' | 'reference';

const NAV_ITEMS: { id: NavSection; icon: React.ReactNode; label: string }[] = [
  { id: 'visualizer', icon: <Microscope size={20} />, label: 'Visualizer' },
  { id: 'codelab', icon: <Code size={20} />, label: 'Code Lab' },
  { id: 'quiz', icon: <Puzzle size={20} />, label: 'Quiz Mode' },
  { id: 'reference', icon: <BookOpen size={20} />, label: 'Reference' },
];

// Splash Screen

function SplashScreen({ onDone }: { onDone: () => void }) {
  const [typed, setTyped] = useState('');
  const [showSub, setShowSub] = useState(false);
  const [fading, setFading] = useState(false);
  const TARGET = 'HackDSA';

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i < TARGET.length) { setTyped(TARGET.slice(0, ++i)); }
      else { clearInterval(t); setTimeout(() => setShowSub(true), 200); setTimeout(() => setFading(true), 1200); setTimeout(onDone, 1800); }
    }, 110);
    return () => clearInterval(t);
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-main)', zIndex: 9999, opacity: fading ? 0 : 1, transition: 'opacity 0.6s ease',
      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,245,255,0.06) 0%, transparent 60%)',
    }}>
      <div style={{ position: 'relative' }}>
        <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 72, fontWeight: 800, letterSpacing: '-2px', color: 'var(--text-primary)', lineHeight: 1, textShadow: '0 0 40px var(--accent-primary-border)' }}>
          {typed}
          <span style={{ display: 'inline-block', width: 4, height: '0.85em', background: 'var(--accent-primary)', marginLeft: 4, verticalAlign: 'middle', animation: 'blink 1s step-end infinite', boxShadow: '0 0 12px var(--accent-primary)' }} />
        </div>
        {showSub && (
          <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 18, color: 'var(--text-secondary)', textAlign: 'center', marginTop: 10, animation: 'fadeIn 0.5s ease forwards' }}>
            Interactive Data Structures & Algorithms
          </div>
        )}
      </div>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}

// Main App

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeSection, setActiveSection] = useState<NavSection>('visualizer');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  function toggleTheme() {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Persist section to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hackdsa-section') as NavSection | null;
      if (saved && NAV_ITEMS.find((n) => n.id === saved)) setActiveSection(saved);
    } catch { }
  }, []);

  function navigate(section: NavSection) {
    setActiveSection(section);
    try { localStorage.setItem('hackdsa-section', section); } catch { }
  }

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
      if (e.key === '1') navigate('visualizer');
      if (e.key === '2') navigate('codelab');
      if (e.key === '3') navigate('quiz');
      if (e.key === '4') navigate('reference');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (showSplash) {
    return (
      <>
        <SplashScreen onDone={() => setShowSplash(false)} />
        <style>{`
          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
          @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        `}</style>
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg-main)' }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Top Navbar */}
      <nav className="mobile-nav-container" style={{
        height: 64, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        background: 'var(--bg-glass)', borderBottom: '1px solid var(--border-glass)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-alt))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 0 15px var(--accent-primary-border)' }}>
            <a href='/' style={{ textDecoration: 'none', color: 'inherit' }}><Microscope size={22} /></a>
          </div>
          <div className="hide-mobile" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            <a href='/' style={{ textDecoration: 'none', color: 'inherit' }}>HackDSA</a>
          </div>
        </div>

        {/* Nav items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-panel-trans)', padding: '6px', borderRadius: 16, border: '1px solid var(--border-glass)' }}>
          {NAV_ITEMS.map((item, i) => {
            const active = activeSection === item.id;
            return (
              <button key={item.id} onClick={() => navigate(item.id)} title={item.label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px',
                  background: active ? 'var(--accent-primary-bg)' : 'transparent',
                  borderRadius: 12, border: 'none', cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                  boxShadow: active ? 'inset 0 0 0 1px var(--accent-primary-border), 0 0 12px var(--accent-primary-bg)' : 'none',
                  color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                }}
                onMouseOver={(e) => {
                  if (!active) e.currentTarget.style.color = 'var(--text-primary)';
                  if (!active) e.currentTarget.style.background = 'var(--bg-panel-hover)';
                }}
                onMouseOut={(e) => {
                  if (!active) e.currentTarget.style.color = 'var(--text-secondary)';
                  if (!active) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                <span className="hide-mobile" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 14, fontWeight: active ? 700 : 500, letterSpacing: '0.2px' }}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Theme Toggler */}
          <button onClick={toggleTheme} title="Toggle Theme" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, background: 'transparent', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s', marginLeft: 8 }}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        <div style={{ flex: 1, overflow: 'hidden' }}>
          {activeSection === 'visualizer' && <Visualizer />}
          {activeSection === 'codelab' && <CodeLab />}
          {activeSection === 'quiz' && (
            <div style={{ height: '100%', overflowY: 'auto' }}><QuizMode /></div>
          )}
          {activeSection === 'reference' && (
            <div style={{ height: '100%' }}><Reference /></div>
          )}
        </div>
      </main>
    </div>
  );
}
