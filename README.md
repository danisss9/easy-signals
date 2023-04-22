# Easy Signals
Easy Signals is a signal library with no dependencies for node, deno and browsers based on the Angular Signals.

## Table of Contents

- [Easy Signals](#easy-signals)
  - [Table of Contents](#table-of-contents)
  - [Install](#install)
  - [Usage](#usage)
    - [NodeJs](#nodejs)
    - [Angular](#angular)
    - [Angular (without Zone.js)](#angular-without-zonejs)
  - [Signal Types](#signal-types)
    - [Signal](#signal)
    - [Computed](#computed)
    - [Effect](#effect)
  - [Signal Functions](#signal-functions)
    - [asReadonly](#asreadonly)
    - [set](#set)
    - [update](#update)
    - [mutate](#mutate)
  - [Changelog](#changelog)
  - [FAQs](#faqs)

## Install

```cmd
npm install easy-signals
```

## Usage

Example on how to use Easy Signals:

### NodeJs

```js
import { signal, computed, effect } from 'easy-signals';

const count = signal(0);
const doubleCount = computed(() => count() * 2, count);
effect(() => console.log("effect called, count: ", count()), count);
console.log('doubleCount: ', doubleCount());
count.update((val) => val + 1);
console.log('doubleCount: ', doubleCount());
count.update((val) => val + 1);
console.log('doubleCount: ', doubleCount());
count.set(10);
```

### Angular

HTML:

```html
<p>Count is: {{ count() }}</p>
<p>Double Count is: {{ doubleCount() }}</p>
<button (click)="increment()">+1</button>
```

TypeScript:

```js
import { signal, computed, effect } from 'easy-signals';

  count = signal(0);
  doubleCount = computed(() => count() * 2, this.count);

  increment() {
    this.count.update((val) => val + 1);
  }
```

### Angular (without Zone.js)

HTML:

```html
<p>Count is: {{ count() }}</p>
<p>Double Count is: {{ doubleCount() }}</p>
<button (click)="increment()">+1</button>
```

TypeScript:

```js
import { signal, computed, effect } from 'easy-signals';

  count = signal(0);
  doubleCount = computed(() => count() * 2, this.count);

  constructor(private cdr: ChangeDetectorRef) {
    effect(() => {
      this.cdr.detectChanges();
    }, this.count, this.doubleCount);
  }

  increment() {
    this.count.update((val) => val + 1);
  }
```


```js
import { getFile, uploadFilesTo } from 'easy-file-picker';

async getFile(): void {
  const file = await getFile();
  await uploadFilesTo("http://example.com", file);
}
```


## Signal Types

### Signal

Creates a new Signal with a `intialValue`, the value can be changes using the `set`, `update` and `mutate` functions.

```js
function signal<T>(initialValue: T): Signal<T>
```

### Computed

Creates a new ReadonlySignal where the value is the return of the `computation` function. The value is updates when the `signals`'s values are updated.

```js
function computed<T>(computation: () => T,...signals: ReadonlySignal<any>[]): ReadonlySignal<T>
```

### Effect

The `effectFn` function is called everytime the values from `signals` are updated.

```js
function effect(effectFn: () => void,...signals: ReadonlySignal<any>[]): void
```

## Signal Functions

### asReadonly

Transforms a Signal into a ReadonlySignal.

```js
function asReadonly: () => ReadonlySignal<T>
```

### set

Sets a new Signal value.

```js
function set: (value: T) => void
```

### update

Updates the Signal's value with the return of the `updateFn` function.

```js
function update: (updateFn: (value: T) => T) => void
```

### mutate

Can be used to mutate the Signal's value using the `mutatorFn` function.

```js
function mutate: (mutatorFn: (value: T) => void) => void
```

## Changelog

**Version 0.1:**

- published library

## FAQs

No FAQs for now. (⌐■_■)
