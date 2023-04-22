export type BaseSignal<T> = {
  _notify: (signal: BaseSignal<T>) => void;
};

export type ReadonlySignal<T> = (() => T) &
  BaseSignal<T> & {
    _subscribe: (signal: BaseSignal<any>) => void;
    _unSubscribe: (signal: BaseSignal<any>) => void;
  };

export type Signal<T> = ReadonlySignal<T> & {
  asReadonly: () => ReadonlySignal<T>;
  set: (value: T) => void;
  update: (updateFn: (value: T) => T) => void;
  mutate: (mutatorFn: (value: T) => void) => void;
};

export function signal<T>(initialValue: T): Signal<T> {
  let _value = initialValue;
  const targets: WeakRef<BaseSignal<any>>[] = [];

  const signal: Signal<T> = function () {
    return _value;
  };

  const detectChanges = () => {
    const markedForRemoval = [];
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i].deref();
      if (target) {
        target._notify(signal);
      } else {
        markedForRemoval.push(i);
      }
    }

    for (const index of markedForRemoval) {
      targets.splice(index, 1);
    }
  };

  signal._notify = (_signal: BaseSignal<any>) => {
    throw Error("signal should not be notified!");
  };

  signal._subscribe = (signal: BaseSignal<any>) => {
    targets.push(new WeakRef(signal));
  };

  signal._unSubscribe = (signal: BaseSignal<any>) => {
    const index = targets.findIndex((t) => t.deref() === signal);
    if (index > -1) targets.splice(index, 1);
  };

  signal.asReadonly = () => {
    const partialSignal = signal as Partial<Signal<T>>;
    delete partialSignal.asReadonly;
    delete partialSignal.set;
    delete partialSignal.update;
    // delete partialSignal.mutate;
    return partialSignal as ReadonlySignal<T>;
  };

  signal.set = (value: T) => {
    _value = value;
    detectChanges();
  };

  signal.update = (updateFn: (value: T) => T) => {
    _value = updateFn(_value);
    detectChanges();
  };

  signal.mutate = (mutatorFn: (value: T) => void) => {
    mutatorFn(_value);
    detectChanges();
  };

  return signal;
}

export function computed<T>(
  computation: () => T,
  ...signals: ReadonlySignal<any>[]
): ReadonlySignal<T> {
  let _value = computation();
  const targets: WeakRef<BaseSignal<any>>[] = [];

  const signal: ReadonlySignal<T> = function () {
    return _value;
  };

  const detectChanges = () => {
    const markedForRemoval = [];
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i].deref();
      if (target?._notify) {
        target._notify(signal);
      } else {
        markedForRemoval.push(i);
      }
    }

    for (const index of markedForRemoval) {
      targets.splice(index, 1);
    }
  };

  signals.forEach((s) => s._subscribe(signal));

  signal._notify = (_signal: BaseSignal<any>) => {
    _value = computation();
    detectChanges();
  };

  signal._subscribe = (signal: BaseSignal<any>) => {
    targets.push(new WeakRef(signal));
  };

  signal._unSubscribe = (signal: BaseSignal<any>) => {
    const index = targets.findIndex((t) => t.deref() === signal);
    if (index > -1) targets.splice(index, 1);
  };

  return signal;
}

export function effect(
  effectFn: () => void,
  ...signals: ReadonlySignal<any>[]
): void {
  const signal: BaseSignal<void> = {
    _notify: (_signal: BaseSignal<any>) => {
      effectFn();
    },
  };

  signals.forEach((s) => s._subscribe(signal));
}
