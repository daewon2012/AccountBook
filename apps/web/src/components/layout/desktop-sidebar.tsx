import Link from 'next/link';
import {NavigationList} from './navigation-list';
export function DesktopSidebar({pathname}:{pathname:string}){return <aside className="desktop-sidebar"><Link className="brand" href="/">AccountBook</Link><nav aria-label="주요 메뉴"><NavigationList pathname={pathname}/></nav></aside>}
