import OrderPill from '@/components/order-pill';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { shortUUID } from '@/lib/utils';
import { Crypto } from '@/types/crypto';
import { Order } from '@/types/order';
import { Head } from '@inertiajs/react';
import Fuse from 'fuse.js';
import { DynamicIcon } from 'lucide-react/dynamic';
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

    const [selectedType, setSelectedType] = useState<'buy' | 'sell' | 'null'>('null');

    useEffect(() => {
        const filteredCryptoIds = new Set(filteredCryptos.map((c) => c.id));
        setFilteredOrders(
            userOrdersRef.current.filter((order) => {
                const matchesCrypto = filteredCryptoIds.has(order.sold_id) || filteredCryptoIds.has(order.purchased_id);
                const matchesType = selectedType === 'null' ? true : order.order_type === selectedType;
                return matchesCrypto && matchesType;
            }),
        );
    }, [filteredCryptos, selectedType]);

    return (
        <AppLayout>
            <Head title="My orders" />
            <div className="mt-5 mb-5 flex w-[40%] max-w-7xl flex-row gap-3 self-center">
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
                    className="rounded-md border p-2"
                    id="type-select"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as 'buy' | 'sell' | 'null')}
                >
                    <option value={'null'}>Any</option>
                    <option value={'buy'}>Buy</option>
                    <option value={'sell'}>Sell</option>
                </select>
                <Button
                    onClick={() => filter()}
                    className="bg-neutral-100 hover:cursor-pointer hover:bg-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                >
                    <DynamicIcon name="search" className="text-black dark:text-white"></DynamicIcon>
                </Button>
            </div>

            <div className="mt-10 flex max-w-7xl min-w-7xl flex-row flex-wrap gap-3 self-center">
                {filteredOrders
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
                    })}
            </div>
        </AppLayout>
    );
}
