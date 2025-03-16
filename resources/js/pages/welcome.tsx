import DecryptedText from '@/components/decrypted-text';
import SpotlightCard from '@/components/spotlight-card';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full text-sm not-has-[nav]:hidden">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="mb-6 flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <div className="flex w-full h-full flex-col-reverse lg:flex-row">
                        <div className="flex-1 gap-[6rem] flex-col rounded-lg items-center flex p-6 pb-12 text-[13px] leading-[20px] lg:p-20 dark:text-[#EDEDEC]">
                            <h1 className='text-6xl font-extrabold'>Laracoin</h1>
                            <p className='text-4xl'>The no nonsense crypto exchange</p>
                        </div>
                    </div>
                </div>
                <div className="mb-6 gap-10 grid grid-cols-[repeat(3,1fr)] w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <SpotlightCard className='dark:text-[#EDEDEC] flex flex-col items-center min-h-[360px]'>
                        <h2 className='text-4xl grow-0'>Secure</h2>
                        <div className='flex justify-center items-center grow'>
                            <DecryptedText parentClassName='text-2xl' text='Bleeding edge encryption technology' speed={30} animateOn='hover' sequential />
                        </div>
                    </SpotlightCard>
                    <SpotlightCard className='dark:text-[#EDEDEC] flex flex-col items-center'>
                        <h2 className='text-4xl'>Simple</h2>
                    </SpotlightCard>
                    <SpotlightCard className='dark:text-[#EDEDEC] flex flex-col items-center'>
                        <h2 className='text-4xl'>Fast</h2>
                    </SpotlightCard>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
