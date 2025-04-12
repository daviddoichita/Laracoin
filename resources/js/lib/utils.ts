import { Auth } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function checkRole(auth: Auth) {
    if (auth.user?.admin !== 1) {
        window.location.href = route('dashboard');
    }
}

export function shortUUID(len: number = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < len; i++) {
        const randIdx = Math.floor(Math.random() * chars.length);
        result += chars[randIdx];
    }

    return result;
}

