import React, { Component } from 'react';

class Messages extends Component{
    
    constructor(props){
        super(props);
    }

    render(){
        return(
            <ul id="messageList">
                { this.props.messages && //check that messages is not empty first
                    this.props.messages.map((item, index) => //generate a list HTML tag for each item where item consists of [user, message]
                        <li key={index}> 
                            {item[0].toString()} : {item[1].toString()} 
                        </li> 
                    )}
            </ul>       
        )
    }
}

export { Messages };