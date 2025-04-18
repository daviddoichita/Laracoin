import AppLayout from '@/layouts/app-layout';
import { checkRole } from '@/lib/utils';
import { SharedData } from '@/types';
import { Button } from '@headlessui/react';
import { Head, usePage } from '@inertiajs/react';
import { Activity, Telescope } from 'lucide-react';
import { useEffect } from 'react';

export default function Metrics() {
    const { auth } = usePage<SharedData>().props;

    useEffect(() => {
        checkRole(auth);
    }, []);

    return (
        <AppLayout>
            <Head title="Metrics Endpoints" />
            {auth.user.admin === true ? (
                <div className="mt-8 flex h-[400px] w-[50%] flex-row items-center gap-3 self-center justify-self-center">
                    <Button
                        onClick={() => (window.location.href = route('telescope'))}
                        className="border-round flex w-full flex-col gap-3 border p-3 text-center hover:cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    >
                        <div className="flex w-full flex-row items-center justify-center gap-3 font-black">
                            <h2 className="text-xl">Telescope</h2>
                            <Telescope />
                        </div>
                        <p>General insight on how users use the app</p>
                    </Button>
                    <Button
                        onClick={() => (window.location.href = route('pulse'))}
                        className="border-round flex w-full flex-col gap-3 border p-3 text-center hover:cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    >
                        <div className="flex w-full flex-row items-center justify-center gap-3 font-black">
                            <h2 className="text-xl">Pulse</h2>
                            <Activity />
                        </div>
                        <p>Slow response/queries metrics</p>
                    </Button>
                </div>
            ) : (
                <></>
            )}
        </AppLayout>
    );
}
