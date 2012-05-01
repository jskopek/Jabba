$(document).ready(function(){

    test("initialize single simple jabba tab", function() {
        var el = $("<div/>");
        $("body").append(el);

        el.jabba(["Hello World"]);
        
        equal( el.find(".nav-tabs li").length(), 2);
        equal( el.find(".tab-content li").length(), 2);
        equal( el.find(".nav-tabs li").text(), "Hello World");

    });
});
