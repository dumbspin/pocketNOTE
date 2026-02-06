require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Event = require('../models/Event');
const connectDB = require('../config/db');

const holidays2026 = [
    { title: "New Year's Day", date: "2026-01-01", type: "holiday" },
    { title: "Martin Luther King Jr. Day", date: "2026-01-19", type: "holiday" },
    { title: "Valentine's Day", date: "2026-02-14", type: "holiday" },
    { title: "Presidents' Day", date: "2026-02-16", type: "holiday" },
    { title: "St. Patrick's Day", date: "2026-03-17", type: "holiday" },
    { title: "Easter Sunday", date: "2026-04-05", type: "holiday" },
    { title: "Mother's Day", date: "2026-05-10", type: "holiday" },
    { title: "Memorial Day", date: "2026-05-25", type: "holiday" },
    { title: "Father's Day", date: "2026-06-21", type: "holiday" },
    { title: "Independence Day", date: "2026-07-04", type: "holiday" },
    { title: "Labor Day", date: "2026-09-07", type: "holiday" },
    { title: "Halloween", date: "2026-10-31", type: "holiday" },
    { title: "Veterans Day", date: "2026-11-11", type: "holiday" },
    { title: "Thanksgiving Day", date: "2026-11-26", type: "holiday" },
    { title: "Christmas Day", date: "2026-12-25", type: "holiday" }
];

const seedEvents = async () => {
    try {
        await connectDB();
        
        // Optional: clear existing holidays to avoid duplicates if re-run
        // await Event.deleteMany({ type: 'holiday' }); 

        for (const holiday of holidays2026) {
            const exists = await Event.findOne({ 
                title: holiday.title, 
                date: new Date(holiday.date) 
            });

            if (!exists) {
                await Event.create(holiday);
                console.log(`Added: ${holiday.title}`);
            } else {
                console.log(`Skipped (Exists): ${holiday.title}`);
            }
        }

        console.log('Seeding completed.');
        process.exit();
    } catch (error) {
        console.error('Error seeding events:', error);
        process.exit(1);
    }
};

seedEvents();
