'use client';
import React, { useState, useRef, useEffect } from 'react';
import { QUIZ_QUESTIONS, getQuestionsForTopic } from './quizData';
import type { QuizQuestion } from './types';
import { ALGORITHMS } from './registry';
import { Circle, PartyPopper, BookOpen, RotateCcw, Lightbulb, Puzzle } from 'lucide-react';

const dynamicTopics = Array.from(new Set(QUIZ_QUESTIONS.map(q => q.topic)));
const TOPICS = [
    { id: 'all', label: 'All Topics' },
    ...dynamicTopics.map(t => ({
        id: t,
        label: t.split('-').map(w => w === 'and' ? 'and' : w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }))
];

interface QuizState {
    questions: QuizQuestion[];
    currentIndex: number;
    selected: number | number[] | null;
    showResult: boolean;
    score: number;
    startTime: number;
    finished: boolean;
}

const glass: React.CSSProperties = {
    background: 'var(--bg-glass)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid var(--border-glass)',
    borderRadius: 12,
};

export default function QuizMode() {
    const [topic, setTopic] = useState('all');
    const [quiz, setQuiz] = useState<QuizState | null>(null);
    const [shake, setShake] = useState(false);
    const [wrongIndex, setWrongIndex] = useState<number | null>(null);

    function startQuiz() {
        const qs = getQuestionsForTopic(topic);
        if (!qs.length) return;
        setQuiz({ questions: qs, currentIndex: 0, selected: qs[0]?.isMultipleSelect ? [] : null, showResult: false, score: 0, startTime: Date.now(), finished: false });
        setShake(false); setWrongIndex(null);
    }

    function selectAnswer(i: number) {
        if (!quiz || quiz.showResult) return;
        const q = quiz.questions[quiz.currentIndex];

        if (q.isMultipleSelect) {
            const currentSelected = Array.isArray(quiz.selected) ? quiz.selected : [];
            const newSelected = currentSelected.includes(i) ? currentSelected.filter(val => val !== i) : [...currentSelected, i];
            setQuiz((prev) => prev ? { ...prev, selected: newSelected } : prev);
        } else {
            const correct = q.correctIndex as number;
            const isCorrect = i === correct;
            if (!isCorrect) {
                setShake(true);
                setWrongIndex(i);
                setTimeout(() => setShake(false), 500);
            }
            setQuiz((prev) => prev ? { ...prev, selected: i, showResult: true, score: isCorrect ? prev.score + 1 : prev.score } : prev);
        }
    }

    function submitMultiSelect() {
        if (!quiz || quiz.showResult) return;
        const q = quiz.questions[quiz.currentIndex];
        const correct = Array.isArray(q.correctIndex) ? q.correctIndex : [q.correctIndex];
        const currentSelected = Array.isArray(quiz.selected) ? quiz.selected : [];
        
        const isCorrect = currentSelected.length === correct.length && correct.every(c => currentSelected.includes(c as number));
        if (!isCorrect) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
        setQuiz((prev) => prev ? { ...prev, showResult: true, score: isCorrect ? prev.score + 1 : prev.score } : prev);
    }

    function nextQuestion() {
        if (!quiz) return;
        setWrongIndex(null);
        if (quiz.currentIndex + 1 >= quiz.questions.length) {
            setQuiz((q) => q ? { ...q, finished: true } : q);
        } else {
            const nextQ = quiz.questions[quiz.currentIndex + 1];
            setQuiz((q) => q ? { ...q, currentIndex: q.currentIndex + 1, selected: nextQ.isMultipleSelect ? [] : null, showResult: false } : q);
        }
    }

    if (quiz?.finished) {
        const elapsed = Math.round((Date.now() - quiz.startTime) / 1000);
        const pct = Math.round((quiz.score / quiz.questions.length) * 100);
        return (
            <div style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                <div style={{ ...glass, padding: '40px 48px', textAlign: 'center', maxWidth: 500, width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                        {pct >= 80 ? <PartyPopper size={64} color="var(--color-success)" /> : pct >= 50 ? <BookOpen size={64} color="var(--color-warning)" /> : <RotateCcw size={64} color="var(--color-danger)" />}
                    </div>
                    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', margin: '12px 0 4px' }}>
                        Quiz Complete!
                    </div>
                    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'var(--text-secondary)', marginBottom: 24 }}>
                        {topic === 'all' ? 'All Topics' : topic}
                    </div>
                    <div style={{ fontSize: 48, fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 800, color: pct >= 80 ? 'var(--color-success)' : pct >= 50 ? 'var(--color-warning)' : 'var(--color-danger)', margin: '8px 0' }}>
                        {quiz.score}/{quiz.questions.length}
                    </div>
                    <div style={{ background: 'var(--bg-main)', borderRadius: 8, height: 12, margin: '12px 0', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: pct >= 80 ? 'var(--color-success)' : pct >= 50 ? 'var(--color-warning)' : 'var(--color-danger)', transition: 'width 1s ease', boxShadow: pct >= 80 ? '0 0 12px var(--color-success)' : undefined }} />
                    </div>
                    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'var(--text-secondary)', fontSize: 14 }}>
                        Time taken: {elapsed}s · Accuracy: {pct}%
                    </div>
                    {pct < 80 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20, padding: '12px 16px', background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger)44', borderRadius: 8, fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 13, color: 'var(--color-danger)' }}>
                            <Lightbulb size={16} /> Review these topics in the Visualizer for practice.
                        </div>
                    )}
                    <button onClick={startQuiz} style={{ marginTop: 24, padding: '12px 28px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-alt))', border: 'none', borderRadius: 8, color: 'var(--bg-main)', fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                        Try Again
                    </button>
                    <button onClick={() => setQuiz(null)} style={{ marginTop: 12, marginLeft: 12, padding: '12px 28px', background: 'transparent', border: '1px solid var(--border-main)', borderRadius: 8, color: 'var(--text-primary)', fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
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
                    <div style={{ flex: 1, background: 'var(--bg-main)', borderRadius: 8, height: 8, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--accent-primary), var(--color-warning))', transition: 'width 0.4s ease' }} />
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {quiz.currentIndex + 1} / {quiz.questions.length} · Score: {quiz.score}
                    </span>
                </div>

                {/* Question */}
                <div style={{ ...glass, padding: 28 }}>
                    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: 24 }}>
                        {q.question}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {q.options.map((opt, i) => {
                            let bg = 'var(--bg-panel-trans)', border = 'var(--border-main)', color = 'var(--text-primary)', glow = 'none';
                            const isSelected = Array.isArray(quiz.selected) ? quiz.selected.includes(i) : quiz.selected === i;
                            const isCorrectAnswer = Array.isArray(q.correctIndex) ? q.correctIndex.includes(i) : q.correctIndex === i;

                            if (quiz.showResult) {
                                if (isCorrectAnswer) { bg = 'var(--color-success-bg)'; border = 'var(--color-success)'; color = 'var(--color-success)'; glow = '0 0 12px var(--color-success)44'; }
                                else if (isSelected && !isCorrectAnswer) { bg = 'var(--color-danger-bg)'; border = 'var(--color-danger)'; color = 'var(--color-danger)'; }
                            } else if (isSelected) {
                                border = 'var(--accent-primary)';
                                bg = 'var(--accent-primary-bg)';
                            }

                            return (
                                <button key={i} onClick={() => selectAnswer(i)}
                                    style={{
                                        padding: '14px 20px', background: bg, border: `2px solid ${border}`, borderRadius: 10,
                                        color, textAlign: 'left', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 15, cursor: quiz.showResult ? 'default' : 'pointer',
                                        boxShadow: glow, transition: 'all 0.2s',
                                        animation: shake && (!q.isMultipleSelect && i === wrongIndex) ? 'shake 0.3s ease' : undefined,
                                    }}>
                                    <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)', marginRight: 10 }}>{String.fromCharCode(65 + i)}.</span>
                                    {opt}
                                    {quiz.showResult && isCorrectAnswer && ' ✓'}
                                    {quiz.showResult && isSelected && !isCorrectAnswer && ' ✗'}
                                </button>
                            );
                        })}
                    </div>
                    {q.isMultipleSelect && !quiz.showResult && (
                        <button onClick={submitMultiSelect} style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent-primary)', border: 'none', borderRadius: 8, color: 'var(--bg-main)', fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700, fontSize: 15, cursor: 'pointer', alignSelf: 'flex-start' }}>
                            Submit Answer
                        </button>
                    )}

                    {quiz.showResult && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20, padding: '14px 18px', background: 'var(--accent-primary-bg)', border: '1px solid var(--accent-primary-border)', borderRadius: 8, fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                            <Lightbulb size={16} color="var(--accent-primary)" /> {q.explanation}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                    {quiz.showResult && (
                        <button onClick={nextQuestion} style={{ flex: 1, padding: '12px 24px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-alt))', border: 'none', borderRadius: 8, color: 'var(--bg-main)', fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                            {quiz.currentIndex + 1 >= quiz.questions.length ? 'See Results →' : 'Next Question →'}
                        </button>
                    )}
                    <button onClick={() => setQuiz(null)} style={{ padding: '12px 20px', background: 'transparent', border: '1px solid var(--border-main)', borderRadius: 8, color: 'var(--text-secondary)', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 14, cursor: 'pointer' }}>
                        Quit
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}><Puzzle size={24} /> Quiz Mode</div>

            <div style={{ ...glass, padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Topic */}
                <div>
                    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, letterSpacing: 1 }}>TOPIC</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {TOPICS.map((t) => (
                            <button key={t.id} onClick={() => setTopic(t.id)} style={{
                                padding: '6px 14px', borderRadius: 6, border: `1px solid ${topic === t.id ? 'var(--accent-primary)' : 'var(--border-main)'}`,
                                background: topic === t.id ? 'var(--accent-primary-bg)' : 'transparent', color: topic === t.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
                            }}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 14, color: 'var(--text-secondary)' }}>
                    {getQuestionsForTopic(topic).length} questions available · Multiple choice · Instant feedback
                </div>
                <button onClick={startQuiz} disabled={!getQuestionsForTopic(topic).length}
                    style={{
                        padding: '14px 32px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-alt))',
                        border: 'none', borderRadius: 10, color: 'var(--bg-main)', fontFamily: 'system-ui, -apple-system, sans-serif',
                        fontWeight: 800, fontSize: 16, cursor: 'pointer', alignSelf: 'flex-start',
                        boxShadow: '0 0 20px var(--accent-primary)44',
                    }}>
                    Start Quiz →
                </button>
            </div>

            {/* Quick stats */}
            <div style={{ ...glass, padding: '16px 24px', display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                <div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 28, fontWeight: 700, color: 'var(--accent-primary)' }}>{QUIZ_QUESTIONS.length}</div>
                    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 13, color: 'var(--text-secondary)' }}>Total Questions</div>
                </div>
                <div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 28, fontWeight: 700, color: 'var(--color-success)' }}>{TOPICS.length - 1}</div>
                    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 13, color: 'var(--text-secondary)' }}>Topics Covered</div>
                </div>
            </div>
        </div>
    );
}
