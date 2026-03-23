import type { AlgoStep, ArrayBar, NodeState } from './types';

// ── Utility helpers ──────────────────────────────────────────────────────────

function makeBars(arr: number[]): ArrayBar[] {
    return arr.map((v, i) => ({ value: v, state: 'default' as NodeState, index: i }));
}

function setBars(bars: ArrayBar[], states: Record<number, NodeState>): ArrayBar[] {
    return bars.map((b) => ({ ...b, state: states[b.index] ?? b.state }));
}

function allBars(bars: ArrayBar[], state: NodeState): ArrayBar[] {
    return bars.map((b) => ({ ...b, state }));
}

function snap(bars: ArrayBar[], desc: string, extra: Partial<AlgoStep> = {}): AlgoStep {
    return { bars: bars.map((b) => ({ ...b })), description: desc, ...extra };
}

// ── BUBBLE SORT ──────────────────────────────────────────────────────────────

export function bubbleSortSteps(input: number[]): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const arr = [...input];
    const n = arr.length;
    let bars = makeBars(arr);

    steps.push(snap(bars, 'Starting Bubble Sort — comparing adjacent pairs and swapping if out of order.', { highlightLines: [1] }));

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            bars = setBars(bars, { [j]: 'comparing', [j + 1]: 'comparing' });
            steps.push(snap(bars, `Comparing ${arr[j]} and ${arr[j + 1]}.`, { highlightLines: [4] }));

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                bars = makeBars(arr);
                bars = setBars(bars, { [j]: 'swapped', [j + 1]: 'swapped' });
                steps.push(snap(bars, `${arr[j + 1]} > ${arr[j]} — swapping them.`, { highlightLines: [5, 6] }));
                swapped = true;
            }

            bars = setBars(bars, { [j]: 'default', [j + 1]: 'default' });
            // Mark sorted tail
            for (let k = n - i - 1; k < n; k++) bars[k].state = 'sorted';
        }
        bars[n - 1 - i].state = 'sorted';
        if (!swapped) {
            steps.push(snap(allBars(bars, 'sorted'), 'No swaps this pass — array is already sorted!', { highlightLines: [9] }));
            return steps;
        }
    }
    steps.push(snap(allBars(makeBars(arr), 'sorted'), 'Bubble Sort complete — array is fully sorted.'));
    return steps;
}

// ── SELECTION SORT ───────────────────────────────────────────────────────────

export function selectionSortSteps(input: number[]): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const arr = [...input];
    const n = arr.length;
    let bars = makeBars(arr);

    steps.push(snap(bars, 'Starting Selection Sort — find the minimum in each pass.', { highlightLines: [1] }));

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        bars = setBars(bars, { [i]: 'comparing' });
        steps.push(snap(bars, `Pass ${i + 1}: assuming index ${i} (value ${arr[i]}) is the minimum.`, { highlightLines: [3] }));

        for (let j = i + 1; j < n; j++) {
            bars = setBars(bars, { [j]: 'visiting' });
            steps.push(snap(bars, `Comparing ${arr[j]} with current minimum ${arr[minIdx]}.`, { highlightLines: [5] }));
            if (arr[j] < arr[minIdx]) {
                bars = setBars(bars, { [minIdx]: 'default' });
                minIdx = j;
                bars = setBars(bars, { [j]: 'comparing' });
                steps.push(snap(bars, `Found new minimum: ${arr[minIdx]} at index ${minIdx}.`, { highlightLines: [6] }));
            } else {
                bars = setBars(bars, { [j]: 'default' });
            }
        }

        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            bars = makeBars(arr);
            bars = setBars(bars, { [i]: 'swapped', [minIdx]: 'swapped' });
            for (let k = 0; k < i; k++) bars[k].state = 'sorted';
            steps.push(snap(bars, `Swapping minimum ${arr[i]} into position ${i}.`, { highlightLines: [9] }));
        }

        bars = makeBars(arr);
        for (let k = 0; k <= i; k++) bars[k].state = 'sorted';
        steps.push(snap(bars, `Position ${i} is now sorted with value ${arr[i]}.`, { highlightLines: [11] }));
    }

    steps.push(snap(allBars(makeBars(arr), 'sorted'), 'Selection Sort complete!'));
    return steps;
}

// ── INSERTION SORT ───────────────────────────────────────────────────────────

