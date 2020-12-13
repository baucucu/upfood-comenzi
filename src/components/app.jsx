import React from 'react';
import { createClient } from '@supabase/supabase-js';
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

import routes from '../js/routes';

const supabase = createClient("https://vqfzqdaycwbxpestlhyu.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYwNzA4MjE1OSwiZXhwIjoxOTIyNjU4MTU5fQ.nXZeUZu9aAOJJyQ6GDrBKsaL8ZtZHMCzctAsQZA8rZQ")        
console.log("supabase: ", supabase)

export default class extends React.Component {
  constructor() {
    super();
    
    
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("auth state change: ",event, session)
    });

    this.state = {
      // Framework7 Parameters
      f7params: {
        name: 'UpFood Comenzi', // App name
        theme: 'auto', // Automatic theme detection
        // App root data
        data: function () {
          return {
          };
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
          updateOrderStatus: async(id, fulfillmentStatus, paymentStatus) => {
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
            const url = `https://app.ecwid.com/api/v3/38960101/orders/${id}?token=secret_MWWdFUtVHMmkjtFWaaqerrPaCF2rthQT`;
            
            await fetch(url,options)
              .then(response =>response.json())
              .then(data => {
              })
              // .catch(e => console.log(e))
          },
          searchbarSearch: (searchbar,query,prevQuery) => {

          },
          getOrders : () => {fetch(`https://app.ecwid.com/api/v3/38960101/orders?token=secret_MWWdFUtVHMmkjtFWaaqerrPaCF2rthQT`,)
            .then(response => response.json())
            .then(data => {
              this.setState({orders:data.items})
            })
          },
        },
        
        // App routes
        routes: routes,
        // Register service worker
        serviceWorker: {
          path: '/service-worker.js',
        },
      },
      // Login screen demo data
      username: '',
      password: '',
      // Orders
      // orders:[],
      user: {}
    }

  }
  
  render() {
    return (
      <App params={ this.state.f7params } >

        
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

        <LoginScreen id="my-login-screen" opened={_.isEmpty(this.state.user)}>
          <View>
            <Page loginScreen>
              <LoginScreenTitle>Login</LoginScreenTitle>
              <List form>
                <ListInput
                  type="email"
                  name="email"
                  placeholder="email address"
                  value={this.state.username}
                  onInput={(e) => this.setState({username: e.target.value})}
                ></ListInput>
                {/* <ListInput
                  type="password"
                  name="password"
                  placeholder="Your password"
                  value={this.state.password}
                  onInput={(e) => this.setState({password: e.target.value})}
                ></ListInput> */}
              </List>
              <List>
                <ListButton title="Sign In" onClick={async () => {
                    // this.alertLoginData()
                    const { user, error } = await supabase.auth.signIn({
                      email: 'alexandru.raduca@gmail.com'
                    })
                  }} 
                />
                <ListButton title="Sign Out" onClick={async () => {
                    const { error } = supabase.auth.signOut()
                  }} 
                />
                <ListButton title="Session" onClick={ () => {
                    this.getSession();
                  }} 
                />
                <BlockFooter>
                  Some text about login information.<br />Click "Sign In" to close Login Screen
                </BlockFooter>
              </List>
            </Page>
          </View>
        </LoginScreen>
      </App>
    )
  }

  getSession() {
    const session = supabase.auth.session();
    const user = supabase.auth.user();
    console.log("session: ",session.user.email);
    console.log("user: ", user);
    session && this.setState({user: user})
  }

  alertLoginData() {
    this.$f7.dialog.alert('Username: ' + this.state.username + '<br>Password: ' + this.state.password, () => {
      this.$f7.loginScreen.close();
    });
  }


  componentDidMount() {
    // console.log("supabase: ", supabase);
    

    this.$f7ready((f7) => {

      // Call F7 APIs here
      // const session = supabase.auth.session();
      // console.log("session: ",session)
    });
  }
}