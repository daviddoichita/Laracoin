import OrderPill from '@/components/order-pill';
import AppLayout from '@/layouts/app-layout';
import { shortUUID } from '@/lib/utils';
import { Crypto } from '@/types/crypto';
import { Order } from '@/types/order';
import { Head } from '@inertiajs/react';

export interface OrdersProps {
    userOrders: Order[];
    cryptos: Crypto[];
}

export default function Orders({ userOrders, cryptos }: Readonly<OrdersProps>) {
    return (
        <AppLayout>
            <Head title="My orders" />

            <div className="mt-10 flex max-w-7xl min-w-7xl flex-row flex-wrap gap-3 self-center">
                {userOrders
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
