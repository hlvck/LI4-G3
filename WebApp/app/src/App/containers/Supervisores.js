import React from 'react';
import axios from 'axios';
import Heat from './Heat';
import SupervisoresChange from './SupervisoresChange';
import SupervisoresMarcarInsp from './SupervisoresMarcarInsp';
import SupervisoresMarcarLimp from './SupervisoresMarcarLimp';
import Notificacoes from './Notificacoes';
import { Switch, Route } from 'react-router-dom';
import Options from './Options';
import './Supervisores.css';

class Supervisores extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            terrenosLimpos: 0,
            zonas: '',
            terrenos: '',
            auth: "Bearer " + this.props.token,
            mapInfo: [],
            concelho: ''
        };
        this.concelho = this.concelho.bind(this);
        this.concelhoSeguro = this.concelhoSeguro.bind(this);
        this.zonasConcelho = this.zonasConcelho.bind(this);


    }

    componentDidMount() {
        this.concelho();
        this.concelhoSeguro();
        this.zonasConcelho();

    }

    concelhoSeguro() {
        axios.get('https://localhost:44301/supervisores/Seguranca', {
            params: {
                Username: this.props.username
            },
            headers: {
                "Authorization": this.state.auth
            }
        })
            .then(response => {
                this.setState({ terrenosLimpos: response.data });
                //console.log(response.data);
            })
            .catch(response => {
                alert("Erro no carregamento de terrenos.");
                console.log(response);
            })
    }

    concelho() {
         axios.get('https://localhost:44301/supervisores/Concelho', {
            params: {
                Username: this.props.username
            },
            headers: {
                "Authorization": this.state.auth
            }
        })
            .then(response => {
                this.setState({ concelho: response.data });
                //console.log(response.data);
            })
            .catch(response => {
                alert("Erro no carregamento do concelho.");
                console.log(response);
            })
    }


    zonasConcelho() {
        axios.get('https://localhost:44301/supervisores/Zonasconcelho', {
            params: {
                Username: this.props.username
            },
            headers: {
                "Authorization": this.state.auth
            }
        })
            .then(response => {
                this.setState({ zonas: response.data });
                //console.log(response.data);
                var mapZonas = [];
                response.data.map((zonas, index) => {
                    mapZonas[index] = {
                        lat: zonas.latitude,
                        lng: zonas.longitude,
                        weight: zonas.nivelCritico
                    };
                });
                this.setState({ mapInfo: mapZonas });
            })
            .catch(response => {
                //alert("Erro no carregamento de terrenos.");
                console.log(response);
            })
    }

    render() {

        return (

            <Switch>
                <Route exact path='/supervisores'>
                    <div className="container login-container">
                        <div className="row">
                            <div className="col"></div>
                            <div className="col-md-10">
                                <div className="card login-card">
                                    <div className="card-block">
                                        <h4 className="card-title login-title">{this.props.user.nome}</h4>
                                        <p className="card-text login-text">Gestão de Concelhos</p>
                                        <h5 style={{ textAlign: 'left' }} className="card-title login-title">{this.props.user.concelho}</h5>
                                        <p style={{ textAlign: 'left' }} className="card-text login-text">
                                            Número total de terrenos por limpar: 
                                            <span style={{marginLeft:'1%'}} class="badge badge-pill badge-dark">{this.state.terrenosLimpos}</span>
                                        </p>

                                        <div className="map-container">
                                            {this.state.mapInfo.length === 0? null : <Heat HeatData={this.state.mapInfo} Latitude={this.state.concelho.latitude} Longitude={this.state.concelho.longitude} />}
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="col"></div>
                        </div>
                    </div>
                </Route>
                
                <Route path='/supervisores/terrenos'>
                    <SupervisoresChange username={this.props.username} user={this.props.user} token={this.props.token} />
                </Route>
                
                <Route path='/supervisores/inspecoes'>
                    <SupervisoresMarcarInsp username={this.props.username} user={this.props.user} token={this.props.token} />
                </Route>
               
                <Route path='/supervisores/limpezas'>
                    <SupervisoresMarcarLimp username={this.props.username} user={this.props.user} token={this.props.token} />
                </Route>

                <Route path='/supervisores/notificacoes'>
                    <Notificacoes user={this.props.user} username={this.props.username} change={{ user: this.props.change }} accounttype={this.props.accounttype} token={this.props.token} updateNotifs={this.props.updateNotifs} />
                </Route>

                <Route path='/supervisores/opcoes'>
                    <Options user={this.props.user} username={this.props.username} change={{ user: this.props.change }} token={this.props.token} accounttype={this.props.accounttype} />
                </Route>

            </Switch>
        );
    }

}

export default Supervisores;