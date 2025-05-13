import BalancePill from '@/components/balance-pill';
import AppLayout from '@/layouts/app-layout';
import { UserBalance } from '@/types/user-balance';
import { Head } from '@inertiajs/react';

export interface BalancesProps {
    userBalances: UserBalance[];
}

export default function Balances({ userBalances }: Readonly<BalancesProps>) {
    return (
        <AppLayout>
            <Head title="My balances" />

            <div className="mt-10 flex max-w-7xl min-w-7xl flex-row flex-wrap gap-3 self-center">
                {userBalances
                    .toSorted((a, b) => a.id - b.id)
                    .map((v, _i) => {
                        if (!v.crypto.disabled) return <BalancePill userBalance={v} key={v.id} />;
                    })}
            </div>
        </AppLayout>
    );
}
