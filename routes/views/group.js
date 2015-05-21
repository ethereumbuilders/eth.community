var keystone = require('keystone'),
	moment = require('moment'),
	Group = keystone.list('Group'),
    Meetup = keystone.list('Meetup'),
    RSVP = keystone.list('RSVP');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res), 
    
    locals = res.locals;
	
	locals.section = 'groups';
	locals.page.title = 'Group';
	
	// LOAD the Meetup
    view.on('post', { action: 'join' }, function(next) {
        Group.model.findOneAndUpdate(
            {key: req.params.group},
            {$push: {members: locals.user._id}},
            {safe: true, upsert: true},
            function(err, model) {
                return next();
            }
        );
        
    });

    view.on('post', { action: 'leave' }, function(next) {
        Group.model.findOneAndUpdate(
            {key: req.params.group},
            {$pull: {members: locals.user._id}},
            {safe: true, upsert: true},
            function(err, model) {
                return next();
            }
        );

    });
        
	view.on('render', function(next) {
		Group.model.findOne()
			.where('key', req.params.group)
            .populate('members')
            .populate('organizers')
			.exec(function(err, group) {
				
				if (err) return res.err(err);
				if (!group) return res.notfound('Group not found');
				
                locals.group=group;
                locals.isMember=false;
                if (locals.user) {
                    if (group.members)
                        for (i = 0; i < group.members.length; i++) {
                            if (group.members[i].key == locals.user.key) {
                                locals.isMember = true;
                            }
                        }
                }

                Meetup.model.findOne()
                    .where('state', 'active')
                    .where('group', group.id)
                    .sort('-startDate')
                    .exec(function(err, meetup) {
                        console.log(meetup);
                        locals.meetup = meetup;
                        if (meetup) {
                            locals.meetup.populateRelated('talks[who] rsvps[who]', function () {
                                if (!req.user || !locals.meetup) return next();

                                RSVP.model.findOne()
                                    .where('who', req.user._id)
                                    .where('meetup', locals.meetup)
                                    .exec(function (err, rsvp) {
                                        locals.rsvpStatus = {
                                            rsvped: rsvp ? true : false,
                                            attending: rsvp && rsvp.attending ? true : false
                                        }
                                        return next();
                                    });
                            });
                        }
                        else next();
                    });
			});
	});
    	
	view.render('site/group');
	
}
