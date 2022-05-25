import React, { Component } from "react";
import lottery from "./lottery";
import "./App.css";
import web3 from "./web3";

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction...'});

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked!'});
  };

  onSubmit = async (event) => {
    event.preventDefault();
    
    const accounts = await web3.eth.getAccounts();
    
    this.setState({ message: 'Waiting on transaction sucess...'});

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether'),
    });

    this.setState({ message: 'You have been entered! :)'});
  }

  render() {
    return (
      <div>
        <h2>Lottery contract</h2>
        <p>
          This contract is managed by {this.state.manager}. There are currently {" "}
          {this.state.players.length} entered, competing to win {" "}
          {web3.utils.fromWei(this.state.balance, "ether")} ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}> 
          <h2>Want to try luck?</h2>
          <div>
            <div>
              <h4>Aumont of ETH to enter:</h4>
            </div>
            <input
              value= {this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
            <button>Enter</button>
          </div>
        </form>

        <hr/>
        
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>
        
        <hr/>

        <div>
          <p>{this.state.message}</p>
        </div>
      </div>
    );
  }
}

export default App;
