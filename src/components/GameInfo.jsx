import React, { useState } from "react";
import ReactTooltip from "react-tooltip";
import styles from "../styles";
import { useGlobalContext } from "../context";
import { CustomButton, PageHOC } from "../components";
import { alertIcon, gameRules } from "../assets";
import { useNavigate } from "react-router-dom";

const GameInfo = ({ player, playerIcon, mt }) => {
  const { contract, gameData, setErrorMessage, setShowAlert } =
    useGlobalContext();
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const navigate = useNavigate();
  const handleBattleExit = async () => {
    const battle = gameData.activeBattle.name;

    try {
      await contract.quitBattle(battle, { gasLimit: 200_000 });

      setShowAlert({
        status: true,
        type: "info",
        message: `You're quitting the ${battle} battle!`,
      });
    } catch (err) {
      setErrorMessage(err);
    }
  };

  return (
    <>
      <div className={styles.gameInfoIconBox}>
        <div
          className={`${styles.gameInfoIcon} ${styles.flexCenter}`}
          onClick={() => setToggleSidebar(true)}
        >
          <img src={alertIcon} alt="info" className={styles.gameInfoIconImg} />
        </div>
      </div>

      <div
        className={`${styles.gameInfoSidebar} ${
          toggleSidebar ? "translate-x-0" : "translate-x-full"
        } ${styles.glassEffect} ${styles.flexBetween} backdrop-blur-3xl`}
      >
        <div className="flex flex-col">
          <div className={styles.gameInfoSidebarCloseBox}>
            <div
              className={`${styles.flexCenter} ${styles.gameInfoSidebarClose}`}
              onClick={() => {
                setToggleSidebar(false);
              }}
            >
              X
            </div>
          </div>

          <h3 className={styles.gameInfoHeading}>Game Rules: </h3>
          <div className="mt-3">
            {gameRules.map((rule, index) => (
              <p
                key={`game-rule-index-` + index}
                className={styles.gameInfoText}
              >
                <span className="font-bold">{index + 1}</span>. {rule}
              </p>
            ))}
          </div>
        </div>

        <div className={`${styles.flexBetween} mt-10 gap-4 w-full`}>
          <CustomButton
            title="Change Battleground"
            handleClick={() => navigate("/battleground")}
          />
          <CustomButton title="Exit Battle" handleClick={handleBattleExit} />
        </div>
      </div>
    </>
  );
};

export default GameInfo;
