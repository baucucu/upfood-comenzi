import React from 'react';
export const UserContext = React.createContext({
    user: {},
    role:"",
    phone:"",
    isLoggedIn: false,
    login: () => {},
    logOut: () => {},
})