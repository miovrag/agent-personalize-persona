import Sidebar from "@/components/Sidebar";
import PersonaEditor from "@/components/PersonaEditor";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <PersonaEditor initialName="Grad Niš" />
      </main>
    </div>
  );
}
