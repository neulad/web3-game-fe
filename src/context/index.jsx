import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { ethers } from "ethers";
import { ADDRESS, ABI } from "../contract";

import Web3Modal from "web3modal";
import { createEventListeners } from "./createEventListener";
import { useNavigate } from "react-router-dom";
import { GetParams } from "../utils/onboard";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [battleName, setBattleName] = useState("");
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState();
  const [gameData, setGameData] = useState({
    players: [],
    pendingBattles: [],
    activeBattle: null,
  });
  const [contract, setContract] = useState();
  const [showAlert, setShowAlert] = useState({
    status: false,
    type: "info",
    message: "",
  });
  const [updateGameData, setUpdateGameData] = useState(0);
  const [battleGround, setBattleGround] = useState("bg-astral");

  const player1Ref = useRef();
  const player2Ref = useRef();

  // Set current wallet address
  const updateCurrentWalletAddress = async (newAccounts) => {
    if (newAccounts) {
      console.log(newAccounts);
      setWalletAddress(newAccounts[0]);
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts) {
      setWalletAddress(accounts[0]);
    }
  };

  const setSmartcontractAndProvider = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const newProvider = new ethers.providers.Web3Provider(connection);
    const signer = newProvider.getSigner();
    const contract = new ethers.Contract(ADDRESS, ABI, signer);

    setProvider(newProvider);
    setContract(contract);
  };

  useEffect(() => {
    updateCurrentWalletAddress();
  }, []);

  useEffect(() => {
    if (step !== -1 && contract) {
      createEventListeners({
        navigate,
        contract,
        provider,
        walletAddress,
        setUpdateGameData,
        setShowAlert,
        player1Ref,
        player2Ref,
      });
    }
  }, [contract]);

  useEffect(() => {
    const resetParams = async () => {
      const currentStep = await GetParams();

      setStep(currentStep.step);
    };

    resetParams();
    window?.ethereum?.on("chainChanged", () => resetParams());
  }, []);

  useEffect(() => {
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({ status: false, type: "info", message: "" });
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showAlert]);

  useEffect(() => {
    const fetchGameData = async () => {
      const fetchedBattles = await contract.getAllBattles();
      const pendingBattles = fetchedBattles.filter(
        (battle) => battle.battleStatus === 0
      );
      let activeBattle = null;

      fetchedBattles.forEach((battle) => {
        if (
          battle.players.find(
            (player) => player.toLowerCase() === walletAddress.toLowerCase()
          )
        ) {
          if (battle.winner === "0x0000000000000000000000000000000000000000") {
            activeBattle = battle;
          }
        }
      });

      setGameData({
        pendingBattles: pendingBattles.slice(1),
        activeBattle,
      });
    };

    if (contract) fetchGameData();
  }, [contract, walletAddress, updateGameData]);

  useEffect(() => {
    const battleground = localStorage.getItem("battleground");

    if (battleground) {
      setBattleGround(battleground);
    } else {
      localStorage.setItem("battleground", battleGround);
    }
  }, []);

  useEffect(() => {
    setSmartcontractAndProvider();
    window.ethereum.on("accountsChanged", (newAccounts) =>
      updateCurrentWalletAddress(newAccounts)
    );

    return () => {
      window.ethereum.removeListener(
        "accountsChanged",
        updateCurrentWalletAddress
      );
    };
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const parsedErrorMesssage = errorMessage?.reason
        ?.slice("execution reverted: ".length)
        .slice(0, -1);

      if (parsedErrorMesssage) {
        setShowAlert({
          status: true,
          type: "failure",
          message: parsedErrorMesssage,
        });
      }
    }
  }, [errorMessage]);

  return (
    <GlobalContext.Provider
      value={{
        demo: "test",
        contract,
        walletAddress,
        showAlert,
        setShowAlert,
        battleName,
        setBattleName,
        gameData,
        battleGround,
        setBattleGround,
        updateCurrentWalletAddress,
        errorMessage,
        setErrorMessage,
        player1Ref,
        player2Ref,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
