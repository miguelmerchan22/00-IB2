import React, { Component } from "react";

export default class Oficina extends Component {
  constructor(props) {
    super(props);

    this.state = {
      direccion: "loading Wallet",
      link: "Make an investment to get the referral LINK",
      registered: false,
      balanceRef: 0,
      available: 0,
      balanceSal: 0,
      totalRef: 0,
      invested: 0,
      paidAt: 0,
      my: 0,
      almacen: 0,
      withdrawn: 0,
      precioSITE: 1,
      valueSITE: 0,
      valueUSDT: 0,
      personasIzquierda: 0,
      puntosIzquierda: 0,
      personasDerecha: 0,
      puntosDerecha: 0,
      bonusBinario: 0,
      puntosEfectivosIzquierda: 0,
      puntosEfectivosDerecha: 0,
      puntosReclamadosIzquierda: 0,
      puntosReclamadosDerecha: 0,
      puntosLostIzquierda: 0,
      puntosLostDerecha: 0,
      directos: 0,
      withdrawableInfinity: 0,
      data: {nombre: "###### ######", bio: "Loading..."},
      rango: "N/A",
      textRango: "loading...",
    };

    this.Investors = this.Investors.bind(this);
    this.Investors2 = this.Investors2.bind(this);
    this.Investors3 = this.Investors3.bind(this);
    this.Link = this.Link.bind(this);
    this.withdraw = this.withdraw.bind(this);
    this.withdraw2 = this.withdraw2.bind(this);
    this.withdrawTeam = this.withdrawTeam.bind(this);

    this.rateSITE = this.rateSITE.bind(this);
    this.handleChangeSITE = this.handleChangeSITE.bind(this);
    this.handleChangeUSDT = this.handleChangeUSDT.bind(this);

    this.claim = this.claim.bind(this);
    this.rango = this.rango.bind(this);
  }

  handleChangeSITE(event) {
    this.setState({ valueSITE: event.target.value });
  }

  handleChangeUSDT(event) {
    this.setState({ valueUSDT: event.target.value });
  }

  async componentDidMount() {
    if (typeof window.ethereum !== "undefined") {
      var resultado = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      //console.log(resultado[0]);
      this.setState({
        currentAccount: resultado[0],
      });
    }
    setInterval(async () => {
      if (typeof window.ethereum !== "undefined") {
        var resultado = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        //console.log(resultado[0]);
        this.setState({
          currentAccount: resultado[0],
        });
      }
    }, 7 * 1000);

    setInterval(() => {
      this.Investors2();
      this.Investors3();
      this.Investors();
      this.rango();
      this.Link();
    }, 3 * 1000);
  }

  async rateSITE() {
    /*var proxyUrl = cons.proxy;
    var apiUrl = cons.PRE;
    var response;

    try {
      response = await fetch(proxyUrl+apiUrl);
    } catch (err) {
      console.log(err);
      return this.state.precioSITE;
    }

    var json = await response.json();

    this.setState({
      precioSITE: json.Data.precio
    });

    return json.Data.precio;*/

    return 1;
  }

  async Link() {
    const { registered } = this.state;
    if (registered) {
      let loc = document.location.href;
      if (loc.indexOf("?") > 0) {
        loc = loc.split("?")[0];
      }

      if (loc.indexOf("#") > 0) {
        loc = loc.split("#")[0];
      }
      let mydireccion = this.state.currentAccount;
      mydireccion = await this.props.wallet.contractBinary.methods
        .addressToId(this.state.currentAccount)
        .call({ from: this.state.currentAccount });
      var ver = "";
      if (this.props.version > 1) {
        ver = "?v" + this.props.version;
      }
      mydireccion = loc + "?ref=" + mydireccion;
      var link = mydireccion;
      this.setState({
        link: link,
      });
    } else {
      link = "Make an investment to get the referral LINK";
      this.setState({
        link: link,
      });
    }

    document.getElementById("linkRefer").value = link;
  }

