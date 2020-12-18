import React from 'react';
// import { createClient } from '@supabase/supabase-js';
import _ from 'lodash';

import {
  App,
  Views,
  View,
  Page,
  Toolbar,
  Link,
  LoginScreen,
  LoginScreenTitle,
  List,
  ListInput,
  ListButton,
  BlockFooter
} from 'framework7-react';

import {UserContext} from '../contexts/user-context';
import {OrdersContext} from '../contexts/orders-context';

import SignInButton from '../components/sign-in-button';

import { f7, f7ready } from 'framework7-react';

import routes from '../js/routes';

import firebase from "../js/firebase";
var firebaseui = require('firebaseui');
var ui = new firebaseui.auth.AuthUI(firebase.auth());

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.setupRecaptcha = () => {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': function(response) {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log('reCAPTCHA solved')
          this.onSignInSubmit();
        }
      });
    }

    this.onSignInSubmit = () => {
      // event.preventDefault();
      var that = this;
      this.setupRecaptcha();
      var phoneNumber = '+40754832167';
      var appVerifier = window.recaptchaVerifier;
      firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
        .then( (confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          var code = window.prompt('Enter OTP code');
          confirmationResult.confirm(code).then(function (result) {
            // User signed in successfully.
            var user = result.user;
            console.log(this);
            that.signIn(user);
            console.log('User signed in successfully', user)
            
            // ...
          }).catch(function (error) {
            // User couldn't sign in (bad verification code?)
            console.log(error)
          });
        }).catch(function (error) {
          // Error; SMS not sent
          // ...
          console.log(error)
        });
    }

    this.signOut = () => {
      this.setState(state => ({
        user: {},
        isLoggedIn: false
      }))
    }

    this.signIn = (user) => {
      this.setState(state => ({
        user: user,
        isLoggedIn: true
      }))
    }

    this.getOrders = () => {
      console.log("get orders")
      fetch(`https://app.ecwid.com/api/v3/38960101/orders?token=secret_MWWdFUtVHMmkjtFWaaqerrPaCF2rthQT`,)
        .then(response => response.json())
        .then(data => {
          this.setState({orders: data.items})
          console.log('Comenzi downloaded')
        })
    }

    this.getOrderById = (id) => {
      return this.state.orders.filter(order => {return (order.id === id)})[0]
    }
    
    this.state = {
      phone:"",
      orders: [],
      getOrders: this.getOrders,
      getOrderById: this.getOrderById,
      user: {},
      isLoggedIn: true,
      signOut: this.signOut,
      signIn: this.signIn
    }
  }

  // const supabase = createClient("https://vqfzqdaycwbxpestlhyu.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYwNzA4MjE1OSwiZXhwIjoxOTIyNjU4MTU5fQ.nXZeUZu9aAOJJyQ6GDrBKsaL8ZtZHMCzctAsQZA8rZQ")        
  
  render(){
    const f7params =  {
      name: 'UpFood Comenzi', // App name
      theme: 'auto', // Automatic theme detection
      // App root data
      data: function () {
        return {
          orders: [],
          isLoggedIn: true,
        };
      },
      on:{
        'init': () => {
          const that = this;
          this.getOrders();
          
          const eventSource = new EventSource(
            "https://sdk.m.pipedream.net/pipelines/p_rvCqMgB/sse"
          );
          eventSource.addEventListener("orders", function(e) {
            const data = JSON.parse(e.data)
            const date = new Date()
            console.log("OrdersList: New event from orders stream: ", data);
            // app && app.preloader.show();
            f7.notification.create({
              // icon: '<i class="icon demo-icon">7</i>',
              title: 'UpFood',
              titleRightText: `${date.getHours()}:${date.getMinutes()}`,
              subtitle: `${data.eventType} #${data.entityId}`,
              text: `Payment: ${data.data.newPaymentStatus} \n Fulfillment: ${data.data.newFulfillmentStatus}`,
              closeOnClick: true
            }).open()
            that.getOrders();
          }); 
        },
      },
      methods: {
        convertDateToString: (date) => {
          
          let formatedDate = new Date(date.substring(0,10).replace(/-/g,'/')).toDateString()
          let formatedTime = new Date(date.replace(/-/g,'/')).toTimeString().substr(0,5)
          // console.log()
          return {date: formatedDate, time: formatedTime}
        },
        groupOrders: (orders, app) => {
          let result = orders.map(order => app.methods.convertDateToString(order.createDate).date)
          let filteredResult = _.uniq(result)
          return filteredResult
        },
        filterOrders: (orders, filters) => {
          return orders.filter(order =>  _.includes(filters, order.paymentStatus) || _.includes(filters,order.fulfillmentStatus) )
        },
        updateOrderStatus: (id, key, value) => {
          const data = new Object();
          data[key] = value;

          const options = {
            method: 'PUT', 
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(data)
          };
          const url = `https://app.ecwid.com/api/v3/38960101/orders/${id}?token=secret_MWWdFUtVHMmkjtFWaaqerrPaCF2rthQT`;
          
          fetch(url,options)
            .then(response =>response.json())
            .then(data => {
              console.log("order was updated: ",id, key, value);
            })
            .catch(e => console.log(e))
        },
        searchbarSearch: (searchbar,query,prevQuery) => {
  
        },
        logOut: function() {
          this.data.isLoggedIn = false;
        },
        updateOrders : function(app) {
          app.request.json(
            `https://app.ecwid.com/api/v3/38960101/orders?token=secret_MWWdFUtVHMmkjtFWaaqerrPaCF2rthQT`, 
            function(data, status, xhr){app.data.orders = data.items}, 
            function (xhr, status, message){console.log(message)}
            )
        }
      },
      
      // App routes
      routes: routes,
      // Register service worker
      serviceWorker: {
        path: '/service-worker.js',
      },
    }
    return (
      <UserContext.Provider value={this.state}>
        <OrdersContext.Provider value={this.state}>
          <App params={ f7params } >
            {/* Views/Tabs container */}
            <Views tabs className="safe-areas">
              {/* Tabbar for switching views-tabs */}
              <Toolbar tabbar labels bottom>
                <Link tabLink="#view-orders"  tabLinkActive iconIos="f7:cart_fill" iconAurora="f7:cart_fill" iconMd="material:shopping_cart" text="Orders" />
                <Link tabLink="#view-settings"  iconIos="f7:gear" iconAurora="f7:gear" iconMd="material:settings" text="Settings" />
                <Link tabLink="#view-account"  iconIos="f7:person" iconAurora="f7:person" iconMd="material:person" text="Account" />
              </Toolbar>

              {/* Orders View */}
              <View id="view-orders"  main tab tabActive name="orders" tab url="/orders/" />

              {/* Settings View */}
              <View id="view-settings"  name="settings" tab url="/settings/" />

              {/* Account View */}
              <View id="view-account"  name="account" tab url="/account/" />

            </Views>

            <LoginScreen id="my-login-screen" opened={!this.state.isLoggedIn}>
              <View name="login">
                <Page loginScreen>
                  <LoginScreenTitle>Login</LoginScreenTitle>
                  <List form>
                    <ListInput
                      type="tel"
                      name="phone"
                      placeholder="phone number"
                      // value={username}
                      onInput={(e) => {this.setState({phone: e.target.value}) }}
                    ></ListInput>
                  </List>
                  <div id='recaptcha-container'></div>
                  <List>
                    <ListButton title="Sign In" onClick={ () => {
                        var phoneNumber = this.state.phone;
                      }} 
                    />
                    <ListButton title="Sign Out" onClick={async () => {
                        const { error } = supabase.auth.signOut()
                      }} 
                    />
                    <ListButton title="Session" onClick={ () => {
                        getSession();
                      }} 
                    />
                    <ListButton title="Firebase sign in" onClick={ () => {
                        this.onSignInSubmit();
                      }} 
                    />
                    <SignInButton id="sign-in-button"/>
                    <BlockFooter>
                      Some text about login information.<br />Click "Sign In" to close Login Screen
                    </BlockFooter>
                  </List>
                </Page>
              </View>
            </LoginScreen>
          </App>
        </OrdersContext.Provider>
      </UserContext.Provider>
      
    )
  }

  componentDidMount() {
    f7ready(() => {      
      // console.log('$root: ', this.$f7.data.isLoggedIn);
      // this.$f7.methods.logOut();
      // this.$f7.methods.getOrders(this.$f7)  
    })
  }
  
}