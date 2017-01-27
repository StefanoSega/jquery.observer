(function($) {

var pubsubObj = $({});

window.common.pubsub.subscribe = function() {
    pubsubObj.on.apply(pubsubObj, arguments);
};

window.common.pubsub.unsubscribe = function() {
    pubsubObj.off.apply(pubsubObj, arguments);
};

window.common.pubsub.publish = function() {
    pubsubObj.trigger.apply(pubsubObj, arguments);
};

}(jQuery));