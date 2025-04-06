import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { checkRole } from '@/lib/utils';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Add crypto',
        href: '/crypto/add',
    },
];

export interface AddCryptoProps {
    crypto: Crypto;
}

interface AddCryptoForm {
    name: string;
    symbol: string;
    icon: string;
    max_supply: number;
    circulating_supply: number;
    price: number;
}

export default function AddCrypto({ crypto }: AddCryptoProps) {
    const { auth } = usePage<SharedData>().props;
    const { data, setData, post, processing, errors, reset } = useForm<Required<AddCryptoForm>>({
        name: '',
        symbol: '',
        icon: 'coins',
        max_supply: -2,
        circulating_supply: -2,
        price: -2,
    });

    const capitalize = (str: string) => {
        if (!str) return str;

        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('crypto.add'), {
            onFinish: () => {
                reset('name', 'symbol', 'max_supply', 'circulating_supply', 'price');
            },
        });
    };

    const valueChange = (dataIdx: keyof AddCryptoForm, mod: string) => {
        const setDataSafe = (modi: number) => {
            const d = data[dataIdx];
            if (typeof d === 'string') {
                return;
            } else {
                setData(dataIdx, d * modi);
            }
        };

        switch (mod) {
            case 'u':
                break;
            case 'h':
                setDataSafe(100);
                break;
            case 'th':
                setDataSafe(1_000);
                break;
            case 'm':
                setDataSafe(1_000_000);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        checkRole(auth);
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add crypto"></Head>

            <form className={'mt-[4rem] flex w-[30%] flex-col gap-6 self-center ' + (auth.user.admin ? '' : 'hidden')} onSubmit={submit}>
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="name"
                        value={data.name}
                        onChange={(e) => setData('name', capitalize(e.target.value))}
                        placeholder="Name"
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="symbol">Symbol</Label>
                    <Input
                        id="symbol"
                        type="text"
                        required
                        autoFocus
                        tabIndex={1}
                        autoComplete="symbol"
                        value={data.symbol}
                        onChange={(e) => setData('symbol', e.target.value)}
                        placeholder="Symbol"
                    />
                    <InputError message={errors.symbol} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="max-supply">Max supply</Label>
                    <div className="flex flex-row gap-3">
                        <Input
                            id="max-supply"
                            type="number"
                            min={-1}
                            step={0.00000001}
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="max-supply"
                            value={data.max_supply.toString().startsWith('-') ? '' : data.max_supply}
                            onChange={(e) => setData('max_supply', parseFloat(e.target.value))}
                            placeholder="Max supply"
                        />
                        <select name="magnitude-max" className="rounded border p-1" onChange={(e) => valueChange('max_supply', e.target.value)}>
                            <option value={'u'} className="dark:bg-neutral-900">
                                Units
                            </option>
                            <option value={'h'} className="dark:bg-neutral-900">
                                Hundreds
                            </option>
                            <option value={'th'} className="dark:bg-neutral-900">
                                Thousands
                            </option>
                            <option value={'m'} className="dark:bg-neutral-900">
                                Millions
                            </option>
                        </select>
                    </div>
                    <InputError message={errors.max_supply} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="circulating-supply">Circulating supply</Label>
                    <div className="flex flex-row gap-3">
                        <Input
                            id="circulating-supply"
                            type="number"
                            min={-1}
                            step={0.00000001}
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="circulating-supply"
                            value={data.circulating_supply.toString().startsWith('-') ? '' : data.circulating_supply}
                            onChange={(e) => setData('circulating_supply', parseFloat(e.target.value))}
                            placeholder="Circulating supply"
                        />
                        <select
                            name="magnitude-circulating"
                            className="rounded border p-1"
                            onChange={(e) => valueChange('circulating_supply', e.target.value)}
                        >
                            <option value={'u'} className="dark:bg-neutral-900">
                                Units
                            </option>
                            <option value={'h'} className="dark:bg-neutral-900">
                                Hundreds
                            </option>
                            <option value={'th'} className="dark:bg-neutral-900">
                                Thousands
                            </option>
                            <option value={'m'} className="dark:bg-neutral-900">
                                Millions
                            </option>
                        </select>
                    </div>
                    <InputError message={errors.circulating_supply} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="price">Price (EUR)</Label>
                    <div className="flex flex-row items-center gap-3">
                        <Input
                            id="price"
                            type="number"
                            min={0}
                            step={0.00000001}
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="price"
                            value={data.price.toString().startsWith('-') ? '' : data.price}
                            onChange={(e) => setData('price', parseFloat(e.target.value))}
                            placeholder="Price"
                        />
                        <p className="text-xl">€</p>
                    </div>
                    <InputError message={errors.circulating_supply} />
                </div>

                <div className="flex w-full flex-row items-center justify-center gap-4">
                    <Button
                        type="reset"
                        className="mt-4 w-full cursor-pointer bg-red-500 text-white transition duration-[0.3s] hover:bg-red-600 dark:text-black"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="mt-4 w-full cursor-pointer bg-green-500 text-white transition duration-[0.3s] hover:bg-green-600 dark:text-black"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Save
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
