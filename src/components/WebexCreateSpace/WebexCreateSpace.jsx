import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {InputField, Button} from '../generic';
import webexComponentClasses from '../helpers';
import WebexAddCollaborators from '../WebexAddCollaborators/WebexAddCollaborators';

/**
 * Webex Create Space Component
 *
 * @param {object} props Data passed to the component
 * @param {string} props.spaceName name of space to be created
 * @param {string} props.accessToken accesstoken to call the webex sdk
 * @param {bool} props.createSpace bool to call the webex create space api
 * @param {func} props.createSpaceResponse callback function to return response
 *  of the create space api
 * @returns {object} JSX of the component
 *
 */
export default function WebexCreateSpace({
  spaceName,
  accessToken,
  createSpace,
  createSpaceResponse,
}) {
  const [spaceTitle, setSpaceTitle] = useState(spaceName);
  const [cssClasses, sc] = webexComponentClasses('create-space');

  const handleSpaceName = (name) => {
    setSpaceTitle(name);
  };

  const handleCreateSpace = () => {
    if (createSpace) {
      if (accessToken) {
        createSpaceResponse(null, {msg: 'space created successfuly'});
      } else {
        createSpaceResponse({error: 'access token not found'});
      }
    } else {
      createSpaceResponse({error: 'create space not allowed'});
    }
  };

  return (
    <div className={cssClasses}>
      <InputField
        placeholder="Enter space name"
        label="Space name"
        onChange={handleSpaceName}
        value={spaceTitle}
      />
      <WebexAddCollaborators />
      <div className={sc('buttons')}>
        <Button
          type="primary"
          onClick={() => {}}
        >
          Cancel
        </Button>
        <Button
          type="join"
          onClick={handleCreateSpace}
        >
          Create new Space
        </Button>
      </div>
    </div>
  );
}

WebexCreateSpace.propTypes = {
  spaceName: PropTypes.string,
  accessToken: PropTypes.string.isRequired,
  createSpace: PropTypes.bool,
  createSpaceResponse: PropTypes.func,
};

WebexCreateSpace.defaultProps = {
  spaceName: '',
  createSpace: '',
  createSpaceResponse: undefined,
};
