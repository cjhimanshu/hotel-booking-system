// Pagination utility for handling paginated responses
const getPaginationParams = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;
  
  return {
    page: pageNum,
    limit: limitNum,
    skip,
  };
};

const getPaginationResponse = (data, total, page, limit) => {
  return {
    data,
    pagination: {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  getPaginationParams,
  getPaginationResponse,
};
