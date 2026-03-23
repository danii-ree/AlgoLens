import type { AlgoStep, GraphNode, GraphEdge, NodeState, TreeNode } from './types';

// ── BST STEPS ────────────────────────────────────────────────────────────────

interface BSTState {
    nodes: Record<string, TreeNode>;
    root: string | null;
    nextId: number;
}

function layoutTree(nodes: Record<string, TreeNode>, root: string | null) {
    function assign(id: string | null, depth: number, left: number, right: number) {
        if (!id) return;
        const node = nodes[id];
        node.x = (left + right) / 2;
        node.y = 60 + depth * 80;
        assign(node.left, depth + 1, left, (left + right) / 2);
        assign(node.right, depth + 1, (left + right) / 2, right);
    }
    assign(root, 0, 0, 800);
}

export function bstInsertSteps(values: number[]): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const state: BSTState = { nodes: {}, root: null, nextId: 0 };

    function insertNode(val: number) {
        const id = `n${state.nextId++}`;
        state.nodes[id] = { id, value: val, left: null, right: null, state: 'default', x: 400, y: 60 };

        if (!state.root) {
            state.root = id;
            layoutTree(state.nodes, state.root);
            steps.push({ treeNodes: JSON.parse(JSON.stringify(state.nodes)), treeRoot: state.root, description: `Inserted ${val} as root.`, highlightLines: [3] });
            return;
        }

        let cur = state.root;
        while (cur) {
            const node = state.nodes[cur];
            node.state = 'visiting';
            layoutTree(state.nodes, state.root);
            steps.push({ treeNodes: JSON.parse(JSON.stringify(state.nodes)), treeRoot: state.root, description: `Comparing ${val} with ${node.value}.`, highlightLines: [6] });
            node.state = 'default';

            if (val < node.value) {
                if (!node.left) {
                    node.left = id;
                    state.nodes[id].state = 'visiting';
                    layoutTree(state.nodes, state.root);
                    steps.push({ treeNodes: JSON.parse(JSON.stringify(state.nodes)), treeRoot: state.root, description: `${val} < ${node.value} — inserted as left child.`, highlightLines: [8] });
                    state.nodes[id].state = 'default';
                    break;
                }
                steps.push({ treeNodes: JSON.parse(JSON.stringify(state.nodes)), treeRoot: state.root, description: `${val} < ${node.value} — go left.`, highlightLines: [7] });
                cur = node.left;
            } else {
                if (!node.right) {
                    node.right = id;
                    state.nodes[id].state = 'visiting';
                    layoutTree(state.nodes, state.root);
                    steps.push({ treeNodes: JSON.parse(JSON.stringify(state.nodes)), treeRoot: state.root, description: `${val} > ${node.value} — inserted as right child.`, highlightLines: [11] });
                    state.nodes[id].state = 'default';
                    break;
                }
                steps.push({ treeNodes: JSON.parse(JSON.stringify(state.nodes)), treeRoot: state.root, description: `${val} ≥ ${node.value} — go right.`, highlightLines: [10] });
                cur = node.right;
            }
        }
    }

    steps.push({ treeNodes: {}, treeRoot: null, description: 'Building BST — inserting values one by one.', highlightLines: [1] });
    for (const v of values) insertNode(v);
    return steps;
}

// ── TREE TRAVERSALS ───────────────────────────────────────────────────────────

