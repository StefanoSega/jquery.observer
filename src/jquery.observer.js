(function($) {

var newGuid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, 
    function(c) 
    {
        var r = Math.random() * 16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};

 var observable = function(initValue) {
     var value = initValue;

     var returnFun = function returnFun(newValue) {
         if (newValue && newValue !== value) {
             var oldValue = value;
             value = newValue;

             // publish the new value event to all subscriptions
             returnFun._subscriptions.forEach(function(callback) {
               callback(newValue, oldValue);
             });
         }

         return value;
     };
     returnFun._guid = newGuid();
     returnFun._subscriptions = [];

     return returnFun;
 };

 var bindObservables = function(obj) {
     $("[data-bind-obs-value]").each(function() {
         var ctrl = this;
         var obsName = $(ctrl).attr("data-bind-obs-value");

         $(ctrl).on("input", function() {
             obj[obsName]($(ctrl).val());
         });
         
         $(ctrl).val(obj[obsName]());
         obj[obsName].subscribe(function(newValue) {
              if ($(ctrl).val() !== newValue) {
                  $(ctrl).val(newValue);
              }
          });
     });

     $("[data-bind-obs-text]").each(function() {
         var ctrl = this;
         var obsName = $(ctrl).attr("data-bind-obs-text");

         $(ctrl).text(obj[obsName]());
         obj[obsName].subscribe(function(newValue) {
              if ($(ctrl).text() !== newValue) {
                  $(ctrl).text(newValue);
              }
          });
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
 $.bindObservables = bindObservables;

}(jQuery));