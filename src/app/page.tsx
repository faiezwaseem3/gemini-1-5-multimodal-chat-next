// app/page.tsx
import { ChatSidebar } from "./_components/chat-sidebar";
import { ChatContainer } from "./_components/ChatContainer";


export default function Home() {
  return (
    <main className="flex flex-row h-screen w-screen">
        <ChatSidebar />
      <ChatContainer />
    </main>
  );
}
