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
        var tab_el = methods.tab_el.call(el, tab_id);
        if( !tab_el.length ) {
            tab_el = $("<li><div class='carousel-progress'></div><a href='#" + tab_id + "'>" + tab_name + "</a></li>");
            tab_container_el.append(tab_el);
            tab_el.bind("click", function(e) {
                e.preventDefault();

                //disable the carousel and select the tab
                methods.carousel.call(el, false);
                methods.selected.call(el, tab_id);
            });
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

        },
        "carousel": function(time) {
            if( time == undefined ) {
                return $(this).data("carousel");
            } else if( !time ) {
                clearInterval( $(this).data("carouselTimer") );
                clearInterval( $(this).data("carouselProgressTimer") );
                $(this).removeClass("carousel");
                return time;
            }
            $(this).addClass("carousel");

            //animate the progress bar on the carousel
            var carousel_update_delay = 50;
            var tab_time = 0;
            var carousel_progress_el = methods.tab_el.call(this, $(this).jabba("selected")).find(".carousel-progress");
            var timerProgressId = setInterval($.proxy(function() {
                tab_time += carousel_update_delay;
                if( tab_time < time ) {
                    var pct = Math.floor( tab_time * 100 / time );
                    carousel_progress_el.css("width", pct + "%");
                } else {
                    carousel_progress_el.css("width", 0);
                    carousel_progress_el = methods.tab_el.call(this, $(this).jabba("selected")).find(".carousel-progress");
                    tab_time = 0;
                }
            }, this), carousel_update_delay);

            //switch tabs when carousel runs out
            var timerId = setInterval($.proxy(function() {
                var selected = $(this).jabba("selected");
                var tab_ids = $(this).jabba("tabs");

                var index = $.inArray(selected, tab_ids);
                index = (index + 1) % tab_ids.length;

                var animation_time = (time >= 1500) ? 300 : false;
                $(this).jabba("selected", tab_ids[index], animation_time);
            }, this), time);

            $(this).data("carousel", time);
            $(this).data("carouselTimer", timerId);
            $(this).data("carouselProgressTimer", timerProgressId);
        },
        "selected": function(tab_id, animate_time) {
            if( !tab_id ) {
                return $(this).find(".tab-content .tab-pane.active").attr("id");
            }

            //add active class to tab title
            $(this).find(".nav-tabs li").removeClass("active");
            methods.tab_el.call( this, tab_id ).addClass("active");

            //add active class to tab content
            $(this).find(".tab-content .tab-pane").removeClass("active");

            //either show new tab directly or animate it
            var new_tab = $(this).find(".tab-content .tab-pane").filter("#" + tab_id);
            if( !animate_time ) {
                new_tab.addClass("active");
            } else {
                new_tab.addClass("active");
                new_tab.fadeIn(animate_time, function() {
                    new_tab.css('display', '');
                });
            }
                
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
        "tab_el": function(tab_id) {
            return $(this).find(".nav-tabs li a").filter(function() {
                return $(this).attr("href") == "#" + tab_id;
            }).parent();
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
