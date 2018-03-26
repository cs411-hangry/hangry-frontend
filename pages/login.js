import Link from 'next/link'
import Nav from '../components/nav'
import request from 'superagent';
import React, {Component} from 'react';


export default class Login extends Component {

    state = { 
        username: '', 
        password: '', 
        status: ''
    };
  
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }
  
    handleSubmit = (event) => {
        event.preventDefault();

        var data = {
            username: this.state.username, 
            password: this.state.password, 
        };

        fetch("http://localhost:5000/login", {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), 
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json())
        .catch(error => this.setState({status:"error"}))
        .then(response =>  this.setState({status:"success" + JSON.stringify(response)})  );
    }
  
    render() {
      return (
        <div>  
            <Nav />    
            <form onSubmit={this.handleSubmit}>

                <div> 
                    <label>
                        Username
                        <input type="text" name="username" value={this.state.value} onChange={this.handleChange} />
                    </label>
                </div>

                <div>
                    <label>
                        Password
                        <input type="text" name="password" value={this.state.value} onChange={this.handleChange} />
                    </label>
                </div>


            <input type="submit" value="Submit" />
            </form>
            {this.state.status}
        </div>
      );
    }
  }

