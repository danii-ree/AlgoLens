'use client';
import {
    bubbleSortSteps, selectionSortSteps, insertionSortSteps,
    mergeSortSteps, quickSortSteps, heapSortSteps,
    countingSortSteps, radixSortSteps,
    linearSearchSteps, binarySearchSteps, jumpSearchSteps,
    fibonacciDPSteps, lcsDPSteps, knapsackDPSteps,
} from './algoSteps';
import {
    bstInsertSteps, treeTraversalSteps,
    bfsSteps, dfsSteps, dijkstraSteps, primSteps, kruskalSteps,
    topoSortSteps, bellmanFordSteps,
} from './algoStepsGraph';
import { stackSteps, queueSteps, linkedListSteps, arraySteps, hashTableSteps } from './algoStepsLinear';
import type { Algorithm, AlgoCategory } from './types';

const DEFAULT_ARR = [38, 27, 43, 3, 9, 82, 10];

const JS_CODES: Record<string, Record<string, string>> = {
    'bubble-sort': {
        javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // Early exit
  }
  return arr;
}`,
        python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
        java: `void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
        cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    },
    'merge-sort': {
        javascript: `function mergeSort(arr, left, right) {
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);
  mergeSort(arr, left, mid);
  mergeSort(arr, mid + 1, right);
  merge(arr, left, mid, right);
}

function merge(arr, left, mid, right) {
  const L = arr.slice(left, mid + 1);
  const R = arr.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;
  while (i < L.length && j < R.length)
    arr[k++] = L[i] <= R[j] ? L[i++] : R[j++];
  while (i < L.length) arr[k++] = L[i++];
  while (j < R.length) arr[k++] = R[j++];
}`,
        python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]`,
        java: `void mergeSort(int[] arr, int l, int r) {
    if (l >= r) return;
    int mid = (l + r) / 2;
    mergeSort(arr, l, mid);
    mergeSort(arr, mid + 1, r);
    merge(arr, l, mid, r);
}`,
        cpp: `void mergeSort(vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int mid = (l + r) / 2;
    mergeSort(arr, l, mid);
    mergeSort(arr, mid + 1, r);
    merge(arr, l, mid, r);
}`,
    },
    'quick-sort': {
        javascript: `function quickSort(arr, low, high) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
        python: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1`,
        java: `void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
        cpp: `void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    },
    'binary-search': {
        javascript: `function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1; // Not found
}`,
        python: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
        java: `int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
        cpp: `int binarySearch(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
    },
};

function getCode(id: string, lang: string): string {
    return JS_CODES[id]?.[lang] ?? JS_CODES[id]?.['javascript'] ?? `// ${id} — ${lang} implementation`;
}

