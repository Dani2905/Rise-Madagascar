
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Message, Conversation } from '../types';

interface MessagingContextType {
  conversations: Conversation[];
  messages: Message[];
  unreadTotal: number;
  sendMessage: (receiverId: string | number, content: string, receiverName?: string, receiverAvatar?: string) => void;
  getMessages: (partnerId: string | number) => Message[];
  markAsRead: (partnerId: string | number) => void;
  refreshMessages: () => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [unreadTotal, setUnreadTotal] = useState(0);

  // Charger les messages au démarrage et quand l'user change
  useEffect(() => {
    refreshMessages();
    
    // Polling pour simuler le temps réel (vérifier les nouveaux messages toutes les 2s)
    const interval = setInterval(refreshMessages, 2000);
    return () => clearInterval(interval);
  }, [user]);

  const refreshMessages = () => {
    if (!user) return;

    const storedMessages: Message[] = JSON.parse(localStorage.getItem('rise_messages') || '[]');
    setAllMessages(storedMessages);

    // Calculer les conversations
    const userMsgs = storedMessages.filter(m => 
      m.senderId.toString() === user.id.toString() || 
      m.receiverId.toString() === user.id.toString()
    );

    const partnersMap = new Map<string, Conversation>();

    // 1. Récupérer tous les utilisateurs pour avoir les noms/avatars corrects
    const dbUsers = JSON.parse(localStorage.getItem('rise_db_users') || '[]');

    userMsgs.forEach(msg => {
      const isSender = msg.senderId.toString() === user.id.toString();
      const partnerId = isSender ? msg.receiverId.toString() : msg.senderId.toString();
      
      // Trouver les infos du partenaire
      let partnerName = 'Utilisateur';
      let partnerAvatar = `https://ui-avatars.com/api/?name=User&background=random`;

      const partnerUser = dbUsers.find((u: any) => u.id.toString() === partnerId);
      if (partnerUser) {
          partnerName = partnerUser.companyName || `${partnerUser.firstName} ${partnerUser.lastName}`;
          partnerAvatar = partnerUser.logoUrl || partnerUser.avatarUrl || partnerAvatar;
      }

      if (!partnersMap.has(partnerId)) {
        partnersMap.set(partnerId, {
          partnerId,
          partnerName,
          partnerAvatar,
          lastMessage: msg.content,
          lastMessageDate: msg.timestamp,
          unreadCount: 0
        });
      } else {
        // Mettre à jour le dernier message si celui-ci est plus récent
        const existing = partnersMap.get(partnerId)!;
        if (new Date(msg.timestamp) > new Date(existing.lastMessageDate)) {
            existing.lastMessage = msg.content;
            existing.lastMessageDate = msg.timestamp;
        }
      }

      // Compter les non-lus (messages reçus par moi et non lus)
      if (!isSender && !msg.read) {
        const conv = partnersMap.get(partnerId)!;
        conv.unreadCount += 1;
      }
    });

    const convList = Array.from(partnersMap.values()).sort((a, b) => 
        new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime()
    );

    setConversations(convList);
    setUnreadTotal(convList.reduce((acc, curr) => acc + curr.unreadCount, 0));
  };

  const sendMessage = (receiverId: string | number, content: string, receiverName?: string, receiverAvatar?: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: receiverId,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };

    const updatedMessages = [...allMessages, newMessage];
    localStorage.setItem('rise_messages', JSON.stringify(updatedMessages));
    
    // Mise à jour immédiate de l'état
    refreshMessages();
  };

  const getMessages = (partnerId: string | number) => {
    if (!user) return [];
    return allMessages.filter(m => 
      (m.senderId.toString() === user.id.toString() && m.receiverId.toString() === partnerId.toString()) ||
      (m.senderId.toString() === partnerId.toString() && m.receiverId.toString() === user.id.toString())
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const markAsRead = (partnerId: string | number) => {
    if (!user) return;
    
    const updatedMessages = allMessages.map(m => {
      if (m.senderId.toString() === partnerId.toString() && m.receiverId.toString() === user.id.toString()) {
        return { ...m, read: true };
      }
      return m;
    });

    localStorage.setItem('rise_messages', JSON.stringify(updatedMessages));
    refreshMessages();
  };

  return (
    <MessagingContext.Provider value={{ conversations, messages: allMessages, unreadTotal, sendMessage, getMessages, markAsRead, refreshMessages }}>
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};
