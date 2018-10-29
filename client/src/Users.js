import React, { Component } from 'react';

class Users extends Component{
    
    constructor(props){
        super(props);
    }

    render(){
        return(
            <ul id="userList">
                { this.props.users && //check that messages is not empty first
                    this.props.users.map((item, index) => //generate a list HTML tag for each item where item consists of [user, message]
                        <li key={index}> 
                            {item.toString()}
                        </li> 
                    )}
            </ul>       
        )
    }
}

export { Users };