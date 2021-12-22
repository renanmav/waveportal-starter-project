import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import WavePortalJson from "./utils/WavePortal.json"

export default function App() {
  const [currentAccount, setCurrentAccount] = React.useState("")
  const contractAddress = "0xA1276a4Be4D8E39cfd352f08754b9236B086afEc"
  const contractABI = WavePortalJson.abi

  async function checkIfWalletIsConnected() {
    try {
      const { ethereum } = window;

      if(!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      } else {
        console.log("We have the ethereum object ", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" })

      if(accounts.length !== 0) {
        const account = accounts[0]
        console.log("Found an authorized account: ", account)
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (err) {
      console.log(err)
    }
  }

  React.useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  async function connectWallet() {
    try {
      const { ethereum } = window;

      if(!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Total # of waves is: ", count.toNumber());

        const waveTxn = await wavePortalContract.wave();
        await waveTxn.wait();
        console.log("Mined --", waveTxn.hash);
        
        count = await wavePortalContract.getTotalWaves();
        console.log("Total # of waves is: ", count.toNumber());
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch(error){
      console.log(error);
    }
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
