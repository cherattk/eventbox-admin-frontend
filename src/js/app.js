import React from 'react';
import { createRoot } from 'react-dom/client';
// import HttpClient from 'axios';

// import AdminerConfig from './config';
// import Misc from './lib/misc';
// import { UIEvent } from './lib/ui-event';
import EventMapManager from './lib/eventmap-manager';

import FormEvent from './ui/eventmap.module/form-event';
import FormListener from './ui/eventmap.module/form-listener';
import FormEndpoint from './ui/eventmap.module/form-endpoint';

import ContainerActivity from './ui/activity.module/container-activity';
import ContainerSetting from './ui/eventmap.module/container-setting';
import ContainerEventMapping from './ui/eventmap.module/container-eventmapping';
// import LoginForm from './ui/component/login-form';

// import ModalFormService from './ui/eventmap.module/modal-form-service';
import DetailService from './ui/eventmap.module/detail-service';

function Adminer() {
  return (
    <>
      <nav className="app-module-nav pt-4 bg-light">
        <div className="nav nav-tabs container" id="nav-tab" role="tablist">
          <a className="nav-item nav-link active mr-3 bg-white border"
            data-toggle="tab" href="#nav-setting" role="tab">
            Services
          </a>
          <a className="nav-item nav-link mr-3 bg-white border"
            data-toggle="tab" href="#nav-eventmapping" role="tab">
            Event {'<=>'} Listener Mapping
          </a>
          <a className="nav-item nav-link mr-3 bg-white border"
            data-toggle="tab" href="#nav-activity" role="tab">
            Activity
          </a>
        </div>
      </nav>


      <div className="app-content py-3">
        <div className="tab-content container px-0 py-3">
          <div className="tab-pane fade show active" id="nav-setting"
            role="tabpanel">
            <ContainerSetting />
          </div>
          <div className="tab-pane fade" id="nav-eventmapping"
            role="tabpanel">
            <ContainerEventMapping />
          </div>
          <div className="tab-pane fade" id="nav-activity"
            role="tabpanel">
            <ContainerActivity />
          </div>
        </div>

        {/* <ModalFormService /> */}
        <FormEvent />
        <FormListener />
        <FormEndpoint />
        <DetailService />

      </div>


    </>

  );
}


///////////////////////////////////////////////////////////////////////////

const RootApp = createRoot(document.getElementById('app'));

///////////////////////////////////////////////////////////////////////////
const sessionToken = sessionStorage.getItem('eventbox_session');
EventMapManager.loadEventMap(sessionToken , function () {
  RootApp.render(<Adminer />);
});

/**
 *   IF user has a valid auth token render the app() 
 */
// function checkSession() {
//   var session_token = sessionStorage.getItem('eventbox_session');
//   if (!session_token || session_token == 'undefined') {
//     renderLoginForm();
//   }
//   else {
//     jQuery.ajax({
//       url: AdminerConfig.auth_token_url,
//       method: "GET",
//       headers: {
//         'Authorization': 'Bearer ' + session_token
//       },
//     }).done(function (responseData, textStatus, jqXHR) {
//       if (jqXHR.status === 200) {
//         renderConnectedState(responseData.auth_token);
//       }
//     }).fail(function () {
//       renderLoginForm();
//     });

//   }
// }

// // LOG OUT ACTION
// document.getElementById('logout').onclick = function (e) {

//   var sessionToken = sessionStorage.getItem('eventbox_session');
//   if (sessionToken) {
//     jQuery.ajax({
//       url: AdminerConfig.log_out_url,
//       method: "POST",
//       headers : {
//         Authorization : "Bearer " + sessionToken
//       }
//     }).done(function () {
//       renderLoginForm();
//       e.target.style.visibility = 'hidden';
//     }).fail(function (jqXHR, textStatus, errorThrown) {
//       console.log(errorThrown);
//     });
//   }
//   else{
//     renderLoginForm();
//     e.target.style.visibility = 'hidden';
//   }
// }

//////////////////////////////////////////////////////////////////////////

// checkSession();
// RenderApp();



