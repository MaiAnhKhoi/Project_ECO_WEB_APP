/**
 * Helper để lấy pagination từ URL (query params)
 * Refine sync với URL nếu syncWithLocation: true
 * 
 * @param pagination - pagination object từ Refine params (fallback)
 * @returns { current: number, pageSize: number }
 */
export function getPaginationFromUrl(pagination?: { current?: number; pageSize?: number }) {
  // Lấy từ URL query params
  const searchParams = new URLSearchParams(window.location.search);
  
  const currentFromUrl = 
    searchParams.get("current") || 
    searchParams.get("currentPage") ||
    searchParams.get("page");
  
  const pageSizeFromUrl = searchParams.get("pageSize") || searchParams.get("size");
  
  // Ưu tiên URL, fallback về pagination từ params
  const current = 
    currentFromUrl != null 
      ? Number(currentFromUrl) 
      : pagination?.current ?? 1;
  
  const pageSize = 
    pageSizeFromUrl != null 
      ? Number(pageSizeFromUrl) 
      : pagination?.pageSize ?? 20;
  
  return { current, pageSize };
}

