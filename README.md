Jabba
=====

jQuery tabs with (optional) carousel animations. It differs from traditional Tab libraries by relegating all DOM structure creation to Javascript. Perfect for Backbone-heavy projects!

Usage
-----

Jabba takes one argument on calling - a list of tab titles

    $("#tab_container").jabba(["Home", "Profile", "Messages", "Settings"])

Jabba will create a tab in the `#tab_container` element, and populate each tab with a blank DOM element. You may access and modify the DOM elements in the following ways:

    $("#tab_container").jabba("els"); // ==> [home_el, profile_el, messages_el, settings_el]
    $("#tab_container").jabba("el", "home"); // ==> home_el
    $("#tab_container").jabba("el", "home", home_el); // sets home_el as the content of the Home tab

By default, jabba automatically generates an id for each tab by lowercasing the title and replacing spaces with the _ character. Custom id or element properties may be set by passing in an object with the following structure: `{ id:..., title:..., el:... }`. Example:

    $("#tab_container").jabba([
        {
            "title": "Home",
            "id": "custom_home_id",
            "el": $("#home_el") //sets the content of the Home tab to #home_el on creation
        },
        {
            "title": "Profile",
            "id": "custom_profile_id"
        },
        "Messages"
    ]);

You may also pass in a JSON object containing the various options available to Jabba. A complete list of options are available below

    $("#tab_container").jabba({
        "tabs": ["Home", "Profile", "Messages", "Settings"],
        "carousel": 1000 //time, in ms, before switching to next tab,
        "selected": "profile"
    })

You may get or modify these properties after creation by calling `.jabba`, followed by the property name:

    $("#tabs_container").jabba("selected"); // ==> "profile"
    $("#tabs_container").jabba("selected", "messages");

Methods:
-------

All methods are called by invoking `$().jabba(method_name, arguments...)`

- `jabba('els')`: Returns a list of DOM elements
- `jabba('el', id)`: Returns the DOM element assigned to the tab with the `id` defined by the first arugment
- `jabba('el', id, dom_element)`: Sets `dom_element` as the content for tab `id`
- `jabba('selected')`: Returns the id of the currently selected tab
- `jabba('selected', id, animation_time)`: Sets the currently selected tab to be `id`. The optional `animation_time` property indicates the time, in ms, to fade the new tab in
- `jabba('carousel')`: Gets the time, in ms, between carousel transitions; set to 'false' if carousel is disabled
- `jabba('carousel', time)`: Sets the time between carousel transitions, or disables carousel
- `jabba('tabs')`: Gets the list of tab ids
- `jabba('tab_el', id)`: Returns the DOM element for the tab with id `id`

Options:
--------
- `tabs`: A list of tab titles to generate (e.g. ["Apple", "Bannana"]); if a list of arrays is passed, will pull data in the following format [title, id, element]
- `carousel`: If set to false, tabs will not automatically transition between each other. If set to numeric value, will set the time between transitions, in ms
- `selected`: The id of the tab you wish to select on initialization
