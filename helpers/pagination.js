/**
 * Parses pagination query params and enforces defaults and max values.
 * @param {object} query - Express req.query object
 * @param {number} [defaultLimit=12]
 * @param {number} [maxLimit=1000]
 * @returns {{ page: number, limit: number }}
 */
export function parsePagination(query, defaultLimit = 12, maxLimit = 1000) {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = defaultLimit;
  if (limit > maxLimit) limit = maxLimit;
  return { page, limit };
}
