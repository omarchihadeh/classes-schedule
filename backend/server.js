const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { createReadStream } = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);
const moment = require('moment');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, autoIndex: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})


app.get('/', (req, res) => {
    res.send('Express server connection established successfully!');
});

const schedulesRouter = require('./routes/schedules');

app.use('/schedules', schedulesRouter);

app.get('/download', async (req, res) => {
    const cursor = await mongoose.connection.db.collection('schedules').find();
    const csvWriter = createCsvWriter({
        path: 'schedules.csv',
        header: [
            { id: 'registrationId', title: 'registrationId' },
            { id: 'studentId', title: 'studentId' },
            { id: 'instructorId', title: 'instructorId' },
            { id: 'classId', title: 'classId' },
            { id: 'date', title: 'date' },
            { id: 'action', title: 'action' },
        ]
    });

    const data = [];

    await cursor.forEach((schedule) => {
        data.push({
            registrationId: schedule.registrationId,
            studentId: schedule.studentId,
            instructorId: schedule.instructorId,
            classId: schedule.classId,
            date: moment(schedule.date).format('YYYY-MM-DDTHH:mm:ss'),
            action: schedule.action,
        });
    });

    await csvWriter.writeRecords(data);

    const stream = createReadStream('schedules.csv');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=schedules.csv');
    await pipeline(stream, res);
});

var scRoute = require('./routes/ScheduleRoute');

app.use('/',scRoute);

app.listen(port, () => {
    console.log(`Server is running on port: http://localhost:${port}`);
});
