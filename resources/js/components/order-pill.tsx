import { Crypto } from '@/types/crypto';
import { Order } from '@/types/order';
import { Button } from './ui/button';

export interface OrderPillProps {
    order: Order;
    sold: Crypto | undefined;
    purchased: Crypto | undefined;
}

const formatPrice = (n: number) => {
    return isNaN(n) ? 'Loading...' : n.toLocaleString('es-ES', { maximumFractionDigits: 8 });
};

export default function OrderPill({ order, sold, purchased }: OrderPillProps) {
    return (
        <>
            <div
                className={
                    'mb-5 flex w-[49.5%] flex-col items-center gap-3 rounded-xl border p-3 ' +
                    (order.status === 'completed'
                        ? 'border-green-500 shadow-md shadow-green-500'
                        : order.status === 'pending'
                          ? 'border-yellow-500 shadow-md shadow-yellow-500'
                          : 'border-red-500 shadow-md shadow-red-500')
                }
            >
                <div className="flex w-full flex-row justify-center gap-3 text-lg font-black">
                    <p>Order id: {order.id}</p>
                    <p>Sold: {sold?.name}</p>
                    <p>Purchased: {purchased?.name}</p>
                </div>
                <div className="flex w-full flex-row flex-wrap gap-3">
                    <div className="flex w-[48.4%] flex-col items-center gap-2 rounded-sm border p-2">
                        <p>Status</p>
                        <p
                            className={
                                order.status === 'completed' ? 'text-green-500' : order.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
                            }
                        >
                            {order.status}
                        </p>
                    </div>
                    <div className="flex w-[48.4%] flex-col items-center gap-2 rounded-sm border p-2">
                        <p>Type</p>
                        <p>{order.order_type}</p>
                    </div>
                    <div className="flex w-[48.4%] flex-col items-center gap-2 rounded-sm border p-2">
                        <p>Total amount</p>
                        <p>{formatPrice(parseFloat(order.total_amount.toString()))}</p>
                    </div>
                    <div className="flex w-[48.4%] flex-col items-center gap-2 rounded-sm border p-2">
                        <p>Price</p>
                        <p>{formatPrice(parseFloat(order.price.toString()))}</p>
                    </div>
                    <div className="flex w-[48.4%] flex-col items-center gap-2 rounded-sm border p-2">
                        <p>Total price</p>
                        <p>{formatPrice(order.price * order.total_amount)}</p>
                    </div>
                    <div className="flex w-[48.4%] flex-col items-center gap-2 rounded-sm border p-2">
                        <p>Filled</p>
                        <p>{formatPrice(parseFloat(order.filled.toString()))}</p>
                    </div>
                </div>
                <Button
                    disabled={order.status === 'completed' || order.status === 'canceled'}
                    onClick={() => {
                        window.location.href = route('cancel-order', { id: order.id });
                    }}
                    className="w-full bg-red-500 hover:cursor-pointer hover:bg-red-400"
                >
                    Cancel
                </Button>
            </div>
        </>
    );
}
