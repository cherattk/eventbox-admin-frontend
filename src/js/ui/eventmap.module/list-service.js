import React from 'react';
// import ElementService from './element-service';
import EventMapManager from '../../lib/eventmap-manager';
import { UIEvent, DataEvent } from '../../lib/ui-event';
import { Spinner, EmptyState } from '../component/message';
import FormService from '../eventmap.module/form-service'

export default class ListService extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      active : '',  // id of the selected item in the list
      list_service: EventMapManager.getDataList('service')
    };

    this.listenerArray = [];
  }

  componentDidMount() {
    var self = this;
    var id_1 = DataEvent.addListener('update-list-service', function () {
      // triggered when adding/removing service from the list
      self.updateServiceList();
    })
    this.listenerArray.push(id_1);
    var id_2 = DataEvent.addListener('update-element-service', function () {
      // triggered when adding/removing service from the list
      self.updateServiceList();
    })
    this.listenerArray.push(id_2);
  }

  componentWillUnmount() {
    this.listenerArray.forEach(element_id => {
      DataEvent.removeListener(element_id);
    });
  }

  updateServiceList() {
    this.setState(function () {
      return { loading: true }
    });
    let list_service = EventMapManager.getDataList('service', null);
    this.setState(function () {
      return {
        loading: false,
        list_service: list_service
      }
    });
  }

  getServiceForm(service_id) {
    // UIEvent.dispatch('get-service-form', { id: null });
    // var __service_id = service_id ? service_id : util.generateEventMapID('service');
    UIEvent.dispatch('get-service-form', {
      show : true,
      service_id: service_id
    });
    this.setState(function(){
      return {
        active : service_id
      }
    });
    // console.log(service_id);
  }

  renderList() {
    var list = [];
    this.state.list_service.forEach(function (service, idx) {
      let __key = (new Date()).getTime() + '-' + idx + '-service-list-';
      let __active = this.state.active === service.id ? ' active' : '';
      list.push(
        <li key={__key} 
            className={'list-group-item list-group-item-action' + __active}
            onClick={this.getServiceForm.bind(this , service.id)}>
            {service.name}
      </li>
      );
      // list.push(<ElementService key={_key} service_id={service.id} index={idx + 1} />);
    }, this);

    return (
      <ul className="list-group">
        {list}
      </ul>
    );
  }

  render() {
    return (
      <React.Fragment>
        {/* <button type="button" className="btn btn-info btn-sm btn-add"
          onClick={this.getServiceForm.bind(this , null)}>
          New Publisher
        </button> */}
        <FormService/>
        <hr />
        {this.state.loading ? <Spinner text="Loading Service List ..." /> :
          (this.state.list_service.length ? this.renderList() :
            <EmptyState text="There is no registered service" />)
        }
      </React.Fragment>
    );
  }
}