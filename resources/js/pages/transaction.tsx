import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { UserBalance } from '@/types/user-balance';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEvent } from 'react';

export interface TransactionProps {
    userBalance: UserBalance;
}

export default function Trasaction({ userBalance }: Readonly<TransactionProps>) {
    type TransactionForm = {
        crypto_id: number;
        target_uuid: string | null;
        amount: number | null;
        user_balance: number;
    };

    const { data, setData, errors, post, processing, reset } = useForm<TransactionForm>({
        crypto_id: userBalance.crypto_id,
        target_uuid: null,
        amount: null,
        user_balance: userBalance.id,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post(route('transaction.store'), {
            onFinish: () => {
                setData('target_uuid', null);
                setData('amount', null);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="New transaction"></Head>

            <form
                className="mx-auto mt-16 flex w-full max-w-5xl flex-col gap-8 rounded-lg bg-white p-6 shadow-md dark:bg-neutral-900"
                onSubmit={submit}
            >
                <h1 className="text-xl font-black">New transaction</h1>

                <div className="mb-2 flex flex-col gap-1">
                    <div className="text-muted-foreground flex items-center justify-between text-xs">
                        <span>Available balance ({userBalance.crypto.symbol})</span>
                        <span className="ml-2 font-mono">{userBalance.balance}</span>
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="target_uuid">Target uuid</Label>
                    <Input
                        id="target_uuid"
                        type="text"
                        required
                        autoFocus
                        autoComplete="uuid"
                        value={data.target_uuid ?? ''}
                        onChange={(e) => setData('target_uuid', e.target.value)}
                        placeholder="Target UUID"
                        className="w-full"
                    />
                    <InputError message={errors.target_uuid} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="flex flex-row items-center gap-3">
                        <Input
                            id="amount"
                            type="number"
                            step={0.00000001}
                            required
                            autoComplete="amount"
                            value={data.amount ?? ''}
                            onChange={(e) => setData('amount', parseFloat(e.target.value))}
                            placeholder="Amount"
                            className="w-full"
                        />
                    </div>
                    <InputError message={errors.amount} />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        onClick={() => {
                            window.location.href = route('my-balances');
                        }}
                        type="reset"
                        className="w-full bg-red-500 text-white transition hover:bg-red-600 dark:text-black"
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="w-full bg-green-500 text-white transition hover:bg-green-600 dark:text-black"
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Send
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
