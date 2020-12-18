import React from 'react';
import {useEffect} from 'react';
import {
    Page,
    Navbar,
    List,
    ListButton
  } from 'framework7-react';

import SignOutButton from '../components/sign-out-button'

import { createClient } from '@supabase/supabase-js';

import firebase from "../js/firebase";

// const supabase = createClient("https://vqfzqdaycwbxpestlhyu.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYwNzA4MjE1OSwiZXhwIjoxOTIyNjU4MTU5fQ.nXZeUZu9aAOJJyQ6GDrBKsaL8ZtZHMCzctAsQZA8rZQ")



export default () => {
  
  // useEffect(() => {
  //   supabase.auth.onAuthStateChange((event, session) => {
  //     console.log("auth state change: ",event, session);
  //   });
  // });
  
  return (
    <Page name="account">
      <Navbar title="Account" />
      <List>
          <ListButton onClick={()=> firebase.auth().signOut()}>
              Sign Out
          </ListButton>
      </List>
      {/* <SignOutButton/> */}
    </Page>
  )
}