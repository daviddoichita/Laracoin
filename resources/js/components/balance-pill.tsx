import echo from '@/echo';
import { PriceComparison } from '@/types/price-comparison';
import { UserBalance } from '@/types/user-balance';
import { ReactNode, useEffect, useState } from 'react';
import { Button } from './ui/button';

export interface BalanceInfoPillProps {
    children: ReactNode;
}

function BalanceInfoPill({ children }: BalanceInfoPillProps) {
    return <div className="flex w-[48.4%] flex-col items-center gap-2 rounded-sm border p-2">{children}</div>;
}

export interface BalancePillProps {
    userBalance: UserBalance;
}

const formatPrice = (n: number) => {
    return isNaN(n) ? 'Loading...' : n.toLocaleString('es-ES', { maximumFractionDigits: 2, style: 'currency', currency: 'EUR' });
};

export default function BalancePill({ userBalance }: BalancePillProps) {
    const [priceComparison, setPriceComparison] = useState({} as PriceComparison);
    const pairSymbol = `${userBalance.crypto.symbol}_EUR`;

    useEffect(() => {
        fetch(route('comparison_by_pair', { symbol: pairSymbol }))
            .then((response) => response.json())
            .then((json) => {
                setPriceComparison(json[0] as PriceComparison);
            })
            .catch((error) => console.error(error));
    }, []);

    if (userBalance.crypto.symbol !== 'EUR') {
        const priceComparisonChannel = echo.subscribe('PriceComparison.Pair.' + pairSymbol);
        priceComparisonChannel.bind('App\\Events\\PriceComparisonUpdated', function (data: any) {
            setPriceComparison(data.priceComparison);
        });
    }

    return (
        <>
            <div className="flex w-[32.5%] flex-col items-center gap-3 rounded-xl border p-3">
                <div className="flex w-full flex-row justify-center gap-3 text-xl font-black">
                    <p>{userBalance.crypto.name}</p>
                    <p>{userBalance.crypto.symbol}</p>
                </div>
                <div className="flex w-full flex-row flex-wrap gap-3">
                    <BalanceInfoPill>
                        <p>Balance</p>
                        <p>{userBalance.balance}</p>
                    </BalanceInfoPill>
                    <BalanceInfoPill>
                        <p>Locked balance</p>
                        <p>{userBalance.locked_balance}</p>
                    </BalanceInfoPill>
                    <BalanceInfoPill>
                        <p>Euro value</p>
                        {userBalance.crypto.symbol === 'EUR' ? (
                            <p>{formatPrice(userBalance.balance)}</p>
                        ) : (
                            <p className={priceComparison.last_update > 0 ? 'text-green-500' : 'text-red-500'}>
                                {formatPrice(userBalance.balance * priceComparison.price)}
                            </p>
                        )}
                    </BalanceInfoPill>
                    <BalanceInfoPill>
                        <p>Locked euro value</p>
                        {userBalance.crypto.symbol === 'EUR' ? (
                            <p>{formatPrice(userBalance.locked_balance)}</p>
                        ) : (
                            <p className={priceComparison.last_update > 0 ? 'text-green-500' : 'text-red-500'}>
                                {formatPrice(userBalance.locked_balance * priceComparison.price)}
                            </p>
                        )}
                    </BalanceInfoPill>
                </div>
                <div className="flex w-full flex-row justify-center gap-3">
                    {userBalance.crypto.symbol === 'EUR' ? (
                        <Button className="w-full hover:cursor-pointer">Add</Button>
                    ) : (
                        <>
                            <Button
                                className="w-full bg-red-500 hover:cursor-pointer hover:bg-red-400"
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
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
