var keystone = require('keystone'),
	moment = require('moment'),
	RSVP = keystone.list('RSVP');

var Meetup = keystone.list('Meetup');
var Group = keystone.list('Group');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'meetups';
	locals.page.title = 'Meetups - SydJS';

    view.query('group',
        Group.model.findById(req.params.group)
    );
    
	view.query('upcomingMeetup',
		Meetup.model.findOne()
			.where('state', 'active')
            .where('group', req.params.group)
			.sort('-startDate')
	, 'talks[who]');
	
	view.query('pastMeetups',
		Meetup.model.find()
			.where('state', 'past')
			.where('group', req.params.group)
			.sort('-startDate')
	, 'talks[who]');
    
	view.on('render', function(next) {
	
		if (!req.user || !locals.upcomingMeetup) return next();
		
		RSVP.model.findOne()
			.where('who', req.user._id)
			.where('meetup', locals.upcomingMeetup)
			.exec(function(err, rsvp) {
				locals.rsvpStatus = {
					rsvped: rsvp ? true : false,
					attending: rsvp && rsvp.attending ? true : false
				}
				return next();
			});
			
	});
	
	view.render('site/meetups');
	
}
