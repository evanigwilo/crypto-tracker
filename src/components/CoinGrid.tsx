import { useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from 'react-query';
// import { ReactQueryDevtools } from 'react-query/devtools';

import useAsync from '../utils/useAsync';
import CoinRow from './CoinRow';
import Loader from './Loader';
import { getCoinData } from '../api/coinGeckoAPI';

export default function CoinGrid({ coinIds }: { coinIds: string; }) {
    const active = useRef(false);
    // const [hasNextPage, setHasNextPage] = useState(false);
    const { ref, inView } = useInView();
    const theme = useTheme();
    const { isFetching, isFetchingNextPage, data, error, fetchNextPage, } = useInfiniteQuery(coinIds,
        async ({ pageParam = 1 }) => {
            const res = await getCoinData(coinIds, pageParam);
            // setHasNextPage(res.length > 0);
            if (!active.current)
                return [];

            return res;
        },
        {
            getNextPageParam: (_, allPages) => allPages.length + 1,
        }
    );

    useAsync((isActive) => {
        /* if (!navigator.onLine) {
            }
         */

        active.current = isActive.current;
        if (isActive.current && inView) {
            fetchNextPage();
        }
    }, [inView]);

    const notFinished = isFetching || isFetchingNextPage;

    const status = notFinished ?
        <CircularProgress
            size={30}
            sx={{ color: theme.palette.mode === 'light' ? theme.palette.text.disabled : theme.palette.text.primary }}
        />
        :
        <Typography variant="caption"
            color={error ? theme.palette.error.light : theme.palette.text.secondary} >
            {error ? `Error: ${(error as Error).message}` : "Finished Fetching."}
        </Typography>;


    return (
        <Loader hideProgress={!notFinished} style={{ height: '100px', width: '100vw' }} >
            <button style={{ display: 'none' }} data-testid='mock-fetch' onClick={() => fetchNextPage()}>Next</button>

            <Grid container spacing={0} columns={1} sx={{ maxWidth: 'md' }} >

                {
                    data?.pages.map(page => (
                        page?.map((coinInfo, index) => (
                            <Grid item xs={1} key={index}>
                                <CoinRow coinInfo={coinInfo} />
                            </Grid>
                        ))
                    ))
                }

                <div style={{ width: 'inherit', height: '50px', display: 'grid', placeItems: 'center' }} ref={ref}>
                    {status}
                </div>

                {/* <ReactQueryDevtools initialIsOpen /> */}
            </Grid>
        </Loader>
    );
}
