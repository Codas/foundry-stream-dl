const illegalRe = /[\/\?<>\\:\*\|"]/g;
const controlRe = /[\x00-\x1f\x80-\x9f]/g;
const reservedRe = /^\.+$/;
const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
const windowsTrailingRe = /[\. ]+$/;
const spacesRe = /\s+/g;

export function sanitize(input, replacement) {
  if (typeof input !== 'string') {
    throw new Error('Input must be string');
  }
  const sanitized = input
    .toLocaleLowerCase()
    .replace(illegalRe, replacement)
    .replace(controlRe, replacement)
    .replace(reservedRe, replacement)
    .replace(windowsReservedRe, replacement)
    .replace(spacesRe, replacement)
    .replace(windowsTrailingRe, replacement)
    .replace(new RegExp(`(${replacement})+`, 'g'), replacement);
  return sanitized.substr(0, 255);
}
