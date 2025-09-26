const fs = require('fs');
const express = require('express');
const multer = require('multer');

const app = express();
const upload = multer({dest: 'uploads/'});

app.get('/', (req, res) => {
    res.send('Hello, World!');
}   );

app.post('/profile', upload.single('profile-pic'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send(file);

})
app.post('/photos/uploads', upload.array('photos', 12), (req, res, next) => {
    const files = req.files;
    if (!files) {
        const error = new Error('Please upload files');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send(files);

})

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
