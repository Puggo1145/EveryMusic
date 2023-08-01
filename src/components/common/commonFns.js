import { useState, useEffect } from 'react';

export default function useCountDown() {
    const [count, setCount] = useState(3);

    useEffect(() => {
        const timer = setInterval(() => {
            setCount((prevCount) => {
                if (prevCount === 1) {
                    clearInterval(timer);
                    return "开始";
                }
                return prevCount - 1;
            });
        }, 1000);

        return () => clearInterval(timer);  // 当组件卸载或者count发生变化时，清除定时器
    }, []);

    return count;
}
