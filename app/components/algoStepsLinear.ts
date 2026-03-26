'use client';

import type { AlgoStep, NodeState, HashBucket } from './types';

// STACK STEPS

export function stackSteps(values: number[]): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const stack: { value: string | number; state: NodeState }[] = [];

    steps.push({ stackItems: [], description: 'Stack initialized — empty. Operations: push adds to top, pop removes from top.', highlightLines: [1] });

    for (const v of values) {
        stack.push({ value: v, state: 'visiting' });
        steps.push({ stackItems: [...stack], description: `Push ${v} — placed on top of stack.`, highlightLines: [3] });
        stack.at(-1)!.state = 'default';
    }

    for (let i = 0; i < Math.min(3, values.length); i++) {
        const top = stack.at(-1)!;
        top.state = 'visiting';
        steps.push({ stackItems: [...stack], description: `Pop — removing ${top.value} from top.`, highlightLines: [7] });
        stack.pop();
        steps.push({ stackItems: [...stack], description: `Popped ${top.value}. Stack now has ${stack.length} items.`, highlightLines: [8] });
    }

    return steps;
}

// QUEUE STEPS

export function queueSteps(values: number[]): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const queue: { value: string | number; state: NodeState }[] = [];

    steps.push({ queueItems: [], description: 'Queue initialized — FIFO: enqueue at rear, dequeue at front.', highlightLines: [1] });

    for (const v of values) {
        queue.push({ value: v, state: 'visiting' });
        steps.push({ queueItems: [...queue], description: `Enqueue ${v} — added to rear of queue.`, highlightLines: [3] });
        queue.at(-1)!.state = 'default';
    }

    for (let i = 0; i < Math.min(3, values.length); i++) {
        queue[0].state = 'visiting';
        const front = queue[0].value;
        steps.push({ queueItems: [...queue], description: `Dequeue — removing ${front} from front.`, highlightLines: [7] });
        queue.shift();
        steps.push({ queueItems: [...queue], description: `Dequeued ${front}. Queue has ${queue.length} items remaining.`, highlightLines: [8] });
    }

    return steps;
}

// LINKED LIST STEPS

export function linkedListSteps(type: 'singly' | 'doubly' | 'circular', values: number[]): AlgoStep[] {
    const steps: AlgoStep[] = [];

    interface LLItem { value: string | number; state: NodeState; next?: boolean; prev?: boolean; }
    const list: LLItem[] = [];

    steps.push({ listItems: [], description: `${type === 'singly' ? 'Singly' : type === 'doubly' ? 'Doubly' : 'Circular'} Linked List — inserting nodes.` });

    for (const v of values) {
        const newNode: LLItem = { value: v, state: 'visiting', next: true, prev: type === 'doubly' };
        list.push(newNode);
        steps.push({ listItems: list.map((n) => ({ ...n })), description: `Inserted ${v} at tail. List length: ${list.length}.` });
        list.at(-1)!.state = 'default';
    }

    // Traverse
    for (let i = 0; i < list.length; i++) {
        list[i].state = 'visiting';
        steps.push({ listItems: list.map((n) => ({ ...n })), description: `Traversing: visiting node ${i + 1} with value ${list[i].value}.` });
        list[i].state = 'visited';
    }

    // Reverse
    list.reverse();
    list.forEach((n) => (n.state = 'sorted'));
    steps.push({ listItems: list.map((n) => ({ ...n })), description: `List reversed! New order: ${list.map((n) => n.value).join(' → ')}` });

    return steps;
}

// ARRAY STEPS

export function arraySteps(values: number[]): AlgoStep[] {
    const steps: AlgoStep[] = [];
    let arr = [...values];

    function makeItems(arr: number[], states: Record<number, NodeState> = {}): { value: string | number; state: NodeState }[] {
        return arr.map((v, i) => ({ value: v, state: states[i] ?? 'default' }));
    }

    steps.push({ listItems: makeItems(arr), description: `Array of ${arr.length} elements. Access by index is O(1).` });

    // Access
    const accessIdx = 2;
    steps.push({ listItems: makeItems(arr, { [accessIdx]: 'visiting' }), description: `Accessing arr[${accessIdx}] = ${arr[accessIdx]}. Direct O(1) access.` });

    // Insert at beginning
    arr = [99, ...arr];
    steps.push({ listItems: makeItems(arr, { 0: 'visiting' }), description: `Inserted 99 at index 0 — shifted all ${arr.length - 1} elements right. O(n) time.` });
    arr[0] = 99;

    // Delete at index 1
    const deleted = arr[1];
    arr.splice(1, 1);
    steps.push({ listItems: makeItems(arr, { 0: 'swapped' }), description: `Deleted ${deleted} from index 1 — shifted elements left. O(n) time.` });

    // Resize concept
    steps.push({ listItems: [...makeItems(arr), { value: '...', state: 'visiting' }, { value: '...', state: 'default' }, { value: '...', state: 'default' }], description: `Array resize: when full, allocate 2× space and copy. Amortized O(1) push.` });

    return steps;
}

