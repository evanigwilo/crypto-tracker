import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material/styles";
import { PaletteMode } from "@mui/material/index";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useContext, useEffect } from "react";
import CssBaseline from '@mui/material/CssBaseline';

const ColorModeContext = React.createContext({
    toggleColorMode: () => { },
});

const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
    typography: {
        ...(
            mode === 'light' ? {
                allVariants: {
                    color: 'rgba(0, 0, 0, 0.6)',
                },
            } : {

            }
        ),
        h6: {
            //theme.breakpoints.down(sm)
            '@media (max-width:600px)': {
                fontSize: '0.9em',
            },
        },
        caption: {
            //theme.breakpoints.down(sm)
            '@media (max-width:600px)': {
                fontSize: '0.6rem',
            },
        },
        button: {
            //theme.breakpoints.down(sm)
            '@media (max-width:600px)': {
                fontSize: '0.6rem',
            },
        },
        // fontSize: 14,
        fontWeightRegular: '550',
        fontWeightMedium: '600',
        fontFamily: [
            'Titillium Web',
            'sans-serif'
        ].join(','),
    },
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                background: {
                    default: '#fff',
                    paper: '#fff',
                },
            }
            : {
                background: {
                    default: '#293243',
                    paper: '#293243',
                },
            }),
    },
});

enum themeMode {
    light = 'light',
    dark = 'dark',
}
export default function ThemeContext({ children }: { children: React.ReactNode; }) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const [mode, setMode] = React.useState<themeMode>(prefersDarkMode ? themeMode.dark : themeMode.light);
    const toggleColorMode = () => {
        setMode((prevMode: PaletteMode) => prevMode === themeMode.light ? themeMode.dark : themeMode.light);
    };
    useEffect(() => {
        setMode(prefersDarkMode ? themeMode.dark : themeMode.light);
    }, [prefersDarkMode]);

    // Update the theme only if the mode changes
    const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    return (
        <ColorModeContext.Provider value={{ toggleColorMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export const useThemeState = () => useContext(ColorModeContext);