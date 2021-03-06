import { CoinDataTye, AxiosConfigType, DescriptionType, PriceVolumeType } from "../types";
import { waitFor } from "@testing-library/react";

const sparkline_in_7d = {
    "price": [
        40455.23665815623,
        40521.23221627563,
        40413.61655528863,
        40464.02922206458,
        40421.93435923091,
        40198.14473341098,
        40131.09665898426,
        40365.126203297885,
        40354.093910267635,
        40242.65376144557,
        40139.16269627748,
        39739.11925622209,
        39787.921134376404,
        39803.12486023709,
        39838.28097767352,
        39868.516783302366,
        38779.594390689,
        38986.26931006573,
        39051.94502819549,
        38985.512178448975,
        38952.694405370916,
        38997.99659759304,
        38982.92304147581,
        39051.122242336205,
        39413.20792218891,
        39379.961810664645,
        39382.37542331801,
        39264.21692463359,
        39480.453705583706,
        40254.996598849946,
        40683.81187479273,
        40700.6642687578,
        40717.522619994095,
        40829.35729086868,
        40887.73078744173,
        40833.5379650337,
        40903.09544127843,
        40805.90331909912,
        40676.401833812546,
        40724.79997580154,
        40871.18865734174,
        40710.36469539432,
        40772.30758656391,
        40670.419228623265,
        40753.0427173262,
        40645.731265218106,
        40771.47594082995,
        40774.029228923566,
        40997.694520011195,
        41381.63440076333,
        41602.00541791229,
        41480.81541326771,
        41363.551613475705,
        41316.229074761766,
        41398.49960954603,
        41313.05839370305,
        41303.73287410265,
        41332.03224032712,
        41424.506606684474,
        41498.12244669832,
        41355.744546037386,
        41382.588414759244,
        41381.757760112996,
        41401.381838143665,
        41342.17307170415,
        41437.26760910667,
        41458.43320759279,
        41365.73376164842,
        41520.55496691223,
        41589.890499264155,
        41830.33548180861,
        42004.49863668162,
        42127.85582858828,
        41600.54228853748,
        41458.5084143636,
        41284.923660789565,
        41389.22287682996,
        41369.54897096751,
        40983.01311833181,
        41219.08808990012,
        41437.34570362472,
        41529.35246090751,
        41498.59604332418,
        41395.06653501401,
        41555.61187973008,
        41699.057490247746,
        41640.39228338689,
        41675.23962130542,
        41618.85148827522,
        41490.85189498064,
        41555.78863506181,
        41921.83019958124,
        41896.03431651688,
        41825.00419550746,
        42342.65428147616,
        42483.449871709876,
        42736.0131595036,
        42646.69422998847,
        42472.22110484879,
        42123.543381944044,
        41927.99498889407,
        41582.35127678326,
        41535.919162818354,
        41320.202237803394,
        40701.25028798833,
        40759.36637555765,
        40351.572487267236,
        40528.54148675958,
        40430.87301981874,
        40540.98779817924,
        40498.16608604903,
        40550.87403324272,
        40623.155557459955,
        40667.360837760985,
        40688.513054036026,
        40665.95373976488,
        40416.52010640735,
        40320.9449603651,
        40448.50738915761,
        40575.76509412617,
        40429.02320346442,
        40325.363427456585,
        39919.47467560661,
        39413.396613485435,
        39404.73609885122,
        39396.30073132532,
        39512.63752885014,
        39565.44786723914,
        39642.550699505315,
        39629.46660933603,
        39721.67732043213,
        39756.848993471016,
        39614.825707748016,
        39598.18604843851,
        39480.493787598854,
        39519.37830195697,
        39555.762374375634,
        39591.86429706561,
        39624.879744985126,
        39587.33618311677,
        39645.04896489609,
        39542.186403363834,
        39639.510185852836,
        39628.91978394624,
        39711.40221976155,
        39710.64353191374,
        39721.987826494464,
        39810.6738505409,
        39902.15681104142,
        39826.50682258243,
        39708.032812710444,
        39794.739469305634,
        39848.555782230294,
        39965.64029066706,
        39883.62057292186,
        39555.127522961484,
        39634.35749583104,
        39554.33090548626,
        39607.69013553075,
        39800.92829552194,
        39735.25701713998,
        39715.99921054646,
        39774.948250194175,
        39800.73725722634,
        39779.157294846176,
        39798.8055695275,
        39732.40081642796
    ]
};
export const coinSamples: CoinDataTye[] = [
    {
        id: "bitcoin",
        symbol: "btc",
        name: "Bitcoin",
        image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
        current_price: 40857,
        market_cap: 776564770639,
        market_cap_rank: 1,
        total_volume: 31791252072,
        price_change_percentage_24h: 1.63983,
        sparkline_in_7d: { ...sparkline_in_7d },
    },
    {
        id: "ethereum",
        symbol: "eth",
        name: "Ethereum",
        image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
        current_price: 3045.3,
        market_cap: 366756728379,
        market_cap_rank: 2,
        total_volume: 18773679891,
        price_change_percentage_24h: -0.17101,
        sparkline_in_7d: { ...sparkline_in_7d },
    },
    {
        id: "tether",
        symbol: "usdt",
        name: "Tether",
        image: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
        current_price: 1.0,
        market_cap: 82747999720,
        market_cap_rank: 3,
        total_volume: 63895438419,
        price_change_percentage_24h: 0.06276,
        sparkline_in_7d: { ...sparkline_in_7d },
    },
];

