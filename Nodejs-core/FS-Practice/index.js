const fs = require('fs');
const text = "Hello, Node.js File System!";

// fs.writeFileSync('notes.txt', text);
// console.log('File written successfully.');

// const data = fs.readFileSync('notes.txt', 'utf-8');
// console.log('Here is the content of the file:');
// console.log(data);

// fs.appendFile('notes.txt', " Learning Node.js is fun!", (err) => {
//     if (err) throw err;
//     console.log('Text appended successfully.');
// }
// );
// fs.readFile('notes.txt', 'utf-8', (err, data) => {
//     if (err) throw err;
//     console.log('Here is the updated content of the file:');
//     console.log(data);
// }
// );

// fs.rename('notes.txt', 'myNotes.txt', (err) => {
//     if (err) console.log(err.message);
//     else
//     console.log('File renamed successfully.');}
// )

// fs.readFile('myNotes.txt', 'utf-8', (err, data) => {
//     if (err) throw err;
//     console.log('Here is the content of the renamed file:');
//     console.log(data);
// }
// );

// fs.unlink('myNotes.txt', (err) => {
//     if (err) console.log(err.message);
//     else console.log('File deleted successfully.');
// })
fs.readFile('myNotes.txt', 'utf-8', (err, data) => {
    if (err) console.log(err.message);
    else {
    console.log('Here is the content of the renamed file:');
    console.log(data);
    }
}
);
