var Schedule = require('../models/schedule.model');
var csv = require('csvtojson');
const { response } = require('../routes/ScheduleRoute');

const importSchedules = async (req, res) => {
    try {
        const scheduleData = [];
        const records = await csv().fromFile(req.file.path);

        for (const record of records) {
            const existingSchedule = await Schedule.findOne({
                studentId: record.studentId,
                instructorId: record.instructorId,
                classId: record.classId,
                date: record.date,
                action: record.action,
            });

            if (!existingSchedule) {
                scheduleData.push(record);
            }
        }

        if (scheduleData.length > 0) {
            await Schedule.insertMany(scheduleData);
        }
        res.send('CSV Schedules Data Imported successfully (Noted That): the schedules that already exists not added..');

    } catch (error) {
        res.send('You need to choose a file and a valid file type .csv or check if the data format is correct as the data saved from export');
    }
}


module.exports = {
    importSchedules
}