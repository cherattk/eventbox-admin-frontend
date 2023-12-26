import React from 'react';
import ElementListener from './element-listener';
import EventMapManager from '../../lib/eventmap-manager';
import { DataEvent , UIEvent} from '../../lib/ui-event';
import {EmptyState} from '../component/message';

export default class ContainerEventMapping extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list_listener: EventMapManager.getDataList('listener'),
    }

    this.__internalListener = [];

  }

  componentDidMount() {
    var self = this;
    this.__internalListener.push(DataEvent.addListener('update-list-listener', function (dataEvent) {
      self.setState(function () {
        var data = EventMapManager.getDataList('listener');
        return {
          list_listener: data
        }
      });
    }));
  }

  componentWillUnmount() {
    this.__internalListener.forEach(element_id => {
      DataEvent.removeListener(element_id);
    });
  }

  addListenerForm() {
    UIEvent.dispatch('show-listener-form');
  }

  renderListListener() {
    var list = [];
    this.state.list_listener.forEach(function (listener, idx) {
      // let __key = (new Date()).getTime() + '-' + idx + '-listener-list';
      list.push(<ElementListener key={listener.id + idx} listener_id={listener.id} />);
    }, this);

    return (
      <>
        {list}
      </>
    );
  }

  renderAddListenerButton() {
    return (<button type="button" className="btn btn-info btn-sm btn-add mb-3"
      onClick={this.addListenerForm.bind(this)}>
      New Mapping
    </button>);
  }

  render() {
    return (
      <div>
        {this.renderAddListenerButton()}
        {
          this.state.list_listener.length > 0 ? this.renderListListener() :
            <EmptyState text="There is no registered listener" />
        }
      </div>
    );
  }
}