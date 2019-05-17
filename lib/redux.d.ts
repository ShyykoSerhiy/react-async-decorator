import { Fetcher, TFetcherFn } from './fetcher';
import { MiddlewareAPI, Dispatch, IDataItem, IActionFetch, IFetcherOption, IOptionStore } from './interfaces';
export { MiddlewareAPI, Dispatch, IDataItem, IActionFetch, Fetcher, TFetcherFn, IFetcherOption };
export declare function initRedux<State>(opt: IOptionStore): {
    use: (aApi: MiddlewareAPI<Dispatch<any>, Record<string, Partial<Record<string, Partial<Record<string, IDataItem>>>>>>) => void;
    reducer: (state: State, act: IActionFetch) => State;
    createFetcher: <T, GetOptions = any, SetOptions = any>(fns?: TFetcherFn<T, GetOptions, SetOptions>, option?: string | IFetcherOption) => Fetcher<T, GetOptions, SetOptions>;
};
//# sourceMappingURL=redux.d.ts.map