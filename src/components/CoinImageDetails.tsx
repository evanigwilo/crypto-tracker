import Typography from '@mui/material/Typography';

interface Props {
    props: {
        market_cap_rank?: number,
        image: string,
        symbol: string,
        name?: string,
    },
    style?: React.CSSProperties,
    className?: string;
}

export default function CoinImageDetails({ props, style, className }: Props) {
    return (
        <div style={style} className={className}>
            {
                props.market_cap_rank &&
                <Typography variant="caption" color="text.secondary">
                    {props.market_cap_rank + '.'}
                </Typography>
            }
            <img
                src={props.image}
                alt={props.name || props.symbol}
                style={{
                    width: 30,
                    height: 30,
                    marginRight: props.market_cap_rank ? 'unset' : '10px'
                }}
            />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'left',
                alignItems: 'flex-start',
            }}>
                <Typography sx={{ textTransform: 'uppercase' }} variant="button">
                    {props.symbol}
                </Typography>
                {
                    props.name &&
                    <Typography variant="caption">
                        {props.name}
                    </Typography>
                }
            </div>
        </div>

    );
}
