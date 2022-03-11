import { useRef, useState } from 'react';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import { useTheme } from '@mui/material/styles';

import useAsync from '../utils/useAsync';

interface Props {
    hideProgress: boolean,
    style: React.CSSProperties,
    children?: React.ReactNode,
}

export default function Loader({ hideProgress, children, style }: Props) {
    const [progress, setProgress] = useState(0);
    const theme = useTheme();
    const loadRef = useRef<HTMLDivElement>(null);
    const delayCounter = useRef(8);

    useAsync((isActive) => {
        if (!isActive.current) return;

        if (hideProgress) {
            const timer = setInterval(() => {
                if (!isActive.current) return;

                setProgress((prevProgress) => {
                    if (prevProgress === 100) {
                        if (!isActive.current || !loadRef.current) {
                            return prevProgress;
                        }
                        const target = loadRef.current;
                        target.style.opacity = '0';
                        if (delayCounter.current <= 0) {
                            target.style.display = 'none';
                            const targetSibling = target.nextSibling as HTMLElement;
                            if (targetSibling) {
                                targetSibling.style.display = 'block';
                            }

                            clearInterval(timer);
                        } else {
                            delayCounter.current--;
                        }
                        return prevProgress;
                    }
                    return Math.min(100, prevProgress + 10);
                });
            }, 100);
        }

    }, [hideProgress]);

    return <>
        <div
            ref={loadRef}
            style={{
                display: 'grid',
                placeItems: 'center',
                opacity: 1,
                transition: 'opacity 0.5s 0.25s',
                ...style
            }}
        /*
            onTransitionEnd={(e) => {
                const target = e.target as HTMLElement;
                if (target !== loadRef.current) {
                    return;
                }
                console.log(progress, target?.parentNode);

                target.style.display = 'none';
                const targetSibling = target.nextSibling as HTMLElement;
                if (targetSibling) {
                    targetSibling.style.display = 'block';
                }
            }}
        */
        >
            <CircularProgressWithLabel
                sx={{
                    color: theme.palette.mode === 'light' ? theme.palette.text.disabled : theme.palette.text.primary
                }}
                value={progress} />
        </div>
        <div style={{ display: 'none' }}>
            {children}
        </div>
    </>;
}


