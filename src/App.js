//import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, /*useState*/ } from "react";
import Web3 from 'web3';



function App() {

  //use this state to display information inside render function
  //and manipulate state with certain functions
  //   [variable , function]
  const[web3Api, setWeb3Api] =  useState({
    provider : null ,
    web3 : null
  })

  
  useEffect(() => 
  {
    const loadProvider = async () =>{
      //with metamaks we have access to window.ethereum & window.web3
      //metamask injects a global API into website
      //this API allows websites to request users, ccounts,read data to blockchain
      //sign messages

      //console.log(window.web3)
      //console.log(window.ethereum)
      let provider = null
      if(window.ethereum){
        provider = window.ethereum
        try{
          await provider.enable();
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

      setWeb3Api({
        web3: new Web3(provider),
        provider
      })

    }

    loadProvider()

    //array of dependencies , only run when something changes
    //if it's empty nothing to change
  } , [])

  console.log(web3Api)


  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <div className="balance-view is-size-2">
            Current Balance: <strong>10</strong> ETH
          </div>

          

          <button className="btn mr-2">Donate</button>
          <button className="btn">Withdraw</button>
        </div>
      </div>
    </>
  );
}

export default App;
