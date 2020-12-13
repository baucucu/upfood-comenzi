import React, {useEffect, useState, useContext} from 'react';
import { Chip, Icon, Link, List, Page, Card,CardContent, CardHeader, CardFooter, Navbar, BlockTitle, Block, ListItem, AccordionContent } from 'framework7-react';
import { f7, f7ready } from 'framework7-react';
import _ from 'lodash';
import {Colors} from '../css/colors';


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
              <select name='paymentStatus' defaultValue={order.paymentStatus}>
                <optgroup label='PAYMENT STATUS'>
                  <option value='CANCELLED'>CANCELLED</option>
                  <option value='AWAITING_PAYMENT'>AWAITING_PAYMENT</option>
                  <option value='PAID'>PAID</option>
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
              <select name='fulfillmentStatus' defaultValue={order.fulfillmentStatus}>
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
          </CardContent>
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

  

  
