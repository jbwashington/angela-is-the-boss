'use strict';

// Proposals controller
angular.module('proposals').controller('ProposalsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Proposals',
	function($scope, $stateParams, $location, Authentication, Proposals) {
		$scope.authentication = Authentication;

		// Create new Proposal
		$scope.create = function() {
			// Create new Proposal object
			var proposal = new Proposals ({
				name: this.name
			});

			// Redirect after save
			proposal.$save(function(response) {
				$location.path('proposals/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Proposal
		$scope.remove = function(proposal) {
			if ( proposal ) { 
				proposal.$remove();

				for (var i in $scope.proposals) {
					if ($scope.proposals [i] === proposal) {
						$scope.proposals.splice(i, 1);
					}
				}
			} else {
				$scope.proposal.$remove(function() {
					$location.path('proposals');
				});
			}
		};

		// Update existing Proposal
		$scope.update = function() {
			var proposal = $scope.proposal;

			proposal.$update(function() {
				$location.path('proposals/' + proposal._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Proposals
		$scope.find = function() {
			$scope.proposals = Proposals.query();
		};

		// Find existing Proposal
		$scope.findOne = function() {
			$scope.proposal = Proposals.get({ 
				proposalId: $stateParams.proposalId
			});
		};
	}
]);