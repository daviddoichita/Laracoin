import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    surnames: string;
    nif: string;
    email: string;
    phoneNumber: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        surnames: '',
        nif: '',
        email: '',
        phoneNumber: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid grid-cols-[repeat(2,1fr)] grid-rows-[1fr] items-center justify-center gap-6">
                        <div className="grid w-full gap-2">
                            <Label htmlFor="name" className="ml-1">
                                Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Full name"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="surnames" className="ml-1">
                                Surnames
                            </Label>
                            <Input
                                id="surnames"
                                type="text"
                                autoFocus
                                tabIndex={1}
                                autoComplete="surnames"
                                value={data.surnames}
                                onChange={(e) => setData('surnames', e.target.value)}
                                disabled={processing}
                                placeholder="Surnames"
                            />
                            <InputError message={errors.surnames} className="mt-2" />
                        </div>
                    </div>

                    <div className="grid grid-cols-[repeat(2,1fr)] grid-rows-[1fr] items-center justify-center gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="nif" className="ml-1">
                                NIF
                            </Label>
                            <Input
                                id="nif"
                                type="text"
                                autoFocus
                                tabIndex={1}
                                autoComplete="nif"
                                value={data.nif}
                                onChange={(e) => setData('nif', e.target.value.toUpperCase())}
                                disabled={processing}
                                placeholder="NIF"
                            />
                            <InputError message={errors.nif} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phoneNumber" className="ml-1">
                                Phone number
                            </Label>
                            <Input
                                id="phoneNumber"
                                type="number"
                                autoFocus
                                tabIndex={1}
                                autoComplete="phoneNumber"
                                value={data.phoneNumber}
                                onChange={(e) => setData('phoneNumber', e.target.value)}
                                disabled={processing}
                                placeholder="Phone number"
                            />
                            <InputError message={errors.phoneNumber} className="mt-2" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="ml-1">
                            Email address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid grid-cols-[repeat(2,1fr)] grid-rows-[1fr] items-center justify-center gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="ml-1">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Password"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="ml-1">
                                Confirm password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Confirm password"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
