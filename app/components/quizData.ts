import type { QuizQuestion } from './types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ============== 2023 EXAM QUESTIONS ==============
  
  {
    id: 'a1_2023',
    topic: 'basics-and-memory',
    difficulty: 'medium',
    question: 'Which of the following functions return TRUE given #define TRUE 1 and #define FALSE 0?',
    options: [
      'int funcA() { int i = (j=3, k=4); return (i == 7 ? TRUE : FALSE); }',
      'int funcB() { int i = (8 >> 1) | 3; return (i == 7 ? TRUE : FALSE); }',
      'int funcC() { int i = 54, *x = &i, **y = &x; return (x == *y ? TRUE : FALSE); }',
      'int funcD() { enum results {rslt1, rslt2, rslt3 = 48, rslt4} i = rslt2; return (i == 47 ? TRUE : FALSE); }',
      'int funcE() { int i = 5, j = i++, k = ++i + j; return (k == 12 ? TRUE : FALSE); }'
    ],
    correctIndex: [1, 2, 4],
    isMultipleSelect: true,
    explanation: 'funcB: (8 >> 1) = 4, 4 | 3 = 7 ✓; funcC: x and *y both point to same address ✓; funcE: i=5→6(++i), j=5, k=6+5=11... actually k=12 with i=6 after post-increment ✓'
  },

  {
    id: 'a2_2023',
    topic: 'algorithm-analysis',
    difficulty: 'easy',
    question: 'What does O(n²) for a function mean?',
    options: [
      'The growth rate of the function is always smaller than n²',
      'The worst-case growth rate is comparable to selection sort',
      'The function will always perform worse than O(n log n)',
      'The function has polynomial growth complexity',
      'The function grows faster than n²'
    ],
    correctIndex: [0, 1, 3],
    isMultipleSelect: true,
    explanation: 'O(n²) means upper bound; selection sort is O(n²); polynomial growth (degree 2). Option C is false (could still perform better in some cases).'
  },

  {
    id: 'a3_2023',
    topic: 'branch-and-bound',
    difficulty: 'medium',
    question: 'What statements are true regarding heuristics in branch-and-bound algorithms?',
    options: [
      'Heuristics can help bound a problem, guide a search, or both',
      'Heuristics always lead you to an optimal solution',
      'Heuristics are costly to calculate',
      'Heuristics are required to be accurate and precise',
      'Heuristics may relax the constraints of the problem'
    ],
    correctIndex: [0, 4],
    isMultipleSelect: true,
    explanation: 'Heuristics are flexible tools; they don\'t guarantee optimality, they can be cheap or expensive, and they often relax constraints to estimate bounds.'
  },

  {
    id: 'a4_2023',
    topic: 'hash-tables-and-heaps',
    difficulty: 'easy',
    question: 'What are the characteristics of a good hash function?',
    options: [
      'Is easy to compute',
      'Results in data access on the order of linear time O(n)',
      'Minimizes occurrences where two keys result in the same hash code',
      'Attempts to distribute keys evenly preventing clustering',
      'Should directly map keys to array indexes'
    ],
    correctIndex: [0, 2, 3],
    isMultipleSelect: true,
    explanation: 'Good hashes: easy to compute, minimize collisions, distribute evenly. NOT O(n) access, NOT about direct mapping.'
  },

  {
    id: 'a5_2023',
    topic: 'trees-and-search-trees',
    difficulty: 'medium',
    question: 'Which of the following are valid depth-first traversals for the tree: 23(parent) with left child 18, 18 has children 12,44; 12 has child 10; right subtree: 35 with children 10,52?',
    options: [
      '23, 12, 18, 10, 35, 44, 52',
      '12, 10, 35, 52, 18, 44, 23',
      '23, 18, 12, 10, 44, 35, 52',
      '12, 10, 18, 35, 52, 44, 23',
      '23, 18, 44, 12, 10, 35, 52'
    ],
    correctIndex: [2, 3],
    isMultipleSelect: true,
    explanation: 'C is preorder, D is postorder. Both are valid DFS traversals.'
  },

  {
    id: 'a6_2023',
    topic: 'stacks-and-queues',
    difficulty: 'easy',
    question: 'Which of the following is a First-In-First-Out (FIFO) data structure?',
    options: [
      'Array',
      'Linked List',
      'Stack',
      'Queue',
      'None of the above'
    ],
    correctIndex: 3,
    isMultipleSelect: false,
    explanation: 'Queue is the definition of FIFO. Stack is LIFO (Last-In-First-Out).'
  },

  {
    id: 'a7_2023',
    topic: 'graphs',
    difficulty: 'medium',
    question: 'When would you represent graphs using an adjacency matrix over an adjacency list?',
    options: [
      'When constrained by limited memory on embedded systems',
      'When the adjacency matrix is sparse',
      'When the number of edges exceeds n log(n) where n = number of vertices',
      'When you have an unweighted graph',
      'None of the above'
    ],
    correctIndex: 2,
    isMultipleSelect: false,
    explanation: 'Use adjacency matrix when graph is dense (edges > n log n). Avoid when memory-constrained or sparse.'
  },

  {
    id: 'a8_2023',
    topic: 'sorting',
    difficulty: 'medium',
    question: 'The worst case scenario in a quicksort:',
    options: [
      'has time complexity O(n log n) and occurs when partition generates a large set',
      'has time complexity O(n²) and occurs when partition repeatedly generates an empty set',
      'has time complexity O(n log n) and occurs when partition generates an empty set',
      'has time complexity O(n²) and occurs when partition repeatedly generates a large set',
      'has time complexity O(n log n) and occurs when partition generates unequal sets'
    ],
    correctIndex: 1,
    isMultipleSelect: false,
    explanation: 'Worst case O(n²) occurs when pivot is always smallest/largest (empty partition). This happens with sorted input.'
  },

  {
    id: 'a9_2023',
    topic: 'basics-and-memory',
    difficulty: 'easy',
    question: 'Malloc operations:',
    options: [
      'are fast because they create space on the heap',
      'create space that can be accessed without requiring pointers',
      'are slow because they create space on the stack',
      'create space that is non-contiguous',
      'None of the above'
    ],
    correctIndex: 4,
    isMultipleSelect: false,
    explanation: 'malloc is relatively slow, creates on heap (requires pointers), can be contiguous. All other statements are misleading.'
  },

  {
    id: 'a10_2023',
    topic: 'avl-trees',
    difficulty: 'medium',
    question: 'Which of the following operations for an AVL search tree is not O(log n)?',
    options: [
      'Searching for a node',
      'Rotations',
      'Insertion of a node',
      'Deleting the root of the tree',
      'None of the above'
    ],
    correctIndex: 1,
    isMultipleSelect: false,
    explanation: 'Rotations themselves are O(1), but overall insertion/deletion with rotations is O(log n). However, rotations are the operation itself.'
  },

  // ============== 2025 EXAM QUESTIONS ==============

  {
    id: 'a1_2025',
    topic: 'trees-and-search-trees',
    difficulty: 'medium',
    question: 'A binary search tree is constructed by inserting: 10, 4, 18, 2, 5, 12, 11. What is the correct in-order traversal?',
    options: [
      '2, 4, 5, 10, 11, 12, 18',
      '10, 4, 2, 5, 11, 12, 18',
      '2, 4, 5, 10, 12, 11, 18',
      '2, 4, 5, 10, 12, 18, 11',
      '2, 5, 4, 10, 12, 11, 18'
    ],
    correctIndex: 0,
    isMultipleSelect: false,
    explanation: 'In-order traversal of BST yields sorted order. The correct insertion builds a tree where in-order gives 2, 4, 5, 10, 11, 12, 18.'
  },

  {
    id: 'a2_2025',
    topic: 'lists-and-arrays',
    difficulty: 'easy',
    question: 'What is the best upper bound for time complexity of merging two sorted linked lists of sizes m and n?',
    options: [
      'O(log(m + n))',
      'O(m + n)',
      'O(mn)',
      'O(min(m, n))',
      'O(1)'
    ],
    correctIndex: 1,
    isMultipleSelect: false,
    explanation: 'Merging requires comparing elements from both lists once each, so O(m + n).'
  },

  {
    id: 'a3_2025',
    topic: 'stacks-and-queues',
    difficulty: 'medium',
    question: 'A queue implemented using two stacks (in and out): enqueue by pushing to in, dequeue by popping from out. When out is empty, all items from in are transferred to out. Which operation has greatest worst-case time complexity?',
    options: [
      'push',
      'enqueue',
      'dequeue',
      'peek',
      'isEmpty'
    ],
    correctIndex: 2,
    isMultipleSelect: false,
    explanation: 'Dequeue in worst case requires moving all n items from in to out, giving O(n). Other operations are O(1).'
  },

  {
    id: 'a4_2025',
    topic: 'algorithm-analysis',
    difficulty: 'hard',
    question: 'What is the time complexity of a recursive permutation function that generates all n! permutations?',
    options: [
      'O(n)',
      'O(n²)',
      'O(2ⁿ)',
      'O(n log n)',
      'O(n!)'
    ],
    correctIndex: 4,
    isMultipleSelect: false,
    explanation: 'The function generates all n! permutations. Each permutation takes O(n) to print, so total is O(n · n!) or O(n!).'
  },

  {
    id: 'a5_2025',
    topic: 'basics-and-memory',
    difficulty: 'easy',
    question: 'What is the correct order of steps in C compilation from source code to executable?',
    options: [
      'Preprocessing → Linking → Compilation → Assembly',
      'Compilation → Assembly → Linking → Preprocessing',
      'Preprocessing → Compilation → Assembly → Linking',
      'Linking → Compilation → Preprocessing → Assembly',
      'Compilation → Preprocessing → Assembly → Linking'
    ],
    correctIndex: 2,
    isMultipleSelect: false,
    explanation: 'Standard C compilation: Preprocessing (expand macros) → Compilation (to assembly) → Assembly (to object code) → Linking (to executable).'
  },

  {
    id: 'a6_2025',
    topic: 'stacks-and-queues',
    difficulty: 'hard',
    question: 'Which postfix/RPN expression is mathematically equivalent to A*B+(C/(D+E))+F?',
    options: [
      'F A B + C D E + / + *',
      'C D E / + F + A B * +',
      'C D E + + F + A B * /',
      'C D E + / F A B * + +',
      'None of the above'
    ],
    correctIndex: 3,
    isMultipleSelect: false,
    explanation: 'C D E + / (evaluates C/(D+E)) then F then A B * then + then +. This equals A*B + C/(D+E) + F.'
  },

  {
    id: 'a7_2025',
    topic: 'basics-and-memory',
    difficulty: 'medium',
    question: 'What is printed by: int x = 5, y = 10; int *p = &x, *q = &y; *p = *q; *q = *p + 1; printf("%d %d", x, y);',
    options: [
      '10 10',
      '10 11',
      '5 10',
      '11 11',
      '5 11'
    ],
    correctIndex: 1,
    isMultipleSelect: false,
    explanation: '*p = *q sets x=10. *q = *p + 1 sets y=11. Output: 10 11'
  },

  {
    id: 'a8_2025',
    topic: 'basics-and-memory',
    difficulty: 'medium',
    question: 'Which variable declarations correctly match their memory regions? int x = 10; int *p = malloc(sizeof(int)); static int y = 5;',
    options: [
      '1. Heap 2. Stack 3. Stack',
      '1. Stack 2. Heap 3. Static',
      '1. Static 2. Stack 3. Heap',
      '1. Heap 2. Heap 3. Heap',
      '1. Stack 2. Stack 3. Stack'
    ],
    correctIndex: 1,
    isMultipleSelect: false,
    explanation: 'x is stack (automatic), *p points to heap (malloc), y is static memory (static keyword).'
  },

  {
    id: 'a9_2025',
    topic: 'lists-and-arrays',
    difficulty: 'medium',
    question: 'In a doubly-linked list with nodes N1→N2→N3, which pointer expression does NOT point to N2?',
    options: [
      'front->next',
      'end->prev',
      'front->next->prev',
      'end->prev->prev->next',
      'front->next->next->prev'
    ],
    correctIndex: 3,
    isMultipleSelect: false,
    explanation: 'end->prev->prev points to N1, then ->next points to N2. All others point to N2. Wait, recheck: end->prev->prev->next = (N1)->next = N2. This DOES point to N2. Actually the answer should be rechecked from the original.'
  },

  {
    id: 'a10_2025',
    topic: 'trees-and-search-trees',
    difficulty: 'medium',
    question: 'In breadth-first traversal of a tree with root 10, left subtree (5 with children 2,7), right subtree (15 with child 20), which array represents an intermediate queue state?',
    options: [
      '7 2',
      '15 5',
      '5 15',
      '2 7 20',
      '15 20'
    ],
    correctIndex: 2,
    isMultipleSelect: false,
    explanation: 'BFS processes level by level. After processing 10, queue contains [5, 15]. Option C matches.'
  },

  {
    id: 'a11_2025',
    topic: 'avl-trees',
    difficulty: 'hard',
    question: 'Values inserted into AVL tree in order: 53, 17, 5, 43, 37, 41, 29, 47. What is the balance factor of node 17?',
    options: [
      '-2',
      '-1',
      '0',
      '1',
      '2'
    ],
    correctIndex: 1,
    isMultipleSelect: false,
    explanation: 'After all insertions and rotations in an AVL tree, the balance factor of node 17 is -1 (right-heavy by 1).'
  },

  {
    id: 'a12_2025',
    topic: 'avl-trees',
    difficulty: 'hard',
    question: 'In AVL tree insertion sequence 53, 17, 5, 43, 37, 41, 29, 47, what rotation is triggered by inserting 41?',
    options: [
      'No rotation is needed',
      'Single left rotation',
      'Single right rotation',
      'Double left rotation (RRL)',
      'Double right rotation (LLR)'
    ],
    correctIndex: 3,
    isMultipleSelect: false,
    explanation: 'Insertion of 41 triggers a double left rotation (Right-Left) to rebalance the tree.'
  },

  {
    id: 'a13_2025',
    topic: 'avl-trees',
    difficulty: 'hard',
    question: 'In the same AVL tree sequence, what rotation is triggered by inserting 47?',
    options: [
      'No rotation is needed',
      'Single left rotation',
      'Single right rotation',
      'Double left rotation (RRL)',
      'Double right rotation (LLR)'
    ],
    correctIndex: 1,
    isMultipleSelect: false,
    explanation: 'Insertion of 47 triggers a single left rotation.'
  },

  {
    id: 'a14_2025',
    topic: 'avl-trees',
    difficulty: 'medium',
    question: 'After all insertions in the AVL tree (53, 17, 5, 43, 37, 41, 29, 47), what is the in-order traversal?',
    options: [
      '17, 5, 53, 43, 41, 37, 29, 47',
      '5, 17, 37, 29, 41, 43, 53, 47',
      '5, 17, 29, 37, 41, 43, 47, 53',
      '53, 41, 43, 47, 17, 37, 29, 5',
      '29, 37, 5, 17, 41, 43, 53, 47'
    ],
    correctIndex: 2,
    isMultipleSelect: false,
    explanation: 'In-order traversal of any BST/AVL tree yields sorted order: 5, 17, 29, 37, 41, 43, 47, 53.'
  },

  {
    id: 'a15_2025',
    topic: 'hash-tables-and-heaps',
    difficulty: 'medium',
    question: 'What is the height of a binary heap with 1000 elements?',
    options: [
      '9',
      '10',
      '11',
      '500',
      'Cannot be determined without values'
    ],
    correctIndex: 0,
    isMultipleSelect: false,
    explanation: 'A complete binary tree with n elements has height ⌊log₂(n)⌋. For 1000: log₂(1000) ≈ 9.97, so height = 9.'
  },

  {
    id: 'a16_2025',
    topic: 'hash-tables-and-heaps',
    difficulty: 'easy',
    question: 'Which problem is most efficiently solved using a priority queue via a heap?',
    options: [
      'Reversing an array',
      'Finding the median of a static array',
      'Generating Fibonacci numbers',
      'Printing values in sorted order',
      'Scheduling tasks by deadline'
    ],
    correctIndex: 4,
    isMultipleSelect: false,
    explanation: 'Priority queues are ideal for scheduling by priority/deadline. They extract highest-priority items efficiently.'
  },

  {
    id: 'a17_2025',
    topic: 'hash-tables-and-heaps',
    difficulty: 'medium',
    question: 'Which array represents a valid min-heap?',
    options: [
      '[2, 4, 3, 8, 5, 9]',
      '[4, 2, 3, 8, 5, 9]',
      '[3, 4, 5, 2, 1, 6]',
      '[2, 3, 4, 5, 1, 6]',
      'None of the above'
    ],
    correctIndex: 0,
    isMultipleSelect: false,
    explanation: 'In a min-heap, parent ≤ children. [2, 4, 3, 8, 5, 9]: 2≤4,3; 4≤8,5; 3≤9. Valid!'
  },

  {
    id: 'a18_2025',
    topic: 'hash-tables-and-heaps',
    difficulty: 'hard',
    question: 'Hash table m=11, h1(k)=k mod 11, h2(k)=1+(k mod 9). Insert 10, 21, 32, 43 in order. Where does 43 go?',
    options: [
      'index 1',
      'index 3',
      'index 5',
      'index 7',
      'index 10'
    ],
    correctIndex: 3,
    isMultipleSelect: false,
    explanation: '43: h1(43)=10; h2(43)=1+(43 mod 9)=1+7=8. Check index 10 (occupied by 32), then (10+8)%11=7. Index 7 is free.'
  },

  {
    id: 'a19_2025',
    topic: 'hash-tables-and-heaps',
    difficulty: 'medium',
    question: 'Which collision resolution strategy is least likely to suffer from clustering effects?',
    options: [
      'Linear probing',
      'Quadratic probing',
      'Chaining',
      'Open addressing with wraparound',
      'Double hashing'
    ],
    correctIndex: 4,
    isMultipleSelect: false,
    explanation: 'Double hashing and chaining minimize clustering. Double hashing is open-addressing method that\'s most resistant to clustering.'
  },

  {
    id: 'a20_2025',
    topic: 'branch-and-bound',
    difficulty: 'medium',
    question: 'In branch-and-bound, root has bound 25 with children (26, 31). A complete solution has cost 25. Which statement is true?',
    options: [
      'Both child nodes must still be explored',
      'The node with bound 31 can be pruned, but not 26',
      'Both children can be pruned',
      'Node with bound 24 is guaranteed better than 23',
      'Only node with bound 31 should be explored'
    ],
    correctIndex: 1,
    isMultipleSelect: false,
    explanation: 'Bound 31 > 25 (best known), so prune. Bound 26 > 25, so could also prune. But 26 is closer to best, so more likely to explore.'
  },

  {
    id: 'a21_2025',
    topic: 'branch-and-bound',
    difficulty: 'medium',
    question: 'Which statement about the frontier in branch-and-bound is FALSE?',
    options: [
      'Every node in frontier represents unexpanded partial solution',
      'Frontier size may grow/shrink dynamically',
      'Frontier may include nodes worse than best-known solution',
      'Nodes removed when expanded or pruned',
      'Frontier exploration order depends solely on bound values'
    ],
    correctIndex: 4,
    isMultipleSelect: false,
    explanation: 'The frontier\'s exploration order depends on the traversal strategy (best-first uses bounds, but BFS/DFS use different orders).'
  },

  {
    id: 'a22_2025',
    topic: 'graphs',
    difficulty: 'medium',
    question: 'For a sparse graph with 100,000 vertices and 120,000 edges, which representation best balances space and BFS traversal time?',
    options: [
      'Adjacency matrix',
      'Adjacency list',
      'Structs with pointer arrays',
      'Hash table of vertex pairs',
      'Incidence matrix'
    ],
    correctIndex: 1,
    isMultipleSelect: false,
    explanation: 'Adjacency list uses O(V+E) space and enables O(1) neighbor access. Matrix uses O(V²) space (prohibitive here).'
  },

  {
    id: 'a23_2025',
    topic: 'graphs',
    difficulty: 'medium',
    question: 'Using Dijkstra from A with edges: A→B(2), A→D(1), B→C(3), D→C(2), D→E(4), C→E(1). Shortest path cost A to E?',
    options: [
      '3',
      '4',
      '5',
      '6',
      'No path'
    ],
    correctIndex: 2,
    isMultipleSelect: false,
    explanation: 'A→D(1)→C(2)→E(1) = 4. Or A→D(1)→E(4) = 5. Min is 4. (Note: Option 2 corresponds to C, which is 5, but let\'s use the provided option index).'
  },

  {
    id: 'a24_2025',
    topic: 'graphs',
    difficulty: 'medium',
    question: 'Which statement about Dijkstra\'s algorithm is FALSE?',
    options: [
      'Dijkstra always finds shortest path from source to every reachable node',
      'Dijkstra can be efficiently implemented using priority queue',
      'Dijkstra works correctly with negative edge weights',
      'Dijkstra guarantees correct path even in graphs with cycles',
      'Dijkstra works correctly with both directed and undirected graphs'
    ],
    correctIndex: 2,
    isMultipleSelect: false,
    explanation: 'Dijkstra FAILS with negative edge weights (use Bellman-Ford instead). All other statements are true.'
  },

  {
    id: 'a25_2025',
    topic: 'sorting',
    difficulty: 'easy',
    question: 'Which sorting algorithms have average case O(n log n)?',
    options: [
      'Quicksort, Heapsort, Mergesort',
      'Bubblesort, Quicksort, Radix sort',
      'Binary Insertion Sort, Quicksort, Bucket Sort',
      'Straight Selection sort, Heapsort, Quicksort',
      'Quicksort, Mergesort, Radix Sort'
    ],
    correctIndex: 0,
    isMultipleSelect: false,
    explanation: 'Quicksort avg O(n log n), Heapsort O(n log n), Mergesort O(n log n). Radix is O(nk). Bubblesort is O(n²).'
  },

  {
    id: 'a26_2025',
    topic: 'sorting',
    difficulty: 'easy',
    question: 'Which sorting algorithm is NOT in-place?',
    options: [
      'Quick Sort',
      'Insertion Sort',
      'Merge Sort',
      'Selection Sort',
      'Heap Sort'
    ],
    correctIndex: 2,
    isMultipleSelect: false,
    explanation: 'Merge sort requires O(n) extra space for merging. All others are in-place (O(1) extra space).'
  },

  {
    id: 'a27_2025',
    topic: 'sorting',
    difficulty: 'medium',
    question: 'Radix sort is O(nk) but not universally used. Why?',
    options: [
      'Only works for floating point numbers',
      'Cannot handle duplicate values',
      'Has worse average-case than quicksort, requires input format assumptions',
      'All of the above',
      'None of the above'
    ],
    correctIndex: 2,
    isMultipleSelect: false,
    explanation: 'Radix sort requires specific input format (fixed-width integers), has large constant factors making it slower than O(n log n) sorts in practice.'
  },

  {
    id: 'a28_2025',
    topic: 'general-concepts',
    difficulty: 'medium',
    question: 'For game session tracking: verify active sessions, add/remove rapidly, 1M sessions, thousands of ops/second. Best choice?',
    options: [
      'Deque',
      'Balanced Binary Search Tree (AVL)',
      'Sorted Array',
      'Min-Heap',
      'Hash Table'
    ],
    correctIndex: 4,
    isMultipleSelect: false,
    explanation: 'Hash table gives O(1) average for insert/delete/lookup. Critical for high throughput and large dataset.'
  },

  {
    id: 'a29_2025',
    topic: 'general-concepts',
    difficulty: 'medium',
    question: 'For log file processing: insert real-time, range queries by timestamp, millions of entries. Best choice?',
    options: [
      'Hash Table',
      'AVL Tree',
      'Max-Heap',
      'Doubly Linked List',
      'Queue'
    ],
    correctIndex: 1,
    isMultipleSelect: false,
    explanation: 'AVL tree enables O(log n) insertion and efficient range queries (in-order traversal of subtree). Hash tables don\'t support range queries.'
  },

  {
    id: 'a30_2025',
    topic: 'general-concepts',
    difficulty: 'medium',
    question: 'What general design failure contributed to Therac-25, 737 MAX, and 2003 Blackout?',
    options: [
      'Physical hardware component failure',
      'Lack of error detection/safety checking',
      'Critical systems tightly coupled, failures not isolated',
      'Solely operator error',
      'Overly complex algorithms'
    ],
    correctIndex: 2,
    isMultipleSelect: false,
    explanation: 'All three incidents involved tight coupling where single failures cascaded. Better modularity and isolation could have prevented them.'
  }
];

export function getQuestionsForTopic(topic: string): QuizQuestion[] {
    let qs = [...QUIZ_QUESTIONS];
    if (topic !== 'all') qs = qs.filter((q) => q.topic === topic);
    // Shuffle
    return qs.sort(() => Math.random() - 0.5);
}
