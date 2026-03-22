/**
 * 性能監控工具
 */

/**
 * 測量函數執行時間
 * @param {Function} fn 要測量的函數
 * @param {string} label 標籤
 * @returns {any} 函數返回值
 */
export function measurePerformance(fn, label = 'Function') {
  if (process.env.NODE_ENV === 'production') {
    return fn();
  }
  
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (end - start > 16) { // 超過 16ms (60fps 的每幀時間)
    console.warn(`[Performance] ${label} took ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
}

/**
 * 防抖函數
 * @param {Function} fn 原函數
 * @param {number} delay 延遲時間(ms)
 * @returns {Function} 防抖後的函數
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * 節流函數
 * @param {Function} fn 原函數
 * @param {number} limit 限制時間(ms)
 * @returns {Function} 節流後的函數
 */
export function throttle(fn, limit = 300) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 記憶化函數
 * @param {Function} fn 原函數
 * @returns {Function} 記憶化後的函數
 */
export function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
