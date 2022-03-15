import { cleanup, render, screen, waitFor, act, fireEvent } from "@testing-library/react/";
import { QueryClient, QueryClientProvider } from "react-query";

import ThemeContext from "../../context/themeContext";
import CoinGrid from "../../components/CoinGrid";
import mockedAxios from "axios";
import { advanceLoading, axiosGet, mockIntersectionObserver, coinSamples } from "../../__mocks__/mockData";
/*
import * as observer from 'react-intersection-observer';

import { useInView } from 'react-intersection-observer';
jest.mock('react-intersection-observer');
*/

describe("Coins Fetched", () => {

    // Use FakeTimers
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');

    beforeEach(async () => {
        //Mock all Axios.get Implementation
        (mockedAxios.get as jest.Mock).mockImplementation(axiosGet);

        /*
        jest.spyOn(observer, "useInView").mockImplementation(() => {
            return (
                {
                    ref: () => { },
                    inView: true,
                }
            );
        }
        );

        (useInView as jest.Mock).mockImplementation(() => ({
            ref: () => { },
            inView: true,
        }));
        */

        //IntersectionObserver isn't available in test environment;
        window.IntersectionObserver = mockIntersectionObserver();

        await act(async () => {
            const queryClient = new QueryClient();
            const coinIds = coinSamples.reduce((prev, cur) => prev + cur.id + ',', '');

            render(
                <ThemeContext>
                    <QueryClientProvider client={queryClient}>
                        <CoinGrid coinIds={coinIds} />
                    </QueryClientProvider>
                </ThemeContext>
            );
        });

        // Advance Loding time
        await advanceLoading();
    });

    afterEach(() => {
        (mockedAxios.get as jest.Mock).mockClear();
        cleanup();
    });

    it("should fetch first page", async () => {
        //Should show 3 coins
        expect(screen.getAllByTestId(/-row/)).toHaveLength(coinSamples.length);

        //Should have called Axios.get once for initially fetching the 3 coins
        expect(mockedAxios.get).toBeCalledTimes(1);
    });

    it("should fetch second page", async () => {
        // Mock fetching button should be hidden
        const mockButton = screen.getByTestId("mock-fetch");
        expect(mockButton).not.toBeVisible();

        // Fetch next data
        await waitFor(() => {
            fireEvent.click(mockButton);
        });

        //Should show 6 coins
        expect(screen.getAllByTestId(/-row/)).toHaveLength(coinSamples.length * 2);

        //Should have called Axios.get:
        //1. For initially fetching the 3 coins
        //2. For fetching the next 3 coins
        expect(mockedAxios.get).toBeCalledTimes(2);
    });
});