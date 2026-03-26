'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ALGORITHMS, CATEGORY_LABELS, generateInput, getAlgorithmsByCategory } from './registry';
import type { Algorithm, AlgoStep, NodeState } from './types';
import { ArrayViz, TreeViz, GraphViz, HashViz, DPViz, StackViz, QueueViz, ListViz, StateLegend } from './VizCanvas';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Zap, Download, Dices, Clock, HardDrive, Check, X } from 'lucide-react';


const SPEED_MS: Record<string, number> = { Slow: 1200, Normal: 600, Fast: 200, Ludicrous: 60 };
const SPEEDS = ['Slow', 'Normal', 'Fast', 'Ludicrous'];
const CATEGORIES = ['sorting', 'searching', 'trees', 'graphs', 'hash', 'linear', 'dp'];

const glass: React.CSSProperties = { background: 'var(--bg-glass)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid var(--border-glass)', borderRadius: 12 };

interface Props {
    onAlgoChange?: (algo: Algorithm, step: AlgoStep | null, stepIndex: number) => void;
}

export default function Visualizer({ onAlgoChange }: Props) {
    const [category, setCategory] = useState('sorting');
    const [algoId, setAlgoId] = useState('bubble-sort');
    const [steps, setSteps] = useState<AlgoStep[]>([]);
    const [stepIdx, setStepIdx] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState('Normal');
    const [customInput, setCustomInput] = useState('38,27,43,3,9,82,10');
    const [inputArr, setInputArr] = useState([38, 27, 43, 3, 9, 82, 10]);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const stepsRef = useRef(steps);
    const idxRef = useRef(stepIdx);

    stepsRef.current = steps;
    idxRef.current = stepIdx;

    const algo = ALGORITHMS.find((a) => a.id === algoId);

    const genSteps = useCallback((alg: Algorithm, arr: number[]) => {
        try {
            return alg.generateSteps(arr);
        } catch {
            return [];
        }
    }, []);

    useEffect(() => {
        if (!algo) return;
        const s = genSteps(algo, inputArr);
        setSteps(s);
        setStepIdx(0);
        setPlaying(false);
    }, [algoId, inputArr, algo, genSteps]);

    useEffect(() => {
        if (playing) {
            intervalRef.current = setInterval(() => {
                setStepIdx((i) => {
                    if (i >= stepsRef.current.length - 1) {
                        setPlaying(false);
                        return i;
                    }
                    return i + 1;
                });
            }, SPEED_MS[speed]);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [playing, speed]);

    useEffect(() => {
        if (onAlgoChange && algo) onAlgoChange(algo, steps[stepIdx] ?? null, stepIdx);
    }, [stepIdx, algoId, steps, algo, onAlgoChange]);

    const currentStep = steps[stepIdx] ?? null;

    function handleReset() {
        setPlaying(false);
        setStepIdx(0);
    }

    function handleRandomize() {
        const noArrayInput = ['graphs', 'trees', 'hash', 'dp'];
        if (noArrayInput.includes(category)) {
            // These algorithms use fixed internal data — just re-run steps
            if (algo) { const s = genSteps(algo, inputArr); setSteps(s); setStepIdx(0); setPlaying(false); }
            return;
        }
        const arr = Array.from({ length: 12 }, () => Math.floor(Math.random() * 95) + 5);
        setInputArr(arr);
        setCustomInput(arr.join(','));
    }

    function handleCustomInput() {
        const arr = customInput.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n) && n > 0).slice(0, 20);
        if (arr.length > 0) {
            setInputArr(arr);
            setCustomInput(arr.join(','));
        }
    }

    function exportSVG() {
        const svg = document.querySelector('#viz-canvas svg');
        if (!svg) return;
        const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `${algoId}.svg`; a.click();
        URL.revokeObjectURL(url);
    }

    function renderViz() {
        if (!currentStep) return null;
        if (currentStep.bars) return <ArrayViz step={currentStep} />;
        if (currentStep.treeNodes) return <TreeViz step={currentStep} />;
        if (currentStep.graphNodes) return <GraphViz step={currentStep} directed={['topo-sort', 'bellman-ford'].includes(algoId)} />;
        if (currentStep.hashBuckets) return <HashViz step={currentStep} />;
        if (currentStep.dpGrid) return <DPViz step={currentStep} />;
        if (currentStep.stackItems) return <StackViz step={currentStep} />;
        if (currentStep.queueItems) return <QueueViz step={currentStep} />;
        if (currentStep.listItems) {
            const label = algoId === 'array-ops' ? 'ARRAY' : algoId === 'doubly-linked-list' ? 'DOUBLY LINKED LIST' : algoId.includes('linked') ? 'LINKED LIST' : 'LIST';
            return <ListViz step={currentStep} label={label} />;
        }
        return null;
    }

    function getStates(): NodeState[] {
        if (!currentStep) return ['default', 'visiting', 'visited'];
        if (currentStep.bars) {
            const states = new Set<NodeState>(currentStep.bars.map((b) => b.state));
            return Array.from(states);
        }
        return ['default', 'visiting', 'visited', 'sorted', 'swapped', 'found', 'mst'];
    }

    const catAlgos = getAlgorithmsByCategory(category);
    const needsInput = !['graphs', 'trees', 'hash', 'dp'].includes(category);

    function btnStyle(active: boolean, color = 'var(--accent-primary)'): React.CSSProperties {
        return { padding: '8px 16px', borderRadius: 8, border: `1px solid ${active ? color : 'var(--border-main)'}`, background: active ? `${color}22` : 'transparent', color: active ? color : 'var(--text-primary)', fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s' };
    }

    function iconBtn(icon: React.ReactNode, label: string, onClick: () => void, active = false, disabled = false): React.ReactElement {
        return (
            <button title={label} onClick={onClick} disabled={disabled}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border-main)', background: active ? 'var(--accent-primary-bg)' : 'var(--bg-panel)', color: disabled ? 'var(--text-muted)' : 'var(--text-primary)', fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700, fontSize: 16, cursor: disabled ? 'not-allowed' : 'pointer', minWidth: 44, transition: 'all 0.15s' }}>
                {icon}
            </button>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>
            {/* Top bar */}
            <div style={{ ...glass, margin: '12px 12px 0', padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <select value={category} onChange={(e) => { setCategory(e.target.value); const first = getAlgorithmsByCategory(e.target.value).at(0); if (first) setAlgoId(first.id); }}
                    style={{ padding: '8px 12px', background: 'var(--bg-panel)', border: '1px solid var(--border-main)', borderRadius: 8, color: 'var(--text-primary)', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 14, cursor: 'pointer' }}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                </select>

                <select value={algoId} onChange={(e) => setAlgoId(e.target.value)}
                    style={{ padding: '8px 12px', background: 'var(--bg-panel)', border: '1px solid var(--border-main)', borderRadius: 8, color: 'var(--text-primary)', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 14, cursor: 'pointer', minWidth: 200 }}>
                    {catAlgos.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>

                {algo && (
                    <div style={{ display: 'flex', gap: 6 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'var(--accent-primary-bg)', border: '1px solid var(--accent-primary)66', borderRadius: 6, fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--accent-primary)' }} title="Time Complexity">
                            <Clock size={12} /> {algo.timeComplexity.avg}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning)66', borderRadius: 6, fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--color-warning)' }} title="Space Complexity">
                            <HardDrive size={12} /> {algo.spaceComplexity}
                        </span>
                        {algo.stable !== undefined && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: algo.stable ? 'var(--color-success-bg)' : 'var(--color-danger-bg)', border: `1px solid ${algo.stable ? 'var(--color-success-border)' : 'var(--color-danger-border)'}`, borderRadius: 6, fontFamily: 'JetBrains Mono', fontSize: 11, color: algo.stable ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                {algo.stable ? <Check size={12} /> : <X size={12} />}  {algo.stable ? 'stable' : 'unstable'}
                            </span>
                        )}
                    </div>
                )}

                <button title="Export SVG" onClick={exportSVG} style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto', padding: '8px 14px', background: 'transparent', border: '1px solid var(--border-main)', borderRadius: 8, color: 'var(--text-secondary)', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 13, cursor: 'pointer' }}>
                    <Download size={14} /> SVG
                </button>
            </div>

            {/* Main area */}
            <div className="flex-col-mobile mobile-scroll-container" style={{ flex: 1, display: 'flex', gap: 0, overflow: 'hidden', padding: '12px' }}>
                {/* Canvas */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0, minHeight: 400 }}>
                    <div id="viz-canvas" style={{
                        ...glass, flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundImage: 'radial-gradient(circle, var(--grid-dot) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}>
                        {/* Scanline overlay */}
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--grid-line) 2px, var(--grid-line) 4px)', pointerEvents: 'none', zIndex: 1 }} />
                        <div style={{ width: '100%', height: '100%', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 8px' }}>
                            {renderViz()}
                        </div>
                    </div>
                    <StateLegend states={getStates()} />
                </div>

                {/* Step panel */}
                <div className="w-full-mobile h-auto-mobile" style={{ ...glass, width: 260, marginLeft: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--bg-panel-hover)', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: 1 }}>
                        STEP {stepIdx + 1} / {steps.length}
                    </div>
                    <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
                        <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7, minHeight: 60 }}>
                            {currentStep?.description ?? 'Press Play to start the visualization.'}
                        </div>
                        {algo?.description && (
                            <div style={{ marginTop: 20, padding: '12px 14px', background: 'var(--bg-main)', borderRadius: 8, border: '1px solid var(--bg-panel-hover)', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                {algo.description}
                            </div>
                        )}
                    </div>
                    <div style={{ padding: '12px 16px', borderTop: '1px solid var(--bg-panel-hover)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ height: 4, background: 'var(--bg-main)', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${steps.length ? (stepIdx / (steps.length - 1)) * 100 : 0}%`, background: 'linear-gradient(90deg, var(--accent-primary), var(--color-warning))', transition: 'width 0.3s ease' }} />
                        </div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>
                            {Math.round(steps.length ? (stepIdx / (steps.length - 1)) * 100 : 0)}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div style={{ ...glass, margin: '0 12px 12px', padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', flexShrink: 0 }}>
                {iconBtn(<SkipBack size={18} />, 'Step Back (←)', () => setStepIdx((i) => Math.max(0, i - 1)), false, stepIdx === 0)}
                {playing ? iconBtn(<Pause size={18} />, 'Pause (Space)', () => setPlaying(false), true) : iconBtn(<Play size={18} />, 'Play (Space)', () => setPlaying(true), false, stepIdx >= steps.length - 1)}
                {iconBtn(<SkipForward size={18} />, 'Step Forward (→)', () => setStepIdx((i) => Math.min(steps.length - 1, i + 1)), false, stepIdx >= steps.length - 1)}
                {iconBtn(<RotateCcw size={18} />, 'Reset (R)', handleReset)}

                <div style={{ width: 1, height: 28, background: 'var(--border-main)', margin: '0 4px' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 12, color: 'var(--text-secondary)' }}>SPEED:</span>
                    {SPEEDS.map((s) => (
                        <button key={s} onClick={() => setSpeed(s)} title={s} style={{ ...btnStyle(speed === s), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {s === 'Ludicrous' ? <Zap size={14} /> : s}
                        </button>
                    ))}
                </div>

                <div style={{ width: 1, height: 28, background: 'var(--border-main)', margin: '0 4px' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 240 }}>
                    <input value={customInput} onChange={(e) => {
                            const val = e.target.value;
                            if (val.split(',').length <= 20) setCustomInput(val);
                            else setCustomInput(val.split(',').slice(0, 20).join(','));
                        }} onKeyDown={(e) => { if (e.key === 'Enter') handleCustomInput(); }}
                        placeholder="comma-separated values..." disabled={!needsInput}
                        style={{ flex: 1, padding: '8px 12px', background: 'var(--bg-panel)', border: '1px solid var(--border-main)', borderRadius: 8, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono', fontSize: 12, outline: 'none', opacity: needsInput ? 1 : 0.5, cursor: needsInput ? 'text' : 'not-allowed' }}
                    />
                    <button title="Apply" onClick={handleCustomInput} disabled={!needsInput} style={{ padding: '8px 14px', background: 'var(--accent-primary-bg)', border: '1px solid var(--accent-primary)66', borderRadius: 8, color: 'var(--accent-primary)', fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700, fontSize: 13, cursor: needsInput ? 'pointer' : 'not-allowed', opacity: needsInput ? 1 : 0.5 }}>
                        Apply
                    </button>
                    <button title="Randomize data" onClick={handleRandomize} disabled={!needsInput} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning)66', borderRadius: 8, color: 'var(--color-warning)', fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700, fontSize: 13, cursor: needsInput ? 'pointer' : 'not-allowed', opacity: needsInput ? 1 : 0.5 }}>
                        <Dices size={16} /> Rand
                    </button>
                </div>
            </div>
        </div>
    );
}
