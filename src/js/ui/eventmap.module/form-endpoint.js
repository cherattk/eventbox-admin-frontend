import React from 'react';
import EventMapManager from '../../lib/eventmap-manager';
import { DataEvent, UIEvent } from '../../lib/ui-event';
import eventmapSchema from '../../lib/eventmapSchema';

export default class FormEndpoint extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      endpoint: eventmapSchema.serviceEndpointSchema()
    };

    this.__eventsetListener = [];
  }

  componentWillUnmount() {
    this.__eventsetListener.forEach(element_id => {
      UIEvent.removeListener(element_id);
    });
  }

  componentDidMount() {
    var self = this;
    //===========================================================
    this.__eventsetListener.push(UIEvent.addListener('show-endpoint-form', function (uiEvent) {
      var __endpoint;
      // edit endpoint
      if (typeof uiEvent.message.endpoint_id !== "undefined") {
        __endpoint = EventMapManager.getData('endpoint', uiEvent.message.endpoint_id)
      }
      // create a new one
      else {
        __endpoint = eventmapSchema.serviceEndpointSchema();
        __endpoint.service_id = uiEvent.message.service_id;
      }
      self.setState(function () {
        return {
          endpoint: __endpoint
        };
      }, function () {
        $(self.modal).modal('show');
      });
    }));
  }

  close() {
    var self = this;
    this.setState(function () {
      return {
        endpoint: eventmapSchema.serviceEndpointSchema()
      };
    }, function () {
      $(self.modal).modal('hide');
    });
  }

  isValidURL(inputName) {
    return !!inputName;
  }

  saveForm() {
    if (!this.isValidURL(this.state.endpoint.url)) {
      alert("bad endpoint value");
      return;
    }
    if (this.state.endpoint.id) {
      EventMapManager.updateData('endpoint', this.state.endpoint);
    }
    else {
      this.state.endpoint.active = true;
      EventMapManager.addData('endpoint', this.state.endpoint);
    }
    this.close();
    // console.log(__service);
  }

  deleteEndpoint(ev) {
    EventMapManager.deleteData('endpoint', this.state.endpoint.id);
    this.close();
  }

  activateEndpoint() {
    this.state.endpoint.active = !this.state.endpoint.active;
    this.setState(this.state);
  }

  endpointURLValue(event) {
    this.state.endpoint.url = event.target.value;
    this.setState(this.state);
  }

  render() {
    return (
      <div className="modal fade app-modal-form"
        tabIndex="-1" role="dialog"
        ref={node => (this.modal = node)}>

        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header px-4">
              <h5 className="modal-title">
                Listener Endpoint
              </h5>
              <button type="button" className="close"
                onClick={this.close.bind(this)} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <form>
              <div className="modal-body px-4">

                <div className="form-group">
                  <label htmlFor="service-name" className="col-form-label">Endpoint:</label>
                  <input type="text" className="form-control"
                    name="endpoint_url"
                    value={this.state.endpoint.url} placeholder="ex: endpoint url"
                    onChange={this.endpointURLValue.bind(this)}
                    disabled={this.state.endpoint.id && !this.state.endpoint.active}
                    style={this.state.endpoint.id && !this.state.endpoint.active ? { textDecoration: "line-through" } : null} />
                </div>
                {
                  this.state.endpoint.id ?
                    <div className="bg-light border p-2 rounded d-flex justify-content-between">
                      <button type="button" className="btn btn-primary btn-sm mr-3"
                        onClick={this.activateEndpoint.bind(this)}>
                        {this.state.endpoint.active ? "deactivate" : "activate"}
                      </button>
                      <button type="button" className="btn btn-danger btn-sm mr-3"
                        value={this.state.endpoint.id} onClick={this.deleteEndpoint.bind(this)}>Delete</button>
                    </div> : null
                }
              </div>

              <div className="modal-footer px-4">
                <button type="button" className="btn btn-primary btn-sm mr-3"
                  onClick={this.saveForm.bind(this)}>Save changes</button>
                <button type="button" className="btn btn-secondary btn-sm"
                  onClick={this.close.bind(this)}>Close</button>
              </div>
            </form>

          </div>
        </div>
      </div>
    )
  }
}