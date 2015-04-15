'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Proposal = mongoose.model('Proposal'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, proposal;

/**
 * Proposal routes tests
 */
describe('Proposal CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Proposal
		user.save(function() {
			proposal = {
				name: 'Proposal Name'
			};

			done();
		});
	});

	it('should be able to save Proposal instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Proposal
				agent.post('/proposals')
					.send(proposal)
					.expect(200)
					.end(function(proposalSaveErr, proposalSaveRes) {
						// Handle Proposal save error
						if (proposalSaveErr) done(proposalSaveErr);

						// Get a list of Proposals
						agent.get('/proposals')
							.end(function(proposalsGetErr, proposalsGetRes) {
								// Handle Proposal save error
								if (proposalsGetErr) done(proposalsGetErr);

								// Get Proposals list
								var proposals = proposalsGetRes.body;

								// Set assertions
								(proposals[0].user._id).should.equal(userId);
								(proposals[0].name).should.match('Proposal Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Proposal instance if not logged in', function(done) {
		agent.post('/proposals')
			.send(proposal)
			.expect(401)
			.end(function(proposalSaveErr, proposalSaveRes) {
				// Call the assertion callback
				done(proposalSaveErr);
			});
	});

	it('should not be able to save Proposal instance if no name is provided', function(done) {
		// Invalidate name field
		proposal.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Proposal
				agent.post('/proposals')
					.send(proposal)
					.expect(400)
					.end(function(proposalSaveErr, proposalSaveRes) {
						// Set message assertion
						(proposalSaveRes.body.message).should.match('Please fill Proposal name');
						
						// Handle Proposal save error
						done(proposalSaveErr);
					});
			});
	});

	it('should be able to update Proposal instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Proposal
				agent.post('/proposals')
					.send(proposal)
					.expect(200)
					.end(function(proposalSaveErr, proposalSaveRes) {
						// Handle Proposal save error
						if (proposalSaveErr) done(proposalSaveErr);

						// Update Proposal name
						proposal.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Proposal
						agent.put('/proposals/' + proposalSaveRes.body._id)
							.send(proposal)
							.expect(200)
							.end(function(proposalUpdateErr, proposalUpdateRes) {
								// Handle Proposal update error
								if (proposalUpdateErr) done(proposalUpdateErr);

								// Set assertions
								(proposalUpdateRes.body._id).should.equal(proposalSaveRes.body._id);
								(proposalUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Proposals if not signed in', function(done) {
		// Create new Proposal model instance
		var proposalObj = new Proposal(proposal);

		// Save the Proposal
		proposalObj.save(function() {
			// Request Proposals
			request(app).get('/proposals')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Proposal if not signed in', function(done) {
		// Create new Proposal model instance
		var proposalObj = new Proposal(proposal);

		// Save the Proposal
		proposalObj.save(function() {
			request(app).get('/proposals/' + proposalObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', proposal.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Proposal instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Proposal
				agent.post('/proposals')
					.send(proposal)
					.expect(200)
					.end(function(proposalSaveErr, proposalSaveRes) {
						// Handle Proposal save error
						if (proposalSaveErr) done(proposalSaveErr);

						// Delete existing Proposal
						agent.delete('/proposals/' + proposalSaveRes.body._id)
							.send(proposal)
							.expect(200)
							.end(function(proposalDeleteErr, proposalDeleteRes) {
								// Handle Proposal error error
								if (proposalDeleteErr) done(proposalDeleteErr);

								// Set assertions
								(proposalDeleteRes.body._id).should.equal(proposalSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Proposal instance if not signed in', function(done) {
		// Set Proposal user 
		proposal.user = user;

		// Create new Proposal model instance
		var proposalObj = new Proposal(proposal);

		// Save the Proposal
		proposalObj.save(function() {
			// Try deleting Proposal
			request(app).delete('/proposals/' + proposalObj._id)
			.expect(401)
			.end(function(proposalDeleteErr, proposalDeleteRes) {
				// Set message assertion
				(proposalDeleteRes.body.message).should.match('User is not logged in');

				// Handle Proposal error error
				done(proposalDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Proposal.remove().exec();
		done();
	});
});