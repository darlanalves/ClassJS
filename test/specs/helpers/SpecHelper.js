beforeEach(function() {
	this.addMatchers({
		toBeInstanceOf: function(expectedClass) {
			return this.actual instanceof expectedClass;
		}
	});
});