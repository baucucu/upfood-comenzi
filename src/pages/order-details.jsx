import React, {useEffect, useState} from 'react';
import { Actions, ActionsGroup, ActionsLabel, ActionsButton, Button, List, Page, Card,CardContent, CardHeader, CardFooter, Navbar, BlockTitle, Block, ListItem, AccordionContent } from 'framework7-react';
import _ from 'lodash';
import dateformat from 'dateformat';

const convertDateToString = (date) => {
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let newDate = new Date(date).toLocaleDateString("ro-RO", options)
  let newTime = dateformat(date,"HH:MM")
  return {date: newDate, time: newTime}
}

export default function(props) {
  
  useEffect(() => {
    // getOrderById(props.f7route.params.id);
    console.log(props.f7route.context.order)
  },[])

  const [order, setOrder] = useState(props.f7route.context.order);
  // const [loading,setLoading] = useState(true)

  const updateOrderStatus = async(id, fulfillmentStatus, paymentStatus) => {
    const options = {
      method: 'PUT', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        "fulfillmentStatus" : fulfillmentStatus,
        "paymentStatus" : paymentStatus,
      })
    };
    const url = `https://app.ecwid.com/api/v3/39042093/orders/${id}?token=secret_aSPm45zBRYXfkiribm58TDtgKqdVwEn7`;
    
    await fetch(url,options)
      .then(response =>response.json())
      .then(data => {
        // console.log(data);
        getOrderById(id);
      })
      .catch(e => console.log(e))
  }

  const getOrderById = async(id) => {
    await fetch(`https://app.ecwid.com/api/v3/39042093/orders/${id}?token=secret_aSPm45zBRYXfkiribm58TDtgKqdVwEn7`,)
      .then(response => response.json())
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(e => console.log(e))
  }

    return (
      <Page name="order">
        <Navbar title={'Comanda #' + order.id} backLink="Back" />
        
        <Card>
            {_.has(order, 'shippingPerson') ? <CardHeader>{order.shippingPerson.name}: {order.shippingPerson.phone}</CardHeader> : null}
            <CardContent>
              
              <Block strong>{convertDateToString(order.createDate).date}, {convertDateToString(order.createDate).time}</Block>
             
              {_.has(order, 'shippingPerson') ? <Block strong>
                {order.shippingPerson.street}
              </Block> : null}
             
              <BlockTitle strong>Items</BlockTitle>
              
              <List accordionList>
                {order.items.map((item, index) => 
                  <ListItem 
                    accordionItem
                    key={index} 
                    title={item.quantity + ' x ' + item.name + ' @ ' + item.price + ' lei'}
                  >
                    <AccordionContent>
                      <Block>
                      {_.has(item,'selectedOptions') ? 
                          item.selectedOptions.map((option, index) =>  <p key={index} >{option.name}: {option.value}</p>) 
                        : null}
                      </Block>
                    </AccordionContent>
                  </ListItem>)}
              </List>
              
              <Block strong>{'Total: '+order.total+' lei'}</Block>
            </CardContent>
            
            <CardFooter>
                <Button fill actionsOpen="#fulfillment-status-actions" >{order.fulfillmentStatus}</Button>
                <Button fill actionsOpen="#payment-status-actions" >{order.paymentMethod + ': ' + order.paymentStatus}</Button>
            </CardFooter>
          </Card>
        <Actions id="payment-status-actions">
          <ActionsGroup>
            <ActionsLabel >Change payment status</ActionsLabel>
            <ActionsButton onClick={() => updateOrderStatus(order.id, order.fulfillmentStatus, "AWAITING_PAYMENT")}>Awaiting payment</ActionsButton>
            <ActionsButton onClick={() => updateOrderStatus(order.id, order.fulfillmentStatus, "PAID")}>Paid</ActionsButton>
          </ActionsGroup>
          <ActionsGroup>
            <ActionsButton color="red">Cancel</ActionsButton>
          </ActionsGroup>
        </Actions>

        <Actions id="fulfillment-status-actions">
          <ActionsGroup>
            <ActionsLabel >Change fulfillment status</ActionsLabel>
            <ActionsButton onClick={() => updateOrderStatus(props.f7route.params.id, "AWAITING_PROCESSING", order.paymentStatus)}>Awaiting processing</ActionsButton>
            <ActionsButton onClick={() => updateOrderStatus(props.f7route.params.id, "PROCESSING", order.paymentStatus)}>Processing</ActionsButton>
            <ActionsButton onClick={() => updateOrderStatus(props.f7route.params.id, "SHIPPED", order.paymentStatus)}>Shipped</ActionsButton>
            <ActionsButton onClick={() => updateOrderStatus(props.f7route.params.id, "DELIVERED", order.paymentStatus)}>Delivered</ActionsButton>
            <ActionsButton onClick={() => updateOrderStatus(props.f7route.params.id, "RETURNED", order.paymentStatus)}>Returned</ActionsButton>
          </ActionsGroup>
          <ActionsGroup>
            <ActionsButton color="red">Cancel</ActionsButton>
          </ActionsGroup>
        </Actions>
      </Page>
    );
  }

  

  
