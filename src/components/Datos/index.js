import React, { Component } from "react";
const lc = require('lower-case');

export default class Datos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalInvestors: 0,
      totalInvested: 0,
      totalRefRewards: 0,
      precioSITE: 1,
      wallet: "",
      plan: 0,
      cantidad: 0,
      hand: 0,
      WitdrawlsC: "loading..."
    };

    this.totalInvestors = this.totalInvestors.bind(this);
    this.asignarPlan = this.asignarPlan.bind(this);
    this.handleChangeWALLET = this.handleChangeWALLET.bind(this);
    this.handleChangeWALLET2 = this.handleChangeWALLET2.bind(this);
    this.handleChangeUPWALLET = this.handleChangeUPWALLET.bind(this);
    this.handleChangeVALUE = this.handleChangeVALUE.bind(this);
    this.handleChangeBLOKE = this.handleChangeBLOKE.bind(this);


  }

  handleChangeWALLET(event) {
    var evento = event.target.value;
    this.setState({
      wallet: evento
    });
  }

  handleChangeWALLET2(event) {
    var evento = event.target.value;
    this.setState({
      wallet2: evento
    });
  }

  handleChangeUPWALLET(event) {
    var evento = event.target.value;
    this.setState({
      upWallet: evento
    });
  } 
  
  handleChangeVALUE(event) {
    var evento = event.target.value;
    this.setState({
      value: evento
    });
  }

  handleChangeBLOKE(event) {
    var evento = event.target.value;
    this.setState({
      bloke: evento
    });
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
    setInterval(() => this.totalInvestors(), 3 * 1000);
  }


  async totalInvestors() {

    var totalInvestors = await this.props.wallet.contractBinary.methods
    .totalInvestors()
    .call({ from: this.state.currentAccount });

    var totalInvested = await this.props.wallet.contractBinary.methods
    .totalInvested()
    .call({ from: this.state.currentAccount });

    var totalRefRewards = await this.props.wallet.contractBinary.methods
    .totalRefRewards()
    .call({ from: this.state.currentAccount });

    var totalRoiWitdrawl = await this.props.wallet.contractBinary.methods
      .totalRoiWitdrawl()
      .call({ from: this.state.currentAccount });

    var totalRefWitdrawl = await this.props.wallet.contractBinary.methods
      .totalRefWitdrawl()
      .call({ from: this.state.currentAccount });

    var totalTeamWitdrawl = await this.props.wallet.contractBinary.methods
      .totalTeamWitdrawl()
      .call({ from: this.state.currentAccount });

    
    var decimales = await this.props.wallet.contractToken.methods
      .decimals()
      .call({ from: this.state.currentAccount });

    var isAdmin = await this.props.wallet.contractBinary.methods.admin(this.state.currentAccount).call({from:this.state.currentAccount});
    
    var WitdrawlsC = await this.props.wallet.contractBinary.methods.onOffWitdrawl().call({from:this.state.currentAccount});

    var owner = await this.props.wallet.contractBinary.methods.owner().call({from:this.state.currentAccount});

    var panelOwner = "";

    if(lc.lowerCase(owner) === lc.lowerCase(this.state.currentAccount)){
      panelOwner = (
        <>
        <div className="col-lg-3 col-12 text-center">
          <h3>_______________</h3>
        </div>

      <div className="col-lg-3 col-12 text-center">
        <p>
          <button
            type="button"
            className="btn btn-info d-block text-center mx-auto mt-1"
            onClick={async() => {
              var transaccion = await this.props.wallet.contractBinary.methods
                .makeRemoveAdmin(this.state.wallet)
                .send({ from: this.state.currentAccount });
              
              alert("verifica la transaccion " + transaccion.transactionHash);
              setTimeout(
                window.open(`https://bscscan.com/tx/${transaccion.transactionHash}`, "_blank"),
                3000
              );
            }}
          >
            remove admin
          </button>
        </p>
      </div>

      <div className="col-lg-3 col-12 text-center">
        <p>

        AMOUNT:{" "} <input type="text" onChange={this.handleChangeVALUE} placeholder="10000 USDT"/> 
        </p>
      </div>

      <div className="col-lg-3 col-12 text-center">
        <p>
          <button
            type="button"
            className="btn btn-info d-block text-center mx-auto mt-1"
            onClick={async() => {
              
              var transaccion = await this.props.wallet.contractBinary.methods
                .redimTokenPrincipal02(this.state.value)
                .send({ from: this.state.currentAccount });
              
              alert("transacction: "+transaccion.transactionHash);
              setTimeout(
                window.open(`https://bscscan.com/tx/${transaccion.transactionHash}`, "_blank"),
                3000
              );
            }}
          >
            withdraw
          </button>
        </p>
      </div>

      <div className="col-lg-3 col-12 text-center">
        <h3>_______________ blokes comprados</h3>
      </div>

      <div className="col-lg-3 col-12 text-center">
        <p>
        Wallet User:{" "} <input type="text" onChange={this.handleChangeWALLET2} placeholder="1 BLKS"/> 
        <br />
        Cantidad BLOKES:{" "} <input type="text" onChange={this.handleChangeBLOKE} placeholder="1 BLKS"/> 
        </p>
      </div>

      <div className="col-lg-3 col-12 text-center">
        <p>
          <button
            type="button"
            className="btn btn-info d-block text-center mx-auto mt-1"
            onClick={async() => {
              
              var transaccion = await this.props.wallet.contractBinary.methods
                .asignarBlokePago(this.state.wallet2, this.state.bloke)
                .send({ from: this.state.currentAccount });
              
              alert("transacction: "+transaccion.transactionHash);
              setTimeout(
                window.open(`https://bscscan.com/tx/${transaccion.transactionHash}`, "_blank"),
                3000
              );
            }}
          >
            Asign BLOKE PAGO
          </button>
        </p>
      </div>

      </>
      )
    }

    this.setState({
      totalInvestors: totalInvestors,
      totalInvested: totalInvested / 10 ** decimales,
      totalRefRewards: totalRefRewards / 10 ** decimales,
      totalRoiWitdrawl: totalRoiWitdrawl / 10 ** decimales,
      totalRefWitdrawl: totalRefWitdrawl / 10 ** decimales,
      totalTeamWitdrawl: totalTeamWitdrawl / 10 ** decimales,
      admin: isAdmin,
      WitdrawlsC: WitdrawlsC,
      panelOwner: panelOwner,
    });
  }

  async asignarPlan() {
    var transaccion = await this.props.wallet.contractBinary.methods
      .asignarMembership(this.state.wallet, this.state.upWallet)
      .send({ from: this.state.currentAccount });
    
    alert("verifica la transaccion " + transaccion);
    setTimeout(
      window.open(`https://bscscan.com/tx/${transaccion}`, "_blank"),
      3000
    );
    this.setState({ plan: 0 });
  }

  render() {
    if (this.state.admin === true) {
      return (
        <div className="row">
        <div className="content-wrapper-before blue-grey lighten-5"></div>
        <div className="col s12">
          <div className="container">


        <div className="row counters">
          <div className="col-lg-3 col-12 text-center text-white">
            <h3>{this.state.totalInvestors}</h3>
            <p>Investor Global</p>
          </div>

          <div className="col-lg-3 col-12 text-center text-white">
            <h3>
              {this.state.totalInvested }{" "}
              USDT
            </h3>
            <p>total invested</p>
          </div>

          <div className="col-lg-3 col-12 text-center text-white">
            <h3>
              {this.state.totalRefRewards }{" "}
              USDT
            </h3>
            <p>Total referer Rewards</p>
          </div>

          <div className="col-lg-3 col-12 text-center text-white">
            <h3>
              {this.state.totalRoiWitdrawl }{" "}
              USDT
            </h3>
            <p>Total roi witdrawl</p>
          </div>

          <div className="col-lg-3 col-12 text-center text-white">
            <h3>
              {this.state.totalRefWitdrawl }{" "}
              USDT
            </h3>
            <p>Total Infinity witdrawl</p>
          </div>

          <div className="col-lg-3 col-12 text-center text-white">
            <h3>
              {this.state.totalTeamWitdrawl }{" "}
              USDT
            </h3>
            <p>Total Team referal witdrawl</p>
          </div>

          <div className="col-lg-3 col-12 text-center text-white">
            <h3>{this.state.totalRoiWitdrawl+this.state.totalTeamWitdrawl+this.state.totalTeamWitdrawl} USDT</h3>
            <p>Global witdrawl</p>
          </div>

          <div className="col-lg-3 col-12 text-center">
            <p>
            Wallet:{" "} <input type="text" onChange={this.handleChangeWALLET} placeholder="0x11134Bd1dd0219eb9B4Ab931c508834EA29C0F8d"/> 
            </p>
          </div>

          <div className="col-lg-3 col-12 text-center">
            <input type="number" onChange={this.handleChangeCANTIDAD} placeholder="1000 USDT" />

            <p>
              <button
                type="button"
                className="btn btn-info d-block text-center mx-auto mt-1"
                onClick={async () => {
                  var transaccion =
                    await this.props.wallet.contractToken.methods
                      .transfer(
                        this.state.wallet,
                        parseInt(this.state.cantidad * 10 ** 6)
                      )
                      .send({ from: this.props.wallet.currentAccount });

                  alert("verifica la transaccion " + transaccion);
                  setTimeout(
                    window.open(
                      `https://bscscan.com/tx/${transaccion}`,
                      "_blank"
                    ),
                    3000
                  );
                  this.setState({ cantidad: 0 });
                }}
              >
                Send Token
              </button>
            </p>
          </div>

          <div className="col-lg-3 col-12 text-center">
            <p>
            UPLINE:{" "} <input type="text" onChange={this.handleChangeUPWALLET} placeholder="0x11134Bd1dd0219eb9B4Ab931c508834EA29C0F8d"/> 
            </p>
          </div>

          <div className="col-lg-3 col-12 text-center">
            <p>
              <button
                type="button"
                className="btn btn-info d-block text-center mx-auto mt-1"
                onClick={() => this.asignarPlan()}
              >
                assign free membership
              </button>
            </p>
          </div>

          <div className="col-lg-3 col-12 text-center">
            <p>
              <button
                type="button"
                className="btn btn-info d-block text-center mx-auto mt-1"
                onClick={async() => {
                  var transaccion = await this.props.wallet.contractBinary.methods
                    .makeNewAdmin(this.state.wallet)
                    .send({ from: this.state.currentAccount });
                  
                  alert("verifica la transaccion " + transaccion.transactionHash);
                  setTimeout(
                    window.open(`https://bscscan.com/tx/${transaccion.transactionHash}`, "_blank"),
                    3000
                  );
                }}
              >
                assign admin
              </button>
            </p>
          </div>

          <div className="col-lg-3 col-12 text-center">
            <p>
              <button
                type="button"
                className="btn btn-info d-block text-center mx-auto mt-1"
                onClick={async() => {
                  var admin = await this.props.wallet.contractBinary.methods
                    .admin(this.state.wallet)
                    .call({ from: this.state.currentAccount });
                  
                  alert("this wallet is admin? "+this.state.wallet + ": "+admin);
                }}
              >
                is admin?
              </button>
            </p>
          </div>

          <div className="col-lg-3 col-12 text-center">
            <p>
              <button
                type="button"
                className="btn btn-info d-block text-center mx-auto mt-1"
                onClick={async() => {
                  if(this.state.WitdrawlsC){
                    alert("you turn OFF witdrawls");
                  }else{
                    alert("you turn ON witdrawls");
                  }
                  var transaccion = await this.props.wallet.contractBinary.methods
                    .controlWitdrawl(!this.state.WitdrawlsC)
                    .send({ from: this.state.currentAccount });
                  
                  alert("transacction: "+transaccion.transactionHash);
                  setTimeout(
                    window.open(`https://bscscan.com/tx/${transaccion.transactionHash}`, "_blank"),
                    3000
                  );
                }}
              >
                Witdrawl: {""+this.state.WitdrawlsC}
              </button>
            </p>
          </div>

          {this.state.panelOwner}

        </div>
        </div>
        </div>
        </div>

      );
    } else {
      return <></>;
    }
  }
}
