var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	locals.section = 'contact';
	locals.page.title = 'Contact Us';
	
	locals.organisers = [
		
	]
	
	view.render('site/contact');
	
}
