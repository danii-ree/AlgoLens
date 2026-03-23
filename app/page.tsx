'use client';
import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

const Visualizer = dynamic(() => import('./components/Visualizer'), { ssr: false });
const CodeLab = dynamic(() => import('./components/CodeLab'), { ssr: false });
const QuizMode = dynamic(() => import('./components/QuizMode'), { ssr: false });
const Reference = dynamic(() => import('./components/Reference'), { ssr: false });

type NavSection = 'visualizer' | 'codelab' | 'quiz' | 'reference';

const NAV_ITEMS: { id: NavSection; icon: string; label: string }[] = [
  { id: 'visualizer', icon: '🔬', label: 'Visualizer' },
  { id: 'codelab', icon: '💻', label: 'Code Lab' },
  { id: 'quiz', icon: '🧩', label: 'Quiz Mode' },
  { id: 'reference', icon: '📖', label: 'Reference' },
];

// ── Splash Screen ─────────────────────────────────────────────────────────────

function SplashScreen({ onDone }: { onDone: () => void }) {
  const [typed, setTyped] = useState('');
  const [showSub, setShowSub] = useState(false);
  const [fading, setFading] = useState(false);
  const TARGET = 'AlgoLens';

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
      background: '#0D1117', zIndex: 9999, opacity: fading ? 0 : 1, transition: 'opacity 0.6s ease',
      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,245,255,0.06) 0%, transparent 60%)',
    }}>
      <div style={{ position: 'relative' }}>
        <div style={{ fontFamily: 'Syne', fontSize: 72, fontWeight: 800, letterSpacing: '-2px', color: '#E6EDF3', lineHeight: 1, textShadow: '0 0 40px rgba(0,245,255,0.3)' }}>
          {typed}
          <span style={{ display: 'inline-block', width: 4, height: '0.85em', background: '#00F5FF', marginLeft: 4, verticalAlign: 'middle', animation: 'blink 1s step-end infinite', boxShadow: '0 0 12px #00F5FF' }} />
        </div>
        {showSub && (
          <div style={{ fontFamily: 'DM Sans', fontSize: 18, color: '#8B949E', textAlign: 'center', marginTop: 10, animation: 'fadeIn 0.5s ease forwards' }}>
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

// ── Main App ──────────────────────────────────────────────────────────────────

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeSection, setActiveSection] = useState<NavSection>('visualizer');
  const [sidebarHovered, setSidebarHovered] = useState(false);

  // Persist section to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('algolens-section') as NavSection | null;
      if (saved && NAV_ITEMS.find((n) => n.id === saved)) setActiveSection(saved);
    } catch { }
  }, []);

  function navigate(section: NavSection) {
    setActiveSection(section);
    try { localStorage.setItem('algolens-section', section); } catch { }
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

  const sidebarW = sidebarHovered ? 180 : 68;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#0D1117' }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Sidebar */}
      <div
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
        className="no-print"
        style={{
          width: sidebarW, flexShrink: 0, display: 'flex', flexDirection: 'column',
          background: 'rgba(22,27,34,0.95)', borderRight: '1px solid rgba(48,54,61,0.8)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)', overflow: 'hidden', zIndex: 100,
        }}>
        {/* Logo */}
        <div style={{ padding: '20px 0 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid #21262D', flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #00F5FF, #0080FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
            🔬
          </div>
          {sidebarHovered && (
            <div style={{ fontFamily: 'Syne', fontSize: 15, fontWeight: 800, color: '#E6EDF3', marginTop: 8, whiteSpace: 'nowrap', letterSpacing: '-0.5px', animation: 'fadeIn 0.2s ease' }}>
              AlgoLens
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_ITEMS.map((item) => {
            const active = activeSection === item.id;
            return (
              <button key={item.id} onClick={() => navigate(item.id)} title={item.label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: sidebarHovered ? '12px 20px' : '12px 0', justifyContent: sidebarHovered ? 'flex-start' : 'center',
                  background: active ? 'rgba(0,245,255,0.1)' : 'transparent',
                  borderLeft: active ? '3px solid #00F5FF' : '3px solid transparent',
                  border: 'none', cursor: 'pointer', width: '100%', transition: 'all 0.2s',
                  boxShadow: active ? 'inset 0 0 20px rgba(0,245,255,0.05)' : 'none',
                }}>
                <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
                {sidebarHovered && (
                  <span style={{ fontFamily: 'Syne', fontSize: 13, fontWeight: active ? 700 : 500, color: active ? '#00F5FF' : '#8B949E', whiteSpace: 'nowrap', animation: 'fadeIn 0.15s ease' }}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Keyboard hint */}
        {sidebarHovered && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid #21262D', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#3D4450', lineHeight: 1.8 }}>
              {NAV_ITEMS.map((n, i) => (
                <div key={n.id}>[{i + 1}] {n.label}</div>
              ))}
              <div style={{ marginTop: 4 }}>[↑/↓] Scan steps</div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Section header */}
        <div className="no-print" style={{
          height: 44, display: 'flex', alignItems: 'center', paddingLeft: 20,
          background: 'rgba(13,17,23,0.8)', borderBottom: '1px solid rgba(48,54,61,0.5)',
          backdropFilter: 'blur(8px)', flexShrink: 0,
        }}>
          <span style={{ fontSize: 16, marginRight: 8 }}>{NAV_ITEMS.find((n) => n.id === activeSection)?.icon}</span>
          <span style={{ fontFamily: 'Syne', fontSize: 14, fontWeight: 700, color: '#E6EDF3' }}>
            {NAV_ITEMS.find((n) => n.id === activeSection)?.label}
          </span>
          <div style={{ marginLeft: 'auto', paddingRight: 20, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#3D4450' }}>
            AlgoLens v1.0 · Press 1–4 to navigate
          </div>
        </div>

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
