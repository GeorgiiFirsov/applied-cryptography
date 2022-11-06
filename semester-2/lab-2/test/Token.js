const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Lab2Token.sol", () => {
    let contractFactory;
    let contract;
    let owner;
    let alice;
    let bob;
    let initialSupply;
    let ownerAddress;
    let aliceAddress;
    let bobAddress;

    beforeEach(async () => {
        [owner, alice, bob] = await ethers.getSigners();
        initialSupply = ethers.utils.parseEther("100000");
        contractFactory = await ethers.getContractFactory("Lab2Token");
        contract = await contractFactory.deploy(initialSupply);
        ownerAddress = await owner.getAddress();
        aliceAddress = await alice.getAddress();
        bobAddress = await bob.getAddress();
    });

    describe("Correct setup", () => {
        it("should be named 'Lab2Token", async () => {
            const name = await contract.name();
            expect(name).to.equal("Lab2Token");
        });
        it("should have correct supply", async () => {
            const supply = await contract.totalSupply();
            expect(supply).to.equal(initialSupply);
        });
        it("owner should have all the supply", async () => {
            const ownerBalance = await contract.balanceOf(ownerAddress);
            expect(ownerBalance).to.equal(initialSupply);
        });
    });

    describe("Core", () => {
        it("owner should transfer to Alice and update balances", async () => {
            const transferAmount = ethers.utils.parseEther("1000");
            let aliceBalance = await contract.balanceOf(aliceAddress);
            expect(aliceBalance).to.equal(0);
            await contract.transfer(aliceAddress, transferAmount);
            aliceBalance = await contract.balanceOf(aliceAddress);
            expect(aliceBalance).to.equal(transferAmount);
        });
        it("owner should transfer to Alice and Alice to Bob", async () => {
            const transferAmount = ethers.utils.parseEther("1000");
            await contract.transfer(aliceAddress, transferAmount); // contract is connected to the owner.
            let bobBalance = await contract.balanceOf(bobAddress);
            expect(bobBalance).to.equal(0);
            await contract.connect(alice).transfer(bobAddress, transferAmount);
            bobBalance = await contract.balanceOf(bobAddress);
            expect(bobBalance).to.equal(transferAmount);
        });
    });
});
