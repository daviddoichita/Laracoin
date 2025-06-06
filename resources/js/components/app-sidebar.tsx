import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeftRight, ChartNoAxesCombined, LayoutGrid, List, Plus, ReceiptText, Wallet } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'My balances',
        href: '/my-balances',
        icon: Wallet,
    },
    {
        title: 'My orders',
        href: '/my-orders',
        icon: ReceiptText,
    },
    {
        title: 'My transactions',
        href: '/my-transactions',
        icon: ArrowLeftRight,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Add crypto',
        href: '/crypto/add',
        icon: Plus,
    },
    {
        title: 'Cryptos list',
        href: '/crypto/list',
        icon: List,
    },
    {
        title: 'Metric endpoints',
        href: '/metrics',
        icon: ChartNoAxesCombined,
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} title="Platform" />
                {auth.user?.admin ? <NavMain items={adminNavItems} title="Administration"></NavMain> : <></>}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
