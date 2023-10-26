export const handleSortType = (prevCol, prevType, newCol) => {
  let type = "";

  if (prevCol === newCol) {
    switch (prevType) {
      case "asc":
        type = "desc";
        break;
      case "desc":
        type = "";
        break;
      case "":
        type = "asc";
        break;
      default:
        type = "";
        break;
    }
  } else {
    type = "asc";
  }

  return type;
};
