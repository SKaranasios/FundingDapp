//import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, /*useState*/ } from "react";
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from './utils/load-contract';


function App() {

  //use this state to display information inside render function
  //and manipulate state with certain functions
  //   [variable , function]
  const[web3Api, setWeb3Api] =  useState({
    provider : null ,
    web3 : null ,
    //reference of contract
    contract : null
  })

  const [balance,setBalance]= useState(null)


  const[account,setAccount] = useState(null)
  
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
      const { contract } = await loadContract("Funding",provider)

      if(provider){
        //using request in button to connect for bettet ui
        //provider.request({method:"eth_requestAccounts"})
        setWeb3Api({
          web3: new Web3(provider),
          provider ,
          //loading contract
          contract
        })
      }
      else{
        console.error("Please,install metamask.")
      }


      /*if(window.ethereum){
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
  } , [])

  useEffect(()=>{
      const loadBalance = async () => {
        //in contract i have address with web3 i can make requests to the network
      const { contract ,web3 } = web3Api
      const balance = await web3.eth.getBalance(contract.address)
      setBalance(balance)
    }

    //checking if we have a contract

    web3Api.contract && loadBalance()
  }, [web3Api])


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


  return (
    
      <div className="faucet-wrapper">
        <div className="faucet">
          <span> 
            <strong>Account:</strong>
          </span>
          <h1>          
            {account ? account:
            <button className= "button is-normal"
            onClick={() =>
              web3Api.provider.request({method: "eth_requestAccounts"}
            )}> 
              Connect Wallet
             </button>
            }
          </h1>
          <div className="balance-view is-size-2 mb-4">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          <button className="button is-link  mx-3 is-medium">Donate</button>
          <button className="button is-primary is-medium  ">Withdraw</button>
        </div>
      </div>
  );
}

export default App;
