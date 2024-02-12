const getSearchSuggestions = (obj) => {
    let suggestions = [];
    for (let key in obj) {
      if (
        (typeof obj[key] === "string" || typeof obj[key] === "number") &&
        key !== "id" &&
        obj[key] !== ""
      ) {
        if (key === "workerStatus") {
          let values = obj[key].split(", ");
          suggestions.push(values[0], values[1], values[2]);
        } else {
          suggestions.push(obj[key]);
        }
      } else if (typeof obj[key] === "object") {
        suggestions = suggestions.concat(getSearchSuggestions(obj[key]));
      }
    }
    return suggestions;
  };

  export const generateOptions = (visas) => {
    let options = [];
    for (let obj of visas) {
      let results = getSearchSuggestions(obj);
      results.forEach((item) => {
        if (!options.includes(item)) options.push(item);
      });
    }
    return options;
  };
  