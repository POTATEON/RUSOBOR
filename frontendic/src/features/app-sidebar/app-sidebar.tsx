import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/shared/components/ui/sidebar";
import Link from "next/link";
import { routs } from "@/shared/routs";

export default function AppSidebar(){
    return <Sidebar>
            <SidebarHeader>RUSOBOR</SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Link href={routs.main}>
                                <SidebarMenuButton>Главная</SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link href={routs.habit}>
                                <SidebarMenuButton>привычечки</SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link href={routs.myhabit}>
                                <SidebarMenuButton>мои привычечки</SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link href={routs.profile}>
                                <SidebarMenuButton>Профиль</SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link href={routs.achievements}>
                                <SidebarMenuButton>Достижения</SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link href={routs.settings}>
                                <SidebarMenuButton>Настройки</SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>© 2025</SidebarFooter>
    </Sidebar>
}