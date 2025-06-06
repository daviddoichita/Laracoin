import CoinInfoPill from '@/components/coin-info-pill';
import { CryptoDashPillPrice } from '@/components/crypto-dash-pill-price';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Crypto } from '@/types/crypto';
import { PriceComparison } from '@/types/price-comparison';
import { PriceRecord } from '@/types/price-record';
import { UserBalance } from '@/types/user-balance';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEchoPublic } from '@laravel/echo-react';
import { FormEventHandler, JSX, useEffect, useState } from 'react';
import { Area, CartesianGrid, ComposedChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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
    let opts: any = { notation: 'compact' };
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
    const latest = parseFloat(priceComparison.last_update.toString());

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
    const [xDomainLeft, setXDomainLeft] = useState<Date | string>('');
    const [xDomainRight, setXDomainRight] = useState<Date | string>('');
    const [visibleData, setVisibleData] = useState<PriceRecord[]>(priceRecords);
    const [isZoomed, setIsZoomed] = useState<boolean>(false);
    const [yDomainBottom, setYDomainBottom] = useState<number>(0);
    const [yDomainTop, setYDomainTop] = useState<number>(0);

    const minPrice = Math.min(...visibleData.map((record) => record.price));
    const maxPrice = Math.max(...visibleData.map((record) => record.price));
    // const modRecords = visibleData.map((record) => ({
    //     ...record,
    //     price: record.price * 0.4,
    // }));

    useEffect(() => {
        if (!isZoomed) {
            setVisibleData(priceRecords);
        }
    }, [priceRecords, isZoomed]);

    const zoomIn = () => {
        if (xDomainLeft === xDomainRight || xDomainRight === '') {
            setXDomainLeft('');
            setXDomainRight('');
            return;
        }

        const fromIndex = priceRecords.findIndex((record) => record.created_at === xDomainLeft);
        const toIndex = priceRecords.findIndex((record) => record.created_at === xDomainRight);

        if (fromIndex === -1 || toIndex === -1) return;

        const startIndex = Math.min(fromIndex, toIndex);
        const endIndex = Math.max(fromIndex, toIndex);

        const filteredData = priceRecords.slice(startIndex, endIndex + 1);

        if (filteredData.length > 0) {
            const minPrice = Math.min(...filteredData.map((record) => record.price));
            const maxPrice = Math.max(...filteredData.map((record) => record.price));

            setVisibleData(filteredData);
            setIsZoomed(true);
            setYDomainBottom(minPrice - minPrice * 0.08);
            setYDomainTop(maxPrice + maxPrice * 0.08);
        }

        setXDomainLeft('');
        setXDomainRight('');
    };

    const zoomOut = () => {
        setVisibleData(priceRecords);
        setIsZoomed(false);
        setXDomainLeft('');
        setXDomainRight('');
        setYDomainBottom(0);
        setYDomainTop(0);
    };

    return (
        <div className="flex w-full flex-col">
            <ResponsiveContainer className="self-center" width="100%" height={600}>
                <ComposedChart
                    width={500}
                    height={300}
                    data={visibleData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 35,
                        bottom: 50,
                    }}
                    onMouseDown={(nextState) => nextState?.activeLabel && setXDomainLeft(nextState.activeLabel)}
                    onMouseMove={(nextState) => xDomainLeft && nextState?.activeLabel && setXDomainRight(nextState.activeLabel)}
                    onMouseUp={zoomIn}
                >
                    <defs>
                        <linearGradient id="colorPrice" x1={0} y1={0} x2={0} y2={1}>
                            <stop offset="5%" stopColor="#0069a8" stopOpacity={0.7} />
                            <stop offset="95%" stopColor="#0069a8" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#404040" strokeDasharray="3 3" />
                    <XAxis
                        dataKey="created_at"
                        tick={{ fontSize: 12, width: 100 }}
                        tickFormatter={(tick) => {
                            const tickDate = new Date(tick);
                            return `${tickDate.toLocaleDateString()} ${tickDate.toLocaleTimeString()}`;
                        }}
                        tickMargin={10}
                        scale="auto"
                        allowDataOverflow={true}
                    />
                    <YAxis
                        orientation="right"
                        dataKey="price"
                        domain={isZoomed ? [yDomainBottom, yDomainTop] : [minPrice - minPrice * 0.08, maxPrice + maxPrice * 0.08]}
                        tickFormatter={(tick) => {
                            return localeStringCompact(parseFloat(tick.toString()));
                        }}
                        allowDataOverflow={true}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="price"
                        activeDot={{ r: 4 }}
                        stroke="#0069a8"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                    />
                    {/* <Bar dataKey="price" data={modRecords} stroke="#0069a8" opacity={0.6} fill="#0069a8" /> */}

                    {xDomainLeft && xDomainRight ? (
                        <ReferenceArea
                            x1={xDomainLeft.toString()}
                            x2={xDomainRight.toString()}
                            strokeOpacity={0.3}
                            fill="#0069a8"
                            fillOpacity={0.2}
                        />
                    ) : null}
                </ComposedChart>
            </ResponsiveContainer>

            {isZoomed && (
                <button
                    onClick={zoomOut}
                    className="my-2 self-center rounded-md bg-sky-600 px-4 py-1 font-black text-white transition-colors hover:bg-sky-700"
                >
                    Zoom Out
                </button>
            )}
        </div>
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

const precisize = (n: number): number => {
    return Math.floor(n * 1e8) / 1e8;
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
    const activeTab = ' dark:bg-sky-800 dark:hover:bg-sky-900 bg-sky-500 hover:bg-sky-600 text-white';
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
        price: !customPrice ? priceComparison.price : null,
    });

    type TimeFrame = '5m' | '15m' | '30m' | '1h';
    const url = window.location.href.split('/');
    const [timeFrame, setTimeFrame] = useState<TimeFrame>(url[url.length - 1] as TimeFrame);
    const activeTimeFrame = ' dark:bg-sky-800 dark:hover:bg-sky-900 bg-sky-500 hover:bg-sky-600';

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!customPrice) {
            setData('price', priceComparison.price);
        }

        const balance = userBalance.find((u) => u.crypto_id === data.sold_id);
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
        <div className="space-y-4">
            <div className="mb-2 flex flex-col gap-1">
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span>Balance ({isBuying ? 'EUR' : crypto.symbol})</span>
                    <span className="ml-2 font-mono">
                        {localeStringNoCompact(userBalance.find((u) => u.crypto_id === data.sold_id)?.balance ?? 0, 8)}
                    </span>
                </div>
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span>Market price</span>
                    <span className="ml-2 font-mono">{localeStringNoCompact(priceComparison.price, 4)} EUR</span>
                </div>
            </div>

            <div>
                <Label htmlFor="price" className="flex items-center gap-2 text-sm font-medium">
                    <Checkbox
                        id="custom-price-check"
                        checked={customPrice}
                        onClick={(_e) => {
                            setCustomPrice(!customPrice);
                            setData('purchased_amount', null);
                            setData('sold_amount', null);
                        }}
                        className="mr-2"
                    />
                    Set custom price
                </Label>
                {customPrice && (
                    <div className="mt-2">
                        <Input
                            disabled={!customPrice}
                            name="price"
                            id="price"
                            type="number"
                            step={0.00000001}
                            autoComplete="price"
                            onChange={(e) => {
                                setData('price', parseFloat(e.target.value));
                                setData('purchased_amount', null);
                                setData('sold_amount', null);
                            }}
                            className="w-full"
                            placeholder="Enter custom price"
                        />
                        <InputError message={errors.price} />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="amount-crypto" className="text-sm font-medium">
                        {isBuying ? 'You buy' : 'You spend'} ({crypto.symbol})
                    </Label>
                    <Input
                        id="amount-crypto"
                        type="number"
                        step={0.00000001}
                        autoComplete="off"
                        value={isBuying ? (data.purchased_amount ?? '') : (data.sold_amount ?? '')}
                        onChange={(e) => setAmount(isBuying, parseFloat(e.target.value))}
                        className="mt-1 w-full"
                        placeholder={`Amount in ${crypto.symbol}`}
                    />
                    <InputError message={errors.purchased_amount} />
                </div>
                <div>
                    <Label htmlFor="amount-eur" className="text-sm font-medium">
                        {isBuying ? 'You spend' : 'You get'} (EUR)
                    </Label>
                    <Input
                        id="amount-eur"
                        type="number"
                        step={0.00000001}
                        autoComplete="off"
                        value={isBuying ? (data.sold_amount ?? '') : (data.purchased_amount ?? '')}
                        onChange={(e) => setAmount(!isBuying, parseFloat(e.target.value))}
                        className="mt-1 w-full"
                        placeholder="Amount in EUR"
                    />
                    <InputError message={errors.sold_amount} />
                </div>
            </div>

            <div className="flex w-full flex-row gap-2 pt-2">
                <Button
                    disabled={processing}
                    type="reset"
                    onClick={(e) => {
                        e.preventDefault();
                        setData('price', null);
                        setData('purchased_amount', null);
                        setData('sold_amount', null);
                    }}
                    className="w-1/2 bg-red-500 text-white hover:bg-red-600 dark:text-black"
                >
                    Cancel
                </Button>
                <Button type="submit" className="w-1/2 bg-green-500 text-white hover:bg-green-600 dark:text-black" disabled={processing}>
                    {isBuying ? 'Buy' : 'Sell'}
                </Button>
            </div>
        </div>
    );

    useEchoPublic(`Prices.Pair.${priceComparison?.id}`, 'PriceComparisonUpdated', (e: any) => {
        if (e.priceComparison?.pair_symbol.includes(crypto.symbol)) {
            setPriceComparison(e.priceComparison);
        }
    });

    useEchoPublic(`Prices.Pair.${priceComparison?.id}.${timeFrame}`, 'PriceRecordCreated', (e: any) => {
        if (e.priceRecord?.pair_id === priceComparison?.id) {
            setPriceRecordsState(() => [...priceRecordsState, e.priceRecord]);
        }
    });

    useEffect(() => {
        setInfoPills(calculateInfoPills(crypto, priceComparison, volume24hState));
    }, [volume24hState, priceComparison]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crypto View"></Head>

            <div className="mt-8 grid w-full grid-cols-1 gap-8 self-center px-2 xl:grid-cols-12 xl:gap-2">
                <section className="order-2 flex flex-col gap-6 rounded-lg bg-white/70 p-4 shadow xl:order-1 xl:col-span-3 dark:bg-neutral-900/70">
                    <h2 className="mb-2 w-full border-b pb-2 text-center text-xl font-black">Coin info and metrics</h2>
                    <CryptoDashPillPrice
                        id="cryptoPrice"
                        priceComparison={priceComparison}
                        className="mt-2 self-center text-2xl"
                        maxFractionDigits={2}
                        smallTextClassName="text-[0.8rem]"
                        arrowSize={18}
                    />
                    <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-2">
                        <CoinInfoPill
                            name="Market Cap"
                            value={infoPills.marketCap}
                            rawValue={infoPills.rawmc}
                            textClassName="text-sm"
                            dynamic
                            latest={infoPills.latest}
                        />
                        <CoinInfoPill name="FDV" value={infoPills.fdv} textClassName="text-sm" latest={infoPills.latest} />
                        <CoinInfoPill name="Total supply" value={infoPills.circulating_supply} textClassName="text-sm" latest={infoPills.latest} />
                        <CoinInfoPill name="Max supply" value={infoPills.max_supply} textClassName="text-sm" latest={infoPills.latest} />
                        <CoinInfoPill
                            name="Circulating supply"
                            value={infoPills.circulating_supply}
                            textClassName="text-sm"
                            additionalClassName="col-span-2 md:col-span-1 flex justify-center"
                            latest={infoPills.latest}
                        />
                    </div>
                </section>

                <section className="order-1 flex flex-col gap-6 rounded-lg bg-white/70 p-4 shadow xl:order-2 xl:col-span-6 dark:bg-neutral-900/70">
                    <h2 className="mb-2 w-full border-b pb-2 text-center text-xl font-black">{crypto.symbol}&nbsp;&nbsp;|&nbsp;&nbsp;EUR</h2>
                    <div className="mb-2 flex w-full flex-row justify-center gap-2">
                        {(['5m', '15m', '30m', '1h'] as const).map((tf) => (
                            <button
                                key={tf}
                                className={
                                    'w-full rounded px-2 py-1 text-sm font-semibold transition-colors ' +
                                    (timeFrame === tf
                                        ? activeTimeFrame
                                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700')
                                }
                                onClick={() => (window.location.href = route('crypto.show', { id: crypto.id, interval: tf }))}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>
                    <div className="min-h-[300px]">
                        <CryptoPriceChart priceRecords={priceRecordsState} />
                    </div>
                </section>

                <section className="order-3 flex flex-col gap-6 rounded-lg bg-white/70 p-4 shadow xl:order-3 xl:col-span-3 dark:bg-neutral-900/70">
                    <h2 className="mb-2 w-full border-b pb-2 text-center text-xl font-black">{tab.toUpperCase()}</h2>
                    <div className="flex w-full flex-col items-center justify-center">
                        <div className="mb-4 flex w-full flex-row gap-2">
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
                                className={
                                    'w-1/2 rounded p-2 font-black transition-colors ' +
                                    (isBuying ? activeTab : 'bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700')
                                }
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
                                className={
                                    'w-1/2 rounded p-2 font-black transition-colors ' +
                                    (!isBuying ? activeTab : 'bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700')
                                }
                            >
                                Sell
                            </button>
                        </div>
                        <form onSubmit={submit} className="flex w-full flex-col gap-2">
                            {formData}
                        </form>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
