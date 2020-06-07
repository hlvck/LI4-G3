import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Login from './Login';
import Register from './Register';
import Proprietarios from './Proprietarios';
import Inspetores from './Inspetores';
import Trabalhadores from './Trabalhadores';
import Supervisores from './Supervisores';
import Navbar from './Navbar';
import SupervisoresChange from './SupervisoresChange';
import SupervisoresMarcarInsp from './SupervisoresMarcarInsp';
import SupervisoresMarcarLimp from './SupervisoresMarcarLimp';
import Options from './Options';
import './AppRoutes.css';


class AppRoutes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            token: '',
            accounttype: 'proprietarios',
            user: ''
        };

        this.setUsername = this.setUsername.bind(this);
        this.setType = this.setType.bind(this);
        this.setUser = this.setUser.bind(this);
        this.setToken = this.setToken.bind(this);
    }

    setUsername(newusername)
    {
        this.setState({username: newusername});
    }

    setToken(newtoken)
    {
        this.setState({token: newtoken});
    }

    setUser(newuser)
    {
        this.setState({user: newuser});
    }

    setPassword(newpass)
    {
        this.setState({password: newpass});
    }

    setType(newtype)
    {
        this.setState({accounttype: newtype});
    }


    render() {

        return (
          <div className="AppRouter">
            <Switch>          
              <Route path="/login">
                {this.state.username === '' ? <Login change={{username: this.setUsername,
                                                            accounttype: this.setType,
                                                            user: this.setUser,
                                                            token: this.setToken}} /> 
                : <Redirect to="/" />}
              </Route>

              <Route path="/registo">
                <Register />
              </Route>

              <Route path="/proprietarios">
                <Navbar user={this.state.user} token={this.state.token} accounttype={this.state.accounttype}
                            change={{username: this.setUsername,
                            accounttype: this.setType,
                            user: this.setUser,
                            token: this.setToken}}/> 
                {!(this.state.username === '') ? <Proprietarios user={this.state.user} username={this.state.username} token={this.state.token} />
                : <Redirect to="/" />}
              </Route>

              <Route path="/propoption">
                <Navbar user={this.state.user} token={this.state.token} accounttype={this.state.accounttype}
                            change={{username: this.setUsername, 
                            accounttype: this.setType,
                            user: this.setUser,
                            token: this.setToken}}/>
                {!(this.state.username === '') ? <Options user={this.state.user} username={this.state.username} change={{user: this.setUser}} token={this.state.token} />
                : <Redirect to="/" />}
              </Route>

              <Route path="/inspetores">
                <Navbar user={this.state.user} token={this.state.token} accounttype={this.state.accounttype}
                            change={{username: this.setUsername, 
                            accounttype: this.setType,
                            user: this.setUser,
                            token: this.setToken}}/>   
                {!(this.state.username === '') ? <Inspetores username={this.state.username} user={this.state.user} token={this.state.token} />
                : <Redirect to="/" />}
              </Route> 

              <Route path="/trabalhadores">
                <Navbar user={this.state.user} token={this.state.token} accounttype={this.state.accounttype}
                            change={{username: this.setUsername, 
                            accounttype: this.setType,
                            user: this.setUser,
                            token: this.setToken}}/> 
                {!(this.state.username === '') ? <Trabalhadores user={this.state.user} username={this.state.username} token={this.state.token} />
                : <Redirect to="/" />}
              </Route> 

              <Route path="/supervisores">
                <Navbar user={this.state.user} token={this.state.token} accounttype={this.state.accounttype}
                            change={{username: this.setUsername, 
                            accounttype: this.setType,
                            user: this.setUser,
                            token: this.setToken}}/> 
                {!(this.state.username === '') ? <Supervisores username={this.state.username} user={this.state.user} token={this.state.token} />
                : <Redirect to="/" />}
              </Route> 

              <Route path="/supervisoresChange">
                <Navbar user={this.state.user} token={this.state.token} accounttype={this.state.accounttype}
                            change={{username: this.setUsername, 
                            accounttype: this.setType,
                            user: this.setUser,
                            token: this.setToken}}/> 
                {!(this.state.username === '') ? <SupervisoresChange username={this.state.username} user={this.state.user} token={this.state.token} />
                : <Redirect to="/" />}
              </Route> 

              <Route path="/supervisoresMarcarInspecao">
                <Navbar user={this.state.user} token={this.state.token} accounttype={this.state.accounttype}
                            change={{username: this.setUsername, 
                            accounttype: this.setType,
                            user: this.setUser,
                            token: this.setToken}}/> 
                {!(this.state.username === '') ? <SupervisoresMarcarInsp username={this.state.username} user={this.state.user} token={this.state.token} />
                : <Redirect to="/" />}
              </Route> 

              <Route path="/supervisoresMarcarLimpeza">
                <Navbar user={this.state.user} token={this.state.token} accounttype={this.state.accounttype}
                            change={{username: this.setUsername, 
                            accounttype: this.setType,
                            user: this.setUser,
                            token: this.setToken}}/> 
                {!(this.state.username === '') ? <SupervisoresMarcarLimp username={this.state.username} user={this.state.user} token={this.state.token} />
                : <Redirect to="/" />}
              </Route> 

              <Route exact path="/">
                {this.state.username === '' ? <Redirect to="/login"/> : <Redirect to={"/"+this.state.accounttype}/>}
              </Route>
            </Switch>
          </div>
        );
    }
}

export default AppRoutes;