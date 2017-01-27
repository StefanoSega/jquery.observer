(function($) {

var typeEnum = Object.freeze({
     "observable": 1,
     "observableFunction": 2
 });

 var observable = function(initValue) {
     var value = initValue;

     var returnFun = function returnFun(newValue) {
         var newValueIsValid = newValue !== null && newValue !== undefined;

         if (newValueIsValid && !window.common.utils.deepCompare(newValue, value)) {
             var oldValue = value;
             value = newValue;

             // publish the new value event to all subscriptions
             returnFun._subscriptions.forEach(function(callback) {
               callback(newValue, oldValue);
             });

             // emit the event
             window.common.pubsub.publish("jquery.observer/observable/changed", [ returnFun ]);
         }

         return value;
     };
     returnFun._guid = window.common.utils.newGuid();
     returnFun._type = typeEnum.observable;
     returnFun._subscriptions = [];

     return returnFun;
 };

 var observableFunction = function(fun) {
     var returnFun = function() {
         return fun();
     };

     returnFun._type = typeEnum.observableFunction;

     return returnFun;
 };

 var getWithInheritance = function(ctrl) {
     if (!ctrl) {
         return "";
     }

     var withInheritance = "";

     if ($(ctrl).attr("data-obs-with")) {
         withInheritance = $(ctrl).attr("data-obs-with");
     }

     $(ctrl).parents("[data-obs-with]").each(function() {
         if ($(this).attr("data-obs-with")) {
            withInheritance = $(this).attr("data-obs-with") + "." + withInheritance;
         }
     });

     if (withInheritance.substring(withInheritance.length - 1) === ".") {
         withInheritance = withInheritance.substring(0, withInheritance.length - 1);
     }

     return withInheritance;
 };

 var getObservableRef = function(obj, obsName, ctrl) {
     var withInheritance = getWithInheritance(ctrl);
     if (withInheritance) {
         obsName = withInheritance + "." + obsName;
     }

     return eval("obj." + obsName);
 };

 var bindObservables = function(obj) {

     var bindValueTextbox = function(ctrl, thisObservable) {
        $(ctrl).on("input", function() {
            thisObservable($(ctrl).val());
        });
        
        $(ctrl).val(thisObservable());
        thisObservable.subscribe(function(newValue) {
            if ($(ctrl).val() !== newValue) {
                $(ctrl).val(newValue);
            }
        });
     };

    var bindValueCheckbox = function(ctrl, thisObservable) {
        $(ctrl).on("change", function() {
            thisObservable($(ctrl).is(":checked"));
        });
        $(ctrl).prop('checked', thisObservable());
        thisObservable.subscribe(function(newValue) {
            if ($(ctrl).is(":checked") !== newValue) {
                $(ctrl).prop('checked', newValue);
            }
        });
    };

    var bindValueRadio = function(ctrl, thisObservable) {
        $(ctrl).on("change", function() {
            if ($(ctrl).is(":checked")) {
                thisObservable($(ctrl).val());
            }
        });
        var isChecked = thisObservable() === $(ctrl).val();
        $(ctrl).prop('checked', isChecked);
        thisObservable.subscribe(function(newValue) {
            $(ctrl).prop('checked', $(ctrl).val() === newValue);
        });
    };

    var bindValueCombobox = function(ctrl, thisObservable) {
        $(ctrl).on("change", function() {
            thisObservable({
                value: $(ctrl).val(),
                text: $(ctrl).find("option:selected").text()
            });
        });

        var currentValue = "";
        if (thisObservable()) {
            currentValue = thisObservable().value;
        }
        $(ctrl).val(currentValue);

        thisObservable.subscribe(function(newValue) {
            if ($(ctrl).val() !== newValue.value) {
                $(ctrl).val(newValue.value);
            }
        });
    };

     $("[data-bind-obs-value]").each(function() {
         var ctrl = this;
         var obsName = $(ctrl).attr("data-bind-obs-value");
         var thisObservable = getObservableRef(obj, obsName, ctrl);

         switch(ctrl.tagName.toLowerCase()) {
             case "input":
                switch(ctrl.type.toLowerCase()) {
                    case "text":
                        bindValueTextbox(ctrl, thisObservable);
                        break;
                    case "checkbox":
                        bindValueCheckbox(ctrl, thisObservable);
                        break;
                    case "radio":
                        bindValueRadio(ctrl, thisObservable);
                        break;
                }
                break;
            case "select":
                bindValueCombobox(ctrl, thisObservable);
                break;
         }
     });

     $("[data-bind-obs-text]").each(function() {
         var getValue = function(obs) {
             if (obs) {
                 switch(typeof obs) {
                     case "function":
                        return obs();
                        break;
                    default:
                        return obs;
                        break;
                 }
             }

             return "";
         };

         var ctrl = this;
         var obsName = $(ctrl).attr("data-bind-obs-text");
         var thisObservable = getObservableRef(obj, obsName, ctrl);
         var currentValue = getValue(thisObservable);

         $(ctrl).text(currentValue);

        if (!thisObservable && thisObservable !== "") {
            return;
        }

         switch(thisObservable._type) {
             case typeEnum.observable:
                thisObservable.subscribe(function(newValue) {
                    if ($(ctrl).text() !== newValue) {
                        $(ctrl).text(newValue);
                    }
                });
                break;

            case typeEnum.observableFunction:
                // subscribe to every change of the observables
                window.common.pubsub.subscribe("jquery.observer/observable/changed", function() {
                    var newValue = getValue(thisObservable);

                    if ($(ctrl).text() !== newValue) {
                        $(ctrl).text(newValue);
                    }
                });
                break;

            default:
                // subscribe to every change of the observables
                window.common.pubsub.subscribe("jquery.observer/observable/changed", function() {
                    thisObservable = getObservableRef(obj, obsName, ctrl);
                    var newValue = getValue(thisObservable);

                    if ($(ctrl).text() !== newValue) {
                        $(ctrl).text(newValue);
                    }
                });
                break;
         };
     });
 };

 // Attach new functions to prototypes
 Function.prototype.subscribe = function(callback) {
     if (!this._subscriptions || !callback) {
         return;
     }

     this._subscriptions.push(callback);
 };
 Function.prototype.unsubscribe = function(callback) {
     if (!this._subscriptions) {
         return;
     }

     this._subscriptions = this._subscriptions.filter(function(subscription) {
         return subscription !== callback;
     });
 };
 Function.prototype.unsubscribeAll = function() {
     if (!this._subscriptions) {
         return;
     }

     this._subscriptions = [];
 };

 // jQuery extend functions
 $.fn.extend({
  // observable: observable
 });

 // jQuery new functions
 $.observable = observable;
 $.observableFunction = observableFunction;
 $.bindObservables = bindObservables;

}(jQuery));