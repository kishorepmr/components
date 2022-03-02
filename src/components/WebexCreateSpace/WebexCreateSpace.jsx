import React, {useState, useContext, useRef} from 'react';
import PropTypes from 'prop-types';
import {InputField, Button} from '../generic';
import webexComponentClasses from '../helpers';
import WebexAddCollaborators from '../WebexAddCollaborators/WebexAddCollaborators';
import {AdapterContext} from '../hooks/contexts';

/**
 * Webex Create Space Component
 *
 * @param {object} props Data passed to the component
 * @param {string} props.spaceName name of space to be created
 * @param {bool} props.createSpace bool to call the webex create space api
 * @param {func} props.createSpaceResponse callback function to return response
 *  of the create space api
 * @returns {object} JSX of the component
 *
 */
export default function WebexCreateSpace({
  spaceName,
  createSpace,
  createSpaceResponse,
}) {
  const [spaceTitle, setSpaceTitle] = useState(spaceName);
  const [cssClasses, sc] = webexComponentClasses('create-space');
  const [addedSpaceMembers, setAddedSpaceMembers] = useState([]);
  const [alertMsg, setAlertMsg] = useState('');
  const adapter = useContext(AdapterContext);
  const addCollaboratorsRef = useRef();

  const handleCancel = () => {
    setSpaceTitle('');
    setAlertMsg('');
    addCollaboratorsRef.current.clearInput();
  };

  const showBanner = (isError, msg) => {
    const bannerData = (
      <span className={isError ? sc('error') : sc('success')}>
        {msg}
      </span>
    );

    setAlertMsg(bannerData);
  };

  const handleSpaceName = (name) => {
    setSpaceTitle(name);
  };

  const onError = (error) => {
    showBanner(true, error.message);
  };

  const addMembersSuccess = () => {
    showBanner(false, 'space created successfully');
    if (createSpaceResponse) {
      createSpaceResponse(null, {data: {spaceTitle, addedSpaceMembers}, msg: 'space created successfully'});
    }
  };

  const createRoomSuccess = (data) => {
    addedSpaceMembers.forEach((email) => {
      adapter.membershipsAdapter.addMembersToSpace({roomId: data.id, personalEmail: email})
        .subscribe(addMembersSuccess, onError);
    });
  };

  const handleCreateSpace = () => {
    if (createSpace) {
      if (spaceTitle) {
        adapter.roomsAdapter.createRoom(spaceTitle).subscribe(createRoomSuccess, onError);
      } else {
        showBanner(true, 'space name is missing');
        if (createSpaceResponse) createSpaceResponse({error: 'access token or space name is missing'});
      }
    } else {
      if (createSpaceResponse) createSpaceResponse(null, {data: {spaceTitle, addedSpaceMembers}});
      handleCancel();
    }
  };

  const handleAddedSpaceMembers = (members) => {
    setAddedSpaceMembers(members);
  };

  return (
    <div className={cssClasses}>
      <InputField
        placeholder="Enter space name"
        label="Space name"
        onChange={handleSpaceName}
        value={spaceTitle}
      />
      <WebexAddCollaborators
        addedSpaceMembers={handleAddedSpaceMembers}
        ref={addCollaboratorsRef}
      />
      {alertMsg}
      <div className={sc('buttons')}>
        <Button
          type="primary"
          onClick={handleCancel}
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
  createSpace: PropTypes.bool,
  createSpaceResponse: PropTypes.func,
};

WebexCreateSpace.defaultProps = {
  spaceName: '',
  createSpace: true,
  createSpaceResponse: undefined,
};
