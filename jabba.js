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
        "init": function(tabs) {
            for( var index in tabs ) {
                var data = tabs[index];
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
            methods.select.call(this, first_id)

            console.log("jabba initialized on ", this, tabs);
        },
        "select": function(tab_id) {
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
