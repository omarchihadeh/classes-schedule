const express = require("express");
const sc = express();

const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');



sc.use(bodyParser.urlencoded({ extended: true }));
sc.use(express.static(path.resolve(__dirname, 'public')));

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, req.body.destination || '../backend/public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage });

const ScheduleController = require('../controllers/ScheduleController');

sc.post('/importSchedules', upload.single('file'), ScheduleController.importSchedules);

module.exports = sc;
