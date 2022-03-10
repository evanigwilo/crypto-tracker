import React, { useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';

import { useQueryClient } from 'react-query';

import { searchCoin } from '../api/coinGeckoAPI';

import TextFieldCSS from './TextFieldCSS';
import debounce from '../utils/debounce';

export default function SearchCoins() {
    const queryClient = useQueryClient();

    const coinIds = useRef('');
    const theme = useTheme();
    const [refresh, setRefresh] = useState(true);

    const style: React.CSSProperties = {
        fontSize: '0.9em',
        borderColor: theme.palette.text.primary,
        color: theme.palette.text.primary,
        // position: 'absolute',
        marginBottom: '20px',
    };

    const searchBar = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRefresh(false);
        debounce("search", () => {
            const value = e.target.value.trim().toLowerCase();
            searchCoin(value).then(res => {
                queryClient.resetQueries(coinIds.current, { exact: true });
                coinIds.current = res;
                setRefresh(value.length === 0 || coinIds.current.length > 0);
            });
        }, 500);

    };

    return (
        <>
            <TextFieldCSS
                data-testid="SearchBar"
                label="Search"
                placeholder='Enter coin name...'
                size='small'
                variant="filled"
                sx={style}
                // value={input}
                onChange={searchBar}
            />
        </>
    );
}
