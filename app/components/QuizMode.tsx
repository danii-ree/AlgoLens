'use client';
import React, { useState, useRef, useEffect } from 'react';
import { QUIZ_QUESTIONS, getQuestionsForTopic } from './quizData';
import type { QuizQuestion } from './types';
import { ALGORITHMS } from './registry';

const TOPICS = [
    { id: 'all', label: 'All Topics' },
    { id: 'bubble-sort', label: 'Bubble Sort' },
    { id: 'merge-sort', label: 'Merge Sort' },
    { id: 'quick-sort', label: 'Quick Sort' },
    { id: 'binary-search', label: 'Binary Search' },
    { id: 'bst', label: 'BST' },
    { id: 'bfs', label: 'BFS' },
    { id: 'dfs', label: 'DFS' },
    { id: 'dijkstra', label: 'Dijkstra' },
    { id: 'hash', label: 'Hash Table' },
    { id: 'stack', label: 'Stack' },
    { id: 'queue', label: 'Queue' },
    { id: 'fibonacci', label: 'Fibonacci DP' },
    { id: 'knapsack', label: 'Knapsack DP' },
];

const DIFFICULTIES = [
    { id: 'intro' as const, label: '🟢 Intro', color: '#50FA7B' },
    { id: 'standard' as const, label: '🟡 Standard', color: '#FFB347' },
    { id: 'challenge' as const, label: '🔴 Challenge', color: '#FF6B6B' },
];

interface QuizState {
    questions: QuizQuestion[];
    currentIndex: number;
    selected: number | null;
    showResult: boolean;
    score: number;
    startTime: number;
    finished: boolean;
}

const glass: React.CSSProperties = {
    background: 'rgba(22, 27, 34, 0.8)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(48, 54, 61, 0.8)',
    borderRadius: 12,
};

