(function($) {
    var generate_tab_id = function(tab_name) {
        //returns a lowercased, truncated, _ed name
        tab_name = tab_name.trim().toLowerCase();
        tab_name = tab_name.replace(/\s+/g,"_").replace(/[\W\s]/g,"");
        return tab_name;
    }
    var render_tab_title = function(el, tab_id, tab_name) {
        //get or create tab title container
        var tab_container_el = $(el).find(".nav-tabs");
        if( !tab_container_el.length ) {
            tab_container_el = $("<div class='nav nav-tabs'></div>");
            $(el).append(tab_container_el);
        }

        //get or create tab title
        var tab_el = $(el).find(".nav-tabs li").filter(function() {
            return $(this).attr("href") == "#" + tab_id;
        });
        if( !tab_el.length ) {
            tab_el = $("<li><a href='#" + tab_id + "'>" + tab_name + "</a></li>");
            tab_container_el.append(tab_el);
        }
    }
    var render_tab_body = function(el, tab_id, tab_content_el) {
        //get or create tab body container
        var tab_container_el = $(el).find(".tab-content");
        if( !tab_container_el.length ) {
            tab_container_el = $("<div class='tab-content'></div>");
            $(el).append(tab_container_el);
        }

        //get or create tab body
        var tab_el = $(el).find(".tab-content").find("#" + tab_id);
        if( !tab_el.length ) {
            tab_el = $("<div class='tab-pane' id='" + tab_id + "'></div>");
            tab_container_el.append(tab_el);
        }

        if( tab_content_el ) {
            tab_el.html( tab_content_el );
        }
    }
    var methods = {
        "init": function(options) {
            //if array of tabs is passed, convert into JSON object
            if( $.isArray(options) ) {
                options = { "tabs": options };
            }

            for( var index in options["tabs"] ) {
                var data = options["tabs"][index];
                //convert object into a simple JSON obj if it is not already
                if( !(data instanceof Object) ) {
                    data = {"title": data};
                }
                
                //ensure we have a title
                if( !data["title"] ) {
                    throw("Could not find title in object: " + JSON.stringify(data) );
                }
                console.log("rendering", data);

                //get data
                var title = data["title"];
                var id = data["id"] || generate_tab_id(title);
                var el = data["el"] || undefined;

                render_tab_title(this, id, title);
                render_tab_body(this, id, el);
            }

            //select the first id
            var first_id = $(this).find(".tab-content .tab-pane:first").attr("id");
            methods.selected.call(this, first_id);

            //trigger carousel, if options were set
            if( options.carousel ) {
                methods.carousel.call(this, options.carousel);
            }

            //trigger tab selection if options were set
            if( options.selected ) {
                methods.selected.call(this, options.selected);
            }

            console.log("jabba initialized on ", this, options);
        },
        "carousel": function(time) {
            if( time == undefined ) {
                return $(this).data("carousel");
            } else if( !time ) {
                clearInterval( $(this).data("carouselTimer") );
                return time;
            }

            var timerId = setInterval($.proxy(function() {
                var selected = $(this).jabba("selected");
                var tab_ids = $(this).jabba("tabs");

                var index = $.inArray(selected, tab_ids);
                index = (index + 1) % tab_ids.length;

                $(this).jabba("selected", tab_ids[index]);
            }, this), time);

            $(this).data("carousel", time);
            $(this).data("carouselTimer", timerId);
        },
        "selected": function(tab_id) {
            if( !tab_id ) {
                return $(this).find(".tab-content .tab-pane.active").attr("id");
            }

            //add active class to tab title
            $(this).find(".nav-tabs li").removeClass("active");
            $(this).find(".nav-tabs li a").filter(function() {
                return $(this).attr("href") == "#" + tab_id;
            }).parent().addClass("active");

            //add active class to tab content
            $(this).find(".tab-content .tab-pane").removeClass("active");
            $(this).find(".tab-content .tab-pane").filter("#" + tab_id).addClass("active");
        },
        "els": function() {
            return $(this).find(".tab-content .tab-pane");
        },
        "el": function(tab_id, new_content) {
            var el = $(this).find(".tab-content .tab-pane").filter("#" + tab_id);
            if( new_content ) {
                el.html( new_content );
            }
            return el;
        },
        "tabs": function() {
            //jQuery's map() property does not return a simple array, so we build
            //one from scratch instead
            var result = [];
            $(this).find(".tab-content .tab-pane").each(function() {
                result.push( $(this).attr("id") );
            });
            return result;
        }
    }

    $.fn.jabba = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === "object" || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error("Method " + method + " does not exist on jQuery.jabba");
        }
    }
})(jQuery);
