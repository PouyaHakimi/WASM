const fs = require('fs');
const path = require('path');

exports.getStreamDataController = async (req, res) => {
    try {
        const stdPath = path.join(__dirname, '..', 'data', 'students.json');
        const mrkPath = path.join(__dirname, '..', 'data', 'marks.json');
        const crsPath = path.join(__dirname, '..', 'data', 'courses.json');

        // Ensure all files exist before processing
        if (![stdPath, mrkPath, crsPath].every(fs.existsSync)) {
            return res.status(404).json({ error: 'One or more files not found' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Transfer-Encoding', 'chunked');

        // Function to read a JSON file and return parsed data
        const readFileAsJson = (filePath) => {
            return new Promise((resolve, reject) => {
                let data = '';
                const stream = fs.createReadStream(filePath, 'utf8');

                stream.on('data', (chunk) => {
                    data += chunk;
                });

                stream.on('end', () => {
                    try {
                        resolve(JSON.parse(data)); // Parse JSON safely
                    } catch (err) {
                        reject(err);
                    }
                });

                stream.on('error', (err) => {
                    reject(err);
                });
            });
        };

        // Read and merge JSON files asynchronously
        const [students, marks, courses] = await Promise.all([
            readFileAsJson(stdPath),
            readFileAsJson(mrkPath),
            readFileAsJson(crsPath)
        ]);

        // Send merged JSON as response
        res.write(JSON.stringify({ students, marks, courses }));
        res.end();

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

//         if (!fs.existsSync(stdPath)) {
//             return res.status(404).json({ error: 'File not found' });
//         }

//         res.setHeader('Content-Type', 'application/json');
//         res.setHeader('Transfer-Encoding', 'chunked');

//         const stream = fs.createReadStream(stdPath);
//         const stream2 = fs.createReadStream(mrkPath);
//         const stream3 = fs.createReadStream(crsPath);

//         stream.on('error', (error) => {
//             console.error('Stream Error:', error);
//             res.status(500).json({ error: 'Error streaming file' });
//         });
//         stream2.on('error', (error) => {
//             console.error('Stream Error:', error);
//             res.status(500).json({ error: 'Error streaming file' });
//         });
//         stream3.on('error', (error) => {
//             console.error('Stream Error:', error);
//             res.status(500).json({ error: 'Error streaming file' });
//         });

//         stream.pipe(res);
//         stream2.pipe(res);
//         stream3.pipe(res);

//     } catch (error) {
//         console.error('Stream Error:', error)
//         res.status(500).json({ error: 'Error streaming file' });
//     }

// }