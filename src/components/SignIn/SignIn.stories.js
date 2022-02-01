import React from 'react';
import SignIn from './SignIn';

export default {
  title: 'Platform/Sign In',
  component: SignIn,
};

const Template = (args) => <SignIn {...args} />;

export const WebexAuth = Template.bind({});
WebexAuth.args = {
  authUrl: 'https://webexapis.com/v1/authorize',
  responseType: 'code',
  clientId: process.env.webex_int_client_id,
  redirectUri: 'https:/ngrok.io/verification', // Will be replaced by starter kit demo app url
  scope: 'webexsquare:get_conversation spark:all spark:kms Identity:SCIM',
  signInResponse: () => {},
  tokenStoragePolicy: 'cookie',
  signedOff: () => {},
};
