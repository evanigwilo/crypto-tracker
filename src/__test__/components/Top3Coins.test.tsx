import { cleanup, render, screen, waitFor, act, fireEvent } from '@testing-library/react';
/* 
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
*/
import mockedAxios from "axios";
import ThemeContext from '../../context/themeContext';
import Top3Coins from "../../components/Top3Coins";
import { axiosGet, descriptionSample, coinSamples } from '../../__mocks__/mockData';

describe("Top coins by market rank", () => {
    const response = descriptionSample.description.en.replace(/<\/?[^>]+(>|$)/g, "");

    const expectSelectCoin = async (container: HTMLElement) => {
        expect(container.textContent).not.toContain(response);

        const select = container.getElementsByClassName('selected');
        expect(select).toHaveLength(1);

        await waitFor(() => {
            fireEvent.mouseEnter(select[0]);
            expect(container.textContent).toContain(response);
        });
        /*
        console.log(container.textContent);
        screen.debug(container);
        */
    };

    const testExpects = (index: number) => {
        const altSymbol = screen.getByAltText(coinSamples[index].symbol);
        expect(altSymbol).toHaveAttribute('src', coinSamples[index].image);

        const symbol = screen.getByText(coinSamples[index].symbol);
        expect(symbol).toBeVisible();

        const marketRank = screen.getByText(coinSamples[index].market_cap_rank + '.');
        expect(marketRank).toBeVisible();
    };

    beforeEach(() => {
        //Mock all Axios.get Implementation
        (mockedAxios.get as jest.Mock).mockImplementation(axiosGet);
    });

    afterEach(() => {
        //Expect single API call
        expect(mockedAxios.get).toBeCalledTimes(1);
        cleanup();
    });

    it("should show left coin", async () => {
        await act(async () => {
            const { container } = render(
                <ThemeContext>
                    <Top3Coins position='left' coinInfo={coinSamples[1]} />
                </ThemeContext>
            );
            await expectSelectCoin(container);
        });

        testExpects(1);
    });

    it("should show center coin", async () => {
        await act(async () => {
            const { container } = render(
                <ThemeContext>
                    <Top3Coins coinInfo={coinSamples[0]} />
                </ThemeContext>
            );
            await expectSelectCoin(container);
        });

        testExpects(0);
    });

    it("should show right coin", async () => {
        await act(async () => {
            const { container } = render(
                <ThemeContext>
                    <Top3Coins position='right' coinInfo={coinSamples[2]} />
                </ThemeContext>
            );
            await expectSelectCoin(container);
        });

        testExpects(2);
    });
});