export function treeTraversalSteps(type: 'inorder' | 'preorder' | 'postorder' | 'levelorder', values: number[]): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const state: BSTState = { nodes: {}, root: null, nextId: 0 };

    // Build tree first (silent)
    function silentInsert(val: number) {
        const id = `n${state.nextId++}`;
        state.nodes[id] = { id, value: val, left: null, right: null, state: 'default', x: 400, y: 60 };
        if (!state.root) { state.root = id; return; }
        let cur = state.root;
        while (cur) {
            const node = state.nodes[cur];
            if (val < node.value) { if (!node.left) { node.left = id; break; } cur = node.left; }
            else { if (!node.right) { node.right = id; break; } cur = node.right; }
        }
    }
    for (const v of values) silentInsert(v);
    layoutTree(state.nodes, state.root);

    function markAll(s: NodeState) {
        Object.values(state.nodes).forEach((n) => (n.state = s));
    }

    markAll('default');
    steps.push({ treeNodes: JSON.parse(JSON.stringify(state.nodes)), treeRoot: state.root, description: `Starting ${type} traversal.` });

    if (type === 'levelorder') {
        const queue: string[] = state.root ? [state.root] : [];
        while (queue.length) {
            const cur = queue.shift()!;
            state.nodes[cur].state = 'visiting';
            steps.push({ treeNodes: JSON.parse(JSON.stringify(state.nodes)), treeRoot: state.root, description: `Visiting ${state.nodes[cur].value} (level-order).` });
            state.nodes[cur].state = 'visited';
            if (state.nodes[cur].left) queue.push(state.nodes[cur].left!);
            if (state.nodes[cur].right) queue.push(state.nodes[cur].right!);
        }
    } else {
        function traverse(id: string | null) {
            if (!id) return;
            const node = state.nodes[id];
            if (type === 'preorder') {
                node.state = 'visiting';
                steps.push({ treeNodes: JSON.parse(JSON.stringify(state.nodes)), treeRoot: state.root, description: `Pre-order: visiting ${node.value}.` });
                node.state = 'visited';
            }
            traverse(node.left);
            if (type === 'inorder') {
                node.state = 'visiting';
                steps.push({ treeNodes: JSON.parse(JSON.stringify(state.nodes)), treeRoot: state.root, description: `In-order: visiting ${node.value}.` });
                node.state = 'visited';
            }
            traverse(node.right);
            if (type === 'postorder') {
                node.state = 'visiting';
                steps.push({ treeNodes: JSON.parse(JSON.stringify(state.nodes)), treeRoot: state.root, description: `Post-order: visiting ${node.value}.` });
                node.state = 'visited';
            }
        }
        traverse(state.root);
    }
    steps.push({ treeNodes: JSON.parse(JSON.stringify(state.nodes)), treeRoot: state.root, description: `${type} traversal complete — ${Object.keys(state.nodes).length} nodes visited.` });
    return steps;
}

// ── GRAPH HELPERS ─────────────────────────────────────────────────────────────

function makeDefaultGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const nodes: GraphNode[] = [
        { id: 'A', label: 'A', x: 200, y: 150, state: 'default' },
        { id: 'B', label: 'B', x: 350, y: 80, state: 'default' },
        { id: 'C', label: 'C', x: 500, y: 150, state: 'default' },
        { id: 'D', label: 'D', x: 280, y: 260, state: 'default' },
        { id: 'E', label: 'E', x: 420, y: 260, state: 'default' },
        { id: 'F', label: 'F', x: 350, y: 360, state: 'default' },
    ];
    const edges: GraphEdge[] = [
        { from: 'A', to: 'B', weight: 4, state: 'default' },
        { from: 'A', to: 'D', weight: 2, state: 'default' },
        { from: 'B', to: 'C', weight: 3, state: 'default' },
        { from: 'B', to: 'D', weight: 1, state: 'default' },
        { from: 'C', to: 'E', weight: 5, state: 'default' },
        { from: 'D', to: 'E', weight: 8, state: 'default' },
        { from: 'D', to: 'F', weight: 6, state: 'default' },
        { from: 'E', to: 'F', weight: 3, state: 'default' },
    ];
    return { nodes, edges };
}

function cloneGraph(nodes: GraphNode[], edges: GraphEdge[]): { nodes: GraphNode[]; edges: GraphEdge[] } {
    return {
        nodes: nodes.map((n) => ({ ...n })),
        edges: edges.map((e) => ({ ...e })),
    };
}

// ── BFS ──────────────────────────────────────────────────────────────────────

