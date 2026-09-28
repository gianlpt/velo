export function generateOrderCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = Array.from({ length: 3 }, () =>
      letters[Math.floor(Math.random() * letters.length)]
    ).join('');
  
    const randomNumber = Math.floor(Math.random() * 10);
  
    return `VLO-${randomLetters}${randomNumber}`;
  }
  