var Bank = artifacts.require("./Bank.sol");
var NewToken=artifacts.require("./NewToken.sol");

module.exports = function(deployer)
{
    deployer.deploy(NewToken);
    deployer.deploy(Bank);
};