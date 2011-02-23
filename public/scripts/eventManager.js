var eventManager = (function () {
    var events = {};

    var getEvent = function (name) {
        ///<summary>Gets the event for the given id</summary>
        ///<param name="name">Name of the event</param>
        if (!events[name]) {
            events[name] = [];
        }
        return events[name];
    };

    var ret = {
        bind: function (name, fn, eventHandlerId) {
            ///<summary>Adds a particular event handler to the specified event</summary>
            ///<param name="name" type="String" optional="false" mayBeNull="false">Name of the event to bind to</param>
            ///<param name="fn" type="Function" optional="false" mayBeNull="false">Function to invoke when the event is triggered</param>
            var e = getEvent(name);
            if (!eventHandlerId) {
                //there was no event id, so auto-generate one
                eventHandlerId = name + '-' + (e.length + 1);
            }
            //add the id to the event
            fn.id = eventHandlerId;
            e.push(fn);
            return ret;
        },
        trigger: function (name, source, args) {
            ///<summary>Raises a named event on the given source with the supplied arguments</summary>
            ///<param name="name" type="String" optional="false" mayBeNull="false">Name of the event to raise</param>
            ///<param name="source" type="Object" optional="false" mayBeNull="true">Object to bind the 'this' context to</param>
            ///<param name="args" type="Object" optional="true" mayBeNull="true">Arguments to pass to the event</param>
            if (!source) {
                source = {};
            }
            if (!args) {
                args = [];
            }
            var evt = getEvent(name);
            if (!evt || (evt.length === 0)) {
                return;
            }
            evt = evt.length === 1 ? [evt[0]] : Array.apply(null, evt);
            if (args.constructor !== Array) {
                args = [args];
            }
            for (var i = 0, l = evt.length; i < l; i++) {
                evt[i].apply(source, args);
            }
             return ret;
       },
        unbind: function (name, eventHandlerId) {
            ///<summary>Unbinds a handler from a named event.</summary>
            ///<param name="name" type="String" optional="false" mayBeNull="false">Name of the event to unbind from</param>
            ///<param name="eventHandlerId" type="String" optional="true" mayBeNull="true">Unique name of the event handler to unbind, if not supplied all event handlers are unbound</param>
            var evt = getEvent(name);
            if (evt && evt.length > 0) {
                //if there is an event handler to remove look for it
                if (eventHandlerId) {
                    for (var i = 0, l = evt.length; i < l; i++) {
                        var e = evt[i];
                        if (e.id === eventHandlerId) {
                            evt.pop(e);
                            break;
                        }
                    }
                } else {
                    //remove all event handlers
                    evt = [];
                }
            }
            return ret;
        },
        isRegistered: function (name, eventHandlerId) {
            ///<summary>Checks if an event handler is registered</summary>
            ///<param name="name" type="String" optional="false" mayBeNull="false">Name of the event to check</param>
            ///<param name="eventHandlerId" type="String" optional="false" mayBeNull="false">Unique id of the event handler to check for</param>
            ///<returns type="Boolean" />
            var evt = getEvent(name);
            if (eventHandlerId) {
                for (var i = 0, l = evt.length; i < l; i++) {
                    var e = evt[i];
                    if (e.id === eventHandlerId) {
                        return true;
                    }
                }
            }
            return false;
        }
    };

    return ret;
})();