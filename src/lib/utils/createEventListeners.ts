
export const createEventListeners = <Listen extends (...args: any[]) => any>() => {
	let events: Listen[] = []

	const onEvent = (fn: Listen) => {
		events.push(fn);

		return function () {
			events = events.filter((handler) => handler !== fn);
		};
	}

	return {
		get events() {
			return events
		},
		onEvent
	} as const
}
