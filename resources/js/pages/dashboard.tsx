import { CryptoDashPill } from '@/components/crypto-dash-pill';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Crypto } from '@/types/crypto';
import { Head } from '@inertiajs/react';
import Fuse from 'fuse.js';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    cryptos: Crypto[];
}

export default function Dashboard({ cryptos }: DashboardProps) {
    const [filteredCryptos, setFilteredCryptos] = useState(cryptos);
    const [filtering, setFiltering] = useState(false);
    const [serachQuery, setSearchQuery] = useState('');
    const cryptosRef = useRef(cryptos);
    const fuse = new Fuse(cryptos, { keys: ['name', 'symbol'] });

    const filter = () => {
        setFiltering(true);
        const trimmed = serachQuery.trim().toLocaleLowerCase();

        if (trimmed === '') {
            setFilteredCryptos(cryptosRef.current);
            setFiltering(false);
            return;
        }

        // setFilteredCryptos(cryptosRef.current.filter((crypto) => crypto.name.toLowerCase().includes(trimmed)));
        setFilteredCryptos(fuse.search(trimmed).map((result) => result.item));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="mt-5 flex w-[40%] flex-row gap-2 self-center">
                {filtering ? (
                    <Button
                        onClick={() => {
                            setFiltering(false);
                            setFilteredCryptos(cryptosRef.current);
                            setSearchQuery('');
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
                    onInput={(e) => setSearchQuery(e.currentTarget.value)}
                    value={serachQuery}
                    placeholder="Search"
                ></Input>
                <Button
                    onClick={() => filter()}
                    className="bg-neutral-100 hover:cursor-pointer hover:bg-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                >
                    <DynamicIcon name="search" className="text-black dark:text-white"></DynamicIcon>
                </Button>
            </div>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                <div className="flex w-full flex-col items-center justify-center gap-5">
                    {filteredCryptos.map(function (crypto, i) {
                        if (crypto.symbol !== 'EUR') {
                            return <CryptoDashPill key={i} crypto={crypto} />;
                        }
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
