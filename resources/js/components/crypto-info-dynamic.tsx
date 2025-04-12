import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { useEffect, useRef, useState } from 'react';
interface CryptoInfoDynamicProps {
    value: string;
    rawValue: number;
    latest: number;
}

export function CryptoInfoDynamic({ value, latest }: Readonly<CryptoInfoDynamicProps>) {
    const [color, setColor] = useState<string>('dark:text-white text-black');
    const [arrow, setArrow] = useState<IconName>('minus');
    const change = useRef(latest);

    useEffect(() => {
        if (latest < 0) {
            setColor('text-red-500');
            setArrow('chevron-down');
        } else {
            setColor('text-green-500');
            setArrow('chevron-up');
        }
    }, [change.current]);

    return (
        <div className={'flex flex-row items-center gap-2 ' + color}>
            <p>{value}</p>
            <div className="flex flex-row items-center">
                <DynamicIcon name={arrow} size={16} className={color} />
                <small className={'text-[0.6rem]' + ' ' + color}>
                    {change.current.toLocaleString('es-ES', { style: 'percent', minimumFractionDigits: 2 })}
                </small>
            </div>
        </div>
    );
}
