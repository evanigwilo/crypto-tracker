import { useState } from 'react';

import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';

import numeral from 'numeral';

import CoinImageDetails from './CoinImageDetails';
import { CoinDataTye } from '../types';
import LineGraph from './LineGraph';
import LineGraphDetailed from './LineGraphDetailed';

const IconButtonCSS = styled(IconButton)({
    display: 'unset',
    borderRadius: 'unset',
    padding: '0',
    margin: '0',
    width: '100%',
});

export default function CoinRow({ coinInfo }: { coinInfo?: CoinDataTye; }) {
    const canHover = useMediaQuery('(hover: hover)');
    const [showDetails, setShowDetails] = useState(false);
    const theme = useTheme();
    const mode = theme.palette.mode;

    const containerStyle = {
        textAlign: 'center',
        display: 'grid',
        gridTemplateColumns: '1fr 2fr repeat(4, 1fr) 2fr',
        placeItems: 'center',
        borderBottom: '1px solid ' + theme.palette.divider,
        padding: '0px 5px',
    };

    if (!coinInfo) {
        return (
            <Container disableGutters sx={{
                ...containerStyle,
                height: '50px',
                borderTop: '1px solid ' + theme.palette.divider,
            }}>
                <Typography variant="caption">#</Typography>

                <Typography variant="caption">Coin</Typography>

                <Typography variant="caption">Price</Typography>

                <Typography variant="caption">Market Cap</Typography>

                <Typography variant="caption">Total Volume</Typography>

                <Typography variant="caption">24h %</Typography>

                <Typography variant="caption">Last 7d Price Change</Typography>
            </Container>
        );
    }

    const changePercent24h = numeral(coinInfo.price_change_percentage_24h).format('0.00');
    const changeColor = parseFloat(changePercent24h) >= 0 ? 'success.main' : (mode === 'light' ? '#e62814' : '#ff7060');
    const changeIcon = parseFloat(changePercent24h) >= 0 ?
        <ArrowDropUpIcon sx={{ color: changeColor, margin: '-5px' }} />
        : <ArrowDropDownIcon sx={{ color: changeColor, margin: '-5px' }} />;
    return (
        <>
            <IconButtonCSS
                data-testid={coinInfo.id + '-row'}
                onClick={() => setShowDetails(!showDetails)}
            >
                <Container disableGutters sx={{
                    ...containerStyle,
                    backgroundColor: showDetails ? theme.palette.action.hover : 'unset',
                }}>

                    <Typography variant="caption" >
                        {coinInfo.market_cap_rank + '.'}
                    </Typography>

                    <CoinImageDetails
                        style={{
                            display: 'flex',
                            textAlign: 'center',
                            alignItems: 'center',
                            justifySelf: 'flex-start',
                        }}
                        props={{
                            image: coinInfo.image,
                            name: coinInfo.name,
                            symbol: coinInfo.symbol,
                        }}
                    />

                    <Typography variant="caption" >
                        {numeral(coinInfo.current_price).format(canHover ? '$0,0.00' : '$0.00a')}
                    </Typography>

                    <Typography variant="caption" >
                        {numeral(coinInfo.market_cap).format('0.00a')}
                    </Typography>

                    <Typography variant="caption" >
                        {numeral(coinInfo.total_volume).format('0.00a')}
                    </Typography>

                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Typography variant="caption" color={changeColor} >
                            {changePercent24h}
                        </Typography>
                        {changeIcon}
                    </div>

                    <LineGraph coinID={coinInfo.id} sparkline={coinInfo.sparkline_in_7d.price} />

                </Container>
            </IconButtonCSS>

            <TransitionGroup>
                {
                    showDetails && <Collapse>
                        <div data-testid={coinInfo.id + '-graph-detail-container'} style={{ width: '100%' }}>
                            <LineGraphDetailed />
                        </div>
                    </Collapse>
                }
            </TransitionGroup>
        </>
    );
}
