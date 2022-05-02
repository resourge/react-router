
/**
 * Checks if `value` is a number
 * Ex:
 * 		10 // Number
 * 		0 // Number
 * 		0001 // string
 */
const isNumeric = (value: string | number) => {
	if ( typeof value === 'number' ) {
		return true;
	}
	return /^[-]?([1-9]\d*|0)(\.\d+)?$/.test(value)
}

/**
 * Checks if `value` is a Iso Data
 */
const isIsoDate = (value: string) => {
	if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)) return false;
	const d = new Date(value); 
	return d.toISOString() === value;
}

/**
 * Decodes string into there true values
 */
export const decoder = (str: string, defaultDecoder: (str: string, decoder?: any, charset?: string) => string) => {
	if ( isNumeric(str) ) {
		return parseFloat(str);
	}
	else if ( str === 'true' ) {
		return true;
	}
	else if ( str === 'false' ) {
		return false;
	}
	else if ( isIsoDate(unescape(str)) ) {
		return new Date(unescape(str));
	}
	else {
		return defaultDecoder(str);
	}
}
