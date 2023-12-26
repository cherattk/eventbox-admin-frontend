import React from 'react';
import AdminerConfig from '../../config';
import { UIEvent } from '../../lib/ui-event';

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      login_data: {
        username: '',
        password: ''
      }
    }
  }

  formValue(event) {
    this.state.login_data[event.target.name] = event.target.value;
    this.setState(this.state);
  }

  submitForm(e) {
    e.preventDefault();

    var self = this;
    this.setState(function () {
      return {
        loading: true
      }
    });

    // var _data = QueryString.stringify(this.state.login_data);
    // Dev
    jQuery.ajax({
      url: AdminerConfig.login_url,
      method: "POST",
      responseType: "JSON",
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: this.state.login_data // prod
    }).done(function (responseData, textStatus, jqXHR) {
      // default message
      var eventMessage = { success: false, auth_token: '' };
      if (jqXHR.status === 200) {
        eventMessage.success = true;
        eventMessage.auth_token = responseData.auth_token;
      }
      // hide loading icon
      self.setState(function () {
        return { loading: false }
      });
      UIEvent.dispatch('login-status', eventMessage);

    }).fail(function (jqXHR, textStatus, errorThrown) {
      // hide loading icon
      self.setState(function () {
        return { loading: false }
      });
      console.error(errorThrown);
    });

  }


  render() {
    var buttonClass = "btn btn-primary btn-block mb-3";
    buttonClass += this.state.loading ? " submited-form" : "";

    return (
      <div className='login-container pt-5'>
        <div className='login-form bg-white border shadow-sm m-auto py-4 px-5 rounded'>
          <h3 className='text-center text-primary'>Login</h3>
          <form>
            <div className="form-group">
              <label htmlFor="username">User</label>
              <input type="text" name="username" 
                className="form-control form-control-lg"
                id="username"
                value={this.state.login_data.username}
                onChange={this.formValue.bind(this)} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" 
              className="form-control form-control-lg"
                id="password"
                value={this.state.login_data.password}
                onChange={this.formValue.bind(this)} />
            </div>
            <button type="submit"
              className={buttonClass}
              onClick={this.submitForm.bind(this)}>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span className="button-text">Login</span>
            </button>
          </form>
        </div>
      </div>
    );
  }
}

