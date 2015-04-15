'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var proposals = require('../../app/controllers/proposals.server.controller');

	// Proposals Routes
	app.route('/proposals')
		.get(proposals.list)
		.post(users.requiresLogin, proposals.create);

	app.route('/proposals/:proposalId')
		.get(proposals.read)
		.put(users.requiresLogin, proposals.hasAuthorization, proposals.update)
		.delete(users.requiresLogin, proposals.hasAuthorization, proposals.delete);

	// Finish by binding the Proposal middleware
	app.param('proposalId', proposals.proposalByID);
};
