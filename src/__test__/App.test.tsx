import { cleanup, render, screen, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

import ThemeContext from "../context/themeContext";
import App from "../App";
import mockedAxios from "axios";
import { axiosGet, mockIntersectionObserver, coinSamples } from "../__mocks__/mockData";

/*
jest.mock('../../api/coinGeckoAPI', () => ({
    getCoinMarket: () => jest.fn()
        .mockImplementationOnce(() => {
            return true;
        })
        .mockImplementation(() => {
            return false;
        }),
}));

jest.unmock('../../api/coinGeckoAPI');
jest.mock('../../api/coinGeckoAPI');
*/


describe("Load App", () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    jest.setTimeout(5000 * 2);

    beforeEach(async () => {
        //Mock axios implementation 
        (mockedAxios.get as jest.Mock).mockImplementation(axiosGet);

        //IntersectionObserver isn't available in test environment;
        window.IntersectionObserver = mockIntersectionObserver();

        await act(async () => {
            const queryClient = new QueryClient();
            render(
                <ThemeContext>
                    <QueryClientProvider client={queryClient}>
                        <App />
                    </QueryClientProvider>
                </ThemeContext>
            );
        });

        await waitFor(() => {
            // Advance Loader to 100%
            jest.advanceTimersByTime(1100);
            // Advance Hiding Loader
            jest.advanceTimersByTime(800);
            // setTimeout should have been called
            expect(setTimeout).toHaveBeenCalled();
        });

    });
    afterEach(() => {
        cleanup();
    });

    it("display app components", async () => {
        //Should show NavBar
        expect(screen.getByTestId('NavBar')).toBeVisible();

        //Should show Top3Coins
        expect(screen.getByTestId('Top3Coins')).toBeVisible();

        //Should show SearchBar
        expect(screen.getByTestId('SearchBar')).toBeVisible();

        //Should show all coin
        expect(screen.getAllByTestId(/-row/)).toHaveLength(coinSamples.length);
    });

});