import React, {useState, useContext, useRef} from 'react';
import PropTypes from 'prop-types';
import {forkJoin} from 'rxjs';
import {InputField, Button} from '../generic';
import webexComponentClasses from '../helpers';
import WebexAddCollaborators from '../WebexAddCollaborators/WebexAddCollaborators';
import {AdapterContext} from '../hooks/contexts';

/**
 * Webex Create Space Component
 *
 * @param {object} props Data passed to the component
 * @param {string} props.spaceName Name of space to be created
 * @param {boolean} props.createSpace Boolean to call the webex create space api
 * @param {Function} props.createSpaceResponse Callback function to return response
 *  of the create space api
 * @param {boolean} props.webexLookAhead Boolean to search people in webex sdk
 * @param {Function} props.memberLookAhead Callback function to search people if webexLookAhead is false
 * @param {object} props.style Custom style to apply
 * @returns {object} JSX of the component
 *
 */
export default function WebexCreateSpace({
  spaceName,
  createSpace,
  createSpaceResponse,
  webexLookAhead,
  memberLookAhead,
  style,
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
    const membership = [];

    addedSpaceMembers.forEach((personId) => {
      membership.push(adapter.membershipsAdapter.addRoomMember(personId, data.ID));
    });

    return forkJoin(membership)
      .subscribe(addMembersSuccess, onError);
  };

  const handleCreateSpace = () => {
    if (createSpace) {
      if (spaceTitle) {
        adapter.roomsAdapter.createRoom({title: spaceTitle}).subscribe(createRoomSuccess, onError);
      } else {
        showBanner(true, 'space name is missing');
        if (createSpaceResponse) createSpaceResponse({error: 'access token or space name is missing'});
      }
    }
    if (createSpaceResponse) {
      createSpaceResponse(null, {data: {spaceTitle, addedSpaceMembers}});
    }
  };

  const handleAddedSpaceMembers = (error, members) => {
    setAddedSpaceMembers(members);
  };

  return (
    <div className={cssClasses} style={style}>
      <InputField
        placeholder="Enter space name"
        label="Space name"
        onChange={handleSpaceName}
        value={spaceTitle}
      />
      <WebexAddCollaborators
        addedSpaceMembers={handleAddedSpaceMembers}
        ref={addCollaboratorsRef}
        webexLookAhead={webexLookAhead}
        memberLookAhead={memberLookAhead}
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
  webexLookAhead: PropTypes.bool,
  memberLookAhead: PropTypes.func,
  style: PropTypes.shape(),
};

WebexCreateSpace.defaultProps = {
  spaceName: '',
  createSpace: true,
  createSpaceResponse: undefined,
  webexLookAhead: true,
  memberLookAhead: undefined,
  style: undefined,
};
