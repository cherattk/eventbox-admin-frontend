import React from 'react';
import config from '../../config';
import Misc from '../../lib/misc';
import { Spinner, EmptyState } from '../component/message';

export default class ListActivity extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data_list: []
    }

  }

  componentDidMount() {
    this.fetchList();
  }

  componentWillUnMount() {
    // clearInterval(this.fetchDataInterval);
  }

  fetchList() {

    var self = this;
    this.setState(function () {
      return { loading: true }
    },
      function () {
        // todo use fetch()
        var sessionToken = sessionStorage.getItem('eventbox_session');
        jQuery.ajax({
          url : config.activity_url,
          method : "GET",
          headers: {
            Authorization: "Bearer " + sessionToken
          }
        }).done(function (responseData) {
            self.setState(function () {
              return {
                loading: false,
                data_list: responseData
              }
            });
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            self.setState(function () {
              return {
                loading: false
              }
            });
          });
      });
  }

  toggleElement(btn_id, target_div) {
    $('#' + btn_id).toggleClass('open-dropdown');
    $('#' + target_div).collapse('toggle');
  }

  renderList() {
    let list = [];
    this.state.data_list.forEach(function (activity, idx) {
      let key = (new Date()).getTime() + '-' + idx + 'activity-event';
      let activity_head = "activity-head-" + key;
      // let __activityContent = JSON.parse(activity.content);
      // let __activityContent = activity.content;
      list.push(
        <li key={key} className='list-group-item activity p-1'>
          <div id={activity_head} 
            className={ "activity-head p-2 m-0 alert" + (activity.type === "event" ? " alert-success" : " alert-danger") }
            onClick={this.toggleElement.bind(this, activity_head, key)}>
            {/* <span className='px-3'>
              {activity.type}
            </span> */}
            
            <span className='px-3'>
              { activity.type === "event" ? activity.event_type : activity.error_type }
            </span>
            
            <span className='px-3'>
              {Misc.getDateFormat(activity.timestamp)}
            </span>
          </div>

          <div id={key} className="activity-content mt-2 collapse">
            {/* <label>Content : </label> */}
            <pre className='px-3'>
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
    );
  }

  render() {

    return (
      <React.Fragment>
        <div className="bg-light border my-3 p-2 rounded">
          <button type="button" className="btn btn-primary btn-sm"
            onClick={this.fetchList.bind(this)}>
            Refresh
          </button>
        </div>

        {this.state.loading ? <Spinner text="Loading Event List ..." /> :
          (this.state.data_list.length ? this.renderList() :
            <EmptyState text="There is no Event yet" />)
        }

      </React.Fragment>
    );
  }
}