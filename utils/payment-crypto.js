import crypto from 'crypto';

/**
 * Generates an HMAC SHA-256 secure hash for JazzCash.
 * JazzCash requires sorting all parameters alphabetically by key,
 * appending them together separated by '&', and prefixing with the Integrity Salt.
 *
 * @param {Object} data - The payment payload
 * @param {String} integritySalt - Your JazzCash Integrity Salt
 * @returns {String} The secure hash
 */
export function generateJazzCashHash(data, integritySalt) {
  if (!integritySalt) {
    console.error('Missing JazzCash Integrity Salt');
    return '';
  }

  // 1. Remove empty values and the hash itself (if present)
  const filteredData = {};
  for (const key in data) {
    if (data[key] !== '' && data[key] !== null && data[key] !== undefined && key !== 'pp_SecureHash') {
      filteredData[key] = data[key];
    }
  }

  // 2. Sort keys alphabetically
  const sortedKeys = Object.keys(filteredData).sort();

  // 3. Create the string to hash: IntegritySalt&val1&val2...
  let hashString = integritySalt;
  sortedKeys.forEach(key => {
    hashString += `&${filteredData[key]}`;
  });

  // 4. Generate HMAC SHA-256 Hash
  const hash = crypto.createHmac('sha256', integritySalt)
    .update(hashString)
    .digest('hex')
    .toUpperCase(); // JazzCash requires uppercase hex

  return hash;
}

/**
 * Validates an incoming webhook hash from JazzCash.
 * 
 * @param {Object} incomingData - The data received in the webhook
 * @param {String} integritySalt - Your JazzCash Integrity Salt
 * @returns {Boolean} True if valid, false if tampering detected
 */
export function verifyJazzCashWebhook(incomingData, integritySalt) {
  const providedHash = incomingData.pp_SecureHash;
  if (!providedHash) return false;

  const calculatedHash = generateJazzCashHash(incomingData, integritySalt);
  return providedHash === calculatedHash;
}


/**
 * Generates a secure hash for EasyPaisa Hosted Checkout.
 * EasyPaisa usually expects sorting by keys and hashing with MD5 or SHA256 depending on the API version.
 * This is a standard implementation.
 */
export function generateEasyPaisaHash(data, hashKey) {
  // Simple example of EasyPaisa Hash generation (Implementation varies slightly based on API version used by merchant)
  let sortedKeys = Object.keys(data).sort();
  let hashString = '';
  sortedKeys.forEach(key => {
    if (key !== 'merchantHashedReq' && data[key] !== '') {
      hashString += `${key}=${data[key]}&`;
    }
  });
  
  hashString = hashString.slice(0, -1); // Remove trailing &
  
  // Encrypt with HashKey (using AES-128-ECB as per some EP docs, but we'll use HMAC for this generic example)
  // NOTE: You MUST check your specific EasyPaisa portal documentation for the exact algorithm assigned to your account.
  const cipher = crypto.createCipheriv('aes-128-ecb', Buffer.from(hashKey.padEnd(16, '0').slice(0, 16)), null);
  let encrypted = cipher.update(hashString, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}
