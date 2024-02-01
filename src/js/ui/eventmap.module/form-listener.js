import React from 'react';
import EventMapManager from '../../lib/eventmap-manager';
import { DataEvent, UIEvent } from '../../lib/ui-event';
import eventmapSchema from '../../lib/eventmapSchema';
import { EmptyState, WarningMessage } from '../component/message';
import GroupedEndpoint from './grouped-endpoint';
import GroupedEvent from './grouped-event';

export default class FormListener extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showForm: false, // to load/reset listEvents,
      listener: eventmapSchema.listenerSchema(),
      serviceEndpoint: false,
    };

    this.__listenerIdentifier = [];

    this.selectedEndpoint = this.selectedEndpoint.bind(this);
  }


  /**
   * Get The list of thes services that are not parent of 
   * event identified by eventId 
   * @param {*} eventId 
   * @returns 
   */
  getListServiceEndpoint(eventId) {
    var result = new Map();
    var event = EventMapManager.getData('event', eventId);
    EventMapManager.getDataList('endpoint').map((__endpoint) => {
      if (event.service_id != __endpoint.service_id) {
        if (result.has(__endpoint.service_id)) {
          let entry = result.get(__endpoint.service_id);
          entry.endpoint.push(__endpoint);
        }
        else {
          result.set(__endpoint.service_id, {
            service: EventMapManager.getData('service', __endpoint.service_id),
            endpoint: [__endpoint]
          });
        }
      }
    });
    return result;
  }

  componentDidMount() {
    var self = this;
    //===============================================
    this.__listenerIdentifier.push(UIEvent.addListener('show-listener-form', function (uiEvent) {
      var __listener;
      var __actionForm = "";
      if (uiEvent.message.listener_id) {
        // get listener data to edit
        __actionForm = "edit";
        __listener = EventMapManager.getData('listener', uiEvent.message.listener_id);
      }
      else {
        __actionForm = "add";
        __listener = eventmapSchema.listenerSchema();
      }

      self.setState(function () {
        return {
          showForm: true,
          actionForm: __actionForm,
          listener: __listener
        }
      }, function () {
        $(self.modal).modal('show');
      });
    })
    );
  }

  componentWillUnmount() {
    this.__listenerIdentifier.forEach(element_id => {
      // DataEvent.removeListener(element_id);
      UIEvent.removeListener(element_id);
    });
    this.__listenerIdentifier = [];
  }

  close() {
    let self = this;
    this.setState(function () {
      return {
        listener: eventmapSchema.listenerSchema(),
        showForm: false, // to reset listEvents,
        actionForm: ""
      };
    }, function () {
      $(self.modal).modal('hide');
    });
  }

  saveListener(e) {
    e.preventDefault();
    if (!this.state.listener.event_id) {
      alert('can not save listener without an event to listen to '); return;
    }
    // if (!this.state.listener.endpoint_id.length) {
    //   alert('can not save listener without an endpoint '); return;
    // }
    // console.log(this.state.listener);
    // return;
    if (this.state.listener.id) {
      // element already exists
      EventMapManager.updateData('listener', this.state.listener);
    } else {
      // add a new one
      // this.state.listener.id = Date.now().toString();
      EventMapManager.addData('listener', this.state.listener);
    }
    this.close();
    // console.log(this.state.listener);
  }

  selectedEvent(ev) {
    var __eventID = ev.target.value;
    var __listener = eventmapSchema.listenerSchema();
    var __event = EventMapManager.getData('event', __eventID);
    __listener.event_id = __event.id;
    this.setState(function () {
      return {
        listener: __listener
      };
    });
  }

  /**
   * Render only event that is a part of existing EventListenerMapping
   * @returns 
   */
  renderListEvents() {
    var __listActiveListener = [];
    EventMapManager.getDataList('listener').forEach((listener) => {
      __listActiveListener.push(listener.event_id);
    });
    var listEvent = EventMapManager.getDataList('event');
    if (__listActiveListener.length === listEvent.length) {
      return (
        <p className='bg-info text-white px-3 py-2 rounded'>All events are a part of Event Listener</p>
      )
    }

    var self = this;
    var optionDataList = new Map();
    listEvent.forEach((event, idx) => {
      // check if the event is not present in another EventListenerMapping      
      if (!__listActiveListener.includes(event.id)) {
        let service = EventMapManager.getData('service', event.service_id);
        let key = "list-event-item-" + event.id;
        var eventData = {
          key: key,
          html_id: key,
          event_id: event.id,
          value: event.id,
          text: event.name
        };
        if (optionDataList.has(service.id)) {
          let _data = optionDataList.get(service.id);
          _data.event.push(eventData);
        }
        else {
          optionDataList.set(service.id, {
            service: service,
            event: [eventData]
          });
        }
      }
    });

    var htmlList = [];
    optionDataList.forEach(function (data) {
      console.log(data);
      htmlList.push(<GroupedEvent data={data} 
        selectedEventHandler={self.selectedEvent.bind(self)} />);
    });

    return (
      <div className="checklist">
        {/* <form onChange={this.selectedEvent.bind(this)}> */}
        <form>
          {htmlList}
        </form>
      </div>
    );
  }

  selectedEndpoint(ev) {
    var found = false;
    if (ev.target.checked) {
      this.state.listener.endpoint_id.forEach(endpointID => {
        if (endpointID === ev.target.value) {
          found = true;
        }
      });
      if (!found) {
        this.state.listener.endpoint_id.push(ev.target.value);
        // var eventId = this.state.listener.event_id;
        // var allServiceEndpoint = this.getListServiceEndpoint(eventId);
        // allServiceEndpoint.forEach(element => {
        //   if (element.id === ev.target.value) {
        //     this.state.listener.endpoint_id.push(element.id);
        //   }
        // });
      }
    }
    else {
      // remove endpoint id from listener_id_list[]
      this.state.listener.endpoint_id = this.state.listener.endpoint_id.filter((endpointID) => {
        return (endpointID !== ev.target.value)
      });
      // if (!tmpListenerEndpoint.length) {
      //   // opretaion not autorrized if 
      //   // the listener has no endpoint
      //   alert("Warning you can not save the form if the listener has no endpoint \
      //   you need to register at least one endpoint");
      // }
      // else {
      //   this.state.listener.endpoint_id = tmpListenerEndpoint;
      // }
    }
    this.setState(() => {
      return { listener: this.state.listener }
    }, function () {
      console.log(this.state);
    });
  }

  renderOneEvent() {
    var event = EventMapManager.getData('event', this.state.listener.event_id);
    return (
      <p className='bg-primary text-white px-3 py-2 rounded'>{event.name}</p>
    )
  }

  renderEndpoint() {
    // set list of endpoint
    var optionList = [];
    const __listName = "listener_endpoint";
    const __listType = "checkbox";

    // var __unActiveEndpoint = 0;
    var attachedListEndpoint = this.state.listener.endpoint_id;
    var eventId = this.state.listener.event_id;
    var allServiceEndpoint = this.getListServiceEndpoint(eventId);
    allServiceEndpoint.forEach((listenerEndpoint, idx) => {
      // var optionID = "list-endpoint-item-" + idx;
      // if (!endpoint.active) {
      //   __unActiveEndpoint++;
      // }
      optionList.push(<GroupedEndpoint
        listName={__listName} listType={__listType}
        data={listenerEndpoint}
        checkedEndpoint={attachedListEndpoint}
        selectedEndpointHandler={this.selectedEndpoint} />);
    });

    console.log(Array.from(allServiceEndpoint.values()));

    if (allServiceEndpoint.size === 0) {
      return <EmptyState text="There is no registered Endpoint" />;
    }
    // else if (__unActiveEndpoint === allServiceEndpoint.length) {
    //   return <WarningMessage text = "You need at least one ACTIVE ENDPOINT to register a listener" /> ;
    // }
    else {
      return (
        <div className="checklist">
          <form>
            {optionList}
          </form>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="modal fade app-modal-form" id="formListener"
        tabIndex="-1" role="dialog"
        aria-labelledby="formListenerLabel"
        aria-hidden="true"
        ref={node => (this.modal = node)}>

        <div className="modal-dialog modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header px-4">
              <h5 className="modal-title" id="formListenerLabel">
                Event / Listener Mapping
              </h5>
              <button type="button" className="close"
                onClick={this.close.bind(this)} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body px-4">
              {/* <div className="row justify-content-between"> */}

              <div className="card mb-3">
                <h5 className="card-header">Events</h5>
                <div className="card-body">
                  {
                    this.state.actionForm === "edit" ? this.renderOneEvent() :
                      this.state.actionForm === "add" ? this.renderListEvents() : ""
                  }
                </div>
              </div>
              <div className="card">
                <h5 className="card-header">Listeners Endpoints</h5>
                <div className="card-body">
                  {this.state.listener.event_id ? this.renderEndpoint() : ""}
                </div>
              </div>
              {/* </div> */}
            </div>
            <div className="modal-footer px-4 justify-content-between">
              <button type="submit" className="btn btn-primary btn-sm"
                onClick={this.saveListener.bind(this)}>Save changes</button>
              <button type="button" className="btn btn-secondary btn-sm"
                onClick={this.close.bind(this)}>Cancel</button>
            </div>

          </div>
        </div>
      </div>
    )
  }
}