import { useEffect, useState } from "react";
import Box from "@mui/material/Box";

import numeral from "numeral";

import NavBar from "./components/NavBar";

import { getCoinData } from "./api/coinGeckoAPI";

import Top3Coins from "./components/Top3Coins";
import SearchCoins from "./components/SearchCoins";
import { CoinDataTye } from "./types";
import Loader from "./components/Loader";

numeral.register("locale", "us", {
  delimiters: {
    thousands: ",",
    decimal: ".",
  },
  abbreviations: {
    thousand: "k",
    million: "M",
    billion: "B",
    trillion: "T",
  },
  ordinal: function (number) {
    return number === 1 ? "er" : "ème";
  },
  currency: {
    symbol: "$",
  },
});
// switch between locales
numeral.locale("us");

function App() {
  const [coinData, setCoinData] = useState<CoinDataTye[]>();

  useEffect(() => {
    getCoinData().then((data) => setCoinData(data));
  }, []);

  const style: React.CSSProperties = {
    position: "absolute",
    height: "100%",
    width: "100%",
    display: "grid",
    placeItems: "center",
  };

  return (
    <Loader hideProgress={coinData !== undefined} style={style}>
      <Box sx={{ flexGrow: 1, overflow: "hidden" }}>

        <NavBar />

        {
          coinData && (
            <div
              data-testid="Top3Coins"
              style={{
                display: "flex",
                justifyContent: "center",
                height: "215px",
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
    </Loader >
  );
}

export default App;
