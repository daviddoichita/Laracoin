import CoinInfoPill from '@/components/coin-info-pill';
import { CryptoDashPillPrice } from '@/components/crypto-dash-pill-price';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import getEchoConnection from '@/rtSocket';
import { BreadcrumbItem, SharedData } from '@/types';
import { Crypto } from '@/types/crypto';
import { PriceComparison } from '@/types/price-comparison';
import { PriceRecord } from '@/types/price-record';
import { UserBalance } from '@/types/user-balance';
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
    userBalance: UserBalance[];
}

const localeString = (n: number, compact: boolean, maxFracDigits?: number) => {
    let opts: any = { style: 'currency', currency: 'EUR', notation: 'compact' };
    if (compact) {
        opts = { notation: 'compact', ...opts };
    }
    if (maxFracDigits) {
        opts = { maximumFractionDigits: maxFracDigits, ...opts };
    }
    return n.toLocaleString('es-ES', opts);
};

const localeStringCompact = (n: number, maxFractionDigits?: number) => {
    return localeString(n, true, maxFractionDigits);
};

const localeStringNoCompact = (n: number, maxFractionDigits?: number) => {
    return localeString(n, false, maxFractionDigits);
};

const calculateInfoPills = (crypto: Crypto, priceComparison: PriceComparison, volume24h: number) => {
    const price = priceComparison.price;

    const marketCap = localeStringCompact(crypto.circulating_supply * price);
    const volume = localeStringCompact(volume24h * price);
    const fdv = crypto.max_supply === -1 ? marketCap : localeStringCompact(crypto.max_supply * price);
    const vol_mktCap = (((volume24h * price) / (crypto.circulating_supply * price)) * 100).toLocaleString('es-ES', {
        style: 'percent',
        maximumFractionDigits: 4,
    });
    const max_supply = localeStringCompact(crypto.max_supply);
    const circulating_supply = localeStringCompact(crypto.circulating_supply);

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
    if (active && payload?.length) {
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
                        return localeStringCompact(parseFloat(tick));
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
    sold_amount: number | null;
    purchased_amount: number | null;
    price: number | null;
};

const truncateTo8Decimals = (n: number): number => {
    return Math.floor(n * 1e8) / 1e8;
};

const precisize = (n: number): number => {
    return truncateTo8Decimals(n);
};

export default function CryptoView({ crypto, volume24h, priceRecords, state, userBalance }: Readonly<CryptoViewProps>) {
    useEffect(() => {
        if (!crypto) {
            window.location.href = route('dashboard');
        }
    }, []);

    const { auth } = usePage<SharedData>().props;

    const [priceComparison, setPriceComparison] = useState(crypto.main_price_comparison[0]);
    const [volume24hState, setVolume24hState] = useState(volume24h);
    const [infoPills, setInfoPills] = useState(calculateInfoPills(crypto, priceComparison, volume24h));
    const [priceRecordsState, setPriceRecordsState] = useState(priceRecords);

    const [tab, setTab] = useState(state ?? 'buy');
    const activeTab = ' dark:bg-sky-800 dark:hover:bg-sky-900 bg-sky-500 hover:bg-sky-600';
    const [customPrice, setCustomPrice] = useState(false);
    const [isBuying, setIsBuying] = useState(tab === 'buy');

    const currentCryptoBalance = userBalance.find((u) => u.crypto_id === priceComparison.main_id)?.balance ?? 0;
    const euroBalance = userBalance.find((u) => u.crypto_id === priceComparison.child_id)?.balance ?? 0;

    const { data, setData, post, processing, errors, setError } = useForm<Required<OrderForm>>({
        user_id: auth.user.id,
        sold_id: tab === 'buy' ? priceComparison.child_id : priceComparison.main_id,
        purchased_id: tab === 'buy' ? priceComparison.main_id : priceComparison.child_id,
        order_type: state ?? 'buy',
        sold_amount: null,
        purchased_amount: null,
        price: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!customPrice) {
            setData('price', priceComparison.price);
        }

        const balance = userBalance.find((u) => u.crypto_id === data.sold_id);
        console.log(balance);
        if (balance) {
            if (balance.balance > 0 && data.sold_amount && data.sold_amount <= balance.balance) {
                post(route('new-order'));
            } else {
                setError('sold_amount', 'Quantity is greater than available balance');
            }
        }
    };

    const setAmount = (pur: boolean, am: number) => {
        const price = customPrice ? (data.price ?? 0) : priceComparison.price;
        const amount = precisize(am);
        if (isBuying) {
            if (pur) {
                setData('purchased_amount', amount);
                setData('sold_amount', precisize(amount * price));
            } else {
                setData('sold_amount', amount);
                setData('purchased_amount', precisize(amount * (1 / price)));
            }
        } else if (pur) {
            setData('purchased_amount', amount);
            setData('sold_amount', precisize(amount * (1 / price)));
        } else {
            setData('sold_amount', amount);
            setData('purchased_amount', precisize(amount * price));
        }
    };

    useEffect(() => {
        if (!customPrice && data.purchased_amount && data.sold_amount) {
            isBuying ? setAmount(isBuying, data.purchased_amount ?? 0) : setAmount(isBuying, data.sold_amount ?? 0);
        }
    }, [priceComparison.price]);

    const formData: JSX.Element = (
        <>
            <div className="mt-4 flex w-full flex-col font-black">
                <p>
                    Available balance ({!isBuying ? crypto.symbol : 'EUR'}):{' '}
                    {parseFloat(userBalance.find((u) => u.crypto_id === data.sold_id)?.balance.toString() ?? '').toLocaleString('es-ES', {
                        maximumFractionDigits: 8,
                    })}
                </p>
            </div>
            <div className="flex w-full flex-col font-black">
                <p>
                    Price: ~
                    {parseFloat(priceComparison.price.toString()).toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                        maximumFractionDigits: 2,
                    })}
                </p>
            </div>
            <div className="flex w-full flex-col">
                <Label htmlFor="price" className="text-md flex items-center gap-2">
                    Custom price
                    <Checkbox
                        id="custom-price-check"
                        checked={customPrice}
                        onClick={(_e) => {
                            setCustomPrice(!customPrice);
                            setData('purchased_amount', null);
                            setData('sold_amount', null);
                        }}
                    />
                </Label>
                {customPrice ? (
                    <>
                        <Input
                            disabled={!customPrice}
                            name="price"
                            id="price"
                            type="number"
                            step={0.00000001}
                            autoFocus
                            autoComplete="price"
                            onChange={(e) => {
                                setData('price', parseFloat(e.target.value));
                                setData('purchased_amount', null);
                                setData('sold_amount', null);
                            }}
                        />
                        <InputError message={errors.price} />
                    </>
                ) : (
                    <></>
                )}
            </div>

            <div className="flex w-full flex-col">
                <Label htmlFor="price" className="text-md">
                    {isBuying ? 'You buy' : 'You spend'} ({crypto.symbol})
                </Label>
                <Input
                    name="price"
                    id="price"
                    type="number"
                    step={0.00000001}
                    autoFocus
                    autoComplete="price"
                    value={isBuying ? (data.purchased_amount ?? '') : (data.sold_amount ?? '')}
                    onChange={(e) => setAmount(isBuying, parseFloat(e.target.value))}
                />
                <InputError message={errors.purchased_amount} />
            </div>
            <div className="flex w-full flex-col">
                <Label htmlFor="price" className="text-md">
                    {isBuying ? 'You spend' : 'You get'} (EUR)
                </Label>
                <Input
                    name="price"
                    id="price"
                    type="number"
                    step={0.00000001}
                    autoFocus
                    autoComplete="price"
                    value={isBuying ? (data.sold_amount ?? '') : (data.purchased_amount ?? '')}
                    onChange={(e) => setAmount(!isBuying, parseFloat(e.target.value))}
                />
                <InputError message={errors.sold_amount} />
            </div>

            <div className="flex w-full flex-row gap-2">
                <Button
                    disabled={processing}
                    type="reset"
                    onClick={(e) => {
                        e.preventDefault();
                        setData('price', null);
                        setData('purchased_amount', null);
                        setData('sold_amount', null);
                    }}
                    className="w-full bg-red-500 text-white hover:bg-red-600 dark:text-black"
                >
                    Cancel
                </Button>
                <Button type="submit" className="w-full bg-green-500 text-white hover:bg-green-600 dark:text-black" disabled={processing}>
                    Buy
                </Button>
            </div>
        </>
    );

    const { pairs } = getEchoConnection(auth.user, priceComparison.id);

    pairs?.bind('App\\Events\\PriceComparisonUpdated', function (data: any) {
        const dataPriceComp: PriceComparison = data.priceComparison;
        if (dataPriceComp.pair_symbol.includes(crypto.symbol)) {
            setPriceComparison(data.priceComparison);
        }
    });
    // rtSocket.bind('App\\Events\\TransactionInserted', function (data: any) {
    //     setVolume24hState(data.volume24h);
    // });
    pairs?.bind('App\\Events\\PriceRecordCreated', function (data: any) {
        const dataPriceRecord: PriceRecord = data.priceRecord;
        if (dataPriceRecord.pair_id === priceComparison.id) {
            setPriceRecordsState(() => [...priceRecordsState, dataPriceRecord]);
        }
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
                        <div className="flex w-full flex-row">
                            <button
                                disabled={processing || euroBalance <= 0}
                                onClick={() => {
                                    setTab('buy');
                                    setIsBuying(true);
                                    setData('sold_id', priceComparison.child_id);
                                    setData('purchased_id', priceComparison.main_id);
                                    setData('purchased_amount', null);
                                    setData('sold_amount', null);
                                    setData('order_type', 'buy');
                                }}
                                className={'w-full cursor-pointer rounded p-2 ' + (isBuying ? activeTab : '')}
                            >
                                Buy
                            </button>
                            <button
                                disabled={processing || currentCryptoBalance <= 0}
                                onClick={() => {
                                    setTab('sell');
                                    setIsBuying(false);
                                    setData('sold_id', priceComparison.main_id);
                                    setData('purchased_id', priceComparison.child_id);
                                    setData('purchased_amount', null);
                                    setData('sold_amount', null);
                                    setData('order_type', 'sell');
                                }}
                                className={'w-full cursor-pointer rounded p-2 ' + (!isBuying ? activeTab : '')}
                            >
                                Sell
                            </button>
                        </div>

                        <form onSubmit={submit} className="flex w-full flex-col gap-2">
                            {formData}
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
