import React, { Component } from 'react';
import { Messages } from './Messages';
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
      messages: [['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd'],['asdf', 'asdfd']],
      alias: '',
      message: '',
      isLoggedIn: false,
    }

    //bind functions to this object
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    this.handleAliasSubmit = this.handleAliasSubmit.bind(this);
    this.handleAliasChange = this.handleAliasChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.updateMessages = this.updateMessages.bind(this);

    //instantiate socket events
    socket.on('connect', function() {
      //emit to socket listening for a connection
      socket.emit( 'user connected', {
        data: 'User Connected'
      });
    });

    //received a new message
    socket.on( 'my response', (msg) => {
      this.updateMessages(msg);
    })
  }



  updateMessages(message){
    //update the messages in state to include
    //the message passed as a parameter
    let currentMessages = this.state.messages;
    currentMessages.push([message.user_name, message.message]);
    this.setState({messages:currentMessages});
  }
  
  handleMessageSubmit(e){
    //extract data from html form and emit
    //to socket code on backend
    e.preventDefault()
    let user_name = this.state.alias;
    let user_input = this.state.message;
    socket.emit( 'my response', {
      user_name : user_name.toString(),
      message : user_input.toString()
    });
    this.setState({ message: '' }); //clear message for user after sending
  }

  handleAliasSubmit(e){
    //extract data from html form and emit
    //to socket code on backend
    this.setState({
      alias: e.target.value,
      loggedIn: true
    })
  }

  //functions to keep react state consistent
  //with current input
  handleAliasChange(e){ this.setState({alias:e.target.value}); } //as user types, update state to reflect change
  handleMessageChange(e){ this.setState({message:e.target.value}); } //as user types, update state to reflect change


  render() {
    let isLoggedIn = this.state.loggedIn;
    let messages = this.state.messages;
    return (
      <div className="App">
        { isLoggedIn ? ( //isLoggedIn is true
          <div>
            <div id="chatInputWrapper">
              <form id="chatInput" onSubmit={this.handleMessageSubmit}>
                <input type="text" placeholder="Message" value={this.state.message} onChange={this.handleMessageChange}/>
                <input type="submit" value="send"/> 
              </form>
            </div>
            <div id="messageWrapper">
              <Messages messages={messages}/> 
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



