import React, { Component } from 'react';
import LockCreation, { Lock } from './lock';
import Mari from "../contracts/Mari.json";
import getWeb3 from "../getWeb3";
const crypto = require("crypto");

class KeyGenFrom extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = { items: [], web3: null, accounts: null, contract: null };
    }


  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Mari.networks[networkId];
      const instance = new web3.eth.Contract(
        Mari.abi,
        deployedNetwork && deployedNetwork.address,
      );
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

    async handleClick(event) {
        event.preventDefault();
        const no_i = document.getElementById('no_i').value;
        const no_p = document.getElementById('no_p').value;
        const data = []
        for (let i = 0; i < no_i; i++) {
            const producers = [];
            for (let j = 0; j < no_p; j++) {
                producers.push(
                    {
                        'xs': new Array(4).fill().map((e, i) => crypto.randomBytes(20).toString('hex')),
                        'ks': [['1', '10'], ['2', '20'], ['3', '30'], ['4', '40']]
                    }
                );
            }
            data.push(
                {
                    'address': this.state.accounts[i].toString('hex'),
                    'producers': producers
                }
            );
        }
        this.setState({
            items: data,
        });
    }

    getRowsData = function (data) {
        return data.map((row, index) => {
            return row.producers.map((p, j) => {
                return p.xs.map((x, i) => {
                    return (
                        <tr>
                            <td style={{ "border": "1px  solid black" }}>{j == 0 && i == 0 ? row.address : ''}</td>
                            <td style={{ "border": "1px  solid black" }}>{i == 0 ? j : ''}</td>
                            <td style={{ "border": "1px  solid black" }}>{x}</td>
                            <td style={{ "border": "1px  solid black" }}>{p.ks[i][0] + ' ' + p.ks[i][1]}</td>
                        </tr>
                    )
                })
            })

            // return <tr key={index} rowSpan={2}><td  >{row.address}</td><RenderRow key={index} data={row} /></tr>
        })
    }

    table() {
        const no_p = 4;
        return (
            <table style={{ "borderWidth": "1px", 'borderStyle': 'solid', "border": "1px  solid black" }}>
                {this.state.items.length > 0 && <tr><th>Intermediary</th><th>Producer</th><th>Keys</th></tr>}
                {this.getRowsData(this.state.items)}
            </table >
        )
    }

    render() {
        return (
            <div style={{ }}>
                <div className="create-form" style={{  "position": "absolute","width": "50%",  "left": "0px" }}>
                    <form>
                        <label htmlFor="no_p">#Producers:</label>
                        <input
                            className="form-control"
                            type="number"
                            id="no_p"
                            name="no_p"
                         />
                        <label htmlFor="no_i">#Intermediaries:</label>
                        <input
                            className="form-control"
                            type="number"
                            id="no_i"
                            name="no_i"
                         />
                        <button className='btn btn-success' onClick={this.handleClick}>Generate</button>
                    </form>
                    <div style={{"overflow-y": "scroll"}}>{this.table()}</div>
                    
                </div>
                <div style={{  "position": "absolute","width": "50%" ,"right":"0px"}}>
                    <LockCreation data={this.state.items} web3={this.state.web3}  accounts={this.state.accounts} contract={this.state.contract} />
                </div>

            </div>


        );
    }
}

export default KeyGenFrom;


// const data = [{
        //     'address': 'add1',
        //     'producers': [
        //         {
        //             'xs': ['x1', 'x2', 'x3', 'x4'],
        //             'ks': [[10, 10], [10, 10], [10, 10], [10, 10]]
        //         },
        //         {
        //             'xs': ['x1', 'x2', 'x3', 'x4'],
        //             'ks': [[10, 10], [10, 10], [10, 10], [10, 10]]
        //         }
        //     ]
        // }, {
        //     'address': 'add2',
        //     'producers': [
        //         {
        //             'xs': ['x1', 'x2', 'x3', 'x4'],
        //             'ks': [[10, 10], [10, 10], [10, 10], [10, 10]]
        //         },
        //         {
        //             'xs': ['x1', 'x2', 'x3', 'x4'],
        //             'ks': [[10, 10], [10, 10], [10, 10], [10, 10]]
        //         }
        //     ]
        // }
        // ];