export function insertionSortSteps(input: number[]): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const arr = [...input];
    const n = arr.length;
    let bars = makeBars(arr);
    bars[0].state = 'sorted';
    steps.push(snap(bars, 'Starting Insertion Sort — left portion is the sorted sub-array.', { highlightLines: [1] }));

    for (let i = 1; i < n; i++) {
        const key = arr[i];
        bars = makeBars(arr);
        for (let k = 0; k < i; k++) bars[k].state = 'sorted';
        bars[i].state = 'comparing';
        steps.push(snap(bars, `Picking key = ${key} to insert into sorted portion.`, { highlightLines: [3] }));

        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            bars = makeBars(arr);
            for (let k = 0; k < i; k++) bars[k].state = 'sorted';
            bars[j].state = 'visiting';
            bars[j + 1].state = 'swapped';
            steps.push(snap(bars, `${arr[j]} > ${key} — shifting ${arr[j]} right.`, { highlightLines: [5, 6] }));
            j--;
        }
        arr[j + 1] = key;
        bars = makeBars(arr);
        for (let k = 0; k <= i; k++) bars[k].state = 'sorted';
        steps.push(snap(bars, `Inserted ${key} at position ${j + 1}.`, { highlightLines: [8] }));
    }

    steps.push(snap(allBars(makeBars(arr), 'sorted'), 'Insertion Sort complete!'));
    return steps;
}

// ── MERGE SORT ───────────────────────────────────────────────────────────────

export function mergeSortSteps(input: number[]): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const arr = [...input];

    function merge(arr: number[], left: number, mid: number, right: number) {
        const L = arr.slice(left, mid + 1);
        const R = arr.slice(mid + 1, right + 1);
        let i = 0, j = 0, k = left;
        while (i < L.length && j < R.length) {
            const bars = makeBars(arr);
            bars[k].state = 'visiting';
            steps.push(snap(bars, `Merging: comparing L[${i}]=${L[i]} and R[${j}]=${R[j]}.`, { highlightLines: [6] }));
            if (L[i] <= R[j]) {
                arr[k] = L[i++];
            } else {
                arr[k] = R[j++];
            }
            const bars2 = makeBars(arr);
            bars2[k].state = 'swapped';
            steps.push(snap(bars2, `Placed ${arr[k]} at index ${k}.`, { highlightLines: [8] }));
            k++;
        }
        while (i < L.length) { arr[k++] = L[i++]; }
        while (j < R.length) { arr[k++] = R[j++]; }
        const sorted = makeBars(arr);
        for (let x = left; x <= right; x++) sorted[x].state = 'sorted';
        steps.push(snap(sorted, `Merged sub-array [${left}..${right}].`, { highlightLines: [11] }));
    }

    function mergeSort(arr: number[], left: number, right: number) {
        if (left >= right) return;
        const mid = Math.floor((left + right) / 2);
        const bars = makeBars(arr);
        bars[left].state = 'visiting'; bars[right].state = 'visiting';
        steps.push(snap(bars, `Dividing [${left}..${right}] at mid=${mid}.`, { highlightLines: [1] }));
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }

    steps.push(snap(makeBars(arr), 'Starting Merge Sort — divide and conquer.', { highlightLines: [1] }));
    mergeSort(arr, 0, arr.length - 1);
    steps.push(snap(allBars(makeBars(arr), 'sorted'), 'Merge Sort complete!'));
    return steps;
}

// ── QUICK SORT ───────────────────────────────────────────────────────────────

