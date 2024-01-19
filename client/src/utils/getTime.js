const getTime = (itemDate) => {
  if (itemDate.getHours() > 12) {
    return `${itemDate.getHours() - 12}:${itemDate
      .getMinutes()
      .toString()
      .padStart(2, "0")} p.m.`;
  }
  if (itemDate.getHours() == 0) {
    return `12:${itemDate.getMinutes().toString().padStart(2, "0")} a.m.`;
  }
  return `${itemDate.getHours()}:${itemDate
    .getMinutes()
    .toString()
    .padStart(2, "0")} a.m.`;
};

export default getTime;
