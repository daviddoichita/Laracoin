import CoinInfoPill from '@/components/coin-info-pill';
import { CryptoDashPillPrice } from '@/components/crypto-dash-pill-price';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import echo from '@/echo';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Crypto } from '@/types/crypto';
import { PriceComparison } from '@/types/price-comparison';
import { PriceRecord } from '@/types/price-record';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, JSX, useEffect, useState } from 'react';
import { Area, Bar, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Crypto View',
        href: '/crypto/show',
    },
];

interface CryptoViewProps {
    crypto: Crypto;
    volume24h: number;
    priceRecords: PriceRecord[];
    state: string;
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
    const latest = priceComparison.last_update;

    return { marketCap, volume, fdv, vol_mktCap, max_supply, circulating_supply, rawmc, rawvol, latest };
};

interface CustomTooltipProps {
    active?: boolean;
    payload?: { payload: { created_at: string; price: number } }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        const { created_at, price } = payload[0].payload;
        return (
            <div className="rounded border border-black bg-white p-1 dark:border-white dark:bg-neutral-950">
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

type OrderForm = {
    user_id: number;
    sold_id: number;
    purchased_id: number;
    order_type: string;
    total_amount: number;
    price: number;
};

export default function CryptoView({ crypto, volume24h, priceRecords, state }: CryptoViewProps) {
    useEffect(() => {
        if (!crypto) {
            window.location.href = route('dashboard');
        }
    }, []);

    const { auth } = usePage<SharedData>().props;

    const [priceComparison, setPriceComparison] = useState(crypto.main_price_comparison[0]);
    const [volume24hState, setVolume24hState] = useState(volume24h);
    const [infoPills, setInfoPills] = useState(calculateInfoPills(crypto, priceComparison, volume24h));
    const [priceRecordsState, setPriceRecords] = useState(priceRecords);

    const [tab, setTab] = useState(state ? state : 'buy');
    const activeTab = ' bg-sky-800 hover:bg-sky-900';

    const { data, setData, post, processing, errors, reset } = useForm<Required<OrderForm>>({
        user_id: auth.user.id,
        sold_id: priceComparison.child_id,
        purchased_id: priceComparison.main_id,
        order_type: 'buy',
        total_amount: -1,
        price: -1,
    });

    const submitBuy: FormEventHandler = (e) => {
        e.preventDefault();

        console.log(data);
    };
    const submitSell: FormEventHandler = (e) => {
        e.preventDefault();

        console.log(data);
    };

    const formData: JSX.Element = (
        <>
            <div className="mt-4 flex w-full flex-col">
                <Label htmlFor="price" className="text-md">
                    Price
                </Label>
                <Input
                    name="price"
                    id="price"
                    type="number"
                    step={0.00000001}
                    autoFocus
                    autoComplete="price"
                    value={data.price === -1 ? '' : data.price}
                    onChange={(e) => setData('price', parseFloat(e.target.value))}
                    placeholder="€"
                />
                <InputError message={errors.price} />
            </div>

            <div className="flex w-full flex-col">
                <Label htmlFor="quantity" className="text-md">
                    Quantity
                </Label>
                <Input
                    name="amount"
                    id="amount"
                    type="number"
                    step={0.00000001}
                    autoFocus
                    autoComplete="amount"
                    value={data.total_amount === -1 ? '' : data.total_amount}
                    onChange={(e) => setData('total_amount', parseFloat(e.target.value))}
                    placeholder="Total amount"
                />
                <InputError message={errors.total_amount} />
            </div>

            <div className="flex w-full flex-row gap-2">
                <Button
                    type="reset"
                    onClick={(e) => {
                        reset('price', 'total_amount');
                    }}
                    className="w-full bg-red-500 text-white hover:bg-red-600 dark:text-black"
                >
                    Cancel
                </Button>
                <Button type="submit" className="w-full bg-green-500 text-white hover:bg-green-600 dark:text-black">
                    Buy
                </Button>
            </div>
        </>
    );

    const priceComparisonChannel = echo.subscribe('PriceComparison.Pair.' + priceComparison.pair_symbol);
    priceComparisonChannel.bind('App\\Events\\PriceComparisonUpdated', function(data: any) {
        setPriceComparison(data.priceComparison);
    });

    const transactionsChannel = echo.subscribe('Transactions.Crypto.Id.' + crypto.id);
    transactionsChannel.bind('App\\Events\\TransactionInserted', function(data: any) {
        setVolume24hState(data.volume24h);
    });

    const recordChannel = echo.subscribe('Records.Pair.' + priceComparison.id);
    recordChannel.bind('App\\Events\\PriceRecordCreated', function(data: any) {
        setPriceRecords(() => [...priceRecordsState, data.priceRecord]);
    });

    useEffect(() => {
        setInfoPills(calculateInfoPills(crypto, priceComparison, volume24hState));
    }, [volume24hState, priceComparison]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crypto View"></Head>

            <div className="mt-[2rem] grid grid-cols-[0.4fr_1fr_0.4fr] p-1 2xl:grid-cols-[0.2fr_1fr_0.2fr]">
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
                            <CoinInfoPill
                                name="Market Cap"
                                value={infoPills.marketCap}
                                rawValue={infoPills.rawmc}
                                textClassName="text-sm"
                                dynamic
                                latest={infoPills.latest}
                            />
                            <CoinInfoPill
                                name="Volume (24h)"
                                value={infoPills.volume}
                                textClassName="text-sm"
                                rawValue={infoPills.rawvol}
                                dynamic
                                latest={infoPills.latest}
                            />
                            <CoinInfoPill name="FDV" value={infoPills.fdv} textClassName="text-sm" latest={infoPills.latest} />
                            <CoinInfoPill name="Vol/Mkt (24h)" value={infoPills.vol_mktCap} textClassName="text-sm" latest={infoPills.latest} />
                            <CoinInfoPill
                                name="Total supply"
                                value={infoPills.circulating_supply}
                                textClassName="text-sm"
                                latest={infoPills.latest}
                            />
                            <CoinInfoPill name="Max supply" value={infoPills.max_supply} textClassName="text-sm" latest={infoPills.latest} />
                            <CoinInfoPill
                                name="Circulating supply"
                                value={infoPills.circulating_supply}
                                textClassName="text-sm"
                                additionalClassName="col-span-2 flex justify-center"
                                latest={infoPills.latest}
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
                    <h2 className="w-full self-center border-b p-2 text-center text-xl font-black">{tab.toUpperCase()}</h2>

                    <div className="flex w-full flex-col items-center justify-center">
                        <div className="flex w-full flex-row border-b">
                            <button
                                onClick={() => {
                                    setTab('buy');
                                    setData('sold_id', priceComparison.child_id);
                                    setData('purchased_id', priceComparison.main_id);
                                    setData('order_type', 'buy');
                                }}
                                className={'w-full cursor-pointer rounded-t p-2 ' + (tab.match('buy') ? activeTab : '')}
                            >
                                Buy
                            </button>
                            <button
                                onClick={() => {
                                    setTab('sell');
                                    setData('sold_id', priceComparison.main_id);
                                    setData('purchased_id', priceComparison.child_id);
                                    setData('order_type', 'sell');
                                }}
                                className={'w-full cursor-pointer rounded-t p-2 ' + (tab.match('sell') ? activeTab : '')}
                            >
                                Sell
                            </button>
                        </div>

                        {tab.match('buy') ? (
                            <form onSubmit={submitBuy} className="flex w-full flex-col gap-2">
                                {formData}
                            </form>
                        ) : (
                            <form onSubmit={submitSell} className="flex w-full flex-col gap-2">
                                {formData}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
