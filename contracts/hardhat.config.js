require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.0",
  networks: {
    caldera: {
      url: "https://treehacks-devnet.rpc.caldera.xyz/http",
      chainId: 2162024,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
