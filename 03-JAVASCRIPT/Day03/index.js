// Alright Pankaj — here’s the **whole JavaScript memory management concept** explained with **What/Why/How/When/Where**, plus real mental models and examples.

// ---

// ## 1) What is “memory management” in JavaScript?

// **Memory management** = the process of:

// 1. **Allocating memory** (reserving RAM for values/objects)
// 2. **Using memory** (reading/writing values while program runs)
// 3. **Releasing memory** (freeing RAM when it’s no longer needed)

// In JavaScript, this is mostly **automatic** because of the **Garbage Collector (GC)**.

// ---

// ## 2) Why does JavaScript need memory management?

// Because:

// * Your code creates values continuously: variables, arrays, objects, DOM nodes, closures, etc.
// * RAM is finite.
// * If unused memory isn’t freed, your app becomes:

//   * slow
//   * laggy
//   * eventually crashes (out of memory)

// So JS engines must **clean up** memory safely without you manually calling `free()` like in C/C++.

// ---

// ## 3) Where does JavaScript store data in memory?

// JavaScript engines broadly use two places:

// ### A) Stack (Fast, small, ordered)

// **Where:** Inside the engine’s call stack area.
// **Stores:**

// * primitive values (number, boolean, undefined, null, bigint, symbol)
// * *references* (addresses) to heap objects
// * function call frames (execution context data)

// ### B) Heap (Large, flexible)

// **Where:** In the engine’s heap area.
// **Stores:**

// * objects `{}`
// * arrays `[]`
// * functions (functions are objects)
// * closures’ captured variables
// * complex structures

// **Key rule:**

// * Stack is **quick and structured**
// * Heap is **bigger but requires GC**

// ---

// ## 4) When does data go to Stack vs Heap?

// ### ✅ Primitives → usually stack (or embedded directly)

// ```js
// let a = 10;
// let b = "hi";
// let c = true;
// ```

// ### ✅ Objects/Arrays/Functions → heap

// ```js
// let user = { name: "Pankaj" }; // heap
// let arr = [1,2,3];             // heap
// function f() {}                // heap
// ```

// But the variable `user` itself sits on the stack **holding a reference** to the heap object.

// ---

// ## 5) How exactly does “reference” work?

// ### Primitive copy (by value)

// ```js
// let a = 10;
// let b = a;
// b = 20;
// console.log(a); // 10
// ```

// **Why:** `a` and `b` store actual values separately.

// ### Object copy (by reference)

// ```js
// let obj1 = { x: 1 };
// let obj2 = obj1;
// obj2.x = 99;
// console.log(obj1.x); // 99
// ```

// **Why:** `obj1` and `obj2` both store the **same address** pointing to the same heap object.

// ---

// ## 6) How does memory get freed in JavaScript?

// Via **Garbage Collection (GC)**.

// ### What GC does

// It finds memory that is **no longer reachable** by your program and frees it.

// ### Core idea: “Reachability”

// An object is kept in memory if it is reachable from **roots**.

// **Roots (starting points) include:**

// * global variables (`window`, `globalThis`)
// * current function call stack variables
// * active closures
// * active timers/callbacks that still reference things
// * DOM nodes referenced from JS

// If GC cannot reach an object from roots → it’s garbage → can be collected.

// ---

// ## 7) How does GC decide what to delete? (Mark & Sweep)

// ### Mark & Sweep (main concept)

// 1. **Mark** all objects as “unvisited”
// 2. Start from roots, **traverse references**, mark reachable objects as “visited”
// 3. **Sweep**: delete everything not visited

// Example:

// ```js
// let u = { name: "Pankaj" };
// u = null;
// ```

// **How this frees memory:**

// * the heap object `{name:"Pankaj"}` has no reference now
// * GC can’t reach it
// * so it gets collected

// ---

// ## 8) When does GC run?

// GC timing is **not fixed**. The engine decides based on:

// * memory pressure (heap getting full)
// * allocation frequency
// * idle time / heuristics
// * young generation space filled (in V8)

// **Important:** You cannot force GC reliably in production JS.

// ---

// ## 9) How do modern engines (V8) make GC faster? (Generational GC)

// Observation:

// > Most objects die young.

// So V8 divides heap into:

