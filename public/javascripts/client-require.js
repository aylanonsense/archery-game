requirejs.config({
	baseUrl: 'javascripts',
	paths: {
		example: '/javascripts/example'
	}
});

requirejs([ 'example/Example' ], function(Example) {
	console.log("Loaded.");
});