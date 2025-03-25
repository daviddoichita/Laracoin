import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { useEffect, useRef, useState } from 'react';

interface CryptoDashPillPriceProps {
    id: string;
    price: number;
}

export function CryptoDashPillPrice({ id, price }: CryptoDashPillPriceProps) {
    const prevPriceRef = useRef(price);
    const [color, setColor] = useState<string>('text-white');
    const [arrow, setArrow] = useState<IconName>('minus');

    useEffect(() => {
        if (prevPriceRef.current < price) {
            setColor('text-red-500');
            setArrow('move-down');
        } else if (prevPriceRef.current > price) {
            setColor('text-green-500');
            setArrow('move-up');
        }

        prevPriceRef.current = price;
    }, [price]);

    const formatPrice = () => {
        const formattedPrice = (1 / price).toLocaleString('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
        });
        return `${formattedPrice} €`;
    };

    return (
        <div className="flex flex-row items-center gap-3">
            <p id={id} className={color}>
                {formatPrice()}
            </p>
            <DynamicIcon name={arrow} size={16} className={color} />
        </div>
    );
}
