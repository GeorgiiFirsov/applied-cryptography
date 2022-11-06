async function main() {  
  const Token = await ethers.getContractFactory("Lab2Token");
  console.log('Deploying Token...');
  const token = await Token.deploy('10000000000000000000000');

  await token.deployed();
  console.log("Token deployed to:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {        
    console.log(error);    
    process.exit(1);  
  });
