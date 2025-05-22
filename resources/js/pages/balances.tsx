import { DynamicBalance, StaticBalance } from '@/components/balance-pill';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { PriceComparison } from '@/types/price-comparison';
import { UserBalance } from '@/types/user-balance';
import { Head } from '@inertiajs/react';
import Fuse from 'fuse.js';
import { useEffect, useRef, useState } from 'react';

export interface BalancesProps {
    userBalances: UserBalance[];
    priceComparison: PriceComparison[];
}

export default function Balances({ userBalances, priceComparison }: Readonly<BalancesProps>) {
    const [filteredBalances, setFilteredBalances] = useState(userBalances);
    const [filtering, setFiltering] = useState(false);
    const [query, setQuery] = useState('');
    const userBalancesRef = useRef(userBalances);
    const fuse = new Fuse(userBalances, {
        keys: ['crypto.symbol', 'crypto.name', 'uuid'],
    });

    const filter = () => {
        setFiltering(true);
        const trimmed = query.trim().toLocaleLowerCase();

        if (trimmed === '') {
            setFilteredBalances(userBalancesRef.current);
            setFiltering(false);
            return;
        }

        setFilteredBalances(fuse.search(trimmed).map((result) => result.item));
    };

    useEffect(() => filter(), [query]);

    return (
        <AppLayout>
            <Head title="My balances" />
            <div className="mt-5 mb-5 flex w-[40%] max-w-7xl flex-row gap-2 self-center">
                {filtering ? (
                    <Button
                        onClick={() => {
                            setFiltering(false);
                            setFilteredBalances(userBalancesRef.current);
                            setQuery('');
                        }}
                        className="bg-neutral-100 text-black hover:cursor-pointer hover:bg-neutral-300 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                    >
                        Clear
                    </Button>
                ) : (
                    <></>
                )}
                <Input
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            filter();
                        }
                    }}
                    onInput={(e) => setQuery(e.currentTarget.value)}
                    value={query}
                    placeholder="Search"
                ></Input>
            </div>

            <div className="mt-10 flex max-w-7xl min-w-7xl flex-row flex-wrap gap-3 self-center">
                {filteredBalances
                    .toSorted((a, b) => a.id - b.id)
                    .map((v, _i) => {
                        const pairSymbol = `${v.crypto.symbol}_EUR`;
                        const priceComp = priceComparison.find((pc) => pc.pair_symbol === pairSymbol);
                        if (!v.crypto.disabled && priceComp) {
                            return <DynamicBalance userBalance={v} priceComparison={priceComp} key={v.id} />;
                        } else if (!v.crypto.disabled && !priceComp) {
                            return <StaticBalance key={v.id} userBalance={v} />;
                        }
                    })}
            </div>
        </AppLayout>
    );
}
