Package.describe({
  summary: "Login service for Slack accounts",
  version: "1.0.5",
  git: "https://github.com/hubaaa/meteor-accounts-slack",
  name: "hubaaa:accounts-slack"
});

Package.on_use(function(api) {
  api.versionsFrom("METEOR@0.9.0");
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'client');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);
  api.use('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);
  api.use([
    'practicalmeteor:loglevel@1.2.0_2',
    'practicalmeteor:chai@2.1.0_1'
  ]);

  api.add_files('slack_server.js', 'server');

  api.add_files(
    ['slack_login_button.css', 'slack_client.js', 'slack_configure.html', 'slack_configure.js'],
    'client');

  api.add_files("slack.js");
});
