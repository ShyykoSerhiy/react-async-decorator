import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { createApi } from './helpers';
import { asyncMethodFactory, listenTo } from '../index';
import { create } from '../src/fetcher';
import { IFetcher } from '../src/interfaces';
const createFetcher = create();

class Test extends React.Component<{ fetcher: IFetcher<string> }, {}> {
  constructor(props: { fetcher: IFetcher<string> }, ctx: any) {
    super(props, ctx);
    listenTo(this, props.fetcher);
  }
	render() {
		return React.createElement('div', { className: 'test' }, this.renderComponent());
	}
	@asyncMethodFactory({
		renderLoader: 'loading',
		renderError: err => React.createElement('div', {}, err.message),
	})
	renderComponent() {
		const data = this.props.fetcher.get();
		return React.createElement('div', {}, data);
	}
	loading() {
		return React.createElement('div', {}, 'loading');
	}
}

it('render loading', () => {
	const api = createApi<string>();
	const fetcher = createFetcher<string>(api.fetch);
	const component = renderToString(React.createElement(Test, { fetcher }));
	expect(component).toMatchSnapshot();
});

it('render error', async () => {
	const api = createApi<string>();
	const fetcher = createFetcher<string>(api.fetch);
	api.reject(new Error('custom error'));
	try {
		fetcher.get();
		expect(false).toBeTruthy();
	} catch (e) {
		expect(true).toBeTruthy();
	}
	await api.defer.catch(_ => Promise.resolve());
	const component = renderToString(React.createElement(Test, { fetcher }));
	expect(component).toMatchSnapshot();
});

it('render data', async () => {
	const api = createApi<string>();
	const fetcher = createFetcher<string>(api.fetch);
	api.resolve('content');
	try {
		fetcher.get();
		expect(false).toBeTruthy();
	} catch (e) {
		expect(true).toBeTruthy();
	}
	await api.defer;
	const component = renderToString(React.createElement(Test, { fetcher }));
	expect(component).toMatchSnapshot();
});
