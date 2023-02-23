const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
let Schedule = require('../models/schedule.model');

router.route('/').get((req, res) => {
    Schedule.find()
        .then(schedules => res.json(schedules))
        .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/add').post((req, res) => {
    const studentId = req.body.studentId;
    const instructorId = req.body.instructorId;
    const classId = req.body.classId;
    const date = Date.parse(req.body.date);
    const action = req.body.action;

    const MAX_CLASSES_PER_DAY = process.env.MAX_CLASSES_PER_DAY;
    const CLASS_DURATION_MINUTES = process.env.CLASS_DURATION_MINUTES;

    const scheduledClassesByStudent = new Map();
    // if student reach the max number of classes per day
    if (scheduledClassesByStudent.has(studentId)) {
        const scheduledClasses = scheduledClassesByStudent.get(studentId);
        if (scheduledClasses >= MAX_CLASSES_PER_DAY) {
            return res.status(400).json(`Error: Student has already scheduled the maximum number of classes for the day (${MAX_CLASSES_PER_DAY})`);
        }
    }

    scheduledClassesByStudent.set(studentId, (scheduledClassesByStudent.get(studentId) || 0) + 1);

    const scheduledClassesByInstructor = new Map();
    // if instructor reach the max number of classes per day
    if (scheduledClassesByInstructor.has(instructorId)) {
        const scheduledClasses = scheduledClassesByInstructor.get(instructorId);
        if (scheduledClasses >= MAX_CLASSES_PER_DAY) {
            return res.status(400).json(`Error: Instructor has already scheduled the maximum number of classes for the day (${MAX_CLASSES_PER_DAY})`);
        }
    }

    scheduledClassesByInstructor.set(instructorId, (scheduledClassesByInstructor.get(instructorId) || 0) + 1);

    // if the same class already scheduled in the same time-slot with same student
    Schedule.findOne({
        studentId,
        date: {
            $gte: new Date(date),
            $lt: new Date(date + CLASS_DURATION_MINUTES * 60000),
        },
    }, (err, existingSchedule) => {
        if (err) {
            return res.status(400).json('Error: ' + err);
        }

        if (existingSchedule) {
            return res.status(400).json('Error: Schedule conflicts with Student / Student & Instructor in existing schedule! And the Time Class is 60 minutes. So schedule the class after 60 minutes or before 60 mins from the time for scheduled class..');
        }

        // if the same class already scheduled in the same time-slot with same instructor 
        Schedule.findOne({
            instructorId,
            date: {
                $gte: new Date(date),
                $lt: new Date(date + CLASS_DURATION_MINUTES * 60000),
            },
        }, (err, existingSchedule) => {
            if (err) {
                return res.status(400).json('Error: ' + err);
            }

            if (existingSchedule) {
                return res.status(400).json('Error: Schedule conflicts with Instructor / Instructor & Student in existing schedule! And the Time Class is 60 minutes. So schedule the class after 60 minutes or before 60 mins from the time for scheduled class..');
            }

            // if true add class
            const newSchedule = new Schedule({
                registrationId: uuidv4(),
                studentId,
                instructorId,
                classId,
                date,
                action,
            });

            newSchedule.save()
                .then(() => res.json(`Schedule added successfully with a unique registration id: ${newSchedule.registrationId}`))
                .catch(err => res.status(400).json('Error: ' + err));
        });
    });
});


router.route('/:id').get((req, res) => {
    Schedule.findById(req.params.id)
        .then(schedule => res.json(schedule))
        .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/:id').delete((req, res) => {
    Schedule.findByIdAndDelete(req.params.id)
        .then(() => res.json('Schedule deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:registrationId').put(async (req, res) => {
    const { studentId, instructorId, classId, date, action } = req.body;

    // Check if the new schedule conflicts with an existing schedule
    const existingScheduleI = await Schedule.findOne({
        $and: [
            { date: Date.parse(date) },
            {
                $or: [
                    { instructorId: instructorId }
                ]
            }
        ]
    });

    // Check if the new schedule conflicts with an existing schedule
    const existingScheduleS = await Schedule.findOne({
        $and: [
            { date: Date.parse(date) },
            {
                $or: [
                    { studentId: studentId }
                ]
            }
        ]
    });
    if (existingScheduleI && existingScheduleI.registrationId !== req.params.registrationId) {
        return res.status(400).json('A schedule already exists for the same time-slot with the same instructor');
    }

    if (existingScheduleS && existingScheduleS.registrationId !== req.params.registrationId) {
        return res.status(400).json('A schedule already exists for the same time-slot with the same student');
    }

    Schedule.findOneAndUpdate({ registrationId: req.params.registrationId }, {
        studentId,
        instructorId,
        classId,
        date: Date.parse(date),
        action,
    }, { new: true })
        .then(schedule => {
            if (!schedule) {
                return res.status(404).json('Schedule not found');
            }
            res.json(schedule);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/updatecancel/:registrationId').put((req, res) => {
    const { studentId, instructorId, classId, date, action } = req.body;



    Schedule.findOneAndUpdate({ registrationId: req.params.registrationId }, {
        studentId,
        instructorId,
        classId,
        date: Date.parse(date),
        action,
    }, { new: true })
        .then(schedule => {
            if (!schedule) {
                return res.status(404).json('Schedule not found');
            }
            res.json(schedule);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
