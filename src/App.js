import React, { useState, useEffect } from "react";
import AddressBar from "./AddressBar"; // Import AddressBar component
import { ethers } from "ethers";
import BYNR from "./boyner.png"; // Assuming you have a MetaMask icon file
import EPIC from "./epic.png";
import THY from "./thy.png";
import MIGROS from "./migros.png";
import OPET from "./opet.png";
import Rewardlet from "./rewardlet.png";

const App = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [fromAsset, setFromAsset] = useState("");
  const [toAsset, setToAsset] = useState("");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [balance, setBalance] = useState({});

  // List of available assets based on the smart contract
  const availableAssets = ["REWARD", "THY", "BYNR", "OPET", "EPIC", "MIGROS"];
  const assetsForBalances = ["THY", "BYNR", "OPET", "EPIC", "MIGROS"];

  const assetLogos = {
    BYNR: BYNR,
    EPIC: EPIC,
    THY: THY,
    MIGROS: MIGROS,
    OPET: OPET,
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
    }
  }, []);

  const connectMetaMask = async () => {
    if (provider) {
      try {
        setIsConnecting(true);
        const newSigner = await provider.getSigner();
        setSigner(newSigner);
        const userAccount = await newSigner.getAddress();
        setAccount(userAccount);

        const contractAddress = "0xB5e19B8011c4525464bFb1E0bec4E22c69C33A80"; // Replace with your contract address
        const contractABI = [
          {
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "allowance",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "needed",
                type: "uint256",
              },
            ],
            name: "ERC20InsufficientAllowance",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "sender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "balance",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "needed",
                type: "uint256",
              },
            ],
            name: "ERC20InsufficientBalance",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "approver",
                type: "address",
              },
            ],
            name: "ERC20InvalidApprover",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "receiver",
                type: "address",
              },
            ],
            name: "ERC20InvalidReceiver",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "ERC20InvalidSender",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
            ],
            name: "ERC20InvalidSpender",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "Approval",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "Transfer",
            type: "event",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "approve",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "string",
                name: "asset",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "setBalance",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "string",
                name: "fromAsset",
                type: "string",
              },
              {
                internalType: "string",
                name: "toAsset",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "swap",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "transfer",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "sender",
                type: "address",
              },
              {
                internalType: "address",
                name: "recipient",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "transferFrom",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
            ],
            name: "allowance",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "balanceOf",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            name: "balances",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            name: "convertRates",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "decimals",
            outputs: [
              {
                internalType: "uint8",
                name: "",
                type: "uint8",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "string",
                name: "asset",
                type: "string",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "getAssetBalance",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "string",
                name: "fromAsset",
                type: "string",
              },
              {
                internalType: "string",
                name: "toAsset",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "getConversionAmount",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "name",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            name: "ownerAccounts",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "symbol",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "totalSupply",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ];

        const newContract = new ethers.Contract(
          contractAddress,
          contractABI,
          newSigner
        );
        setContract(newContract);
        await updateBalances(newContract, userAccount);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        alert("Failed to connect to MetaMask: " + error.message);
      } finally {
        setIsConnecting(false);
      }
    }
  };

  const updateBalances = async (contract, account) => {
    try {
      const newBalances = {};
      for (const asset of availableAssets) {
        const balance = await contract.getAssetBalance(asset, account);
        newBalances[asset] = balance;
      }
      setBalance(newBalances);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  const calculateConversion = async () => {
    if (contract && fromAsset && toAsset && amount) {
      try {
        const amountInWei = ethers.parseUnits(amount, 18);
        const converted = await contract.getConversionAmount(
          fromAsset,
          toAsset,
          amountInWei
        );
        setConvertedAmount(ethers.formatUnits(converted, 18));
      } catch (error) {
        console.error("Error calculating conversion:", error);
        setConvertedAmount("");
      }
    } else {
      setConvertedAmount("");
    }
  };

  useEffect(() => {
    calculateConversion();
  }, [fromAsset, toAsset, amount]);

  const swapAssets = async () => {
    if (!contract || !fromAsset || !toAsset || !amount) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setIsSwapping(true);
      const amountInAsset = amount;

      // For testing, you can set some balance first
      // await contract.setBalance(fromAsset, amountInWei);

      const tx = await contract.swap(fromAsset, toAsset, amountInAsset);
      await tx.wait();
      alert("Swap completed successfully!");
      await updateBalances(contract, account);

      // Reset form
      setAmount("");
      setConvertedAmount("");
    } catch (error) {
      console.error("Error during swap:", error);
      alert("Failed to complete swap: " + error.message);
    } finally {
      setIsSwapping(false);
    }
  };

  const styles = {
    container: {
      maxWidth: "600px",
      margin: "20px auto",
      padding: "20px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      borderRadius: "8px",
      backgroundColor: "white",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      marginTop: "20px",
    },
    select: {
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ddd",
      fontSize: "16px",
    },
    input: {
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ddd",
      fontSize: "16px",
      appearance: "none",
      MozAppearance: "textfield",
    },
    button: {
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      width: "100%",
      marginTop: "10px",
      fontSize: "16px",
    },
    alert: {
      backgroundColor: "#f8f9fa",
      padding: "15px",
      borderRadius: "4px",
      marginBottom: "15px",
      border: "1px solid #dee2e6",
    },
    balances: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
      gap: "10px",
      marginTop: "20px",
    },
    balanceItem: {
      backgroundColor: "#f8f9fa",
      padding: "10px",
      borderRadius: "4px",
      textAlign: "center",
      fontSize: "14px",
    },
    conversionInfo: {
      backgroundColor: "#e9ecef",
      padding: "10px",
      borderRadius: "4px",
      marginTop: "10px",
      textAlign: "center",
    },
    reward: {
      fontSize: "28px",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      backgroundColor: "#fff",
      padding: "15px",
      borderRadius: "8px",
      textAlign: "center",
      border: "2px solid #ffa500",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
  };

  return (
    <div style={styles.container}>
      <h2
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <img
          src={Rewardlet}
          alt="Rewardlet"
          style={{
            width: "50px",
            height: "50px",
            marginRight: "8px",
            scale: "contain",
          }}
        />
        Rewardlet
      </h2>

      {!provider ? (
        <div style={styles.alert}>
          MetaMask is not installed. Please install MetaMask to use this
          application.
        </div>
      ) : (
        <>
          {!account ? (
            <button
              onClick={connectMetaMask}
              disabled={isConnecting}
              style={styles.button}
            >
              {isConnecting ? "Connecting..." : "Connect to MetaMask"}
            </button>
          ) : (
            <div>
              <div style={{ padding: "20px" }}>
                <AddressBar address={account} />
              </div>
              <div style={styles.reward}>
                {parseFloat(balance["REWARD"] || "0").toFixed(4)}{" "}
                <span>REWARD</span>
              </div>

              <div style={styles.balances}>
                {assetsForBalances.map((asset) => (
                  <div key={asset} style={styles.balanceItem}>
                    <img
                      src={assetLogos[asset] || THY} // Use a default logo if the asset is not found
                      alt={asset}
                      style={{
                        width: "24px",
                        height: "24px",
                        marginRight: "8px",
                        objectFit: "contain", // Ensures the image scales while preserving its aspect ratio
                      }}
                    />

                    <div>
                      <strong>{asset}</strong>
                    </div>
                    <div>{parseFloat(balance[asset] || "0").toFixed(4)}</div>
                  </div>
                ))}
              </div>

              <div style={styles.form}>
                <select
                  value={fromAsset}
                  onChange={(e) => setFromAsset(e.target.value)}
                  style={styles.select}
                >
                  <option value="">From</option>
                  {availableAssets.map((asset) => (
                    <option key={asset} value={asset}>
                      {asset}
                    </option>
                  ))}
                </select>

                <select
                  value={toAsset}
                  onChange={(e) => setToAsset(e.target.value)}
                  style={styles.select}
                >
                  <option value="">To</option>
                  {availableAssets
                    .filter((asset) => asset !== fromAsset)
                    .map((asset) => (
                      <option key={asset} value={asset}>
                        {asset}
                      </option>
                    ))}
                </select>

                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  style={styles.input}
                />

                {convertedAmount && (
                  <div style={styles.conversionInfo}>
                    You will receive: {parseFloat(convertedAmount).toFixed(4)}{" "}
                    {toAsset}
                  </div>
                )}

                <button
                  onClick={swapAssets}
                  disabled={isSwapping || !fromAsset || !toAsset || !amount}
                  style={{
                    ...styles.button,
                    opacity:
                      isSwapping || !fromAsset || !toAsset || !amount ? 0.7 : 1,
                    backgroundColor:
                      isSwapping || !fromAsset || !toAsset || !amount
                        ? "#ccc"
                        : "#ffa500",
                  }}
                >
                  {isSwapping ? "Swapping..." : "Swap Assets"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
