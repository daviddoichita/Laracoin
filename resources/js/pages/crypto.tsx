import CoinInfoPill from '@/components/coin-info-pill';
import { CryptoDashPillPrice } from '@/components/crypto-dash-pill-price';
import echo from '@/echo';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Crypto } from '@/types/crypto';
import { PriceComparison } from '@/types/price-comparison';
import { PriceRecord } from '@/types/price-record';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Crypto View',
        href: '/cryto-view',
    },
];

interface CryptoViewProps {
    crypto: Crypto;
    volume24h: number;
    priceRecords: PriceRecord[];
}

const localeString = (n: number) => {
    return n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', notation: 'compact' });
};

const calculateInfoPills = (crypto: Crypto, priceComparison: PriceComparison, volume24h: number) => {
    const price = priceComparison.price;

    const marketCap = localeString(crypto.circulating_supply * price);
    const volume = localeString(volume24h * price);
    const fdv = crypto.max_supply === -1 ? marketCap : localeString(crypto.max_supply * price);
    const vol_mktCap = (((volume24h * price) / (crypto.circulating_supply * price)) * 100).toLocaleString('es-ES', {
        style: 'percent',
        maximumFractionDigits: 4,
    });
    const max_supply = localeString(crypto.max_supply);
    const circulating_supply = localeString(crypto.circulating_supply);

    const rawmc = crypto.circulating_supply * price;
    const rawvol = volume24h * price;

    return { marketCap, volume, fdv, vol_mktCap, max_supply, circulating_supply, rawmc, rawvol };
};

const CryptoPriceChart = ({ priceRecords }: { priceRecords: PriceRecord[] }) => {
    const minPrice = Math.min(...priceRecords.map((record) => record.price));
    const maxPrice = Math.max(...priceRecords.map((record) => record.price));

    return (
        <ResponsiveContainer width="100%" height={500} className="self-center">
            <LineChart
                width={500}
                height={300}
                data={priceRecords}
                margin={{
                    top: 20,
                    right: 30,
                    left: 35,
                    bottom: 50,
                }}
            >
                <CartesianGrid stroke="#404040"></CartesianGrid>
                <XAxis
                    dataKey="created_at"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(tick) => {
                        const tickDate = new Date(tick);
                        return `${tickDate.toLocaleDateString()} ${tickDate.toLocaleTimeString()}`;
                    }}
                ></XAxis>
                <Tooltip></Tooltip>
                <Line type="natural" dataKey="price" dot={false} activeDot={{ r: 4 }} stroke="#0069a8"></Line>
            </LineChart>
        </ResponsiveContainer>
    );
};

export default function CryptoView({ crypto, volume24h, priceRecords }: CryptoViewProps) {
    const [priceComparison, setPriceComparison] = useState(crypto.main_price_comparison[0]);
    const [volume24hState, setVolume24hState] = useState(volume24h);
    const [infoPills, setInfoPills] = useState(calculateInfoPills(crypto, priceComparison, volume24h));
    const [priceRecordsState, setPriceRecords] = useState(priceRecords);

    echo.channel('PriceComparison.Pair.' + priceComparison.pair_symbol).listen('PriceComparisonUpdated', (event: any) => {
        setPriceComparison(event.priceComparison);
    });

    echo.channel('Transactions.Crypto.Id.' + crypto.id).listen('TransactionInserted', (event: any) => {
        setVolume24hState(event.volume24h);
    });

    echo.channel('Records.Pair.' + priceComparison.id).listen('PriceRecordCreated', (event: any) => {
        setPriceRecords(() => [...priceRecordsState, event.priceRecord]);
    });

    useEffect(() => {
        setInfoPills(calculateInfoPills(crypto, priceComparison, volume24hState));
    }, [volume24hState, priceComparison]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crypto View"></Head>

            <div className="mt-[2rem] grid grid-cols-[0.4fr_1fr_0.4fr] p-1">
                <div className="flex flex-col gap-6 font-bold">
                    <h2 className="w-full self-center border-b p-2 text-center text-xl font-black">Coin info and metrics</h2>
                    <div className="flex flex-col items-start justify-start gap-3">
                        <CryptoDashPillPrice
                            id="cryptoPrice"
                            priceComparison={priceComparison}
                            className="self-center text-2xl"
                            maxFractionDigits={2}
                            smallTextClassName="text-[0.8rem]"
                            arrowSize={18}
                        />

                        <h4 className="self-center font-bold">General info</h4>
                        <div className="grid w-full grid-cols-2 gap-3 self-center">
                            <CoinInfoPill name="Market Cap" value={infoPills.marketCap} rawValue={infoPills.rawmc} textClassName="text-sm" dynamic />
                            <CoinInfoPill name="Volume (24h)" value={infoPills.volume} textClassName="text-sm" rawValue={infoPills.rawvol} dynamic />
                            <CoinInfoPill name="FDV" value={infoPills.fdv} textClassName="text-sm" />
                            <CoinInfoPill name="Vol/Mkt (24h)" value={infoPills.vol_mktCap} textClassName="text-sm" />
                            <CoinInfoPill name="Total supply" value={infoPills.circulating_supply} textClassName="text-sm" />
                            <CoinInfoPill name="Max supply" value={infoPills.max_supply} textClassName="text-sm" />
                            <CoinInfoPill
                                name="Circulating supply"
                                value={infoPills.circulating_supply}
                                textClassName="text-sm"
                                additionalClassName="col-span-2 flex justify-center"
                            />
                        </div>
                    </div>

                    {/* Add social links if applicable also whitepaper, explorers, wallets, etc */}
                    {/* Maybe store in the db */}

                    {/* Add a convenience converter */}
                </div>
                <div className="flex flex-col gap-6">
                    <h2 className="w-full self-center border-b p-2 text-center text-xl font-black">{crypto.symbol}&nbsp;&nbsp;|&nbsp;&nbsp;EUR</h2>

                    {/* Should have a WebSocket for 1h, 30m, etc to retrieve all the prices update to that interval in 1d, 1w, 1m size */}
                    <CryptoPriceChart priceRecords={priceRecordsState} />
                </div>
                <div className="flex flex-col gap-6">
                    {/* Change according to selected tab */}
                    <h2 className="w-full self-center border-b p-2 text-center text-xl font-black">Buy&nbsp;&nbsp;|&nbsp;&nbsp;Sell</h2>
                </div>
            </div>
        </AppLayout>
    );
}
