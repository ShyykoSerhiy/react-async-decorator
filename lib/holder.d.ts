import { IOption, IHolder, IActionsLifecycle, IOptionActions } from './interfaces';
import { TSyncPromise } from './promise';
export declare function createActions<T>(opts: IOptionActions, holder: Holder<T>): IActionsLifecycle<T>;
export declare class Holder<T> implements IHolder<T> {
    private props;
    private container;
    static notExist: TSyncPromise<any>;
    actions: IActionsLifecycle<T>;
    constructor(props: IOption<T>);
    set(params: Record<string, TSyncPromise<T>>): void;
    set(key: string, defer: TSyncPromise<T>): void;
    allow(key: string, defer: TSyncPromise<T>): boolean;
    clear(): void;
    private getFetcherBlob;
    private getDataBlob;
    get(key: string): T | undefined;
    has(key: string): boolean;
    isLoading(key: string): boolean | undefined;
    error(key: string): Error | undefined;
    getAwait(key: string): TSyncPromise<T> | undefined;
    await(key: string): TSyncPromise<T>;
    awaitAll(): TSyncPromise<T[]>;
}
//# sourceMappingURL=holder.d.ts.map