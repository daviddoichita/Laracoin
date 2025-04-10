import BalancePill from '@/components/balance-pill';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { UserBalance } from '@/types/user-balance';
import { Head, usePage } from '@inertiajs/react';

export interface BalancesProps {
    userBalances: UserBalance[];
}

export default function Balances({ userBalances }: BalancesProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout>
            <Head title="My balances" />

            <div className="mt-10 flex max-w-7xl min-w-7xl flex-row flex-wrap gap-3 self-center">
                {userBalances.map((v, i) => {
                    return <BalancePill userBalance={v} key={i} />;
                })}
            </div>
        </AppLayout>
    );
}
