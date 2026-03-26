'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ALGORITHMS, CATEGORY_LABELS, getAlgorithmsByCategory } from './registry';
import type { Algorithm, AlgoStep } from './types';
import { ArrayViz, TreeViz, GraphViz, HashViz, DPViz, StackViz, QueueViz, ListViz, StateLegend } from './VizCanvas';
import { Play, Pause, RotateCcw, Copy, Check } from 'lucide-react';


const CATEGORIES = ['sorting', 'searching', 'trees', 'graphs', 'hash', 'linear', 'dp'];
const LANGS = ['javascript', 'python', 'java', 'cpp'] as const;
type Lang = typeof LANGS[number];

const glass: React.CSSProperties = { background: 'var(--bg-glass)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid var(--border-glass)', borderRadius: 12 };

function SyntaxHighlight({ code }: { code: string }) {
    const keywords = ['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'new', 'class', 'import', 'export', 'default', 'break', 'continue', 'def', 'int', 'void', 'bool', 'true', 'false', 'null', 'undefined', 'this', 'super', 'static'];
    const regex = /(\/\/.*$|#.*$)|(["'`].*?["'`])|\b(\d+)\b|\b([a-zA-Z_]\w*)\b/gm;
    let html = '';
    let lastIndex = 0;

    code.replace(regex, (match, comment, str, num, word, offset) => {
        html += code.slice(lastIndex, offset).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        if (comment) {
            html += `<span style="color:#3D4450;font-style:italic">${match.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`;
        } else if (str) {
            html += `<span style="color:#A5D6A7">${match.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`;
        } else if (num) {
            html += `<span style="color:var(--color-warning)">${match}</span>`;
        } else if (word) {
            if (keywords.includes(word)) {
                html += `<span style="color:var(--accent-primary)">${word}</span>`;
            } else {
                html += word;
            }
        }
        lastIndex = offset + match.length;
        return match;
    });

    html += code.slice(lastIndex).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return <span dangerouslySetInnerHTML={{ __html: html || '&nbsp;' }} style={{ display: 'block', lineHeight: '1.6', minHeight: '1.6em', paddingRight: 8 }} />;
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
                <select value={category} onChange={(e) => { setCategory(e.target.value); const first = getAlgorithmsByCategory(e.target.value).at(0); if (first) setAlgoId(first.id); }}
                    style={{ padding: '7px 12px', background: 'var(--bg-panel)', border: '1px solid var(--border-main)', borderRadius: 8, color: 'var(--text-primary)', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 13, cursor: 'pointer' }}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                </select>
                <select value={algoId} onChange={(e) => setAlgoId(e.target.value)}
                    style={{ padding: '7px 12px', background: 'var(--bg-panel)', border: '1px solid var(--border-main)', borderRadius: 8, color: 'var(--text-primary)', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 13, minWidth: 190, cursor: 'pointer' }}>
                    {catAlgos.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                {/* Language tabs */}
                <div style={{ display: 'flex', gap: 4 }}>
                    {LANGS.map((l) => (
                        <button key={l} onClick={() => setLang(l)} style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${lang === l ? 'var(--accent-primary)' : 'var(--border-main)'}`, background: lang === l ? 'var(--accent-primary-bg)' : 'transparent', color: lang === l ? 'var(--accent-primary)' : 'var(--text-secondary)', fontFamily: 'JetBrains Mono', fontSize: 12, cursor: 'pointer' }}>
                            {l === 'javascript' ? 'JS' : l === 'python' ? 'PY' : l === 'java' ? 'JAVA' : 'C++'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Split pane */}
            <div className="flex-col-mobile mobile-scroll-container" style={{ flex: 1, display: 'flex', gap: 10, overflow: 'hidden' }}>
                {/* Code editor — 60% */}
                <div className="w-full-mobile h-auto-mobile" style={{ flex: '0 0 60%', ...glass, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '400px' }}>
                    {/* Editor toolbar */}
                    <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--bg-panel-hover)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--color-danger)' }} />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--color-warning)' }} />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--color-success)' }} />
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>{algoId}.{lang === 'javascript' ? 'js' : lang === 'python' ? 'py' : lang === 'java' ? 'java' : 'cpp'}</span>
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                            <button onClick={handleCopy} title="Copy code" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'transparent', border: '1px solid var(--border-main)', borderRadius: 6, color: copied ? 'var(--color-success)' : 'var(--text-secondary)', fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer' }}>
                                {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                            </button>
                            <button onClick={handleReset} title="Reset to default" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'transparent', border: '1px solid var(--border-main)', borderRadius: 6, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono', fontSize: 11, cursor: 'pointer' }}>
                                <RotateCcw size={12} /> Reset
                            </button>
                        </div>
                    </div>

                    {/* Code area with line numbers */}
                    <div style={{ flex: 1, overflow: 'auto', display: 'flex' }}>
                        {/* Line numbers */}
                        <div style={{ flexShrink: 0, padding: '12px 8px 12px 12px', background: 'var(--bg-main)', userSelect: 'none' }}>
                            {codeLines.map((_, i) => {
                                const lineNum = i + 1;
                                const isHighlighted = highlightLines.includes(lineNum);
                                return (
                                    <div key={i} style={{ fontFamily: 'JetBrains Mono', fontSize: 13, lineHeight: '1.6', color: isHighlighted ? 'var(--accent-primary)' : 'var(--text-muted)', minWidth: 28, textAlign: 'right' }}>
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
                                        style={{ display: 'flex', alignItems: 'stretch', lineHeight: '1.6', background: isHighlighted ? 'var(--accent-primary-bg)' : 'transparent', borderLeft: isHighlighted ? '3px solid var(--accent-primary)' : '3px solid transparent', paddingLeft: isHighlighted ? 6 : 6, transition: 'background 0.3s, border 0.3s' }}>
                                        <code style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'pre', flex: 1 }}>
                                            <SyntaxHighlight code={line || ' '} />
                                        </code>
                                    </div>
                                );
                            })}
                            {/* Editable textarea overlay */}
                            <textarea value={code} onChange={(e) => setCode(e.target.value)}
                                style={{ position: 'absolute', top: 12, left: 21, width: 'calc(100% - 21px)', height: 'calc(100% - 24px)', background: 'transparent', border: 'none', color: 'transparent', outline: 'none', cursor: 'text', caretColor: 'var(--accent-primary)', zIndex: 10, fontFamily: 'JetBrains Mono', fontSize: 13, lineHeight: '1.6', resize: 'none', whiteSpace: 'pre', overflow: 'hidden' }}
                                spellCheck={false}
                            />
                        </div>
                    </div>

                    {/* Run button */}
                    <div style={{ padding: '10px 14px', borderTop: '1px solid var(--bg-panel-hover)', display: 'flex', gap: 8 }}>
                        <button onClick={() => { if (algo) { const s = algo.generateSteps([38, 27, 43, 3, 9, 82, 10]); setSteps(s); setStepIdx(0); setPlaying(true); } }}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-alt))', border: 'none', borderRadius: 8, color: 'var(--bg-main)', fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                            <Play size={16} /> Run & Visualize
                        </button>
                        <button onClick={() => setPlaying(false)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'transparent', border: '1px solid var(--border-main)', borderRadius: 8, color: 'var(--text-secondary)', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 13, cursor: 'pointer' }}>
                            <Pause size={16} /> Pause
                        </button>
                    </div>
                </div>

                {/* Live viz — 40% */}
                <div className="w-full-mobile h-auto-mobile" style={{ flex: '0 0 calc(40% - 10px)', display: 'flex', flexDirection: 'column', gap: 8, minHeight: '300px' }}>
                    <div style={{
                        ...glass, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative',
                        backgroundImage: 'radial-gradient(circle, var(--grid-dot) 1px, transparent 1px)', backgroundSize: '24px 24px'
                    }}>
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--grid-line) 2px, var(--grid-line) 4px)', pointerEvents: 'none' }} />
                        <div style={{ width: '100%', height: '100%', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
                            {renderViz()}
                        </div>
                    </div>
                    <div style={{ ...glass, padding: '12px 16px' }}>
                        <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: 8 }}>
                            {currentStep?.description ?? 'Press Run to start'}
                        </div>
                        <div style={{ height: 3, background: 'var(--bg-main)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${steps.length > 1 ? (stepIdx / (steps.length - 1)) * 100 : 0}%`, background: 'linear-gradient(90deg, var(--accent-primary), var(--color-warning))', transition: 'width 0.3s' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div style={{ ...glass, padding: '10px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>LEGEND:</span>
                    {[['visiting', '00F5FF'], ['visited', 'FFB347'], ['swapped', 'FF79C6'], ['sorted', '50FA7B'], ['default', '30363D']].map(([s, c]) => (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <div style={{ width: 10, height: 10, borderRadius: 2, background: `#${c}` }} />
                            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-secondary)' }}>{s}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
