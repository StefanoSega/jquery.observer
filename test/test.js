(function($) {
    var objInit = {
        "name": $.observable(""),
        "surname": $.observable(""),
        "fullname": $.observableFunction(function() {
            return objInit.name() + " " + objInit.surname();
        }),
        "tick": $.observable(true),
        "tickResult": $.observableFunction(function() {
            return objInit.tick() ? "VERO" : "FALSO";
        }),
        "radioChoice": $.observable("")
    };

    $.bindObservables(objInit);
}(jQuery));