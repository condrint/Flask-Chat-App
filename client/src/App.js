import React, { Component } from 'react';
import { Messages } from './Messages';
import io from 'socket.io-client/dist/socket.io';
var socket = io(`http://${document.domain}:5000`);



class App extends Component {
  constructor(){
    super()
    this.state ={
      messages: [['asdf', 'asdfd']],
      alias: '',
      message: '',
    }

    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    this.handleAliasChange = this.handleAliasChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.updateMessages = this.updateMessages.bind(this);

    socket.on( 'connect', function() {
      //emit to socket listening for 'my event' 
      socket.emit( 'user connected', {
        data: 'User Connected'
      });
    });

    socket.on( 'my response', (msg) => {
      this.updateMessages(msg);
    })

  }



  updateMessages(message){
    let currentMessages = this.state.messages;
    currentMessages.push([message.user_name, message.message]);
    this.setState({messages:currentMessages});
  }
  
  handleMessageSubmit(e){
    e.preventDefault()
    let user_name = this.state.alias;
    let user_input = this.state.message;
    socket.emit( 'my response', {
      user_name : user_name.toString(),
      message : user_input.toString()
    });
    this.setState({ message: '' }); //clear message for user after sending
  }

  handleAliasChange(e){ this.setState({alias:e.target.value}); } //as user types, update state to reflect change
  handleMessageChange(e){ this.setState({message:e.target.value}); } //as user types, update state to reflect change


  render() {
    console.log(this.state.messages);
    let messages = this.state.messages;
    return (
      <div className="App">
        <form onSubmit={this.handleMessageSubmit}>
          <input type="text" placeholder="Alias" value={this.state.alias} onChange={this.handleAliasChange}/>
          <input type="text" placeholder="Message" value={this.state.message} onChange={this.handleMessageChange}/>
          <input type="submit"/> 
        </form>
        <Messages messages={messages}/>
      </div>
      
    );
  }
}

export default App;



