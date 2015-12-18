angular.module('app')
	.service('radioToolbar', function radioToolbar($q)
{
	self = this;
	self.navs = [];

	self.push = function(page)
	{
		self.navs.push(page);
	};

	self.pop = function()
	{
		self.navs.pop();
	};
});
