import React, { Component } from "react";

import CrowdFunding from "../CrowdFunding";
import Oficina from "../Oficina";
import Datos from "../Datos";
import Depositos from "../Depositos";

export default class Home extends Component {
  
  render() {

      return (
        <>
          <Oficina contractAddress={this.props.contractAddress} wallet={this.props.wallet} />

          <CrowdFunding contractAddress={this.props.contractAddress}  wallet={this.props.wallet} />

          <Datos admin={this.props.admin} contractAddress={this.props.contractAddress} wallet={this.props.wallet} />

          <Depositos contractAddress={this.props.contractAddress} wallet={this.props.wallet} />

        </>
      );
  }
}
