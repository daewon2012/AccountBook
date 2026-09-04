import Link from 'next/link';
import {isCurrentPath,navigationItems} from './navigation-items';
export function NavigationList({pathname,onNavigate}:{pathname:string;onNavigate?:()=>void}){return <ul className="nav-list">{navigationItems.map((item)=><li key={item.href}><Link className="nav-link" href={item.href} aria-current={isCurrentPath(pathname,item.href)?'page':undefined} onClick={onNavigate}>{item.label}</Link></li>)}</ul>}
