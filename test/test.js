(function($) {
    var objInit = {
        "name": $.observable(""),
        "surname": $.observable(""),
        "fullname": $.observableFunction(function() {
            return objInit.name() + " " + objInit.surname();
        })
    };

    $.bindObservables(objInit);
}(jQuery));