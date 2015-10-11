log = new ObjectLogger('Accounts', 'debug');

Accounts.oauth.registerService('slack');

if (Meteor.isClient) {
  Meteor.loginWithSlack = function(options, callback) {
    try {
      log.enter('loginWithSlack', options);
      // support a callback without options
      if (! callback && typeof options === "function") {
        callback = options;
        options = null;
      }

      var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
      Slack.requestCredential(options, credentialRequestCompleteCallback);
    } finally {
      log.return();
    }
  };
} else {
  Accounts.addAutopublishFields({
    // publish all fields including access token, which can legitimately
    // be used from the client (if transmitted over ssl or on
    // localhost). http://www.meetup.com/meetup_api/auth/#oauth2implicit
    forLoggedInUser: ['services.slack'],
    forOtherUsers: ['services.slack.id']
  });
}
