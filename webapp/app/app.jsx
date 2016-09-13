'use strict;'

import React, {Component} from 'react';
import update from 'react-addons-update';
import Server from './modules/server.es6'
import {Glass, ToDoList} from './components/glass.jsx'
import Immutable from 'immutable';

//import ReactDOM from 'react-dom';

export default class App extends Component {

   constructor (props) {
     super(props);
     console.log ('App: constructor');
     this.server = new Server(props.buildprops.server_url);
     this.state = { 
       customers: [], orders: [],
       cust: 0, order_QUEUED: 0, order_COMPLETE: 0, order_INPROGRESS: 0,
       eventlists: {workflowrunning: [], current_client: []},
    };
   }

   
  componentWillMount() {
    this._updateCustomers()
    this._updateOrders()
  }
  _updateCustomers() {
    return this.server._callServer('/customer').then ((customers) => {
      console.log (`got customers ${customers.length}`)
      this.setState({customers: customers, cust: customers.length})
    });
  }
  _updateOrders() {
    return this.server._callServer('/orders').then ((orders) => {
      console.log (`got orders ${orders.length}`)

      this.setState({orders: orders, 
            order_QUEUED: orders.filter((o) => o.status === 'QUEUED').length,
            order_COMPLETE: orders.filter((o) => o.status === 'COMPLETE').length,
            order_INPROGRESS: orders.filter((o) => o.status === 'INPROGRESS').length})
    });
  }

  // checkout https://facebook.github.io/react/docs/update.html
  _createOrder(customer, ref) {
    console.log(customer, ref)
    this.server._callServer('/order', 'POST', {"custId": customer, "ref": ref}).then ((tracking_ids) => {
      this.setState({eventlists: update (this.state.eventlists, {['workflowrunning']: {$push:tracking_ids}})})
      this._updateOrders()
    });
  }

  _deleteOrder(customer, ref) {
    console.log(`_deleteOrder ${JSON.stringify(customer)} ${ref}`)
    this.server._callServer('/delorder', 'POST', {"custId": customer, "ref": ref}).then (() => {
      this._updateOrders()
    });
  }


   render () {
     return (
         <div className="container">

            <div className="row">
              <div className="col-xs-12 col-md-12">
                <div className="row">
                  <Glass icon="male-user" qty={this.state.cust} title="Customers" color="blue"/>
                  <Glass icon="empty-message" qty={this.state.order_QUEUED} title="Orders Queued" color="orange"/>
                  <Glass icon="app-window-with-content" qty={this.state.order_COMPLETE} title="PDFs Generated" color="teal"/>
                  <Glass icon="bag" qty={this.state.order_INPROGRESS} title="Orders in Progress" color="red"/>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12 col-md-6">  
                <ToDoList title="Customers" conns={this.state.customers} columns={['id', 'name']} buttontxt="Create Orders(s)" buttonfn={this._createOrder.bind(this)}/>
                <ToDoList title="Workflow Tracking" conns={this.state.eventlists['workflowrunning']} columns={['tracking_id', 'status']}/>
             </div>
              <div className="col-xs-12 col-md-6">
                <div className="panel panel-blue">
                  <div className="panel-heading dark-overlay">
                    <a href="https://microsoft-my.sharepoint.com/personal/kehowli_microsoft_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fkehowli_microsoft_com%2FDocuments%2FOrderTemplates%2FPDFTemplate_EN1%2E2%2Emd&parent=%2Fpersonal%2Fkehowli_microsoft_com%2FDocuments%2FOrderTemplates&p=5">Edit PDF Template</a>
                    </div>
                </div>
                <ToDoList title="Orders" conns={this.state.orders} columns={['id', 'status', 'ref']} buttontxt="Delete Orders(s)" buttonfn={this._deleteOrder.bind(this)}/>
 
                
              </div>
            </div>

         </div>
       )
   }
 }

