import React, { Component } from "react";

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
    this.handleChangeUPWALLET = this.handleChangeUPWALLET.bind(this);

  }

  handleChangeWALLET(event) {
    var evento = event.target.value;
    this.setState({
      wallet: evento
    });
  }

  handleChangeUPWALLET(event) {
    var evento = event.target.value;
    this.setState({
      upWallet: evento
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

    let esto = await this.props.wallet.contractBinary.methods
      .setstate()
      .call({ from: this.state.currentAccount });

    var retirado = await this.props.wallet.contractBinary.methods
      .totalRefWitdrawl()
      .call({ from: this.state.currentAccount });

    var decimales = await this.props.wallet.contractToken.methods
      .decimals()
      .call({ from: this.state.currentAccount });

    var isAdmin = await this.props.wallet.contractBinary.methods.admin(this.state.currentAccount).call({from:this.state.currentAccount});
    
    var WitdrawlsC = await this.props.wallet.contractBinary.methods.onOffWitdrawl().call({from:this.state.currentAccount});

    this.setState({
      totalInvestors: esto.Investors,
      totalInvested: esto.Invested / 10 ** decimales,
      totalRefRewards: esto.RefRewards / 10 ** decimales,
      retirado: retirado / 10 ** decimales,
      admin: isAdmin,
      WitdrawlsC: WitdrawlsC,
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
              {(this.state.totalInvested / this.state.precioSITE).toFixed(2)}{" "}
              USDT
            </h3>
            <p>total invested</p>
          </div>

          <div className="col-lg-3 col-12 text-center text-white">
            <h3>
              {(this.state.totalRefRewards / this.state.precioSITE).toFixed(2)}{" "}
              USDT{" "}
            </h3>
            <p>Total referer</p>
          </div>

          <div className="col-lg-3 col-12 text-center text-white">
            <h3>{this.state.retirado} USDT</h3>
            <p>retirado Global</p>
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