export function bfsSteps(): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const { nodes, edges } = makeDefaultGraph();
    const adj: Record<string, string[]> = {};
    for (const n of nodes) adj[n.id] = [];
    for (const e of edges) { adj[e.from].push(e.to); adj[e.to].push(e.from); }

    const visited = new Set<string>();
    const queue: string[] = ['A'];
    visited.add('A');

    let g = cloneGraph(nodes, edges);
    g.nodes.find((n) => n.id === 'A')!.state = 'visiting';
    steps.push({ ...g, description: 'BFS: starting from node A. Queue: [A].' });

    while (queue.length) {
        const cur = queue.shift()!;
        const gSnap = cloneGraph(nodes, edges);
        gSnap.nodes.find((n) => n.id === cur)!.state = 'visiting';
        visited.forEach((v) => { if (v !== cur) gSnap.nodes.find((n) => n.id === v)!.state = 'visited'; });
        steps.push({ graphNodes: gSnap.nodes, graphEdges: gSnap.edges, description: `Processing vertex ${cur}. Queue: [${queue.join(', ')}]` });

        nodes.find((n) => n.id === cur)!.state = 'visited';

        for (const nb of adj[cur]) {
            if (!visited.has(nb)) {
                visited.add(nb);
                queue.push(nb);
                nodes.find((n) => n.id === nb)!.state = 'visiting';
                const e = edges.find((e) => (e.from === cur && e.to === nb) || (e.to === cur && e.from === nb));
                if (e) e.state = 'mst';
                const g2 = cloneGraph(nodes, edges);
                steps.push({ graphNodes: g2.nodes, graphEdges: g2.edges, description: `Found unvisited neighbor ${nb} — adding to queue. Queue: [${queue.join(', ')}]` });
            }
        }
    }

    const gFinal = cloneGraph(nodes, edges);
    steps.push({ graphNodes: gFinal.nodes, graphEdges: gFinal.edges, description: 'BFS complete — all reachable nodes visited.' });
    return steps;
}

// ── DFS ──────────────────────────────────────────────────────────────────────

export function dfsSteps(): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const { nodes, edges } = makeDefaultGraph();
    const adj: Record<string, string[]> = {};
    for (const n of nodes) adj[n.id] = [];
    for (const e of edges) { adj[e.from].push(e.to); adj[e.to].push(e.from); }

    const visited = new Set<string>();

    function dfs(cur: string, stack: string[]) {
        visited.add(cur);
        nodes.find((n) => n.id === cur)!.state = 'visiting';
        const g = cloneGraph(nodes, edges);
        steps.push({ graphNodes: g.nodes, graphEdges: g.edges, description: `DFS: visiting ${cur}. Stack: [${stack.join(', ')}]` });

        for (const nb of adj[cur]) {
            if (!visited.has(nb)) {
                const e = edges.find((e) => (e.from === cur && e.to === nb) || (e.to === cur && e.from === nb));
                if (e) e.state = 'mst';
                dfs(nb, [...stack, nb]);
            }
        }
        nodes.find((n) => n.id === cur)!.state = 'visited';
    }

    steps.push({ graphNodes: cloneGraph(nodes, edges).nodes, graphEdges: cloneGraph(nodes, edges).edges, description: 'DFS: starting from node A.' });
    dfs('A', ['A']);
    steps.push({ graphNodes: cloneGraph(nodes, edges).nodes, graphEdges: cloneGraph(nodes, edges).edges, description: 'DFS complete — all reachable nodes visited.' });
    return steps;
}

// ── DIJKSTRA ─────────────────────────────────────────────────────────────────

export function dijkstraSteps(): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const { nodes, edges } = makeDefaultGraph();
    const nodeIds = nodes.map((n) => n.id);
    const dist: Record<string, number> = {};
    const prev: Record<string, string | null> = {};
    const visited = new Set<string>();

    for (const id of nodeIds) { dist[id] = Infinity; prev[id] = null; }
    dist['A'] = 0;

    function getAdj(id: string): { to: string; w: number; edge: GraphEdge }[] {
        return edges
            .filter((e) => e.from === id || e.to === id)
            .map((e) => ({ to: e.from === id ? e.to : e.from, w: e.weight ?? 1, edge: e }));
    }

    steps.push({ graphNodes: cloneGraph(nodes, edges).nodes, graphEdges: cloneGraph(nodes, edges).edges, description: `Dijkstra from A: dist=[${nodeIds.map((id) => `${id}:${dist[id] === Infinity ? '∞' : dist[id]}`).join(', ')}]`, graphInfo: Object.fromEntries(nodeIds.map((id) => [id, dist[id] === Infinity ? '∞' : dist[id]])) });

    while (visited.size < nodeIds.length) {
        const u = nodeIds.filter((id) => !visited.has(id)).reduce((a, b) => dist[a] < dist[b] ? a : b, nodeIds.filter((id) => !visited.has(id))[0]);
        if (dist[u] === Infinity) break;

        visited.add(u);
        nodes.find((n) => n.id === u)!.state = 'visiting';
        const g = cloneGraph(nodes, edges);
        steps.push({ graphNodes: g.nodes, graphEdges: g.edges, description: `Visiting ${u} (dist=${dist[u]}) — nearest unvisited.`, graphInfo: Object.fromEntries(nodeIds.map((id) => [id, dist[id] === Infinity ? '∞' : dist[id]])) });
        nodes.find((n) => n.id === u)!.state = 'visited';

        for (const { to, w, edge } of getAdj(u)) {
            if (!visited.has(to) && dist[u] + w < dist[to]) {
                dist[to] = dist[u] + w;
                prev[to] = u;
                edge.state = 'mst';
                const g2 = cloneGraph(nodes, edges);
                steps.push({ graphNodes: g2.nodes, graphEdges: g2.edges, description: `Relaxing edge ${u}→${to}: dist[${to}] updated to ${dist[to]}.`, graphInfo: Object.fromEntries(nodeIds.map((id) => [id, dist[id] === Infinity ? '∞' : dist[id]])) });
            }
        }
    }

    // Highlight shortest path
    const g2 = cloneGraph(nodes, edges);
    g2.nodes.forEach((n) => (n.state = 'visited'));
    steps.push({ graphNodes: g2.nodes, graphEdges: g2.edges, description: `Dijkstra complete. Final distances: ${nodeIds.map((id) => `${id}=${dist[id]}`).join(', ')}.`, graphInfo: Object.fromEntries(nodeIds.map((id) => [id, dist[id]])) });
    return steps;
}

