import React, {Component} from "react";
import {SERVER_URL} from "../constants";
import {TextField, Button} from "@material-ui/core";
import CarList from './CarList';
import {Snackbar} from '@material-ui/core';
import {AppBar, Toolbar} from '@material-ui/core';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {username:'', password:'', credentials_valid: false, open: false}
    }

    handleChange = (e) => this.setState({[e.target.name]: e.target.value});

    handleLogin = (e) => {
        const url = SERVER_URL + "/login";
        fetch(url, {
            method: "POST",
            headers:{
                "username" : this.state.username,
                "password" : this.state.password
            }
        })
        .then(res =>{
            if(res.status !== 200){
                this.setState({open:true});
            }else{
                const jwtToken = res.headers.get("Authorization");
            
                if(jwtToken != null){
                    sessionStorage.setItem("jwt", jwtToken);
                }else{
                    this.setState({open:true});
                }
                
                this.setState({credentials_valid: true});
            }
        })
        .catch(err => console.log(err));
        e.preventDefault();
    };

    handleClose = () => this.setState({open:false});

    logout = () => {
        sessionStorage.removeItem('jwt');
        this.setState({credentials_valid:false});  
    };

    render() {
        if(this.state.credentials_valid){
            return (
            <React.Fragment>
                <AppBar position='static' color='default'>
                    <Toolbar><h2>List of cars</h2></Toolbar>
                </AppBar>
                <CarList logout={this.logout}/>
            </React.Fragment>
            );
        }else{
            const style = { 
                            paddingTop: "50px",
                            display:"flex",
                            flexDirection:"column",
                            alignItems: "center"};
            return (
                <React.Fragment>
                    <AppBar position='static' color='default'>
                        <Toolbar><h2>Please Sign In</h2></Toolbar>
                    </AppBar>
                    <div class="container">
                        <form class="form-signin" onSubmit={this.handleLogin}>
                            <p>
                                <label for="username" class="sr-only">Username</label>
                                <input type="text" id="username" name="username" class="form-control" onChange={this.handleChange} placeholder="Username" required="" autofocus=""/>
                            </p>
                            <p>
                                <label for="password" class="sr-only">Password</label>
                                <input type="password" id="password" name="password" class="form-control" onChange={this.handleChange} placeholder="Password" required=""/>
                            </p>
                            <button class="btn btn-lg btn-primary btn-block" type='submit'>Sign in</button>
                            <br/>
                            <div className='guest-account'>
                                <h4>You can sign in as a guest:</h4>
                                <strong>Username: </strong>guest
                                <br/>
                                <strong>Password: </strong>guest-pass
                            </div>
                        </form>  
                    </div>
                    <Snackbar
                            open={this.state.open}
                            onClose={this.handleClose}
                            autoHideDuration={2000}
                            message="Check your username and password!"
                    />

                    {/* the old version */}
                    {/* <div style = {style}>
                        <TextField name="username" placeholder="enter your username"
                                onChange={this.handleChange}/><br/>
                        <TextField name="password" placeholder="enter your password" 
                                type="password"
                                onChange={this.handleChange}/><br/>
                        <Button variant="contained" color="primary"
                                onClick={this.handleLogin}
                        >Login</Button>
                        <Snackbar
                            open={this.state.open}
                            onClose={this.handleClose}
                            autoHideDuration={2000}
                            message="Check your username and password!"
                        />
                    </div> */}

                </React.Fragment>);
        }
            
    }
}
 
export default Login;