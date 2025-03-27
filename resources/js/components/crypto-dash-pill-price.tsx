import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { useEffect, useRef, useState } from 'react';

interface CryptoDashPillPriceProps {
    id: string;
    price: number;
    className?: string;
    maxFractionDigits?: number;
    smallTextSize?: string;
    arrowSize?: number;
}

export function CryptoDashPillPrice({ id, price, className, maxFractionDigits, smallTextSize, arrowSize }: CryptoDashPillPriceProps) {
    const prevPriceRef = useRef(price);
    const [color, setColor] = useState<string>('text-white');
    const [arrow, setArrow] = useState<IconName>('minus');
    const [change, setChange] = useState<number>(0);

    useEffect(() => {
        if (prevPriceRef.current > price) {
            setColor('text-green-500');
            setArrow('chevron-up');
        } else if (prevPriceRef.current < price) {
            setColor('text-red-500');
            setArrow('chevron-down');
        }

        const abs = Math.abs(1 / prevPriceRef.current - 1 / price);
        const med = (1 / prevPriceRef.current + 1 / price) / 2;
        const div = abs / med;
        setChange(div * 100);

        prevPriceRef.current = price;
    }, [price]);

    const formatPrice = () => {
        const formattedPrice = (1 / price).toLocaleString('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: maxFractionDigits || 6,
        });
        return `${formattedPrice} €`;
    };

    return (
        <div className={'flex flex-row items-center gap-2 ' + className}>
            <p id={id} className={color}>
                {formatPrice()}
            </p>
            <div className="flex flex-row items-center">
                <DynamicIcon name={arrow} size={arrowSize || 16} className={color} />
                <small className={(smallTextSize || 'text-[0.6rem]') + ' ' + color}>
                    {change.toLocaleString('es-ES', { maximumFractionDigits: 2 })}&nbsp;%
                </small>
            </div>
        </div>
    );
}