// ── PRIM'S MST ───────────────────────────────────────────────────────────────

export function primSteps(): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const { nodes, edges } = makeDefaultGraph();
    const inMST = new Set<string>(['A']);
    nodes.find((n) => n.id === 'A')!.state = 'visiting';
    steps.push({ graphNodes: cloneGraph(nodes, edges).nodes, graphEdges: cloneGraph(nodes, edges).edges, description: "Prim's MST: start with node A." });

    while (inMST.size < nodes.length) {
        let best: GraphEdge | null = null;
        for (const e of edges) {
            const fIn = inMST.has(e.from), tIn = inMST.has(e.to);
            if ((fIn && !tIn) || (!fIn && tIn)) {
                if (!best || (e.weight ?? 1) < (best.weight ?? 1)) best = e;
            }
        }
        if (!best) break;
        const newNode = inMST.has(best.from) ? best.to : best.from;
        inMST.add(newNode);
        best.state = 'mst';
        nodes.find((n) => n.id === newNode)!.state = 'mst';
        const g = cloneGraph(nodes, edges);
        steps.push({ graphNodes: g.nodes, graphEdges: g.edges, description: `Added edge ${best.from}-${best.to} (w=${best.weight}) — cheapest crossing edge.` });
    }

    steps.push({ graphNodes: cloneGraph(nodes, edges).nodes, graphEdges: cloneGraph(nodes, edges).edges, description: "Prim's MST complete — all nodes in tree." });
    return steps;
}

// ── KRUSKAL'S MST ────────────────────────────────────────────────────────────

export function kruskalSteps(): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const { nodes, edges } = makeDefaultGraph();
    const sorted = [...edges].sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));
    const parent: Record<string, string> = {};
    for (const n of nodes) parent[n.id] = n.id;

    function find(x: string): string {
        return parent[x] === x ? x : (parent[x] = find(parent[x]));
    }

    steps.push({ graphNodes: cloneGraph(nodes, edges).nodes, graphEdges: cloneGraph(nodes, edges).edges, description: `Kruskal's: sorted edges by weight: ${sorted.map((e) => `${e.from}-${e.to}(${e.weight})`).join(', ')}` });

    for (const e of sorted) {
        const ru = find(e.from), rv = find(e.to);
        if (ru !== rv) {
            parent[ru] = rv;
            e.state = 'mst';
            nodes.find((n) => n.id === e.from)!.state = 'mst';
            nodes.find((n) => n.id === e.to)!.state = 'mst';
            const g = cloneGraph(nodes, edges);
            steps.push({ graphNodes: g.nodes, graphEdges: g.edges, description: `Adding edge ${e.from}-${e.to} (w=${e.weight}) — no cycle created.` });
        } else {
            const g = cloneGraph(nodes, edges);
            steps.push({ graphNodes: g.nodes, graphEdges: g.edges, description: `Skipping ${e.from}-${e.to} (w=${e.weight}) — would create a cycle.` });
        }
    }

    steps.push({ graphNodes: cloneGraph(nodes, edges).nodes, graphEdges: cloneGraph(nodes, edges).edges, description: "Kruskal's MST complete!" });
    return steps;
}