export function quickSortSteps(input: number[]): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const arr = [...input];

    function partition(arr: number[], low: number, high: number): number {
        const pivot = arr[high];
        let i = low - 1;
        const bars = makeBars(arr);
        bars[high].state = 'pivot';
        steps.push(snap(bars, `Pivot chosen: ${pivot} at index ${high}.`, { highlightLines: [2] }));

        for (let j = low; j < high; j++) {
            const b = makeBars(arr);
            b[high].state = 'pivot'; b[j].state = 'comparing';
            steps.push(snap(b, `Comparing ${arr[j]} with pivot ${pivot}.`, { highlightLines: [4] }));
            if (arr[j] <= pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                const b2 = makeBars(arr);
                b2[high].state = 'pivot'; b2[i].state = 'swapped'; b2[j].state = 'swapped';
                steps.push(snap(b2, `${arr[i]} ≤ pivot — swapping indices ${i} and ${j}.`, { highlightLines: [5, 6] }));
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        const b3 = makeBars(arr);
        b3[i + 1].state = 'sorted';
        steps.push(snap(b3, `Pivot ${arr[i + 1]} placed at its final position ${i + 1}.`, { highlightLines: [9] }));
        return i + 1;
    }

    function quickSort(arr: number[], low: number, high: number) {
        if (low < high) {
            const pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    steps.push(snap(makeBars(arr), 'Starting Quick Sort — pick pivot, partition, recurse.', { highlightLines: [1] }));
    quickSort(arr, 0, arr.length - 1);
    steps.push(snap(allBars(makeBars(arr), 'sorted'), 'Quick Sort complete!'));
    return steps;
}

// ── HEAP SORT ────────────────────────────────────────────────────────────────

export function heapSortSteps(input: number[]): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const arr = [...input];
    const n = arr.length;

    function heapify(arr: number[], n: number, i: number) {
        let largest = i;
        const l = 2 * i + 1, r = 2 * i + 2;
        if (l < n && arr[l] > arr[largest]) largest = l;
        if (r < n && arr[r] > arr[largest]) largest = r;
        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            const b = makeBars(arr);
            b[i].state = 'swapped'; b[largest].state = 'swapped';
            steps.push(snap(b, `Heapify: swapping ${arr[i]} and ${arr[largest]} to maintain max-heap.`, { highlightLines: [5] }));
            heapify(arr, n, largest);
        }
    }

    steps.push(snap(makeBars(arr), 'Starting Heap Sort — build max-heap first.', { highlightLines: [1] }));
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);

    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        const b = makeBars(arr);
        b[0].state = 'swapped'; b[i].state = 'sorted';
        steps.push(snap(b, `Moved max ${arr[i]} to sorted position ${i}.`, { highlightLines: [8] }));
        heapify(arr, i, 0);
    }
    steps.push(snap(allBars(makeBars(arr), 'sorted'), 'Heap Sort complete!'));
    return steps;
}

// ── COUNTING SORT ────────────────────────────────────────────────────────────

export function countingSortSteps(input: number[]): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const arr = [...input];
    const max = Math.max(...arr);
    const count = new Array(max + 1).fill(0);

    steps.push(snap(makeBars(arr), `Counting Sort: max value = ${max}, creating count array of size ${max + 1}.`, { highlightLines: [1] }));

    for (let i = 0; i < arr.length; i++) {
        count[arr[i]]++;
        const b = makeBars(arr);
        b[i].state = 'visiting';
        steps.push(snap(b, `Counted ${arr[i]}: count[${arr[i]}] = ${count[arr[i]]}.`, { highlightLines: [3] }));
    }

    let idx = 0;
    const result: number[] = [];
    for (let i = 0; i <= max; i++) {
        while (count[i]-- > 0) {
            result.push(i);
            const b = makeBars(result.concat(arr.slice(result.length)));
            b[result.length - 1].state = 'sorted';
            steps.push(snap(b, `Placing ${i} at output position ${result.length - 1}.`, { highlightLines: [7] }));
            idx++;
        }
    }

    steps.push(snap(allBars(makeBars(result), 'sorted'), 'Counting Sort complete!'));
    return steps;
}

// ── RADIX SORT ───────────────────────────────────────────────────────────────

export function radixSortSteps(input: number[]): AlgoStep[] {
    const steps: AlgoStep[] = [];
    let arr = [...input];

    function countingSortByDigit(arr: number[], exp: number): number[] {
        const output = new Array(arr.length).fill(0);
        const count = new Array(10).fill(0);
        for (let i = 0; i < arr.length; i++) count[Math.floor(arr[i] / exp) % 10]++;
        for (let i = 1; i < 10; i++) count[i] += count[i - 1];
        for (let i = arr.length - 1; i >= 0; i--) {
            output[--count[Math.floor(arr[i] / exp) % 10]] = arr[i];
        }
        return output;
    }

    const max = Math.max(...arr);
    steps.push(snap(makeBars(arr), 'Radix Sort: sorting digit by digit, starting from ones place.', { highlightLines: [1] }));

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        arr = countingSortByDigit(arr, exp);
        const b = makeBars(arr);
        b.forEach((bar) => (bar.state = 'visiting'));
        steps.push(snap(b, `Sorted by ${exp === 1 ? 'ones' : exp === 10 ? 'tens' : 'hundreds'} digit.`, { highlightLines: [6] }));
    }
    steps.push(snap(allBars(makeBars(arr), 'sorted'), 'Radix Sort complete!'));
    return steps;
}

