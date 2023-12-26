import React from 'react';
import eventmapSchema from '../../lib/eventmapSchema';

import EventMapManager from "../../lib/eventmap-manager";

export default function FormService() {

  function createService(ev){
    ev.preventDefault();
    var service = eventmapSchema.serviceSchema();
    service.name = ev.target.elements['new_service_name'].value;
    EventMapManager.addData('service', service);
  }

  return (
    <div>
      {/* <select>
        <option>Service</option>
        <option>Object</option>
      </select> */}

      <form onSubmit={createService.bind(this)}>
        <div className="form-row align-items-center">
          <div className="col-auto">
            <label className="sr-only" htmlFor="new_service_name">Name</label>
            <input type="text" className="form-control mb-2" id="new_service_name" />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary mb-2">Save</button>
          </div>
        </div>
      </form>
    </div>
  );
}