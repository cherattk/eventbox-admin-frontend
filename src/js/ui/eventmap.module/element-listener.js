import React from 'react';
import EventMapManager from '../../lib/eventmap-manager';
import { UIEvent, DataEvent } from '../../lib/ui-event';
import eventmapSchema from '../../lib/eventmapSchema';
import { Spinner } from '../component/message';
import { WarningMessage } from '../component/message';

export default class ElementListener extends React.Component {

  constructor(props) {
    super(props);

    var __listener = EventMapManager.getData('listener', this.props.listener_id);
    this.state = {
      listener: __listener,
      listEndpoint: this.getListenerEndpoint(__listener.endpoint_id),
      activeListener: this.setListenerStatus(__listener.endpoint_id)
    }

    this.__internalListener = [];
  }

  componentDidMount() {
    let listener_id = this.props.listener_id;
    var self = this;
    ////////////////////////////////////////////////////////
    this.__internalListener.push(DataEvent.addListener('update-element-listener', function (dataEvent) {
      if (dataEvent.message.id === self.props.listener_id) {
        let __listener = EventMapManager.getData('listener', listener_id);
        let __listenerStatus = self.setListenerStatus(__listener.endpoint_id);
        let __listEndpoint = self.getListenerEndpoint(__listener.endpoint_id);
        self.setState(function () {
          return {
            listener: __listener,
            listEndpoint: __listEndpoint,
            activeListener: __listenerStatus
          }
        });
      }
    }));
    this.__internalListener.push(DataEvent.addListener('update-list-endpoint', function (dataEvent) {
      // if(dataEvent.message.id){
        // update list of CHANGED endpoint
        var listenerListEndpoint = EventMapManager.getData('listener', self.props.listener_id);
        let __listenerStatus = self.setListenerStatus(listenerListEndpoint.endpoint_id);
        let __listEndpoint = self.getListenerEndpoint(listenerListEndpoint.endpoint_id);
        self.setState(function () {
          return {
            listEndpoint: __listEndpoint,
            activeListener: __listenerStatus
          }
        });
      // }
    }));

    this.__internalListener.push(DataEvent.addListener('update-element-endpoint', function (dataEvent) {
      if(dataEvent.message.id){
        let __listenerStatus = self.setListenerStatus(self.state.listener.endpoint_id);
        let __listEndpoint = self.getListenerEndpoint(self.state.listener.endpoint_id);
        self.setState(function () {
          return {
            listEndpoint: __listEndpoint,
            activeListener: __listenerStatus
          }
        });
      }
    }));
    // this.__internalListener.push(DataEvent.addListener('update-element-event', function (dataEvent) {
    //   if (dataEvent.message.id === self.state.listener.event_id) {
    //     self.setState(function () {
    //       return {
    //         listener: EventMapManager.getData('listener', this.props.listener_id)
    //       }
    //     });
    //   }
    // }));

    // this.state.listener = ;
    // this.setState(function () {
    //   return {
    //     activeListener: self.setListenerStatus(self.props.listener_id)
    //   }
    // });
  }


  componentWillUnmount() {
    this.__internalListener.forEach(element_id => {
      DataEvent.removeListener(element_id);
    });
  }

  editElement() {
    UIEvent.dispatch('show-listener-form', {
      listener_id: this.props.listener_id
    });
  }

  deleteElement() {
    // todo : use some modal component
    let ok = window.confirm('You are going to delete the listener : ' + this.state.listener.id + '\n Are you sure ?');
    if (ok) {
      EventMapManager.deleteData('listener', this.state.listener.id);
    }
  }

  /**
   * Check if the listener has at least on "active" endpoint
   * otherwise, set the listener as "deactived"
   */
  setListenerStatus(listEndpointID) {
    var __activeListener = {
      active: false, message: ""
    };
    // get full endpoint object from "ENDPOINT LIST"
    if (listEndpointID.length) {
      var __listenerEndpointObj = this.getListenerEndpoint(listEndpointID);
      let __allUnactive = __listenerEndpointObj.every((Endpoint) => {
        return (!Endpoint.active);
      });
      __activeListener.active = !__allUnactive;
      __activeListener.message = __allUnactive ? "all listeners endpoints attached to the event are disabled" : "";
    }
    else {
      __activeListener.message = "there is no listener endpoint attached to the event";
    }

    return __activeListener;

  }

  getListenerEndpoint(listenerListEndpoint) {
    var __endpointList = EventMapManager.getDataList('endpoint');
    var __listenerEndpointObj = [];
    __endpointList.forEach(Endpoint => {
      if (listenerListEndpoint.includes(Endpoint.id)) {
        let obj = Endpoint;
        let __service = EventMapManager.getData('service', Endpoint.service_id);
        Endpoint.serviceName = __service.name;
        __listenerEndpointObj.push(obj);
      }
    });
    return __listenerEndpointObj;
  }

  renderListenerEndpoint() {
    var htmlList = [];
    if (this.state.listEndpoint.length) {
      this.state.listEndpoint.forEach((element, idx) => {
        htmlList.push(
          <p key={idx + "-" + element.id}
            className="bg-light border px-3 py-2 rounded"
            style={!element.active ? { textDecoration: "line-through" } : null}>
            <span className='font-weight-bold'>Service : </span>{element.serviceName}
            <br />
            <span className='font-weight-bold'>Notification Endpoint :  </span>{element.url}
          </p>);
      });
    } else {
      htmlList.push(<p className="bg-light border m-0 mb-2 py-2 px-3 rounded">No listener endpoint</p>);
    }

    return htmlList;
  }

  render() {
    if (!this.state.listener) {
      return (<Spinner text="chargement de la list" />)
    }
    let listener = this.state.listener;
    let event = EventMapManager.getData('event', listener.event_id);
    let Eventservice = EventMapManager.getData('service', event.service_id);
    return (
      <div id={listener.id} className="border mb-4 rounded">
        {
          !this.state.activeListener.active ?
            <WarningMessage
              text={"Deactivated : " + this.state.activeListener.message + ""} />
            : null
        }

        <div className="row m-0 border-bottom">
          <div className="col-md-2 py-3 text-center border-right font-weight-bold text-primary">
            Events
          </div>
          <div className="col-md-10 py-3">
            <p className="m-0">
              <span className='font-weight-bold'>Service : </span>
              {Eventservice.name}
            </p>
            <p className="m-0">
              <span className='font-weight-bold'>Event : </span>
              {event.name}
            </p>
            <p className="m-0">
              <span className='font-weight-bold'>CloudEvent Type : </span>
              {event.cloud_event.type}
            </p>
          </div>
        </div>
        <div className="row m-0 border-bottom">
          <div className="col-md-2 py-3 text-center border-right font-weight-bold text-primary">
            Listeners
          </div>
          <div className="col-md-10 py-3">
            {this.renderListenerEndpoint()}
          </div>
        </div>

        <div className="div-control p-2 bg-light">
          <button type="button" className="btn btn-primary btn-sm mr-2 px-3"
            onClick={this.editElement.bind(this)}>
            Edit
          </button>
          <button type="button" className="btn btn-danger btn-sm px-3"
            onClick={this.deleteElement.bind(this)}>
            Delete
          </button>
        </div>
      </div>
    );
  }
}