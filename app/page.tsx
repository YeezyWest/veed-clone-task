import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Canvas } from "@/components/Canvas";
import { Timeline } from "@/components/Timeline";
import { EditorShortcuts } from "@/components/EditorShortcuts";

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-full bg-zinc-950 font-sans text-zinc-50 select-none">
      <EditorShortcuts />
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-hidden">
          <Canvas />
          <Timeline />
        </main>
      </div>
    </div>
  );
}
