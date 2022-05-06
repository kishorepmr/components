import React from 'react';
import WebexCreateSpace from './WebexCreateSpace';
import People from '../../data/people';

export default {
  title: 'Platform/Webex Create Space',
  component: WebexCreateSpace,
};

const Template = (args) => <WebexCreateSpace {...args} />;

export const createSpace = Template.bind({});

createSpace.args = {
  createSpace: true,
  spaceName: 'test-widgets',
  createSpaceResponse: (err, data) => console.log(err, data),
  webexLookAhead: true,
  memberLookAhead: (error, query) => {
    let result;

    if (query) {
      result = People[`${query}Collab`];
    }

    return result;
  },
};
