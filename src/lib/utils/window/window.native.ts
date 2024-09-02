import { History } from '@resourge/history-store/mobile';

export const WINDOWS = {
	get location() {
		return History.state.url;
	}
};
