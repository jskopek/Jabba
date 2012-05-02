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
        equal( el.find(".tab-content .tab-pane:first").children()[0], content_el[0]);
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

    test("set element", function() {
        var el = $("<div id='tst'></div>");

        el.jabba(["Hello World"]);


        var el1 = el.jabba("el", "hello_world");
        equal( el.find(".tab-content .tab-pane:first").html(), "" );

        var content_el = $("<div id='tst2'>Another test</div>");
        el.jabba("el", "hello_world", content_el);
        deepEqual( content_el[0], el.find(".tab-content .tab-pane:last").children()[0] );
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

    test("get tab ids", function() {
        var el = $("<div id='tst'></div>");

        el.jabba(["Hello World", "Testing", "This"]);
        var tab_ids = el.jabba("tabs");
        deepEqual( tab_ids, ["hello_world", "testing", "this"] );
    });

    test("get tab ids", function() {
        var el = $("<div id='tst'></div>");

        el.jabba(["Hello World", "Testing", "This"]);
        var tab_ids = el.jabba("tabs");
        deepEqual( tab_ids, ["hello_world", "testing", "this"] );
    });

    test("carousel on", function() {
        expect(5);
        stop();

        var el = $("<div id='tst'></div>");
        el.jabba({
            "tabs": ["Hello World", "Testing", "This"],
            "carousel": 200
        });

        equal( el.jabba("carousel"), 200 );

        equal( el.find(".tab-pane.active").attr("id"), "hello_world" );
        setTimeout(function() {
            equal( el.find(".tab-pane.active").attr("id"), "testing" );
        }, 250);
        setTimeout(function() {
            equal( el.find(".tab-pane.active").attr("id"), "this" );
        }, 500);
        setTimeout(function() {
            equal( el.find(".tab-pane.active").attr("id"), "hello_world" );
            start();
        }, 750);
    });
    test("carousel off", function() {
        expect(3);
        stop();

        var el = $("<div id='tst'></div>");
        el.jabba({
            "tabs": ["Hello World", "Testing", "This"],
            "carousel": 200
        });

        equal( el.find(".tab-pane.active").attr("id"), "hello_world" );
        setTimeout(function() {
            equal( el.find(".tab-pane.active").attr("id"), "testing" );
            el.jabba("carousel", false);
        }, 250);


        setTimeout(function() {
            equal( el.find(".tab-pane.active").attr("id"), "testing" );
            start();
        }, 500);
    });
    test("get and select tabs", function() {
        var el = $("<div id='tst'></div>");

        el.jabba(["Hello World", "Testing", "This"]);
        equal( el.jabba("selected"), "hello_world" );

        el.jabba("selected", "this");
        equal( el.jabba("selected"), "this" );
        ok( el.find(".tab-content .tab-pane#this").hasClass("active") );

        el.jabba("selected", "invalid");
        equal( el.jabba("selected"), undefined );
    });
    test("initialize with custom selected tab", function() {
        var el = $("<div id='tst'></div>");
        el.jabba({
            "tabs": ["Hello World", "Testing", "This"],
            "selected": "testing"
        });

        equal( el.jabba("selected"), "testing" );
    });
    test("select tab with animation", function() {
        expect(2);
        stop();

        var el = $("<div id='tst'></div>");

        el.jabba([
            {
                "title": "Hello World",
                "el": "Tab 1"
            },
            {
                "title": "Testing",
                "el": "Tab 2"
            }
        ]);

        equal( el.jabba("selected"), "hello_world" );

        el.jabba("selected", "testing", 300);
        setTimeout(function() {
            equal( el.jabba("selected"), "testing" );
            start();
        }, 350);
    });
    test("carousel animates transition time", function() {
        expect(3);
        stop();

        var el = $("<div id='tst'></div>");
        el.jabba({
            "tabs": ["Hello World", "Testing", "This"],
            "carousel": 1500
        });

        $(el).jabba("el", "hello_world", "Content 1");
        $(el).jabba("el", "testing", "Content 2");
        $(el).jabba("el", "this", "Content 3");

        equal( el.jabba("tab_el", "hello_world").find(".carousel-progress").css("width"), "0px" );

        setTimeout(function() {
            notEqual( el.jabba("tab_el", "hello_world").find(".carousel-progress").css("width"), "0px" );
        }, 250);

        setTimeout(function() {
            equal( el.jabba("tab_el", "hello_world").find(".carousel-progress").css("width"), "0px" );
            start();
        }, 1550);
    });
    test("click on tab", function() {
        var el = $("<div id='tst'></div>");

        el.jabba(["Hello World", "Testing", "This"]);
        el.find(".nav-tabs li a:eq(1)").click();
        equal( el.jabba("selected"), "testing" );
    });

    test("click on tab disables carousel", function() {
        expect(2);
        stop();

        var el = $("<div id='tst'></div>");

        el.jabba({
            "tabs": ["Hello World", "Testing", "This"],
            "carousel": 200
        });
        el.find(".nav-tabs li a:eq(1)").click();
        equal( el.jabba("selected"), "testing" );
        setTimeout(function() {
            equal( el.jabba("selected"), "testing" );
            start();
        }, 250);
    });
    test("multiple jabba instances running", function() {
        var el = $("<div id='tst1'></div><div id='tst2'></div>");

        el.filter("#tst1").jabba({
            "tabs": ["Tst1.1", "Tst1.2", "Tst1.3"],
            "carousel": 200,
            "selected": "tst13"
        });
        el.filter("#tst2").jabba(["Tst2.1", "Tst2.2"]);

        equal( el.filter("#tst1").jabba("selected"), "tst13" );
        equal( el.filter("#tst2").jabba("selected"), "tst21" );
        equal( el.filter("#tst1").jabba("tabs").length, 3 );
        equal( el.filter("#tst2").jabba("tabs").length, 2 );
    });
});
