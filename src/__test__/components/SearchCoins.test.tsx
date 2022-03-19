import { cleanup, render, screen, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

import ThemeContext from "../../context/themeContext";
import SearchCoins from "../../components/SearchCoins";
import userEvent from "@testing-library/user-event";
import delay from "../../utils/delay";
import * as api from "../../api/coinGeckoAPI";
import mockedAxios from "axios";
import { advanceLoading, axiosGet, mockIntersectionObserver, priceVolumeSample, coinSamples } from "../../__mocks__/mockData";


describe("Searching for Coins", () => {
    const renderComponent = () => act(async () => {
        const queryClient = new QueryClient();
        render(
            <ThemeContext>
                <QueryClientProvider client={queryClient}>
                    <SearchCoins />
                </QueryClientProvider>
            </ThemeContext>
        );
    });

    const expectInput = (): HTMLElement => {
        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('');
        expect(input).toHaveAttribute('placeholder', "Enter coin name...");
        return input;
    };

    //Increase Jest Timeout
    jest.setTimeout(5000 * 10);

    jest.useFakeTimers();
    const mocks: jest.SpyInstance[] = [jest.spyOn(global, 'setTimeout')];

    beforeEach(async () => {
        mocks.push(jest.spyOn(api, "searchCoin").mockImplementation(query => {
            if (query) {
                const ids = coinSamples.filter(c => c.id === query)
                    .reduce((prev, cur) => prev + cur.id + ',', '');
                return Promise.resolve(ids);
            }
            return Promise.resolve('');
        }));
        mocks.push(jest.spyOn(api, "getCoinData").mockImplementation(coinIds => {
            if (coinIds) {
                const ids = coinIds.split(',').filter(i => i);
                return Promise.resolve(coinSamples.filter(c => ids.includes(c.id)));
            }
            return Promise.resolve(coinSamples);

        }));
        mocks.push(jest.spyOn(api, "getCoinMarket").mockResolvedValue({ data: priceVolumeSample } as any));

        //IntersectionObserver isn't available in test environment;
        window.IntersectionObserver = mockIntersectionObserver();
    });
    afterEach(() => {
        jest.resetModules();
        cleanup();
    });

    // Testing with useFakeTimers 
    it("should search and return coin", async () => {
        /* 
        console.log({ jest: jest.getTimerCount() });
        */
        await renderComponent();

        // Advance Loading time
        await advanceLoading();
        //Should show 3 coins
        expect(screen.getAllByTestId(/-row/)).toHaveLength(coinSamples.length);

        //Mock debounce by calling callback directly with no delay
        const debounce = jest.requireActual("../../utils/debounce");
        const spyDebounce = jest.spyOn(debounce, "default").mockImplementation((
            (id: string, callback: () => void, delay: number = 500) => callback()) as any);
        //Simulate paste in search bar
        await waitFor(() => {
            userEvent.paste(expectInput(), coinSamples[0].id);
        });

        //Should have called debounce
        expect(spyDebounce).toHaveBeenCalled();
        spyDebounce.mockRestore();

        //Should have called Search API once
        expect(api.searchCoin).toBeCalledTimes(1);

        //Should show 1 coin
        expect(screen.getAllByTestId(/-row/)).toHaveLength(1);
    });

    // Testing with useRealTimers
    it("should test debounce when searching", async () => {
        //Restore API mocks
        mocks.forEach(mock => mock.mockRestore());

        //Switch to useRealTimers
        jest.useRealTimers();

        //Mock all Axios.get Implementation
        const axiosMock = (mockedAxios.get as jest.Mock).mockImplementation(axiosGet);

        //Render Component
        await renderComponent();

        //Wait for loading
        await act(async () => {
            await delay(1100 + 800);
        });

        //Should show 3 coins
        expect(screen.getAllByTestId(/-row/)).toHaveLength(coinSamples.length);

        //Should have called Axios.get once for initially fetching the 3 coins
        expect(mockedAxios.get).toBeCalledTimes(1);

        //Clean up mock's usage data between two assertions.
        axiosMock.mockClear();

        //Simulate type in search bar
        await waitFor(() => {
            userEvent.type(expectInput(), coinSamples[0].id);
        });

        //Wait for debounce
        await act(async () => {
            await delay(500);
        });

        //Wait for loading
        await act(async () => {
            await delay(1100 + 800);
        });

        //Should show 1 coin
        expect(screen.getAllByTestId(/-row/)).toHaveLength(1);

        //Should have called Axios.get:
        //1. Single search call after debounce
        //2. Fetching single coin data
        expect(mockedAxios.get).toBeCalledTimes(2);
    });
});