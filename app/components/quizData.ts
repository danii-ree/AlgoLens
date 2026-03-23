import type { QuizQuestion } from './types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
    // ── BUBBLE SORT ──
    {
        id: 'bs1', topic: 'bubble-sort', difficulty: 'intro',
        question: 'What is the worst-case time complexity of Bubble Sort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correctIndex: 2,
        explanation: 'Bubble Sort compares every pair in nested loops, giving O(n²) in the worst case.',
    },
    {
        id: 'bs2', topic: 'bubble-sort', difficulty: 'intro',
        question: 'Bubble Sort is stable. What does "stable" mean?',
        options: ['It never crashes', 'Equal elements maintain their relative order', 'It uses O(1) extra space', 'It always runs in O(n log n)'],
        correctIndex: 1,
        explanation: 'A stable sort preserves the original order of equal elements.',
    },
    {
        id: 'bs3', topic: 'bubble-sort', difficulty: 'standard',
        question: 'Given [5, 3, 1, 4, 2], after ONE full pass of Bubble Sort, what is the array?',
        options: ['[1, 2, 3, 4, 5]', '[3, 1, 4, 2, 5]', '[1, 3, 5, 4, 2]', '[3, 5, 1, 4, 2]'],
        correctIndex: 1,
        explanation: 'The first pass bubbles the maximum (5) to the end: [3,1,4,2,5].',
    },
    {
        id: 'bs4', topic: 'bubble-sort', difficulty: 'standard',
        question: 'What is the best-case time complexity of Bubble Sort with early termination?',
        options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'],
        correctIndex: 2,
        explanation: 'With an "already sorted" check, a sorted array requires only one pass: O(n).',
    },
    {
        id: 'bs5', topic: 'bubble-sort', difficulty: 'challenge',
        question: 'How many swaps does Bubble Sort perform on the array [n, n-1, ..., 2, 1] (reverse sorted)?',
        options: ['n', 'n²', 'n(n-1)/2', 'n log n'],
        correctIndex: 2,
        explanation: 'Each element is in the wrong position relative to all following elements. Total inversions = n(n-1)/2.',
    },

    // ── MERGE SORT ──
    {
        id: 'ms1', topic: 'merge-sort', difficulty: 'intro',
        question: 'What paradigm does Merge Sort use?',
        options: ['Greedy', 'Dynamic Programming', 'Divide and Conquer', 'Backtracking'],
        correctIndex: 2,
        explanation: 'Merge Sort divides the array in half, sorts each half, then merges — classic Divide and Conquer.',
    },
    {
        id: 'ms2', topic: 'merge-sort', difficulty: 'intro',
        question: 'What is the space complexity of standard Merge Sort?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctIndex: 2,
        explanation: 'Merge Sort requires O(n) auxiliary space for the temporary arrays during merge.',
    },
    {
        id: 'ms3', topic: 'merge-sort', difficulty: 'standard',
        question: 'What is the time complexity of Merge Sort in ALL cases?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correctIndex: 1,
        explanation: 'Merge Sort always divides log n times and does O(n) work per level: O(n log n) guaranteed.',
    },
    {
        id: 'ms4', topic: 'merge-sort', difficulty: 'challenge',
        question: 'Why might Merge Sort be preferred over Quick Sort for linked lists?',
        options: ['It uses less memory', 'Random access is not needed for merging', 'It is faster in all cases', 'It requires fewer comparisons'],
        correctIndex: 1,
        explanation: 'Merge Sort only needs sequential access, making it efficient for linked lists where random access is O(n).',
    },

    // ── QUICK SORT ──
    {
        id: 'qs1', topic: 'quick-sort', difficulty: 'intro',
        question: 'What is the average-case time complexity of Quick Sort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correctIndex: 1,
        explanation: 'With random pivots, Quick Sort averages O(n log n) by creating balanced partitions on average.',
    },
    {
        id: 'qs2', topic: 'quick-sort', difficulty: 'standard',
        question: 'When does Quick Sort degrade to O(n²)?',
        options: ['When the array is already sorted with a bad pivot choice', 'When there are duplicates', 'When n < 10', 'Always with an odd-sized array'],
        correctIndex: 0,
        explanation: 'Choosing the first/last element as pivot on a sorted array always partitions into n-1 and 0 — O(n²).',
    },
    {
        id: 'qs3', topic: 'quick-sort', difficulty: 'challenge',
        question: 'What is the space complexity of Quick Sort (considering call stack)?',
        options: ['O(1)', 'O(log n) average / O(n) worst', 'O(n)', 'O(n log n)'],
        correctIndex: 1,
        explanation: 'The call stack depth is O(log n) on average (balanced partitions) but O(n) worst case.',
    },

    // ── BINARY SEARCH ──
    {
        id: 'bin1', topic: 'binary-search', difficulty: 'intro',
        question: 'What is the precondition for Binary Search?',
        options: ['The array must be sorted', 'The array must have even length', 'The target must exist', 'The array must have no duplicates'],
        correctIndex: 0,
        explanation: 'Binary Search only works on sorted arrays — it relies on ordering to discard half the search space.',
    },
    {
        id: 'bin2', topic: 'binary-search', difficulty: 'standard',
        question: 'How many comparisons does Binary Search need for n=1024?',
        options: ['1024', '512', '10', '32'],
        correctIndex: 2,
        explanation: 'log₂(1024) = 10. Binary Search halves the search space each step.',
    },
    {
        id: 'bin3', topic: 'binary-search', difficulty: 'challenge',
        question: 'In which case might you prefer Linear Search over Binary Search?',
        options: ['When n is very large', 'When the array is unsorted and sorting is too costly', 'When the array has no duplicates', 'Never'],
        correctIndex: 1,
        explanation: 'If sorting costs O(n log n) but you only search once, Linear Search O(n) might be preferable.',
    },

    // ── BST ──
    {
        id: 'bst1', topic: 'bst', difficulty: 'intro',
        question: 'In a BST, where is the minimum value located?',
        options: ['The root', 'The rightmost node', 'The leftmost node', 'Random location'],
        correctIndex: 2,
        explanation: 'In a BST, every left child is smaller, so the leftmost node holds the minimum.',
    },
    {
        id: 'bst2', topic: 'bst', difficulty: 'standard',
        question: 'What is the worst-case height of a BST with n nodes?',
        options: ['O(log n)', 'O(√n)', 'O(n)', 'O(n²)'],
        correctIndex: 2,
        explanation: 'Inserting sorted data creates a skewed BST with height O(n) — essentially a linked list.',
    },
    {
        id: 'bst3', topic: 'bst', difficulty: 'challenge',
        question: 'What traversal of a BST gives elements in sorted order?',
        options: ['Pre-order', 'Post-order', 'In-order', 'Level-order'],
        correctIndex: 2,
        explanation: 'In-order traversal (Left → Root → Right) of a BST visits nodes in ascending order.',
    },

    // ── GRAPHS ──
    {
        id: 'gr1', topic: 'bfs', difficulty: 'intro',
        question: 'BFS uses which data structure?',
        options: ['Stack', 'Queue', 'Priority Queue', 'Array'],
        correctIndex: 1,
        explanation: 'BFS uses a Queue (FIFO) to explore nodes level by level.',
    },
    {
        id: 'gr2', topic: 'dfs', difficulty: 'intro',
        question: 'DFS uses which data structure (or mechanism)?',
        options: ['Queue', 'Priority Queue', 'Stack (or Recursion)', 'Heap'],
        correctIndex: 2,
        explanation: 'DFS uses a Stack (or the call stack via recursion) to explore as deep as possible.',
    },
    {
        id: 'gr3', topic: 'dijkstra', difficulty: 'standard',
        question: 'Dijkstra\'s algorithm fails when the graph has:',
        options: ['Undirected edges', 'Negative edge weights', 'Disconnected components', 'More than 1000 nodes'],
        correctIndex: 1,
        explanation: 'Dijkstra assumes positive weights. Negative weights can cause it to produce wrong shortest paths.',
    },
    {
        id: 'gr4', topic: 'dijkstra', difficulty: 'challenge',
        question: 'What is the time complexity of Dijkstra with a min-heap?',
        options: ['O(V²)', 'O(E log V)', 'O(V log V)', 'O(E + V)'],
        correctIndex: 1,
        explanation: 'With a binary min-heap: O((V + E) log V) ≈ O(E log V) for connected graphs.',
    },

    // ── HASH TABLE ──
    {
        id: 'ht1', topic: 'hash', difficulty: 'intro',
        question: 'What is the average-case time for lookup in a hash table?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
        correctIndex: 2,
        explanation: 'Hash tables achieve O(1) average lookup by computing the index directly from the key.',
    },
    {
        id: 'ht2', topic: 'hash', difficulty: 'standard',
        question: 'What is a collision in a hash table?',
        options: ['Two identical values inserted', 'Two different keys mapping to the same bucket', 'The table becoming full', 'A hash function error'],
        correctIndex: 1,
        explanation: 'A collision occurs when two distinct keys produce the same hash index.',
    },
    {
        id: 'ht3', topic: 'hash', difficulty: 'challenge',
        question: 'What is the load factor of a hash table?',
        options: ['Number of elements', 'Number of buckets', 'n / m (elements / buckets)', 'Hash function modulo'],
        correctIndex: 2,
        explanation: 'Load factor λ = n/m. As λ → 1, collision probability rises and performance degrades.',
    },

    // ── STACK/QUEUE ──
    {
        id: 'sq1', topic: 'stack', difficulty: 'intro',
        question: 'A Stack follows which ordering principle?',
        options: ['FIFO', 'LIFO', 'Priority', 'Random'],
        correctIndex: 1,
        explanation: 'Stack = Last In, First Out. The last pushed element is the first to be popped.',
    },
    {
        id: 'sq2', topic: 'queue', difficulty: 'intro',
        question: 'A Queue follows which ordering principle?',
        options: ['LIFO', 'FIFO', 'Priority', 'Sorted'],
        correctIndex: 1,
        explanation: 'Queue = First In, First Out. Elements leave in the same order they arrived.',
    },
    {
        id: 'sq3', topic: 'stack', difficulty: 'standard',
        question: 'Which algorithm uses a stack to check balanced parentheses?',
        options: ['BFS', 'Binary Search', 'DFS / Iterative stack', 'Heap Sort'],
        correctIndex: 2,
        explanation: 'Push open brackets, pop on close; mismatch or non-empty stack at end = unbalanced.',
    },

    // ── DP ──
    {
        id: 'dp1', topic: 'fibonacci', difficulty: 'intro',
        question: 'Without memoization, what is the time complexity of recursive Fibonacci?',
        options: ['O(n)', 'O(n log n)', 'O(2ⁿ)', 'O(n²)'],
        correctIndex: 2,
        explanation: 'Naive recursion recomputes subproblems exponentially: O(2ⁿ).',
    },
    {
        id: 'dp2', topic: 'fibonacci', difficulty: 'standard',
        question: 'With memoization (top-down DP), Fibonacci runs in:',
        options: ['O(2ⁿ)', 'O(n²)', 'O(n)', 'O(log n)'],
        correctIndex: 2,
        explanation: 'Each fib(i) is computed once and cached: O(n) time, O(n) space.',
    },
    {
        id: 'dp3', topic: 'knapsack', difficulty: 'challenge',
        question: 'What is the time complexity of the 0/1 Knapsack DP solution?',
        options: ['O(n + W)', 'O(n × W)', 'O(n²)', 'O(2ⁿ)'],
        correctIndex: 1,
        explanation: 'We fill an n × W table, computing each cell in O(1): total O(nW) — pseudo-polynomial.',
    },
];

export function getQuestionsForTopic(topic: string, difficulty: 'intro' | 'standard' | 'challenge'): QuizQuestion[] {
    let qs = QUIZ_QUESTIONS.filter((q) => q.difficulty === difficulty);
    if (topic !== 'all') qs = qs.filter((q) => q.topic === topic);
    // Shuffle
    return qs.sort(() => Math.random() - 0.5);
}
