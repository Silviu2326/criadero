import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { messagesApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  read: boolean;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

interface Conversation {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
    role: string;
  };
  lastMessage?: Message;
  unreadCount: number;
}

export function MessagesPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const { data: conversationsData, isLoading: conversationsLoading } = useQuery(
    ['conversations'],
    () => messagesApi.getConversations().then((r) => r.data),
    { refetchInterval: 10000 } // Refetch every 10 seconds
  );

  // Fetch messages with selected user
  const { data: messagesData, isLoading: messagesLoading } = useQuery(
    ['messages', selectedUserId],
    () => messagesApi.getMessages(selectedUserId!).then((r) => r.data),
    { enabled: !!selectedUserId, refetchInterval: 5000 }
  );

  // Send message mutation
  const sendMessageMutation = useMutation(
    (content: string) =>
      messagesApi.sendMessage({
        receiverId: selectedUserId!,
        content,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['messages', selectedUserId]);
        queryClient.invalidateQueries(['conversations']);
        setMessageText('');
      },
    }
  );

  const conversations: Conversation[] = conversationsData?.conversations || [];
  const messages: Message[] = messagesData?.messages || [];

  // Filter conversations by search
  const filteredConversations = conversations.filter((conv) =>
    `${conv.user.firstName} ${conv.user.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedConversation = conversations.find(
    (c) => c.user.id === selectedUserId
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUserId) return;
    sendMessageMutation.mutate(messageText.trim());
  };

  // Mobile view
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="animate-fade-in h-[calc(100vh-8rem)]">
      <div className="card h-full overflow-hidden flex">
        {/* Conversations List */}
        <div
          className={cn(
            'w-full lg:w-80 border-r border-apple-gray-300border-gray-700 flex flex-col',
            showChat && selectedUserId ? 'hidden lg:flex' : 'flex'
          )}
        >
          {/* Header */}
          <div className="p-4 border-b border-apple-gray-300border-gray-700">
            <h1 className="text-xl font-semibold text-apple-blacktext-white mb-4">
              Mensajes
            </h1>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray-100"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar conversación..."
                className="input-apple pl-10 w-full"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversationsLoading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="skeleton w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <div className="skeleton h-4 w-32 mb-2" />
                      <div className="skeleton h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-apple-gray-100">No hay conversaciones</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.user.id}
                  onClick={() => {
                    setSelectedUserId(conversation.user.id);
                    setShowChat(true);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 p-4 hover:bg-apple-grayhover:bg-gray-800 transition-colors text-left',
                    selectedUserId === conversation.user.id &&
                      'bg-blue-50bg-blue-900/20'
                  )}
                >
                  {conversation.user.avatarUrl ? (
                    <img
                      src={conversation.user.avatarUrl}
                      alt={`${conversation.user.firstName} ${conversation.user.lastName}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-apple-blue to-blue-400 flex items-center justify-center text-white font-medium">
                      {conversation.user.firstName[0]}
                      {conversation.user.lastName[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-apple-blacktext-white truncate">
                        {conversation.user.firstName} {conversation.user.lastName}
                      </p>
                      {conversation.lastMessage && (
                        <span className="text-xs text-apple-gray-100">
                          {format(
                            new Date(conversation.lastMessage.createdAt),
                            'HH:mm',
                            { locale: es }
                          )}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-apple-gray-100 truncate">
                      {conversation.lastMessage?.content || 'Sin mensajes'}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 bg-apple-blue text-white text-xs font-medium rounded-full flex items-center justify-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={cn(
            'flex-1 flex flex-col',
            !showChat || !selectedUserId ? 'hidden lg:flex' : 'flex'
          )}
        >
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-4 p-4 border-b border-apple-gray-300border-gray-700">
                <button
                  onClick={() => setShowChat(false)}
                  className="lg:hidden p-2 hover:bg-apple-grayhover:bg-gray-800 rounded-lg"
                >
                  <ArrowLeft size={20} />
                </button>
                {selectedConversation.user.avatarUrl ? (
                  <img
                    src={selectedConversation.user.avatarUrl}
                    alt={`${selectedConversation.user.firstName} ${selectedConversation.user.lastName}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-apple-blue to-blue-400 flex items-center justify-center text-white font-medium">
                    {selectedConversation.user.firstName[0]}
                    {selectedConversation.user.lastName[0]}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-apple-blacktext-white">
                    {selectedConversation.user.firstName}{' '}
                    {selectedConversation.user.lastName}
                  </p>
                  <p className="text-sm text-green-600">En línea</p>
                </div>
                <button className="p-2 hover:bg-apple-grayhover:bg-gray-800 rounded-lg">
                  <Phone size={20} className="text-apple-gray-200" />
                </button>
                <button className="p-2 hover:bg-apple-grayhover:bg-gray-800 rounded-lg">
                  <MoreVertical size={20} className="text-apple-gray-200" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messagesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          'flex',
                          i % 2 === 0 ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div className="skeleton h-12 w-64 rounded-2xl" />
                      </div>
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-apple-gray-100">
                      Envía un mensaje para iniciar la conversación
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const isOwn = message.senderId === user?.id;
                    const showAvatar =
                      index === 0 ||
                      messages[index - 1].senderId !== message.senderId;

                    return (
                      <div
                        key={message.id}
                        className={cn('flex gap-2', isOwn && 'flex-row-reverse')}
                      >
                        {!isOwn && showAvatar ? (
                          message.sender.avatarUrl ? (
                            <img
                              src={message.sender.avatarUrl}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-apple-blue to-blue-400 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                              {message.sender.firstName[0]}
                            </div>
                          )
                        ) : (
                          !isOwn && <div className="w-8 flex-shrink-0" />
                        )}
                        <div
                          className={cn(
                            'max-w-[70%] px-4 py-2 rounded-2xl',
                            isOwn
                              ? 'bg-apple-blue text-white rounded-br-md'
                              : 'bg-apple-graybg-gray-700 text-apple-blacktext-white rounded-bl-md'
                          )}
                        >
                          <p>{message.content}</p>
                          <div
                            className={cn(
                              'flex items-center gap-1 mt-1 text-xs',
                              isOwn
                                ? 'text-white/70'
                                : 'text-apple-gray-100'
                            )}
                          >
                            <span>
                              {format(new Date(message.createdAt), 'HH:mm', {
                                locale: es,
                              })}
                            </span>
                            {isOwn && (
                              <span>
                                {message.read ? (
                                  <CheckCheck size={14} />
                                ) : (
                                  <Check size={14} />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-apple-gray-300border-gray-700"
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-2 hover:bg-apple-grayhover:bg-gray-800 rounded-lg text-apple-gray-200"
                  >
                    <Paperclip size={20} />
                  </button>
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 input-apple"
                  />
                  <button
                    type="button"
                    className="p-2 hover:bg-apple-grayhover:bg-gray-800 rounded-lg text-apple-gray-200"
                  >
                    <Smile size={20} />
                  </button>
                  <button
                    type="submit"
                    disabled={!messageText.trim() || sendMessageMutation.isLoading}
                    className="p-3 bg-apple-blue text-white rounded-xl hover:bg-apple-blue-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-apple-graybg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="text-apple-gray-300" size={32} />
                </div>
                <p className="text-apple-gray-100">
                  Selecciona una conversación para ver los mensajes
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
