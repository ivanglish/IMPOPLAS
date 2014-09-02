describe( "Save articles", function () {
	
    describe( "get data to save", function () {
    	
    	it("get list of articles", function () {
            expect(getArticlesToSave()).toEqual(Array());
        });
    	
    	it("get screen settings", function () {
    		var obj= new Object();
    		obj.idscreenSettings=1;
    		obj.backgroundColor=undefined;
    		obj.headerColor=undefined;
            expect(getScreenSettingToSave()).toEqual(obj);
        });
    });
 
    describe( "make ajax call", function () {
 
    });
});