import React from 'react';
import ListEvent from './list-event';
import ListEndpoint from './list-endpoint';

import { DataEvent, UIEvent } from '../../lib/ui-event';
import EventMapManager from '../../lib/eventmap-manager';
import eventMapSchema from '../../lib/eventmapSchema';

export default class DetailService extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      service: eventMapSchema.serviceSchema() // serviceSchema
    }
  }

  componentDidMount() {
    var self = this;
    UIEvent.addListener('get-service-form', function (uiEvent) {
      var __service = eventMapSchema.serviceSchema();
      if (uiEvent.message.service_id) {
        __service = EventMapManager.getData('service', uiEvent.message.service_id);
      }
      self.setState(function () {
        return {
          show: uiEvent.message.show,
          service: __service
        }
      });
    });
  }

  close() {
    UIEvent.dispatch('get-service-form', {
      service_id: null,
      show: false
    });
  }

  saveService(ev) {
    ev.preventDefault();
    EventMapManager.updateData('service', this.state.service);
    // if (this.state.service.id) {
    //   // element already exists
    // } 
    // else {
    //   // add a new one
    //   EventMapManager.addData('service', this.state.service);
    // }
  }

  formValue(event) {
    this.state.service[event.target.name] = event.target.value;
    this.setState(this.state);
  }

  deleteService() {
    let serviceName = this.state.service.name;
    // todo : use some modal component
    var msg = `You are going to delete the service : + ${serviceName} \n Are you sure ?`;
    let ok = confirm(msg);
    if (ok) {
      EventMapManager.deleteData('service', this.state.service);
      this.close();
    }
  }

  render() {
    let show = this.state.show ? ' show-sideform' : '';
    // let this.state.service = this.state.service;
    return (
      <div className={"sideform sideform-right-70 h-100 bg-white border-left shadow-lg px-4" + show}>
        <button type="button" className="close mr-3 mt-4 py-2 rounded"
          onClick={this.close.bind(this)}>
          <span aria-hidden="true">&times;</span>
        </button>
        <h3 className="h5 bg-light m-0 my-3 px-4 py-3 text-primary">
          {this.state.service.name ? this.state.service.name : "New Service"}
        </h3>

        <nav>
          <div className="nav nav-tabs" role="tablist">
            <a className="nav-item nav-link active mr-3 border"
              data-toggle="tab" href='#service-detail' role="tab">
              Service
            </a>
            <a className="nav-item nav-link mr-3 border"
              data-toggle="tab" href='#service-event' role="tab">
              Events
            </a>
            <a className="nav-item nav-link mr-3 border"
              data-toggle="tab" href='#service-listener-endpoint' role="tab">
              Listening Endpoint
            </a>
          </div>
        </nav>

        <div className="tab-content detail-service">
          <div className="tab-pane fade show active p-3" id='service-detail' role="tabpanel">
            <form onSubmit={this.saveService.bind(this)}>
              <div className='form-group'>
                <label className="text-primary">Name</label>
                <input type="text" className="form-control mb-3" name="name" value={this.state.service.name}
                  onChange={this.formValue.bind(this)} />
              </div>
              <div className='form-group'>
                <label className="text-primary">Host</label>
                <input type="text" className="form-control mb-3" name="host" value={this.state.service.host}
                  onChange={this.formValue.bind(this)} />
                <small className='px-2'>
                  The <strong>Host</strong> value will be used for
                  <strong>source</strong> attribute of the cloudevent event.
                </small>
              </div>

              <div className='form-group'>
                <label className="text-primary">Description </label>
                <textarea className="form-control mb-3" name="description" value={this.state.service.description}
                  onChange={this.formValue.bind(this)}></textarea>
              </div>

              <div className='d-flex justify-content-between'>
                <button type="submit" value="Save" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-danger"
                  onClick={this.deleteService.bind(this)}>Delete The Service</button>
              </div>
            </form>
          </div>

          <div className="tab-pane fade py-3" id='service-event' role="tabpanel">
            <p className='bg-light p-3'>
              In this section, you manage the events that are
              triggered by the service
            </p>
            <ListEvent />
          </div>
          <div className="tab-pane fade py-3" id='service-listener-endpoint' role="tabpanel">
            <p className='bg-light p-3'>
              In this section, you manage the listening endpoint
              by wich the service listen to events that is triggered
              by <strong>other</strong> services
            </p>
            <ListEndpoint />
          </div>
        </div>

      </div >
    );

  }
}