// ### Young Generation (New Space)

// * new objects are created here
// * collected frequently via **Minor GC** (fast)

// ### Old Generation (Old Space)

// * objects that survive multiple collections are moved here
// * collected less often via **Major GC** (slower)

// **Why this helps:**
// Instead of scanning the entire heap always, it frequently cleans the “young” area where most garbage exists.

// ---

// ## 10) The real danger: Memory Leaks

// A **memory leak** in JS means:

// > Memory that is no longer useful, but still reachable (so GC can’t remove it)

// ### Why leaks happen

// Because something still holds a reference:

// * global variables
// * timers
// * closures
// * event listeners
// * DOM references
// * caches

// ---

// # 11) Common memory leaks (Why + How + Fix)

// ## A) Accidental Globals

// ```js
// name = "Pankaj"; // no let/const/var
// ```

// **Why leak:** global stays reachable forever.

// ✅ Fix:

// ```js
// "use strict";
// let name = "Pankaj";
// ```

// ---

// ## B) Timers not cleared

// ```js
// setInterval(() => {
//   console.log("running");
// }, 1000);
// ```

// **Why leak:** callback stays alive; anything it references stays alive.

// ✅ Fix:

// ```js
// const id = setInterval(...);
// clearInterval(id);
// ```

// ---

// ## C) Closures holding large memory

// ```js
// function outer() {
//   let big = new Array(1e6).fill("*");
//   return function inner() {
//     console.log("hi");
//   };
// }
// let fn = outer();
// ```

// **Why leak:** `inner()` keeps `big` alive due to closure.

// ✅ Fix idea: release reference when not needed

// ```js
// fn = null; // allow GC
// ```

// Or restructure so big isn’t captured.

// ---

// ## D) Event listeners not removed

// ```js
// button.addEventListener("click", handler);
// ```

// **Why leak:** listener holds references; element + captured data remain reachable.

// ✅ Fix:

// ```js
// button.removeEventListener("click", handler);
// ```

// ---

// ## E) Detached DOM nodes

// ```js
// let el = document.getElementById("box");
// el.remove(); 
// // but `el` is still referenced in JS
// ```

// **Why leak:** DOM removed visually, but JS reference keeps it alive.

// ✅ Fix:

// ```js
// el = null;
// ```

// ---

// # 12) When/Where to use WeakMap / WeakSet (Memory-safe references)

// ### Problem:

// Normal Map holds strong references:

// ```js
// const m = new Map();
// let obj = {};
// m.set(obj, "data");
// obj = null; // still not collected because Map keeps it
// ```

// ### Solution: WeakMap

// ```js
// const wm = new WeakMap();
// let obj = {};
// wm.set(obj, "data");
// obj = null; // GC can collect it
// ```

// **When to use WeakMap:**

// * private data storage per object
// * caching metadata without preventing GC
// * tracking objects safely

// **Where used:** frameworks, DOM metadata, memoization.

// ---

// # 13) How to “see” memory issues (Where to debug)

// **Chrome DevTools → Memory tab**

// * Heap snapshot (find retained objects)
// * Allocation instrumentation (see growth over time)
// * Record allocation timeline

// **When to do this:**

// * if your page slows down over time
// * SPA becomes heavier after navigation
// * mobile devices crash
// * memory graph keeps rising

// ---

// # 14) The complete mental model (one line)

// JavaScript memory management is:

// ✅ **Stack for primitives + references + function frames**
// ✅ **Heap for objects/arrays/functions**
// ✅ **Garbage Collector frees unreachable heap objects**
// ✅ **Leaks happen when something stays reachable accidentally**

// ---

// ## 15) Quick “Why/How/When/Where” recap

// * **Why**: RAM is limited; prevent slowdown/crash
// * **How**: allocate on stack/heap, free using GC (mark-sweep + generational)
// * **When**: GC runs automatically based on heuristics; leaks happen when references remain
// * **Where**: stack (execution context), heap (objects), devtools memory tab for debugging

// ---

// If you want, I can do either of these next (no extra questions needed):

// 1. **Closure + memory** explained with diagrams and step-by-step reachability
// 2. **10 interview questions** on JS memory + GC (with best answers)
// 3. A **mini project** that intentionally leaks memory + we fix it using DevTools
