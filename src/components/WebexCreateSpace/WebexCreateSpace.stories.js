import React from 'react';
import WebexCreateSpace from './WebexCreateSpace';

export default {
  title: 'Platform/Webex Create Space',
  component: WebexCreateSpace,
};

const Template = (args) => <WebexCreateSpace {...args} />;

export const createSpace = Template.bind({});

createSpace.args = {
  accessToken: '',
  createSpace: true,
  spaceName: 'test-widgets',
  createSpaceResponse: (err, data) => console.log(err, data),
};
