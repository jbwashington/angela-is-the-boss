'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Proposal = mongoose.model('Proposal'),
	_ = require('lodash');

/**
 * Create a Proposal
 */
exports.create = function(req, res) {
	var proposal = new Proposal(req.body);
	proposal.user = req.user;
        proposal: this.proposal;
	proposal.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proposal);
		}
	});
};

/**
 * Show the current Proposal
 */
exports.read = function(req, res) {
	res.jsonp(req.proposal);
};

/**
 * Update a Proposal
 */
exports.update = function(req, res) {
	var proposal = req.proposal ;

	proposal = _.extend(proposal , req.body);

	proposal.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proposal);
		}
	});
};

/**
 * Delete an Proposal
 */
exports.delete = function(req, res) {
	var proposal = req.proposal ;

	proposal.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proposal);
		}
	});
};

/**
 * List of Proposals
 */
exports.list = function(req, res) { 
	Proposal.find().sort('-created').populate('user', 'displayName').exec(function(err, proposals) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(proposals);
		}
	});
};

/**
 * Proposal middleware
 */
exports.proposalByID = function(req, res, next, id) { 
	Proposal.findById(id).populate('user', 'displayName').exec(function(err, proposal) {
		if (err) return next(err);
		if (! proposal) return next(new Error('Failed to load Proposal ' + id));
		req.proposal = proposal ;
		next();
	});
};

/**
 * Proposal authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.proposal.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
