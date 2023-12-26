const app_url = window.document.location.origin;
///////////////////////////////////////////////////
const login_url = `${app_url}/login`;
const log_out_url = `${app_url}/logout`;
///////////////////////////////////////////////////
const eventmap_url = `${app_url}/eventmap`;
const activity_url = `${app_url}/activity`;
const auth_token_url = `${app_url}/auth_token`;
module.exports = {
  app_url: app_url,
  eventmap_url: eventmap_url,
  activity_url: activity_url,
  login_url: login_url,
  auth_token_url: auth_token_url,
  log_out_url: log_out_url
}