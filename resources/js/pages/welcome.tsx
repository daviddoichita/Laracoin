import Particles from '@/components/particles';
import RotatingText from '@/components/rotating-text';
import SpotlightCard from '@/components/spotlight-card';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { FunctionComponent } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    interface SpotlightProps {
        icon: any;
        title: string;
        text: any;
    }

    const secureIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-15">
            <path
                strokeLinecap="square"
                strokeLinejoin="miter"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
        </svg>
    );
    const secureText = <p className="text-md text-neutral-300">Bleeding edge encryption technology</p>;

    const simpleIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-15">
            <path strokeLinecap="square" strokeLinejoin="miter" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    );
    const simpleText = <p className="text-md text-neutral-300">No distractions, better focus</p>;

    const fastIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-15">
            <path strokeLinecap="square" strokeLinejoin="miter" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
    );
    const fastText = <p className="text-md text-neutral-300">No buffering that bores you</p>;

    const Spotlight: FunctionComponent<SpotlightProps> = (props) => {
        return (
            <SpotlightCard className="flex flex-col items-start gap-5 pt-15 pb-15 text-[#EDEDEC]" spotlightColor="rgba(116, 212, 255, 0.2)">
                {props.icon}
                <div className="flex flex-col gap-3">
                    <h2 className="text-2xl font-black">{props.title}</h2>
                    {props.text}
                </div>
            </SpotlightCard>
        );
    };

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <div style={{ width: '100vw', height: '100vh', position: 'absolute', zIndex: 0 }}>
                <Particles
                    particleColors={['#ffffff', '#ffffff']}
                    particleCount={250}
                    particleSpread={10}
                    speed={0.05}
                    particleBaseSize={100}
                    alphaParticles={false}
                    disableRotation={false}
                />
            </div>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center dark:bg-[#0a0a0a]">
                <header className="z-1 mb-6 w-full text-sm not-has-[nav]:hidden">
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
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-sky-600 dark:text-[#EDEDEC]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-sky-600 px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-sky-600 dark:text-[#EDEDEC]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="z-1 mb-6 flex w-full items-center justify-center opacity-100 transition-opacity duration-1000 lg:grow starting:opacity-0">
                    <div className="flex h-full w-full flex-col-reverse lg:flex-row">
                        <div className="flex flex-1 flex-col items-center justify-center gap-[6rem] rounded-lg pb-12 text-[13px] leading-[20px] dark:text-[#EDEDEC]">
                            <h1 className="text-8xl font-black" style={{ fontFamily: 'DM Sans' }}>
                                Laracoin
                            </h1>
                            <div className="flex flex-row items-center justify-center gap-5">
                                <span className="text-4xl">The</span>{' '}
                                <RotatingText
                                    texts={['no nonsense', 'modern', 'minimalistic']}
                                    style={{ fontFamily: 'DM Sans' }}
                                    mainClassName="text-4xl font-black dark:text-black text-white dark:bg-white bg-black rounded-xl p-2"
                                />{' '}
                                <span className="text-4xl">crypto exchange</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-6 grid w-[70%] grid-cols-[repeat(3,1fr)] items-center justify-center gap-10 opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <Spotlight title="Secure" text={secureText} icon={secureIcon} />
                    <Spotlight title="Simple" text={simpleText} icon={simpleIcon} />
                    <Spotlight title="Fast" text={fastText} icon={fastIcon} />
                </div>
            </div>
        </>
    );
}
