import React, {
  useState, forwardRef, useImperativeHandle, useContext,
} from 'react';
import PropTypes from 'prop-types';
import {
  InputField, OptionsList, Icon, Button,
} from '../generic';
import webexComponentClasses from '../helpers';
import Label from '../inputs/Label/Label';
import {AdapterContext} from '../hooks/contexts';

/**
 * Webex Add Collaborators component is used to search people based on
 * search query
 *
 * @param {Function} props.addedSpaceMembers Callback function to return the people to be added
 * in the space
 * @param {boolean} props.webexLookAhead Boolean to search people in webex sdk
 * @param {Function} props.memberLookAhead Callback function to search people from collaborators
 * @param {object} props.style Custom style to apply
 * @returns {object} JSX of component
 */

const WebexAddCollaborators = forwardRef(({
  addedSpaceMembers, webexLookAhead, memberLookAhead, style,
}, ref) => {
  const [inputValue, setInputValue] = useState('');
  const [peopleSelected, setPeopleSelected] = useState([]);
  const [personIdSelected, setPersonIdSelected] = useState([]);
  const [cssClasses, sc] = webexComponentClasses('add-collaborators');
  const adapter = useContext(AdapterContext);

  let contactsList;
  let collaboratorsList;

  const searchPeopleSuccess = (list) => {
    contactsList = [...list];
  };

  const onError = () => {
    contactsList = [];
  };

  if (inputValue) {
    if (webexLookAhead) {
      adapter.peopleAdapter.searchPeople(inputValue)
        .subscribe(searchPeopleSuccess, onError);
    }
    if (typeof memberLookAhead === 'function') {
      collaboratorsList = memberLookAhead(null, inputValue);
    }
  }

  const clearInput = () => {
    setInputValue('');
    setPersonIdSelected([]);
    setPeopleSelected([]);
    contactsList = [];
  };

  useImperativeHandle(ref, () => ({
    clearInput,
  }));

  const handleOnChange = (value) => {
    setInputValue(value);
  };

  const getEmail = (item) => (item?.emails ? item.emails[0] : '');

  // remove people from the added people list
  const removePeopleSelected = (ID) => {
    const newPersonIdSelected = personIdSelected.filter((key) => (key !== ID));

    setPersonIdSelected(newPersonIdSelected);
    const newPeopleSelected = peopleSelected.filter((key) => (key.ID !== ID));

    setPeopleSelected(newPeopleSelected);
    if (addedSpaceMembers) addedSpaceMembers(null, newPersonIdSelected);
  };

  // add/remove people on list click
  const handleOnSelect = (opt) => {
    const item = JSON.parse(opt.value);
    const id = item.ID;

    if (personIdSelected.includes(id)) {
      removePeopleSelected(id);
    } else {
      setPersonIdSelected([...personIdSelected, id]);
      setPeopleSelected([...peopleSelected, item]);
      if (addedSpaceMembers) addedSpaceMembers(null, [...personIdSelected, id]);
    }
  };

  const peopleAddedList = () => (
    peopleSelected.map((key) => (
      <div
        className={sc('people-added')}
        key={key.ID}
      >
        <span className={sc('people-added-content')}>{key.displayName}</span>
        <Button
          type="ghost"
          size={20}
          onClick={() => removePeopleSelected(key.ID)}
          tabIndex={50}
          ariaLabel="Close"
        >
          <Icon name="cancel" size={10} />
        </Button>
      </div>
    ))
  );

  const renderPersonList = (list, type) => {
    const content = list && list.map((item) => {
      const email = getEmail(item);
      const id = item.ID;
      const names = item?.displayName?.split(' ');
      let initials;

      /* fetch the first char of the first name
         and the last name to show as initials
      */
      if (names) {
        initials =
      names.length === 1
        ? names[0][0]
        : `${names[0][0]}${names[names.length - 1][0]}`;
      }

      return ({
        value: JSON.stringify(item),
        label: (
          <div
            className={sc('suggestions-list')}
            key={id}
          >
            <div>
              {item?.avatar ? (
                <img className={sc('avatar')} src={item?.avatar} alt="" />
            ) : (
              <span>{initials}</span>
            )}
            </div>

            <div className={sc('data')}>
              <div>{item?.displayName}</div>
              <div>{email}</div>
            </div>
            { personIdSelected.includes(id) ? (
              <div className={sc('list-selected')}>
                <Icon name="check" size={16} />
              </div>
            ) : null}
          </div>),
      });
    });

    return (
      <div>
        <div className={sc('list-heading')}>{type}</div>
        {list && list.length ? (
          <OptionsList
            options={content}
            onSelect={handleOnSelect}
          />
        ) : (
          <div className={sc('search-error')}>We cannot seem to find anyone matching your search.</div>
        )}
      </div>
    );
  };

  // function to render people list based on search
  const renderSuggestions = () => {
    if (!contactsList && !collaboratorsList) return null;

    return (
      <div className={sc('suggestions')}>
        {renderPersonList(collaboratorsList, 'Collaborators')}
        {renderPersonList(contactsList, 'Contacts')}
      </div>
    );
  };

  return (
    <div className={cssClasses} style={style}>
      <Label
        label="People"
      />
      <div className={sc('people-list-box')}>
        {peopleAddedList()}
        <InputField
          placeholder={peopleSelected.length ? 'Add another' : 'Add people'}
          onChange={handleOnChange}
          value={inputValue}
        />
      </div>
      {renderSuggestions()}
    </div>
  );
});

WebexAddCollaborators.propTypes = {
  addedSpaceMembers: PropTypes.func,
  webexLookAhead: PropTypes.bool,
  memberLookAhead: PropTypes.func,
  style: PropTypes.shape(),
};

WebexAddCollaborators.defaultProps = {
  addedSpaceMembers: PropTypes.func,
  webexLookAhead: true,
  memberLookAhead: undefined,
  style: undefined,
};

export default WebexAddCollaborators;