// ── LINEAR SEARCH ────────────────────────────────────────────────────────────

export function linearSearchSteps(input: number[]): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const arr = [...input];
    const target = arr[Math.floor(arr.length / 2)]; // search for middle value
    const bars = makeBars(arr);
    steps.push(snap(bars, `Linear Search: looking for ${target}.`, { highlightLines: [1] }));

    for (let i = 0; i < arr.length; i++) {
        const b = makeBars(arr);
        b[i].state = 'visiting';
        for (let k = 0; k < i; k++) b[k].state = 'visited';
        steps.push(snap(b, `Checking index ${i}: value = ${arr[i]}${arr[i] === target ? ' ✓ FOUND!' : ' ✗'}.`, { highlightLines: [3] }));
        if (arr[i] === target) {
            const b2 = makeBars(arr);
            b2[i].state = 'found';
            for (let k = 0; k < i; k++) b2[k].state = 'visited';
            steps.push(snap(b2, `Found ${target} at index ${i}!`, { highlightLines: [4] }));
            return steps;
        }
    }
    steps.push(snap(allBars(makeBars(arr), 'visited'), `${target} not found in array.`));
    return steps;
}

// ── BINARY SEARCH ────────────────────────────────────────────────────────────

export function binarySearchSteps(input: number[]): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const arr = [...input].sort((a, b) => a - b);
    const target = arr[Math.floor(arr.length / 2)];
    let low = 0, high = arr.length - 1;
    let bars = makeBars(arr);
    bars[Math.floor(arr.length / 2)].state = 'comparing';
    steps.push(snap(makeBars(arr), `Binary Search on sorted array: looking for ${target}.`, { highlightLines: [1] }));

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const b = makeBars(arr);
        b[mid].state = 'visiting';
        if (low >= 0) for (let k = 0; k < low; k++) b[k].state = 'visited';
        if (high < arr.length - 1) for (let k = high + 1; k < arr.length; k++) b[k].state = 'visited';
        steps.push(snap(b, `low=${low}, high=${high}, mid=${mid}: checking ${arr[mid]}.`, { highlightLines: [3] }));

        if (arr[mid] === target) {
            const b2 = makeBars(arr);
            b2[mid].state = 'found';
            steps.push(snap(b2, `Found ${target} at index ${mid}!`, { highlightLines: [4] }));
            return steps;
        } else if (arr[mid] < target) {
            low = mid + 1;
            steps.push(snap(b, `${arr[mid]} < ${target} — search right half.`, { highlightLines: [6] }));
        } else {
            high = mid - 1;
            steps.push(snap(b, `${arr[mid]} > ${target} — search left half.`, { highlightLines: [8] }));
        }
    }
    steps.push(snap(allBars(makeBars(arr), 'visited'), `${target} not found.`));
    return steps;
}

// ── JUMP SEARCH ──────────────────────────────────────────────────────────────

export function jumpSearchSteps(input: number[]): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const arr = [...input].sort((a, b) => a - b);
    const target = arr[Math.floor(arr.length * 0.6)];
    const step = Math.floor(Math.sqrt(arr.length));
    let prev = 0;
    steps.push(snap(makeBars(arr), `Jump Search: target=${target}, jump step=√${arr.length}≈${step}.`, { highlightLines: [1] }));

    let curr = step;
    while (curr < arr.length && arr[Math.min(curr, arr.length - 1)] < target) {
        const b = makeBars(arr);
        for (let k = prev; k <= Math.min(curr, arr.length - 1); k++) b[k].state = 'visiting';
        steps.push(snap(b, `Jumped to index ${curr}: ${arr[Math.min(curr, arr.length - 1)]} < ${target}, continue.`, { highlightLines: [3] }));
        prev = curr;
        curr += step;
    }

    for (let i = prev; i <= Math.min(curr, arr.length - 1); i++) {
        const b = makeBars(arr);
        b[i].state = 'comparing';
        steps.push(snap(b, `Linear scan: checking index ${i} = ${arr[i]}.`, { highlightLines: [7] }));
        if (arr[i] === target) {
            const b2 = makeBars(arr);
            b2[i].state = 'found';
            steps.push(snap(b2, `Found ${target} at index ${i}!`, { highlightLines: [8] }));
            return steps;
        }
    }
    steps.push(snap(allBars(makeBars(arr), 'visited'), `${target} not found.`));
    return steps;
}

