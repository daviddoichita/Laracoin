import { PriceComparison } from '@/types/price-comparison';
import { UserBalance } from '@/types/user-balance';
import { useForm } from '@inertiajs/react';
import { useEchoPublic } from '@laravel/echo-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export interface BalancePillProps {
    userBalance: UserBalance;
    priceComparison?: PriceComparison;
}

const formatPrice = (n: number) => {
    return isNaN(n) ? 'Loading...' : n.toLocaleString('es-ES', { maximumFractionDigits: 2, style: 'currency', currency: 'EUR' });
};

interface DynamicBalanceProps {
    userBalance: UserBalance;
    priceComparison: PriceComparison;
}

function DynamicBalance({ userBalance, priceComparison }: Readonly<DynamicBalanceProps>) {
    const [priceComparisonCopy, setPriceComparisonCopy] = useState<PriceComparison | undefined>(priceComparison);
    useEchoPublic(`Prices.Pair.${priceComparison?.id}`, 'PriceComparisonUpdated', (e: any) => {
        setPriceComparisonCopy(e.priceComparison);
    });

    return (
        <div className="flex w-[32.5%] flex-col items-center gap-3 rounded-xl border p-3 shadow dark:shadow-neutral-500">
            <div className="flex w-full flex-row justify-center gap-3 text-xl font-black">
                <p>{userBalance.crypto.name}</p>
                <p>{userBalance.crypto.symbol}</p>
            </div>
            <div className="flex w-full flex-row flex-wrap gap-3">
                <div className="flex w-[48.4%] flex-col items-center gap-2 rounded-sm border p-2">
                    <p>Balance</p>
                    <p>{userBalance.balance}</p>
                </div>
                <div className="flex w-[48.4%] flex-col items-center gap-2 rounded-sm border p-2">
                    <p>Locked balance</p>
                    <p>{userBalance.locked_balance}</p>
                </div>
                <div className="flex w-[48.4%] flex-col items-center gap-2 rounded-sm border p-2">
                    <p>Euro value</p>
                    <p className={priceComparisonCopy && priceComparisonCopy.last_update > 0 ? 'text-green-500' : 'text-red-500'}>
                        {formatPrice(userBalance.balance * (priceComparisonCopy?.price ?? 0))}
                    </p>
                </div>
                <div className="flex w-[48.4%] flex-col items-center gap-2 rounded-sm border p-2">
                    <p>Locked euro value</p>
                    <p className={priceComparisonCopy && priceComparisonCopy.last_update > 0 ? 'text-green-500' : 'text-red-500'}>
                        {formatPrice(userBalance.locked_balance * (priceComparisonCopy?.price ?? 0))}
                    </p>
                </div>
            </div>
            <div className="flex w-full flex-row justify-center gap-3">
                <Button
                    className="w-full bg-red-500 hover:cursor-pointer hover:bg-red-400"
                    disabled={userBalance.balance <= 0}
                    onClick={() => {
                        window.location.href = route('crypto.show', { id: userBalance.crypto_id, state: 'sell' });
                    }}
                >
                    Sell
                </Button>
                <Button
                    className="w-full bg-green-500 hover:cursor-pointer hover:bg-green-400"
                    onClick={() => {
                        window.location.href = route('crypto.show', { id: userBalance.crypto_id, state: 'buy' });
                    }}
                >
                    Buy
                </Button>
            </div>
        </div>
    );
}

interface StaticBalanceProps {
    userBalance: UserBalance;
}

function StaticBalance({ userBalance }: Readonly<StaticBalanceProps>) {
    const [showAdd, setShowAdd] = useState(false);
    const [add, setAdd] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { post } = useForm();
    return (
        <div className="flex w-[32.5%] flex-col items-center gap-3 rounded-xl border p-3 shadow dark:shadow-neutral-500">
            <div className="flex w-full flex-row justify-center gap-3 text-xl font-black">
                <p>{userBalance.crypto.name}</p>
                <p>{userBalance.crypto.symbol}</p>
            </div>
            <div className="flex w-full flex-row flex-wrap gap-3">
                <div className="flex w-[48.4%] flex-col items-center gap-2 rounded-sm border p-2">
                    <p>Balance</p>
                    <p>{userBalance.balance}</p>
                </div>
                <div className="flex w-[48.4%] flex-col items-center gap-2 rounded-sm border p-2">
                    <p>Locked balance</p>
                    <p>{userBalance.locked_balance}</p>
                </div>
                <div className="flex w-[48.4%] flex-col items-center gap-2 rounded-sm border p-2">
                    <p>Euro value</p>
                    <p>{formatPrice(parseFloat(userBalance.balance.toString()))}</p>
                </div>
                <div className="flex w-[48.4%] flex-col items-center gap-2 rounded-sm border p-2">
                    <p>Locked euro value</p>
                    <p>{formatPrice(parseFloat(userBalance.locked_balance.toString()))}</p>
                </div>
            </div>
            <div className="flex w-full flex-row justify-center gap-3">
                <div className="flex w-full flex-col gap-3">
                    <Button
                        onClick={() => {
                            setShowAdd(true);
                        }}
                        id="add-euro"
                        className="w-full hover:cursor-pointer"
                    >
                        Add
                    </Button>
                    <div className={showAdd ? 'flex flex-col items-center gap-2' : 'hidden'}>
                        <Input
                            name="add-euro"
                            id="add-euro"
                            type="number"
                            step={0.01}
                            autoComplete="price"
                            value={add ?? ''}
                            onChange={(e) => setAdd(parseFloat(e.target.value))}
                        ></Input>
                        <p id="error" className="text-red-500">
                            {error}
                        </p>
                        <Button
                            onClick={() => {
                                if (add !== null) {
                                    setError(null);
                                    setShowAdd(false);
                                    setAdd(null);
                                    post(route('add-euro', { euro: add }));
                                } else {
                                    setError('You must add an amount');
                                }
                            }}
                            className="w-full bg-green-500 hover:cursor-pointer hover:bg-green-400"
                        >
                            Confirm
                        </Button>
                        <Button
                            onClick={() => {
                                setAdd(null);
                                setError(null);
                                setShowAdd(false);
                            }}
                            className="w-full bg-red-500 hover:cursor-pointer hover:bg-red-400"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BalancePill({ userBalance, priceComparison }: Readonly<BalancePillProps>) {
    return priceComparison ? (
        <DynamicBalance userBalance={userBalance} priceComparison={priceComparison}></DynamicBalance>
    ) : (
        <StaticBalance userBalance={userBalance}></StaticBalance>
    );
}
