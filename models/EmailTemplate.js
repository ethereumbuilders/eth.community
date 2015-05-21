var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * EmailTemplates Model
 * ===========
 */

var EmailTemplate = new keystone.List('EmailTemplate', {
	map: { name: 'label' },
	track: true,
	autokey: { path: 'slug', from: 'label', unique: true }
});

EmailTemplate.add({
	name: { type: String, required: true, initial: true },
	subject: { type: String, required: true, initial: true },
	content: { type: Types.Text, required: true, initial: true }
});

EmailTemplate.defaultColumns = 'name, subject, content';
EmailTemplate.register();
