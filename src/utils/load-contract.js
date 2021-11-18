import contract from "@truffle/contract"

//utilize contract inside web application
//name,provider as parameters
export const loadContract = async (name,provider) =>{
    //accesing json in public folder
    //fetch api
    const response = await fetch(`/contracts/${name}.json`)
    const Artifact = await response.json()
    //will not create abstraction , need to trasnformate into object structure to interact with
    //@truffle-contract-npm
    const _contract = contract(Artifact)
    //get deployed contract
    _contract.setProvider(provider)

    //first need to deploy them to the network
    let deployedContract = null
    try{
    deployedContract = await _contract.deployed()
    }
    catch{
        console.error("Connect to right network")
    }

    return {
        //abstraction
        contract : deployedContract
    }
}