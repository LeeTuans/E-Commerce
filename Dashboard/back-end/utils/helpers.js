export const randomCustom = (min, max, floor = 0) => {
  return (Math.random() * (max - min + 1) + min).toFixed(floor);
};
