export const arrayShuffle = (arr) => {
  let idx = arr.length;
  let temp;
  let random;

  while (idx !== 0) {
    random = Math.floor(Math.random() * idx);
    idx -= 1;
    temp = arr[idx];
    arr[idx] = arr[random];
    arr[random] = temp;
  }

  return arr;
};
