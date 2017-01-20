(function($) {
    var obs1 = $.observable("5");
    obs1.subscribe(function(newValue, oldValue) {
        console.log(newValue + " / " + oldValue);
    });
    obs1("3");
}(jQuery));