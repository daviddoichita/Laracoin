import { PriceComparison } from '@/types/price-comparison';
import { UserBalance } from '@/types/user-balance';
import { useForm } from '@inertiajs/react';
import { useEchoPublic } from '@laravel/echo-react';
import { Copy } from 'lucide-react';
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

export interface DynamicBalanceProps {
    userBalance: UserBalance;
    priceComparison: PriceComparison;
}

export function DynamicBalance({ userBalance, priceComparison }: Readonly<DynamicBalanceProps>) {
    const [priceComparisonCopy, setPriceComparisonCopy] = useState<PriceComparison | undefined>(priceComparison);
    useEchoPublic(`Prices.Pair.${priceComparison?.id}`, 'PriceComparisonUpdated', (e: any) => {
        setPriceComparisonCopy(e.priceComparison);
    });

    return (
        <div className="flex w-full max-w-md min-w-[220px] flex-col items-center gap-4 rounded-2xl border bg-white/80 p-4 shadow transition-all dark:bg-neutral-950 dark:shadow dark:shadow-neutral-700">
            <div className="flex w-full flex-row justify-center gap-2 text-lg font-extrabold tracking-tight text-neutral-800 md:text-xl dark:text-neutral-100">
                <p>{userBalance.crypto.name}</p>
                <span className="text-neutral-400 dark:text-neutral-400">|</span>
                <p>{userBalance.crypto.symbol}</p>
            </div>
            <div className="flex w-full flex-row items-center justify-center gap-2 text-xs font-semibold text-neutral-600 md:text-sm dark:text-neutral-300">
                <p>
                    UUID: <span className="break-all">{userBalance.uuid}</span>
                </p>
                <Copy
                    height={16}
                    className="ml-1 hover:cursor-pointer"
                    onClick={(e) => {
                        navigator.clipboard.writeText(userBalance.uuid);
                        const icon = e.currentTarget;
                        icon.classList.add('hidden');
                        const checkIcon = document.createElement('div');
                        checkIcon.innerHTML =
                            '<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                        icon.parentNode?.insertBefore(checkIcon, icon);
                        setTimeout(() => {
                            checkIcon.remove();
                            icon.classList.remove('hidden');
                        }, 1000);
                    }}
                />
            </div>
            <div className="flex w-full flex-row flex-wrap gap-3">
                <div className="flex min-w-[120px] flex-1 flex-col items-center gap-1 rounded-md border bg-neutral-50 p-2 dark:bg-neutral-800">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Balance</p>
                    <p className="text-base font-bold md:text-lg">{userBalance.balance}</p>
                </div>
                <div className="flex min-w-[120px] flex-1 flex-col items-center gap-1 rounded-md border bg-neutral-50 p-2 dark:bg-neutral-800">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Euro value</p>
                    <p
                        className={`text-base font-bold md:text-lg ${priceComparisonCopy && priceComparisonCopy.last_update > 0 ? 'text-green-600' : 'text-red-500'}`}
                    >
                        {formatPrice(userBalance.balance * (priceComparisonCopy?.price ?? 0))}
                    </p>
                </div>
            </div>
            <div className="mt-2 flex w-full flex-col justify-center gap-2 md:flex-row">
                <Button
                    className="w-full flex-1 hover:cursor-pointer md:w-auto"
                    disabled={userBalance.balance <= 0}
                    onClick={() => {
                        window.location.href = route('transaction.new', { balance_id: userBalance.id });
                    }}
                >
                    Send
                </Button>
                <Button
                    className="w-full flex-1 bg-red-500 hover:cursor-pointer hover:bg-red-400 md:w-auto"
                    disabled={userBalance.balance <= 0}
                    onClick={() => {
                        window.location.href = route('crypto.show', { id: userBalance.crypto_id, state: 'sell', interval: '5m' });
                    }}
                >
                    Sell
                </Button>
                <Button
                    className="w-full flex-1 bg-green-500 hover:cursor-pointer hover:bg-green-400 md:w-auto"
                    onClick={() => {
                        window.location.href = route('crypto.show', { id: userBalance.crypto_id, state: 'buy', interval: '5m' });
                    }}
                >
                    Buy
                </Button>
            </div>
        </div>
    );
}

export interface StaticBalanceProps {
    userBalance: UserBalance;
}

export function StaticBalance({ userBalance }: Readonly<StaticBalanceProps>) {
    const [showAdd, setShowAdd] = useState(false);
    const [add, setAdd] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { post } = useForm();
    return (
        <div className="flex w-full max-w-md min-w-[220px] flex-col items-center gap-4 rounded-2xl border bg-white/80 p-4 shadow transition-all dark:bg-neutral-950 dark:shadow-neutral-700">
            <div className="flex w-full flex-row justify-center gap-2 text-lg font-extrabold tracking-tight text-neutral-800 md:text-xl dark:text-neutral-100">
                <p>{userBalance.crypto.name}</p>
                <span className="text-neutral-400 dark:text-neutral-400">|</span>
                <p>{userBalance.crypto.symbol}</p>
            </div>
            <div className="flex w-full flex-row items-center justify-center gap-2 text-xs font-semibold text-neutral-600 md:text-sm dark:text-neutral-300">
                <p>Cannot transfer euro</p>
            </div>
            <div className="flex w-full flex-row flex-wrap gap-3">
                <div className="flex min-w-[120px] flex-1 flex-col items-center gap-1 rounded-md border bg-neutral-50 p-2 dark:bg-neutral-800">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Balance</p>
                    <p className="text-base font-bold md:text-lg">{userBalance.balance}</p>
                </div>
                <div className="flex min-w-[120px] flex-1 flex-col items-center gap-1 rounded-md border bg-neutral-50 p-2 dark:bg-neutral-800">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Euro value</p>
                    <p className="text-base font-bold md:text-lg">{formatPrice(parseFloat(userBalance.balance.toString()))}</p>
                </div>
            </div>
            <div className="mt-2 flex w-full flex-col gap-2">
                <Button
                    onClick={() => {
                        setShowAdd(true);
                    }}
                    id="add-euro"
                    className="w-full hover:cursor-pointer"
                >
                    Add
                </Button>
                <div className={showAdd ? 'flex w-full flex-col items-center gap-2' : 'hidden'}>
                    <Input
                        name="add-euro"
                        id="add-euro"
                        type="number"
                        step={0.01}
                        autoComplete="price"
                        value={add ?? ''}
                        onChange={(e) => setAdd(parseFloat(e.target.value))}
                        className="w-full"
                    ></Input>
                    <p id="error" className="text-xs text-red-500">
                        {error}
                    </p>
                    <div className="flex w-full flex-row gap-2">
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
                            className="flex-1 bg-green-500 hover:cursor-pointer hover:bg-green-400"
                        >
                            Confirm
                        </Button>
                        <Button
                            onClick={() => {
                                setAdd(null);
                                setError(null);
                                setShowAdd(false);
                            }}
                            className="flex-1 bg-red-500 hover:cursor-pointer hover:bg-red-400"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
