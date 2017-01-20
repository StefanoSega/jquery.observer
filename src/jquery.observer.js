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

 // Attach new functions to prototypes
 Function.prototype.subscribe = function(callback) {
     if (!this._subscriptions || !callback) {
         return;
     }

     this._subscriptions.push(callback);
 };

 // jQuery extend functions
 $.fn.extend({
  // observable: observable
 });

 // jQuery new functions
 $.observable = observable;



}(jQuery));