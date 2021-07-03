const { MerkleTree } = require("./merkeltree");

var xs = ['x1', 'x2', 'x3', 'x4',].map(el => Buffer.from(el));
var ks = [['1', '10'], ['2', '20'], ['3', '30'], ['4', '40']].map(it => {
    buff = Buffer.alloc(12);
    buff.writeIntBE(it[0], 0, 6);
    buff.writeIntBE(it[1], 6, 6);
    return buff;
});

console.log(xs.map(el => el.toString('hex')), ks.map(el => el.toString('hex')));
const merkleTree = new MerkleTree();
const root = merkleTree.L(xs, ks, 1);
const proof = merkleTree.W(0, xs, ks, 1);
const proof1 = merkleTree.W(1, xs, ks, 1);
const proof2 = merkleTree.W(2, xs, ks, 1);
const proof3 = merkleTree.W(3, xs, ks, 1);
console.log('hexxxxxxxxxxxxxxxxxxxxxxxxx');
console.log(root.toString('hex'));
console.log('hexxxxxxxxxxxxxxxxxxxxxxxxx');


// console.log(proof[0].length);
// console.log(proof.map(el => el.toString('hex')));
// console.log(proof1.map(el => el.toString('hex')));
// console.log(proof2.map(el => el.toString('hex')));
// console.log(proof3.map(el => el.toString('hex')));

xs = ['0xdd6507dafb08250128c72ed51dfaa9aa8915b72b', '0x0964ac9e89ab084b270201a887a0fb914006d5e0', '0x5592e5744d402cdbb5f029464ceee314e004e355', '0x44b5e2607e6d28d0417f6e0dbd8d6be026efd4d3'];
ks = [[4, 40], [8, 40], [12, 40], [16, 40]].map(it => {
    buff = Buffer.alloc(12);
    buff.writeIntBE(it[0], 0, 6);
    // buff.writeIntBE(it[1], 6, 6);
    return buff;
});
var r = merkleTree.L(xs, ks, 2);
var p = merkleTree.W(0, xs, ks, 2);

console.log(r);
console.log(p.map(el => el.toString('hex')));
// xs = ['0x02c46fa8f011834ce68fb054ae6a6adc50efc480', '0xff460bd26cf3d11b25140df624e66549a3d93f55'];
// ks = [[40, 40], [80, 40]].map(it => {
//     buff = Buffer.alloc(12);
//     buff.writeIntBE(it[0], 0, 6);
//     buff.writeIntBE(it[1], 6, 6);
//     return buff;
// });
// r = merkleTree.L(xs, ks, 3);
// p = merkleTree.W(0, xs, ks, 3);


// console.log(r);
// console.log(p.map(el => el.toString('hex')));



// var buff1 = Buffer.alloc(6);
// buff1.writeIntBE(1,0,6);

// const h1 = Buffer.concat([ks[0],(merkleTree.H(xs[0]))])
// const h2 = Buffer.concat([ks[1],(merkleTree.H(xs[1]))])
// const h3 = Buffer.concat([ks[2],(merkleTree.H(xs[2]))])
// const h4 = Buffer.concat([ks[3],(merkleTree.H(xs[3]))])

// console.log('h1',h1.toString('hex'))
// console.log('h2',h2.toString('hex'))
// console.log('h3',h3.toString('hex'))
// console.log('h4',h4.toString('hex'))

// const h12 = Buffer.concat([ks[1],merkleTree.H(Buffer.concat([buff1, h1,h2]))]);
// const h34 = Buffer.concat([ks[3],merkleTree.H(Buffer.concat([buff1, h3,h4]))]);

// console.log('h12',h12.toString('hex'))
// console.log('h34',h34.toString('hex'))

// var buff2 = Buffer.alloc(6);
// buff2.writeIntBE(2,0,6);
// const h1234 = merkleTree.H(Buffer.concat([buff2, h12,h34]));

// console.log(h1234);

var buff1 = Buffer.alloc(6);
buff1.writeIntBE(1,0,6);

var buff12 = Buffer.alloc(12);
buff12.writeIntBE(12,0,6);

var buff28 = Buffer.alloc(12);
buff28.writeIntBE(28,0,6);

const h1 = Buffer.concat([ks[0],(merkleTree.H(xs[0]))])
const h2 = Buffer.concat([ks[1],(merkleTree.H(xs[1]))])
const h3 = Buffer.concat([ks[2],(merkleTree.H(xs[2]))])
const h4 = Buffer.concat([ks[3],(merkleTree.H(xs[3]))])

console.log('h1',h1.toString('hex'))
console.log('h2',h2.toString('hex'))
console.log('h3',h3.toString('hex'))
console.log('h4',h4.toString('hex'))

const h12 = Buffer.concat([buff12,merkleTree.H(Buffer.concat([buff1, h1,h2]))]);
const h34 = Buffer.concat([buff28,merkleTree.H(Buffer.concat([buff1, h3,h4]))]);

console.log('h12',h12.toString('hex'))
console.log('h34',h34.toString('hex'))

var buff2 = Buffer.alloc(6);
buff2.writeIntBE(2,0,6);

var buff40 = Buffer.alloc(12);
buff40.writeIntBE(0,0,6);
buff40.writeIntBE(40,6,6);
const h1234 = merkleTree.H(Buffer.concat([buff2, h12,h34]));

console.log(buff40,h1234);





// 000000000004000000000028dd6507dafb08250128c72ed51dfaa9aa8915b72b
// hexxxxxxxxxxxxxxxxxxxxxxxxx
// [ '0000000000020000000000144d71459cafd523aae4d2ad95ffd9004d089f758a',
//   '000000000004000000000028634cac8182f43ea5c546ffe6b941c347dd9fd4b5' ]
// [ '00000000000100000000000a97fcb6801f7af5eda3a72046950a7966e5839262',
//   '000000000004000000000028634cac8182f43ea5c546ffe6b941c347dd9fd4b5' ]
// [ '000000000004000000000028105e3ccc6ad34fdf2aa6c65b7548520d8712bb9f',
//   '000000000002000000000014902db885a13406603f17e55348fa398352675c26' ]
// [ '00000000000300000000001ea9a156906db2920660f922c3ef1ca0ae1a1bcb5e',
//   '000000000002000000000014902db885a13406603f17e55348fa398352675c26' ]