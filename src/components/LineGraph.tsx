import { useEffect, useRef } from 'react';

import { Chart as ChartJS, Filler, CategoryScale, LineController, LineElement, PointElement, LinearScale, ChartConfiguration } from 'chart.js';

export default function LineGraph({ coinID, sparkline }: { coinID: string, sparkline: number[]; }) {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const chart = chartRef.current;
        if (!chart) return;

        const ctx = chart.getContext("2d");
        if (!ctx) return;

        ChartJS.register(Filler, CategoryScale, LineController, LineElement, PointElement, LinearScale);

        const greenGradient = ctx.createLinearGradient(0, 50, 0, 0);
        greenGradient.addColorStop(0, "rgba(78, 175, 11, 0)");
        greenGradient.addColorStop(1, "rgba(78, 175, 11, 0.8)");

        const redGradient = ctx.createLinearGradient(0, 50, 0, 0);
        redGradient.addColorStop(0, "rgba(255, 0, 0, 0)");
        redGradient.addColorStop(1, "rgba(255, 0, 0, 0.8)");

        const decrease7d = sparkline[0] > sparkline[sparkline.length - 1];
        const gradientColor = decrease7d ? redGradient : greenGradient;
        const borderColor = decrease7d ? "rgba(255, 0, 0, 1)" : "rgba(78, 175, 11, 1)";

        const options: ChartConfiguration<'line'> = {
            type: "line",
            data: {
                labels: Array.from({ length: sparkline.length }, (_, i) => i),
                datasets: [
                    {
                        data: sparkline,
                        backgroundColor: gradientColor,
                        borderColor: borderColor,
                        tension: 0.2,
                        borderWidth: 1,
                        fill: true,
                    }
                ]
            },
            options: {
                // maintainAspectRatio: false,
                responsive: false,
                elements: {
                    point: {
                        radius: 0
                    }
                },
                scales: {
                    x: {
                        display: false,
                    },
                    y: {
                        display: false,
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            }
        };
        const lineChart = new ChartJS(ctx, options);
        // lineChart.update();
        return () => {
            lineChart.destroy();
        };

    }, [sparkline]);

    return (
        <canvas data-testid={coinID + '-graph'} style={{
            width: '100%',
            height: '50px',
            padding: '10px 5px',
            pointerEvents: 'none',
        }} ref={chartRef}></canvas>
    );
}
