import BalancePill from '@/components/balance-pill';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { UserBalance } from '@/types/user-balance';
import { Head } from '@inertiajs/react';
import Fuse from 'fuse.js';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useRef, useState } from 'react';

export interface BalancesProps {
    userBalances: UserBalance[];
}

export default function Balances({ userBalances }: Readonly<BalancesProps>) {
    const [filteredBalances, setFilteredBalances] = useState(userBalances);
    const [filtering, setFiltering] = useState(false);
    const [query, setQuery] = useState('');
    const userBalancesRef = useRef(userBalances);
    const fuse = new Fuse(userBalances, {
        keys: ['crypto.symbol', 'crypto.name'],
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
                <Button
                    onClick={() => filter()}
                    className="bg-neutral-100 hover:cursor-pointer hover:bg-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                >
                    <DynamicIcon name="search" className="text-black dark:text-white"></DynamicIcon>
                </Button>
            </div>

            <div className="mt-10 flex max-w-7xl min-w-7xl flex-row flex-wrap gap-3 self-center">
                {filteredBalances
                    .toSorted((a, b) => a.id - b.id)
                    .map((v, _i) => {
                        if (!v.crypto.disabled) return <BalancePill userBalance={v} key={v.id} />;
                    })}
            </div>
        </AppLayout>
    );
}
