export const pad = (string, padding, length) => length - string.length > 0 ? `${string}${new Array(length - string.length).fill(padding).join('')}` : string;
