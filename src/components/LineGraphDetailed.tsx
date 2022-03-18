import { useEffect, useRef, useState } from 'react';

import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { SxProps, useTheme } from '@mui/material/styles';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Title,
    Legend,
    Tooltip,
    Plugin,
    ChartData,
} from 'chart.js';

import numeral from 'numeral';
import { useQuery } from 'react-query';

import { getCoinMarket } from '../api/coinGeckoAPI';
import Loader from './Loader';

interface Props {
    coinName: string,
    coinID: string,
}
interface ToolTipType {
    left: string,
    right: string,
}

function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function LineGraphDetailed({ coinName, coinID }: Props) {
    const canHover = useMediaQuery('(hover: hover)');
    const theme = useTheme();
    const [toolTipValues, setToolTipValues] = useState<ToolTipType>({ left: '', right: '' });
    const [complete, setComplete] = useState(false);
    const chartRef = useRef<HTMLCanvasElement>(null);
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    const { error, data: result } = useQuery(coinID, () => getCoinMarket(coinID), { staleTime: 3000 });

    const strokeColor = theme.palette.text.primary;

    const plugins: Plugin = {
        id: 'lineID',
        beforeDraw: (chart) => {
            if (chart.tooltip?.dataPoints && leftRef.current && rightRef.current) {
                const x = chart.tooltip.dataPoints[0].element.x;
                const y = chart.tooltip.dataPoints[0].element.y;
                const yAxis = chart.scales.y;
                const xAxis = chart.scales.x;
                const ctx = chart.ctx;

                const toolTips = [leftRef.current, rightRef.current];
                const halfHeight = Math.floor(leftRef.current.clientHeight / 2);
                // Display, position, and set styles for font
                leftRef.current.style.left = '5px';
                rightRef.current.style.left = chart.canvas.clientWidth - rightRef.current.clientWidth + 'px';
                toolTips.forEach(t => t.style.top = y - halfHeight + 'px');

                chart.ctx.save();
                ctx.setLineDash([3, 3]);
                ctx.lineWidth = 1;
                ctx.strokeStyle = strokeColor;
                ctx.beginPath();
                ctx.moveTo(x, yAxis.top);
                ctx.lineTo(x, yAxis.bottom);
                ctx.stroke();

                ctx.strokeStyle = strokeColor;
                ctx.beginPath();
                ctx.moveTo(xAxis.left, y);
                ctx.lineTo(xAxis.right, y);
                ctx.stroke();
                ctx.restore();
            }
        }
    };
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        LineController,
        Tooltip,
        Title,
        Legend,
        plugins
    );

    useEffect(() => {
        const chart = chartRef.current;
        if (!chart || !result?.data)
            return;

        const coinMarket = result.data;

        const ctx = chart.getContext("2d")!;
        const prices = coinMarket.prices.map(value => value[1]);
        const totalVolume = coinMarket.total_volumes.map(value => value[1]);

        const decrease7d = coinMarket.prices[0][1] > coinMarket.prices[coinMarket.prices.length - 1][1];
        const borderColor = decrease7d ? "rgba(255, 70, 50, 1)" : "rgba(78, 175, 11, 1)";

        const stepPrices = Math.floor((Math.max.apply(Math, prices) - Math.min.apply(Math, prices)) / 3);
        const stepTotalVolume = Math.floor((Math.max.apply(Math, totalVolume) - Math.min.apply(Math, totalVolume)) / 3);

        let firstDate = true;
        let prev = "";
        let skipIfHover = true;
        const labels = Array.from({ length: coinMarket.prices.length }, (_, i) => {
            const date = new Date(coinMarket.prices[i][0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (prev !== date) {
                prev = date;
                if (firstDate) {
                    firstDate = false;
                    return '';
                }
                if (!canHover) {
                    skipIfHover = !skipIfHover;
                    return skipIfHover ? '' : date;
                }
                return date;
            }
            return '';
        });
        const data: ChartData = {
            labels: labels,
            datasets: [
                {
                    data: prices,
                    tension: 0.2,
                    borderWidth: 2,
                    borderColor: borderColor,
                },
                {
                    //hidden: true,
                    showLine: false,
                    data: totalVolume,
                    yAxisID: 'y1',
                    hoverRadius: 0,
                },
            ]
        };
        const lineChart = new ChartJS(ctx, {
            type: 'line',
            plugins: [plugins],
            data: data,
            options: {
                /*
                transitions: {
                    active: {
                        animation: {
                            duration: 0,
                        },
                    },
                },
                animation: {
                    duration: 0,
                    delay: 0,
                },
                */
                onHover: (event, activeEvents) => {
                    (event?.native?.target as HTMLElement).style.cursor =
                        activeEvents?.length > 0 ? 'crosshair' : 'default';
                },
                maintainAspectRatio: true,
                responsive: true,
                elements: {
                    point: {
                        radius: 0
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                scales: {
                    x: {
                        ticks: {
                            color: strokeColor,
                            autoSkip: false,
                            maxRotation: 0,
                            minRotation: 0,
                        },
                        grid: {
                            display: false
                        },
                        display: true,
                    },
                    y: {
                        display: true,
                        ticks: {
                            stepSize: Math.max(stepPrices, 1),
                            padding: 5,
                            color: strokeColor,
                            autoSkip: false,
                            callback: function (value, index, values) {
                                return numeral(value).format('$0.00a');
                            },
                        },
                        grid: {
                            drawTicks: false,
                        },
                    },
                    y1: {
                        display: true,
                        ticks: {
                            stepSize: Math.max(stepTotalVolume, 1),
                            padding: 5,
                            color: strokeColor,
                            autoSkip: false,
                            callback: function (value, index, values) {
                                return numeral(value).format('$0.00a');
                            },
                        },
                        position: 'right',

                        grid: {
                            drawTicks: false,
                        },
                    },
                },
                plugins: {
                    tooltip: {
                        position: 'nearest',
                        mode: "index",
                        intersect: false,
                        backgroundColor: theme.palette.background.default,
                        borderColor: theme.palette.text.disabled,
                        borderWidth: 1,
                        displayColors: false,
                        padding: 4,
                        titleMarginBottom: 4,
                        titleColor: theme.palette.text.primary,
                        filter: function (tooltipItems) {
                            const label = tooltipItems.dataset.yAxisID;
                            if (label === "y1") {
                                return false;
                            } else {
                                return true;
                            }
                        },
                        callbacks: {
                            title: function (context) {
                                return new Date(coinMarket.prices[context[0].dataIndex][0]).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                });
                            },
                            label: function (context) {

                                const price = numeral(coinMarket.prices[context.dataIndex][1]).format("$0,0");
                                const volume = numeral(coinMarket.total_volumes[context.dataIndex][1]).format("$0,0");

                                setToolTipValues({ left: price, right: volume });
                                return [`Price: ${price}`, `Volume: ${volume}`];
                            },
                            labelTextColor: function (context) {
                                return theme.palette.text.primary;
                            },
                        },
                    },
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: coinName + ' Price Chart',
                        color: theme.palette.text.secondary,
                    },
                }
            }
        });

        lineChart.update();

        setComplete(true);

        return () => {
            lineChart.destroy();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result, theme.palette.mode]);

    if (error) {
        return <Typography variant="caption"
            sx={{ lineHeight: theme.spacing(5), margin: theme.spacing(5) }}
            color={theme.palette.error.light} >
            {(error as Error)?.message}
        </Typography>;
    }

    const styles: SxProps = {
        position: 'absolute',
        left: '-100vw',
        fontSize: '0.7em',
        pointerEvents: 'none',
        height: 'unset',
        backgroundColor: theme.palette.background.default,
    };

    return (
        <Loader hideProgress={complete} style={{ height: '100px' }} >
            <div style={{ position: 'relative', overflow: 'hidden', padding: '5px', display: 'block' }}>
                <canvas data-testid={coinID + '-graph-detail'} ref={chartRef}></canvas>
                <Chip data-testid={coinID + '-graph-detail-left-chip'} ref={leftRef} variant='outlined' sx={styles} label={toolTipValues.left} size="small" />
                <Chip data-testid={coinID + '-graph-detail-right-chip'} ref={rightRef} variant='outlined' sx={styles} label={toolTipValues.right} size="small" />
            </div>
        </Loader>
    );
}