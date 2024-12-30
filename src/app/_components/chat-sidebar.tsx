'use client'

import React, { useState } from 'react'
import { PlusIcon, MessageSquareIcon, UserIcon } from 'lucide-react'

type Conversation = {
  id: string
  title: string
  date: string
}

export function ChatSidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: '1', title: 'ChatGPT Basics', date: '2023-05-01' },
    { id: '2', title: 'AI Ethics Discussion', date: '2023-05-02' },
    { id: '3', title: 'Coding Help', date: '2023-05-03' },
    // Add more conversations as needed
  ])

  const addNewConversation = () => {
    const newConversation: Conversation = {
      id: (conversations.length + 1).toString(),
      title: `New Chat ${conversations.length + 1}`,
      date: new Date().toISOString().split('T')[0],
    }
    setConversations([newConversation, ...conversations])
  }

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      <div className="p-4">
        <button
          onClick={addNewConversation}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          New chat
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        <nav>
          {conversations.map((conversation) => (
            <a
              key={conversation.id}
              href="#"
              className="block px-4 py-2 hover:bg-gray-700 transition-colors duration-150"
            >
              <div className="flex items-center">
                <MessageSquareIcon className="mr-2 h-4 w-4" />
                <div>
                  <div className="font-medium">{conversation.title}</div>
                  <div className="text-xs text-gray-400">{conversation.date}</div>
                </div>
              </div>
            </a>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-700">
        <button className="w-full text-left flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
            <UserIcon className="h-5 w-5" />
          </div>
          <span>Username</span>
        </button>
      </div>
    </aside>
  )
}

