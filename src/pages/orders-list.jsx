import React from 'react';
import {useState, useEffect} from 'react';
import { Chip, BlockTitle, Card, Subnavbar, Searchbar, Page, Navbar, List, ListItem, ListGroup } from 'framework7-react';
import _ from 'lodash';
import { f7, f7ready } from 'framework7-react';

const colors = {
  PAID: 'green',
  AWAITING_PAYMENT: 'orange',
  CANCELLED: 'red',
  AWAITING_PROCESSING: 'orange',
  PROCESSING: 'orange',
  SHIPPED: 'orange',
  DELIVERED: 'green',
  RETURNED: 'red'
}

export default function OrdersList(props) {

  const [app, setApp] = useState()
  const [orders, setOrders] = useState(props.f7route.context.orders)
  const [filters, setFilters] = useState(['PAID','AWAITING_PAYMENT','CANCELLED','AWAITING_PROCESSING','PROCESSING','SHIPPED','RETURNED'])

  useEffect(() => {
    f7ready(() => {      
      setApp(f7.smartSelect.get('#filters-select').app)
    })
  })

  useEffect(() => {
    app && app.on('pageBeforeIn', () => {
      app.preloader.show();
      fetch(`https://app.ecwid.com/api/v3/38960101/orders?token=secret_MWWdFUtVHMmkjtFWaaqerrPaCF2rthQT`,)
        .then(response => response.json())
        .then(data => {
          setOrders(data.items)
          app.preloader.hide()
        })
    })
    return () => {app && app.off('pageBeforeIn')}
  })

  useEffect(() => {
    app && app.on('ptrRefresh', (ptr) => {
      fetch(`https://app.ecwid.com/api/v3/38960101/orders?token=secret_MWWdFUtVHMmkjtFWaaqerrPaCF2rthQT`,)
        .then(response => response.json())
        .then(data => {
          setOrders(data.items)
          app.ptr.done(ptr)
        })
    })
    return () => {app && app.off('ptrRefresh')}
  })
  
  useEffect(() => {
    app && app.on('smartSelectClosed',(ss) => {
        if(ss.selectName === 'filters') {
          let newFilters = ss.getValue()
          setFilters([...newFilters])
        }
      })
    return () => {app && app.off('smartSelectClosed')}
  })
  return (
    <Page name='orders' ptr>
      <Navbar title='Orders'>
        <Subnavbar inner={false}>
          <Searchbar
            onSearchbarSearch ={app && app.methods.searchbarSearch}
            searchContainer='.search-list'
            searchItem='li'
            searchIn='.item-title , .item-subtitle, .item-footer, .item-header'
          ></Searchbar>
          
        </Subnavbar>
        
      </Navbar>
      <List>
        <ListItem
          title='Filter orders'
          smartSelect
          smartSelectParams={{openIn: 'page'}}
          className='smart-select smart-select-init'
          id="filters-select"
        >
          <select name='filters' multiple defaultValue={filters}>
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
      <BlockTitle>Orders: {app && app.methods.filterOrders(orders, filters).length}</BlockTitle>
      <Card >
        <List className='searchbar-not-found'>
          <ListItem title='Nothing found' />
        </List>
        <List mediaList className='search-list searchbar-found'>
            {app && app.methods.groupOrders(app.methods.filterOrders(orders, filters),app).map((group, index) => {
              return(
                <ListGroup mediaList key={index}>
                  <ListItem title={group} groupTitle></ListItem>

                  {app && app.methods.filterOrders(orders, filters).map(order => { if(app && app.methods.convertDateToString(order.createDate).date === group) return(
                    <ListItem
                      key={order.id}                      
                      title={'Comanda #' + order.id}
                      // subtitle={order.paymentStatus+'  '+order.fulfillmentStatus}
                      after={order.total+' lei'}
                      header={app && app.methods.convertDateToString(order.createDate).time}
                      footer={_.has(order,'shippingPerson') ? order.shippingPerson.street : 'no delivery'}
                      link={`/order/${order.id}/`}
                      noChevron={true}
                    >
                      <Chip  slot="subtitle" color={colors[order.paymentStatus]}>{order.paymentStatus}</Chip>
                      <Chip slot="subtitle" color={colors[order.fulfillmentStatus]}>{order.fulfillmentStatus}</Chip>
                    </ListItem>)
                  })}
                </ListGroup>
              )
            })} 
        </List>
      </Card>
    </Page>
  );
}