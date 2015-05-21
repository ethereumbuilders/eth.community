var keystone = require('keystone'),
	moment = require('moment'),
    Group = keystone.list('Group')

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'groups';
	locals.page.title = 'Groups';

    var groups=Group.model.find();
    
    view.query('groups', groups );
    
	view.render('site/groups');
	
}