  async Investors() {
    let usuario = await this.props.wallet.contractBinary.methods
      .investors(this.state.currentAccount)
      .call({ from: this.state.currentAccount });

    usuario.withdrawable = await this.props.wallet.contractBinary.methods
      .withdrawable(this.state.currentAccount, false)
      .call({ from: this.state.currentAccount });

    var withdrawableInfinity = await this.props.wallet.contractBinary.methods
      .withdrawable(this.state.currentAccount, true)
      .call({ from: this.state.currentAccount });

    var decimales = await this.props.wallet.contractToken.methods
      .decimals()
      .call({ from: this.state.currentAccount });

    var despositos = await this.props.wallet.contractBinary.methods
      .depositos(this.state.currentAccount, false)
      .call({ from: this.state.currentAccount });

    var valores = despositos[0];
    var valorPlan = 0;

    usuario.withdrawable = usuario.withdrawable / 10 ** decimales;
    usuario.withdrawn = usuario.withdrawn / 10 ** decimales;

    for (let index = 0; index < valores.length; index++) {
      valorPlan += valores[index] / 10 ** decimales;
    }

    //valorPlan = (valorPlan*porcent);//(usuario.invested*porcent);// decimales visuales

    var progresoUsdt =
      ((valorPlan - (valorPlan - (usuario.withdrawn + usuario.withdrawable))) *
        100) /
      valorPlan;

    progresoUsdt = progresoUsdt.toFixed(2);

    var progresoRetiro =
      ((valorPlan - (valorPlan - usuario.withdrawn)) * 100) / valorPlan;

    progresoRetiro = progresoRetiro.toFixed(2);

    if(usuario.data){
      usuario.data = JSON.parse(usuario.data); 
    }else{
      usuario.data = {nombre: "NAME NO SET", bio: ""};
    }

    //console.log(usuario)

    this.setState({
      registered: usuario.registered,
      balanceRef: usuario.balanceRef / 10 ** decimales,
      totalRef: usuario.totalRef / 10 ** decimales,
      invested: usuario.invested,
      paidAt: usuario.paidAt / 10 ** decimales,
      my: usuario.withdrawable,
      withdrawableInfinity: withdrawableInfinity / 10**decimales,
      withdrawn: usuario.withdrawn,
      almacen: usuario.almacen / 10 ** decimales,
      progresoUsdt: progresoUsdt,
      progresoRetiro: progresoRetiro,
      valorPlan: valorPlan,
      directos: usuario.directos,
      data: usuario.data,
    });
  }

  async Investors2() {
    //var precioSITE = await this.rateSITE();
    /*this.setState({
      precioSITE: precioSITE
    });*/
  }

  async Investors3() {

    var available = await this.props.wallet.contractBinary.methods
      .withdrawable(this.state.currentAccount, false)
      .call({ from: this.state.currentAccount });

    available = available / 10 ** 18;

    var balance = await this.props.wallet.contractToken.methods
      .balanceOf(this.state.currentAccount)
      .call({ from: this.state.currentAccount });

    balance = "USDT: "+(balance / 10 ** 18).toFixed(2);


    var MIN_RETIRO = await this.props.wallet.contractBinary.methods
      .MIN_RETIRO()
      .call({ from: this.state.currentAccount });

    MIN_RETIRO = MIN_RETIRO / 10 ** 18;

    this.setState({
      available: available,
      MIN_RETIRO: MIN_RETIRO,
      balance: balance,
    });
  }

  async withdraw() {
    var { available } = this.state;

    available = (available * 1).toFixed(6);
    available = parseFloat(available);

    var decimales = await this.props.wallet.contractToken.methods
      .decimals()
      .call({ from: this.state.currentAccount });

    var MIN_RETIRO = await this.props.wallet.contractBinary.methods
      .MIN_RETIRO()
      .call({ from: this.state.currentAccount });
    MIN_RETIRO = MIN_RETIRO / 10 ** decimales;

    if (available > MIN_RETIRO) {
      await this.props.wallet.contractBinary.methods
        .withdraw()
        .send({ from: this.state.currentAccount });
    } else {
      if (available < MIN_RETIRO) {
        window.alert("The minimum to withdraw are: " + MIN_RETIRO + " USDT");
      }
    }
  }

  async withdraw2() {
    var available = this.state.withdrawableInfinity;

    available = (available * 1).toFixed(6);
    available = parseFloat(available);

    var decimales = await this.props.wallet.contractToken.methods
      .decimals()
      .call({ from: this.state.currentAccount });

    var MIN_RETIRO = await this.props.wallet.contractBinary.methods
      .MIN_RETIRO()
      .call({ from: this.state.currentAccount });
    MIN_RETIRO = MIN_RETIRO / 10 ** decimales;

    if (available > MIN_RETIRO) {
      await this.props.wallet.contractBinary.methods
        .withdraw2()
        .send({ from: this.state.currentAccount });
    } else {
      if (available < MIN_RETIRO) {
        window.alert("The minimum to withdraw are: " + MIN_RETIRO + " USDT");
      }
    }
  }

