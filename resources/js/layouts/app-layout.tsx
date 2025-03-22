import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import AppHeaderLayout from './app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

const getLayout = ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const appLayout = localStorage.getItem('app-layout')
    if (appLayout && appLayout === "sidebar") {
        return (
            <AppSidebarLayout breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppSidebarLayout>
        )
    } else {
        return (
            <AppHeaderLayout breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppHeaderLayout>
        )
    }
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    return getLayout({ children, breadcrumbs, ...props })
}