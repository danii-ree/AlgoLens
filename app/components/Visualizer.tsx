'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ALGORITHMS, CATEGORY_LABELS, generateInput, getAlgorithmsByCategory } from './registry';
import type { Algorithm, AlgoStep, NodeState } from './types';
import { ArrayViz, TreeViz, GraphViz, HashViz, DPViz, StackViz, QueueViz, ListViz, StateLegend } from './VizCanvas';

const SPEED_MS: Record<string, number> = { Slow: 1200, Normal: 600, Fast: 200, Ludicrous: 60 };
const SPEEDS = ['Slow', 'Normal', 'Fast', 'Ludicrous'];
const CATEGORIES = ['sorting', 'searching', 'trees', 'graphs', 'hash', 'linear', 'dp'];

const glass: React.CSSProperties = { background: 'rgba(22,27,34,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(48,54,61,0.8)', borderRadius: 12 };

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
        if (arr.length > 0) setInputArr(arr);
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

    function btnStyle(active: boolean, color = '#00F5FF'): React.CSSProperties {
        return { padding: '8px 16px', borderRadius: 8, border: `1px solid ${active ? color : '#30363D'}`, background: active ? `${color}22` : 'transparent', color: active ? color : '#E6EDF3', fontFamily: 'Syne', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s' };
    }

    function iconBtn(icon: string, label: string, onClick: () => void, active = false, disabled = false): React.ReactElement {
        return (
            <button title={label} onClick={onClick} disabled={disabled}
                style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #30363D', background: active ? '#00F5FF22' : '#1C2128', color: disabled ? '#3D4450' : '#E6EDF3', fontFamily: 'Syne', fontWeight: 700, fontSize: 16, cursor: disabled ? 'not-allowed' : 'pointer', minWidth: 44, transition: 'all 0.15s' }}>
                {icon}
            </button>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>
            {/* Top bar */}
            <div style={{ ...glass, margin: '12px 12px 0', padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <select value={category} onChange={(e) => { setCategory(e.target.value); const first = getAlgorithmsByCategory(e.target.value)[0]; if (first) setAlgoId(first.id); }}
                    style={{ padding: '8px 12px', background: '#1C2128', border: '1px solid #30363D', borderRadius: 8, color: '#E6EDF3', fontFamily: 'DM Sans', fontSize: 14, cursor: 'pointer' }}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                </select>

                <select value={algoId} onChange={(e) => setAlgoId(e.target.value)}
                    style={{ padding: '8px 12px', background: '#1C2128', border: '1px solid #30363D', borderRadius: 8, color: '#E6EDF3', fontFamily: 'DM Sans', fontSize: 14, cursor: 'pointer', minWidth: 200 }}>
                    {catAlgos.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>

                {algo && (
                    <div style={{ display: 'flex', gap: 6 }}>
                        <span style={{ padding: '4px 10px', background: '#00F5FF22', border: '1px solid #00F5FF66', borderRadius: 6, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#00F5FF' }} title="Time Complexity">
                            ⏱ {algo.timeComplexity.avg}
                        </span>
                        <span style={{ padding: '4px 10px', background: '#FFB34722', border: '1px solid #FFB34766', borderRadius: 6, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#FFB347' }} title="Space Complexity">
                            💾 {algo.spaceComplexity}
                        </span>
                        {algo.stable !== undefined && (
                            <span style={{ padding: '4px 10px', background: algo.stable ? '#50FA7B22' : '#FF6B6B22', border: `1px solid ${algo.stable ? '#50FA7B66' : '#FF6B6B66'}`, borderRadius: 6, fontFamily: 'JetBrains Mono', fontSize: 11, color: algo.stable ? '#50FA7B' : '#FF6B6B' }}>
                                {algo.stable ? '✓ stable' : '✗ unstable'}
                            </span>
                        )}
                    </div>
                )}

                <button title="Export SVG" onClick={exportSVG} style={{ marginLeft: 'auto', padding: '8px 14px', background: 'transparent', border: '1px solid #30363D', borderRadius: 8, color: '#8B949E', fontFamily: 'Syne', fontSize: 13, cursor: 'pointer' }}>
                    ⬇ SVG
                </button>
            </div>

            {/* Main area */}
            <div style={{ flex: 1, display: 'flex', gap: 0, overflow: 'hidden', padding: '12px' }}>
                {/* Canvas */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
                    <div id="viz-canvas" style={{
                        ...glass, flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}>
                        {/* Scanline overlay */}
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)', pointerEvents: 'none', zIndex: 1 }} />
                        <div style={{ width: '100%', height: '100%', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 8px' }}>
                            {renderViz()}
                        </div>
                    </div>
                    <StateLegend states={getStates()} />
                </div>

                {/* Step panel */}
                <div style={{ ...glass, width: 260, marginLeft: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #21262D', fontFamily: 'Syne', fontSize: 13, fontWeight: 700, color: '#666', letterSpacing: 1 }}>
                        STEP {stepIdx + 1} / {steps.length}
                    </div>
                    <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
                        <div style={{ fontFamily: 'DM Sans', fontSize: 14, color: '#E6EDF3', lineHeight: 1.7, minHeight: 60 }}>
                            {currentStep?.description ?? 'Press Play to start the visualization.'}
                        </div>
                        {algo?.description && (
                            <div style={{ marginTop: 20, padding: '12px 14px', background: '#0D1117', borderRadius: 8, border: '1px solid #21262D', fontFamily: 'DM Sans', fontSize: 12, color: '#8B949E', lineHeight: 1.6 }}>
                                {algo.description}
                            </div>
                        )}
                    </div>
                    <div style={{ padding: '12px 16px', borderTop: '1px solid #21262D', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ height: 4, background: '#0D1117', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${steps.length ? (stepIdx / (steps.length - 1)) * 100 : 0}%`, background: 'linear-gradient(90deg, #00F5FF, #FFB347)', transition: 'width 0.3s ease' }} />
                        </div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#3D4450', textAlign: 'right' }}>
                            {Math.round(steps.length ? (stepIdx / (steps.length - 1)) * 100 : 0)}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div style={{ ...glass, margin: '0 12px 12px', padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                {iconBtn('⏮', 'Step Back (←)', () => setStepIdx((i) => Math.max(0, i - 1)), false, stepIdx === 0)}
                {playing ? iconBtn('⏸', 'Pause (Space)', () => setPlaying(false), true) : iconBtn('▶', 'Play (Space)', () => setPlaying(true), false, stepIdx >= steps.length - 1)}
                {iconBtn('⏭', 'Step Forward (→)', () => setStepIdx((i) => Math.min(steps.length - 1, i + 1)), false, stepIdx >= steps.length - 1)}
                {iconBtn('↺', 'Reset (R)', handleReset)}

                <div style={{ width: 1, height: 28, background: '#30363D', margin: '0 4px' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'Syne', fontSize: 12, color: '#666' }}>SPEED:</span>
                    {SPEEDS.map((s) => (
                        <button key={s} onClick={() => setSpeed(s)} title={s} style={btnStyle(speed === s)}>
                            {s === 'Ludicrous' ? '⚡' : s}
                        </button>
                    ))}
                </div>

                <div style={{ width: 1, height: 28, background: '#30363D', margin: '0 4px' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 240 }}>
                    <input value={customInput} onChange={(e) => setCustomInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleCustomInput(); }}
                        placeholder="comma-separated values..."
                        style={{ flex: 1, padding: '8px 12px', background: '#1C2128', border: '1px solid #30363D', borderRadius: 8, color: '#E6EDF3', fontFamily: 'JetBrains Mono', fontSize: 12, outline: 'none' }}
                    />
                    <button title="Apply" onClick={handleCustomInput} style={{ padding: '8px 14px', background: '#00F5FF22', border: '1px solid #00F5FF66', borderRadius: 8, color: '#00F5FF', fontFamily: 'Syne', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                        Apply
                    </button>
                    <button title="Randomize data" onClick={handleRandomize} style={{ padding: '8px 14px', background: '#FFB34722', border: '1px solid #FFB34766', borderRadius: 8, color: '#FFB347', fontFamily: 'Syne', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                        🎲 Rand
                    </button>
                </div>
            </div>
        </div>
    );
}
