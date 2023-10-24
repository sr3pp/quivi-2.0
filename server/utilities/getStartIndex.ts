export const getStartIndex = (page: number, limit: number) => {
  return Math.floor((page - 1) * (limit / 100)) * 10;
};
