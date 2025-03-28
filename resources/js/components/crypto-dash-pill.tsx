import echo from '@/echo';
import { Crypto } from '@/types/crypto';
import { Link } from '@inertiajs/react';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useState } from 'react';
import { CryptoDashPillPrice } from './crypto-dash-pill-price';

interface CryptoDashPillProps {
    crypto: Crypto;
}

export function CryptoDashPill({ crypto }: CryptoDashPillProps) {
    const [priceComparison, setPriceComparison] = useState(crypto.child_price_comparison[0]);

    echo.channel(crypto.child_price_comparison[0].pair_symbol).listen('PriceComparisonUpdated', (event: any) => {
        setPriceComparison(event.priceComparison);
    });

    return (
        <Link
            href={route('crypto.show', { id: crypto.id })}
            className="flex max-w-7xl min-w-7xl flex-row items-center justify-between rounded border bg-neutral-950 p-3 font-sans transition duration-[0.2s] ease-in-out hover:cursor-pointer hover:bg-neutral-900"
        >
            <div className="flex flex-row gap-3">
                <DynamicIcon name={crypto.icon} />
                <p>{crypto.name.toLocaleUpperCase()}</p>
                <p>{crypto.symbol}</p>
            </div>
            <CryptoDashPillPrice
                priceComparison={priceComparison}
                id={crypto.name + '-price'}
                maxFractionDigits={2}
                textClassName="text-lg font-bold"
                smallTextClassName="text-[0.7rem] font-bold"
            />
        </Link>
    );
}
