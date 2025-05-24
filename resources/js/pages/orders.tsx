import OrderPill from '@/components/order-pill';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { shortUUID } from '@/lib/utils';
import { Crypto } from '@/types/crypto';
import { Order } from '@/types/order';
import { Head } from '@inertiajs/react';
import Fuse from 'fuse.js';
import { useEffect, useRef, useState } from 'react';

export interface OrdersProps {
    userOrders: Order[];
    cryptos: Crypto[];
}

export default function Orders({ userOrders, cryptos }: Readonly<OrdersProps>) {
    const [filteredOrders, setFilteredOrders] = useState(userOrders);
    const [filteredCryptos, setFilteredCryptos] = useState(cryptos);
    const [filtering, setFiltering] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const cryptosRef = useRef(cryptos);
    const userOrdersRef = useRef(userOrders);
    const fuse = new Fuse(cryptos, { keys: ['name', 'symbol'] });
    const [selectedType, setSelectedType] = useState<OrderType>('null');
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('null');

    useEffect(() => {
        const savedFilters = sessionStorage.getItem('filters');
        if (savedFilters) {
            const { searchQuery, selectedType, selectedStatus } = JSON.parse(savedFilters);
            setSearchQuery(searchQuery ?? '');
            setSelectedType(selectedType ?? 'null');
            setSelectedStatus(selectedStatus ?? 'null');
        }
    }, []);

    useEffect(() => {
        const filters = {
            searchQuery,
            selectedType,
            selectedStatus,
        };
        sessionStorage.setItem('filters', JSON.stringify(filters));
    }, [searchQuery, selectedType, selectedStatus]);

    const filter = () => {
        setFiltering(true);
        const trimmed = searchQuery.trim().toLocaleLowerCase();

        if (trimmed === '') {
            setFilteredCryptos(cryptosRef.current);
            setFiltering(false);
            return;
        }

        setFilteredCryptos(fuse.search(trimmed).map((result) => result.item));
    };

    type OrderType = 'buy' | 'sell' | 'null';
    type OrderStatus = 'pending' | 'completed' | 'canceled' | 'null';

    useEffect(() => {
        const filteredCryptoIds = new Set(filteredCryptos.map((c) => c.id));
        setFilteredOrders(
            userOrdersRef.current.filter((order) => {
                const matchesCrypto = filteredCryptoIds.has(order.sold_id) || filteredCryptoIds.has(order.purchased_id);
                const matchesType = selectedType === 'null' ? true : order.order_type === selectedType;
                const matchesStatus = selectedStatus === 'null' ? true : order.status === selectedStatus;
                return matchesCrypto && matchesType && matchesStatus;
            }),
        );
    }, [filteredCryptos, selectedType, selectedStatus]);

    useEffect(() => {
        const scrollY = sessionStorage.getItem('scrollY');
        if (scrollY) {
            window.scrollTo({ top: parseInt(scrollY) });
            sessionStorage.removeItem('scrollY');
        }
    }, []);

    useEffect(() => filter(), [searchQuery]);

    return (
        <AppLayout>
            <Head title="My orders" />
            <div className="sticky top-0 z-10 mt-5 mb-5 flex w-full max-w-7xl flex-row gap-3 self-center bg-white p-3 dark:bg-neutral-950">
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
                    value={searchQuery}
                    placeholder="Search"
                ></Input>
                <select
                    className="rounded-md border p-2 dark:bg-neutral-900"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as OrderType)}
                >
                    <option value={'null'}>Any</option>
                    <option value={'buy'}>Buy</option>
                    <option value={'sell'}>Sell</option>
                </select>
                <select
                    className="rounded-md border p-2 dark:bg-neutral-900"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                >
                    <option value={'null'}>Any</option>
                    <option value={'canceled'}>Canceled</option>
                    <option value={'completed'}>Completed</option>
                    <option value={'pending'}>Pending</option>
                </select>
            </div>

            <div className="mt-10 flex max-w-6xl min-w-6xl flex-row flex-wrap gap-3 self-center">
                {filteredOrders.length > 0 ? (
                    filteredOrders
                        .toSorted((a, b) => a.id - b.id)
                        .map((v, _i) => {
                            return (
                                <OrderPill
                                    order={v}
                                    sold={cryptos.find((c) => c.id === v.sold_id)}
                                    purchased={cryptos.find((c) => c.id === v.purchased_id)}
                                    key={shortUUID()}
                                />
                            );
                        })
                ) : (
                    <div className="flex w-full justify-center">
                        <p>No orders</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
