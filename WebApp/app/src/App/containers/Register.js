import React from 'react';
import axios from 'axios';
import {
    Link
  } from "react-router-dom";
import './Register.css'

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            nome: '',
            nif: '',
            email: '',
            password: '',
            passwordconfirm: '',
            concelho: '',
            accounttype: 'proprietarios',
            warning: false,
            success: false,
            exists: false
        };

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangeNif = this.handleChangeNif.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangePasswordConfirm = this.handleChangePasswordConfirm.bind(this);
        this.handleChangeConcelho = this.handleChangeConcelho.bind(this);
        this.handleChangeDropdown = this.handleChangeDropdown.bind(this);
        this.handleRegisterButton = this.handleRegisterButton.bind(this);
        this.paramBuilder = this.paramBuilder.bind(this);
        this.validateInfo = this.validateInfo.bind(this);
    }

    handleChangeName(event) {
        this.setState({nome: event.target.value});
    }

    handleChangeUsername(event) {
        this.setState({username: event.target.value});
    }

    handleChangeNif(event) {
        this.setState({nif: event.target.value});
    }

    handleChangeEmail(event) {
        this.setState({email: event.target.value});
    }

    handleChangePassword(event) {
        this.setState({password: event.target.value});
    }

    handleChangePasswordConfirm(event) {
        this.setState({passwordconfirm: event.target.value});
    }

    handleChangeConcelho(event) {
        this.setState({concelho: event.target.value});
    }

    handleChangeDropdown(event) {
        this.setState({accounttype: event.target.value});
    }

    validateInfo() {
        let check = ((this.state.password === this.state.passwordconfirm) 
                      && this.state.username.length > 0
                      && this.state.username.indexOf(',') < 0
                      && this.state.password.length > 0
                      && this.state.password.indexOf(',') < 0
                      && this.state.nome.length > 0
                      && this.state.nome.indexOf(',') < 0
                      && this.state.email.length > 0)
                      && this.state.email.indexOf(',') < 0;
        
        if(this.state.accounttype === 'proprietarios')
        {
            return (check && this.state.nif.length > 0 
                    && !isNaN(this.state.nif) 
                    && this.state.nif.indexOf(',') < 0);
        }
        if(this.state.accounttype === 'inspetores')
        {
            return check;
        }
        else return (check && this.state.concelho.length > 0 && this.state.concelho.indexOf(',') < 0);
    }

    paramBuilder() {
        //let param;
        if(this.state.accounttype === 'proprietarios')
        {
            /*param = {
                Username: this.state.username,
                Nome: this.state.nome,
                Mail:this.state.email,
                Nif: this.state.nif,
                Password: this.state.password
              };*/
              return this.state.username + ',' + this.state.nome + ',' + this.state.email + ',' + this.state.nif + ',' + this.state.password;
        } else if(this.state.accounttype === 'inspetores')
        {
            /*param = {
                Username: this.state.username,
                Nome: this.state.nome,
                Mail:this.state.email,
                Password: this.state.password
              };*/
            return this.state.username + ',' + this.state.nome + ',' + this.state.email + ',' + this.state.password;
        } else {
            /*
            param = {
                Nome: this.state.nome,
                Username: this.state.username,
                Mail:this.state.email,
                Password: this.state.password,
                Concelho: this.state.concelho
              };
              */
              return this.state.nome + ',' + this.state.username + ',' + this.state.email + ',' + this.state.password + ',' + this.state.concelho;
        }
        //return param;
    }

    handleRegisterButton(event) {
        if(this.validateInfo())
        {
            this.setState({success: false, warning: false, exists: false});
            axios({
                method: 'post',
                url: 'https://localhost:44301/' + this.state.accounttype + '/registo',
                data: JSON.stringify(this.paramBuilder()), 
                headers: {
                    "Content-Type": "application/json"
                }
            })
                /*
            axios.get('https://localhost:44301/' + this.state.accounttype + '/registo', {
                params: this.paramBuilder()
            })*/
            .then(response => {
                this.setState({success: true});
                //alert("Utilizador registado!");
            }) 
            .catch(response => {
                this.setState({exists: true});
                //alert("Username já existente.");
                console.log(response);
            })
        } else {
            this.setState({warning: true});
        }

        event.preventDefault();
    }

    render() {
        
        const type = this.state.accounttype;
        let field;
        if(type === 'proprietarios')
        {
            field = <input type="text" value={this.state.nif} className="form-control" id="nifInput" onChange={this.handleChangeNif} placeholder="NIF"></input>
        }
        else if(type === 'inspetores')
        {
            field = null;
        } else {
            field = <input type="text" value={this.state.concelho} className="form-control" id="concelhoInput" onChange={this.handleChangeConcelho} placeholder="Concelho"></input>
        }  //Input field for changeable inputs (Nif/Concelho/Neither)

        return (
            <div className="container login-container">
                <div className="row">
                    <div className="col"></div>
                    <div className="col-md-7">
                        <div className="card loginOnly-card">
                            <div className="card-block">
                                <h3 className="card-title login-title">Gestão de Florestas</h3>
                                <p className="card-text login-text">Registar novo utilizador</p>
                                <form className="login-form">
                                    <div className="form-group">
                                        <input type="text" value={this.state.username} className="form-control" id="usernameInput" onChange={this.handleChangeUsername} placeholder="Username"></input>
                                    </div>
                                    <div className="form-group">
                                        <input type="text" value={this.state.nome} className="form-control" id="textInput" onChange={this.handleChangeName} placeholder="Nome"></input>
                                    </div>
                                    <div className="form-group">
                                        {field}
                                    </div>
                                    <div className="form-group">
                                        <input type="email" value={this.state.email} className="form-control" id="emailInput" onChange={this.handleChangeEmail} placeholder="Email"></input>
                                    </div>
                                    <div className="form-group">
                                        <input type="password" value={this.state.password} className="form-control" id="passwordInput" onChange={this.handleChangePassword} placeholder="Password"></input>
                                    </div>
                                    <div className="form-group">
                                        <input type="password" value={this.state.passwordconfirm} className="form-control" id="passwordConfirmInput" onChange={this.handleChangePasswordConfirm} placeholder="Confirmar Password"></input>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            Tipo de conta:<br></br>  
                                            <select value={this.state.accounttype} onChange={this.handleChangeDropdown}>
                                                <option value="proprietarios">Proprietário</option>
                                                <option value="inspetores">Inspetor</option>
                                                <option value="supervisores">Supervisor</option>
                                                <option value="trabalhadores">Funcionário da Câmara</option>
                                            </select>
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <p>{this.state.warning ? 'Preencha todos os campos com informação válida e confirme as passwords.' : ''}</p>
                                        <p>{this.state.success ? 'Utilizador registado com successo!' : ''}</p>
                                        <p>{this.state.exists ? 'Username já existente.' : ''}</p>
                                    </div>
                                    <input className="btn login-btn btn-success btn-sm" type='submit' onClick={this.handleRegisterButton} value="Registar" />
                                    <Link to="/login"><input className="btn login-btn btn-success btn-sm" type='button' value="Voltar" /></Link>

                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col"></div>
                </div>
            </div>
        );
    }
}

export default Register;
