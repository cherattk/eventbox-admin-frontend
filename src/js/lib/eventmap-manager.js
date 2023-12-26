/**
 * @module EventMapMananger
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */

const DataEvent = require('./ui-event').DataEvent;
const config = require('../config');
const EventMap = require('./eventmap');
const _EventMap = new EventMap();

const EventMapManager = {

  loadEventMap: function (sessionToken , callback) {
    jQuery.ajax({
      url : config.eventmap_url,
      method : "GET",
      dataType : "JSON",
      headers : {
        "Authorization" : 'Bearer ' + sessionToken
      }
    })
    .done(function (responseData, textStatus, jqXHR) {
      _EventMap.init(responseData);
      callback();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.error('Error from EventMapManager.loadEventMap');
        console.error(textStatus);
        console.error(errorThrown);
      });
  },


  /**
   * EventMap Client
   */
  saveEventMap: function (callback) {
    var eventMap = JSON.stringify(_EventMap.getEventMap());
    //var eventmapFile = new File(eventMap , 'eventbox_map.txt' , {type : "plain/text"});
    jQuery.ajax({
      url: config.eventmap_url,
      method: "POST",
      dataType : "JSON", // response format
      processData : false,
      data : eventMap,
      headers: {
        "Content-Type" : "application/json; charset=UTF-8",
        "Authorization" : "Bearer " + sessionStorage.getItem('eventbox_session')
      },
      data: eventMap
    }).done(function (responseData) {
      callback(responseData);
    })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error('Error from EventMapManager.loadEventMap');
        console.error(textStatus);
        console.error(errorThrown);
      });
  },

  ////////////////////////////////////////////////////////////
  addData: function (type , entity) {
    var message = {};
    _EventMap.setEntity(type , entity);
    var eventName = 'update-list-' + type;
    var self = this;
    this.saveEventMap(function () {
      self.loadEventMap(function () {
        DataEvent.dispatch(eventName, message);
      });
    });
  },

  updateData: function (type , entity) {
    // not required to call setEntity() because javascript object is modified by reference
    _EventMap.setEntity(type , entity);
    var eventName = 'update-element-' + type;
    var self = this;
    this.saveEventMap(function () {
      self.loadEventMap(function (loadActionResponse) {
        DataEvent.dispatch(eventName, { id: entity.id });
      });
    });


  },

  ///////////////////////////////////////////////////////////
  deleteData: function (type , id) {
    let message = {};
    var eventName = 'update-list-' + type;
    var self = this;
    _EventMap.removeById(type , id);
    this.saveEventMap(function () {
      // self.loadEntityList(type, function (loadActionResponse) {
      self.loadEventMap(function () {
        // _EventMap.buildEntityList(type, loadActionResponse);
        DataEvent.dispatch(eventName, message);
      });
    });
  },

  ////////////////////////////////////////////////////////////
  getData: function (type, id) {
    return _EventMap.getById(type, id);
  },

  ///////////////////////////////////////////////////////////
  getDataList: function (type, criteria) {
    const list = _EventMap.getList(type, criteria);
    return list;
  },

  /**
   * Returns all events from all listener except 
   * the events that belonging to the "listener service"
   * @param {*} service_id the id of the listener service
   * @returns 
   */
  filterListSourceEvent: function (service_id) {
    var __listEvent = this.getDataList('event');
    var __listenerServiceID = service_id;
    var __listSourceEvent = [];
    __listEvent.forEach(event => {
      if (event.service_id !== __listenerServiceID) {
        __listSourceEvent.push(event);
      }
    });
    return __listSourceEvent;
  }


}

module.exports = EventMapManager;