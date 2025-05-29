import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { checkRole, shortUUID } from '@/lib/utils';
import { BreadcrumbItem, SharedData } from '@/types';
import { Crypto } from '@/types/crypto';
import { Head, useForm, usePage } from '@inertiajs/react';
import Fuse from 'fuse.js';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cryptos list',
        href: '/crypto/list',
    },
];

export interface ListCryptosProps {
    cryptos: Crypto[];
}

export default function ListCryptos({ cryptos }: Readonly<ListCryptosProps>) {
    const { post } = useForm<{}>({});
    const { auth } = usePage<SharedData>().props;
    const [query, setQuery] = useState('');
    const [filtering, setFiltering] = useState(false);
    const cryptosRef = useRef(cryptos);
    const [filteredCryptos, setFilteredCryptos] = useState(cryptos);
    const fuse = new Fuse(cryptos, { keys: ['name', 'symbol'] });

    useEffect(() => {
        checkRole(auth);
    }, []);

    useEffect(() => {
        if (filtering) {
            filter();
        } else {
            setFilteredCryptos(cryptos);
        }
    }, [cryptos]);

    const filter = () => {
        setFiltering(true);
        const trimmed = query.trim().toLocaleLowerCase();

        if (trimmed === '') {
            setFilteredCryptos(cryptosRef.current);
            setFiltering(false);
            return;
        }

        setFilteredCryptos(fuse.search(trimmed).map((result) => result.item));
    };

    const disable = (id: number) => {
        post(route('crypto.disable', { id: id }));
    };

    return (
        <AppLayout>
            <Head title="Cryptos list" />

            <div className={'mt-5 mb-5 flex w-full max-w-4xl flex-row gap-2 self-center px-2 ' + (auth.user.admin ? '' : 'hidden')}>
                <div className="flex w-full flex-row items-center justify-center gap-2 rounded-lg p-3 md:gap-3 md:p-4 dark:bg-neutral-950">
                    {filtering && (
                        <Button
                            onClick={() => {
                                setFiltering(false);
                                setFilteredCryptos(cryptosRef.current);
                                setQuery('');
                            }}
                            className="bg-neutral-200 text-black hover:bg-neutral-300 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
                        >
                            Clear
                        </Button>
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
                        className="min-w-0 flex-1"
                    />
                    <Button onClick={() => filter()} className="bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700">
                        <DynamicIcon name="search" className="text-black dark:text-white" />
                    </Button>
                </div>
            </div>

            <div className={'flex w-full justify-center overflow-x-auto px-2 ' + (auth.user.admin ? '' : 'hidden')}>
                <table className="w-full max-w-7xl min-w-[600px] border-separate rounded-lg bg-white shadow-md dark:bg-neutral-900">
                    <thead className="text-base md:text-lg">
                        <tr>
                            <th className="rounded-tl-lg border border-neutral-200 bg-neutral-100 p-3 font-semibold dark:border-neutral-700 dark:bg-neutral-800">
                                Name
                            </th>
                            <th className="border border-neutral-200 bg-neutral-100 p-3 font-semibold dark:border-neutral-700 dark:bg-neutral-800">
                                Symbol
                            </th>
                            <th className="border border-neutral-200 bg-neutral-100 p-3 font-semibold dark:border-neutral-700 dark:bg-neutral-800">
                                Max supply
                            </th>
                            <th className="border border-neutral-200 bg-neutral-100 p-3 font-semibold dark:border-neutral-700 dark:bg-neutral-800">
                                Circulating supply
                            </th>
                            <th className="border border-neutral-200 bg-neutral-100 p-3 font-semibold dark:border-neutral-700 dark:bg-neutral-800">
                                View
                            </th>
                            <th className="border border-neutral-200 bg-neutral-100 p-3 font-semibold dark:border-neutral-700 dark:bg-neutral-800">
                                Disable
                            </th>
                            <th className="rounded-tr-lg border border-neutral-200 bg-neutral-100 p-3 font-semibold dark:border-neutral-700 dark:bg-neutral-800">
                                Delete
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCryptos
                            .toSorted((a, b) => {
                                if (a.disabled === b.disabled) {
                                    return 0;
                                }
                                return a.disabled ? 1 : -1;
                            })
                            .map((v) => {
                                const tdClass = 'border border-neutral-200 text-center p-2 md:p-3 align-middle dark:border-neutral-700';
                                const faded = v.disabled ? ' opacity-50' : '';
                                return (
                                    <tr key={shortUUID()} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
                                        <td className={tdClass + faded}>{v.name}</td>
                                        <td className={tdClass + faded}>{v.symbol}</td>
                                        <td className={tdClass + faded}>{v.max_supply === -1 ? 'INF' : v.max_supply}</td>
                                        <td className={tdClass + faded}>{v.circulating_supply === -1 ? 'INF' : v.circulating_supply}</td>
                                        <td className={tdClass + faded}>
                                            <Button
                                                onClick={() => (window.location.href = route('crypto.show', { id: v.id }))}
                                                disabled={v.disabled}
                                                className="cursor-pointer px-2 py-1 text-sm md:px-4 md:py-2"
                                            >
                                                View
                                            </Button>
                                        </td>
                                        <td className={tdClass}>
                                            <Button
                                                className="cursor-pointer px-2 py-1 text-sm md:px-4 md:py-2"
                                                onClick={() => {
                                                    disable(v.id);
                                                }}
                                            >
                                                {v.disabled ? 'Enable' : 'Disable'}
                                            </Button>
                                        </td>
                                        <td className={tdClass}>
                                            <Button
                                                onClick={() => (window.location.href = route('crypto.delete', { id: v.id }))}
                                                className="cursor-pointer bg-red-500 px-2 py-1 text-sm hover:bg-red-600 md:px-4 md:py-2"
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
