import contract from "@truffle/contract"


export const loadContract = async (name) =>{
    //accesing json in public folder
    //fetch api
    const response = await fetch(`/contracts/${name}.json`)
    const Artifact = await response.json()
    //will not create abstraction , need to trasnformate into object structure to interact with
    //@truffle-contract-npm

    return {
        //abstraction
        contract : contract(Artifact)
    }
}