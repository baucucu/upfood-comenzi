import React, {useEffect, useState} from 'react';
import {
    Page,
    Navbar,
    List,
    ListButton,
    ListItem,
  } from 'framework7-react';

import firebase from "../js/firebase";

import {UserContext} from '../contexts/user-context'

require("firebase/firestore");

const UsersList = (props) => {
  return(
    <List>
      <ListItem title='Users' groupTitle></ListItem>
      {
        props.users.map( (user, index) => {
          return <ListItem key={index} title={user.name}></ListItem>
        })
      }
    </List>  
  )
}



export default () => {
  const db = firebase.firestore();
  const usersRef = db.collection('users');

  const user = React.useContext(UserContext);
  const [users, setUsers] = useState([])
  
  useEffect(() => {
    console.log(user);
    const usersArray = []
    usersRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        usersArray.push(doc.data())
      })
      setUsers(usersArray)
    })
  },[])

  
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
      {user.role == 'admin' && <UsersList users={users}/>}
    </Page>
  )
}