import React from 'react';
import {
    Page,
    Navbar,
    List,
    ListButton,
    ListItem,
  } from 'framework7-react';

import firebase from "../js/firebase";

import {UserContext} from '../contexts/user-context'



export default () => {
  const user = React.useContext(UserContext);
  return (
    <Page name="account">
      <Navbar title="Account" />
      <List>
          <ListItem title='User' groupTitle></ListItem>
          <ListItem title="Name" after={user.name} />
          <ListItem title="Phone" after={user.phone} />
          <ListItem title="Role" after={user.role} />
          <ListButton onClick={()=> firebase.auth().signOut()}>
              Sign Out
          </ListButton>
      </List>
    </Page>
  )
}