  async withdrawTeam() {
    var available  = this.state.balanceRef;

    console.log(available)

    available = (available * 1).toFixed(6);
    available = parseFloat(available);

    var decimales = await this.props.wallet.contractToken.methods
      .decimals()
      .call({ from: this.state.currentAccount });

    var MIN_RETIRO = await this.props.wallet.contractBinary.methods
      .MIN_RETIRO()
      .call({ from: this.state.currentAccount });
    MIN_RETIRO = MIN_RETIRO / 10 ** decimales;

    if (available > MIN_RETIRO) {
      await this.props.wallet.contractBinary.methods
        .withdrawTeam()
        .send({ from: this.state.currentAccount });
    } else {
      if (available < MIN_RETIRO) {
        window.alert("The minimum to withdraw are: " + MIN_RETIRO + " USDT");
      }
    }
  }

  async claim() {
    await this.props.wallet.contractBinary.methods
      .newRecompensa()
      .send({ from: this.state.currentAccount });
  }

  async rango() {
    var investor = await this.props.wallet.contractBinary.methods
        .investors( this.state.currentAccount )
        .call({ from: this.state.currentAccount });

    var rango = investor.blokesDirectos ;
    var rangoArray = [];
    var rangoEstilo = "btn-secondary";
    var gananciasRango = "Claimed";
    var funcionRango = () => {};
    var cantidad = "";
    var netxRango = [0, 1000, 2000, 5000, 10000, 20000, 100000, 300000, 500000];
    var nameRango = ["","Infinity Lord / Madame","Infinity Baron / Baroness",
    "Infinity Duke / Duchess","Infinity King / Queen 👑","Infinity Emperor/ Empress",
    "Infinity Conqueror","Infinity World Lord / Madame","Infinity GOD" ]

    var textRango = "Next Rank "
    for (let index = 0; index < netxRango.length-1; index++) {
      rangoArray[index] = await this.props.wallet.contractBinary.methods
        .rangoReclamado(this.state.currentAccount, index)
        .call({ from: this.state.currentAccount });
    }

    if (rango >= netxRango[0] && rango < netxRango[1]) {
      textRango += rango+"/"+netxRango[1] + " BLKS";
      rango = nameRango[0];
      console.log("entro1")
      
    }else{

      if (rango >= netxRango[netxRango.length-1] ) {
        textRango = "Welcome to the PARADISE!!!";
        rango = nameRango[nameRango.length-1];
        if (!rangoArray[nameRango.length-2]) {
          rangoEstilo = "btn-success";
          cantidad = await this.props.wallet.contractBinary.methods
            .gananciasRango(nameRango.length-2)
            .call({ from: this.state.currentAccount });
          cantidad = cantidad / 10 ** 18;
          gananciasRango = `Claim ${cantidad} USDT`;
          funcionRango = () => {
            return this.claim();
          };
        }
      }else{
        for (let index = 1; index < netxRango.length; index++) {
        
          if (rango >= netxRango[index] && rango < netxRango[index+1]) {
            textRango += rango+"/"+netxRango[index+1] + " BLKS";
            rango = nameRango[index];
            console.log("entro2")
            if (!rangoArray[index-1]) {
              rangoEstilo = "btn-success";
              cantidad = await this.props.wallet.contractBinary.methods
                .gananciasRango(index-1)
                .call({ from: this.state.currentAccount });
              cantidad = cantidad / 10 ** 18;
              gananciasRango = `Claim ${cantidad} USDT`;
              funcionRango = () => {
                return this.claim();
              };
            }
          }
        }

      }

    }

    this.setState({
      rango: rango,
      rangoEstilo: rangoEstilo,
      netxRango: netxRango,
      textRango: textRango,
      gananciasRango: gananciasRango,
      funcionRango: funcionRango,
    });
  }

