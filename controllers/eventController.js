/**
 * Event controller
 */
const mongoose = require('mongoose');

require('../models/Event');
require('../models/User');
require('../models/Log');
const Event = mongoose.model('events');
const User = mongoose.model('users');
const Log = mongoose.model('logs');

// JSON response utility function
const respond = function(res, status, content) {
    res.status(status);
    res.json(content);
};

async function create(req, res, next) {
    if (!req.body.title || !req.body.description || !req.body.hashtags 
        || !req.body.owner || !req.body.location || !req.body.date) {
        respond(res, 400, 'The request is missing some data');
        next();
    } else {
        try {
            if(req.body.create) { // create new event
                const event = await Event.findOne({title: req.body.title});
                if (event && req.body.create) {
                    respond(res, 409, 'That event already exists in the system');
                    next();
                } else {
                    const requestBody = req.body;
                    const owner = await User.findOne({username:requestBody.owner});
                    if(!owner) {
                        respond(res, 404, 'Owner not found');
                    } else {
                        const event = new Event(requestBody);
                        await event.save();
                        const log = new Log({
                            action:event.owner + ' has created the event ' + event.title,
                            date: new Date(),
                            link: 'localhost:8080/event/'+event._id
                        })
                        log.save();
                        respond(res, 201, {event});
                    }
                }  
            } else { // update event
                if(!req.body.id) {
                    respond(res, 400, 'Missing event id');
                } else {
                    console.log(req.body);
                    const event = await Event.findOne({_id: req.body.id});
                    if (!event) {
                        respond(res, 404, 'Event not found');
                        next();
                    } else {
                        event['title'] = req.body.title;
                        event['description'] = req.body.description;
                        event['hashtags'] = req.body.hashtags;
                        event['private'] = req.body.private;
                        event['location'] = req.body.location;
                        event['date'] = req.body.date;
                        const conditions = { _id: req.body.id }, update = { 
                            title: req.body.title,
                            description: req.body.description,
                            hasgtags: req.body.hashtags,
                            private: req.body.private,
                            location: req.body.location,
                            date: req.body.date
                        }, options = { multi: false };
                        await Event.update(conditions, update, options);
                        const log = new Log({
                            action:event.owner + ' has updated ' + event.title + ' information',
                            date: new Date(),
                            link: 'localhost:8080/event/'+req.body.id
                        })
                        log.save();
                        respond(res, 200, {event});
                    }
                }
            }
        } catch (e) {
            console.log('Error :', e);
            next(e);
        }
    }
}

async function getEvents(req, res, next) {
    if(!req.query.filter || !req.query.user) {
        respond(res, 400, 'Bad request for get events');
        next();
    }
    let events;
    switch (req.query.filter) {
        case 'ALL':
            events = await Event.find();
            break;
        case 'ACTIVE':
            events = await Event.find({active: true});
            break;
        case 'ENROLLED':
            events = await Event.find({$or:[ {attendees: {$elemMatch:{enroll:{ $gte: req.query.user }}}},{owner: req.query.user}]});
            break;
        case 'TOP':
            console.log('HUE');
            events = await Event.find().sort([['stars', 'descending']]);
            break;
        case 'OWNED':
            events = await Event.find({owner: req.query.user});
            break;
        case 'ID':
            events = await Event.findOne({_id: req.query.id});
            break;
    }
    if (!events) {
        respond(res, 404, 'There are no events in the db');
        next();
    } else {
        try {
            respond(res, 200, {events});
        } catch (e) {
            console.log('Error :', e);
            next(e);
        }
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
        const conditions = { _id: req.body.id }, update = { image: req.body.image }, options = { multi: false };
        await Event.update(conditions, update, options);
        const log = new Log({
            action:event.owner + ' has updated ' + event.title + ' main photo',
            date: new Date(),
            link: 'localhost:8080/event/'+req.body.id
        })
        log.save();
        respond(res, 200, {event});
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

async function enrollToEvent(req, res, next) {
    try {
        if(!req.body.username || !req.body.eventId){
            respond(res, 400, 'Bad request to enroll event');
        } else {
            const event = await Event.findOne({_id: req.body.eventId});
            const user = await User.findOne({username: req.body.username});
            if(!event || !user){
                respond(res, 404, 'Not found');
            } else {
                event.attendees.push(req.body.username);
                event.save();
                const log = new Log({
                    action:user.username + ' has enrolled to ' + event.title,
                    date: new Date(),
                    link: 'localhost:8080/event/'+req.body.eventId
                })
                log.save();
                respond(res, 200, {event});
            }
        }
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

async function unenrollToEvent(req, res, next) {
    try {
        if(!req.body.username || !req.body.eventId){
            respond(res, 400, 'Bad request to unenroll to event');
        } else {
            const event = await Event.findOne({_id: req.body.eventId});
            const user = await User.findOne({username: req.body.username});
            if(!event || !user){
                respond(res, 404, 'Not found');
            } else {
                event.attendees.pull(req.body.username);
                event.save();
                const log = new Log({
                    action:user.username + ' has unenrolled from ' + event.title,
                    date: new Date(),
                    link: 'localhost:8080/event/'+req.body.eventId
                })
                log.save();
                respond(res, 200, {event});
            }
        }
    } catch (e) {
        console.log('Error :', e);
        next(e);
    }
}

module.exports = { create, getEvents, updateEventImage, enrollToEvent, unenrollToEvent };
