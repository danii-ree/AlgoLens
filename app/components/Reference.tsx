'use client';
import React, { useState } from 'react';
import { ALGORITHMS } from './registry';

const REFERENCE_DATA = [
    // Sorting
    { name: 'Bubble Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: '✓', inPlace: '✓', recursive: '✗', category: 'Sorting', useWhen: 'Very small n or nearly sorted data' },
    { name: 'Selection Sort', best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: '✗', inPlace: '✓', recursive: '✗', category: 'Sorting', useWhen: 'Min memory writes needed' },
    { name: 'Insertion Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: '✓', inPlace: '✓', recursive: '✗', category: 'Sorting', useWhen: 'Small or nearly sorted arrays' },
    { name: 'Merge Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: '✓', inPlace: '✗', recursive: '✓', category: 'Sorting', useWhen: 'Guaranteed performance, linked lists, external sort' },
    { name: 'Quick Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', stable: '✗', inPlace: '✓', recursive: '✓', category: 'Sorting', useWhen: 'General purpose, cache-friendly, in-place' },
    { name: 'Heap Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', stable: '✗', inPlace: '✓', recursive: '✗', category: 'Sorting', useWhen: 'In-place with guaranteed O(n log n)' },
    { name: 'Counting Sort', best: 'O(n+k)', avg: 'O(n+k)', worst: 'O(n+k)', space: 'O(k)', stable: '✓', inPlace: '✗', recursive: '✗', category: 'Sorting', useWhen: 'Integer keys in bounded small range [0..k]' },
    { name: 'Radix Sort', best: 'O(nk)', avg: 'O(nk)', worst: 'O(nk)', space: 'O(n+k)', stable: '✓', inPlace: '✗', recursive: '✗', category: 'Sorting', useWhen: 'Large integers or fixed-length strings' },
    // Searching
    { name: 'Linear Search', best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)', stable: '–', inPlace: '–', recursive: '✗', category: 'Searching', useWhen: 'Unsorted array or single search' },
    { name: 'Binary Search', best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(1)', stable: '–', inPlace: '–', recursive: '✗', category: 'Searching', useWhen: 'Sorted array with repeated queries' },
    { name: 'Jump Search', best: 'O(1)', avg: 'O(√n)', worst: 'O(√n)', space: 'O(1)', stable: '–', inPlace: '–', recursive: '✗', category: 'Searching', useWhen: 'Sorted array, jumping is cheaper than random access' },
    { name: 'Interpolation', best: 'O(1)', avg: 'O(log log n)', worst: 'O(n)', space: 'O(1)', stable: '–', inPlace: '–', recursive: '✗', category: 'Searching', useWhen: 'Uniformly distributed sorted data' },
    // Trees
    { name: 'BST Search/Insert', best: 'O(log n)', avg: 'O(log n)', worst: 'O(n)', space: 'O(n)', stable: '–', inPlace: '–', recursive: '✓', category: 'Trees', useWhen: 'Dynamic ordered data, frequent insert/delete' },
    { name: 'AVL Tree', best: 'O(log n)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(n)', stable: '–', inPlace: '–', recursive: '✓', category: 'Trees', useWhen: 'Balanced BST needed for guaranteed O(log n)' },
    { name: 'Heap (Min/Max)', best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(n)', stable: '–', inPlace: '✓', recursive: '✗', category: 'Trees', useWhen: 'Priority queue, heap sort, graph algorithms' },
    { name: 'Tree Traversals', best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(h)', stable: '–', inPlace: '–', recursive: '✓', category: 'Trees', useWhen: 'Print/process all nodes; in-order for sorted output' },
    // Graphs
    { name: 'BFS', best: 'O(V+E)', avg: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)', stable: '–', inPlace: '–', recursive: '✗', category: 'Graphs', useWhen: 'Shortest path (unweighted), level-order problems' },
    { name: 'DFS', best: 'O(V+E)', avg: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)', stable: '–', inPlace: '–', recursive: '✓', category: 'Graphs', useWhen: 'Cycle detection, topological sort, connectivity' },
    { name: "Dijkstra's", best: 'O(E log V)', avg: 'O(E log V)', worst: 'O(V²)', space: 'O(V)', stable: '–', inPlace: '–', recursive: '✗', category: 'Graphs', useWhen: 'SSSP with non-negative weights' },
    { name: 'Bellman-Ford', best: 'O(VE)', avg: 'O(VE)', worst: 'O(VE)', space: 'O(V)', stable: '–', inPlace: '–', recursive: '✗', category: 'Graphs', useWhen: 'SSSP with negative weights; detects negative cycles' },
    { name: "Prim's MST", best: 'O(E log V)', avg: 'O(E log V)', worst: 'O(V²)', space: 'O(V)', stable: '–', inPlace: '–', recursive: '✗', category: 'Graphs', useWhen: 'Dense graphs (adjacency matrix)' },
    { name: "Kruskal's MST", best: 'O(E log E)', avg: 'O(E log E)', worst: 'O(E log E)', space: 'O(V)', stable: '–', inPlace: '–', recursive: '✗', category: 'Graphs', useWhen: 'Sparse graphs (edge list)' },
    { name: 'Topological Sort', best: 'O(V+E)', avg: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)', stable: '–', inPlace: '–', recursive: '✗', category: 'Graphs', useWhen: 'Dependency resolution, scheduling on DAGs' },
    // Data Structures
    { name: 'Array', best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(n)', stable: '–', inPlace: '✓', recursive: '✗', category: 'Structures', useWhen: 'Random access, cache locality, fixed-size data' },
    { name: 'Stack', best: 'O(1)', avg: 'O(1)', worst: 'O(1)', space: 'O(n)', stable: '–', inPlace: '✗', recursive: '✗', category: 'Structures', useWhen: 'Function calls, undo, DFS, expression parsing' },
    { name: 'Queue', best: 'O(1)', avg: 'O(1)', worst: 'O(1)', space: 'O(n)', stable: '–', inPlace: '✗', recursive: '✗', category: 'Structures', useWhen: 'BFS, scheduling, buffering, FIFO processing' },
    { name: 'Linked List', best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(n)', stable: '–', inPlace: '–', recursive: '✗', category: 'Structures', useWhen: 'Frequent insert/delete at ends, unknown size' },
    { name: 'Hash Table', best: 'O(1)', avg: 'O(1)', worst: 'O(n)', space: 'O(n)', stable: '–', inPlace: '–', recursive: '✗', category: 'Structures', useWhen: 'Fast lookup, counting, indexing by arbitrary keys' },
    // DP
    { name: 'Fibonacci (DP)', best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(n)', stable: '–', inPlace: '–', recursive: '✓', category: 'DP', useWhen: 'Overlapping subproblems pattern' },
    { name: 'LCS', best: 'O(mn)', avg: 'O(mn)', worst: 'O(mn)', space: 'O(mn)', stable: '–', inPlace: '–', recursive: '✓', category: 'DP', useWhen: 'Diff tools, bioinformatics, sequence matching' },
    { name: '0/1 Knapsack', best: 'O(nW)', avg: 'O(nW)', worst: 'O(nW)', space: 'O(nW)', stable: '–', inPlace: '–', recursive: '✓', category: 'DP', useWhen: 'Resource allocation, subset selection with weights' },
];

const CATEGORIES = ['Sorting', 'Searching', 'Trees', 'Graphs', 'Structures', 'DP'];

const glass: React.CSSProperties = { background: 'rgba(22,27,34,0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(48,54,61,0.8)', borderRadius: 12 };

function complexity(str: string): string {
    if (str.includes('n²') || str.includes('n²')) return '#FF6B6B';
    if (str.includes('n log n') || str.includes('nW') || str.includes('nk') || str.includes('n+k') || str.includes('VE') || str.includes('mn')) return '#FFB347';
    if (str.includes('log n') || str.includes('V+E') || str.includes('E log')) return '#00F5FF';
    if (str === 'O(1)' || str === 'O(n)') return '#50FA7B';
    return '#E6EDF3';
}

export default function Reference() {
    const [search, setSearch] = useState('');
    const [selectedCat, setSelectedCat] = useState<string | null>(null);

    const filtered = REFERENCE_DATA.filter((row) => {
        const matchesCat = !selectedCat || row.category === selectedCat;
        const matchesSearch = !search || Object.values(row).some((v) => String(v).toLowerCase().includes(search.toLowerCase()));
        return matchesCat && matchesSearch;
    });

    const thStyle: React.CSSProperties = { padding: '10px 12px', textAlign: 'left', fontFamily: 'Syne', fontSize: 11, fontWeight: 700, color: '#666', letterSpacing: 1, borderBottom: '1px solid #21262D', whiteSpace: 'nowrap' };
    const tdStyle: React.CSSProperties = { padding: '10px 12px', borderBottom: '1px solid #21262D', fontFamily: 'JetBrains Mono', fontSize: 12 };

    return (
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 800, color: '#E6EDF3', flex: '0 0 auto' }}>📖 Reference Sheet</div>
                <input
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="🔍 Search algorithms..."
                    style={{ flex: 1, minWidth: 200, padding: '10px 16px', background: '#1C2128', border: '1px solid #30363D', borderRadius: 8, color: '#E6EDF3', fontFamily: 'DM Sans', fontSize: 14, outline: 'none' }}
                />
                <button onClick={() => window.print()} className="no-print"
                    style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #30363D', borderRadius: 8, color: '#E6EDF3', fontFamily: 'Syne', fontSize: 13, cursor: 'pointer' }}>
                    🖨 Print
                </button>
            </div>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={() => setSelectedCat(null)}
                    style={{ padding: '6px 14px', borderRadius: 6, border: `1px solid ${!selectedCat ? '#00F5FF' : '#30363D'}`, background: !selectedCat ? '#00F5FF22' : 'transparent', color: !selectedCat ? '#00F5FF' : '#666', fontFamily: 'DM Sans', fontSize: 13, cursor: 'pointer' }}>
                    All
                </button>
                {CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => setSelectedCat(selectedCat === cat ? null : cat)}
                        style={{ padding: '6px 14px', borderRadius: 6, border: `1px solid ${selectedCat === cat ? '#FFB347' : '#30363D'}`, background: selectedCat === cat ? '#FFB34722' : 'transparent', color: selectedCat === cat ? '#FFB347' : '#666', fontFamily: 'DM Sans', fontSize: 13, cursor: 'pointer' }}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div style={{ ...glass, overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                    <thead>
                        <tr style={{ background: '#0D1117' }}>
                            <th style={thStyle}>ALGORITHM</th>
                            <th style={thStyle}>CATEGORY</th>
                            <th style={thStyle}>BEST</th>
                            <th style={thStyle}>AVERAGE</th>
                            <th style={thStyle}>WORST</th>
                            <th style={thStyle}>SPACE</th>
                            <th style={thStyle}>STABLE</th>
                            <th style={thStyle}>IN-PLACE</th>
                            <th style={thStyle}>RECURSIVE</th>
                            <th style={{ ...thStyle, minWidth: 220 }}>WHEN TO USE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((row, i) => (
                            <tr key={i} style={{ background: i % 2 === 0 ? '#1C2128' : '#21262D', transition: 'background 0.15s' }}>
                                <td style={{ ...tdStyle, color: '#E6EDF3', fontWeight: 700 }}>{row.name}</td>
                                <td style={{ ...tdStyle, color: '#666', fontSize: 11 }}>{row.category}</td>
                                <td style={{ ...tdStyle, color: complexity(row.best) }}>{row.best}</td>
                                <td style={{ ...tdStyle, color: complexity(row.avg) }}>{row.avg}</td>
                                <td style={{ ...tdStyle, color: complexity(row.worst) }}>{row.worst}</td>
                                <td style={{ ...tdStyle, color: '#8B949E' }}>{row.space}</td>
                                <td style={{ ...tdStyle, color: row.stable === '✓' ? '#50FA7B' : row.stable === '✗' ? '#FF6B6B' : '#555', textAlign: 'center' }}>{row.stable}</td>
                                <td style={{ ...tdStyle, color: row.inPlace === '✓' ? '#50FA7B' : row.inPlace === '✗' ? '#FF6B6B' : '#555', textAlign: 'center' }}>{row.inPlace}</td>
                                <td style={{ ...tdStyle, color: row.recursive === '✓' ? '#00F5FF' : row.recursive === '✗' ? '#555' : '#555', textAlign: 'center' }}>{row.recursive}</td>
                                <td style={{ ...tdStyle, color: '#8B949E', fontFamily: 'DM Sans', fontSize: 12 }}>{row.useWhen}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div style={{ padding: 40, textAlign: 'center', color: '#444', fontFamily: 'DM Sans' }}>No matching algorithms found.</div>
                )}
            </div>

            {/* Color legend */}
            <div style={{ ...glass, padding: '16px 24px' }}>
                <div style={{ fontFamily: 'Syne', fontSize: 12, color: '#666', marginBottom: 12, letterSpacing: 1 }}>COMPLEXITY LEGEND</div>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    {[
                        { label: 'Excellent (O(1), O(n))', color: '#50FA7B' },
                        { label: 'Good (O(log n), O(n log n))', color: '#00F5FF' },
                        { label: 'Moderate (O(nk), O(VE), O(mn))', color: '#FFB347' },
                        { label: 'Slow (O(n²))', color: '#FF6B6B' },
                    ].map((item) => (
                        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 12, height: 12, borderRadius: 3, background: item.color }} />
                            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#8B949E' }}>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Decision guide */}
            <div style={{ ...glass, padding: 24 }}>
                <div style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 700, color: '#E6EDF3', marginBottom: 16 }}>🧭 When to Use What</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                    {[
                        { q: 'Need fast lookup by key?', a: 'Hash Table — O(1) average', icon: '#️⃣' },
                        { q: 'Need sorted dynamic data?', a: 'BST or AVL Tree — O(log n)', icon: '🌲' },
                        { q: 'FIFO processing?', a: 'Queue', icon: '📦' },
                        { q: 'LIFO / undo / backtracking?', a: 'Stack', icon: '📚' },
                        { q: 'Shortest path, no neg. weights?', a: "Dijkstra's Algorithm", icon: '🗺' },
                        { q: 'Shortest path with neg. weights?', a: 'Bellman-Ford', icon: '⚠️' },
                        { q: 'Connect all nodes cheaply?', a: "Prim's or Kruskal's MST", icon: '🕸' },
                        { q: 'Sort large general data?', a: 'Quick Sort (avg) / Merge Sort (stable)', icon: '⬆' },
                        { q: 'Sort integers in small range?', a: 'Counting Sort or Radix Sort', icon: '🔢' },
                        { q: 'Search sorted array?', a: 'Binary Search — O(log n)', icon: '🔍' },
                        { q: 'Task ordering with deps?', a: 'Topological Sort (DAG)', icon: '📋' },
                        { q: 'Optimal substructure problem?', a: 'Dynamic Programming', icon: '💡' },
                    ].map((item, i) => (
                        <div key={i} style={{ padding: '12px 16px', background: '#0D1117', borderRadius: 8, border: '1px solid #21262D' }}>
                            <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#8B949E', marginBottom: 4 }}>
                                <span style={{ marginRight: 6 }}>{item.icon}</span>{item.q}
                            </div>
                            <div style={{ fontFamily: 'Syne', fontSize: 13, fontWeight: 700, color: '#00F5FF' }}>→ {item.a}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
