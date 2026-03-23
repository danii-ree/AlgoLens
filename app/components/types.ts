// Shared types for AlgoLens

export type AlgoCategory =
    | 'sorting'
    | 'searching'
    | 'trees'
    | 'graphs'
    | 'hash'
    | 'linear'
    | 'dp';

export type NavSection = 'visualizer' | 'codelab' | 'quiz' | 'reference';

export type NodeState =
    | 'default'
    | 'visiting'
    | 'visited'
    | 'swapped'
    | 'sorted'
    | 'comparing'
    | 'pivot'
    | 'found'
    | 'mst'
    | 'path';

export interface ArrayBar {
    value: number;
    state: NodeState;
    index: number;
}

export interface TreeNode {
    id: string;
    value: number;
    left: string | null;
    right: string | null;
    state: NodeState;
    x: number;
    y: number;
    height?: number; // for AVL
    balanceFactor?: number;
}

export interface GraphNode {
    id: string;
    label: string;
    x: number;
    y: number;
    state: NodeState;
}

export interface GraphEdge {
    from: string;
    to: string;
    weight?: number;
    state: NodeState;
    directed?: boolean;
}

export interface HashBucket {
    index: number;
    entries: { key: string; value: string; state: NodeState }[];
    state: NodeState;
}

export interface DPCell {
    row: number;
    col: number;
    value: number | string;
    state: NodeState;
}

export interface AlgoStep {
    description: string;
    highlightLines?: number[];
    // Arrays
    bars?: ArrayBar[];
    // Trees
    treeNodes?: Record<string, TreeNode>;
    treeRoot?: string | null;
    // Graphs
    graphNodes?: GraphNode[];
    graphEdges?: GraphEdge[];
    graphInfo?: Record<string, string | number>;
    // Hash
    hashBuckets?: HashBucket[];
    hashFormula?: string;
    // DP
    dpGrid?: DPCell[][];
    dpInfo?: Record<string, string | number>;
    // Stack/Queue/LL
    listItems?: { value: string | number; state: NodeState; next?: boolean; prev?: boolean }[];
    stackItems?: { value: string | number; state: NodeState }[];
    queueItems?: { value: string | number; state: NodeState }[];
}

export interface Algorithm {
    id: string;
    name: string;
    category: AlgoCategory;
    timeComplexity: { best: string; avg: string; worst: string };
    spaceComplexity: string;
    stable?: boolean;
    inPlace?: boolean;
    recursive?: boolean;
    description: string;
    generateSteps: (input: number[] | string) => AlgoStep[];
    defaultCode: Record<string, string>;
}

export interface QuizQuestion {
    id: string;
    topic: string;
    difficulty: 'intro' | 'standard' | 'challenge';
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export interface TraceQuiz {
    id: string;
    topic: string;
    difficulty: 'intro' | 'standard' | 'challenge';
    prompt: string;
    setupStep: AlgoStep;
    answer: string;
    answerOptions: string[];
    correctIndex: number;
    explanation: string;
}
