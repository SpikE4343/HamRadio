angular.module('app')
	.service('radioToolbar', ['$q', radioToolbar]);

function radioToolbar($q)
{
	self = this;
	self.navs = [];

	function pushNav(page)
	{
		self.navs.push(page);
	}

	function popNav()
	{
		self.navs.unshift();
	}

	return {
		pushNav: pushNav,
		popNav: popNav
		navs: self.navs;
	};
}
