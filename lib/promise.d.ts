export declare type TCallbackSuccess<T> = (data: T) => any;
export declare type TCallbackError = (err: Error) => any;
export declare type TCallback<T> = (resolve: TCallbackSuccess<T>, reject: TCallbackError) => void;
interface IData<Type, T> {
    type: Type;
    data: T;
}
export declare class Iterator<T extends ArrayLike<any>> {
    private count;
    private onSuccess;
    private onFail;
    private data;
    private error;
    private executed;
    constructor(count: number, onSuccess: (data: T) => void, onFail: (data: Error) => void);
    handleSuccess: (data: any, index: number) => void;
    handleError: (error: Error) => void;
}
export declare class TSyncPromise<T> implements Promise<T> {
    data?: IData<'resolved', T> | IData<'rejected', any>;
    [Symbol.toStringTag]: 'Promise';
    static resolve<O>(data: O | PromiseLike<O>): TSyncPromise<O>;
    static reject<O>(data: any): TSyncPromise<O>;
    static all<A1, A2, A3, A4, A5, A6, A7>(p: [Promise<A1> | A1, Promise<A2> | A2, Promise<A3> | A3, Promise<A4> | A4, Promise<A5> | A5, Promise<A6> | A6, Promise<A7> | A7]): TSyncPromise<[A1, A2, A3, A4, A5, A6, A7]>;
    static all<A1, A2, A3, A4, A5, A6>(p: [Promise<A1> | A1, Promise<A2> | A2, Promise<A3> | A3, Promise<A4> | A4, Promise<A5> | A5, Promise<A6> | A6]): TSyncPromise<[A1, A2, A3, A4, A5, A6]>;
    static all<A1, A2, A3, A4, A5>(p: [Promise<A1> | A1, Promise<A2> | A2, Promise<A3> | A3, Promise<A4> | A4, Promise<A5> | A5]): TSyncPromise<[A1, A2, A3, A4, A5]>;
    static all<A1, A2, A3, A4>(p: [Promise<A1> | A1, Promise<A2> | A2, Promise<A3> | A3, Promise<A4> | A4]): TSyncPromise<[A1, A2, A3, A4]>;
    static all<A1, A2, A3>(p: [Promise<A1> | A1, Promise<A2> | A2, Promise<A3> | A3]): TSyncPromise<[A1, A2, A3]>;
    static all<A1, A2>(p: [Promise<A1> | A1, Promise<A2> | A2]): TSyncPromise<[A1, A2]>;
    static all<T>(p: TSyncPromise<T>[] | Promise<T>[] | T[]): TSyncPromise<T[]>;
    constructor(fn: TCallback<T>);
    private onApply;
    private setData;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: null | ((value: T) => TResult1 | PromiseLike<TResult1>), onrejected?: null | ((reason: any) => TResult2 | PromiseLike<TResult2>)): TSyncPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: (reason: any) => TResult | PromiseLike<TResult>): TSyncPromise<T | TResult>;
    finally<TResult>(onCb?: () => TResult): TSyncPromise<TResult>;
    toPromise(): Promise<T>;
    toString(): string;
}
export {};
//# sourceMappingURL=promise.d.ts.map