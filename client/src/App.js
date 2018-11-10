import React, { Component } from 'react';
import { Messages } from './Messages';
import { Users } from './Users';
import { Emotes } from './Emotes';
import io from 'socket.io-client/dist/socket.io';

//document domain corresponds to the url in the browser
//in our case it may be localhost when developing
//and somewhere on heroku for deployment
var socket = io(`http://${document.domain}:5000`);
const emotes = ['◕‿◕', 'ლ(´ڡ`ლ)', '(ಥ﹏ಥ)', '(づ￣ ³￣)づ', '¯\_(ツ)_/¯','╭∩╮(-_-)╭∩╮', '(づ｡◕‿‿◕｡)づ', 'ఠ_ఠ', '◔̯◔', 'ಠ益ಠ', '( ‘-’)人(ﾟ_ﾟ )'];
export {emotes};

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
      emotesVisible: false,
      kicked: false,
    }

    //bind functions to this object
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    this.handleAliasSubmit = this.handleAliasSubmit.bind(this);
    this.handleAliasChange = this.handleAliasChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.updateMessages = this.updateMessages.bind(this);
    this.updateUsers = this.updateUsers.bind(this);
    this.handleEmoteSubmit = this.handleEmoteSubmit.bind(this);
    this.showEmotes = this.showEmotes.bind(this);

    //instantiate socket events
    socket.on('connect', function() {
    });

    //received a new message
    socket.on('server message', (msg) => {
      this.updateMessages(msg);
    });

    socket.on('new user', (users) => {
      this.updateUsers(users);
    });

    socket.on('admin kick', () => {
      this.setState({kicked: true})
    });
  }

  //functions to update state
  ///////////////////////////
  showEmotes(){
    let toggle = !(this.state.emotesVisible);
    this.setState({emotesVisible:toggle});
  }

  updateMessages(message){
    //update the messages in state to include
    //the message passed as a parameter
    let timeOfMessage = (new Date()).toTimeString().substr(0,5)//date.format("hh:mm:ss tt")
    let currentMessages = this.state.messages;

    //check if message is an emote 
    if ('emote' in message){
      message.message = emotes[message.emote] 
    }

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
    if (!message){
      alert('Message must not be empty');
      return;
    }
    socket.emit('send message', {
      alias: alias,
      message: message
    });
    this.setState({ message: '' }); //clear message for user after sending
  }

  handleAliasSubmit(e){
    //extract data from html form and emit
    //to socket code on backend
    let alias = this.state.alias
    if (!alias){
      alert('Alias must not be empty');
      return;
    }
    socket.emit( 'user login', {
      alias : alias,
    });
    this.setState({
      loggedIn: true
    })
  }

  handleEmoteSubmit(emoteIndex){
    let alias = this.state.alias;
    socket.emit('send emote', {
      alias: alias,
      emote: emoteIndex
    });
  }
  ///////////////////////////

  //functions to keep react state consistent
  //with current input
  handleAliasChange(e){ this.setState({alias:e.target.value}); } //as user types, update state to reflect change
  handleMessageChange(e){ this.setState({message:e.target.value}); } //as user types, update state to reflect change


  render() {
    let isLoggedIn = this.state.loggedIn;
    let notKicked = !this.state.kicked;
    let messages = this.state.messages;
    let users = this.state.users;

    return (
      <div className="App">
        { notKicked ? (
           isLoggedIn ? ( //isLoggedIn is true
            <div>
              <div id="banner">
                   <h1> chat4318 </h1>
              </div>
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
                  <button id="showEmoteButton" type="button" onClick={this.showEmotes}>Emotes</button>
                </form>
              </div>
              <div id="emoteWrapper">
                <div>
                  {this.state.emotesVisible && <Emotes sendEmote={this.handleEmoteSubmit}/>} 
                </div>
              </div>
            </div>
            ):( //isLoggedIn is false
              <div id="aliasScreen">
                <div id="welcomeText">
                  <h1> Pick an alias to start chatting. </h1>
                </div>
                <div id="aliasInputWrapper">
                  <form id="chatInput" onSubmit={this.handleAliasSubmit}>
                    <input type="text" placeholder="Alias" value={this.state.alias} onChange={this.handleAliasChange}/>
                    <input type="submit" value="send"/> 
                  </form>
                </div>
              </div>
          )
        ) : (
          <div><h1>Kicked</h1></div>
        )}
      </div>
      
    );
  }
}

export default App;



