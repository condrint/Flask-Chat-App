import React, { Component } from 'react';
import { io } from 'socketio';
/*   <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.3/socket.io.min.js"></script>
        <script type="text/javascript">

            var form = $( 'form' ).on( 'submit', function( e ) {
              e.preventDefault()
              let user_name = $( 'input.username' ).val()
              let user_input = $( 'input.message' ).val()
              socket.emit( 'my event', {
                user_name : user_name,
                message : user_input
              } )
              $( 'input.message' ).val( '' ).focus()
            } )
          } )
          socket.on( 'my response', function( msg ) {
            console.log( msg )
            if( typeof msg.user_name !== 'undefined' ) {
              $( 'h3' ).remove()
              $( 'div.message_holder' ).append( '<div><b style="color: #000">'+msg.user_name+'</b> '+msg.message+'</div>' )
            }
          })
        </script>*/
class App extends Component {
  constructor(){
    //connect the socket to the backend
    var socket = io.connect(`http://${document.domain}:3000`);
    socket.on( 'connect', function() {
      //emit to socket listening for 'my event' 
      console.log('i logged on')
      socket.emit( 'my event', {
        data: 'User Connected'
      });
    });

    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);

  }

  handleMessageSubmit(e){
    e.preventDefault()
    let user_name = 'asdf';
    let user_input = 'asdf';
    this.socket.emit( 'my event', {
      user_name : user_name,
      message : user_input
    } )
  }



  render() {
    return (
      <div className="App">
        <form action="" method="POST" onSubmit={this.handleMessageSubmit}>
          <input type="text" class="username" placeholder="User Name"/>
          <input type="text" class="message" placeholder="Messages"/>
          <input type="submit"/> 
        </form>
        <div class="message_holder"></div>
      </div>
    );
  }
}

export default App;


