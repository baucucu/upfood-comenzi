import React from 'react';
export const UserContext = React.createContext({
    user: {},
    isLoggedIn: false,
    login: () => {},
    logOut: () => {},
})