const { expect } = require("chai");
const { ethers } = require("hardhat");

TOKEN_NAME = 'Lab3Token'
INITIAL_SUPPLY = 100000;

describe("LabToken.sol", () => {
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
        initialSupply = ethers.utils.parseEther(INITIAL_SUPPLY.toString());
        contractFactory = await ethers.getContractFactory(TOKEN_NAME);
	
        [owner, alice, bob] = await ethers.getSigners();
        contract = await contractFactory.deploy(initialSupply);
	
        ownerAddress = await owner.getAddress();
        aliceAddress = await alice.getAddress();
        bobAddress = await bob.getAddress();
    });

    describe("Correct setup", () => {
        it(`should be named ${TOKEN_NAME}`, async () => {
            const name = await contract.name();
            expect(name).to.equal(TOKEN_NAME);
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

    describe("Miners mapping test", () => {
        it("Registration", async () => {
            //
            // registerMiner is overloaded, so I must call it in the following scary way :(
            //

            contract['registerMiner(address)'](ownerAddress);
			contract['registerMiner(address,address)'](aliceAddress, ownerAddress);
			
			// Actually don't know for now, what to test here
        });

        it("Updates and queries", () => {
            contract['registerMiner(address)'](ownerAddress);
			contract.updateMiner(ownerAddress, false, 100, 10);
			
			contract.getMinerInfo(ownerAddress)
				.then((value) => {
				    expect(value).to.equal(['0x0000000000000000000000000000000000000000', 
                                            false,
                                            BigNumber(100),
                                            100
                                           ]);
                });
        });
    });

    describe("Hashes array test", () => {
        it("Insertion", async () => {
            var data = new Uint8Array(10);
			contract.associateData(data)
				.then((value) => {
				    expect(value.value.value).to.equal(0);
			    });
		});
    });
});
