log = new ObjectLogger('Slack', 'debug');

Slack = {};

OAuth.registerService('slack', 2, null, function(query) {
  try {
    log.enter('query', query);
    var accessTokenData = getAccessTokenData(query);
    expect(accessTokenData.access_token).to.be.ok;
    log.debug('accessTokenData=' + accessTokenData);
    var identity = getIdentity(accessTokenData.access_token);
    log.debug('identity=' + identity);

    return {
      serviceData: {
        id: identity.user_id,
        user: identity.user,
        accessToken: accessTokenData.access_token,
        team_id: identity.team_id,
        team: identity.team,
        url: identity.url,
        incoming_webhook: accessTokenData.incoming_webhook
      },
      options: { profile: {
        name: identity.user
      } }
    };
  } finally {
    log.return();
  }
});

var getAccessTokenData = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'slack'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var response;
  try {
    response = HTTP.post(
      "https://slack.com/api/oauth.access", {
        headers: {
          Accept: 'application/json'
        },
        params: {
          code: query.code,
          client_id: config.clientId,
          client_secret: OAuth.openSecret(config.secret),
  //        redirect_uri: Meteor.absoluteUrl("_oauth/slack?close")
          redirect_uri: OAuth._redirectUri('slack', config),
          state: query.state
        }
      });
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Slack. " + err.message),
                   {response: err.response});
  }

  if (!response.data.ok) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Slack. " + response.data.error);
  } else {
    return response.data;
  }
};

var getIdentity = function (accessToken) {
  try {
    var response = HTTP.get(
      "https://slack.com/api/auth.test",
      {params: {token: accessToken}});

    return response.data.ok && response.data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Slack. " + err.message),
                   {response: err.response});
  }
};


Slack.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
