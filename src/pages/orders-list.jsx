import React from 'react';
import {useState, useEffect} from 'react';
import { BlockTitle, Card, Subnavbar, Searchbar, Page, Navbar, List, ListItem, ListGroup } from 'framework7-react';
import _ from 'lodash';
import dateformat from 'dateformat';
import { f7, f7ready } from 'framework7-react';
import app from '../components/app';


export default function(props) {
  
  const [app, setApp] = useState()
  const [orders, setOrders] = useState(props.f7route.context.orders)
  const [filters, setFilters] = useState(['AWAITING_PAYMENT','CANCELLED','AWAITING_PROCESSING','PROCESSING','SHIPPED','RETURNED'])
  
  useEffect(() => {
    f7ready(() => {      
      setApp(f7.smartSelect.get('#filters-select').app)
    })
  })

  useEffect(() => {
    app && app.on('smartSelectClosed',(ss) => {
        let newFilters = ss.getValue()
        setFilters([...newFilters])
      })
    return () => {app && app.off('smartSelectClosed')}
  })

  const searchbarSearch = (searchbar,query,prevQuery) => {
  }

  const convertDateToString = (date) => {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let newDate = new Date(date).toLocaleDateString("ro-RO", options)
    let newTime = dateformat(date,"HH:MM")
    return {date: newDate, time: newTime}
  }

  const filterOrders = () => {
    return orders.filter(order =>  _.includes(filters, order.paymentStatus) || _.includes(filters,order.fulfillmentStatus) )
  }

  const groupOrders = (orders) => {
    
    let result = orders.map(order => convertDateToString(order.createDate).date)
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
      {/* <Card inset> */}
        <List>
          <ListItem
            title='Filter orders'
            smartSelect
            smartSelectParams={{openIn: 'page'}}
            className='smart-select smart-select-init'
            id="filters-select"
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
        </List>
      {/* </Card> */}
      
      <BlockTitle>Orders: {filterOrders().length}</BlockTitle>
      <Card>
        <List className='searchbar-not-found'>
          <ListItem title='Nothing found' />
        </List>
        
        <List mediaList className='search-list searchbar-found'>
            {groupOrders(filterOrders()).map((group, index) => {
              return(
                <ListGroup mediaList key={index}>
                  <ListItem title={group} groupTitle></ListItem>

                  {filterOrders().map(order => { if(convertDateToString(order.createDate).date === group) return(
                    <ListItem
                      key={order.id}
                      title={'Comanda #' + order.id+' @ '+ convertDateToString(order.createDate).time + ''}
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