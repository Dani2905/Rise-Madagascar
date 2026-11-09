
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMessaging } from '../context/MessagingContext';
import { Search, Send, ArrowLeft, MessageSquare } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Messages: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { conversations, messages, sendMessage, getMessages, markAsRead } = useMessaging();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isLoading && !user) navigate('/login', { replace: true, state: { returnTo: `/messages${searchParams.toString() ? `?${searchParams.toString()}` : ''}` } });
  }, [isLoading, user, navigate, searchParams]);

  useEffect(() => {
    // Si un ID est passé dans l'URL, ouvrir la conversation
    const partnerId = searchParams.get('partner');
    if (partnerId) {
      setSelectedPartnerId(partnerId);
    }
  }, [searchParams]);

  useEffect(() => {
    // Scroll automatique vers le bas lors d'un nouveau message
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedPartnerId]);

  useEffect(() => {
      // Marquer comme lu quand on ouvre la conversation
      if (selectedPartnerId) {
          const hasUnread = messages.some(m => m.senderId.toString() === selectedPartnerId && m.receiverId.toString() === user?.id.toString() && !m.read);
          if (hasUnread) {
              markAsRead(selectedPartnerId);
          }
      }
  }, [selectedPartnerId, messages, user]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedPartnerId) return;

    sendMessage(selectedPartnerId, inputText);
    setInputText('');
  };

  const activeConversation = conversations.find(c => c.partnerId.toString() === selectedPartnerId);
  const currentMessages = selectedPartnerId ? getMessages(selectedPartnerId) : [];

    // Si on a un partnerId mais pas encore de conversation, on essaie de récupérer ses infos
    const [partnerInfo, setPartnerInfo] = useState<{name: string, avatar: string} | null>(null);

    useEffect(() => {
        if (selectedPartnerId && !activeConversation) {
            const dbUsers = JSON.parse(localStorage.getItem('rise_db_users') || '[]');
            const foundUser = dbUsers.find((u: any) => u.id.toString() === selectedPartnerId);
            if (foundUser) {
                setPartnerInfo({
                    name: foundUser.companyName || `${foundUser.firstName} ${foundUser.lastName}`,
                    avatar: foundUser.logoUrl || foundUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(foundUser.companyName || foundUser.firstName || 'User')}&background=random`
                });
            } else {
                setPartnerInfo({ name: 'Utilisateur', avatar: `https://ui-avatars.com/api/?name=User&background=random` });
            }
        } else {
            setPartnerInfo(null);
        }
    }, [selectedPartnerId, activeConversation]);

  if (!user) return null;


  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-64px)] bg-white flex overflow-hidden">
      
      {/* Sidebar (Liste des conversations) */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-gray-100 flex flex-col bg-slate-50 ${selectedPartnerId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100 bg-white">
            <h1 className="text-xl font-heading font-bold text-slate-900 mb-4">Messages</h1>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Rechercher une conversation..." 
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                    <MessageSquare size={32} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Aucune conversation pour le moment.</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {conversations.map(conv => (
                        <div 
                            key={conv.partnerId}
                            onClick={() => { setSelectedPartnerId(conv.partnerId.toString()); }}
                            className={`p-4 hover:bg-white cursor-pointer transition-colors flex gap-3 ${selectedPartnerId === conv.partnerId.toString() ? 'bg-white border-l-4 border-primary' : 'border-l-4 border-transparent'}`}
                        >
                            <div className="relative shrink-0">
                                <img src={conv.partnerAvatar} alt={conv.partnerName} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                                {conv.unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                        {conv.unreadCount}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-slate-900 truncate">{conv.partnerName}</h3>
                                    <span className="text-[10px] text-gray-400">
                                        {new Date(conv.lastMessageDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-slate-800' : 'text-gray-500'}`}>
                                    {conv.lastMessage}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-white ${!selectedPartnerId ? 'hidden md:flex' : 'flex'}`}>
        {selectedPartnerId ? (
            <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSelectedPartnerId(null)} className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <img src={activeConversation?.partnerAvatar || partnerInfo?.avatar || `https://ui-avatars.com/api/?name=User&background=random`} className="w-10 h-10 rounded-full object-cover border border-gray-100" alt="" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900">{activeConversation?.partnerName || partnerInfo?.name || 'Utilisateur'}</h2>
                            <p className="text-xs text-slate-500 font-medium">Messagerie simulée dans ce navigateur</p>
                        </div>
                    </div>

                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#f0f2f5] space-y-4">
                    {currentMessages.map((msg) => {
                        const isMe = msg.senderId.toString() === user.id.toString();
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] md:max-w-[60%] px-4 py-3 rounded-2xl shadow-sm text-sm relative ${
                                    isMe 
                                    ? 'bg-primary text-slate-900 rounded-br-none' 
                                    : 'bg-white text-slate-800 rounded-bl-none'
                                }`}>
                                    <p>{msg.content}</p>
                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-slate-700/60' : 'text-gray-400'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Écrivez votre message..."
                            className="flex-1 bg-slate-100 border-0 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                        />
                        <button 
                            type="submit"
                            disabled={!inputText.trim()}
                            className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-center p-8">
                <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                    <MessageSquare size={40} className="text-primary" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-slate-900 mb-2">Vos messages</h2>
                <p className="text-gray-500 max-w-sm">Sélectionnez une conversation pour commencer à discuter avec des recruteurs ou des étudiants.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
