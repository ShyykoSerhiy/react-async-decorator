import { IOption, IFetcherOption, AnyResult, IFetcherFunction, IFetcher, IFetcherFnContext, IUpdater, ICreateOption } from './interfaces';
import { TSyncPromise } from './promise';
export interface IUpdaterKeeper {
    ctx?: any;
    fn(): void;
}
export declare class Fetcher<T, GetOptions, SetOptions> implements IFetcher<T, GetOptions, SetOptions>, IUpdater {
    private load;
    private modify;
    private hashArg;
    private context;
    private holder;
    private manual;
    private updates;
    private updateFetcher;
    constructor(opts: IOption<T>, fn: IFetcherFunction<T, GetOptions, SetOptions>);
    addUpdater(fn: () => void, ctx?: any): void;
    removeUpdater(fn: () => void, ctx?: any): void;
    impl(load: IFetcherFnContext<GetOptions, AnyResult<T>>): void;
    implModify(modify: IFetcherFnContext<SetOptions, AnyResult<T> | undefined>): void;
    clear(): void;
    init(key: string, args?: GetOptions): void;
    isLoading(arg?: GetOptions): boolean;
    awaitAll(): TSyncPromise<T[]>;
    await(arg?: GetOptions): TSyncPromise<T>;
    asyncGet(args?: GetOptions): TSyncPromise<T>;
    get(args?: GetOptions): T;
    asyncSet(opt: SetOptions, arg?: GetOptions): TSyncPromise<T>;
}
export declare type TFetcherFn<T, GetOptions, SetOptions> = IFetcherFunction<T, GetOptions, SetOptions> | IFetcherFnContext<GetOptions, AnyResult<T>>;
export declare function create(opts?: ICreateOption): <T, GetOptions = any, SetOptions = any>(fns?: TFetcherFn<T, GetOptions, SetOptions>, option?: string | IFetcherOption) => Fetcher<T, GetOptions, SetOptions>;
//# sourceMappingURL=fetcher.d.ts.map