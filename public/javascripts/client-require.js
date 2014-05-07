requirejs.config({
	baseUrl: 'javascripts',
	paths: {
		example: '/javascripts/example'
	}
});

requirejs([ 'Main' ], function(Main) {
	Main();
});