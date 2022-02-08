import {useEffect, useContext, useState} from 'react';
import {AdapterContext} from './contexts';

/**
 * A Webex user.
 *
 * @external AddCollaborators
 * @see {@link https://github.com/webex/component-adapter-interfaces/blob/master/src/PeopleAdapter.js#L6}
 */

/**
 * Custom hook that returns list of people based on search query.
 *
 * @param {string} query  query on which search is performed.
 * @returns {object} list of all persons related to the search query
 */
export default function useAddCollaborators(query) {
  const [personList, setPersonList] = useState([]);
  const {peopleAdapter} = useContext(AdapterContext);

  useEffect(() => {
    const getList = (list) => {
      setPersonList(list);
    };

    const onError = () => {
      setPersonList([]);
    };

    const subscription = peopleAdapter.getPersonList(query).subscribe(getList, onError);

    return () => {
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return personList;
}
