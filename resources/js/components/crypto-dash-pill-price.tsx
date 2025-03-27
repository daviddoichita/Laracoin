import { PriceComparison } from '@/types/price-comparison';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { useEffect, useState } from 'react';

interface CryptoDashPillPriceProps {
    id: string;
    priceComparison: PriceComparison;
    className?: string;
    maxFractionDigits?: number;
    textClassName?: string;
    smallTextClassName?: string;
    arrowSize?: number;
}

export function CryptoDashPillPrice({
    id,
    priceComparison,
    className,
    maxFractionDigits,
    textClassName,
    smallTextClassName,
    arrowSize,
}: CryptoDashPillPriceProps) {
    const [color, setColor] = useState<string>('text-white');
    const [arrow, setArrow] = useState<IconName>('minus');

    useEffect(() => {
        if (priceComparison.last_update < 0) {
            setColor('text-red-500');
            setArrow('chevron-down');
        } else if (priceComparison.last_update > 0) {
            setColor('text-green-500');
            setArrow('chevron-up');
        }
    }, [priceComparison]);

    const formatNum = (n: number, suffix: string) => {
        const formatted = parseFloat(n.toString()).toLocaleString('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: maxFractionDigits || 6,
        });

        return `${formatted}${suffix}`;
    };

    return (
        <div className={'flex flex-row items-center gap-2 ' + className}>
            <p id={id} className={color + ' ' + textClassName}>
                {formatNum(1 / priceComparison.price, '€')}
            </p>
            <div className="flex flex-row items-center">
                <DynamicIcon name={arrow} size={arrowSize || 16} className={color} />
                <small className={(smallTextClassName || 'text-[0.6rem]') + ' ' + color}>{formatNum(priceComparison.last_update, '%')}</small>
            </div>
        </div>
    );
}
