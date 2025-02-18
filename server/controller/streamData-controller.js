const fs = require('fs');
const { parser, Parser } = require('stream-json');
const { streamArray } = require('stream-json/streamers/StreamArray');
const path =require('path')
const { Readable, Writable } = require('node:stream');
const { createServer } = require('node:http');
const { createReadStream } = require('node:fs');
const { stat } =require('node:fs/promises')
const { } = require('node:stream/web')

exports.getStreamDataController = async (req, res) => {
    try {
        const stdPath = path.join(__dirname, '..', 'data', 'students.json');
        const mrkPath = path.join(__dirname, '..', 'data', 'marks.json');
        const crsPath = path.join(__dirname, '..', 'data', 'courses.json');

      const {size} = await stat(stdPath)
      console.log(size);

      await Readable.toWeb(createReadStream(stdPath)) 
      .pipeThrough(      
        new TransformStream({
            async transformer(jsonLine , controller) {
                console.log("jsonLine",JSON.parse(Buffer.from(jsonLine)));
                controller.enqueue(jsonLine)
                console.log("teeesssstttttttt");
                
            }
        })
      )
      .pipeTo(
        Writable.toWeb(res)
      )
       


        // if (![stdPath, mrkPath, crsPath].every(fs.existsSync)) {
        //     return res.status(404).json({ error: 'One or more files not found' });
        // }

        // res.setHeader('Content-Type', 'application/json');
        // res.setHeader('Transfer-Encoding', 'chunked');

        // const pipeJsonStream = (filePath) => {
        //     return fs.createReadStream(filePath)
        //         .pipe(parser())
        //         .pipe(streamArray());
        // };

        // // Start the response JSON
        // res.write('{"students":[');

        // const studentStream = pipeJsonStream(stdPath);
        // console.log("first stream");
        
        // let first = true;

        // studentStream.on('data', ({ value }) => {
        //   //  console.log(value);
            
        //     if (!first) res.write(',');
        //     first = false;
        //     res.write(JSON.stringify(value));  // Write each student object as it comes in
        // });

        // studentStream.on('end', () => {
        //     res.write('],');
        //     res.write('"marks":[');
        //     //console.log("********"+studentStream);
            
        //     const marksStream = pipeJsonStream(mrkPath);
        //     marksStream.on('data', ({ value }) => {
        //         res.write(JSON.stringify(value)); // Write each marks object
        //     });

        //     marksStream.on('end', () => {
        //         res.write('],');
        //         res.write('"courses":[');
        //         //console.log("********"+marksStream);
        //         const coursesStream = pipeJsonStream(crsPath);
        //         coursesStream.on('data', ({ value }) => {
        //             res.write(JSON.stringify(value)); // Write each course object
        //         });

        //         coursesStream.on('end', () => {
        //             res.write(']');  // End the courses array and the response
        //             res.end();
        //         });
        //     });
        // });

        // studentStream.on('error', (err) => {
        //     console.error('Error streaming students data:', err);
        //     res.status(500).json({ error: 'Error streaming students data' });
        // });

    } catch (error) {
        console.error('Stream Error:', error);
        res.status(500).json({ error: 'Error streaming file' });
    }
};







// const fs = require('fs');
// const path = require('path');

// exports.getStreamDataController = async (req, res) => {
//     try {
//         const stdPath = path.join(__dirname, '..', 'data', 'students.json');
//         const mrkPath = path.join(__dirname, '..', 'data', 'marks.json');
//         const crsPath = path.join(__dirname, '..', 'data', 'courses.json');

//         // Ensure all files exist before processing
//         if (![stdPath, mrkPath, crsPath].every(fs.existsSync)) {
//             return res.status(404).json({ error: 'One or more files not found' });
//         }

//         res.setHeader('Content-Type', 'application/json');
//         res.setHeader('Transfer-Encoding', 'chunked');

//         // Function to read a JSON file and return parsed data
//         const readFileAsJson = (filePath) => {
//             return new Promise((resolve, reject) => {
//                 let data = '';
//                 const stream = fs.createReadStream(filePath, 'utf8');

//                 stream.on('data', (chunk) => {
//                     data += chunk;
//                 });

//                 stream.on('end', () => {
//                     try {
//                         resolve(JSON.parse(data)); // Parse JSON safely
//                     } catch (err) {
//                         reject(err);
//                     }
//                 });

//                 stream.on('error', (err) => {
//                     reject(err);
//                 });
//             });
//         };

//         // Read and merge JSON files asynchronously
//         const [students, marks, courses] = await Promise.all([
//             readFileAsJson(stdPath),
//             readFileAsJson(mrkPath),
//             readFileAsJson(crsPath)
//         ]);

//         // Send merged JSON as response
//         res.write(JSON.stringify({ students, marks, courses }));
//         res.end();

