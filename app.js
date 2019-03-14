const express = require('express');
const app = express();
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const port = 5000

// Initialize grid fs stream
let gfs;


//Middleware
app.use(bodyParser.json())
app.use(methodOverride('_method')) //Telling method override that we want to use a query string when we create our form in order to make a delete request
app.set('view engine', 'ejs');

//Mongo URI
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/gridfs';

//Create mongo connection
const conn = mongoose.createConnection(mongoURI);


conn.once('open', () => {
    // Init Stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');//uploads is our collection name
});


//Create storage w/ multer gridfs
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            //crypto.randomBytes is used to generate names that is 16 characters long
            crypto.randomBytes(16, (err, buf) => {
                if (err){
                    return reject(err);
                }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
            };
            resolve(fileInfo);

            });
        });
    }
});
const upload = multer({storage})


// mongoose.connect(DBURL, { useNewUrlParser: true }, (err, db) => {
//     assert.equal(err, null);
//     console.log('Successfully Connected to the Local Database.');
// });




app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => console.log('Server Started on 5000'));
