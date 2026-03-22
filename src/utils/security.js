/**
 * 安全相關工具
 */

/**
 * 防止 XSS 攻擊的 HTML 轉義
 * @param {string} str 原始字符串
 * @returns {string} 轉義後字符串
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  return str.replace(/[&<>"'`=/]/g, char => htmlEntities[char]);
}

/**
 * 驗證數字輸入
 * @param {any} value 輸入值
 * @param {Object} options 選項
 * @returns {boolean} 是否有效
 */
export function validateNumber(value, options = {}) {
  const {
    min = -Infinity,
    max = Infinity,
    integer = false,
    required = true
  } = options;
  
  if (value === null || value === undefined || value === '') {
    return !required;
  }
  
  const num = Number(value);
  if (isNaN(num)) return false;
  
  if (integer && !Number.isInteger(num)) return false;
  if (num < min || num > max) return false;
  
  return true;
}

/**
 * 清理 URL 參數
 * @param {string} url URL
 * @returns {string} 清理後的 URL
 */
export function sanitizeUrl(url) {
  try {
    const parsed = new URL(url);
    
    // 只允許特定的協議
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    if (!allowedProtocols.includes(parsed.protocol)) {
      return 'about:blank';
    }
    
    return parsed.toString();
  } catch {
    return 'about:blank';
  }
}

/**
 * 驗證 email 格式
 * @param {string} email email 地址
 * @returns {boolean} 是否有效
 */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * 深度克隆對象（防止原型污染）
 * @param {any} obj 要克隆的對象
 * @returns {any} 克隆後的對象
 */
export function safeClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  
  // 防止原型污染
  if (Object.prototype.hasOwnProperty.call(obj, '__proto__')) {
    throw new Error('Potential prototype pollution detected');
  }
  
  return JSON.parse(JSON.stringify(obj));
}
