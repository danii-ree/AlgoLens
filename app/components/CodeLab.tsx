'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ALGORITHMS, CATEGORY_LABELS, getAlgorithmsByCategory } from './registry';
import type { Algorithm, AlgoStep } from './types';
import { ArrayViz, TreeViz, GraphViz, HashViz, DPViz, StackViz, QueueViz, ListViz, StateLegend } from './VizCanvas';

const CATEGORIES = ['sorting', 'searching', 'trees', 'graphs', 'hash', 'linear', 'dp'];
const LANGS = ['javascript', 'python', 'java', 'cpp'] as const;
type Lang = typeof LANGS[number];

const glass: React.CSSProperties = { background: 'rgba(22,27,34,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(48,54,61,0.8)', borderRadius: 12 };

function SyntaxHighlight({ code }: { code: string }) {
    const keywords = ['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'new', 'class', 'import', 'export', 'default', 'break', 'continue', 'def', 'int', 'void', 'bool', 'true', 'false', 'null', 'undefined', 'this', 'super', 'static'];
    const lines = code.split('\n');
    return (
        <>
            {lines.map((line, i) => {
                let highlighted = line
                    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                    // Strings
                    .replace(/(["'`])(.*?)\1/g, '<span style="color:#A5D6A7">$1$2$1</span>')
                    // Numbers
                    .replace(/\b(\d+)\b/g, '<span style="color:#FFB347">$1</span>')
                    // Keywords
                    .replace(new RegExp(`\\b(${keywords.join('|')})\\b`, 'g'), '<span style="color:#00F5FF">$1</span>')
                    // Comments
                    .replace(/(\/\/.*$)/gm, '<span style="color:#3D4450;font-style:italic">$1</span>')
                    .replace(/(#.*$)/gm, '<span style="color:#3D4450;font-style:italic">$1</span>');
                return (
                    <div key={i} dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }}
                        style={{ display: 'block', lineHeight: '1.6', minHeight: '1.6em', paddingRight: 8 }} />
                );
            })}
        </>
    );
}

export default function CodeLab() {
    const [category, setCategory] = useState('sorting');
    const [algoId, setAlgoId] = useState('bubble-sort');
    const [lang, setLang] = useState<Lang>('javascript');
    const [code, setCode] = useState('');
    const [steps, setSteps] = useState<AlgoStep[]>([]);
    const [stepIdx, setStepIdx] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [copied, setCopied] = useState(false);
    const lineRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const stepsRef = useRef(steps);
    stepsRef.current = steps;

    const algo = ALGORITHMS.find((a) => a.id === algoId);

    useEffect(() => {
        if (!algo) return;
        const c = algo.defaultCode[lang] ?? algo.defaultCode['javascript'] ?? '';
        setCode(c);
        const s = algo.generateSteps([38, 27, 43, 3, 9, 82, 10]);
        setSteps(s);
        setStepIdx(0);
        setPlaying(false);
    }, [algoId, lang, algo]);

    useEffect(() => {
        if (playing) {
            intervalRef.current = setInterval(() => {
                setStepIdx((i) => {
                    if (i >= stepsRef.current.length - 1) { setPlaying(false); return i; }
                    return i + 1;
                });
            }, 500);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [playing]);

    const currentStep = steps[stepIdx] ?? null;
    const highlightLines = currentStep?.highlightLines ?? [];

    useEffect(() => {
        if (highlightLines.length > 0) {
            const el = lineRefs.current[highlightLines[0]];
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [highlightLines]);

    function handleCopy() {
        navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    }

    function handleReset() {
        if (!algo) return;
        const c = algo.defaultCode[lang] ?? algo.defaultCode['javascript'] ?? '';
        setCode(c);
    }

    function renderViz() {
        if (!currentStep) return null;
        if (currentStep.bars) return <ArrayViz step={currentStep} />;
        if (currentStep.treeNodes) return <TreeViz step={currentStep} />;
        if (currentStep.graphNodes) return <GraphViz step={currentStep} />;
        if (currentStep.hashBuckets) return <HashViz step={currentStep} />;
        if (currentStep.dpGrid) return <DPViz step={currentStep} />;
        if (currentStep.stackItems) return <StackViz step={currentStep} />;
        if (currentStep.queueItems) return <QueueViz step={currentStep} />;
        if (currentStep.listItems) return <ListViz step={currentStep} />;
        return null;
    }

    const catAlgos = getAlgorithmsByCategory(category);
    const codeLines = code.split('\n');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 12, gap: 10 }}>
            {/* Top controls */}
            <div style={{ ...glass, padding: '10px 16px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <select value={category} onChange={(e) => { setCategory(e.target.value); const first = getAlgorithmsByCategory(e.target.value)[0]; if (first) setAlgoId(first.id); }}
                    style={{ padding: '7px 12px', background: '#1C2128', border: '1px solid #30363D', borderRadius: 8, color: '#E6EDF3', fontFamily: 'DM Sans', fontSize: 13, cursor: 'pointer' }}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                </select>
                <select value={algoId} onChange={(e) => setAlgoId(e.target.value)}
                    style={{ padding: '7px 12px', background: '#1C2128', border: '1px solid #30363D', borderRadius: 8, color: '#E6EDF3', fontFamily: 'DM Sans', fontSize: 13, minWidth: 190, cursor: 'pointer' }}>
                    {catAlgos.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                {/* Language tabs */}
                <div style={{ display: 'flex', gap: 4 }}>
                    {LANGS.map((l) => (
                        <button key={l} onClick={() => setLang(l)} style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${lang === l ? '#00F5FF' : '#30363D'}`, background: lang === l ? '#00F5FF22' : 'transparent', color: lang === l ? '#00F5FF' : '#666', fontFamily: 'JetBrains Mono', fontSize: 12, cursor: 'pointer' }}>
                            {l === 'javascript' ? 'JS' : l === 'python' ? 'PY' : l === 'java' ? 'JAVA' : 'C++'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Split pane */}
            <div style={{ flex: 1, display: 'flex', gap: 10, overflow: 'hidden' }}>
                {/* Code editor — 60% */}
                <div style={{ flex: '0 0 60%', ...glass, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Editor toolbar */}
                    <div style={{ padding: '8px 14px', borderBottom: '1px solid #21262D', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF6B6B' }} />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFB347' }} />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#50FA7B' }} />
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#444', marginLeft: 8 }}>{algoId}.{lang === 'javascript' ? 'js' : lang === 'python' ? 'py' : lang === 'java' ? 'java' : 'cpp'}</span>
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                            <button onClick={handleCopy} title="Copy code" style={{ padding: '4px 10px', background: 'transparent', border: '1px solid #30363D', borderRadius: 6, color: copied ? '#50FA7B' : '#666', fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer' }}>
                                {copied ? '✓ Copied' : '⎘ Copy'}
                            </button>
                            <button onClick={handleReset} title="Reset to default" style={{ padding: '4px 10px', background: 'transparent', border: '1px solid #30363D', borderRadius: 6, color: '#666', fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer' }}>
                                ↺ Reset
                            </button>
                        </div>
                    </div>

                    {/* Code area with line numbers */}
                    <div style={{ flex: 1, overflow: 'auto', display: 'flex' }}>
                        {/* Line numbers */}
                        <div style={{ flexShrink: 0, padding: '12px 8px 12px 12px', background: '#0D1117', userSelect: 'none' }}>
                            {codeLines.map((_, i) => {
                                const lineNum = i + 1;
                                const isHighlighted = highlightLines.includes(lineNum);
                                return (
                                    <div key={i} style={{ fontFamily: 'JetBrains Mono', fontSize: 13, lineHeight: '1.6', color: isHighlighted ? '#00F5FF' : '#3D4450', minWidth: 28, textAlign: 'right' }}>
                                        {lineNum}
                                    </div>
                                );
                            })}
                        </div>
                        {/* Highlighted readonly view */}
                        <div style={{ flex: 1, padding: '12px 0 12px 12px', overflowX: 'auto', position: 'relative' }}>
                            {codeLines.map((line, i) => {
                                const lineNum = i + 1;
                                const isHighlighted = highlightLines.includes(lineNum);
                                return (
                                    <div key={i} ref={(el) => { lineRefs.current[lineNum] = el; }}
                                        style={{ display: 'flex', alignItems: 'stretch', lineHeight: '1.6', background: isHighlighted ? 'rgba(0,245,255,0.08)' : 'transparent', borderLeft: isHighlighted ? '3px solid #00F5FF' : '3px solid transparent', paddingLeft: isHighlighted ? 6 : 6, transition: 'background 0.3s, border 0.3s' }}>
                                        <code style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: '#E6EDF3', whiteSpace: 'pre', flex: 1 }}>
                                            <SyntaxHighlight code={line || ' '} />
                                        </code>
                                    </div>
                                );
                            })}
                            {/* Editable textarea overlay */}
                            <textarea value={code} onChange={(e) => setCode(e.target.value)}
                                style={{ position: 'absolute', top: 12, left: 9, width: 'calc(100% - 12px)', height: 'calc(100% - 24px)', opacity: 0, resize: 'none', fontFamily: 'JetBrains Mono', fontSize: 13, lineHeight: '1.6', background: 'transparent', border: 'none', color: 'transparent', outline: 'none', cursor: 'text', caretColor: '#00F5FF', zIndex: 10 }}
                                spellCheck={false}
                            />
                        </div>
                    </div>

                    {/* Run button */}
                    <div style={{ padding: '10px 14px', borderTop: '1px solid #21262D', display: 'flex', gap: 8 }}>
                        <button onClick={() => { if (algo) { const s = algo.generateSteps([38, 27, 43, 3, 9, 82, 10]); setSteps(s); setStepIdx(0); setPlaying(true); } }}
                            style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #00F5FF, #0080FF)', border: 'none', borderRadius: 8, color: '#0D1117', fontFamily: 'Syne', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                            ▶ Run & Visualize
                        </button>
                        <button onClick={() => setPlaying(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #30363D', borderRadius: 8, color: '#666', fontFamily: 'Syne', fontSize: 13, cursor: 'pointer' }}>
                            ⏸ Pause
                        </button>
                    </div>
                </div>

                {/* Live viz — 40% */}
                <div style={{ flex: '0 0 calc(40% - 10px)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{
                        ...glass, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative',
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '24px 24px'
                    }}>
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)', pointerEvents: 'none' }} />
                        <div style={{ width: '100%', height: '100%', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
                            {renderViz()}
                        </div>
                    </div>
                    <div style={{ ...glass, padding: '12px 16px' }}>
                        <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#E6EDF3', lineHeight: 1.6, marginBottom: 8 }}>
                            {currentStep?.description ?? 'Press Run to start'}
                        </div>
                        <div style={{ height: 3, background: '#0D1117', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${steps.length > 1 ? (stepIdx / (steps.length - 1)) * 100 : 0}%`, background: 'linear-gradient(90deg, #00F5FF, #FFB347)', transition: 'width 0.3s' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div style={{ ...glass, padding: '10px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontFamily: 'Syne', fontSize: 11, color: '#444', letterSpacing: 1 }}>LEGEND:</span>
                    {[['visiting', '00F5FF'], ['visited', 'FFB347'], ['swapped', 'FF79C6'], ['sorted', '50FA7B'], ['default', '30363D']].map(([s, c]) => (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <div style={{ width: 10, height: 10, borderRadius: 2, background: `#${c}` }} />
                            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#666' }}>{s}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
