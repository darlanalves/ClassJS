describe("Class - js classical implementation", function() {
	//beforeEach(function() {
	//	klass = new Class();
	//});

	it('should return a instance of Class', function() {
		expect(new Class() instanceof Class).toBe(true);
	});
});