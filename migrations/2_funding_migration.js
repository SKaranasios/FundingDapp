const FundingContract = artifacts.require("Funding")

module.exports = function(deployer){
    deployer.deploy(FundingContract)
}