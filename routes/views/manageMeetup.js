var keystone = require('keystone'),
	moment = require('moment'),
	Group = keystone.list('Group'),

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res), 
    
    locals = res.locals;
	
	locals.section = 'meetups';
	locals.page.title = 'Add meetup';

    view.on('init', function(next) {
        next();
    });
    
    view.on('post', { action: 'join' }, function(next) {
        next();
    });
    
	view.on('render', function(next) {
        next();
	});
	
	view.render('site/manageMeetup');
	
}
