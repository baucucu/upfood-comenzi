import React from 'react';
export const OrdersContext = React.createContext({
    orders: [],
    getOrders: () => {},
    getOrderById: () =>{},
})