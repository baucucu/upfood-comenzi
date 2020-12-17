import React, {useEffect, useState, useContext} from 'react';
import { Chip, Icon, Link, List, Page, Card,CardContent, CardHeader, CardFooter, Navbar, BlockTitle, Block, ListItem, AccordionContent } from 'framework7-react';
import { f7, f7ready } from 'framework7-react';
import _ from 'lodash';
import {Colors} from '../helpers/colors';
import {Labels} from '../helpers/labels';


export default function(props) {

  // console.log(props.f7route.context.order)

  const [app,setApp] = useState();
  const [order, setOrder] = useState(props.f7route.context.order);

  useEffect(() => {
    f7ready(() => {      
      setApp(f7.smartSelect.get('#payment-select').app)
    })
  })

  useEffect(() => {
    const eventSource = new EventSource(
      "http://sdk.m.pipedream.net/pipelines/p_rvCqMgB/sse"
    );
    eventSource.addEventListener("orders", function(e) {
      console.log("OrderDetails: New event from orders stream: ", e);
      // app && app.preloader.show();
      fetch(`https://app.ecwid.com/api/v3/38960101/orders/${order.id}?token=secret_MWWdFUtVHMmkjtFWaaqerrPaCF2rthQT`,)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          setOrder(data)
          console.log('Orders refreshed by server ')
          // app && app.preloader.hide();

        })
    },false);
    return () => {eventSource.removeEventListener('orders',() => {});}
  },[]);

  useEffect(() => {
    app && app.on('smartSelectClosed',async function(ss) {
      if(ss.selectName == 'paymentStatus' || ss.selectName == 'fulfillmentStatus') {
        let value = ss.getValue()
        let id = ss.selectName
        let newPaymentStatus = id == "paymentStatus" ? value : order.paymentStatus
        let newFulfillmentStatus = id == "fulfillmentStatus" ? value : order.fulfillmentStatus
        let dif = order[id] !== value
        dif && app && app.methods.updateOrderStatus(order.id, newFulfillmentStatus, newPaymentStatus )
        .then(function() {
          fetch(`https://app.ecwid.com/api/v3/38960101/orders/${order.id}?token=secret_MWWdFUtVHMmkjtFWaaqerrPaCF2rthQT`,)
            .then(response => response.json())
            .then(data => {
              setOrder(data)
            })
            // .then(()=>{
            //   console.log('paymentStatus: ', app.smartSelect.get('#payment-select').setValue(order.paymentStatus));
            //   console.log('paymentStatus: ', app.smartSelect.get('#fulfillment-select').setValue(order.fulfillmentStatus));
            // })
            // .then(() => {app.dialog.alert("Order status was updated")})  

        })
      }
        return () => {app && app.off('smartSelectClosed')}
    })
  })

    return (
      <Page name="order" >
        <Navbar title={'Comanda #' + order.id} backLink="Back" />
        <BlockTitle strong>{app && app.methods.convertDateToString(order.createDate).date}, {app && app.methods.convertDateToString(order.createDate).time}</BlockTitle>
        {!_.has(order, 'shippingPerson') ? null : 
        <Card> 
          <CardHeader>{order.shippingPerson.name}</CardHeader>
          <CardContent>
          <Link><Icon ios="f7:phone" aurora="f7:phone" md="material:phone"></Icon>{order.shippingPerson.phone}</Link>
          </CardContent>
          <CardContent>
            <Link><Icon ios="f7:placemark" aurora="f7:placemark" md="material:placemark"></Icon>{order.shippingPerson.street}</Link>
          </CardContent>
        </Card>}
        <BlockTitle strong>Status</BlockTitle>
        <Card>
          <CardHeader>{order.paymentMethod}</CardHeader>
          <CardContent>
            <List>
            <ListItem 
              title={'Payment'}
              smartSelect
              smartSelectParams={{openIn: 'page'}}
              className='smart-select smart-select-init'
              id='payment-select'
            >
              <select name='paymentStatus' id='paymentStatus' defaultValue={order.paymentStatus}>
                <optgroup label='PAYMENT STATUS'>
                  <option data-option-color={Colors['PAID']} value='PAID'>{Labels['PAID']}</option>
                  <option data-option-color={Colors['AWAITING_PAYMENT']} value='AWAITING_PAYMENT'>{Labels['AWAITING_PAYMENT']}</option>
                  <option data-option-color={Colors['CANCELLED']} value='CANCELLED'>{Labels['CANCELLED']}</option>
                </optgroup>
              </select>
            </ListItem>
            <ListItem 
              title={'Fulfillment'}
              smartSelect
              smartSelectParams={{openIn: 'page'}}
              className='smart-select smart-select-init'
              id='fulfillment-select'
            >
              <select name='fulfillmentStatus' id='fulfillmentStatus' defaultValue={order.fulfillmentStatus}>
                <optgroup label='FULFILLMENT STATUS'>
                  <option data-option-color={Colors['AWAITING_PROCESSING']} value='AWAITING_PROCESSING'>{Labels['AWAITING_PROCESSING']}</option>
                  <option data-option-color={Colors['PROCESSING']} value='PROCESSING'>{Labels['PROCESSING']}</option>
                  <option data-option-color={Colors['READY_FOR_PICKUP']} value='READY_FOR_PICKUP'>{Labels['READY_FOR_PICKUP']}</option>
                  <option data-option-color={Colors['SHIPPED']} value='SHIPPED'>{Labels['SHIPPED']}</option>
                  <option data-option-color={Colors['DELIVERED']} value='DELIVERED'>{Labels['DELIVERED']}</option>
                  <option data-option-color={Colors['RETURNED ']} value='RETURNED'>{Labels['RETURNED']}</option>
                </optgroup>
              </select>
            </ListItem>
              
            </List>
          </CardContent>
        </Card>
        <BlockTitle strong>Driver</BlockTitle>
        <Card>
          <List>
            <ListItem>Driver</ListItem>
          </List>
        </Card>
        <BlockTitle strong>Items</BlockTitle>
        <Card>
            <CardContent>
              <List accordionList>
                {order.items.map((item, index) => 
                  <ListItem 
                    accordionItem = {_.has(item,'selectedOptions')}
                    key={index} 
                    title={item.name }
                    // media={item.smallThumbnailUrl}
                  >
                    <Chip  slot="after-title" color={Colors['MAIN']}>{item.quantity}</Chip>
                    <AccordionContent>
                      <Block>
                      {_.has(item,'selectedOptions') && <div>
                          {item.selectedOptions.map((option, index) =>  <p key={index} >{option.name}: {option.value}</p>) }
                        </div> 
                      }
                      </Block>
                    </AccordionContent>
                  </ListItem>)}
              </List>

            </CardContent>
            <CardFooter>
              {'Total: '+order.total+' lei'}
            </CardFooter>
          </Card>
      </Page>
    );
  }

  

  
