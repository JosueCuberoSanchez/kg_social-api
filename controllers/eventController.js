/**
 * Event controller
 */
const mongoose = require('mongoose');

// Models
require('../models/Event');
require('../models/User');
require('../models/Log');
require('../models/Attendee');
const Event = mongoose.model('events');
const User = mongoose.model('users');
const Log = mongoose.model('logs');
const Attendee = mongoose.model('attendees');

// Helpers
const EmailSender = require('../helpers/functions');

// JSON response utility function
const respond = function(res, status, content) {
    res.status(status);
    res.json(content);
};

async function createEvent(req, res, next) {
    if (!req.body.title || !req.body.description || !req.body.hashtags || !req.body.owner || !req.body.location || !req.body.date) {
        respond(res, 400, 'The request is missing some data');
        next();
    } else {
        try {
            const eventCheck = await Event.findOne({title: req.body.title}); // check if title is used
            if (eventCheck) {
                respond(res, 409, 'That event already exists in the system');
                next();
            } 
            const owner = await User.findOne({_id:req.body.owner});
            if(!owner) {
                respond(res, 404, 'Owner not found');
                next();
            }
            // create event
            const event = new Event(req.body);
            await event.save();

            // save owner as an attendee to the event
            const attendee = new Attendee({ 
                user: owner._id,
                event: event._id
            });
            await attendee.save();

            // Get event attendees
            const attendees = await Attendee.find({event: event._id});

            if(!event.private) {
                // Save event creation to log
                const log = new Log({
                    action:event.owner + ' has created the event ' + event.title,
                    date: new Date(),
                    link: 'event/'+event._id,
                    author: owner._id
                })
                log.save();
            }

            // Respond with event & attendees
            respond(res, 201, {event: event, attendees: attendees});
            next(); 
        } catch (e) {
            console.log('Error :', e);
            next(e);
        }
    }
}

