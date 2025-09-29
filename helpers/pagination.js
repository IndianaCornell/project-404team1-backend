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

/**
 * Formats a unified paginated response object.
 * @param {Array} items - The array of items for the current page
 * @param {number} total - Total number of items
 * @param {number} page - Current page number
 * @param {number} limit - Page size
 * @param {object} [extra={}] - Any extra fields to include (e.g. category)
 * @returns {object}
 */
export function paginatedResultDto(items, total, page, limit, extra = {}) {
  return {
    items,
    total,
    page,
    limit,
    ...extra,
  };
}
