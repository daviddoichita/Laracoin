import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { shortUUID } from '@/lib/utils';
import { Transaction } from '@/types/transactions';
import { UserBalance } from '@/types/user-balance';
import { Head } from '@inertiajs/react';
import Fuse from 'fuse.js';
import { useEffect, useRef, useState } from 'react';

interface OutgoingHistoryProps {
    transactions: Transaction[];
}

function OutgoingHistory({ transactions }: Readonly<OutgoingHistoryProps>) {
    const [filteredTransactions, setFilteredTransactions] = useState(transactions);
    const [filtering, setFiltering] = useState(false);
    const [query, setQuery] = useState('');
    const transactionsRef = useRef(transactions);
    const fuse = new Fuse(transactions, {
        keys: ['crypto.name', 'crypto.symbol', 'target_uuid', 'amount'],
    });

    const filter = () => {
        setFiltering(true);
        const trimmed = query.trim().toLocaleLowerCase();

        if (trimmed === '') {
            setFilteredTransactions(transactionsRef.current);
            setFiltering(false);
            return;
        }

        setFilteredTransactions(fuse.search(trimmed).map((result) => result.item));
    };

    useEffect(() => filter(), [query]);

    function renderTransactions() {
        if (filteredTransactions.length > 0) {
            return (
                <>
                    {filteredTransactions
                        .toSorted((a, b) => a.id - b.id)
                        .map((v, _i) => {
                            return (
                                <div
                                    key={shortUUID()}
                                    className="flex w-full flex-col gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 transition sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-neutral-400"
                                >
                                    <div className="flex flex-col gap-1 sm:w-2/3">
                                        <span className="text-xs text-neutral-500 dark:text-neutral-400">Wallet UUID</span>
                                        <span className="truncate font-mono text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                            {v.target_uuid}
                                        </span>
                                        <span className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                            {new Date(v.created_at).toLocaleString('en-GB', { timeZone: 'Europe/Madrid' })}
                                        </span>
                                    </div>
                                    <div className="flex flex-row items-end justify-between gap-4 sm:w-1/3 sm:flex-col sm:items-end sm:justify-end">
                                        <span className="text-lg font-bold text-red-600 dark:text-red-400">{v.amount}</span>
                                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                            {v.crypto.name} <span className="font-mono text-xs text-neutral-500">{v.crypto.symbol}</span>
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                </>
            );
        }

        return (
            <div className="flex w-full items-center justify-center">
                <p>No transactions</p>
            </div>
        );
    }

    return (
        <>
            <div className="sticky top-0 z-10 mt-5 mb-5 flex w-full max-w-7xl flex-row gap-3 self-center bg-white p-3 dark:bg-neutral-950">
                {filtering ? (
                    <Button
                        onClick={() => {
                            setFiltering(false);
                            setFilteredTransactions(transactionsRef.current);
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

            <div className="mt-10 flex w-full max-w-7xl flex-col gap-3 self-center px-2 sm:flex-row sm:flex-wrap sm:justify-center">
                {renderTransactions()}
            </div>
        </>
    );
}

interface IncomingHistoryProps {
    transactions: Transaction[];
    userBalances: UserBalance[];
}

function IncomingHistory({ transactions, userBalances }: Readonly<IncomingHistoryProps>) {
    const [filteredTransactions, setFilteredTransactions] = useState(transactions);
    const [filtering, setFiltering] = useState(false);
    const [query, setQuery] = useState('');
    const transactionsRef = useRef(transactions);
    const [selectedUuid, setSelectedUuid] = useState<string>('default');

    const filter = () => {
        setFiltering(true);
        const trimmed = query.trim().toLocaleLowerCase();

        if (selectedUuid === 'default') {
            setFilteredTransactions([]);
            setFiltering(false);
            return;
        }

        const filteredByUuid = transactionsRef.current.filter((transaction) => transaction.target_uuid === selectedUuid);

        if (trimmed === '') {
            setFilteredTransactions(filteredByUuid);
            setFiltering(false);
            return;
        }

        const fuseForUuid = new Fuse(filteredByUuid, {
            keys: ['crypto.name', 'crypto.symbol', 'target_uuid', 'amount'],
        });

        setFilteredTransactions(fuseForUuid.search(trimmed).map((result) => result.item));
    };

    useEffect(() => filter(), [query]);

    useEffect(() => filter(), [selectedUuid]);

    function renderTransactions() {
        if (filteredTransactions.length > 0) {
            return (
                <>
                    {filteredTransactions
                        .toSorted((a, b) => a.id - b.id)
                        .map((v, _i) => {
                            return (
                                <div
                                    key={shortUUID()}
                                    className="flex w-full flex-col gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 transition sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-neutral-400"
                                >
                                    <div className="flex flex-col gap-1 sm:w-2/3">
                                        <span className="text-xs text-neutral-500 dark:text-neutral-400">Wallet UUID</span>
                                        <span className="truncate font-mono text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                            {v.target_uuid}
                                        </span>
                                        <span className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                            {new Date(v.created_at).toLocaleString('en-GB', { timeZone: 'Europe/Madrid' })}
                                        </span>
                                    </div>
                                    <div className="flex flex-row items-end justify-between gap-4 sm:w-1/3 sm:flex-col sm:items-end sm:justify-end">
                                        <span className="text-lg font-bold text-green-600 dark:text-green-400">{v.amount}</span>
                                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                            {v.crypto.name} <span className="font-mono text-xs text-neutral-500">{v.crypto.symbol}</span>
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                </>
            );
        }

        return (
            <div className="flex w-full items-center justify-center">
                <p>{selectedUuid === 'default' ? 'Select a wallet to show transactions' : 'No transactions'}</p>
            </div>
        );
    }

    return (
        <>
            <div className="sticky top-0 z-10 mt-5 mb-5 flex w-full max-w-7xl flex-row gap-3 self-center bg-white p-3 dark:bg-neutral-950">
                {filtering ? (
                    <Button
                        onClick={() => {
                            setFiltering(false);
                            setFilteredTransactions(transactionsRef.current);
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
                <select className="rounded-md border p-2 dark:bg-neutral-900" value={selectedUuid} onChange={(e) => setSelectedUuid(e.target.value)}>
                    <option value={'default'}>Select a wallet</option>
                    {userBalances
                        .toSorted((a, b) => a.id - b.id)
                        .map((v, _i) => {
                            if (v.crypto.symbol === 'EUR') {
                                return <></>;
                            } else {
                                return (
                                    <option key={shortUUID()} value={v.uuid}>
                                        {v.crypto.name + ' ' + v.crypto.symbol}
                                    </option>
                                );
                            }
                        })}
                </select>
            </div>

            <div className="mt-10 flex w-full max-w-7xl flex-col gap-3 self-center px-2 sm:flex-row sm:flex-wrap sm:justify-center">
                {renderTransactions()}
            </div>
        </>
    );
}

export interface TransactionHistoryProps {
    outgoingTransactions: Transaction[];
    incomingTransactions: Transaction[];
    userBalances: UserBalance[];
}

export default function TransactionHistory({ outgoingTransactions, incomingTransactions, userBalances }: Readonly<TransactionHistoryProps>) {
    const [outgoing, setOutgoing] = useState(true);

    return (
        <AppLayout>
            <Head title="My transactions"></Head>

            <div className="mt-5 mb-5 flex w-[70%] flex-col items-center justify-center self-center">
                <div className="mb-8 flex w-full max-w-md flex-row justify-center gap-2 rounded-lg dark:bg-neutral-950">
                    <button
                        onClick={() => setOutgoing(true)}
                        className={
                            'w-1/2 rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-150 ' +
                            (outgoing
                                ? 'bg-sky-500 text-white shadow dark:bg-sky-700'
                                : 'bg-gray-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700')
                        }
                        aria-pressed={outgoing}
                    >
                        Outgoing
                    </button>
                    <button
                        onClick={() => setOutgoing(false)}
                        className={
                            'w-1/2 rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-150 ' +
                            (!outgoing
                                ? 'bg-sky-500 text-white shadow dark:bg-sky-700'
                                : 'bg-gray-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700')
                        }
                        aria-pressed={!outgoing}
                    >
                        Incoming
                    </button>
                </div>
                {outgoing ? (
                    <OutgoingHistory transactions={outgoingTransactions}></OutgoingHistory>
                ) : (
                    <IncomingHistory transactions={incomingTransactions} userBalances={userBalances}></IncomingHistory>
                )}
            </div>
        </AppLayout>
    );
}
