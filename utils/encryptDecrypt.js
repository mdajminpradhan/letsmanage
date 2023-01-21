var CryptoJS = require('crypto-js');
const secret = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET;

export const encryptData = (data) => {
  const encryptedText = CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString().replace('+', 'xMl3Jk').replace('/', 'Por21Ld').replace('=', 'Ml32');
  return encryptedText;
};

export const decryptData = (text) => {
  console.log(text);
  const bytes = CryptoJS.AES.decrypt(text, secret);
  const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8)).replace('xMl3Jk', '+').replace('Por21Ld', '/').replace('Ml32', '=');
  return data;
};
