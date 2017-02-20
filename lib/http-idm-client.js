var request = require("request");
var createError = require('http-errors');

var Client = function (conf) {
  this.conf = conf;
};

//authenticate a client using oauth2 client credentials flow
Client.prototype.authenticateClient = function (client, secret) {
  var conf = this.conf;
  return new Promise(function (resolve, reject) {
    var auth = "Basic " + new Buffer(client + ":" + secret).toString("base64");
    request({
        method: "POST",
        url: conf.protocol + "://" + conf.host + ":" + conf.port + "/oauth2/token",
        form: {
          grant_type: 'client_credentials'
        },
        headers: {
          "Authorization": auth
        }
      },
      function (error, response, body) {
        if (error) {
          return reject(error);
        }
        if (response.statusCode === 200) {
          var result = JSON.parse(body);
          if (result) {
            //var token = result.access_token
            //var type  = result.token_type;
            return resolve(result);
          }
        } else {
          return reject("unexpected result from IDM status code: " + response.statusCode + " response: " + body);
        }
      });
  });
};

function getInfo(conf, infoType, accessToken) {
  return new Promise(function (resolve, reject) {
    var options = {
      url: conf.protocol + "://" + conf.host + ":" + conf.port + "/oauth2/api/" + infoType,
      headers: {
        'Authorization': 'bearer ' + accessToken,
        'User-Agent': 'user-agent',
        'Content-type': 'application/json'
      }
    };
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        try {
          var user = JSON.parse(body);
          return resolve(user);
        } catch (e) {
          return reject(createError(500, "unexpected result from IDM userinfo endpoint " + body + e), null);
        }
      } else if (!error) {
        return reject(createError(response.statusCode, body));
      } else {
        return reject(createError(500, "unexpected error. response from idm " + error));
      }
    });
  });
}

Client.prototype.getUserInfo = function (accessToken) {
  return getInfo(this.conf, "userinfo", accessToken);
};

Client.prototype.getClientInfo = function (accessToken) {
  return getInfo(this.conf, "clientinfo", accessToken);
};

module.exports = Client;
