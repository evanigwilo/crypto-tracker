import { useEffect, useState } from "react";
import Box from "@mui/material/Box";

import NavBar from "./components/NavBar";

import { getCoinData } from "./api/coinGeckoAPI";

import Top3Coins from "./components/Top3Coins";
import SearchCoins from "./components/SearchCoins";
import { CoinDataTye } from "./types";

function App() {
  const [coinData, setCoinData] = useState<CoinDataTye[]>();

  useEffect(() => {
    getCoinData().then((data) => setCoinData(data));
  }, []);

  return (
    <Box sx={{ flexGrow: 1, overflow: "hidden" }}>

      <NavBar />

      {
        coinData && (
          <div
            data-testid="Top3Coins"
            style={{
              display: "flex",
              justifyContent: "center",
              height: "275px",
              position: "relative",
            }}
          >
            <Top3Coins position="left" coinInfo={coinData[1]} />
            <Top3Coins coinInfo={coinData[0]} />
            <Top3Coins position="right" coinInfo={coinData[2]} />
          </div>
        )
      }

      <SearchCoins />

    </Box>
  );
}

export default App;
