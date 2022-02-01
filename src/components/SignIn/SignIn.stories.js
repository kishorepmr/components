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
  clientId: 'C185d483590b3b2b3abe9537bd0307bec772b187aa544b4471dfe9339c983d249',
  redirectUri: 'https://b7f1-49-37-218-15.ngrok.io/verification',
  scope: 'webexsquare:get_conversation spark:all spark:kms Identity:SCIM',
  signInResponse: () => {},
  tokenStoragePolicy: 'cookie',
  signedOff: () => {},
};
