import React, { Component } from 'react';
import { Messages } from './Messages';
import { Users } from './Users';
import io from 'socket.io-client/dist/socket.io';

//document domain corresponds to the url in the browser
//in our case it may be localhost when developing
//and somewhere on heroku for deployment
var socket = io(`http://${document.domain}:5000`);

class App extends Component {
  constructor(){
    super()
    
    //create state for component
    this.state ={
      messages: [],
      alias: '',
      message: '',
      isLoggedIn: false,
      users: [],
    }

    //bind functions to this object
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    this.handleAliasSubmit = this.handleAliasSubmit.bind(this);
    this.handleAliasChange = this.handleAliasChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.updateMessages = this.updateMessages.bind(this);
    this.updateUsers = this.updateUsers.bind(this);

    //instantiate socket events
    socket.on('connect', function() {
    });

    //received a new message
    socket.on('server message', (msg) => {
      this.updateMessages(msg);
    })

    socket.on('new user', (users) => {
      this.updateUsers(users);
    })
  }

  //functions to update state
  ///////////////////////////
  updateMessages(message){
    //update the messages in state to include
    //the message passed as a parameter
    let timeOfMessage = (new Date()).toTimeString().substr(0,5)//date.format("hh:mm:ss tt")
    let currentMessages = this.state.messages;
    currentMessages.push([message.alias, message.message, timeOfMessage]);
    this.setState({messages:currentMessages});
  }

  updateUsers(users){
    this.setState({users:users.users});
  }
  ///////////////////////////
  

  //functions to handle button submits
  ///////////////////////////
  handleMessageSubmit(e){
    //extract data from html form and emit
    //to socket code on backend
    e.preventDefault()
    let alias = this.state.alias;
    let message = this.state.message;
    socket.emit( 'send message', {
      alias : alias.toString(),
      message : message.toString()
    });
    this.setState({ message: '' }); //clear message for user after sending
  }

  handleAliasSubmit(e){
    //extract data from html form and emit
    //to socket code on backend
    let alias = this.state.alias
    socket.emit( 'user login', {
      alias : alias,
    });
    this.setState({
      loggedIn: true
    })
  }
  ///////////////////////////

  //functions to keep react state consistent
  //with current input
  handleAliasChange(e){ this.setState({alias:e.target.value}); } //as user types, update state to reflect change
  handleMessageChange(e){ this.setState({message:e.target.value}); } //as user types, update state to reflect change


  render() {
    let isLoggedIn = this.state.loggedIn;
    let messages = this.state.messages;
    let users = this.state.users;
    return (
      <div className="App">
        { isLoggedIn ? ( //isLoggedIn is true
          <div>
            <div id="messageWrapper">
              <Messages messages={messages}/> 
            </div>
            <div id="userWrapper">
              <Users users={users}/>
            </div>
            <div id="chatInputWrapper">
              <form id="chatInput" onSubmit={this.handleMessageSubmit}>
                <input id="input" type="text" placeholder="Message" value={this.state.message} onChange={this.handleMessageChange}/>
                <input id="inputButton" type="submit" value="send"/> 
              </form>
            </div>
          </div>
          ):( //isLoggedIn is false
            <div id="aliasInputWrapper">
            <form id="chatInput" onSubmit={this.handleAliasSubmit}>
                <input type="text" placeholder="Alias" value={this.state.alias} onChange={this.handleAliasChange}/>
                <input type="submit" value="send"/> 
              </form>
            </div>
          )}
        
      </div>
      
    );
  }
}

export default App;



