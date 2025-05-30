const db = require("../../db/connection");
const { articleData } = require("../data/test-data");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createLookUpObject = (arrayOfObjects, key, value) => {
  const lookupObject = {}
  for (let i=0; i<arrayOfObjects.length; i++) {
    lookupObject[arrayOfObjects[i][key]] = arrayOfObjects[i][value]
  }

return lookupObject


  //   const lookupObject = {}
//   if (!article_title) return {...otherProperties}
// for (let i=0; i<articleData.length; i++) {
//   lookupObject.articleData[title] = i + 1
// }
}

