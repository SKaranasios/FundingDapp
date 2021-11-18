//import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState,useCallback /*useState*/ } from "react";
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from './utils/load-contract';


//react used hooks , jsx expession
function App() {

  //use this state to display information inside render function
  //and manipulate state with certain functions
  //   [variable , function]
  const[web3Api, setWeb3Api] =  useState({
    provider : null ,
    web3 : null ,
    //reference of contract
    contract : null ,
    isProviderLoaded:false
  })

  const [balance,setBalance]= useState(null)


  const[account,setAccount] = useState(null)

  const[Reload , doReload] = useState(false)


  const reloadEffect = useCallback(
    () => {
      doReload(!Reload)
    },
    [Reload]
  )

  const setAccountListener =(provider) => {
    //provider.on("accountsChanged", (accounts) =>setAccount(accounts[0]))
    //ux imporvement when locking and changing account instant refresh
    provider.on("accountsChanged", _ => window.location.reload())

    
  }

  const canConnecttoCOntract = web3Api.contract && account

  
  
  useEffect(() => 
  {
    const loadProvider = async () =>{
      //with metamaks we have access to window.ethereum & window.web3
      //metamask injects a global API into website
      //this API allows websites to request users, ccounts,read data to blockchain
      //sign messages

      //console.log(window.web3)
      //console.log(window.ethereum)
      const provider = await detectEthereumProvider() 
    

      if(provider){
         //getting instance of deployed cotnract
        const { contract } = await loadContract("Funding",provider)
        //reload every time account changes
        setAccountListener(provider)
        //using request in button to connect for bettet ui
        //provider.request({method:"eth_requestAccounts"})
        setWeb3Api({
          web3: new Web3(provider),
          provider ,
          //loading contract
          contract,
          isProviderLoaded:true
        })
      }
      else{
        setWeb3Api({
          ...web3Api , isProviderLoaded:true
        })
        console.error("Please,install metamask.")
      }


      /*
      if(window.ethereum){
        provider = window.ethereum
        try{
          //ethereum enable is deprecated 
          //await provider.enable();
          await provider.request({method:"eth_requestAccounts"})
        }
        catch{
          console.error("User denied accont access")
        }
      }
      else if (window.web3){
        provider = window.web3.currentProvider
      }
      else if (!process.env.production){
        provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545")
      }
      */

      

    }

    loadProvider()

    //array of dependencies , only run when something changes
    //if it's empty nothing to change
  } , [web3Api])

  useEffect(()=>{
      const loadBalance = async () => {
        //in contract i have address with web3 i can make requests to the network
        //load contract ,web3 from web3Api syntax
      const { contract ,web3 } = web3Api
      const balance = await web3.eth.getBalance(contract.address)
      //fromWei to show balance in ETH
      setBalance(web3.utils.fromWei(balance , "ether"))
  
    }

    //checking if we have a contract

    web3Api.contract && loadBalance()

    //when should reload will be changed, so every time addFUnds executes
  }, [web3Api,Reload])


  //need to use this function only when web3api is initialized
  useEffect(()=> {
    const getAccount = async() =>{
      const accounts = await web3Api.web3.eth.getAccounts()
      //want to extract from here one account so will save to state
      setAccount(accounts[0])
    }

    //only wehn web3api intialized
    web3Api.web3 && getAccount()
  
  }, [web3Api.web3])

  console.log(web3Api)

  const addFunds =useCallback (async () => {
    //syntax for loading from web3Api
    const {contract ,web3} = web3Api
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1","ether")
    })
    //reloads browser
    //window.location.reload()

    //each time this executes dorealod use state changes
    reloadEffect()

  } , [web3Api,account,reloadEffect])

  const withdraw = 
    async () => {
      const {contract , web3 } = web3Api
      const withdrawAmmount = web3.utils.toWei("0.1","ether")
      await contract.withdraw(withdrawAmmount,{
        from:account ,
      })
      reloadEffect()
    }
  


    return (
//jsx expession account ? means if you dont have an account | account ? :  | if(true) then 
//ux improvement if isProvided loaded then show accounnt --to avoid showing install metamask prompt on one instant showing when laoding provider
      <div className="faucet-wrapper">
        <div className="faucet">
         {
           web3Api.isProviderLoaded ?
           <div className="is-align is-alight-items-center">
            <span> 
              <strong>Account:</strong>
            </span>
                      
                {account ? 
                <div>{account}</div>:
                !web3Api.provider ? 
                <>
                  <div className="notification is-warning is-small is-rounded">
                  Wallet is not connected!
                    <a target="_blank" href="#">
                      Install metamask
                    </a>
                  </div>
                </>:
                <button className="button is-normal"
                    onClick={() => web3Api.provider.request({ method: "eth_requestAccounts" }
                    )}>
                    Connect Wallet
                  </button>
              }
              </div>:
                <span>Looking for web3</span>
}

          
          
          <div className="balance-view is-size-2 mb-4">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          <button disabled={!canConnecttoCOntract} className="button is-link  mx-3 is-medium" onClick={addFunds}>Donate</button>
          <button disabled={!canConnecttoCOntract} className="button is-primary is-medium  " onClick={withdraw}>Withdraw</button>
        </div>
      </div>
  );
}

export default App;

//ux improvements
/* 
account lock -- refresh account holder 
no provider  -- prompt to install metamask
--and if provider not loaded showing generic message looking for web3
fix warnings
check contract load -- showing error message when loading contract in another network etc Ropsten network
*/