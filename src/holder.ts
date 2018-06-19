import { IOption, IDataItem } from './interfaces';
import { TSyncPromise } from './promise';

export class Holder<T> {
  private container: Partial<Record<string, TSyncPromise<T>>> = {};
  static notExist = TSyncPromise.reject<any>(new Error("Doesn't exist"));

  constructor(private props: IOption<T>) {}

  set(key: string, defer: TSyncPromise<T>) {
    const { store, name, action } = this.props;
    defer.then(
      value =>
        store().dispatch({
          type: action,
          action: 'set',
          name,
          key,
          value
        }),
      error =>
        store().dispatch({
          type: action,
          action: 'error',
          name,
          key,
          error
        })
    );
    this.container[key] = defer;
  }

  clear(): void {
    const { store, action, name } = this.props;
    store().dispatch({ type: action, action: 'clear', name });
    this.container = {};
  }

  private getDataBlob(aKey: string): IDataItem | undefined {
    const { store, key, name } = this.props;
    const storeInstance = store();
    const state = storeInstance.getState();
    if (!state) {
      return;
    }
    const holderState = state[key];
    if (!holderState) {
      return;
    }
    const ptr = holderState[name];
    if (!ptr) {
      return;
    }
    return ptr[aKey];
  }

  get(key: string): T | undefined {
    const blob = this.getDataBlob(key);
    return blob ? blob.data : undefined;
  }

  has(key: string): boolean {
    const blob = this.getDataBlob(key);
    return !!blob;
  }

  error(key: string): Error | undefined {
    const blob = this.getDataBlob(key);
    return blob ? blob.error : undefined;
  }

  getAwait(key: string): TSyncPromise<T> | undefined {
    return this.container[key];
  }

  await(key: string): TSyncPromise<T> {
    return this.getAwait(key) || Holder.notExist;
  }

  awaitAll() {
    const allDefers = Object.keys(this.container).map(key =>
      this.container[key]
    );
    return TSyncPromise.all<T>(allDefers);
  }
}
