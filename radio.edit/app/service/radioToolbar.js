angular.module('app')
	.service('radioToolbar', radioToolbar);

function radioToolbar($q)
{
	var self = {};
	self.navs = [];

	self.push = function(page)
	{
		self.navs.push(page);
	};

	self.pop = function()
	{
		self.navs.pop();
	};

	return self;
}
