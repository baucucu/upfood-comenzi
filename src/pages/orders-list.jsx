import React from 'react';
import {useState, useEffect} from 'react';
import { Block, BlockTitle, useRef, Row, Col, Button,Card, Subnavbar, Searchbar, Page, Navbar, List, ListItem, ListGroup, Segmented } from 'framework7-react';
import moment from 'moment';
import _ from 'lodash';
import { f7, f7ready } from 'framework7-react';


export default function(props) {
  
  const [orders, setOrders] = useState([])
  const [filters, setFilters] = useState(['AWAITING_PAYMENT','CANCELLED','AWAITING_PROCESSING','PROCESSING','SHIPPED','RETURNED'])
  // const [loading, setLoading] = useState(true)
  
  useEffect(() => {  
    fetch(`https://app.ecwid.com/api/v3/39042093/orders?token=secret_aSPm45zBRYXfkiribm58TDtgKqdVwEn7`,)
      .then(response => response.json())
      .then(data => {
        setOrders(data.items);
        // setLoading(false);
      })
  },[])

  useEffect(() => {
    f7ready(() => {
      var smartSelect = f7.smartSelect.get('.smart-select');
      smartSelect.app.on('smartSelectClosed',(ss) => {
        let newFilters = ss.getValue()
        // console.log('newFilters', newFilters)
        setFilters([...newFilters])
        // console.log('filters',filters)
      })
    })
  },[])

  useEffect(() => {
    // console.log('useEffect triggered', orders.length, filters)
    const newOrders = filterOrders()
    // console.log('filtered orders',newOrders)
  })

  const searchbarSearch = (searchbar,query,prevQuery) => {
    // console.log(q)
  }

  const filterOrders = () => {
    // if(orders.length > 0)console.log('filtering started with ',orders.length, orders[0].paymentStatus,orders[0].fulfillmentStatus,_.includes(filters, orders[0].paymentStatus) || _.includes(filters,orders[0].fulfillmentStatus))
    return orders.filter(order =>  _.includes(filters, order.paymentStatus) || _.includes(filters,order.fulfillmentStatus) )
  }

  const groupOrders = (orders) => {
    let result = orders.map(order => moment(order.createDate).format('D MMM YYYY'))
    let filteredResult = _.uniq(result)
    // console.log(filteredResult)
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
                  {filterOrders().map(order => { if(moment(order.createDate).format('D MMM YYYY') === group) return(
                    <ListItem
                      key={order.id}
                      title={'Comanda #' + order.id+' @ '+ moment(order.createDate.replace('0000','0200')).format('HH:mm') + ''}
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