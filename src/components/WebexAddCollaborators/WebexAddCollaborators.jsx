import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
  InputField, OptionsList, Icon, Button,
} from '../generic';
import {useAddCollaborators} from '../hooks';
import webexComponentClasses from '../helpers';
import Label from '../inputs/Label/Label';

/**
 * Webex Add Collaborators component
 *
 * @param {func} props.addedSpaceMembers cb function to return the people to be added
 * in the space
 * @returns {object} JSX of component
 */
export default function WebexAddCollaborators({
  addedSpaceMembers,
}) {
  const [inputValue, setInputValue] = useState('');
  const [peopleSelected, setPeopleSelected] = useState([]);
  const [emailSelected, setEmailSelected] = useState([]);
  const [cssClasses, sc] = webexComponentClasses('add-collaborators');
  const searchList = useAddCollaborators(inputValue);

  const handleOnChange = (value) => {
    setInputValue(value);
  };

  const getEmail = (item) => (item?.emails ? item.emails[0] : '');

  // remove people from the added people list
  const removePeopleSelected = (email) => {
    const newEmailSelected = emailSelected.filter((key) => (key !== email));

    setEmailSelected(newEmailSelected);

    const newPeopleSelected = peopleSelected.filter((key) => (getEmail(key) !== email));

    setPeopleSelected(newPeopleSelected);
    addedSpaceMembers(newEmailSelected);
  };

  // add/remove people on list click
  const handleOnSelect = (opt) => {
    const item = JSON.parse(opt.value);
    const email = getEmail(item);

    if (emailSelected.includes(email)) {
      removePeopleSelected(email);
    } else {
      setEmailSelected([...emailSelected, email]);
      setPeopleSelected([...peopleSelected, item]);
      addedSpaceMembers([...emailSelected, email]);
    }
  };

  const peopleAddedList = () => (
    peopleSelected.map((key) => (
      <div
        className={sc('people-added')}
        key={key.id}
      >
        <span className={sc('people-added-content')}>{key.displayName}</span>
        <Button
          type="ghost"
          size={20}
          onClick={() => removePeopleSelected(getEmail(key))}
          tabIndex={50}
          ariaLabel="Close"
        >
          <Icon name="cancel" size={10} />
        </Button>
      </div>
    ))
  );

  // function to render people list based on search
  const renderSuggestions = () => {
    if (!searchList) return null;
    const content = searchList.map((item) => {
      const email = getEmail(item);
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
            key={email}
          >
            <div className={sc('avatar')}>
              {item?.avatar ? (
                <img src={item?.avatar} alt="" />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <div className={sc('data')}>
              <div>{item?.displayName}</div>
              <div>{email}</div>
            </div>
            { emailSelected.includes(email) ? (
              <div className={sc('list-selected')}>
                <Icon name="check" size={16} />
              </div>
            ) : null}
          </div>),
      });
    });

    return (
      <div className={sc('suggestions')}>
        {searchList.length ? (
          <OptionsList
            options={content}
            onSelect={handleOnSelect}
          />
        )
          : null}
      </div>
    );
  };

  return (
    <div className={cssClasses}>
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
}

WebexAddCollaborators.propTypes = {
  addedSpaceMembers: PropTypes.func.isRequired,
};
