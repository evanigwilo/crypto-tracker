import { useEffect, useRef } from "react";

export default function useAsync(asyncFn: (isActive: React.MutableRefObject<boolean>) => void, onChange: React.DependencyList | [], cleanup?: () => void) {
    const isActive = useRef(false);

    useEffect(() => {
        isActive.current = true;
        asyncFn(isActive);
        return () => {
            isActive.current = false;
            cleanup && cleanup();
        };
    }, onChange);// eslint-disable-line react-hooks/exhaustive-deps
}
