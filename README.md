# AlgoLens

**An interactive Data Structures and Algorithms visualizer for first-year university students.**

AlgoLens is a browser-based educational tool that combines step-by-step algorithm visualization, a live code editor with syntax highlighting, structured quizzes, and a comprehensive reference sheet — all within a single, self-contained application. It is designed to bridge the gap between abstract algorithmic concepts and practical, visual understanding.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Supported Data Structures and Algorithms](#supported-data-structures-and-algorithms)
- [Application Sections](#application-sections)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

AlgoLens was built with one goal: to make the study of data structures and algorithms more intuitive. Rather than tracing through pseudocode on paper or watching static diagrams, students can interact directly with algorithms — controlling playback speed, stepping through individual operations, editing the underlying code, and testing their knowledge through built-in quizzes.

The application targets the standard curriculum of a first-year university Computer Science course and covers sorting, searching, trees, graphs, hash tables, linear structures, and introductory dynamic programming.

---

## Features

- **Interactive visualizer** with play, pause, step-forward, step-back, and reset controls
- **Adjustable playback speed** from slow walkthrough to rapid execution
- **Custom input support** — enter your own values or generate a random dataset
- **Step-by-step plain-English explanations** synchronized with each animation frame
- **Live code editor** with syntax highlighting and line-level execution tracking
- **Multi-language code display** — JavaScript, Python, Java, and C++
- **Editable code** with a "Run My Code" mode to update the visualizer from custom implementations
- **Quiz mode** with multiple-choice concept questions and trace-based challenges
- **Complexity reference sheet** with best, average, and worst-case time and space complexity for all algorithms
- **Keyboard navigation** for hands-free control during lectures or study sessions
- **SVG-based rendering** for crisp, scalable node and edge display at any zoom level
- **Export** the current visualizer state as an SVG file
- **Persistent preferences** via localStorage (selected algorithm, playback speed)

---

## Supported Data Structures and Algorithms

### Sorting

| Algorithm | Category |
|---|---|
| Bubble Sort | Comparison |
| Selection Sort | Comparison |
| Insertion Sort | Comparison |
| Merge Sort | Divide and Conquer |
| Quick Sort | Divide and Conquer |
| Heap Sort | Comparison |
| Counting Sort | Non-Comparison |
| Radix Sort | Non-Comparison |

### Searching

| Algorithm | Notes |
|---|---|
| Linear Search | Unsorted arrays |
| Binary Search | Sorted arrays |
| Jump Search | Sorted arrays |
| Interpolation Search | Uniformly distributed sorted arrays |

### Trees

| Structure / Operation | Notes |
|---|---|
| Binary Search Tree | Insert, delete, search |
| AVL Tree | LL, RR, LR, RL rotations with labeled before/after states |
| Min-Heap and Max-Heap | Heapify animation |

### Graphs

| Algorithm | Notes |
|---|---|
| Breadth-First Search | Frontier queue displayed live |
| Depth-First Search | Call stack displayed live |
| Dijkstra's Algorithm | Distance table updated in real time |
| Bellman-Ford | Negative edge support |
| Prim's MST | Growing MST edges highlighted |
| Kruskal's MST | Union-Find visualization |
| Topological Sort | Directed acyclic graph |
| Cycle Detection | Directed and undirected variants |

### Hash Tables

| Feature | Notes |
|---|---|
| Separate Chaining | Linked list per bucket |
| Open Addressing | Linear probing |
| Configurable table size | 8 to 32 buckets |
| Live hash function display | Formula and computed index shown as key is typed |
| Collision visualization | Shake and highlight effect |

### Linear Structures

| Structure | Supported Operations |
|---|---|
| Array | Access, insert, delete, resize |
| Stack | Push, pop |
| Queue | Enqueue, dequeue |
| Singly Linked List | Insert, delete, reverse, traverse |
| Doubly Linked List | Insert, delete, traverse |
| Circular Linked List | Insert, traverse |

### Dynamic Programming

| Problem | Visualization |
|---|---|
| Fibonacci | Memoization table filling |
| Longest Common Subsequence | 2D DP grid filled cell by cell |
| 0/1 Knapsack | DP table construction |

---

## Application Sections

### Visualizer

The primary section. Select a data structure or algorithm from the dropdown menus, provide custom input or randomize, then control execution using the playback toolbar. Time and space complexity badges are displayed alongside each selection. A step description panel on the right side narrates each operation in plain English.

### Code Lab

A split-pane view with a syntax-highlighted, editable code editor on the left and a synchronized visualizer on the right. The currently executing line is highlighted in real time as the animation plays. Students can modify the code and click "Run My Code" to update the visualization accordingly. A language selector allows switching between JavaScript, Python, Java, and C++.

### Quiz Mode

Two sub-modes are available:

**Concept Quiz** — Multiple-choice questions covering time and space complexity, algorithm behavior, edge cases, output tracing, and data structure selection. Questions are organized by topic and difficulty (Intro, Standard, Challenge). Immediate feedback is provided after each answer, including an explanation of the correct response. A summary card is shown at the end of each session.

**Trace Quiz** — Students are shown a mid-execution visualizer state and asked to predict the next step, a resulting value, or the affected node. The animation then plays to confirm or correct the response.

### Reference Sheet

A searchable complexity table listing best, average, and worst-case time and space complexity for every covered algorithm. Includes a properties column indicating whether each algorithm is stable, in-place, or recursive. A "When to Use" guide helps students reason about algorithm selection. A print-friendly stylesheet is applied when using the browser's print function.

---

## Getting Started

AlgoLens is a single-file React application. No build step or package installation is required for basic use.

### Option 1: Open Directly in Browser

Download `AlgoLens.jsx` and open it in any modern browser that supports ES modules. For full functionality, serve it via a local HTTP server to avoid CORS restrictions on font loading.

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js
npx serve .
```

Then navigate to `http://localhost:8080`.

### Option 2: Embed in a React Project

Copy `AlgoLens.jsx` into your project's component directory and import it as a standard React component.

```jsx
import AlgoLens from './components/AlgoLens';

function App() {
  return <AlgoLens />;
}
```

---

## Usage

1. Open the application and allow fonts to load (approximately one second on a standard connection).
2. Select a category from the first dropdown (e.g., "Trees").
3. Select a specific algorithm or structure from the second dropdown (e.g., "AVL Tree").
4. Enter comma-separated values in the input field, or click "Randomize" to generate a dataset.
5. Use the playback controls to run, pause, or step through the visualization.
6. Read the step descriptions on the right to follow the algorithm's logic.
7. Switch to "Code Lab" to inspect the implementation and experiment with edits.
8. Use "Quiz Mode" to test your understanding of the selected topic.

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Play / Pause |
| `Arrow Right` | Step forward one frame |
| `Arrow Left` | Step backward one frame |
| `R` | Reset to initial state |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | React (hooks-based, no class components) |
| Rendering | SVG (all tree and graph structures) |
| Animation | `requestAnimationFrame` / `setInterval` |
| Syntax highlighting | highlight.js via CDN |
| Fonts | JetBrains Mono, Syne, DM Sans (Google Fonts) |
| State persistence | localStorage |
| Build requirement | None (single-file, CDN-loaded dependencies) |

All algorithm logic is implemented in plain JavaScript with no external algorithm libraries.

---

## Project Structure

```
AlgoLens/
├── AlgoLens.jsx          # Complete application (single file)
├── README.md             # This file
└── LICENSE               # License information
```

Because the application is intentionally self-contained, all styles, components, and logic reside in `AlgoLens.jsx`. This makes it straightforward to deploy, share, or embed without dependency management.

---

## Contributing

Contributions are welcome. If you would like to add a new algorithm, fix a visualization bug, or improve quiz content, please follow the steps below.

1. Fork this repository.
2. Create a feature branch: `git checkout -b feature/algorithm-name`
3. Implement your changes and verify that existing visualizations are unaffected.
4. Submit a pull request with a clear description of what was added or changed.

When adding a new algorithm, please include:
- The visualization logic (step generation)
- The corresponding code in all four supported languages
- At least four quiz questions (two Concept, one Trace, one Challenge)
- An entry in the Reference Sheet complexity table

---

## License

This project is released under the MIT License. See `LICENSE` for full terms.

---

*AlgoLens is intended as a learning aid and is not affiliated with any university or academic institution.*
