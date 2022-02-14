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
  clientID: process.env.webex_int_client_id,
  redirectUri: 'http://example.com/verification', // Will be replaced by starter kit demo app url
  scope: process.env.webex_int_scope,
  signInResponse: (clientID, accessToken) => `Example: Send access token as props to create space: ${clientID === process.env.webex_int_client_id ? accessToken : ''}`,
  getAccessToken: () => fetch('http://example.com/access_token').then((res) => {
    if (res.data.access_token) {
      return res.data.accessToken;
    }

    throw Error('Failed to fetch access token');
  }), // access token logic in case of using backend server to store tokens
  tokenStoragePolicy: {place: 'cookie', name: 'integ_cookie', ttl: 1209600},
};
