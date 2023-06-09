import React, { useEffect, useState } from "react";
import styles from "../styles";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";
import { CustomButton, CustomInput, GameLoad, PageHOC } from "../components";

const CreateBattle = () => {
  const navigate = useNavigate();
  const { contract, walletAddress, battleName, setBattleName, gameData } =
    useGlobalContext();
  const [waitBattle, setWaitBattle] = useState(false);

  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 1) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    } else if (gameData?.activeBattle?.battleStatus === 0) {
      setWaitBattle(false);
    }
  }, [gameData, walletAddress]);

  const handleClick = async () => {
    if (!battleName || !battleName.trim()) return;

    try {
      await contract.createBattle(battleName, { gasLimit: 200_000 });

      setWaitBattle(true);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      {waitBattle && <GameLoad />}
      <div className="flex flex-col mb-5">
        <CustomInput
          label="battle"
          placeholder="Enter battle name"
          value={battleName}
          handleValueChange={setBattleName}
        />

        <CustomButton
          title="Create Battle"
          handleClick={handleClick}
          restStyles="mt-6"
        />
      </div>

      <p className={styles.infoText} onClick={() => navigate("/join-battle")}>
        Or joing existing battles
      </p>
    </>
  );
};

export default PageHOC(
  CreateBattle,
  <>
    Create <br /> a new battle
  </>,
  <>Start your own battle with online players</>
);
