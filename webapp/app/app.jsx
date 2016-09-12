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
       booted: true, 
       booterr: false,  
       bootmsg: "not booted", 
       customers: [],
       cust: 0, order_wait: 0, order_done: 0, order_inprog: 0,
       eventlists: {workflowrunning: [], current_client: []},
       alldatafromserver: [],
       connections: new Map()};
   }

   
  componentWillMount() {
    this.server._callServer('/customers').then ((customers) => {
      console.log (`got customers ${customers.length}`)
      this.setState({customers: customers, cust: customers.length})
    });
  }

  // checkout https://facebook.github.io/react/docs/update.html
  _createOrder(customer, ref) {
    console.log(customer, ref)
    this.server._callServer('/order', 'POST', {"custId": "C0001"}).then (({tracking_id}) => {
      this.setState({eventlists: update (this.state.eventlists, {['workflowrunning']: {$push:[{tracking_id: tracking_id, status: 'Submitted'}]}})})
    });
  }


   render () {
     console.log ('app render');
     if (this.state.booted)  return (
         <div className="col-sm-12  col-lg-12 main">
            <div>Connected received ping: {this.state.ping} ({this.state.looptimes})</div>

              <button type="button" className="btn btn-primary" onClick={this._createOrder.bind(this)}>Create Order</button>

            <div className="row">
            {false && this.state.alldatafromserver.map ((v,i) => {
              return <div key={ 'a'+i }> val {JSON.stringify(v)}</div>;
            })}

            </div>
            <div className="row">
              <div className="col-xs-10 col-md-5">
                <Glass cust={this.state.cust} order_wait={this.state.order_wait}   order_done={this.state.order_done}  order_inprog={this.state.order_inprog}/>
              </div>
              <div className="col-xs-10 col-md-5">
                <ToDoList title="Orders Processing" conns={this.state.eventlists['workflowrunning']} columns={['tracking_id', 'status']}/>
              </div>
              <div className="col-xs-10 col-md-5">
                <ToDoList title="Customers" conns={this.state.customers} columns={['id', 'name']} create_order={this._createOrder.bind(this)}/>
              </div>
              <div className="col-xs-10 col-md-5">
                <button className="btn btn-primary" onClick={this._joingame}>Join Game</button>
              </div>
            </div>
         </div>
       );
     else if (this.state.booterr) return (
         <div>
         {this.state.bootmsg}, refresh to try again
         </div>
       );
     else return (
       <div className="">
        connecting...... {'to ' + JSON.stringify(this.props.buildprops)}
      </div>
     );
   }
 }

