import React from 'react';
import WebexAddCollaborators from './WebexAddCollaborators';

export default {
  title: 'Platform/Webex Add Collaborators',
  component: WebexAddCollaborators,
};

const Template = (args) => <WebexAddCollaborators {...args} />;

export const searchPeople = Template.bind({});
