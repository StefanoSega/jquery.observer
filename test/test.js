(function($) {
    var objInit = {
        "prop1": $.observable("1"),
        "prop2": $.observable("2")
    };
    objInit.prop1.subscribe(function(newvalue, oldvalue) {
        console.log(newvalue + " / " + oldvalue);
    });

    $.bindObservables(objInit);
}(jQuery));