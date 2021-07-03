pragma solidity >=0.5.2 <0.8.4;

contract Mari {
    struct Contract {
        uint256 amount;
        bytes32 lock;
        uint256 expire;
    }

    mapping(address => Contract[]) contracts;

    event NewContract(uint256 index);
    event Root(bytes32 proofElement);

    function newContract(bytes32 lock, uint256 expire) public payable {
        require(msg.value > 0);

        contracts[msg.sender].push(Contract(msg.value, lock, expire));
        uint256 id = contracts[msg.sender].length - 1;
        emit NewContract(id);
    }

    function getContract(address addr, uint256 index)
        public
        view
        returns (
            uint256,
            bytes32,
            uint256
        )
    {
        Contract memory c = contracts[addr][index];
        return (c.amount, c.lock, c.expire);
    }

    function getCount(address a) public view returns (uint256) {
        return contracts[a].length;
    }

    function _concat2(bytes12 a, bytes20 b) internal pure returns (bytes32) {
        return bytes32((uint256(uint96(a)) << 160) | uint160(b));
    }

    function _concat3(
        bytes6 a,
        bytes6 b,
        bytes20 c
    ) internal pure returns (bytes32) {
        bytes12 x = bytes12((uint96(uint48(a)) << 48) | uint48(b));
        bytes32 y = bytes32((uint256(uint96(x)) << 160) | uint160(c));
        return y;
    }

    function _F(
        uint256 j,
        bytes32 ln,
        bytes32 w,
        uint8 layer
    )
        internal
        pure
        returns (
            bytes12 p1,
            bytes32 p2,
            bytes32 p3
        )
    {
        bytes12 w1 = bytes12(w);
        bytes12 ln1 = bytes12(ln);
        if (j % 2 == 0) {
            p1 = w1;
            p2 = ln;
            p3 = w;
        } else {
            p1 = ln1;
            p2 = w;
            p3 = ln;
        }
        if (layer != 1) {
            uint96 sum = uint48(bytes6(w1)) + uint48(bytes6(ln1));
            p1 = bytes12(sum<<48);
        }
    }

    function verify(
        bytes32[] memory W,
        bytes32 h,
        uint256 j,
        uint8 layer
    ) public returns (bytes32) {
        bytes32 ln = h;

        for (uint48 i = 0; i < W.length; i++) {
            uint48 height = i + 1;

            (bytes12 p1,bytes32 p2,bytes32 p3) = _F(j, ln, W[i], layer);
            ln = _concat2(
                p1,
                ripemd160(abi.encodePacked(height, p2, p3))
            );

            j = j / 2;
        }
        emit Root(ln);
        return ln;
    }

    function claim(
        bytes32[] memory W1,
        bytes32[] memory W2,
        bytes32[] memory W3,
        string memory x1,
        bytes6 v1,
        bytes6 e1,
        uint256 i1,
        uint256 i2,
        uint256 i3 // bytes32 sig
    ) public {
        bytes32 h1 = _concat3(v1, e1, ripemd160(abi.encodePacked(x1)));
        bytes32 res = verify(W1, h1, i1, 1);
        bytes20 h2 = bytes20(uint160(uint256(res)));
        res = verify(W2, _concat2(bytes12(uint96(uint48(bytes6(res)))<<48), ripemd160(abi.encodePacked(h2))), i2, 2);
        bytes12 k3 = bytes12(uint96(uint48(bytes6(res)))<<48);
        bytes20 h3 = bytes20(uint160(uint256(res)));
        bytes memory h4 = abi.encodePacked(uint8(0),h3);
        bytes32 mm =  _concat2(k3,ripemd160(h4));
        bytes32 ll = verify(W3,  _concat2(k3,ripemd160(h4)), i3, 3);
        emit Root(ll);
    }
}

// https://ethereum.stackexchange.com/questions/67644/how-to-split-bytes32-into-multiples-of-8-in-solidity
