import { History } from '../createHistory/createHistory.native';

export const WINDOWS = {
	get location() {
		return History.state.url;
	}
};