// ── FIBONACCI DP ─────────────────────────────────────────────────────────────

export function fibonacciDPSteps(): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const n = 10;
    const memo: number[] = new Array(n + 1).fill(-1);

    function makeGrid(): import('./types').DPCell[][] {
        const row = Array.from({ length: n + 1 }, (_, i) => ({
            row: 0, col: i,
            value: memo[i] === -1 ? '' : memo[i],
            state: (memo[i] === -1 ? 'default' : 'visited') as NodeState,
        }));
        return [row];
    }

    steps.push({ description: `Computing Fibonacci(0..${n}) with memoization.`, dpGrid: makeGrid() });

    for (let i = 0; i <= n; i++) {
        if (i <= 1) { memo[i] = i; }
        else { memo[i] = memo[i - 1] + memo[i - 2]; }
        const grid = makeGrid();
        grid[0][i].state = 'visiting';
        steps.push({ description: `fib(${i}) = ${i <= 1 ? i : `fib(${i - 1})+fib(${i - 2})`} = ${memo[i]}`, dpGrid: grid });
    }

    return steps;
}

// ── LCS DP ───────────────────────────────────────────────────────────────────

export function lcsDPSteps(): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const s1 = 'ABCBDAB';
    const s2 = 'BDCABA';
    const m = s1.length, n = s2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    function makeGrid(highlightR?: number, highlightC?: number): import('./types').DPCell[][] {
        return Array.from({ length: m + 1 }, (_, r) =>
            Array.from({ length: n + 1 }, (_, c) => ({
                row: r, col: c, value: dp[r][c],
                state: (r === highlightR && c === highlightC ? 'visiting' : dp[r][c] > 0 ? 'visited' : 'default') as NodeState,
            }))
        );
    }

    steps.push({ description: `LCS of "${s1}" and "${s2}" — filling DP table.`, dpGrid: makeGrid(), dpInfo: { s1, s2 } });

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                steps.push({ description: `s1[${i - 1}]='${s1[i - 1]}' == s2[${j - 1}]='${s2[j - 1]}' → dp[${i}][${j}] = dp[${i - 1}][${j - 1}]+1 = ${dp[i][j]}`, dpGrid: makeGrid(i, j), dpInfo: { s1, s2 } });
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                steps.push({ description: `Characters differ → dp[${i}][${j}] = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}`, dpGrid: makeGrid(i, j), dpInfo: { s1, s2 } });
            }
        }
    }

    const grid = makeGrid();
    grid[m][n].state = 'found';
    steps.push({ description: `LCS length = ${dp[m][n]}. Traceback gives the actual subsequence.`, dpGrid: grid, dpInfo: { s1, s2 } });
    return steps;
}

// ── KNAPSACK DP ───────────────────────────────────────────────────────────────

export function knapsackDPSteps(): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const weights = [2, 3, 4, 5];
    const values = [3, 4, 5, 6];
    const W = 8;
    const n = weights.length;
    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

    function makeGrid(hr?: number, hc?: number): import('./types').DPCell[][] {
        return Array.from({ length: n + 1 }, (_, r) =>
            Array.from({ length: W + 1 }, (_, c) => ({
                row: r, col: c, value: dp[r][c],
                state: (r === hr && c === hc ? 'visiting' : dp[r][c] > 0 ? 'visited' : 'default') as NodeState,
            }))
        );
    }

    steps.push({ description: `0/1 Knapsack: weights=[${weights}], values=[${values}], capacity=${W}.`, dpGrid: makeGrid(), dpInfo: { W } });

    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= W; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
                steps.push({ description: `Item ${i}(w=${weights[i - 1]},v=${values[i - 1]}): include=${values[i - 1] + dp[i - 1][w - weights[i - 1]]}, exclude=${dp[i - 1][w]} → take max=${dp[i][w]}`, dpGrid: makeGrid(i, w), dpInfo: { W } });
            } else {
                dp[i][w] = dp[i - 1][w];
                steps.push({ description: `Item ${i} too heavy for capacity ${w} — skip.`, dpGrid: makeGrid(i, w), dpInfo: { W } });
            }
        }
    }

    const grid = makeGrid();
    grid[n][W].state = 'found';
    steps.push({ description: `Max value = ${dp[n][W]} with capacity ${W}.`, dpGrid: grid, dpInfo: { W } });
    return steps;
}