//     } catch (error) {
//         console.error('Stream Error:', error);
//         res.status(500).json({ error: 'Error streaming file' });
//     }
// };









// const fs = require('fs');
// const path = require('path');
// const { chain } = require('stream-chain');
// const { parser } = require('stream-json');
// const { streamArray } = require('stream-json/streamers/StreamArray');
// const JSONStream = require('JSONStream');

// exports.getStreamDataController = async (req, res) => {
//     try {
//         const stdPath = path.join(__dirname, '..', 'data', 'students.json');
//         const mrkPath = path.join(__dirname, '..', 'data', 'marks.json');
//         const crsPath = path.join(__dirname, '..', 'data', 'courses.json');

//         // Ensure all files exist before processing
//         if (![stdPath, mrkPath, crsPath].every(fs.existsSync)) {
//             return res.status(404).json({ error: 'One or more files not found' });
//         }

//         console.log("all files are existed");
        
//         res.setHeader('Content-Type', 'application/json');
//         res.setHeader('Transfer-Encoding', 'chunked');

//         // Create a readable stream for each file and pipe it to the response
//         const pipeJsonStream = (filePath) => {
//             console.log("file reading from:  " + filePath);
            
//             return fs.createReadStream(filePath)
//                 .pipe(parser()) // Parses JSON
//                 .pipe(streamArray()); // Streams array items
//         };

//         // Start streaming each JSON file into the response
//         res.write('{"students":[');  // Start the response JSON
//         let first = true;

//         // Stream the "students" data
//         const studentStream = pipeJsonStream(stdPath);
//         console.log("stream pipe line student: " + studentStream);
        
//         studentStream.on('data', ({ value }) => {
//             if (first) first = false;
//             else res.write(','); // Add a comma between items
//             res.write(JSON.stringify(value)); // Write each student item
//         });

//         studentStream.on('end', () => {
//             console.log("End the students array");
            
//             res.write('],');  // End the students array
//             res.write('"marks":['); // Start the marks array

//             // Stream the "marks" data
//             const marksStream = pipeJsonStream(mrkPath);
//             console.log("stream pipe line marks: " + marksStream);
//             marksStream.on('data', ({ value }) => {
//                 if (first) first = false;
//                 else res.write(',');
//                 res.write(JSON.stringify(value));
//             });

//             marksStream.on('end', () => {
//                 res.write('],'); // End the marks array
//                 res.write('"courses":['); // Start the courses array
                
//                 // Stream the "courses" data
//                 const coursesStream = pipeJsonStream(crsPath);
//                 console.log("stream pipe line courses: " + coursesStream);
//                 coursesStream.on('data', ({ value }) => {
//                     if (first) first = false;
//                     else res.write(',');
//                     res.write(JSON.stringify(value));
//                 });

//                 coursesStream.on('end', () => {
//                     res.write(']'); // End the courses array and the JSON response
//                     console.log("end all arrays and Json response");
                    
//                     res.end(); // End the response
//                 });
//             });
//         });

//         studentStream.on('error', (err) => {
//             console.error('Error streaming students data:', err);
//             res.status(500).json({ error: 'Error streaming students data' });
//         });

//     } catch (error) {
//         console.error('Stream Error:', error);
//         res.status(500).json({ error: 'Error streaming file' });
//     }
// };








// const fs = require('fs');
// const path = require('path');
// const { parser } = require('stream-json');
// const { streamArray } = require('stream-json/streamers/StreamArray');

// exports.getStreamDataController = async (req, res) => {
//     try {
//         const stdPath = path.join(__dirname, '..', 'data', 'students.json');
//         const mrkPath = path.join(__dirname, '..', 'data', 'marks.json');
//         const crsPath = path.join(__dirname, '..', 'data', 'courses.json');

//         // Ensure all files exist before processing
//         if (![stdPath, mrkPath, crsPath].every(fs.existsSync)) {
//             return res.status(404).json({ error: 'One or more files not found' });
//         }

//         res.setHeader('Content-Type', 'application/json');
//         res.setHeader('Transfer-Encoding', 'chunked');

//         // Function to stream JSON file
//         const streamJsonFile = (filePath, key, res) => {
//             return new Promise((resolve, reject) => {
//                 res.write(`"${key}": [`); // Start array for each dataset

//                 let first = true; // Track first element for proper JSON formatting

//                 const jsonStream = fs.createReadStream(filePath)
//                     .pipe(parser())
//                     .pipe(streamArray());

//                 jsonStream.on('data', ({ value }) => {
//                     if (!first) res.write(',');
//                     res.write(JSON.stringify(value));
//                     first = false;
//                 });

//                 jsonStream.on('end', () => {
//                     res.write(']'); // Close array
//                     resolve();
//                 });

//                 jsonStream.on('error', (err) => {
//                     reject(err);
//                 });
//             });
//         };

//         // Start streaming response
//         res.write('{'); // Start JSON object

