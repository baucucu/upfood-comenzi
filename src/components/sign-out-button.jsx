import React from 'react';
import {Button} from 'framework7-react';
import {UserContext} from '../contexts/user-context';

export default function SignOutButton() {
  // The Theme Toggler Button receives not only the theme
  // but also a toggleTheme function from the context
  const user = React.useContext(UserContext);
  return (
        <Button
          onClick={user.signOut}
        >
          Sign out
        </Button>
    )
}