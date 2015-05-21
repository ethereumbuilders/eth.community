var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Groups Model
 * ===========
 */

var Group = new keystone.List('Group', {
    track: true,
    autokey: { path: 'key', from: 'name', unique: true }
});

Group.add({
	name: { type: Types.Text },
	location: { type: Types.Location },
	members: { type: Types.Relationship, ref: 'User', many: true, index: true },
	organizers: { type: Types.Relationship, ref: 'User', many: true, index: true }
});


/**
 * Hooks
 * =====
 */

Group.schema.pre('save', function(next) {
	if (!this.isModified('changedAt')) {
		this.changedAt = Date.now();
	}
	next();
});

Group.schema.post('save', function() {
	
});
Group.schema.post('remove', function() {
	
})


// Virtuals
// ------------------------------

Group.schema.virtual('url').get(function() {
    return '/groups/' + this.key;
});

/**
 * Registration
 * ============
 */

Group.defaultColumns = 'createdAt';
Group.defaultSort = '-createdAt';
Group.register();
