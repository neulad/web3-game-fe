import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Home, CreateBattle, JoinBattle, Battle, BattleGround } from "./page";
import { GlobalContextProvider } from "./context";
import "./index.css";
import { OnboardModal } from "./components";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GlobalContextProvider>
      <OnboardModal />
      <Routes>
        <Route path="/web3-game" element={<Home />} />
        <Route path="/web3-game/create-battle" element={<CreateBattle />} />
        <Route path="/web3-game/join-battle" element={<JoinBattle />} />
        <Route path="/web3-game/battleground" element={<BattleGround />} />
        <Route path="/web3-game/battle/:battleName" element={<Battle />} />
      </Routes>
    </GlobalContextProvider>
  </BrowserRouter>
);
