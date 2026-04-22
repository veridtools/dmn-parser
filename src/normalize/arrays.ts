// Array coercion is handled at parse time via fast-xml-parser's isArray callback.
// This module documents which tags are always coerced to arrays and re-exports
// ARRAY_TAGS for use in tests and external tooling.
export { ARRAY_TAGS } from '../xml.js';
