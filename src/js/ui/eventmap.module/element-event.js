import React from 'react';
import EventMapManager from '../../lib/eventmap-manager';
import { UIEvent, DataEvent } from '../../lib/ui-event';

export default class ElementEvent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      event: EventMapManager.getData('event', this.props.event_id),
      showElement: false
    };
  }

  getEventForm() {
    UIEvent.dispatch('show-event-form', {
      event_id: this.props.event_id,
      service_id: this.props.service_id
    });
  }

  deleteEvent() {
    let ce_type = this.state.event.cloud_event.type;
    // todo : use some modal component
    var msg = `You are going to delete the event :\n ${ce_type} \n Are you sure ?`;
    let ok = confirm(msg);
    if (ok) {
      EventMapManager.deleteData('event', this.state.event);
    }
  }

  render() {
    let event = this.state.event;
    return (
      <li key={event.id} className="list-group-item d-flex justify-content-between">
        <div>
          {event.name}
        </div>
        {/* <input id={"event-content" + event.id} type="checkbox" name="list-drop-down" />
        <label htmlFor={"event-content" + event.id} className="border">
        </label> */}
        <div>
          <button className="btn btn-sm btn-primary mr-2" onClick={this.getEventForm.bind(this)}>edit</button>
          <button className="btn btn-sm btn-danger mr-2" onClick={this.deleteEvent.bind(this)}>delete</button>
        </div>
      </li>
    );
  }
}