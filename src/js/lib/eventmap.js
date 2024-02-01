/**
 * @module EventMap
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */

const Util = require("./util");


/**
 * Used to manage (set/delete) entities
 * It converts entities JSON Object to a Map Object to manage entities
 * @params {Object} entitiesMap
 */


module.exports = function EventMap() {

  const prefix = { service: 'srv-', event: 'ev-', listener: 'lsn-', endpoint: 'ed-' };
  var _EventMap;

  this.getEventMap = function () {
    return _EventMap;
  }

  this.generateEventMapID = function(entityType){
    return prefix[entityType] + (new Date().getTime());
  }

  /**
   * 
   * @param {*} __JSONEntities A JSON Object
   */
  this.init = function (__JSONEventMap) {
    _EventMap = __JSONEventMap;
  }

  this.getById = function (type, id) {
    var entityIndex = _EventMap[type].findIndex(element => {
      return (element.id === id);
    });
    if (entityIndex > -1) {
      return _EventMap[type][entityIndex];
    }
  }

  this.setEntity = function (type, entityData) {
    if (!entityData.id) {
      // create
      entityData.id = this.generateEventMapID(type);
      _EventMap[type].push(entityData);
    } else {
      // update
      var entity = this.getById(type, entityData.id);
      if (entity) {
        entity = entityData;
      }
    }
  }

  /**
   * 
   * @param {*} type 
   * @param {*} id 
   * @returns 
   */
  this.removeById = function (type, id) {
    _EventMap[type] = _EventMap[type].filter(item => {
      return (item.id !== id);
    });
  }

  /**
   * 
   * @returns Array<entity>
   */
  this.getList = function (type, criteria) {
   
    const field = !!criteria && Object.keys(criteria);
    if (field.length > 0) {
      var result = [];
      _EventMap[type].forEach(element => {
        let ok = true;
        field.forEach(function (_field) {
          ok = ok && (element[_field] === criteria[_field]);
        });
        if (ok) {
          // @todo push a copy of the element
          result.push(element);
        }
      });
      return result;
    }
    else {
      // return all entries
      return _EventMap[type];
    }
  }
}

