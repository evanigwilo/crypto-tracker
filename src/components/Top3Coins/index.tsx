// import { styled } from '@mui/styled-engine';
import { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import './styles.css';

import CoinImageDetails from '../CoinImageDetails';
import { getCoinMarket } from '../../api/coinGeckoAPI';
import { CoinDataTye } from '../../types';
import useAsync from '../../utils/useAsync';

interface HexagonSx {
    parentWidth: string;
}

const Hexagon = styled('div', { shouldForwardProp: (prop) => prop !== "sx" })
    (({ sx }: { sx: React.CSSProperties & HexagonSx; }) => ({
        position: 'relative',
        width: `${sx.parentWidth}  !important`,
        height: sx.height,
        background: 'transparent !important',
        display: 'grid',
        placeItems: 'center',
        color: sx.color,
        // pointerEvents: 'none',
        '&:before, &:after': {
            zIndex: -1,
            position: 'absolute',
            width: 'inherit',
            height: `calc(${sx.height} / 2)`,
            content: '""',
            left: '0',
            borderLeft: `${sx.width} solid transparent`,
            borderRight: `${sx.width} solid transparent`,

        },
        '&:before': {
            bottom: '0',
            borderTop: `calc(${sx.width} * 2) solid`,
        },
        '&:after': {
            top: '0',
            borderBottom: `calc(${sx.width} * 2) solid`,
        }
    }));

export default function Top3Coins({ position, coinInfo }: { position?: string, coinInfo: CoinDataTye; }) {
    const theme = useTheme();
    const [animationClass, setAnimationClass] = useState({
        hexagonParent: '',
        hexagonText: '',
        hexagonBorder: '',
        hexagonDetails: '',
    });
    const [scaledDown, setScaledDown] = useState(false);
    const [coinInformation, setCoinInformation] = useState('');

    //Disable showing of coin definitions if device cant hover or device width is less than 700px
    const canHover = useMediaQuery('(hover: hover) and (min-width: 700px)');

    useAsync((isActive) => {
        getCoinMarket(coinInfo.id, true)
            .then((data) => {
                if (!isActive.current) return;
                //Remove all HTML Tags
                setCoinInformation(data.data.description.en.replace(/<\/?[^>]+(>|$)/g, ""));
            });
    }, []);

    const pos = position === 'left' ? {
        hexPos: {
            left: '22px',
            top: '42px',
        },
        hexDetails: {
            transform: 'scaleX(-1)',
            right: '92px',
        },
        hexType: {
            transform: 'scaleX(-1)',
        }
    } : position === 'right' ? {
        hexPos: {
            left: '-22px',
            top: '42px',
        },
        hexDetails: {
            left: '92px',
        },
        hexType: {
        },
    } : {
        hexDetails: {
            left: 'calc(50% - 100px)',
        },
    };

    const color = scaledDown ? theme.palette.action.selected : theme.palette.action.hover;
    const height = '24px';
    const translate = '160px';
    const width = '120px';
    const width_height_parentWidth = {
        width: height,
        height: translate,
        parentWidth: width,
    };
    return (
        <div style={{
            position: 'relative',
            zIndex: scaledDown ? 2 : 0,
            height: translate,
            width: width,
            // overflow: 'hidden',
            ...pos.hexPos,
        }}  >
            <div
                className={animationClass.hexagonParent}
                style={{
                    width: 'inherit',
                    height: 'inherit',
                    transitionDuration: '0.2s',
                    transitionProperty: 'transform, opacity',
                }}
                onTransitionEnd={(e) => {
                    if (animationClass.hexagonParent === 'scaledown') {
                        setScaledDown(true);
                        setAnimationClass((prev) => ({
                            ...prev,
                            hexagonParent: 'scaleup-set'
                        }));
                        // (target.nextSibling as HTMLElement).classList.add('rotate');
                    }
                    else if (animationClass.hexagonParent === 'scaleup-set') {
                        setAnimationClass((prev) => ({
                            ...prev,
                            hexagonParent: 'scaleup',
                        }));
                    }
                    else if (animationClass.hexagonParent === 'scaleup') {
                        setAnimationClass((prev) => ({
                            ...prev,
                            hexagonBorder: 'scalewide',
                            hexagonDetails: position ? 'expandwidth' : 'expandheight'
                        }));
                    }

                }}>
                <Hexagon className={animationClass.hexagonBorder}
                    sx={{
                        transitionProperty: 'transform',
                        transform: 'scale(0.9)',
                        color: color,
                        ...width_height_parentWidth,
                    }}
                />
                <Hexagon sx={{
                    bottom: translate,
                    transform: 'scale(0.9)',
                    color: theme.palette.background.default,
                    ...width_height_parentWidth,
                }} />
                <Hexagon sx={{
                    color: color,
                    bottom: `calc(${translate} * 2)`,
                    transform: 'scale(0.8)',
                    ...width_height_parentWidth,
                }} />
            </div>

            <div className={animationClass.hexagonDetails}
                style={{
                    transitionDuration: '0.3s',
                    transitionProperty: 'width, height',
                    position: 'absolute',
                    overflow: 'hidden',
                    top: '75%',
                    width: position ? '0px' : '200px',
                    height: position ? '100px' : '0px',
                    ...pos.hexDetails,
                }}>
                <div className={position ? 'rotateborder' : 'centerborder'}
                    style={{
                        padding: '2px',
                        backgroundColor: theme.palette.background.default,
                    }}>
                    <Typography variant="caption" sx={{ ...pos.hexType }} className='multiline'>
                        {coinInformation}
                    </Typography>
                </div>
            </div>

            <div className='selected'
                onMouseEnter={(e) => {
                    if (!canHover) return;
                    setAnimationClass((prev) => ({
                        ...prev,
                        hexagonParent: 'scaledown',
                        hexagonText: 'rotate',
                    }));
                }}
                onMouseLeave={(e) => {
                    setScaledDown(false);
                    setAnimationClass((prev) => ({
                        ...prev,
                        hexagonParent: '',
                        hexagonText: '',
                        hexagonBorder: '',
                        hexagonDetails: ''
                    }));
                }}
            >

                <CoinImageDetails
                    className={animationClass.hexagonText}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    props={{
                        market_cap_rank: coinInfo.market_cap_rank,
                        image: coinInfo.image,
                        symbol: coinInfo.symbol,
                    }}
                />
            </div>
        </div >
    );
}
