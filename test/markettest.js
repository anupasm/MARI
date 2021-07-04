const Mari = artifacts.require("./Mari.sol");
const { log } = require('console');
const { MerkleTree } = require('../client/src/merkeltree/merkeltree');

contract("Mari", accounts => {

  const merkleTree = new MerkleTree();

  it('inclusion proof level 1', async () => {
    // DATA CREATION STARTS
    const xs = ['x1', 'x2', 'x3', 'x4',].map(el => Buffer.from(el));
    const ks = [['1', '10'], ['2', '20'], ['3', '30'], ['4', '40']].map(it => {
      buff = Buffer.alloc(12);
      buff.writeIntBE(it[0], 0, 6);
      buff.writeIntBE(it[1], 6, 6);
      return buff;
    });
    const root = '0x' + merkleTree.L(xs, ks, 1).toString('hex');
    let proofs = []
    let hashes = []
    xs.forEach((element, index) => {
      proofs[index] = merkleTree.W(index, xs, ks, 1);
      hashes[index] = Buffer.concat([ks[index], merkleTree.H(element)])
    });

    // DATA CREATION ENDS
    const instance = await Mari.deployed();

    for (let index = 0; index < proofs.length; index++) {
      const res1 = await instance.verify.call(proofs[index], hashes[index], index, 1);
      console.log(res1);
      assert.equal(res1, root, xs[index] + ":" + res1 + "not equals to root" + root);
    };

  });

  it('inclusion proof all level', async () => {

    // DATA CREATION STARTS
    K = {}
    for (let b = 0; b < 2; b++) {
      KK = []
      for (let a = 0; a < 4; a++) {
        const xs = ['x1', 'x2', 'x3', 'x4'].map(el => Buffer.from(el));
        const ks = [[1 * (b + 1) * (a + 1), 10], [2 * (b + 1) * (a + 1), 20], [3 * (b + 1) * (a + 1), 30], [4 * (b + 1) * (a + 1), 40]].map(it => {
          buff = Buffer.alloc(12);
          buff.writeIntBE(it[0], 0, 6);
          buff.writeIntBE(it[1], 6, 6);
          return buff;
        });
        KK.push([xs, ks]);
      }
      K[accounts[b]] = KK;
    }
    // DATA CREATION ENDS
    const instance = await Mari.deployed();

    const main_root = '0x' + merkleTree.LL(K).toString('hex');
    const i1 = 0, i2 = 0, i3 = 0;
    const x = K[accounts[i3]][i2][0][i1];
    const k = K[accounts[i3]][i2][1][i1];
    const proof = merkleTree.WW(K, i1, i2, i3);
    let res2 = await instance.claim.call(proof[1], proof[2], proof[3], x, k.slice(0, 6), k.slice(6, 12), i1, i2, i3, { from: accounts[i3] });
    assert.equal(res2, main_root, res2 + " != root " + main_root);

  });
});


// Mari.deployed().then(function (instance) { return instance.verify(['0x0000000000020000000000144d71459cafd523aae4d2ad95ffd9004d089f758a', '0x000000000004000000000028634cac8182f43ea5c546ffe6b941c347dd9fd4b5'], '0x00000000000100000000000a97fcb6801f7af5eda3a72046950a7966e5839262', 0); });
// Mari.deployed().then(function (instance) { return instance.verify(['0x00000000000300000000001ea9a156906db2920660f922c3ef1ca0ae1a1bcb5e', '0x000000000002000000000014902db885a13406603f17e55348fa398352675c26'], '0x000000000004000000000028105e3ccc6ad34fdf2aa6c65b7548520d8712bb9f', 3); });
// Mari.deployed().then(function (instance) { return instance.verify(['0x00000000000300000000001ea9a156906db2920660f922c3ef1ca0ae1a1bcb5e', '0x000000000002000000000014902db885a13406603f17e55348fa398352675c26'], '0x000000000004000000000028105e3ccc6ad34fdf2aa6c65b7548520d8712bb9f', 3); });
// Mari.deployed().then(function (instance) { return instance.verify(['0x00000000000300000000001ea9a156906db2920660f922c3ef1ca0ae1a1bcb5e', '0x000000000002000000000014902db885a13406603f17e55348fa398352675c26'], '0x000000000004000000000028105e3ccc6ad34fdf2aa6c65b7548520d8712bb9f', 3); });
// 00000000000100000000000100000000000a97fcb6801f7af5eda3a72046950a7966e58392620000000000020000000000144d71459cafd523aae4d2ad95ffd9004d089f758a
// 00000000000100000000000100000000000a97fcb6801f7af5eda3a72046950a7966e58392620000000000020000000000144d71459cafd523aae4d2ad95ffd9004d089f758a


// Mari.deployed().then(function (instance) { return instance.claim(['0x0000000000020000000000144d71459cafd523aae4d2ad95ffd9004d089f758a', '0x000000000004000000000028634cac8182f43ea5c546ffe6b941c347dd9fd4b5'], ['0x000000000008000000000000e4305c04de5c7c386e634eeed823d4e296c17ed7', '0x00000000001c000000000000d80705414b2318b9d51dbef1af5f26cc0c830f22'], ['0x0000000000500000000000002c195455959012ece965861b6e84a7e0c552832b'], "x1", '0x000000000001', '0x00000000000a', 0, 0, 0); });
// Mari.deployed().then(function (instance) { return instance.claim(['0x000000000002000000000014857f5f7a1896ab2dc306d2a9ed6a461237a7a56e','0x0000000000040000000000282702817e4b9110f187150c07b9e5611be1c428e7'], ['0x000000000004000000000000bb0bf1b5fe8413b091333293b916fbf6ea0a8cc1'], ['0x00000000000800000000000027156e62d5893d67a0031489259e95b4d45fed04'], "0xbe68f0ca9b1a3e09d0da89bdcec75c57ad1c1e90", '0x000000000001', '0x00000000000a', 0, 0, 0); });