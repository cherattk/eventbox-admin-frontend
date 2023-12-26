/**
 * @module EventMap
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */

const fs = require('fs').promises;

/**
 * 
 * @returns Array<{event , eventlistener}>
 */
function __buildEventListener(Event) {

  var MapEventListener = [];

  __EventMap.event.forEach((__event) => {

    var eventID = __event.id;
    var serviceEndpoint = [];
    __EventMap.service.forEach((service) => {
      // fetch all "Service.Endpoint" from A List Of Services[]
      // that (service) does not hold the actual Event
      if (service.id !== __event.service_id) {
        serviceEndpoint = serviceEndpoint.concat(service.endpoint);
      }
    }); // end "service endpoint" loop

    // For each Event 
    // returns listener that is related to the actual event
    var listListener = [];
    __EventMap.listener.forEach((__listener) => {
      if ((__listener.event_id === eventID)) {
        listListener.push(__listener);
      }
    }); // end listener loop

    var listEndpointOBJ = [];
    // Fetch for Listener information from  SERVICE entity      
    listListener.forEach((__listener) => {
      // returns "endpoint object" from "service endpoint"
      __listener.endpoint.forEach((endpoint_id) => {
        serviceEndpoint.forEach(endpointOBJ => {
          if (endpointOBJ.active && (endpointOBJ.id === endpoint_id)) {
            listEndpointOBJ.push(endpointOBJ);
          }
        });
      });
    });

    if (listEndpointOBJ.length) {
      MapEventListener.push({
        cloud_event: __event.cloud_event,
        listener_endpoint: listEndpointOBJ
      });
    }
  }); // end event loop

  return MapEventListener;
};

module.exports = function (EventMapFilePath) {

  const prefix = { service: 's-', event: 'e-', listener: 'l-' };
  /**
   * {service : [] , listener : []}
   */
  return {

    init : async function(){
      await this.getEventMap();
    },

    getEventMap: async function () {
      try {
        const fileContent = await fs.readFile(EventMapFilePath, 'utf-8');
        return JSON.parse(fileContent);        
      } catch (error) {
        console.error(error.message);
      }
    },

    saveMap: async function (mapObject) {
      try {
        var content = JSON.stringify(mapObject);
        await fs.writeFile(EventMapFilePath, content, { encoding: 'utf8' });
      } catch (error) {
        console.error(error);
      }
    },

    getEventKey: function (params) {

    },

    /**
     * 
     * @param {*} params 
     */
    getEventListenerMap: async function () {
      var result = [];
      try {
        var _EventMap = await this.getEventMap();        
        _EventMap.event.map(function(event , ev_index){
          result[ev_index] = {
            CE_EVENT : event,
            ListenerEndpoint : []
          };
          _EventMap.listener.map(function(listener){
            if(event.id === listener.event_id){
              _EventMap.endpoint.map(function(endpoint){
                if(listener.endpoint_id.includes(endpoint.id)){
                  result[ev_index].ListenerEndpoint.push({
                    url : endpoint.url
                  });
                }
              });
            }
          });        
        });
      } catch (error) {
        console.log(error);
      }
      return result;
    }

  }

};