//         await streamJsonFile(stdPath, 'students', res);
//         res.write(','); // Add comma between JSON objects

//         await streamJsonFile(mrkPath, 'marks', res);
//         res.write(',');

//         await streamJsonFile(crsPath, 'courses', res);

//         res.write('}'); // End JSON object
//         res.end(); // Complete response

//     } catch (error) {
//         console.error('Stream Error:', error);
//         res.status(500).json({ error: 'Error streaming file' });
//     }
// };








// const fs = require('fs');
// const path = require('path');
// const JSONStream = require('JSONStream');

// exports.getStreamDataController = (req, res) => {
//     try {

//         console.log(req +"&&&&&");
        
//         const stdPath = path.join(__dirname, '..', 'data', 'students.json');
//         const mrkPath = path.join(__dirname, '..', 'data', 'marks.json');
//         const crsPath = path.join(__dirname, '..', 'data', 'courses.json');

//         if (![stdPath, mrkPath, crsPath].every(fs.existsSync)) {
//             return res.status(404).json({ error: 'One or more files not found' });
//         }

//         res.setHeader('Content-Type', 'application/json');
//         res.setHeader('Transfer-Encoding', 'chunked');

//         res.write('{ "students": [');

//         const stream1 = fs.createReadStream(stdPath).pipe(JSONStream.parse('*'));
//         let firstStudent = true;

//         stream1.on('data', (data) => {
//             if (!firstStudent) res.write(',');
//             res.write(JSON.stringify(data));
//             firstStudent = false;
//         });

//         stream1.on('end', () => {
//             res.write('], "marks": [');

//             const stream2 = fs.createReadStream(mrkPath).pipe(JSONStream.parse('*'));
//             let firstMark = true;

//             stream2.on('data', (data) => {
//                 if (!firstMark) res.write(',');
//                 res.write(JSON.stringify(data));
//                 firstMark = false;
//             });

//             stream2.on('end', () => {
//                 res.write('], "courses": [');

//                 const stream3 = fs.createReadStream(crsPath).pipe(JSONStream.parse('*'));
//                 let firstCourse = true;

//                 stream3.on('data', (data) => {
//                     if (!firstCourse) res.write(',');
//                     res.write(JSON.stringify(data));
//                     firstCourse = false;
//                 });

//                 stream3.on('end', () => {
//                     res.write('] }'); // Close JSON object
//                     res.end();
//                 });

//                 stream3.on('error', (err) => {
//                     console.error('Error in courses.json:', err);
//                     res.write('] }'); // Ensure JSON closure
//                     res.end();
//                 });

//             });

//             stream2.on('error', (err) => {
//                 console.error('Error in marks.json:', err);
//                 res.write('], "courses": [] }'); // Close JSON properly
//                 res.end();
//             });

//         });

//         stream1.on('error', (err) => {
//             console.error('Error in students.json:', err);
//             res.write('{ "students": [], "marks": [], "courses": [] }');
//             res.end();
//         });

//     } catch (error) {
//         console.error('Stream Error:', error);
//         res.status(500).json({ error: 'Error streaming file' });
//     }
// };






// const fs = require('fs');
// const path = require('path');

// exports.getStreamDataController = async (req, res) => {
//     try {
//         const stdPath = path.join(__dirname, '..', 'data', 'students.json');
//         const mrkPath = path.join(__dirname, '..', 'data', 'marks.json');
//         const crsPath = path.join(__dirname, '..', 'data', 'courses.json');

//         // Ensure all files exist before processing
//         if (![stdPath, mrkPath, crsPath].every(fs.existsSync)) {
//             return res.status(404).json({ error: 'One or more files not found' });
//         }

//         res.setHeader('Content-Type', 'application/json');
//         res.setHeader('Transfer-Encoding', 'chunked');

//         // Function to read a JSON file and return parsed data
//         const readFileAsJson = (filePath) => {
//             return new Promise((resolve, reject) => {
//                 let data = '';
//                 const stream = fs.createReadStream(filePath, 'utf8');

//                 stream.on('data', (chunk) => {
//                     data += chunk;
//                 });

//                 stream.on('end', () => {
//                     try {
//                         resolve(JSON.parse(data)); // Parse JSON safely
//                     } catch (err) {
//                         reject(err);
//                     }
//                 });

//                 stream.on('error', (err) => {
//                     reject(err);
//                 });
//             });
//         };

//         // Read and merge JSON files asynchronously
//         const [students, marks, courses] = await Promise.all([
//             readFileAsJson(stdPath),
//             readFileAsJson(mrkPath),
//             readFileAsJson(crsPath)
//         ]);

//         // Send merged JSON as response
//         res.write(JSON.stringify({ students, marks, courses }));
//         res.end();

//     } catch (error) {
//         console.error('Stream Error:', error);
//         res.status(500).json({ error: 'Error streaming file' });
//     }
// };




