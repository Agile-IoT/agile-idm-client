
const  request  = require('request');

var HTTPIDMClient = function (configuration) {

   if(configuration && configuration !=null){
     this.url = configuration["web-server"];
   }
   else{
	    console.error("cannot find configuration for identity mangement http client");
  }
};


HTTPIDMClient.prototype.authenticateEntityPromisse = function(token){
    var url =  this.url;
    var options = {     url: url,
                        headers: {'Authorization': "bearer "+ token,
                           "User-Agent": "user-agent",
                          'content-type': 'application/json'
                  }
    };

    var promisse = new Promise((resolve, reject) => {
        request.get(options,function(onAuthenticationFinished, error, response, body){
          if(!error && response.statusCode == 200){
            return resolve (result);
          }
          else if(!error){
            if(response.statusCode == 401)
                return reject(new Error("bad credentials for authentication"));
            else
                return reject(new Error("wrong satus code from authentication: "+response.statusCode+" error "+ body));
         }
         else{
            return reject(new Error(JSON.stringify(error)));
        }
        }.bind(this,onAuthenticationFinished));
    });
    return promisse;
}

module.exports = HTTPIDMClient;
/*
var client = new IDMClient();
client.registerEntity({"id":"1","auth_type":"github","token":"token_here","entity_type":"sensor","name":"123"}, function(result){console.log('response'+JSON.stringify(result));}.bind(this));*/
