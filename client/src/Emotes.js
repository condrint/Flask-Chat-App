import React, {Component} from 'react';
import {emotes} from './App';

class Emotes extends Component{
    constructor(props){
        super(props)
    }
    
    render(){
        return(
            <div id="emoteButtons">
            { emotes && 
                    emotes.map((item, index) => 
                        <button onClick={() => this.props.sendEmote(index)} key={index}>{item}</button>
                    )}
            </div>
        )
    }
}

export {Emotes};