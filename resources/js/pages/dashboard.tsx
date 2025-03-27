import { CryptoDashPill } from '@/components/crypto-dash-pill';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Crypto } from '@/types/crypto';
import { Head } from '@inertiajs/react';

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
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex w-full flex-col items-center justify-center gap-5">
                    {cryptos.map(function (crypto, i) {
                        if (crypto.symbol !== 'EUR') {
                            return <CryptoDashPill key={i} crypto={crypto} />;
                        }
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
