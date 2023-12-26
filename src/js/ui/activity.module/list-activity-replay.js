import React from 'react';
import config from '../../config';
import Misc from '../../lib/misc';
import { Spinner, EmptyState } from '../component/message';

export default class ListActivityReplay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fetchingStatus: true,
      data_list: []
    }
  }

  componentDidMount() {
    this.fetchList();
  }

  componentWillUnMount() {
  }

  filterEventToReplay(eventList) {
    var data = eventList.filter((el) => {
      return (Object.hasOwnProperty.call(el.content, "received_event"));
    });
    return data;
  }

  fetchList() {
    this.setState(function () {
      return { fetchingStatus: true }
    });
    var self = this;
    var endpoint = config.activity_url + '/error';
    var sessionToken = sessionStorage.getItem('eventbox_session');
    jQuery.getJSON({
      url: endpoint,
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionToken
      }
    }).done(function (responseData) {
      let __responseData = self.filterEventToReplay(responseData);
      self.setState(function () {
        return {
          fetchingStatus: false,
          data_list: __responseData
        }
      });
    })
      .fail(function (jqXHR, textStatus, errorThrown) {
        self.setState(function () {
          return {
            fetchingStatus: false
          }
        });
      });
  }

  toggleElement(id) {
    $('#' + id).collapse('toggle');
  }

  renderList() {
    let list = [];
    this.state.data_list.forEach(function (activity, idx) {
      let key = (new Date()).getTime() + '-' + idx + '-activity-error';
      list.push(
        <li key={key} className='list-group-item p-2'>

          <div className="activity-head p-2 rounded bg-danger text-white"
            onClick={this.toggleElement.bind(this, key)}>
            <span>Error : {activity.error_type}</span>
            <span>Time : {Misc.getDateFormat(activity.log_time)}</span>
          </div>

          <div id={key} className="activity-content border-top pt-2 mt-2 collapse">
            {/* <label>Content : </label> */}
            <pre className='bg-light p-3 rounded'>
              <code>
                {JSON.stringify(activity.content, null, 2)}
              </code>
            </pre>
          </div>

        </li>
      );
    }, this);

    return (
      <ul className="list-group list-activity">
        {list}
      </ul>
    )
  }

  render() {
    return (
      <React.Fragment>

        <h3 className='bg-light border h4 p-3 mt-3 rounded text-primary'>Replay events</h3>

        <div className="bg-light border my-3 p-2 rounded">
          <button type="button" className="btn btn-primary btn-sm"
            onClick={this.fetchList.bind(this)}>
            Refresh
          </button>
        </div>

        {this.state.fetchingStatus ? <Spinner text="Loading Error List ..." /> :
          (this.state.data_list.length ? this.renderList() :
            <EmptyState text="There is no errors yet" />)
        }
      </React.Fragment>
    );
  }
}