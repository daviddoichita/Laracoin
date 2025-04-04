import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { useEffect, useRef, useState } from 'react';
interface CryptoInfoDynamicProps {
    value: string;
    rawValue: number;
}

export function CryptoInfoDynamic({ value, rawValue }: CryptoInfoDynamicProps) {
    const [color, setColor] = useState<string>('text-white');
    const [arrow, setArrow] = useState<IconName>('minus');
    const [change, setChange] = useState(0);
    const rawValueRef = useRef(rawValue);

    useEffect(() => {
        if (rawValue > rawValueRef.current) {
            setColor('text-red-500');
            setArrow('chevron-down');
        } else if (rawValue < rawValueRef.current) {
            setColor('text-green-500');
            setArrow('chevron-up');
        }

        const sub = rawValueRef.current - rawValue;
        const sum = rawValueRef.current + rawValue;
        setChange(Math.abs(sub) / (sum / 2));

        rawValueRef.current = rawValue;
    }, [rawValue]);

    return (
        <div className={'flex flex-row items-center gap-2'}>
            <p>{value}</p>
            <div className="flex flex-row items-center">
                <DynamicIcon name={arrow} size={16} className={color} />
                <small className={'text-[0.6rem]' + ' ' + color}>
                    {change.toLocaleString('es-ES', { style: 'percent', minimumFractionDigits: 2 })}
                </small>
            </div>
        </div>
    );
}
