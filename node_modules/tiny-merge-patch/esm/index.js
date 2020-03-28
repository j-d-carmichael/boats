/**
 * Test if a value is a plain object.
 * @param {*} val - A value.
 * @return {boolean} true if `val` is a plain object.
 */
const isObject = val =>
  val != null && typeof val === 'object' && Array.isArray(val) === false;

/**
 * Apply a JSON merge patch. The origin is *not* modified, but unchanged
 * properties will be recycled.
 * 
 * @param {*} origin - The value to patch.
 * @param {*} patch - An [RFC 7396](https://tools.ietf.org/html/rfc7396) patch.
 * @return {*} The patched value.
 */
export function apply(origin, patch) {
  if (!isObject(patch)) {
    // If the patch is not an object, it replaces the origin.
    return patch;
  }

  const result = !isObject(origin)
    ? // Non objects are being replaced.
      {}
    : // Make sure we never modify the origin.
      Object.assign({}, origin);

  Object.keys(patch).forEach(key => {
    const patchVal = patch[key];
    if (patchVal === null) {
      delete result[key];
    } else {
      result[key] = apply(result[key], patchVal);
    }
  });
  return result;
}

export default apply;
