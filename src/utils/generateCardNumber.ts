export const generateCardNumber = (): string => {
  // Generate a random 16-digit card number starting with 4 (Visa)
  let cardNumber = '4';

  for (let i = 0; i < 15; i++) {
    cardNumber += Math.floor(Math.random() * 10);
  }

  return cardNumber;
};

export const generateCVV = (): string => {
  // Generate a random 3-digit CVV
  return Math.floor(100 + Math.random() * 900).toString();
};

export const generateExpiryDate = (): string => {
  // Generate expiry date 3 years from now
  const currentDate = new Date();
  const expiryYear = currentDate.getFullYear() + 3;
  const expiryMonth = String(currentDate.getMonth() + 1).padStart(2, '0');

  return `${expiryMonth}/${expiryYear.toString().slice(-2)}`;
};

export const formatCardNumber = (cardNumber: string): string => {
  // Format card number as XXXX XXXX XXXX XXXX
  return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
};

export const maskCardNumber = (cardNumber: string): string => {
  // Show only last 4 digits
  return 'XXXX XXXX XXXX ' + cardNumber.slice(-4);
};
