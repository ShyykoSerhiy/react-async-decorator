import { MiddlewareAPI, FetcherState, FetcherItem, TContainer, IOptionReducer } from './interfaces';
export declare function createMemoryStore(opt: IOptionReducer<any>, initState?: FetcherState): MiddlewareAPI;
export declare function snapshotStoreFetcher(holderState: FetcherItem): TContainer<any>;
export declare function snapshotStore(state: FetcherState, container?: Record<string, TContainer<any>>): Partial<Record<string, TContainer<any>>>;
//# sourceMappingURL=memory.d.ts.map