// HASH TABLE STEPS

export function hashTableSteps(mode: 'chaining' | 'linear'): AlgoStep[] {
    const steps: AlgoStep[] = [];
    const SIZE = 8;
    const buckets: HashBucket[] = Array.from({ length: SIZE }, (_, i) => ({ index: i, entries: [], state: 'default' }));

    function hashFn(key: string): number {
        let h = 0;
        for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % SIZE;
        return h;
    }

    const keys = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig'];

    steps.push({
        hashBuckets: JSON.parse(JSON.stringify(buckets)),
        description: `Hash table with ${SIZE} buckets. Using ${mode === 'chaining' ? 'chaining (linked list per bucket)' : 'linear probing (open addressing)'}.`,
        hashFormula: `h(key) = (Σ char_code × 31^i) mod ${SIZE}`,
    });

    for (const key of keys) {
        let idx = hashFn(key);
        buckets[idx].state = 'visiting';
        steps.push({
            hashBuckets: JSON.parse(JSON.stringify(buckets)),
            description: `Inserting "${key}": hash("${key}") = ${idx}.`,
            hashFormula: `h("${key}") = ${[...key].map((c) => c.charCodeAt(0)).join(' + ')} mod ${SIZE} = ${idx}`,
        });

        if (mode === 'chaining') {
            const collision = buckets[idx].entries.length > 0;
            if (collision) {
                buckets[idx].state = 'swapped'; // shake effect
                steps.push({
                    hashBuckets: JSON.parse(JSON.stringify(buckets)),
                    description: `Collision at bucket ${idx}! "${key}" chained to existing entry using linked list.`,
                    hashFormula: `h("${key}") = ${idx} (collision — chaining)`,
                });
            }
            buckets[idx].entries.push({ key, value: key.toUpperCase(), state: 'visiting' });
            buckets[idx].state = 'visited';
            steps.push({
                hashBuckets: JSON.parse(JSON.stringify(buckets)),
                description: `"${key}" stored in bucket ${idx}${collision ? ' (chained)' : ''}.`,
                hashFormula: `h("${key}") = ${idx}`,
            });
            buckets[idx].entries.at(-1)!.state = 'default';
            buckets[idx].state = 'default';
        } else {
            // Linear probing
            let probe = idx;
            let collisionCount = 0;
            while (buckets[probe].entries.length > 0) {
                collisionCount++;
                buckets[probe].state = 'swapped';
                steps.push({
                    hashBuckets: JSON.parse(JSON.stringify(buckets)),
                    description: `Collision at bucket ${probe}! Linear probing to next slot...`,
                    hashFormula: `probe(${collisionCount}) = (${idx} + ${collisionCount}) mod ${SIZE} = ${(idx + collisionCount) % SIZE}`,
                });
                buckets[probe].state = 'default';
                probe = (probe + 1) % SIZE;
            }
            buckets[probe].entries.push({ key, value: key.toUpperCase(), state: 'visiting' });
            buckets[probe].state = 'visited';
            steps.push({
                hashBuckets: JSON.parse(JSON.stringify(buckets)),
                description: `"${key}" placed at bucket ${probe} after ${collisionCount} probes.`,
                hashFormula: `final slot = ${probe}`,
            });
            buckets[probe].entries.at(-1)!.state = 'default';
            buckets[probe].state = 'default';
        }
    }

    steps.push({ hashBuckets: JSON.parse(JSON.stringify(buckets)), description: 'Hash table insertion complete!', hashFormula: `h(key) = (Σ char_code × 31^i) mod ${SIZE}` });
    return steps;
}
