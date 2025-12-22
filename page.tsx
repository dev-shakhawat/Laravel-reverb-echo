"use client";

import TimeDisplay from "@/components/formatTime";
import SectionTitle from "@/components/sectionTitle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { conversations, messagesByUser } from "@/lib/data";
import { Message, Conversation } from "@/types/messages";
import { Menu, Search, Send } from "lucide-react";
import moment from "moment";
import React, { useState, useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatMessage, ConversationHead } from "@/types/chat";
import { useChatListener } from "@/hooks/useChatListener";

export default function MessagesPage() {
  //
  const [selectedUser, setSelectedUser] = useState<string | null>(
    conversations.length > 0 ? conversations[0].userId : null
  );

  // scroll to bottom chat
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [selectedUser, messagesByUser[selectedUser || ""]?.messages]);

  // echo

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  
  useChatListener(1, (message) => {
    setChatMessages((prev) => [...prev, message]);
  });
  
  console.log(chatMessages);
  
  
  
  
  return (
    <div className="py-7">
      <div className="flex items-start gap-4">
        <div className="mt-2 lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Menu />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border border-primary py-4">
              <DropdownMenuLabel>
                <div className="relative mb-4 w-full">
                  <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    className="bg-white pl-9"
                    type="text"
                    placeholder="Buscar listados, reservas..."
                  />
                </div>
              </DropdownMenuLabel>
              {/* <DropdownMenuSeparator /> */}
              <ScrollArea className="flex h-screen flex-col gap-3 overflow-y-auto">
                {conversations.map((conv: Conversation) => (
                  <DropdownMenuItem
                    key={conv.userId}
                    onClick={() => setSelectedUser(conv.userId)}
                    className={`flex cursor-pointer items-start gap-3 border-l-2 p-3 ${
                      selectedUser === conv.userId
                        ? "border-primary bg-white"
                        : "hover:bg-card border-card"
                    }`}
                  >
                    <Avatar className="border-primary h-11 w-11 rounded-full border">
                      <AvatarImage src={conv.image} alt={conv.firstName} />
                      <AvatarFallback className="bg-primary border-primary text-white">
                        {`${conv.firstName[0]}${conv.lastName[0]}`.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">
                          {conv.firstName} {conv.lastName}
                        </h4>
                      </div>
                      {/* <p className="truncate text-sm text-gray-600">
                        {conv.last_message.text}
                      </p> */}
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <div className="text-xs text-gray-400">
                        {moment(conv.last_message.time).fromNow()}
                      </div>
                      {conv.unread > 0 && (
                        <Badge
                          className="h-5 w-5 text-[11px]"
                          variant="secondary"
                        >
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <SectionTitle title="Mensajes" subtitle="Comunícate con tus clientes" />
      </div>

      <div className="mt-6 flex gap-8">
        {/* Left Sidebar */}
        <section className="hidden w-1/3 flex-col rounded-lg border py-6 lg:flex">
          {/* Search Bar */}
          <div className="px-6">
            <div className="relative mb-4 w-full">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="bg-white pl-9"
                type="text"
                placeholder="Buscar listados, reservas..."
              />
            </div>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex h-[63vh] max-h-[600px] flex-col gap-3 overflow-y-auto">
            {conversations.map((conv: Conversation) => (
              <div
                key={conv.userId}
                onClick={() => setSelectedUser(conv.userId)}
                className={`flex cursor-pointer items-start gap-3 border-l-2 p-3 ${
                  selectedUser === conv.userId
                    ? "border-primary bg-card"
                    : "hover:bg-card border-white"
                }`}
              >
                <Avatar className="border-primary h-11 w-11 rounded-full border">
                  <AvatarImage src={conv.image} alt={conv.firstName} />
                  <AvatarFallback className="bg-primary border-primary text-white">
                    {`${conv.firstName[0]}${conv.lastName[0]}`.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">
                      {conv.firstName} {conv.lastName}
                    </h4>
                  </div>
                  <p className="truncate text-sm text-gray-600">
                    {conv.last_message.text}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <div className="text-xs text-gray-400">
                    {moment(conv.last_message.time).fromNow()}
                  </div>
                  {conv.unread > 0 && (
                    <Badge className="h-5 w-5 text-[11px]" variant="secondary">
                      {conv.unread}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        </section>

        {/* Right Chat Section */}
        <section className="flex w-full flex-col rounded-lg border py-3 lg:w-2/3">
          {selectedUser ? (
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
              {/* User Name */}
              <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-3 pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="border-primary h-11 w-11 rounded-full border">
                    <AvatarImage
                      src={messagesByUser[selectedUser]?.image}
                      alt={messagesByUser[selectedUser]?.firstName}
                    />
                    <AvatarFallback className="bg-primary border-primary text-white">
                      {`${messagesByUser[selectedUser]?.firstName?.[0] ?? ""}${messagesByUser[selectedUser]?.lastName?.[0] ?? ""}`.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-bold">
                      {messagesByUser[selectedUser]?.firstName}{" "}
                      {messagesByUser[selectedUser]?.lastName}
                    </h2>
                    <span className="flex items-center gap-1.5">
                      <p className="h-1.5 w-1.5 rounded-full bg-green-500"></p>
                      <p className="text-muted-foreground text-xs">En Línea</p>
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex h-[55vh] flex-col gap-3 px-3">
                {messagesByUser[selectedUser]?.messages.map(
                  (msg: Message, index: number) => (
                    <div
                      key={index}
                      className={`flex ${msg.from === "you" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`mb-1 max-w-[70%] rounded-lg p-3 ${
                          msg.from === "you"
                            ? "bg-primary text-white"
                            : "bg-card text-muted"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <p className="mt-1 text-right text-xs opacity-70">
                          <TimeDisplay time={msg.time} />
                        </p>
                      </div>
                    </div>
                  )
                )}
                <div ref={messagesEndRef} />
              </ScrollArea>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-gray-500">
              Selecciona una conversación para empezar a chatear
            </div>
          )}

          {/* Message Input */}
          {selectedUser && (
            <div className="border-t px-4">
              <div className="mt-3 flex items-center gap-3">
                <Input placeholder="Escribe un mensaje..." className="flex-1" />
                <Button>
                  <Send />
                </Button>
              </div>
              <p className="text-muted-foreground p-1 text-xs">
                Presiona Enter para enviar, Shift + Enter para nueva línea
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
