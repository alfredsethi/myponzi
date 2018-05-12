var ponzi = artifacts.require("./ponzi.sol");

module.exports = function(deployer) {
  deployer.deploy(ponzi);
};
