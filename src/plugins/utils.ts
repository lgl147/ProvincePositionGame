export const shuffle = (ar: any) => {
  const arr = JSON.parse(JSON.stringify(ar));
  const temp: any = [];
  for (let i = arr.length; i > 0; i--) {
    const temRandom = Math.floor(Math.random() * i);
    temp.push(arr[temRandom]);
    arr.splice(temRandom, 1); //抽取一张后，要除去这张牌，然后在剩下的牌中继续抽
  }
  return temp;
};
