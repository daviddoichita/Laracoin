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

            <form className="mt-[4rem] flex w-[30%] flex-col gap-6 self-center" onSubmit={submit}>
                <h1 className="text-xl font-black">New transaction</h1>

                <p className="text-lg font-black">Available balance: {userBalance.balance}</p>

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
                    ></Input>
                    <InputError message={errors.target_uuid}></InputError>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        step={0.00000001}
                        required
                        autoFocus
                        autoComplete="amount"
                        value={data.amount ?? ''}
                        onChange={(e) => setData('amount', parseFloat(e.target.value))}
                    ></Input>
                    <InputError message={errors.amount}></InputError>
                </div>

                <div className="flex w-full flex-row items-center justify-center gap-4">
                    <Button
                        onClick={() => {
                            window.location.href = route('my-balances');
                        }}
                        type="reset"
                        className="mt-4 w-full cursor-pointer bg-red-500 text-white transition duration-[0.3s] hover:bg-red-600 dark:text-black"
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="mt-4 w-full cursor-pointer bg-green-500 text-white transition duration-[0.3s] hover:bg-green-600 dark:text-black"
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Send
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
