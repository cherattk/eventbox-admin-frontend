import React from 'react';

import EventMapManager from '../../lib/eventmap-manager';
import { UIEvent, DataEvent } from '../../lib/ui-event';
import { WarningMessage, EmptyState } from '../component/message';

export default class ListEndpoint extends React.Component {

  constructor() {
    super();
    this.state = {
      service_id: null
    }

    this.DataEventListener = [];
    this.UIEventListener = [];
  }

  componentDidMount() {
    var self = this;
    // var __serviceID = this.state.service_id;
    this.UIEventListener.push(UIEvent.addListener('get-service-form', function (uiEvent) {
      var service_id = uiEvent.message.service_id;
      if (service_id) {
        self.setState(function () {
          return {
            service_id: service_id,
          }
        });
      }
      else { // CLOSE SERVICE DETAILS
        self.setState(function () {
          return {
            service_id: null,
            // serviceEndpoint: []
          }
        });
      }
    }));

    this.DataEventListener.push(DataEvent.addListener('update-list-endpoint', function (dataEvent) {
      // when adding a new endpoint
      self.forceUpdate();
    }));
    this.DataEventListener.push(DataEvent.addListener('update-element-endpoint', function (dataEvent) {
      // when updating an endpoint
      self.forceUpdate();
    }));
  }

  componentWillUnmount() {
    this.DataEventListener.forEach(element_id => {
      DataEvent.removeListener(element_id);
    });
    this.UIEventListener.forEach(element_id => {
      UIEvent.removeListener(element_id);
    });
  }

  addEndpoint() {
    UIEvent.dispatch('show-endpoint-form', {
      service_id: this.state.service_id
    });
  }

  editEndpoint(ev) {
    // console.log(ev.target.value);
    UIEvent.dispatch('show-endpoint-form', {
      endpoint_id: ev.target.value
    });
  }

  renderListEndpoint() {
    // set list of endpoint
    var optionList = [];
    var __allServiceEndpoint = [];
    if(this.state.service_id){
      __allServiceEndpoint = EventMapManager.getDataList('endpoint', {service_id : this.state.service_id});
    }
    if (!__allServiceEndpoint.length) {
      return (<EmptyState text="There is no registered Endpoint For This Service" />)
    }
    __allServiceEndpoint.forEach((endpoint, idx) => {
      let optionID = "tab-endpoint-item-" + idx;
      let activeEndpointStyle = { lineHeight: 2 };
      if (!endpoint.active) {
        activeEndpointStyle.textDecoration = "line-through";
      }
      optionList.push(
        <div className="bg-light border mb-2 py-2 px-3 rounded d-flex justify-content-between" key={optionID}>
          <p className="m-0" style={activeEndpointStyle}>{endpoint.url}</p>
          <button className="btn btn-primary btn-sm"
            value={endpoint.id} onClick={this.editEndpoint.bind(this)}>Edit</button>
        </div>);
    });
    return (
      // <ul className="list-group">
      <>
        {optionList}
      </>
      // </ul>
    );
  }

  render() {
    return (
      <React.Fragment>
        <button type="button" className="btn btn-info btn-sm btn-add"
          onClick={this.addEndpoint.bind(this)}>
          New Endpoint
        </button>
        {this.renderListEndpoint()}
      </React.Fragment>
    );
  }
}