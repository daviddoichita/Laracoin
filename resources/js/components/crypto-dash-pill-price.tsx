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
    const [color, setColor] = useState<string>('dark:text-white text-black');
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

    const formatNum = (n: number) => {
        if (n < 1) {
            return parseFloat(n.toString()).toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 4,
            });
        } else {
            return parseFloat(n.toString()).toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2,
                maximumFractionDigits: maxFractionDigits || 6,
            });
        }
    };

    const formatPercent = (n: number) => {
        return parseFloat(n.toString()).toLocaleString('es-ES', {
            maximumFractionDigits: 2,
            style: 'percent',
        });
    };

    return (
        <div className={'flex flex-row items-center gap-2 ' + className}>
            <p id={id} className={color + ' ' + textClassName}>
                {formatNum(priceComparison.price)}
            </p>
            <div className="flex flex-row items-center">
                <DynamicIcon name={arrow} size={arrowSize || 16} className={color} />
                <small className={(smallTextClassName || 'text-[0.6rem]') + ' ' + color}>{formatPercent(priceComparison.last_update)}</small>
            </div>
        </div>
    );
}
