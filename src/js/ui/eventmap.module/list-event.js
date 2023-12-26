import React from 'react';
import ElementEvent from './element-event';
import EventMapManager from '../../lib/eventmap-manager';
import { Spinner, EmptyState } from '../component/message';
import { UIEvent, DataEvent } from '../../lib/ui-event';

export default class ListEvent extends React.Component {

  constructor() {
    super();

    this.state = {
      loading: false,
      service_id: "",
      list_event: []
      // list_event: EventMapManager.getDataList('event', { service_id: this.props.service_id })
    };
    this.DataEventListener = [];
    this.UIEventListener = [];
  }

  componentDidMount() {
    var self = this;
    // this.UIEventListener.push(UIEvent.addListener('update-list-service', function (event) {
    //   self.state.service_id = event.message.service_id;
    //   self.updateList();
    // }));
    this.UIEventListener.push(UIEvent.addListener('get-service-form', function (event) {
      self.state.service_id = event.message.service_id;
      self.updateList();
    }));
    this.DataEventListener.push(DataEvent.addListener('update-list-event', function (event) {
      self.updateList();
    }));
    this.DataEventListener.push(DataEvent.addListener('update-element-event', function () {
      self.updateList();
    }));
    // this.DataEventListener.push(DataEvent.addListener('update-element-event', function () {
    //   self.updateList();
    // }));
  }

  componentWillUnmount() {
    this.DataEventListener.forEach(element_id => {
      DataEvent.removeListener(element_id);
    });
    this.UIEventListener.forEach(element_id => {
      UIEvent.removeListener(element_id);
    });
  }

  updateList() {
    var self = this;
    this.setState(function () {
      var data = EventMapManager.getDataList('event', { service_id: self.state.service_id });
      return {
        loading: false,
        list_event: data
      };
    });
  }

  getForm() {
    UIEvent.dispatch('show-event-form', {
      service_id: this.state.service_id
    });
  }

  renderList() {
    var list = [];
    var service_id = this.state.service_id;
    // return event list
    this.state.list_event.forEach(function (event, idx) {
      let _key = (new Date()).getTime() + '-' + idx + '-event-list';
      list.push(<ElementEvent key={_key} service_id={service_id} event_id={event.id} index={idx} />);
    });
    return (
      <ul className='list-group'>
        {list}
      </ul>
    );
  }

  render() {
    return (
      <React.Fragment>
        <button type="button" className="btn btn-info btn-sm btn-add mb-3"
          onClick={this.getForm.bind(this)}>
          new event
        </button>
        {this.state.loading ? <Spinner text="Loading event List ..." /> :
          (this.state.list_event.length ? this.renderList() :
            <EmptyState text="There is no registered event for this service" />)
        }
      </React.Fragment>
    );
  }
}