'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {DesktopSidebar} from './desktop-sidebar';
import {MobileNavigation} from './mobile-navigation';
export function AppShell({children}:Readonly<{children:React.ReactNode}>){const pathname=usePathname();return <><a className="skip-link" href="#main-content">본문으로 건너뛰기</a><div className="app-shell"><DesktopSidebar pathname={pathname}/><div className="shell-content"><MobileNavigation pathname={pathname}/><header className="topbar"><strong>AccountBook</strong><Link className="quick-add" href="/transactions/new">거래 등록</Link></header><main id="main-content" className="main-content" tabIndex={-1}>{children}</main></div></div></>}
