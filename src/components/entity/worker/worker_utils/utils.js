const workersSuggestions = (obj) => {
   let suggestions = [];
   for (let key in obj) {
     if (
       (typeof obj[key] === "string" || typeof obj[key] === "number") &&
       key !== "id" &&
       obj[key] !== ""
     ) {
       if (key === "subContractorCompanyName") {
         let values = obj[key].split(", ");
         suggestions.push(values[0], values[1], values[2]);
       } else {
         suggestions.push(obj[key]);
       }
     } else if (typeof obj[key] === "object") {
       suggestions = suggestions.concat(workersSuggestions(obj[key]));
     }
   }
   return suggestions;
}

export const generateOptions = (workers) => {
   let options = [];
   for (let obj of workers) {
     let results = workersSuggestions(obj);
     results.forEach((item) => {
       if (!options.includes(item)) options.push(item);
     });
   }
   return options;
}