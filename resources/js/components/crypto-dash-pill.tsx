import { Crypto } from '@/types/crypto';
import { Link } from '@inertiajs/react';
import { useEchoPublic } from '@laravel/echo-react';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useState } from 'react';
import { CryptoDashPillPrice } from './crypto-dash-pill-price';

interface CryptoDashPillProps {
    crypto: Crypto;
}

export function CryptoDashPill({ crypto }: Readonly<CryptoDashPillProps>) {
    const [priceComparison, setPriceComparison] = useState(crypto.main_price_comparison[0]);

    useEchoPublic(`Prices.Pair.${priceComparison?.id}`, 'PriceComparisonUpdated', (e: any) => {
        if (e.priceComparison.pair_symbol.includes(crypto.symbol)) {
            setPriceComparison(e.priceComparison);
        }
    });

    return (
        <Link
            href={route('crypto.show', { id: crypto.id, interval: '5m' })}
            className="flex max-w-7xl min-w-7xl flex-row items-center justify-between rounded-xl border p-3 font-sans shadow transition duration-[0.2s] ease-in-out hover:cursor-pointer hover:bg-neutral-200 dark:bg-neutral-950 dark:shadow-neutral-500 dark:hover:bg-neutral-900"
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
