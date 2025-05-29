import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { checkRole } from '@/lib/utils';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

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

export default function AddCrypto({ crypto }: Readonly<AddCryptoProps>) {
    const { auth } = usePage<SharedData>().props;
    const { data, setData, post, processing, errors, reset } = useForm<Required<AddCryptoForm>>({
        name: '',
        symbol: '',
        icon: 'coins',
        max_supply: -2,
        circulating_supply: -2,
        price: -2,
    });

    type Multi = 'u' | 'h' | 'th' | 'm';

    const [maxSupply, setMaxSupply] = useState<number>(-1);
    const [maxSupplyMulti, setMaxSupplyMulti] = useState<Multi>('u');

    const [circulatingSupply, setCirculatingSupply] = useState<number>(-1);
    const [circulatingSupplyMulti, setCirculatingSupplyMulti] = useState<Multi>('u');

    const [inf, setInf] = useState(false);

    const capitalize = (str: string) => {
        if (!str) return str;

        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('crypto.store'), { onSuccess: () => reset() });
    };

    useEffect(() => {
        setData('max_supply', maxSupply * (maxSupplyMulti === 'h' ? 100 : maxSupplyMulti === 'th' ? 1000 : maxSupplyMulti === 'm' ? 1000000 : 1));
    }, [maxSupply, maxSupplyMulti]);

    useEffect(() => {
        setData(
            'circulating_supply',
            circulatingSupply *
                (circulatingSupplyMulti === 'h' ? 100 : circulatingSupplyMulti === 'th' ? 1000 : circulatingSupplyMulti === 'm' ? 1000000 : 1),
        );
    }, [circulatingSupply, circulatingSupplyMulti]);

    useEffect(() => {
        checkRole(auth);
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add crypto" />

            <form
                className={
                    'mx-auto mt-16 flex w-full max-w-5xl flex-col gap-8 rounded-lg bg-white p-6 shadow-md dark:bg-neutral-900 ' +
                    (auth.user.admin ? '' : 'hidden')
                }
                onSubmit={submit}
            >
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        required
                        autoFocus
                        autoComplete="name"
                        value={data.name}
                        onChange={(e) => setData('name', capitalize(e.target.value))}
                        placeholder="Name"
                        className="w-full"
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
                        autoComplete="symbol"
                        value={data.symbol}
                        onChange={(e) => setData('symbol', e.target.value.toUpperCase())}
                        placeholder="Symbol"
                        className="w-full"
                    />
                    <InputError message={errors.symbol} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="max-supply">Max supply</Label>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                        <Label htmlFor="infinite" className="text-md flex items-center gap-2">
                            Infinite
                            <Checkbox
                                id="infinite"
                                checked={inf}
                                onClick={(_e) => {
                                    setInf(!inf);
                                    setData('max_supply', -1);
                                }}
                            />
                        </Label>
                        <Input
                            id="max-supply"
                            disabled={inf}
                            type="number"
                            min={-1}
                            step={0.00000001}
                            required
                            autoFocus
                            autoComplete="max-supply"
                            value={data.max_supply < 0 ? '' : data.max_supply}
                            onChange={(e) => setMaxSupply(parseFloat(e.target.value))}
                            placeholder="Max supply"
                            className="w-full sm:w-1/2"
                        />
                        <select
                            disabled={inf}
                            name="magnitude-max"
                            className="rounded border bg-neutral-100 p-2 dark:bg-neutral-800"
                            onChange={(e) => setMaxSupplyMulti(e.target.value as Multi)}
                        >
                            <option value={'u'}>Units</option>
                            <option value={'h'}>Hundreds</option>
                            <option value={'th'}>Thousands</option>
                            <option value={'m'}>Millions</option>
                        </select>
                    </div>
                    <InputError message={errors.max_supply} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="circulating-supply">Circulating supply</Label>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                        <Input
                            id="circulating-supply"
                            type="number"
                            min={-1}
                            step={0.00000001}
                            required
                            autoFocus
                            autoComplete="circulating-supply"
                            value={data.circulating_supply < 0 ? '' : data.circulating_supply}
                            onChange={(e) => setCirculatingSupply(parseFloat(e.target.value))}
                            placeholder="Circulating supply"
                            className="w-full sm:w-1/2"
                        />
                        <select
                            name="magnitude-circulating"
                            className="rounded border bg-neutral-100 p-2 dark:bg-neutral-800"
                            onChange={(e) => setCirculatingSupplyMulti(e.target.value as Multi)}
                        >
                            <option value={'u'}>Units</option>
                            <option value={'h'}>Hundreds</option>
                            <option value={'th'}>Thousands</option>
                            <option value={'m'}>Millions</option>
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
                            autoComplete="price"
                            value={data.price.toString().startsWith('-') ? '' : data.price}
                            onChange={(e) => setData('price', parseFloat(e.target.value))}
                            placeholder="Price"
                            className="w-full"
                        />
                        <span className="text-xl font-semibold">€</span>
                    </div>
                    <InputError message={errors.price} />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        type="reset"
                        className="w-full bg-red-500 text-white transition hover:bg-red-600 dark:text-black"
                        disabled={processing}
                        onClick={() => reset()}
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
                        Save
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
