import EventSet from 'eventset';

// ui
const UIEvent = EventSet.Topic('ui-event');
// UIEvent.addEvent('show-event');
UIEvent.addEvent('get-service-form');
UIEvent.addEvent('show-event-form');
UIEvent.addEvent('show-listener-form');
UIEvent.addEvent('show-endpoint-form');

UIEvent.addEvent('login-status');

// DataEvent
const DataEvent = EventSet.Topic('data-event');
['service' , 'event' , 'listener' , 'endpoint'].forEach(function(type){
  DataEvent.addEvent('update-list-' + type);
  DataEvent.addEvent('update-element-' + type);
});

export { UIEvent  , DataEvent }