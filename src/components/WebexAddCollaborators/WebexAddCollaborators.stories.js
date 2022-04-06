import React from 'react';
import WebexAddCollaborators from './WebexAddCollaborators';
import People from '../../data/people';

export default {
  title: 'Platform/Webex Add Collaborators',
  component: WebexAddCollaborators,
};

const Template = (args) => <WebexAddCollaborators {...args} />;

export const searchPeople = Template.bind({});

searchPeople.args = {
  addedSpaceMembers: (error, members) => console.log('memebers added', members),
  webexLookAhead: false,
  memberLookAhead: (error, query) => {
    let result;

    if (query) {
      result = People[query];
    }

    return result;
  },
};
