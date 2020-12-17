import React from 'react';
import {useState, useEffect} from 'react';
import { Chip, BlockTitle, Card, Icon, Subnavbar, Searchbar, Page, Navbar, List, ListItem, ListGroup } from 'framework7-react';
import _ from 'lodash';
import { f7, f7ready } from 'framework7-react';
import {Colors} from '../helpers/colors';
import {Labels} from '../helpers/labels';

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
    const eventSource = new EventSource(
      "http://sdk.m.pipedream.net/pipelines/p_rvCqMgB/sse"
    );
    eventSource.addEventListener("orders", function(e) {
      console.log("OrdersList: New event from orders stream: ", e);
      // app && app.preloader.show();
      fetch(`https://app.ecwid.com/api/v3/38960101/orders?token=secret_MWWdFUtVHMmkjtFWaaqerrPaCF2rthQT`,)
        .then(response => response.json())
        .then(data => {
          setOrders(data.items)
          console.log('Orders refreshed by server ')
          // app && app.preloader.hide();
        })
    },false);
    return () => {eventSource.removeEventListener('orders',() => {});}
  },[]);

  

  // useEffect(() => {
  //   app && app.on('pageReinit', () => {
  //     app.preloader.show();
  //     fetch(`https://app.ecwid.com/api/v3/38960101/orders?token=secret_MWWdFUtVHMmkjtFWaaqerrPaCF2rthQT`,)
  //       .then(response => response.json())
  //       .then(data => {
  //         setOrders(data.items)
  //         app.preloader.hide()
  //       })
  //   })
  //   return () => {app && app.off('pageReinit')}
  // })

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
              <option value='PAID'>{Labels['PAID']}</option>
              <option value='AWAITING_PAYMENT'>{Labels['AWAITING_PAYMENT']}</option>
              <option value='CANCELLED'>{Labels['CANCELLED']}</option>
            </optgroup>
            <optgroup label='FULFILLMENT STATUS'>
              <option value='AWAITING_PROCESSING'>{Labels['AWAITING_PROCESSING']}</option>
              <option value='PROCESSING'>{Labels['PROCESSING']}</option>
              <option value='SHIPPED'>{Labels['SHIPPED']}</option>
              <option value='DELIVERED'>{Labels['DELIVERED']}</option>
              <option value='RETURNED'>{Labels['RETURNED']}</option>
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
                      // title={'Comanda #' + order.id}
                      // subtitle={order.paymentStatus+'  '+order.fulfillmentStatus}
                      // after={order.total+' lei'}
                      // header={app && app.methods.convertDateToString(order.createDate).time}
                      // footer={_.has(order,'shippingPerson') ? order.shippingPerson.street : 'no delivery'}
                      link={`/order/${order.id}/`}
                      noChevron={true}
                    >
                      <Chip slot="header"  outline  text={app && app.methods.convertDateToString(order.createDate).time}>
                        <Icon slot="media" color='black' ios="f7:clock" aurora="f7:clock" md="material:slow_motion_video"></Icon>
                      </Chip>
                      <Chip slot="header"  outline  text={'Comanda #' + order.id}>
                        {/* <Icon slot="media" color='black' ios="f7:number" aurora="f7:number" md="material:number"></Icon> */}
                      </Chip>
                      <Chip slot="title"  color={Colors[order.fulfillmentStatus]} text={Labels[order.fulfillmentStatus]}>
                        <Icon slot="media" ios="f7:timer" aurora="f7:timer" md="material:timer"></Icon>
                      </Chip>
                      <Chip  slot="after"  color={Colors[order.paymentStatus]} text={Labels[order.paymentStatus]+': '+ order.total+' lei'}>
                        <Icon slot="media" ios="f7:money_dollar_circle" aurora="f7:money_dollar_circle" md="material:attach_money"></Icon>
                      </Chip>
                      {_.has(order,'shippingPerson') && <Chip  slot="footer" outline  text={order.shippingPerson.name}>
                        <Icon slot="media" color='black' ios="f7:person" aurora="f7:person" md="material:person"></Icon>
                      </Chip>}
                      {_.has(order,'shippingPerson') && <Chip  slot="footer" outline  text={order.shippingPerson.phone}>
                        <Icon slot="media" color='black' ios="f7:phone" aurora="f7:phone" md="material:phone"></Icon>
                      </Chip>}
                      <Chip  slot="footer" outline  text={_.has(order,'shippingPerson') ? order.shippingPerson.street : 'no delivery'}>
                        <Icon slot="media" color='black' ios="f7:placemark" aurora="f7:placemark" md="material:placemark"></Icon>
                      </Chip>
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