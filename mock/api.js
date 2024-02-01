
const data = require("./things.json");

module.exports = function(devServer){

  // THING API //////////////////////////////////////////////
  devServer.app.get('/things', async function (req, res) {
    res.json(data);
  });
  devServer.app.post('/thing', async function (req, res) {
    // return a newly created thing
    res.json(data.service[0]);
  });
  devServer.app.put('/thing', async function (req, res) {
    res.send("update thing withd id : OK");
  });
  devServer.app.delete('/thing', async function (req, res) {
    api.send("delete thing with id : OK");
  });

  // EVENT API //////////////////////////////////////////////
  devServer.app.get('/thing/:thing_id/ce_event', async function (req, res) {
    res.json(data.event[0]);
  });
  devServer.app.post('/thing/:thing_id/ce_event/:event_id', async function (req, res) {
    // return a newly created thing
    res.json(data.event[0]);
  });
  devServer.app.put('/thing/:thing_id/ce_event', async function (req, res) {
    res.send("update event : ok");
  });
  devServer.app.delete('/thing/:thing_id/ce_event/:event_id', async function (req, res) {
    res.send("delete event : ok");
  });
  
}