export const priceVolumeSample: PriceVolumeType = {
    prices: [
        [1649689364661, 40890.6825226845],
        [1649692915509, 40755.512732333766],
        [1649696404733, 40845.855711313474],
        [1649700259418, 40547.99917123209],
        [1649703632125, 40537.68140120643],
        [1649707266467, 39988.60625834187],
        [1649710911975, 40044.75633283267],
        [1649714547050, 39540.41771207361],
        [1649718149148, 39897.096195862105],
        [1649721739644, 39552.83022503967],
    ],
    market_caps: [
        [1649689364661, 777284564236.5536],
        [1649692915509, 777944403483.1462],
        [1649696404733, 775156153816.2202],
        [1649700259418, 770774888845.9922],
        [1649703632125, 770468734890.9481],
        [1649707266467, 760144416079.977],
        [1649710911975, 761212254786.8005],
        [1649714547050, 751944524055.6963],
        [1649718149148, 758407612017.0889],
        [1649721739644, 752040698264.7866],
    ],
    total_volumes: [
        [1649772152414, 31395822306.61222],
        [1649775707173, 31628667080.650578],
        [1649779393228, 32183707741.705727],
        [1649782905202, 31687595515.839638],
        [1649786634028, 30997366051.644073],
        [1649790050351, 31028522357.489147],
        [1649793717972, 30166273746.13973],
        [1649797422544, 29404306165.590477],
        [1649801013950, 28969619286.77249],
        [1649804616013, 27911298195.52635],
    ],
};

export const descriptionSample: DescriptionType = {
    description: {
        en: `Ethereum is a <a href=\"https://www.coingecko.com/en?category_id=29&view=market\">smart contract platform</a> that enables developers to build tokens and decentralized applications (dapps). 
            ETH is the native currency for the Ethereum platform and also works as the transaction fees to miners on the Ethereum network.\r\n\r\nEthereum is the pioneer for blockchain based smart contracts.`,
    },
};


export const axiosGet = (url: string, config: AxiosConfigType) => {
    switch (url) {
        // getCoinData
        case "https://api.coingecko.com/api/v3/coins/markets":
            if (config.params.ids) {
                const ids = config.params.ids.split(",").filter(id => id);
                return { data: coinSamples.filter((c) => ids.includes(c.id)) };
            }
            return { data: coinSamples };
        // getCoinMarket
        case `https://api.coingecko.com/api/v3/coins/${coinSamples[0].id}/market_chart`:
        case `https://api.coingecko.com/api/v3/coins/${coinSamples[1].id}/market_chart`:
        case `https://api.coingecko.com/api/v3/coins/${coinSamples[2].id}/market_chart`:
            return Promise.resolve({ data: priceVolumeSample });
        case `https://api.coingecko.com/api/v3/coins/${coinSamples[0].id}/`:
        case `https://api.coingecko.com/api/v3/coins/${coinSamples[1].id}/`:
        case `https://api.coingecko.com/api/v3/coins/${coinSamples[2].id}/`:
            return Promise.resolve({ data: descriptionSample });
        // searchCoin
        case "https://api.coingecko.com/api/v3/search":
            if (config.params.query) {
                return Promise.resolve({
                    data: {
                        coins: coinSamples.filter(c => c.id === config.params.query),
                    },
                });
            }
            return Promise.resolve({
                data: {
                    coins: [],
                },
            });
        default:
            return Promise.reject(new Error("not found"));
    }
};

export const mockIntersectionObserver = () =>
    jest.fn().mockReturnValue({
        observe: () => null,
        unobserve: () => null,
        disconnect: () => null,
    });

export const advanceLoading = () =>
    waitFor(() => {
        // Advance Loader to 100%
        jest.advanceTimersByTime(1100);
        // Advance Hiding Loader
        jest.advanceTimersByTime(800);
        // setTimeout should have been called
        expect(setTimeout).toHaveBeenCalled();
    });

export const mockResizeObserver = () =>
    Object.defineProperty(global, "ResizeObserver", {
        writable: true,
        value: jest.fn().mockImplementation(() => ({
            observe: jest.fn(() => "Mocking works"),
            unobserve: jest.fn(),
            disconnect: jest.fn(),
        })),
    });
