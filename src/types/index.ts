export type CoinDataTye = {
    id: string,
    symbol: string,
    name: string,
    image: string,
    current_price: number,
    market_cap: number,
    market_cap_rank: number,
    total_volume: number,
    price_change_percentage_24h: number,
    sparkline_in_7d: {
        price: number[];
    };
};

export type SearchCoinType = {
    id: string,
    name: string,
    market_cap_rank: number,
};

export type AxiosConfigType = {
    params: {
        ids: string,
        query: string,
    },
};

export type DescriptionType = {
    description: {
        en: string,
    };
};

export type PriceVolumeType = {
    prices: number[][],
    market_caps: number[][],
    total_volumes: number[][],
};

export type CoinMarketType = DescriptionType & PriceVolumeType;

