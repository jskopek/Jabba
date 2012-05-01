$(document).ready(function(){

    test("initialize single simple jabba tab", function() {
        var el = $("<div id='tst'></div>");

        el.jabba(["Hello World"]);
        
        equal( el.find(".nav-tabs li").length, 1);
        equal( el.find(".tab-content .tab-pane").length, 1);
        equal( el.find(".nav-tabs li").text(), "Hello World");

    });

    test("initialize multi simple jabba tab", function() {
        var el = $("<div id='tst'></div>");

        el.jabba(["Hello World", "Testing", "This"]);
        
        equal( el.find(".nav-tabs li").length, 3);
        equal( el.find(".tab-content .tab-pane").length, 3);
        equal( el.find(".nav-tabs li:last").text(), "This");

    });

    test("initialize complex tabs", function() {
        var el = $("<div id='tst'></div>");
        var content_el = $("<div id=''>Here's some content</div>");

        el.jabba([
            {
                "title": "Home",
                "id": "custom_home_id",
                "el": content_el //sets the content of the Home tab to #home_el on creation
            },
            {
                "title": "Profile",
                "id": "custom_profile_id"
            },
            "Messages"
        ]);
        
        equal( el.find(".nav-tabs li").length, 3);
        equal( el.find(".tab-content .tab-pane").length, 3);
        equal( el.find(".nav-tabs li:first").text(), "Home");
        equal( el.find(".tab-content .tab-pane:first").text(), content_el.text());
        equal( el.find(".nav-tabs li:last").text(), "Messages");
    });

    test("get elements", function() {
        var el = $("<div id='tst'></div>");

        el.jabba(["Hello World", "Testing", "This"]);
        var els = el.jabba("els");
        
        equal( els.length, 3);
        deepEqual( els[2], el.find(".tab-content .tab-pane:last")[0] );
    });

    test("get element", function() {
        var el = $("<div id='tst'></div>");

        el.jabba(["Hello World", "Testing", "This"]);

        var el1 = el.jabba("el", "hello_world");
        deepEqual( el1[0], el.find(".tab-content .tab-pane:first")[0] );

        var el2 = el.jabba("el", "this");
        deepEqual( el2[0], el.find(".tab-content .tab-pane:last")[0] );

        var el3 = el.jabba("el", "invalid");
        ok( !el3.length );
    });

    test("test auto jabba ids", function() {
        var el = $("<div/>");
        el.jabba(["Hello World"]);
        equal( el.find(".tab-content .tab-pane").attr("id"), "hello_world");

        var el = $("<div/>");
        el.jabba([" multiple SPACES AND things    Hello World   "]);
        equal( el.find(".tab-content .tab-pane").attr("id"), "multiple_spaces_and_things_hello_world");

        var el = $("<div/>");
        el.jabba(["12 numbers$*)#"]);
        equal( el.find(".tab-content .tab-pane").attr("id"), "12_numbers");
    });
    test("test manual jabba ids", function() {
        var el = $("<div/>");
        el.jabba([{"title": "Hello World", "id": "test_id"}, "Test Two"]);
        equal( el.find(".tab-content .tab-pane:first").attr("id"), "test_id");
        equal( el.find(".tab-content .tab-pane:last").attr("id"), "test_two");
    });

});
