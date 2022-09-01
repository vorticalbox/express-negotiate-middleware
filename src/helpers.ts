type ParsedQuality = (string | number)[]
type ParsedQualities = ParsedQuality[]

/**
 * This function takes the parsed accept strings and sorts them by quality
 *
 * @param {ParsedQualities} parsedQualities unsorted accept strings
 * @returns {ParsedQualities} sorted accept strings
 */
function sortByQuality(parsedQualities: ParsedQualities): ParsedQualities {
  return parsedQualities.sort((a: ParsedQuality, b: ParsedQuality) => (b[1] as number) - (a[1] as number));
}

/**
 * This function takes the accept header and parses it into types and sort by q
 *
 * @param {string} acceptString the accept header
 * @returns {Array<string>} q sorted array of accept values
 */
function parseAccept(acceptString: string): Array<string> {
  const accepts = acceptString.split(',');
  if (accepts.length === 1) { return [accepts[0]]; }
  const parsedQualities = [];
  for (const accept of accepts) {
    const [value, quality] = accept.split(';');
    let parsedQuality = 1;
    if (quality) {
      const qualityAmount = Number(quality.replace('q=', ''));
      if (!Number.isNaN(qualityAmount)) {
        parsedQuality = qualityAmount;
      }
    }
    // if quality is not 1 then we need to sort these. this allows us to sort a smaller list of accepts
    parsedQualities.push([value, parsedQuality]);
  }
  return sortByQuality(parsedQualities).map((q) => q[0] as string);
}

export default {
  parseAccept,
};
