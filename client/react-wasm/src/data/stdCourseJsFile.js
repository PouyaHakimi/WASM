// import { getStudentCourseMark } from '../API/API';
// const fs = require('fs');
// const path = require('path');



//  async function stdCourseJsFile({search}) {

//    const stdCourseMark= await getStudentCourseMark({search})

 
//     const filePath = path.join(__dirname, '.', 'data', 'data.json');
//     //*********JSON File */
//     const writeStream = fs.createWriteStream(filePath, { encoding: 'utf-8' });


//     writeStream.on("finish", () => {
//       console.log("✅ Data successfully written to JSON.");
      
//     });

//     writeStream.on("error", (err) => {
//       console.error("❌ Error writing to file:", err);
    
//     });

//     // ✅ Confirm write stream opened
//     console.log("🟢 Write stream opened");

//     // ✅ Start writing JSON data
//     writeStream.write("[\n");

//     stdCourseMark.forEach((item, index) => {
//       const jsonItem = JSON.stringify(item);
//       writeStream.write(jsonItem + (index < stdCourseMark.length - 1 ? ",\n" : ""));
//     });

//     writeStream.write("\n]"); // End JSON array
//     console.log("🟡 Finished writing, closing stream...");

//     // ✅ Close the write stream properly
//     writeStream.end(() => {
//       console.log("🟢 writeStream.end() callback executed.");
//     });

// }

// export default stdCourseJsFile