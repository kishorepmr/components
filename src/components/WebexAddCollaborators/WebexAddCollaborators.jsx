import React, {useState, useEffect} from 'react';
import {InputField, OptionsList} from '../generic';
import {useAddCollaborators} from '../hooks';
import webexComponentClasses from '../helpers';

/**
 * Webex Add Collaborators component
 *
 * @returns {object} JSX of component
 */
export default function WebexAddCollaborators() {
  const [inputValue, setInputValue] = useState('');
  const [selected, setSelected] = useState('');
  const [cssClasses, sc] = webexComponentClasses('add-collaborators');
  const searchList = useAddCollaborators(inputValue);

  useEffect(() => {
  }, [inputValue]);

  const handleOnChange = (value) => {
    setInputValue(value);
  };

  const handleOnSelect = (opt) => {
    setSelected(opt.value);
  };

  const renderSuggestions = () => {
    if (!searchList) return null;
    const content = searchList.map((item) => {
      const email = item?.emails ? item.emails[0] : '';
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
        value: email,
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
          </div>),
      });
    });

    return (
      <div className={sc('suggestions')}>
        {searchList.length ? (
          <OptionsList
            options={content}
            onSelect={handleOnSelect}
            selected={selected}
          />
        )
          : null}
      </div>
    );
  };

  return (
    <div className={cssClasses}>
      <InputField
        placeholder="Add people"
        label="People"
        onChange={handleOnChange}
        value={inputValue}
      />
      {renderSuggestions()}
    </div>
  );
}
