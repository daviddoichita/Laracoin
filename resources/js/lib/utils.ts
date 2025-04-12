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
    const crypto = window.crypto
    return crypto.randomUUID().slice(0, len)
}

