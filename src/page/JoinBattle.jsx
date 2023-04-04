import React, { useEffect } from "react";
import { CustomButton, PageHOC } from "../components";
import styles from "../styles";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";

const JoinBattle = () => {
  const {
    contract,
    gameData,
    setShowAlert,
    battleName,
    setBattleName,
    walletAddress,
  } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 1)
      navigate(`/battle/${gameData.activeBattle.name}`);
  }, [gameData]);

  const handleClick = async (battleName) => {
    setBattleName(battleName);

    try {
      await contract.joinBattle(battleName, { gasLimit: 200_000 });

      setShowAlert({
        status: true,
        type: "success",
        message: `Join to ${battleName} is in progress`,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h2 className={styles.joinHeadText}>Available Battles: </h2>
      <div className={styles.joinContainer}>
        {gameData.pendingBattles.length ? (
          gameData.pendingBattles
            .filter((battle) => !battle.players.includes(walletAddress))
            .map((battle, index) => (
              <div key={battle.name + index} className={styles.flexBetween}>
                <p className={styles.joinBattleTitle}>
                  {index + 1}. {battle.name}
                </p>
                <CustomButton
                  title="Join"
                  handleClick={() => {
                    handleClick(battle.name);
                  }}
                />
              </div>
            ))
        ) : (
          <p className={styles.joinLoading}>
            No battles yet, you can create your own!
          </p>
        )}
      </div>

      <p className={styles.infoText} onClick={() => navigate("/create-battle")}>
        Or create a new battle
      </p>
    </>
  );
};

export default PageHOC(
  JoinBattle,
  <>
    Join <br /> a Battle
  </>,
  <>Check the list of the pending battles</>
);
