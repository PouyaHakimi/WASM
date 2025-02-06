const { rejects } = require("assert");
const { resolve } = require("path");
const fs = require('fs')


function writeJsonFile(filePath, data) {


    return new Promise((resolve, rejects) => {
        const wrireStream = fs.createWriteStream(filePath)

        wrireStream.on('finish', () => {
            console.log("Data has Wrriten IN JSON file Successfully!");
            resolve()
        })
        wrireStream.on('error', (err) => {
            console.error('Error in Writing to file' + err);
            rejects(err)
        })

        console.log("wite stream is open!");

        wrireStream.write("[\n")

        data.forEach((item, index) => {
            const jsonItem =JSON.stringify(item) 
            wrireStream.write(jsonItem + (index < data.length - 1 ? ",\n" : ""));
        });
        wrireStream.write("\n]");
        wrireStream.end()

    })
}
module.exports = writeJsonFile