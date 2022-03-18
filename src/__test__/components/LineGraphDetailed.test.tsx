import { cleanup, render, screen, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";

import mockedAxios from "axios";
import ThemeContext from "../../context/themeContext";
import LineGraphDetailed from "../../components/LineGraphDetailed";
import { axiosGet, advanceLoading, mockResizeObserver, coinSamples } from "../../__mocks__/mockData";
/*
import * as reactQuery from 'react-query'; 
*/

describe("Detailed Graph", () => {
    // Use FakeTimers
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');

    // Using mock data
    const coinInfo = coinSamples[0];

    const renderComponent = async () => {
        //Render Component
        await act(async () => {
            const queryClient = new QueryClient();
            render(
                <ThemeContext>
                    <QueryClientProvider client={queryClient}>
                        <LineGraphDetailed coinName={coinInfo.name} coinID={coinInfo.id} />
                    </QueryClientProvider>
                </ThemeContext>
            );
        });
        // Advance Loding time
        await advanceLoading();
    };


    beforeEach(async () => {
        //Mock all Axios.get Implementation
        (mockedAxios.get as jest.Mock).mockImplementation(axiosGet);

        //Mock Resize Observer
        mockResizeObserver();
    });
    afterEach(() => {
        cleanup();
    });

    it("should show error", async () => {
        const reactQuery = jest.requireActual("react-query");
        const spyReactQuery = jest.spyOn(reactQuery, "useQuery");
        spyReactQuery.mockImplementation(() => ({ error: Error("Mock Error") }));

        await renderComponent();

        const error = screen.getByText("Mock Error");
        expect(error).toBeVisible();

        spyReactQuery.mockRestore();
        jest.resetModules();

        //Expect no API call
        expect(mockedAxios.get).toBeCalledTimes(0);
    });

    it("should show graph", async () => {
        await renderComponent();
        const graph = screen.getByTestId(coinInfo.id + '-graph-detail');
        expect(graph).toBeVisible();

        //Expect 1 API call
        expect(mockedAxios.get).toBeCalledTimes(1);
    });
});
