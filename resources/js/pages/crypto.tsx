import { CryptoDashPillPrice } from '@/components/crypto-dash-pill-price';
import echo from '@/echo';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Crypto } from '@/types/crypto';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Crypto View',
        href: '/cryto-view',
    },
];

interface CryptoViewProps {
    crypto: Crypto;
}

export default function CryptoView({ crypto }: CryptoViewProps) {
    const [priceComparison, setPriceComparison] = useState(crypto.child_price_comparison[0]);

    echo.channel(crypto.child_price_comparison[0].pair_symbol).listen('PriceComparisonUpdated', (event: any) => {
        setPriceComparison(event.priceComparison);
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crypto View"></Head>

            <div className="mt-[2rem] grid grid-cols-[0.4fr_1fr_0.4fr] grid-rows-[repeat(3,1fr)]">
                <div className="flex flex-col gap-6">
                    <h2 className="w-[95%] self-center border-b p-2 text-center text-xl font-black">Coin info and metrics</h2>
                    <div className="flex flex-col items-start justify-start gap-3">
                        <CryptoDashPillPrice
                            id="cryptoPrice"
                            priceComparison={priceComparison}
                            className="self-center text-2xl font-bold"
                            maxFractionDigits={2}
                            smallTextClassName="text-[0.8rem]"
                            arrowSize={18}
                        />

                        <h4 className="self-center font-bold">General info</h4>
                        <div className="ml-4 flex flex-col items-start">
                            {/* Make pills from this (see coinmarketcap) */}
                            <p>Market cap</p>
                            <p>Volume</p>
                            <p>FDV</p>
                            <p>Vol/Mkt Cap</p>
                            <p>Total supply</p>
                            <p>Max. supply</p>
                            <p>Circulating supply</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-6 border-r border-l">
                    <h2 className="w-[98%] self-center border-b p-2 text-center text-xl font-black">{crypto.symbol}&nbsp;&nbsp;|&nbsp;&nbsp;EUR</h2>

                    {/* Should have a WebSocket for 1h, 30m, etc to retrieve all the prices update to that interval in 1d, 1w, 1m size */}
                </div>
                <div className="flex flex-col gap-6">
                    {/* Change according to selected tab */}
                    <h2 className="w-[95%] self-center border-b p-2 text-center text-xl font-black">Buy&nbsp;&nbsp;|&nbsp;&nbsp;Sell</h2>
                </div>
            </div>
        </AppLayout>
    );
}
