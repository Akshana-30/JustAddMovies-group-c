// src/components/sidebar/genre-sidebar.tsx
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GenreCard } from "@/components/body/genre-card";

type Genre = { id: string; name: string };

export function GenreSidebar({ genres }: { genres: Genre[] }) {
  return (
    <SidebarProvider className="p-10">
      {/* ── Trigger button (can live anywhere in the tree) ── */}
      <SidebarTrigger className="border-(--gold)/50 hover:border-(--gold) border-2 text-(--gold)/80 hover:text-(--gold) hover:bg-(--gold)/15" />

      <Sidebar side="left" variant="floating" collapsible="offcanvas">
        <SidebarHeader className="h-14 justify-center border-b border-border px-4">
          <p className="text-sm font-semibold tracking-widest text-primary">
            GENRES
          </p>
        </SidebarHeader>

        <SidebarContent>
          <ScrollArea className="h-full">
            <SidebarMenu className=" flex-row! flex-wrap gap-1">
              {genres.map((genre) => (
                <SidebarMenuItem className="border-amber-300/50 hover:border-(--gold)/70 border flex-row! flex-wrap content-start gap-2 pl-2 overflow-y-auto bg-primary/20 h-25 xl:h-150 " key={genre.id}>
                    <GenreCard key={genre.id} id={genre.id} name={genre.name} />
                 
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
