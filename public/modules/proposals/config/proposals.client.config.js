'use strict';

// Configuring the Articles module
angular.module('proposals').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Proposals', 'proposals', 'dropdown', '/proposals(/create)?');
		Menus.addSubMenuItem('topbar', 'proposals', 'List Proposals', 'proposals');
		Menus.addSubMenuItem('topbar', 'proposals', 'New Proposal', 'proposals/create');
	}
]);