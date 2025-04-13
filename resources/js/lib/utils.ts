import { Auth } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function checkRole(auth: Auth) {
    if (auth.user?.admin !== true) {
        window.location.href = route('dashboard');
    }
}

export function shortUUID(len: number = 6): string {
    // Comment out because it cant be used in server side
    // const crypto = window.crypto
    // return crypto.randomUUID().slice(0, len)
    const chars = 'ABCDEFGHIJKLMNOPQRSTabcdefghijklmnopqrst123456789'
    let result = ''
    for (let i = 0; i < len; i++) {
        result += chars[Math.random() * chars.length]
    }

    return result
}

