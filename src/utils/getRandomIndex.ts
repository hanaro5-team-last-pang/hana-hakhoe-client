export const getRandomIndex = (str: string, length: number): number => {
  let num: number = 0;
  for (let i = 0; i < str.length; i++) {
    num += str.charCodeAt(i);
  }
  return num % length;
};