  render() {
    var { available, invested,  balanceSal } = this.state;

    available = available.toFixed(3);
    available = parseFloat(available);

    balanceSal = balanceSal.toFixed(3);
    balanceSal = parseFloat(balanceSal);

    invested = parseFloat(invested);

    if (available >= this.state.MIN_RETIRO) {
      var ret = available.toFixed(2);
    } else {
      ret = 0;
    }

    return (
      <div className="row">
        <div className="content-wrapper-before blue-grey lighten-5"></div>
        <div className="col s12">
          <div className="container">
            <div className="section">
              
            <div id="card-stats" className="pt-0">
                <div className="row">

                  <div className="col s12 m3 l3 xl3">
                    <div className="card gradient-45deg-light-blue-cyan gradient-shadow min-height-100 white-text animate fadeLeft">
                      <div className="padding-4">
                        <div className="row">
                          <div className="col s4 m4">
                            <i className="material-icons background-round mt-5">
                              add_shopping_cart
                            </i>
                          </div>
                          <div className="col s8 m8 right-align ">
                            <h5 className="mb-0 white-text">
                              {invested} BLKS
                            </h5>
                            <p className="no-margin">$ {invested*50}</p>
                          </div>
                          <div className="col s12 m12 right-align">
                            <p>Earned: $ {this.state.withdrawn.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col s12 m3 l3 xl3">
                    <div className="card gradient-45deg-amber-amber gradient-shadow min-height-100 white-text animate fadeRight">
                      <div className="padding-4">
                        <div className="row">
                          <div className="col s4 m4">
                            <i className="material-icons background-round mt-5">
                              timeline
                            </i>
                          </div>
                          <div className="col s8 m8 right-align mb-7">
                            <h5 className="mb-0 white-text">$ {available}</h5>
                            <p className="no-margin">ROI</p>
                          </div>
                          <div className="col s12 m12">
                            <button 
                              className="mb-2 btn waves-effect waves-light amber darken-4 ancho100"
                              onClick={() => this.withdraw()}>
                              Withdraw
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col s12 m3 l3 xl3">
                    <div className="card gradient-45deg-red-pink gradient-shadow min-height-100 white-text animate fadeLeft">
                      <div className="padding-4">
                        <div className="row">
                          <div className="col s4 m4">
                            <i className="material-icons background-round mt-5">
                              perm_identity
                            </i>
                          </div>
                          <div className="col s8 m8 right-align mb-7">
                            <h6 className="mb-0 white-text">$ {(this.state.withdrawableInfinity).toFixed(6)}</h6>
                            <p className="no-margin">Infinity ∞</p>
                          </div>
                          <div className="col s12 m12">
                            <button
                              className="waves-effect waves-light btn mb-1 mr-1 ancho100"
                              onClick={() => this.withdraw2()}
                            >
                              Withdraw
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col s12 m3 l3 xl3">
                    <div className="card gradient-45deg-green-teal gradient-shadow min-height-100 white-text animate fadeRight">
                      <div className="padding-4">
                        <div className="row">
                          <div className="col s4 m4">
                            <i className="material-icons background-round mt-5">
                              attach_money
                            </i>
                          </div>
                          <div className="col s8 m8 right-align mb-7">
                            <h5 className="mb-0 white-text">${this.state.balanceRef.toFixed(1)} </h5>
                            <p className="no-margin">Referrals</p>
                          </div>
                          <div className="col s12 m12">
                            <button
                              className="waves-effect waves-light btn mb-1 mr-1 ancho100"
                              onClick={() => this.withdrawTeam()}
                            >
                              Withdraw 
                            </button>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <div className="row">
                <div className="col s12 m6 l6">
                  <div className="card card-border center-align gradient-45deg-purple-deep-orange">
                    <div className="card-content white-text">
                      <img
                        className="responsive-img circle z-depth-4"
                        width="100"
                        src="app-assets/images/user/2.png"
                        alt="images"
                      />
                      <p className="m-0 break">{this.state.currentAccount} <br></br>
                      <b>{this.state.balance}</b>
                      </p>
                      
                      <h4 className="white-text">{this.state.data.nombre}</h4>
                      <p className="white-text">{this.state.data.bio}</p> 
                    </div>
                  </div>
                </div>

                <div className="col s12 s6 m6">
                  <div className="card gradient-shadow gradient-45deg-light-blue-cyan border-radius-3">
                    <div className="card-content center">
                      <img
                        src="app-assets/images/icon/apple-watch.png"
                        alt="images"
                        className="width-20"
                      />
                      <h5 className="m-0 white-text lighten-4 mt-6">{this.state.rango}</h5>
                      <p className="white-text lighten-4">
                        <button 
                          className="mb-2 btn waves-effect waves-light amber darken-4 ancho100"
                          onClick={this.state.funcionRango}
                        >
                          {this.state.textRango}
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>
          </div>
          <div className="content-overlay"></div>
        </div>
      </div>
    );
  }
}
