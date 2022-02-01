import React from 'react';
import {Button} from '../generic';

/**
 * SignIn component performs OAuth 2.0 authentication.
 *
 * @returns {object} JSX of the component
 */
export default function SignIn() {
  return (
    <div className="sign-in-wrapper">
      <Button
        type="join"
        size={40}
        onClick={() => {}}
      >
        Sign In
      </Button>
    </div>
  );
}

SignIn.propTypes = {
};

SignIn.defaultProps = {
};
