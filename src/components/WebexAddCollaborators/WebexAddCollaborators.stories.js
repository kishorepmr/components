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
  webexLookAhead: true,
  memberLookAhead: async (query) => {
    let result;

    const collabList = () => new Promise((resolve, reject) => setTimeout(() => {
      result = People[`${query}Collab`];
      if (result) {
        resolve(result);
      } else {
        reject();
      }
    }, 500));

    if (query) {
      const collabListResp = await collabList();

      return collabListResp;
    }

    return [];
  },
};