export const ALGORITHMS: Algorithm[] = [
    // ── SORTING ──
    {
        id: 'bubble-sort', name: 'Bubble Sort', category: 'sorting',
        timeComplexity: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)' }, spaceComplexity: 'O(1)',
        stable: true, inPlace: true, recursive: false,
        description: 'Repeatedly compares and swaps adjacent elements. Simple but slow for large datasets.',
        generateSteps: (input) => bubbleSortSteps(input as number[]),
        defaultCode: { javascript: getCode('bubble-sort', 'javascript'), python: getCode('bubble-sort', 'python'), java: getCode('bubble-sort', 'java'), cpp: getCode('bubble-sort', 'cpp') },
    },
    {
        id: 'selection-sort', name: 'Selection Sort', category: 'sorting',
        timeComplexity: { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)' }, spaceComplexity: 'O(1)',
        stable: false, inPlace: true, recursive: false,
        description: 'Finds the minimum and places it at the front each pass.',
        generateSteps: (input) => selectionSortSteps(input as number[]),
        defaultCode: { javascript: `function selectionSort(arr) {\n  const n = arr.length;\n  for (let i = 0; i < n - 1; i++) {\n    let minIdx = i;\n    for (let j = i + 1; j < n; j++)\n      if (arr[j] < arr[minIdx]) minIdx = j;\n    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];\n  }\n  return arr;\n}`, python: `def selection_sort(arr):\n    for i in range(len(arr) - 1):\n        min_idx = i\n        for j in range(i + 1, len(arr)):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr`, java: `// Java`, cpp: `// C++` },
    },
    {
        id: 'insertion-sort', name: 'Insertion Sort', category: 'sorting',
        timeComplexity: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)' }, spaceComplexity: 'O(1)',
        stable: true, inPlace: true, recursive: false,
        description: 'Builds a sorted sub-array by inserting each element into its correct position.',
        generateSteps: (input) => insertionSortSteps(input as number[]),
        defaultCode: { javascript: `function insertionSort(arr) {\n  for (let i = 1; i < arr.length; i++) {\n    const key = arr[i];\n    let j = i - 1;\n    while (j >= 0 && arr[j] > key) { arr[j + 1] = arr[j]; j--; }\n    arr[j + 1] = key;\n  }\n  return arr;\n}`, python: `def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and arr[j] > key:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key`, java: `// Java`, cpp: `// C++` },
    },
    {
        id: 'merge-sort', name: 'Merge Sort', category: 'sorting',
        timeComplexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)' }, spaceComplexity: 'O(n)',
        stable: true, inPlace: false, recursive: true,
        description: 'Divide & conquer: split, sort each half, merge. Guaranteed O(n log n).',
        generateSteps: (input) => mergeSortSteps(input as number[]),
        defaultCode: { javascript: getCode('merge-sort', 'javascript'), python: getCode('merge-sort', 'python'), java: getCode('merge-sort', 'java'), cpp: getCode('merge-sort', 'cpp') },
    },
    {
        id: 'quick-sort', name: 'Quick Sort', category: 'sorting',
        timeComplexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)' }, spaceComplexity: 'O(log n)',
        stable: false, inPlace: true, recursive: true,
        description: 'Pick a pivot, partition around it, recurse. Fastest in practice on average.',
        generateSteps: (input) => quickSortSteps(input as number[]),
        defaultCode: { javascript: getCode('quick-sort', 'javascript'), python: getCode('quick-sort', 'python'), java: getCode('quick-sort', 'java'), cpp: getCode('quick-sort', 'cpp') },
    },
    {
        id: 'heap-sort', name: 'Heap Sort', category: 'sorting',
        timeComplexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)' }, spaceComplexity: 'O(1)',
        stable: false, inPlace: true, recursive: false,
        description: 'Build a max-heap, extract maximums one by one.',
        generateSteps: (input) => heapSortSteps(input as number[]),
        defaultCode: { javascript: `function heapSort(arr) {\n  const n = arr.length;\n  for (let i = Math.floor(n/2)-1; i >= 0; i--) heapify(arr, n, i);\n  for (let i = n-1; i > 0; i--) {\n    [arr[0], arr[i]] = [arr[i], arr[0]];\n    heapify(arr, i, 0);\n  }\n}`, python: `# See algoSteps.ts`, java: `// Java`, cpp: `// C++` },
    },
    {
        id: 'counting-sort', name: 'Counting Sort', category: 'sorting',
        timeComplexity: { best: 'O(n+k)', avg: 'O(n+k)', worst: 'O(n+k)' }, spaceComplexity: 'O(k)',
        stable: true, inPlace: false, recursive: false,
        description: 'Count occurrences of each value, then reconstruct. Works only with integers in bounded range.',
        generateSteps: (input) => countingSortSteps(input as number[]),
        defaultCode: { javascript: `function countingSort(arr) {\n  const max = Math.max(...arr);\n  const count = new Array(max + 1).fill(0);\n  arr.forEach(v => count[v]++);\n  let i = 0;\n  count.forEach((c, v) => { while (c--) arr[i++] = v; });\n}`, python: `# See algoSteps.ts`, java: `// Java`, cpp: `// C++` },
    },
    {
        id: 'radix-sort', name: 'Radix Sort', category: 'sorting',
        timeComplexity: { best: 'O(nk)', avg: 'O(nk)', worst: 'O(nk)' }, spaceComplexity: 'O(n+k)',
        stable: true, inPlace: false, recursive: false,
        description: 'Sort digit by digit from least to most significant using counting sort.',
        generateSteps: (input) => radixSortSteps(input as number[]),
        defaultCode: { javascript: `// Sort by each digit position using counting sort as subroutine`, python: `# See algoSteps.ts`, java: `// Java`, cpp: `// C++` },
    },

    // ── SEARCHING ──
    {
        id: 'linear-search', name: 'Linear Search', category: 'searching',
        timeComplexity: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)' }, spaceComplexity: 'O(1)',
        description: 'Check each element one by one until target found.',
        generateSteps: (input) => linearSearchSteps(input as number[]),
        defaultCode: { javascript: `function linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++)\n    if (arr[i] === target) return i;\n  return -1;\n}`, python: `def linear_search(arr, target):\n    for i, v in enumerate(arr):\n        if v == target: return i\n    return -1`, java: `// Java`, cpp: `// C++` },
    },
    {
        id: 'binary-search', name: 'Binary Search', category: 'searching',
        timeComplexity: { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)' }, spaceComplexity: 'O(1)',
        description: 'Halve the search space each step on a sorted array.',
        generateSteps: (input) => binarySearchSteps(input as number[]),
        defaultCode: { javascript: getCode('binary-search', 'javascript'), python: getCode('binary-search', 'python'), java: getCode('binary-search', 'java'), cpp: getCode('binary-search', 'cpp') },
    },
    {
        id: 'jump-search', name: 'Jump Search', category: 'searching',
        timeComplexity: { best: 'O(1)', avg: 'O(√n)', worst: 'O(√n)' }, spaceComplexity: 'O(1)',
        description: 'Jump √n steps ahead, then linear scan back. Between linear and binary search.',
        generateSteps: (input) => jumpSearchSteps(input as number[]),
        defaultCode: { javascript: `function jumpSearch(arr, target) {\n  const step = Math.floor(Math.sqrt(arr.length));\n  let prev = 0, curr = step;\n  while (arr[Math.min(curr, arr.length-1)] < target)\n    { prev = curr; curr += step; }\n  for (let i = prev; i <= curr && i < arr.length; i++)\n    if (arr[i] === target) return i;\n  return -1;\n}`, python: `# See algoSteps.ts`, java: `// Java`, cpp: `// C++` },
    },
    {
        id: 'interpolation-search', name: 'Interpolation Search', category: 'searching',
        timeComplexity: { best: 'O(1)', avg: 'O(log log n)', worst: 'O(n)' }, spaceComplexity: 'O(1)',
        description: 'Like binary search but probes based on value distribution.',
        generateSteps: (input) => binarySearchSteps(input as number[]), // approximation
        defaultCode: { javascript: `function interpolationSearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {\n    const pos = lo + Math.floor((hi - lo) * (target - arr[lo]) / (arr[hi] - arr[lo]));\n    if (arr[pos] === target) return pos;\n    if (arr[pos] < target) lo = pos + 1;\n    else hi = pos - 1;\n  }\n  return -1;\n}`, python: `# Similar to binary search with proportional probe`, java: `// Java`, cpp: `// C++` },
    },

    // ── TREES ──
    {
        id: 'bst', name: 'BST Insert', category: 'trees',
        timeComplexity: { best: 'O(log n)', avg: 'O(log n)', worst: 'O(n)' }, spaceComplexity: 'O(n)',
        recursive: true,
        description: 'Binary Search Tree: each node\'s left subtree contains smaller values, right contains larger.',
        generateSteps: () => bstInsertSteps([50, 30, 70, 20, 40, 60, 80]),
        defaultCode: { javascript: `function insert(root, val) {\n  if (!root) return { val, left: null, right: null };\n  if (val < root.val) root.left = insert(root.left, val);\n  else root.right = insert(root.right, val);\n  return root;\n}`, python: `def insert(root, val):\n    if not root: return TreeNode(val)\n    if val < root.val: root.left = insert(root.left, val)\n    else: root.right = insert(root.right, val)\n    return root`, java: `// Java`, cpp: `// C++` },
    },
    {
        id: 'inorder', name: 'In-Order Traversal', category: 'trees',
        timeComplexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)' }, spaceComplexity: 'O(h)',
        recursive: true,
        description: 'Left → Root → Right. Visits nodes in sorted order for a BST.',
        generateSteps: () => treeTraversalSteps('inorder', [50, 30, 70, 20, 40, 60, 80]),
        defaultCode: { javascript: `function inorder(node, result = []) {\n  if (!node) return result;\n  inorder(node.left, result);\n  result.push(node.val);\n  inorder(node.right, result);\n  return result;\n}`, python: `def inorder(node, result=[]):\n    if node:\n        inorder(node.left, result)\n        result.append(node.val)\n        inorder(node.right, result)\n    return result`, java: `// Java`, cpp: `// C++` },
    },
    {
        id: 'preorder', name: 'Pre-Order Traversal', category: 'trees',
        timeComplexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)' }, spaceComplexity: 'O(h)',
        recursive: true,
        description: 'Root → Left → Right. Useful for copying or serializing a tree.',
        generateSteps: () => treeTraversalSteps('preorder', [50, 30, 70, 20, 40, 60, 80]),
        defaultCode: { javascript: `function preorder(node, result = []) {\n  if (!node) return result;\n  result.push(node.val);\n  preorder(node.left, result);\n  preorder(node.right, result);\n  return result;\n}`, python: `def preorder(node, result=[]):\n    if node:\n        result.append(node.val)\n        preorder(node.left, result)\n        preorder(node.right, result)\n    return result`, java: `// Java`, cpp: `// C++` },
    },
    {
        id: 'postorder', name: 'Post-Order Traversal', category: 'trees',
        timeComplexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)' }, spaceComplexity: 'O(h)',
        recursive: true,
        description: 'Left → Right → Root. Useful for deleting a tree or evaluating expression trees.',
        generateSteps: () => treeTraversalSteps('postorder', [50, 30, 70, 20, 40, 60, 80]),
        defaultCode: { javascript: `function postorder(node, result = []) {\n  if (!node) return result;\n  postorder(node.left, result);\n  postorder(node.right, result);\n  result.push(node.val);\n  return result;\n}`, python: `# Similar to preorder, Push root last`, java: `// Java`, cpp: `// C++` },
    },
    {
        id: 'levelorder', name: 'Level-Order (BFS)', category: 'trees',
        timeComplexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)' }, spaceComplexity: 'O(w)',
        description: 'Visit all nodes level by level using a queue.',
        generateSteps: () => treeTraversalSteps('levelorder', [50, 30, 70, 20, 40, 60, 80]),
        defaultCode: { javascript: `function levelOrder(root) {\n  if (!root) return [];\n  const queue = [root], result = [];\n  while (queue.length) {\n    const node = queue.shift();\n    result.push(node.val);\n    if (node.left) queue.push(node.left);\n    if (node.right) queue.push(node.right);\n  }\n  return result;\n}`, python: `from collections import deque\ndef level_order(root):\n    queue = deque([root])\n    while queue:\n        node = queue.popleft()\n        print(node.val)\n        if node.left: queue.append(node.left)\n        if node.right: queue.append(node.right)`, java: `// Java`, cpp: `// C++` },
    },

    // ── GRAPHS ──
    {
        id: 'bfs', name: 'BFS', category: 'graphs',
        timeComplexity: { best: 'O(V+E)', avg: 'O(V+E)', worst: 'O(V+E)' }, spaceComplexity: 'O(V)',
        description: 'Breadth-First Search: explore all neighbors before going deeper.',
        generateSteps: () => bfsSteps(),
        defaultCode: { javascript: `function bfs(graph, start) {\n  const visited = new Set([start]);\n  const queue = [start];\n  while (queue.length) {\n    const v = queue.shift();\n    for (const nb of graph[v])\n      if (!visited.has(nb)) { visited.add(nb); queue.push(nb); }\n  }\n}`, python: `from collections import deque\ndef bfs(graph, start):\n    visited = {start}\n    queue = deque([start])\n    while queue:\n        v = queue.popleft()\n        for nb in graph[v]:\n            if nb not in visited:\n                visited.add(nb)\n                queue.append(nb)`, java: `// Java`, cpp: `// C++` },
    },
    {
        id: 'dfs', name: 'DFS', category: 'graphs',
        timeComplexity: { best: 'O(V+E)', avg: 'O(V+E)', worst: 'O(V+E)' }, spaceComplexity: 'O(V)',
        recursive: true,
        description: 'Depth-First Search: explore as deep as possible before backtracking.',
        generateSteps: () => dfsSteps(),
        defaultCode: { javascript: `function dfs(graph, v, visited = new Set()) {\n  visited.add(v);\n  for (const nb of graph[v])\n    if (!visited.has(nb)) dfs(graph, nb, visited);\n}`, python: `def dfs(graph, v, visited=None):\n    if visited is None: visited = set()\n    visited.add(v)\n    for nb in graph[v]:\n        if nb not in visited:\n            dfs(graph, nb, visited)`, java: `// Java`, cpp: `// C++` },
    },
    {
        id: 'dijkstra', name: "Dijkstra's Shortest Path", category: 'graphs',
        timeComplexity: { best: 'O(E log V)', avg: 'O(E log V)', worst: 'O(V²)' }, spaceComplexity: 'O(V)',
        description: 'Shortest path in weighted graphs with non-negative edges.',
        generateSteps: () => dijkstraSteps(),
        defaultCode: { javascript: `function dijkstra(graph, src) {\n  const dist = {}; // Initialize all to Infinity\n  dist[src] = 0;\n  const pq = [[0, src]];\n  while (pq.length) {\n    const [d, u] = pq.shift().sort();\n    for (const [v, w] of graph[u])\n      if (dist[u] + w < dist[v]) {\n        dist[v] = dist[u] + w;\n        pq.push([dist[v], v]);\n      }\n  }\n  return dist;\n}`, python: `# Use heapq for efficient priority queue`, java: `// Java`, cpp: `// C++` },
    },
    {
        id: 'bellman-ford', name: 'Bellman-Ford', category: 'graphs',
        timeComplexity: { best: 'O(VE)', avg: 'O(VE)', worst: 'O(VE)' }, spaceComplexity: 'O(V)',
        description: 'Shortest path that handles negative edges. Detects negative cycles.',
        generateSteps: () => bellmanFordSteps(),
        defaultCode: { javascript: `function bellmanFord(edges, V, src) {\n  const dist = new Array(V).fill(Infinity);\n  dist[src] = 0;\n  for (let i = 0; i < V - 1; i++)\n    for (const [u, v, w] of edges)\n      if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;\n  return dist;\n}`, python: `def bellman_ford(edges, V, src):\n    dist = [float('inf')] * V\n    dist[src] = 0\n    for _ in range(V - 1):\n        for u, v, w in edges:\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n    return dist`, java: `// Java`, cpp: `// C++` },
    },
    {
        id: 'prims', name: "Prim's MST", category: 'graphs',
        timeComplexity: { best: 'O(E log V)', avg: 'O(E log V)', worst: 'O(V²)' }, spaceComplexity: 'O(V)',
        description: 'Minimum Spanning Tree: greedily add cheapest crossing edge.',
        generateSteps: () => primSteps(),
        defaultCode: { javascript: `// Grow MST by adding cheapest edge crossing the cut`, python: `# Use priority queue for efficient edge selection`, java: `// Java`, cpp: `// C++` },
    },
    {
        id: 'kruskals', name: "Kruskal's MST", category: 'graphs',
        timeComplexity: { best: 'O(E log E)', avg: 'O(E log E)', worst: 'O(E log E)' }, spaceComplexity: 'O(V)',
        description: 'MST by sorting edges and adding non-cycle edges using Union-Find.',
        generateSteps: () => kruskalSteps(),
        defaultCode: { javascript: `// Sort all edges, add if no cycle (using Union-Find)`, python: `# Union-Find for cycle detection`, java: `// Java`, cpp: `// C++` },
    },
    {
        id: 'topo-sort', name: 'Topological Sort', category: 'graphs',
        timeComplexity: { best: 'O(V+E)', avg: 'O(V+E)', worst: 'O(V+E)' }, spaceComplexity: 'O(V)',
        description: 'Linear ordering of vertices in a DAG where u comes before v for every edge u→v.',
        generateSteps: () => topoSortSteps(),
        defaultCode: { javascript: `// Kahn's algorithm: process nodes with in-degree 0`, python: `from collections import deque\ndef topo_sort(graph, in_deg):\n    queue = deque(v for v in graph if in_deg[v] == 0)\n    order = []\n    while queue:\n        v = queue.popleft()\n        order.append(v)\n        for nb in graph[v]:\n            in_deg[nb] -= 1\n            if in_deg[nb] == 0: queue.append(nb)\n    return order`, java: `// Java`, cpp: `// C++` },
    },

    // ── HASH ──
    {
        id: 'hash-chaining', name: 'Hash Table (Chaining)', category: 'hash',
        timeComplexity: { best: 'O(1)', avg: 'O(1)', worst: 'O(n)' }, spaceComplexity: 'O(n+m)',
        description: 'Handle collisions with linked lists per bucket.',
        generateSteps: () => hashTableSteps('chaining'),
        defaultCode: { javascript: `class HashTable {\n  constructor(size = 16) {\n    this.buckets = Array.from({length: size}, () => []);\n  }\n  hash(key) { return [...key].reduce((h, c) => (h*31 + c.charCodeAt(0)) % this.buckets.length, 0); }\n  set(key, val) { this.buckets[this.hash(key)].push([key, val]); }\n  get(key) { return this.buckets[this.hash(key)].find(([k]) => k === key)?.[1]; }\n}`, python: `# Built-in dict uses similar approach`, java: `// Java HashMap`, cpp: `// C++ unordered_map` },
    },
    {
        id: 'hash-linear', name: 'Hash Table (Linear Probing)', category: 'hash',
        timeComplexity: { best: 'O(1)', avg: 'O(1)', worst: 'O(n)' }, spaceComplexity: 'O(m)',
        description: 'Open addressing: probe next slot on collision.',
        generateSteps: () => hashTableSteps('linear'),
        defaultCode: { javascript: `// On collision: probe (h + 1) % size, (h + 2) % size, ...`, python: `# See hash-chaining`, java: `// Java`, cpp: `// C++` },
    },

    // ── LINEAR ──
    {
        id: 'array-ops', name: 'Array Operations', category: 'linear',
        timeComplexity: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)' }, spaceComplexity: 'O(1)',
        description: 'Access O(1), Insert/Delete O(n) due to shifting.',
        generateSteps: (input) => arraySteps(input as number[]),
        defaultCode: { javascript: `const arr = [1, 2, 3];\narr[0];         // O(1) access\narr.unshift(0); // O(n) insert at front\narr.push(4);    // O(1) amortized append\narr.splice(1, 1); // O(n) delete`, python: `arr = [1, 2, 3]\narr[0]        # O(1)\narr.insert(0, 0)  # O(n)\narr.append(4) # O(1)\ndel arr[1]    # O(n)`, java: `// Java`, cpp: `// C++` },
    },
    {
        id: 'stack', name: 'Stack', category: 'linear',
        timeComplexity: { best: 'O(1)', avg: 'O(1)', worst: 'O(1)' }, spaceComplexity: 'O(n)',
        description: 'LIFO: push/pop from top in O(1). Used in DFS, undo, call stack.',
        generateSteps: (input) => stackSteps(input as number[]),
        defaultCode: { javascript: `const stack = [];\nstack.push(1); // push\nstack.push(2);\nconst top = stack.pop(); // pop → 2`, python: `stack = []\nstack.append(1)\nstack.append(2)\ntop = stack.pop()  # → 2`, java: `Deque<Integer> stack = new ArrayDeque<>();\nstack.push(1); stack.push(2);\nint top = stack.pop();`, cpp: `stack<int> s;\ns.push(1); s.push(2);\nint top = s.top(); s.pop();` },
    },
    {
        id: 'queue', name: 'Queue', category: 'linear',
        timeComplexity: { best: 'O(1)', avg: 'O(1)', worst: 'O(1)' }, spaceComplexity: 'O(n)',
        description: 'FIFO: enqueue at rear, dequeue at front in O(1). Used in BFS.',
        generateSteps: (input) => queueSteps(input as number[]),
        defaultCode: { javascript: `const queue = [];\nqueue.push(1);   // enqueue\nqueue.push(2);\nqueue.shift();   // dequeue → 1`, python: `from collections import deque\nq = deque()\nq.append(1); q.append(2)\nq.popleft()  # → 1`, java: `Queue<Integer> q = new LinkedList<>();\nq.offer(1); q.offer(2);\nint front = q.poll();`, cpp: `queue<int> q;\nq.push(1); q.push(2);\nint front = q.front(); q.pop();` },
    },
    {
        id: 'linked-list', name: 'Linked List', category: 'linear',
        timeComplexity: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)' }, spaceComplexity: 'O(n)',
        description: 'Nodes connected by pointers. O(1) insert/delete if pointer known; O(n) traversal.',
        generateSteps: (input) => linkedListSteps('singly', input as number[]),
        defaultCode: { javascript: `class Node { constructor(val) { this.val = val; this.next = null; } }\nclass LinkedList {\n  insert(val) {\n    const node = new Node(val);\n    if (!this.head) { this.head = node; return; }\n    let cur = this.head;\n    while (cur.next) cur = cur.next;\n    cur.next = node;\n  }\n}`, python: `class Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n\nclass LinkedList:\n    def __init__(self): self.head = None\n    def append(self, val):\n        node = Node(val)\n        if not self.head: self.head = node; return\n        cur = self.head\n        while cur.next: cur = cur.next\n        cur.next = node`, java: `// Java LinkedList`, cpp: `// C++ list` },
    },
    {
        id: 'doubly-linked-list', name: 'Doubly Linked List', category: 'linear',
        timeComplexity: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)' }, spaceComplexity: 'O(n)',
        description: 'Each node has both next and prev pointers. O(1) delete if node is known.',
        generateSteps: (input) => linkedListSteps('doubly', input as number[]),
        defaultCode: { javascript: `class DNode { constructor(val) { this.val = val; this.prev = this.next = null; } }`, python: `class DNode:\n    def __init__(self, val):\n        self.val = val\n        self.prev = self.next = None`, java: `// Java`, cpp: `// C++` },
    },

    // ── DP ──
    {
        id: 'fibonacci', name: 'Fibonacci (DP)', category: 'dp',
        timeComplexity: { best: 'O(n)', avg: 'O(n)', worst: 'O(n)' }, spaceComplexity: 'O(n)',
        description: 'Memoized Fibonacci: store computed values to avoid O(2ⁿ) repetition.',
        generateSteps: () => fibonacciDPSteps(),
        defaultCode: { javascript: `const memo = {};\nfunction fib(n) {\n  if (n <= 1) return n;\n  if (memo[n]) return memo[n];\n  return memo[n] = fib(n - 1) + fib(n - 2);\n}`, python: `from functools import lru_cache\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)`, java: `// Java`, cpp: `// C++` },
    },
    {
        id: 'lcs', name: 'Longest Common Subsequence', category: 'dp',
        timeComplexity: { best: 'O(mn)', avg: 'O(mn)', worst: 'O(mn)' }, spaceComplexity: 'O(mn)',
        description: 'Fill a 2D DP table to find the longest common subsequence of two strings.',
        generateSteps: () => lcsDPSteps(),
        defaultCode: { javascript: `function lcs(s1, s2) {\n  const m = s1.length, n = s2.length;\n  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));\n  for (let i = 1; i <= m; i++)\n    for (let j = 1; j <= n; j++)\n      dp[i][j] = s1[i-1] === s2[j-1] ? dp[i-1][j-1]+1 : Math.max(dp[i-1][j], dp[i][j-1]);\n  return dp[m][n];\n}`, python: `def lcs(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0]*(n+1) for _ in range(m+1)]\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            if s1[i-1] == s2[j-1]: dp[i][j] = dp[i-1][j-1]+1\n            else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]`, java: `// Java`, cpp: `// C++` },
    },
    {
        id: 'knapsack', name: '0/1 Knapsack', category: 'dp',
        timeComplexity: { best: 'O(nW)', avg: 'O(nW)', worst: 'O(nW)' }, spaceComplexity: 'O(nW)',
        description: 'Maximize value in a knapsack with weight capacity W.',
        generateSteps: () => knapsackDPSteps(),
        defaultCode: { javascript: `function knapsack(weights, values, W) {\n  const n = weights.length;\n  const dp = Array.from({length: n+1}, () => new Array(W+1).fill(0));\n  for (let i = 1; i <= n; i++)\n    for (let w = 0; w <= W; w++)\n      dp[i][w] = weights[i-1] <= w\n        ? Math.max(dp[i-1][w], values[i-1] + dp[i-1][w-weights[i-1]])\n        : dp[i-1][w];\n  return dp[n][W];\n}`, python: `def knapsack(weights, values, W):\n    n = len(weights)\n    dp = [[0]*(W+1) for _ in range(n+1)]\n    for i in range(1, n+1):\n        for w in range(W+1):\n            if weights[i-1] <= w:\n                dp[i][w] = max(dp[i-1][w], values[i-1]+dp[i-1][w-weights[i-1]])\n            else: dp[i][w] = dp[i-1][w]\n    return dp[n][W]`, java: `// Java`, cpp: `// C++` },
    },
];

export const CATEGORY_LABELS: Record<string, string> = {
    sorting: '⬆ Sorting', searching: '🔍 Searching', trees: '🌲 Trees',
    graphs: '🕸 Graphs', hash: '#️⃣ Hash Tables', linear: '📦 Linear Structures', dp: '🔢 Dynamic Programming',
};

export function getAlgorithm(id: string): Algorithm | undefined {
    return ALGORITHMS.find((a) => a.id === id);
}

export function getAlgorithmsByCategory(cat: string): Algorithm[] {
    return ALGORITHMS.filter((a) => a.category === cat);
}

export function generateInput(algo: Algorithm): number[] {
    return Array.from({ length: 12 }, () => Math.floor(Math.random() * 99) + 1);
}
