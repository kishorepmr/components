import React from 'react';
import WebexCreateSpace from './WebexCreateSpace';

export default {
  title: 'Platform/Webex Create Space',
  component: WebexCreateSpace,
};

const Template = (args) => <WebexCreateSpace {...args} />;

export const createSpace = Template.bind({});

createSpace.args = {
  accessToken: 'NTg3MmNhOGItMmRiNi00MDQ3LWI4ZmYtMDQ2YzA5ZDUxNGNlYWE2NzBhZjAtYzhi_PF84_1eb65fdf-9643-417f-9974-ad72cae0e10f',
  createSpace: true,
  spaceName: 'widgets',
  createSpaceResponse: (err, data) => console.log(err, data),
};
