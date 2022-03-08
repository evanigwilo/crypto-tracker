import axios, { AxiosError } from 'axios';
import { CoinDataTye, CoinMarketType, SearchCoinType } from '../types';

export const getCoinData = async (coinID = '', currentPage = 1, perPage = 20) => {
    /* 
        try {
    */
    const result = await axios.get<CoinDataTye[]>('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: perPage,
            page: currentPage,
            sparkline: true,
            ids: coinID /* 'bitcoin,ethereum,okb','tether' */
        },
        /*
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        }
        */
    }
    );
    return result.data;
    /*
    } catch (error) {
        const err = error as AxiosError;
        console.log(err.response?.data);
    }
    */
};
export const searchCoin = async (query: string) => {
    if (query.length < 1)
        return '';
    try {
        const result = await axios.get<{ coins: SearchCoinType[]; }>('https://api.coingecko.com/api/v3/search', {
            params: {
                query: query,
            }
        });
        const coins = result.data?.coins;

        return coins.filter(coin => coin.name.toLowerCase().startsWith(query))
            /* .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())) */
            .sort((a, b) => a.market_cap_rank - b.market_cap_rank)
            .slice(0, 20) // Select only first 20 result 
            .reduce((prev, cur) => prev + cur.id + ',', '');
    } catch (error) {
        return '';
    }
};
export const getCoinMarket = (coinID: string, onlyInfo: boolean = false) => {
    return axios.get<CoinMarketType>(`https://api.coingecko.com/api/v3/coins/${coinID}/${onlyInfo ? '' : 'market_chart'}`, {
        params: onlyInfo ? {
            localization: false,
            tickers: false,
            market_data: false,
            community_data: false,
            developer_data: false,
            sparkline: false,
        } : {
            vs_currency: "usd",
            days: 7,
        }
    });
};