import { cleanup, render, screen, fireEvent } from '@testing-library/react';

import { QueryClient, QueryClientProvider } from 'react-query';

import ThemeContext from '../../context/themeContext';
import NavBar from "../../components/NavBar";

describe("AppBar", () => {
    beforeEach(() => {
        render(<NavBar />);
    });
    afterEach(() => {
        cleanup();
    });

    it("should contain title", () => {
        const title = screen.getByText(/Cryptocurrency Price Tracker/i);
        expect(title).toBeVisible();
    });
    it("should contain theme toggle", () => {
        const darkIcon = screen.queryByTestId(/Brightness7Icon/i);
        const lightIcon = screen.queryByTestId(/Brightness4Icon/i);
        expect(darkIcon || lightIcon).toBeVisible();
    });
    it("should contain Github icon", () => {
        const label = screen.getByLabelText(/Github/i);
        expect(label).toBeVisible();

    });
    it("should contain LinkedIn icon", () => {
        const label = screen.getByLabelText(/LinkedIn/i);
        expect(label).toBeVisible();
    });
});

describe("AppBar Functionality", () => {

    beforeEach(() => {
        const queryClient = new QueryClient();
        render(
            <ThemeContext>
                <QueryClientProvider client={queryClient}>
                    <NavBar />
                </QueryClientProvider>
            </ThemeContext>
        );
    });
    afterEach(() => {
        cleanup();
    });

    it("should toggle the correct theme", () => {
        let darkIcon = screen.queryByTestId(/Brightness7Icon/i);
        let lightIcon = screen.queryByTestId(/Brightness4Icon/i);
        if (lightIcon) {
            fireEvent.click(lightIcon.parentElement!);
            darkIcon = screen.queryByTestId(/Brightness7Icon/i);
            expect(darkIcon).toBeVisible();
            expect(lightIcon).not.toBeVisible();
        } else if (darkIcon) {
            fireEvent.click(darkIcon.parentElement!);
            lightIcon = screen.queryByTestId(/Brightness4Icon/i);
            expect(lightIcon).toBeVisible();
            expect(darkIcon).not.toBeVisible();
        }
    });
});