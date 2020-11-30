import React, {useEffect, useState} from 'react';
import { Actions, ActionsGroup, ActionsLabel, ActionsButton, Button, List, Page, Card,CardContent, CardHeader, CardFooter, Navbar, BlockTitle, Block, ListItem } from 'framework7-react';
import moment from 'moment';
import _ from 'lodash';

var dateFormat = "YYYY-M-D";
var timeFormat = "HH:mm";
var region = 'Europe/Bucharest';

export default function(props) {
  
  useEffect(() => {
    getOrderById(props.f7route.params.id);
    console.log(order.createDate)
  },[])

  const [order, setOrder] = useState({});
  const [loading,setLoading] = useState(true)

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
    const url = `https://app.ecwid.com/api/v3/39042093/orders/${id}?token=${process.env.TOKEN}`;
    
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
        
        {loading ? <Block>Loading...</Block>
        : <Card>
            {_.has(order, 'shippingPerson') ? <CardHeader>{order.shippingPerson.name}: {order.shippingPerson.phone}</CardHeader> : null}
            <CardContent>
              
              <Block strong>{moment.tz(order.createDate,dateFormat,region)}: {moment.tz(order.createDate,timeFormat,region)}</Block>
             
              {_.has(order, 'shippingPerson') ? <Block strong>
                {order.shippingPerson.street}
              </Block> : null}
             
              <Block strong>Items</Block>
              
              <List mediaList>
                {order.items.map((item, index) => 
                  <ListItem 
                    key={index} 
                    title={item.quantity + ' x ' + item.name + ' @ ' + item.price + ' lei'}
                  >
                    {_.has(item,'selectedOptions') ? 
                      item.selectedOptions.map((option, index) =>  <Block key={index} slot='inner'>{option.name}: {option.value}</Block>) 
                    : null}
                  </ListItem>)}
              </List>
              
              <Block strong>{'Total: '+order.total+' lei'}</Block>
            </CardContent>
            
            <CardFooter>
                <Button fill actionsOpen="#fulfillment-status-actions" >{order.fulfillmentStatus}</Button>
                <Button fill actionsOpen="#payment-status-actions" >{order.paymentMethod + ': ' + order.paymentStatus}</Button>
            </CardFooter>
          </Card>
        }
        <Actions id="payment-status-actions">
          <ActionsGroup>
            <ActionsLabel >Change payment status</ActionsLabel>
            <ActionsButton onClick={() => updateOrderStatus(props.f7route.params.id, order.fulfillmentStatus, "AWAITING_PAYMENT")}>Awaiting payment</ActionsButton>
            <ActionsButton onClick={() => updateOrderStatus(props.f7route.params.id, order.fulfillmentStatus, "PAID")}>Paid</ActionsButton>
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

  

  
