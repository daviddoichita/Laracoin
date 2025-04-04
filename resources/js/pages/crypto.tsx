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
import { Area, Bar, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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

interface CustomTooltipProps {
    active?: boolean;
    payload?: { payload: { created_at: string; price: number } }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        const { created_at, price } = payload[0].payload;
        return (
            <div className="rounded bg-neutral-950 p-1">
                <p>{`${new Date(created_at).toLocaleString()}: ${parseFloat(price.toString()).toLocaleString('es-ES', { maximumFractionDigits: 4, style: 'currency', currency: 'EUR' })}`}</p>
            </div>
        );
    }
    return null;
};

const CryptoPriceChart = ({ priceRecords }: { priceRecords: PriceRecord[] }) => {
    const minPrice = Math.min(...priceRecords.map((record) => record.price));
    const maxPrice = Math.max(...priceRecords.map((record) => record.price));
    const modRecords = priceRecords.map((record) => ({
        ...record,
        price: record.price * 0.4,
    }));

    return (
        <ResponsiveContainer className="self-center" width="100%" height={600}>
            <ComposedChart
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
                <defs>
                    <linearGradient id="colorPrice" x1={0} y1={0} x2={0} y2={1}>
                        <stop offset="5%" stopColor="#0069a8" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="#0069a8" stopOpacity={0.05} />
                    </linearGradient>
                </defs>
                <CartesianGrid stroke="#404040" strokeDasharray="3 3"></CartesianGrid>
                <XAxis
                    dataKey="created_at"
                    tick={{ fontSize: 12, width: 100 }}
                    tickFormatter={(tick) => {
                        const tickDate = new Date(tick);
                        return `${tickDate.toLocaleDateString()} ${tickDate.toLocaleTimeString()}`;
                    }}
                    tickMargin={10}
                    scale="auto"
                ></XAxis>
                <YAxis
                    orientation="right"
                    dataKey="price"
                    domain={[minPrice - minPrice * 0.08, maxPrice + maxPrice * 0.08]}
                    tickFormatter={(tick) => {
                        return localeString(parseFloat(tick));
                    }}
                ></YAxis>
                <Tooltip content={<CustomTooltip />}></Tooltip>
                <Area
                    type="monotone"
                    dataKey="price"
                    activeDot={{ r: 4 }}
                    stroke="#0069a8"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                ></Area>
                <Bar dataKey="price" data={modRecords} stroke="#0069a8" opacity={0.6} fill="#0069a8"></Bar>
            </ComposedChart>
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

            <div className="mt-[2rem] grid grid-cols-[0.3fr_1fr_0.3fr] p-1 2xl:grid-cols-[0.2fr_1fr_0.2fr]">
                <div className="flexflex-col gap-6 font-bold">
                    <h2 className="w-full self-center border-b p-2 text-center text-xl font-black">Coin info and metrics</h2>
                    <div className="flex flex-col items-start justify-start gap-3">
                        <CryptoDashPillPrice
                            id="cryptoPrice"
                            priceComparison={priceComparison}
                            className="mt-2 self-center text-2xl"
                            maxFractionDigits={2}
                            smallTextClassName="text-[0.8rem]"
                            arrowSize={18}
                        />

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
                <div className="mr-2 ml-2 flex flex-col gap-6">
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
