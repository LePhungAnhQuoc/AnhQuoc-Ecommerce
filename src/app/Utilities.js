const getFilteredData = (data, searchQuery) => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return data.filter((item) => {
      if (!normalizedQuery) return true;
  
      const searchableText = getAllValuesOfObject(item)
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
  
      return searchableText.includes(normalizedQuery);
    });
}

const getAllValuesOfObject = (obj) => {
  const values = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      values.push(obj[key]);
    }
  }
  return values;
};

export { getAllValuesOfObject, getFilteredData };