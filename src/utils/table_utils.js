export const formatFilters = (obj, filters) => {
   let newObj = {}
   for (const key in obj) {
     switch (key) {
       case "recruiter.firstName":
         newObj["recruiterId"] = obj[key] ? obj[key].join(",") : null;
         break;
       case "clientName":
       case "client.clientName":
         newObj["clientId"] = obj[key] ? obj[key].join(",") : null;
         break;
         case "projectName":
          case "project.projectName":
            newObj["projectId"] = obj[key] ? obj[key].join(",") : null;
            break;
       case "candidate.firstName":
         newObj["candidateId"] = obj[key] ? obj[key].join(",") : null;
         break;
       case "supplierCompanyName":
         newObj["supplierId"] = obj[key] ? obj[key].join(",") : null;
         break;
       case "worker.firstName":
         newObj["workerId"] = obj[key] ? obj[key].join(",") : null;
         break;
         case "resourceManager.firstName":
          newObj["resourceManagerId"] = obj[key] ? obj[key].join(",") : null;
          break;
       default:
         newObj[key] = obj[key] ? obj[key].join(",") : null;
     }
   }
  //  for (const key in filters) {
  //     if (newObj[key]) {
  //       newObj[key] = filters[key]
  //     }
  //  }
   return newObj;
}