export default function QuizMode() {
    const [mode, setMode] = useState<'concept' | 'trace'>('concept');
    const [topic, setTopic] = useState('all');
    const [difficulty, setDifficulty] = useState<'intro' | 'standard' | 'challenge'>('intro');
    const [quiz, setQuiz] = useState<QuizState | null>(null);
    const [shake, setShake] = useState(false);
    const [wrongIndex, setWrongIndex] = useState<number | null>(null);

    function startQuiz() {
        const qs = getQuestionsForTopic(topic, difficulty);
        if (!qs.length) return;
        setQuiz({ questions: qs, currentIndex: 0, selected: null, showResult: false, score: 0, startTime: Date.now(), finished: false });
        setShake(false); setWrongIndex(null);
    }

    function selectAnswer(i: number) {
        if (!quiz || quiz.showResult) return;
        const correct = quiz.questions[quiz.currentIndex].correctIndex;
        const isCorrect = i === correct;
        if (!isCorrect) {
            setShake(true);
            setWrongIndex(i);
            setTimeout(() => setShake(false), 500);
        }
        setQuiz((q) => q ? { ...q, selected: i, showResult: true, score: isCorrect ? q.score + 1 : q.score } : q);
    }

    function nextQuestion() {
        if (!quiz) return;
        setWrongIndex(null);
        if (quiz.currentIndex + 1 >= quiz.questions.length) {
            setQuiz((q) => q ? { ...q, finished: true } : q);
        } else {
            setQuiz((q) => q ? { ...q, currentIndex: q.currentIndex + 1, selected: null, showResult: false } : q);
        }
    }

    if (quiz?.finished) {
        const elapsed = Math.round((Date.now() - quiz.startTime) / 1000);
        const pct = Math.round((quiz.score / quiz.questions.length) * 100);
        return (
            <div style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                <div style={{ ...glass, padding: '40px 48px', textAlign: 'center', maxWidth: 500, width: '100%' }}>
                    <div style={{ fontSize: 64 }}>{pct >= 80 ? '🎉' : pct >= 50 ? '📚' : '🔄'}</div>
                    <div style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, color: '#E6EDF3', margin: '12px 0 4px' }}>
                        Quiz Complete!
                    </div>
                    <div style={{ fontFamily: 'DM Sans', color: '#8B949E', marginBottom: 24 }}>
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} — {topic === 'all' ? 'All Topics' : topic}
                    </div>
                    <div style={{ fontSize: 48, fontFamily: 'Syne', fontWeight: 800, color: pct >= 80 ? '#50FA7B' : pct >= 50 ? '#FFB347' : '#FF6B6B', margin: '8px 0' }}>
                        {quiz.score}/{quiz.questions.length}
                    </div>
                    <div style={{ background: '#0D1117', borderRadius: 8, height: 12, margin: '12px 0', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: pct >= 80 ? '#50FA7B' : pct >= 50 ? '#FFB347' : '#FF6B6B', transition: 'width 1s ease', boxShadow: pct >= 80 ? '0 0 12px #50FA7B' : undefined }} />
                    </div>
                    <div style={{ fontFamily: 'DM Sans', color: '#8B949E', fontSize: 14 }}>
                        Time taken: {elapsed}s · Accuracy: {pct}%
                    </div>
                    {pct < 80 && (
                        <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(255,107,107,0.1)', border: '1px solid #FF6B6B44', borderRadius: 8, fontFamily: 'DM Sans', fontSize: 13, color: '#FF9E9E' }}>
                            💡 Review these topics in the Visualizer for practice.
                        </div>
                    )}
                    <button onClick={startQuiz} style={{ marginTop: 24, padding: '12px 28px', background: 'linear-gradient(135deg, #00F5FF, #0080FF)', border: 'none', borderRadius: 8, color: '#0D1117', fontFamily: 'Syne', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                        Try Again
                    </button>
                    <button onClick={() => setQuiz(null)} style={{ marginTop: 12, marginLeft: 12, padding: '12px 28px', background: 'transparent', border: '1px solid #30363D', borderRadius: 8, color: '#E6EDF3', fontFamily: 'Syne', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
                        New Quiz
                    </button>
                </div>
            </div>
        );
    }

    if (quiz && !quiz.finished) {
        const q = quiz.questions[quiz.currentIndex];
        const progress = ((quiz.currentIndex) / quiz.questions.length) * 100;
        return (
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720, margin: '0 auto' }}>
                {/* Progress */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1, background: '#0D1117', borderRadius: 8, height: 8, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #00F5FF, #FFB347)', transition: 'width 0.4s ease' }} />
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: '#8B949E', whiteSpace: 'nowrap' }}>
                        {quiz.currentIndex + 1} / {quiz.questions.length} · Score: {quiz.score}
                    </span>
                </div>

                {/* Question */}
                <div style={{ ...glass, padding: 28 }}>
                    <div style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 700, color: '#E6EDF3', lineHeight: 1.5, marginBottom: 24 }}>
                        {q.question}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {q.options.map((opt, i) => {
                            let bg = 'rgba(22,27,34,0.6)', border = '#30363D', color = '#E6EDF3', glow = 'none';
                            if (quiz.showResult) {
                                if (i === q.correctIndex) { bg = 'rgba(80,250,123,0.15)'; border = '#50FA7B'; color = '#50FA7B'; glow = '0 0 12px #50FA7B44'; }
                                else if (i === quiz.selected && i !== q.correctIndex) { bg = 'rgba(255,107,107,0.15)'; border = '#FF6B6B'; color = '#FF6B6B'; }
                            }
                            return (
                                <button key={i} onClick={() => selectAnswer(i)}
                                    style={{
                                        padding: '14px 20px', background: bg, border: `2px solid ${border}`, borderRadius: 10,
                                        color, textAlign: 'left', fontFamily: 'DM Sans', fontSize: 15, cursor: quiz.showResult ? 'default' : 'pointer',
                                        boxShadow: glow, transition: 'all 0.2s',
                                        animation: shake && i === wrongIndex ? 'shake 0.3s ease' : undefined,
                                    }}>
                                    <span style={{ fontFamily: 'JetBrains Mono', color: '#666', marginRight: 10 }}>{String.fromCharCode(65 + i)}.</span>
                                    {opt}
                                    {quiz.showResult && i === q.correctIndex && ' ✓'}
                                    {quiz.showResult && i === quiz.selected && i !== q.correctIndex && ' ✗'}
                                </button>
                            );
                        })}
                    </div>

                    {quiz.showResult && (
                        <div style={{ marginTop: 20, padding: '14px 18px', background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.3)', borderRadius: 8, fontFamily: 'DM Sans', fontSize: 14, color: '#C9D1D9', lineHeight: 1.6 }}>
                            💡 {q.explanation}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                    {quiz.showResult && (
                        <button onClick={nextQuestion} style={{ flex: 1, padding: '12px 24px', background: 'linear-gradient(135deg, #00F5FF, #0080FF)', border: 'none', borderRadius: 8, color: '#0D1117', fontFamily: 'Syne', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                            {quiz.currentIndex + 1 >= quiz.questions.length ? 'See Results →' : 'Next Question →'}
                        </button>
                    )}
                    <button onClick={() => setQuiz(null)} style={{ padding: '12px 20px', background: 'transparent', border: '1px solid #30363D', borderRadius: 8, color: '#8B949E', fontFamily: 'Syne', fontSize: 14, cursor: 'pointer' }}>
                        Quit
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 800, color: '#E6EDF3' }}>🧩 Quiz Mode</div>

            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 8 }}>
                {(['concept', 'trace'] as const).map((m) => (
                    <button key={m} onClick={() => setMode(m)} style={{
                        padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: mode === m ? 'linear-gradient(135deg, #00F5FF22, #00F5FF11)' : 'transparent',
                        color: mode === m ? '#00F5FF' : '#8B949E',
                        fontFamily: 'Syne', fontWeight: 700, fontSize: 14,
                        boxShadow: mode === m ? '0 0 0 1px #00F5FF55' : '0 0 0 1px #30363D',
                    }}>
                        {m === 'concept' ? '[A] Concept Quiz' : '[B] Trace Quiz'}
                    </button>
                ))}
            </div>

            <div style={{ ...glass, padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Difficulty */}
                <div>
                    <div style={{ fontFamily: 'Syne', fontSize: 12, color: '#666', marginBottom: 10, letterSpacing: 1 }}>DIFFICULTY</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {DIFFICULTIES.map((d) => (
                            <button key={d.id} onClick={() => setDifficulty(d.id)} style={{
                                padding: '8px 16px', borderRadius: 8, border: `2px solid ${difficulty === d.id ? d.color : '#30363D'}`,
                                background: difficulty === d.id ? `${d.color}22` : 'transparent', color: difficulty === d.id ? d.color : '#666',
                                fontFamily: 'Syne', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                                boxShadow: difficulty === d.id ? `0 0 10px ${d.color}44` : 'none', transition: 'all 0.2s',
                            }}>
                                {d.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Topic */}
                <div>
                    <div style={{ fontFamily: 'Syne', fontSize: 12, color: '#666', marginBottom: 10, letterSpacing: 1 }}>TOPIC</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {TOPICS.map((t) => (
                            <button key={t.id} onClick={() => setTopic(t.id)} style={{
                                padding: '6px 14px', borderRadius: 6, border: `1px solid ${topic === t.id ? '#00F5FF' : '#30363D'}`,
                                background: topic === t.id ? '#00F5FF22' : 'transparent', color: topic === t.id ? '#00F5FF' : '#8B949E',
                                fontFamily: 'DM Sans', fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
                            }}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {mode === 'concept' ? (
                    <>
                        <div style={{ fontFamily: 'DM Sans', fontSize: 14, color: '#8B949E' }}>
                            {getQuestionsForTopic(topic, difficulty).length} questions available · Multiple choice · Instant feedback
                        </div>
                        <button onClick={startQuiz} disabled={!getQuestionsForTopic(topic, difficulty).length}
                            style={{
                                padding: '14px 32px', background: 'linear-gradient(135deg, #00F5FF, #0080FF)',
                                border: 'none', borderRadius: 10, color: '#0D1117', fontFamily: 'Syne',
                                fontWeight: 800, fontSize: 16, cursor: 'pointer', alignSelf: 'flex-start',
                                boxShadow: '0 0 20px #00F5FF44',
                            }}>
                            Start Quiz →
                        </button>
                    </>
                ) : (
                    <div style={{ fontFamily: 'DM Sans', fontSize: 14, color: '#8B949E' }}>
                        <strong style={{ color: '#FFB347' }}>Trace Quiz</strong>: Given a partially-completed visualization snapshot, answer questions about the next step, final value, or algorithm behavior. Select a topic and difficulty above, then start!<br /><br />
                        <em>Tip: Use the Visualizer section to practice tracing algorithms step by step before taking the Trace Quiz.</em>
                    </div>
                )}
            </div>

            {/* Quick stats */}
            <div style={{ ...glass, padding: '16px 24px', display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                <div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 28, fontWeight: 700, color: '#00F5FF' }}>{QUIZ_QUESTIONS.length}</div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#666' }}>Total Questions</div>
                </div>
                <div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 28, fontWeight: 700, color: '#50FA7B' }}>{TOPICS.length - 1}</div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#666' }}>Topics Covered</div>
                </div>
                <div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 28, fontWeight: 700, color: '#FFB347' }}>3</div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#666' }}>Difficulty Levels</div>
                </div>
            </div>
        </div>
    );
}
