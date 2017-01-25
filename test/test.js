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

        "radioChoice": $.observable(""),

        "valuesList": [
            $.observable("A"),
            $.observable("B")
        ],

        "indentedValueL0" : {
            "indentedValueL1": $.observable("indentedValue")
        },

        "comboboxValue": $.observable({
            "text": "",
            "value": ""
        })
    };

    $.bindObservables(objInit);
}(jQuery));