import Link from "next/link";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { routs } from "@/shared/routs";

export default function Header(){
    return <header className="flex items-center gap-2 border-b border-border bg-card px-4 py-2 text-card-foreground">
        <SidebarTrigger />
        <Link href={routs.main}><span>Собиратель привычек русских</span></Link>
    </header>
}