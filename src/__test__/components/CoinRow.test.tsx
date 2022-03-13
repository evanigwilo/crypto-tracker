import { cleanup, render, screen } from '@testing-library/react';

import numeral from 'numeral';

import mockedAxios from "axios";
import ThemeContext from '../../context/themeContext';
import CoinRow from "../../components/CoinRow";
import { axiosGet } from '../../__mocks__/mockData';

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

    it.todo("should show a coin row");

    it.todo("should show detailed graph when clicked");
});