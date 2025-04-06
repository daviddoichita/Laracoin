import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { checkRole } from '@/lib/utils';
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

export default function ListCryptos({ cryptos }: ListCryptosProps) {
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
            <Head title="Cryptos list"></Head>

            <div className={'flex w-[85%] flex-col items-center justify-start gap-3 self-center p-4 ' + (auth.user.admin ? '' : 'hidden')}>
                <div className="flex w-full flex-row items-center justify-center gap-3 p-4">
                    {filtering ? (
                        <Button
                            onClick={() => {
                                setFiltering(false);
                                setFilteredCryptos(cryptosRef.current);
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
            </div>

            <table className={'w-[85%] border-separate self-center ' + (auth.user.admin ? '' : 'hidden')}>
                <thead className="text-lg">
                    <tr>
                        <th className="rounded-tl border border-neutral-700 bg-neutral-200 p-4 dark:bg-neutral-800">Name</th>
                        <th className="border border-neutral-700 bg-neutral-200 p-4 dark:bg-neutral-800">Symbol</th>
                        <th className="border border-neutral-700 bg-neutral-200 p-4 dark:bg-neutral-800">Max supply</th>
                        <th className="border border-neutral-700 bg-neutral-200 p-4 dark:bg-neutral-800">Circulating supply</th>
                        <th className="border border-neutral-700 bg-neutral-200 p-4 dark:bg-neutral-800">View</th>
                        <th className="rounded-tr border border-neutral-700 bg-neutral-200 p-4 dark:bg-neutral-800">Disable</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCryptos
                        .sort((a, b) => {
                            if (a.disabled === b.disabled) {
                                return 0;
                            }
                            return a.disabled ? 1 : -1;
                        })
                        .map((v, i) => {
                            const tdClass = 'border border-neutral-700 text-center p-3';
                            return (
                                <tr key={i} className={v.disabled ? 'opacity-50' : ''}>
                                    <td className={tdClass}>{v.name}</td>
                                    <td className={tdClass}>{v.symbol}</td>
                                    <td className={tdClass}>{v.max_supply === -1 ? 'INF' : v.max_supply}</td>
                                    <td className={tdClass}>{v.circulating_supply === -1 ? 'INF' : v.circulating_supply}</td>
                                    <td className={tdClass}>
                                        <Button
                                            onClick={() => (window.location.href = route('crypto.show', { id: v.id }))}
                                            disabled={v.disabled}
                                            className="cursor-pointer"
                                        >
                                            View
                                        </Button>
                                    </td>
                                    <td className={tdClass}>
                                        {v.disabled ? (
                                            <Button
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    disable(v.id);
                                                }}
                                            >
                                                Enable
                                            </Button>
                                        ) : (
                                            <Button
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    disable(v.id);
                                                }}
                                            >
                                                Disable
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </AppLayout>
    );
}
