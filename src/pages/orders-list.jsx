import React from 'react';
import {useState, useEffect} from 'react';
import { Block,Card, Subnavbar, Searchbar,Page, Navbar, List, ListItem, } from 'framework7-react';
import moment from 'moment';
import _ from 'lodash';

export default function(props) {
  
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`https://app.ecwid.com/api/v3/39042093/orders?token=secret_aSPm45zBRYXfkiribm58TDtgKqdVwEn7`,)
      .then(response => response.json())
      .then(data => {
        setOrders(data.items);
        setLoading(false);
      })
  },[])

  // const searchAll  = (query, orders) =>{
  //   const found=[]
  //   orders.map((order, index) => {
  //     if(order.title.indexOf(query) > -1 || query.trim() === '') found.push(index)
  //   })
  //   console.log(found)
  //   return found
  // }

  return (
    <Page name="orders">
      <Navbar title="Orders">
        <Subnavbar inner={false}>
          <Searchbar
            searchContainer=".search-list"
            searchItem="li"
            searchIn=".item-title"
          ></Searchbar>
        </Subnavbar>
      </Navbar>
      {loading ? <Block>Loading...</Block> :
      <Card>
        <Block>Orders: {orders.length}</Block>

        <List className="searchbar-not-found">
          <ListItem title="Nothing found" />
        </List>
        
        <List mediaList className="search-list searchbar-found">
            {orders.map(order => { return(
              <ListItem
                key={order.id}
                title={order.id+' @ '+ moment(order.createDate.replace('0000','0200')).format('D MMM YYYY HH:mm')}
                subtitle={order.paymentStatus + ' ' + order.fulfillmentStatus}
                after={order.total+' lei'}
                link={`/order/${order.id}/`}
                noChevron={true}
              />)
            })}
        </List>
      </Card>}
    </Page>
  );
}