async function updateEvent(req, res, next) {
    try {
        if(!req.body.id) {
            respond(res, 400, 'Missing event id');
            next();
        }

        // Update event
        let event = await Event.findByIdAndUpdate(req.body.id, req.body.body).exec();
        event = await Event.findOne({_id: req.body.id});

        // Add an event update to logs
        const owner = await User.findOne({_id: event.owner});
        const log = new Log({
            action:owner.username + ' has updated ' + event.title + ' information',
            date: new Date(),
            link: 'event/'+req.body.id,
            author: owner._id
        });
        log.save();

        // Respond
        respond(res, 200, {event: event});
        next();
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

async function deleteEvent(req, res, next) {
    try {
        if(req.query.id === null) {
            respond(res, 400, 'Missing event id');
            next();
        }

        let event = await Event.findOne({_id: req.query.id}).populate('owner','username');
        console.log(event);

        // Add an event delete to logs
        const log = new Log({
            action: event.owner.username + ' has canceled ' + event.title,
            date: new Date(),
            link: 'dashboard/all/',
            author: event.owner._id
        });
        log.save();

        const attendees = await Attendee.find({event: event._id}).populate('user', 'email firstName');

        EmailSender.sendEventCancelledEmails(attendees, event.title);

        Event.find({_id: req.query.id}).remove().exec();

        // Respond
        respond(res, 200, {event: event});
        next();
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

async function getEvents(req, res, next) {
    try {
        if(!req.query.filter || !req.query.user) {
            respond(res, 400, 'Bad request for get events');
            next();
        }
        let events;
        let attendees;
        switch (req.query.filter) {
            case 'all':
                events = await Event.find({private: false});
                break;
            case 'active':
                events = await Event.find({active: true});
                break;
            case 'enrolled':
                const enrolledEvents = await Attendee.find({username: req.query.user}); // get attendee events
                // get the event from each of those
                let event;
                events = [];
                for(var i in enrolledEvents) {
                    event = await Event.findOne({_id: enrolledEvents[i].event});
                    events.push(event);
                }
                break;
            case 'top':
                events = await Event.find({private: false}).sort([['stars', 'descending']]);
                break;
            case 'owned':
                events = await Event.find({owner: req.query.user});
                break;
            case 'id':
                events = await Event.findOne({_id: req.query.id});
                attendees = await Attendee.find({event: req.query.id}).populate('user','username image');
                break;
        }
        if (!events) {
            respond(res, 404, 'There are no events in the db');
            next();
        }
        if(req.query.filter === 'id'){
            respond(res, 200, {event: events, attendees: attendees});
        } else {
            respond(res, 200, {events});
        }
        next();  
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

async function updateEventImage(req, res, next) {
    try {
        if(!req.body.image || !req.body.id) {
            respond(res, 400, 'Bad request for image update');
            next();
        }
        const event = await Event.findOne({_id: req.body.id});
        event['image'] = req.body.image;
        if (!event) {
            respond(res, 404, 'Event not found');
            next();
        }

        // Update event
        const conditions = { _id: req.body.id }, update = { image: req.body.image }, options = { multi: false };
        await Event.update(conditions, update, options);

        // Make image update log
        const owner = await User.findOne({username: event.owner});
        const log = new Log({
            action:owner.username + ' has updated ' + event.title + ' main photo',
            date: new Date(),
            link: 'event/'+req.body.id,
            author: owner._id
        })
        log.save();

        // Respond
        respond(res, 200, {event});
        next();
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

async function updateEventPics(req, res, next) {
    try {
        if(!req.body.image || !req.body.id) {
            respond(res, 400, 'Bad request for image update');
            next();
        }
        const event = await Event.findOne({_id: req.body.id});
        if (!event) {
            respond(res, 404, 'Event not found');
            next();
        }

        // Add the image
        event.images.push(req.body.image);
        event.save();

        // Make image update log
        const owner = await User.findOne({_id: event.owner});
        const log = new Log({
            action:owner.username + ' has uploaded a photo for ' + event.title,
            date: new Date(),
            link: 'event/'+req.body.id,
            author: owner._id
        });
        log.save();

        // Respond
        respond(res, 200, {event});
        next();
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

async function enrollToEvent(req, res, next) {
    try {
        if(!req.body.username || !req.body.eventId){
            respond(res, 400, 'Bad request to enroll event');
            next();
        }
        const event = await Event.findOne({_id: req.body.eventId});
        const user = await User.findOne({username: req.body.username});
        if(!event || !user){
            respond(res, 404, 'Not found');
            next();
        }

        // Create attendee
        const attendee = new Attendee({
            username: user.username,
            image: user.image,
            event: event._id
        });
        await attendee.save();

        // Get attendees
        const attendees = await Attendee.find({event: req.body.eventId});
        const log = new Log({
            action:user.username + ' has enrolled to ' + event.title,
            date: new Date(),
            link: 'event/'+req.body.eventId,
            author: user._id
        })
        log.save();

        // Respond
        respond(res, 200, {attendees});
        next();
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

async function unenrollToEvent(req, res, next) {
    try {
        if(!req.body.username || !req.body.eventId) {
            respond(res, 400, 'Bad request to unenroll to event');
            next();
        }
        const event = await Event.findOne({_id: req.body.eventId});
        const user = await User.findOne({username: req.body.username});
        if(!event || !user) {
            respond(res, 404, 'Not found');
            next();
        }

        // Remove from attendees
        Attendee.find({username: req.body.username}).remove().exec();

        // Get attendees
        const attendees = await Attendee.find({event: req.body.eventId});

        // Create unenroll log
        const log = new Log({
            action:user.username + ' has unenrolled from ' + event.title,
            date: new Date(),
            link: 'event/'+req.body.eventId,
            author: user._id
        })
        log.save();

        // Respond
        respond(res, 200, {attendees});
        next();
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

async function getAttendees(req, res, next) {
    try {
        if(!req.query.id){
            respond(res, 400, 'Bad request, missing event id');
            next();
        }
        const event = await Event.findOne({_id: req.query.id});
        if(!event){
            respond(res, 404, 'Event not found');
            next();
        }

        // Get attendees
        const attendees = await Attendee.find({event: req.query.id}).populate('user','username');
        console.log(attendees);

        // Respond
        respond(res, 200, {attendees});
        next();
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

async function inviteUsers(req, res, next) {
    try {
        let user;
        const event = await Event.findOne({_id: req.body.event});
        if(!event) {
            respond(res, 404, 'Event not found');
            next();
        }
        const users = req.body.users;
        let code;
        for(let i in users) {
            user = await User.findOne({email: users[i].email});
            if(user){
                EmailSender.sendInviteEmail(user.firstName, users[i].email, event.owner, event.title);
            }
        }
        respond(res, 200, 'Users invited');
        next();
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

module.exports = { createEvent, updateEvent, getEvents, updateEventImage, updateEventPics, 
    enrollToEvent, unenrollToEvent, getAttendees, inviteUsers, deleteEvent };
