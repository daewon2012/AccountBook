export interface NavigationItem{label:string;href:string}
export const navigationItems:readonly NavigationItem[]=[{label:'대시보드',href:'/'},{label:'거래',href:'/transactions'},{label:'예산',href:'/budgets'},{label:'계좌·자산',href:'/accounts'},{label:'리포트',href:'/reports'},{label:'설정',href:'/settings'}] as const;
export function isCurrentPath(pathname:string,href:string):boolean{return href==='/'?pathname===href:pathname===href||pathname.startsWith(`${href}/`)}
