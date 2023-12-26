module.exports = {
  serviceSchema: function () {
    return {
      id: "",
      name: "",
      host: "",
      description: ""
    };
  },
  serviceEndpointSchema: function () {
    return {
      id: "",
      service_id : "",
      url: "",
      active: false
    }
  },
  eventSchema: function () {
    return {
      /**
       * App Attributes
       */
      id: '',
      name: '',
      service_id : '',
      description: '',
      cloud_event: {
        /** 
         * Require attributes
         * */
        specversion: "1.0",
        type: '',
        source: '',
        /** 
         * Optional attributes
         * */
        datacontenttype: ''
      }
    }
  },

  listenerSchema: function () {
    return {
      id: '',
      event_id: "", // the id of the event to listen to
      endpoint_id: [], // array of serviceEndpointSchema
      active: false,
      description: ''
    }
  },

  EventListenerSchema : function(){
    return {
      CE_EVENT : {},
      ListenerEndpoint : {}
    }
  }

}