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
            className="flex w-full max-w-7xl flex-row items-center justify-between gap-4 rounded-xl border p-3 font-sans shadow transition duration-200 ease-in-out hover:cursor-pointer hover:bg-neutral-200 sm:flex-col sm:items-start sm:gap-2 sm:p-4 dark:bg-neutral-950 dark:shadow-neutral-500 dark:hover:bg-neutral-900"
        >
            <div className="flex flex-row items-center gap-3 sm:gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <DynamicIcon name={crypto.icon} size={24} />
                </div>
                <div className="flex flex-col">
                    <span className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{crypto.name.toLocaleUpperCase()}</span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">{crypto.symbol}</span>
                </div>
            </div>
            <div className="flex flex-col items-end sm:items-start">
                <CryptoDashPillPrice
                    priceComparison={priceComparison}
                    id={crypto.name + '-price'}
                    maxFractionDigits={2}
                    textClassName="text-lg font-bold"
                    smallTextClassName="text-[0.7rem] font-bold"
                />
            </div>
        </Link>
    );
}
