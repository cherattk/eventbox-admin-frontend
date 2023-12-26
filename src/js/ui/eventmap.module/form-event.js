import React from 'react';
import EventMapManager from '../../lib/eventmap-manager';
import { UIEvent } from '../../lib/ui-event';
import eventMapSchema from '../../lib/eventmapSchema';


export default class FormEvent extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.initialState();
  }

  initialState() {
    return {
      service: eventMapSchema.serviceSchema(),
      event: eventMapSchema.eventSchema(),
    };
  }

  componentDidMount() {
    var self = this;
    //===============================================
    UIEvent.addListener('show-event-form', function (uiEvent) {

      console.log(uiEvent.message);

      var __service = EventMapManager.getData('service', uiEvent.message.service_id);

      var __event;
      // edit item
      if (typeof uiEvent.message.event_id !== 'undefined') {
        __event = EventMapManager.getData('event', uiEvent.message.event_id)
      }
      // add new item
      else {
        __event = eventMapSchema.eventSchema();
        __event.service_id = __service.id;
        __event.cloud_event.source = __service.host;
      }

      self.setState(function () {
        return {
          service: __service,
          event: __event
        };
      }, function () {
        $(self.modal).modal('show');
      });
    });
  }

  close() {
    let self = this;
    this.setState(function () {
      return self.initialState();
    }, function () {
      $(self.modal).modal('hide');
    });
  }

  saveEvent(e) {
    e.preventDefault();
    let event = this.state.event;
    // if (!event.service_id) {
    //   return alert('You must select a service that trigger the event');
    // }
    if (!event.cloud_event.type) {
      return alert('The event must have a name');
    }
    if (event.id) {
      // element already exists
      EventMapManager.updateData('event', event);
    } else {
      // add a new one
      EventMapManager.addData('event', event);
    }
    this.close();
  }

  formValue(event) {
    // if (event.target.name === "service_id") {
    //   // set the cloudevent.source vaklues to ce_source field
    //   let __service_id = event.target.value;
    //   var _service = EventMapManager.getData('service', __service_id);
    //   this.state.event.cloud_event.source = _service.host;
    // }
    var rgx = new RegExp('^ce_');
    if (rgx.test(event.target.name)) {
      let propName = event.target.name.substring(3);
      this.state.event.cloud_event[propName] = event.target.value;
    }
    else {
      this.state.event[event.target.name] = event.target.value;
    }
    this.setState(this.state);
  }

  // listService() {
  //   let dataList = EventMapManager.getDataList('service', null).reverse();
  //   var list = [];
  //   dataList.forEach(function (service, idx) {
  //     list.push(<option key={idx + '-opt-service'} value={service.id}>{service.name}</option>);
  //   });
  //   return list;
  // }

  copyEventCode() {
    var ce_code = JSON.stringify(this.state.event, null , 2);
    navigator.clipboard.writeText(ce_code);
  }

  render() {
    return (
      <div className="modal fade app-modal-form" id="formEvent"
        tabIndex="-1" role="dialog"
        aria-labelledby="formEventLabel"
        aria-hidden="true"
        ref={node => (this.modal = node)}>

        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header px-4">
              <h5 className="modal-title text-primary" id="formEventLabel">
                Event Information
              </h5>
              <button type="button" className="close" onClick={this.close.bind(this)} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <nav>
              <div className="nav nav-tabs pt-3 px-3" role="tablist">
                <a className="nav-link mr-3 border active" data-toggle="tab"
                  href="#ce_details" role="tab">Details</a>
                <a className="nav-link mr-3 border" data-toggle="tab"
                  href="#ce_rawformat" role="tab">Raw Format</a>
              </div>
            </nav>

            <div className="tab-content modal-body px-4">
              <div className="tab-pane show active" id="ce_details" role="tabpanel">
                <form onSubmit={this.saveEvent.bind(this)}>
                  <div className="form-group">
                    <label className='text-primary font-weight-bold'>
                      Producer
                    </label>
                    <p className="bg-light rounded px-3 py-2 m-0">{this.state.service.name}</p>
                    <small className='px-2'>
                      Read only value
                    </small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="event_name" className='text-primary font-weight-bold'>
                      Event Name
                    </label>
                    <input id="event_name" type="text" className="form-control"
                      name="name"
                      value={this.state.event.name}
                      onChange={this.formValue.bind(this)} />
                  </div>

                  <hr />

                  <h5 className='bg-primary p-3 rounded text-white'>CloudEvent Attributes</h5>
                  <div className="form-group">
                    <label className='text-primary font-weight-bold'>
                      Source
                    </label>
                    <p className="bg-light rounded px-3 py-2 m-0">{this.state.service.host}</p>
                    <small className='px-2'>
                      Read only value - the value of the <strong> source </strong>field is a the
                      value of the <strong> host </strong> field of the service.
                    </small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="ce_type" className='text-primary font-weight-bold'>
                      Type
                    </label>
                    <input id="ce_type" type="text" className="form-control"
                      name="ce_type"
                      value={this.state.event.cloud_event.type}
                      onChange={this.formValue.bind(this)} />
                    <small className='px-2'>Example : com.company.entity.update</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="ce_datacontenttype" className='text-primary font-weight-bold'>
                      Data Content Type
                    </label>
                    <input id="ce_datacontenttype" type="text" className="form-control"
                      name="ce_datacontenttype"
                      value={this.state.event.cloud_event.datacontenttype}
                      onChange={this.formValue.bind(this)} />
                    <small className='px-2'>
                      The <strong>datacontenttype</strong> attribute of the cloudevent event.
                    </small>
                  </div>
                  {/* <!-- END CLOUDEVENT --> */}
                  <div className="form-group">
                    <label htmlFor="event_description" className='text-primary font-weight-bold'>
                      Description
                    </label>
                    <textarea id="event_description" className="form-control"
                      name="description"
                      value={this.state.event.description}
                      onChange={this.formValue.bind(this)}></textarea>
                  </div>
                  <div className="modal-footer px-4 justify-content-between">
                    <button type="submit" className="btn btn-primary btn-sm"
                    // onClick={this.saveForm.bind(this)}>Save changes</button>
                    >Save changes</button>
                    <button type="button" className="btn btn-secondary btn-sm"
                      onClick={this.close.bind(this)}>Close</button>
                  </div>
                </form>
              </div>
              <div className="tab-pane" id="ce_rawformat" role="tabpanel">
                <h3 className='card-header'>Raw Format</h3>
                <div className='card-body'>
                  <pre>
                    {JSON.stringify(this.state.event, null, 4)}
                  </pre>
                </div>
                <div className='card-footer'>
                  <button onClick={this.copyEventCode.bind(this)}>Copy Code</button>
                </div>
              </div>
            </div>

          </div>
        </div >
      </div >
    )
  }
}