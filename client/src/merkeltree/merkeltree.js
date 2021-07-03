const { ripemd160 } = require('ethereumjs-util');

class MerkleTree {
    concat(...args) {
        return Buffer.concat([...args]);
    }


    F(X, K, layer) {
        switch (layer) {
            case 1:
                return K.slice(-1)[0]
            default:
                const sum = K.map(el => el.readIntBE(0, 6)).reduce((a, b) => a + b, 0)
                const b = Buffer.alloc(12);
                b.writeIntBE(sum, 0, 6);
                return b
        }
    }

    height(l) {
        const h = Math.log2(l).toFixed(0);
        buff = Buffer.alloc(6);
        buff.writeIntBE(h, 0, 6);
        return buff;
    }

    H(arg) {
        return ripemd160(arg)
    }

    L(X, K, layer) {
        const l = X.length
        if (l == 1) {
            return this.concat(K[0], this.H(X[0]));
        }

        let j = Math.pow(2, Math.trunc(Math.log2(l)));
        if (j == l) {
            j = Math.pow(2, Math.trunc(Math.log2(l - 1)));
        }

        return this.concat(
            this.F(X, K, layer),
            this.H(
                this.concat(
                    this.height(l),
                    this.L(X.slice(0, j), K.slice(0, j), layer),
                    this.L(X.slice(j, l), K.slice(j, l), layer)
                )
            )
        );
    }

    W(i, X, K, layer) {
        const l = X.length
        if (l == 1) {
            return [];
        }
        let j = Math.pow(2, Math.trunc(Math.log2(l)));
        if (j == l) {
            j = Math.pow(2, Math.trunc(Math.log2(l - 1)));
        }
        if (i < j) {
            return this.W(i, X.slice(0, j), K.slice(0, j), layer).concat(
                [(
                    this.F(X, K, layer),
                    this.L(X.slice(j, l), K.slice(j, l), layer)
                )]
            );
        } else {
            return this.W(i - j, X.slice(j, l), K.slice(j, l), layer).concat(
                [(
                    this.F(X, K, layer),
                    this.L(X.slice(0, j), K.slice(0, j), layer)
                )]
            );
        }
    }

    P(k) {
        console.log(k.toString('hex'));
    }

    PA(msg, k) {
        console.log(msg, k.map(e => e.toString('hex')));
    }

    LL(K) {
        var ks2 = []
        var xs2 = []
        K.forEach((e1, i) => {
            var ks1 = []
            var xs1 = []
            console.log('-------', i);
            e1.forEach(e2 => {
                const res = this.L(e2[0], e2[1], 1);
                this.P(res);
                xs1.push(res.slice(12, 32))
                ks1.push(res.slice(0, 12).fill(0,6,12))
            });

            const res = this.L(xs1, ks1, 2);
            this.P(res);
            const h = res.slice(12, 32);
            const add = Buffer.alloc(1, i);

            console.log('add',Buffer.concat([add, h]),add,i,this.H(Buffer.concat([add, h])));
            xs2.push(Buffer.concat([add, h]));
            ks2.push(res.slice(0, 12).fill(0,6,12));
        });
        console.log(xs2);
        console.log(ks2);
        const res = this.L(xs2, ks2, 3);
        this.P(res);
    }

    WW(K, i1, i2, i3) {
        var ks2 = []
        var xs2 = []
        K.forEach((e1, index1) => {
            var ks1 = []
            var xs1 = []
            e1.forEach((e2, index2) => {//prod
                const res = this.L(e2[0], e2[1], 1);
                if (index2 == i2 & index1 == i3) {
                    const w1 = this.W(i1, e2[0], e2[1], 1);
                    this.PA('witness1', w1);

                }
                xs1.push(res.slice(12, 32))
                ks1.push(res.slice(0, 12).fill(0,6,12))
            });
            const res = this.L(xs1, ks1, 2);

            if (index1 == i3) {
                const w2 = this.W(i2, xs1, ks1, 2);
                this.PA('witness2', w2);
            }
            const h = res.slice(12, 32);
            const add = Buffer.alloc(1, index1);
            console.log(this.H(Buffer.concat([add, h])));

            xs2.push(Buffer.concat([add, h]));
            ks2.push(res.slice(0, 12).fill(0,6,12));

        });
        const res = this.L(xs2, ks2, i3);
        const w3 = this.W(i3, xs2, ks2, 3);
        this.PA('witness3', w3);
        this.P(res);
    }


}

module.exports = {
    MerkleTree,
};