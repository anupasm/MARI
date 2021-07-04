import React, { Component } from 'react';
const { MerkleTree } = require('../merkeltree/merkeltree');

class LockCreation extends Component {

    constructor(props) {
        super(props);
        this.merkleTree = new MerkleTree();
        this.handleClaim = this.handleClaim.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.createLock = this.createLock.bind(this);

        this.state = {
            data: [],
            lock: '',
            witness: [],
            contract: ''
        }
    }

    async handleClaim(event) {
        event.preventDefault();

        const i1 = document.getElementById('i1').value;
        const i2 = document.getElementById('i2').value;
        const i3 = document.getElementById('i3').value;
        console.log(this.props.web3.eth.getBalance(this.props.accounts[i3]));
        const p = this.state.data[this.props.accounts[i3]][i2];
        const res = await this.props.contract.methods.claim(
            this.state.contract[1],
            this.state.contract[0],
            this.state.witness[1],
            this.state.witness[2],
            this.state.witness[3],
            p[0][i1],
            p[1][i1].slice(0, 6),
            p[1][i1].slice(6, 12),
            i1,
            i2,
            i3
        ).call({
            from: this.props.accounts[i3],
        });
        console.log(this.props.web3.eth.getBalance(this.props.accounts[i3]));

    }

    async handleClick(event) {
        event.preventDefault();
        const i1 = document.getElementById('i1').value;
        const i2 = document.getElementById('i2').value;
        const i3 = document.getElementById('i3').value;
        this.setState({
            witness: this.merkleTree.WW(this.state.data, i1, i2, i3)
        });
    }

    async createLock(event) {
        event.preventDefault();
        const res = await this.props.contract.methods.newContract('0x' + this.state.lock).send({
            from: this.props.accounts[0],
            value: this.props.web3.utils.toWei("0.002", "ether"),
            gasPrice: this.props.web3.utils.toHex(5000000000),
            gasLimit: this.props.web3.utils.toHex(220000),
        });
        const index = res.events.NewContract.returnValues[0];
        const contract = await this.props.contract.methods.getContract(this.props.accounts[0], index).call();
        this.setState({
            contract: [index, this.props.accounts[0]]
        });
    }

    render() {
        let data = {};
        let lock = '';
        if (this.props.data.length > 0) {
            this.props.data.forEach(e => {
                data[e.address] = e.producers.map(e => (
                    [
                        e.xs.map(el => Buffer.from(el)),
                        e.ks.map(it => {
                            const buff = Buffer.alloc(12);
                            buff.writeIntBE(it[0], 0, 6);
                            buff.writeIntBE(it[1], 6, 6);
                            return buff;
                        })
                    ]
                ));
            });
            this.state.lock = Buffer.from(this.merkleTree.LL(data)).toString('hex');
            this.state.data = data;
        }
        return (
            <div>
                <div className="create-form">
                    <form>
                        <tr><label> {this.state.lock && "Lock:" + this.state.lock}</label></tr>
                        <tr><label>{this.state.contract && 'New Contract Details: index ' + this.state.contract[0] + ' by ' + this.state.contract[1]}</label></tr>
                        {this.state.lock &&
                            <tr><button className='btn btn-success' onClick={this.createLock}>CreateLock</button></tr>
                        }
                    </form>
                </div>
                <div className="create-form">
                    <form>
                        <table>
                            <tr>
                                <td><label htmlFor="i1">Secret Index(i1):</label></td>
                                <td><input className="form-control" type="number" id="i1" name="i1" /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="i2">Producer Index(i2):</label></td>
                                <td><input className="form-control" type="number" id="i2" name="i2" /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="i3">Intermediary Index(i3):</label></td>
                                <td><input className="form-control" type="number" id="i3" name="i3" /></td>

                            </tr>
                        </table>
                        <button className='btn btn-success' onClick={this.handleClick}>Witness</button>
                        <button className='btn btn-success' onClick={this.handleClaim}>Claim</button>
                    </form >
                </div >
                <div style={{ "overflow-y": "scroll" }}>
                    {Object.entries(this.state.witness).map(([i, e]) => (
                        <tr>
                            {e.map(w => (<td>{Buffer.from(w).toString('hex')}</td>))}
                        </tr>
                    ))}
                </div>
            </div >
        );
    }
}

export default LockCreation;
