import React from 'react';
import {useState, useEffect} from 'react';
import { BlockTitle, Card, Subnavbar, Searchbar, Page, Navbar, List, ListItem, ListGroup } from 'framework7-react';
import _ from 'lodash';
import moment from 'moment';
import { f7, f7ready } from 'framework7-react';


export default function(props) {
  
  const [orders, setOrders] = useState([])
  const [filters, setFilters] = useState(['AWAITING_PAYMENT','CANCELLED','AWAITING_PROCESSING','PROCESSING','SHIPPED','RETURNED'])
  
  useEffect(() => {  
    console.log("token: ",process.env.TOKEN)
    fetch(`https://app.ecwid.com/api/v3/39042093/orders?token=${process.env.TOKEN}`,)
      .then(response => response.json())
      .then(data => {
        setOrders(data.items);
      })
  },[])

  useEffect(() => {
    f7ready(() => {
      var smartSelect = f7.smartSelect.get('.smart-select');
      smartSelect.app.on('smartSelectClosed',(ss) => {
        let newFilters = ss.getValue()
        setFilters([...newFilters])
      })
    })
  },[])

  useEffect(() => {
    const newOrders = filterOrders()
  })

  const searchbarSearch = (searchbar,query,prevQuery) => {
  }

  const filterOrders = () => {
    return orders.filter(order =>  _.includes(filters, order.paymentStatus) || _.includes(filters,order.fulfillmentStatus) )
  }

  const groupOrders = (orders) => {

    let result = orders.map(order => moment(order.createDate).format('YYYY/MM/DD'))
    let filteredResult = _.uniq(result)
    return filteredResult
  }

  return (
    <Page name='orders'>
      <Navbar title='Orders'>
        <Subnavbar inner={false}>
          <Searchbar
            onSearchbarSearch ={searchbarSearch}
            searchContainer='.search-list'
            searchItem='li'
            searchIn='.item-title , .item-subtitle'
          ></Searchbar>
          
        </Subnavbar>
        
      </Navbar>
      <ListItem
        title='Filter orders'
        smartSelect
        smartSelectParams={{openIn: 'popup'}}
        className='smart-select smart-select-init'
      >
        <select name='filter' multiple defaultValue={filters}>
          <optgroup label='PAYMENT STATUS'>
            <option value='PAID'>PAID</option>
            <option value='AWAITING_PAYMENT'>AWAITING_PAYMENT</option>
            <option value='CANCELLED'>CANCELLED</option>
          </optgroup>
          <optgroup label='FULFILLMENT STATUS'>
            <option value='AWAITING_PROCESSING'>AWAITING_PROCESSING</option>
            <option value='PROCESSING'>PROCESSING</option>
            <option value='SHIPPED'>SHIPPED</option>
            <option value='DELIVERED'>DELIVERED</option>
            <option value='RETURNED'>RETURNED</option>
          </optgroup>
        </select>
      </ListItem>
      
      <Card>
        <BlockTitle>Orders: {filterOrders().length}</BlockTitle>

        <List className='searchbar-not-found'>
          <ListItem title='Nothing found' />
        </List>
        
        <List mediaList className='search-list searchbar-found'>
            {groupOrders(filterOrders()).map((group, index) => {
              return(
                <ListGroup mediaList key={index}>
                  <ListItem title={group} groupTitle></ListItem>

                  {filterOrders().map(order => { if(moment(order.createDate).format('YYYY/MM/DD') === group) return(
                    <ListItem
                      key={order.id}
                      title={'Comanda #' + order.id+' @ '+ moment(order.createDate).format('HH:mm') + ''}
                      subtitle={order.paymentMethod + ': ' + order.paymentStatus + ' | ' + order.fulfillmentStatus }
                      after={order.total+' lei'}
                      link={`/order/${order.id}/`}
                      noChevron={true}
                    ></ListItem>)
                  })}
                </ListGroup>
              )
            })} 
        </List>
      </Card>
    </Page>
  );
}