// ── TOPOLOGICAL SORT ─────────────────────────────────────────────────────────

export function topoSortSteps(): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const nodes: GraphNode[] = [
        { id: 'A', label: 'A', x: 100, y: 200, state: 'default' },
        { id: 'B', label: 'B', x: 250, y: 100, state: 'default' },
        { id: 'C', label: 'C', x: 250, y: 300, state: 'default' },
        { id: 'D', label: 'D', x: 400, y: 200, state: 'default' },
        { id: 'E', label: 'E', x: 550, y: 200, state: 'default' },
    ];
    const edges: GraphEdge[] = [
        { from: 'A', to: 'B', state: 'default', directed: true },
        { from: 'A', to: 'C', state: 'default', directed: true },
        { from: 'B', to: 'D', state: 'default', directed: true },
        { from: 'C', to: 'D', state: 'default', directed: true },
        { from: 'D', to: 'E', state: 'default', directed: true },
    ];
    const adj: Record<string, string[]> = {};
    const inDeg: Record<string, number> = {};
    for (const n of nodes) { adj[n.id] = []; inDeg[n.id] = 0; }
    for (const e of edges) { adj[e.from].push(e.to); inDeg[e.to]++; }

    const queue = nodes.filter((n) => inDeg[n.id] === 0).map((n) => n.id);
    const order: string[] = [];

    steps.push({ graphNodes: cloneGraph(nodes, edges).nodes, graphEdges: cloneGraph(nodes, edges).edges, description: `Topological Sort (Kahn's algo): nodes with in-degree 0: [${queue.join(', ')}]` });

    while (queue.length) {
        const cur = queue.shift()!;
        order.push(cur);
        nodes.find((n) => n.id === cur)!.state = 'visited';
        const g = cloneGraph(nodes, edges);
        steps.push({ graphNodes: g.nodes, graphEdges: g.edges, description: `Processing ${cur}. Order so far: [${order.join(' → ')}]` });

        for (const nb of adj[cur]) {
            inDeg[nb]--;
            if (inDeg[nb] === 0) {
                queue.push(nb);
                nodes.find((n) => n.id === nb)!.state = 'visiting';
            }
        }
    }

    const gFinal = cloneGraph(nodes, edges);
    steps.push({ graphNodes: gFinal.nodes, graphEdges: gFinal.edges, description: `Topological order: ${order.join(' → ')}` });
    return steps;
}

// ── BELLMAN-FORD ──────────────────────────────────────────────────────────────

export function bellmanFordSteps(): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const { nodes, edges } = makeDefaultGraph();
    const nodeIds = nodes.map((n) => n.id);
    const dist: Record<string, number> = {};
    for (const id of nodeIds) dist[id] = Infinity;
    dist['A'] = 0;

    steps.push({ graphNodes: cloneGraph(nodes, edges).nodes, graphEdges: cloneGraph(nodes, edges).edges, description: 'Bellman-Ford: initialize all distances to ∞ except source A=0.', graphInfo: Object.fromEntries(nodeIds.map((id) => [id, dist[id] === Infinity ? '∞' : dist[id]])) });

    for (let i = 0; i < nodeIds.length - 1; i++) {
        for (const e of edges) {
            const w = e.weight ?? 1;
            const tryRelax = (u: string, v: string) => {
                if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    const g = cloneGraph(nodes, edges);
                    g.nodes.find((n) => n.id === v)!.state = 'visiting';
                    steps.push({ graphNodes: g.nodes, graphEdges: g.edges, description: `Relaxing ${u}→${v}: dist[${v}] = ${dist[v]}.`, graphInfo: Object.fromEntries(nodeIds.map((id) => [id, dist[id] === Infinity ? '∞' : dist[id]])) });
                }
            };
            tryRelax(e.from, e.to);
            tryRelax(e.to, e.from);
        }
    }

    const gFinal = cloneGraph(nodes, edges);
    gFinal.nodes.forEach((n) => (n.state = 'visited'));
    steps.push({ graphNodes: gFinal.nodes, graphEdges: gFinal.edges, description: `Bellman-Ford complete. Distances: ${nodeIds.map((id) => `${id}=${dist[id]}`).join(', ')}.`, graphInfo: Object.fromEntries(nodeIds.map((id) => [id, dist[id]])) });
    return steps;
}
