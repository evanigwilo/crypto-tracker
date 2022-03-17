import { cleanup, render, screen, act } from '@testing-library/react';

import numeral from 'numeral';

import mockedAxios from "axios";
import ThemeContext from '../../context/themeContext';
import CoinRow from "../../components/CoinRow";
import { axiosGet, coinSamples } from '../../__mocks__/mockData';

describe("Coin Rows", () => {

    numeral.register('locale', 'us', {
        delimiters: {
            thousands: ',',
            decimal: '.'
        },
        abbreviations: {
            thousand: 'k',
            million: 'M',
            billion: 'B',
            trillion: 'T'
        },
        ordinal: function (number) {
            return number === 1 ? 'er' : 'ème';
        },
        currency: {
            symbol: '$'
        }
    });
    // switch between locales
    numeral.locale('us');

    // Using mock data
    const coinInfo = coinSamples[0];

    beforeEach(() => {
        //Mock all Axios.get Implementation
        (mockedAxios.get as jest.Mock).mockImplementation(axiosGet);
    });
    afterEach(() => {
        //Restore API mocks
        jest.clearAllMocks();
        cleanup();
    });

    it("should show header", () => {
        //Render a row
        render(
            <ThemeContext>
                <CoinRow />
            </ThemeContext>
        );

        //Expect headers to be visible
        const headerTitles: HTMLElement[] = [];
        headerTitles.push(screen.getByText('#'));
        headerTitles.push(screen.getByText('Coin'));
        headerTitles.push(screen.getByText('Price'));
        headerTitles.push(screen.getByText('Market Cap'));
        headerTitles.push(screen.getByText('Total Volume'));
        headerTitles.push(screen.getByText('24h %'));
        headerTitles.push(screen.getByText('Last 7d Price Change'));

        headerTitles.forEach(title => expect(title).toBeVisible);

        //Expect no API call
        expect(mockedAxios.get).toBeCalledTimes(0);
    });

    it("should show a coin row", async () => {
        //Render a row
        await act(async () => {
            render(
                <ThemeContext>
                    <CoinRow coinInfo={coinInfo} />
                </ThemeContext>
            );
        });

        //Expect image to be visible
        const altSymbol = screen.queryByAltText(coinInfo.symbol);
        const altName = screen.queryByAltText(coinInfo.name);
        expect(altSymbol || altName).toHaveAttribute('src', coinInfo.image);

        //Expect the correct price change icon to be visible
        const changePercent24h = numeral(coinInfo.price_change_percentage_24h).format('0.00');
        if (parseFloat(changePercent24h) >= 0) {
            const upIcon = screen.getByTestId(/ArrowDropUpIcon/i);
            expect(upIcon).toBeVisible();
        } else {
            const downIcon = screen.getByTestId(/ArrowDropDownIcon/i);
            expect(downIcon).toBeVisible();
        }

        const rowValues: HTMLElement[] = [];
        rowValues.push(screen.getByText(coinInfo.market_cap_rank + '.'));
        rowValues.push(screen.getByText(numeral(coinInfo.market_cap).format('0.00a')));
        rowValues.push(screen.getByText(numeral(coinInfo.total_volume).format('0.00a')));
        rowValues.push(screen.getByText(changePercent24h));
        rowValues.push(screen.getByTestId(coinInfo.id + '-graph'));

        rowValues.forEach(value => expect(value).toBeVisible);

        // Check for price dislay based on format, and should display only one price
        const priceA = screen.queryByText(numeral(coinInfo.current_price).format('$0,0.00'));
        const priceB = screen.queryByText(numeral(coinInfo.current_price).format('0.00a'));
        priceA && expect(priceA).toBeVisible();
        priceB && expect(priceB).toBeVisible();
        expect(priceA && priceB).toBeFalsy();

        //Expect no API call for LineGraph
        expect(mockedAxios.get).toBeCalledTimes(0);
    });

    it.todo("should show detailed graph when clicked");
});