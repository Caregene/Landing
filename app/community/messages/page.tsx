"use client"


//import { DMInbox } from "../components/dm-conversation"
import { NotificationProvider } from "../contexts/notification-context"



export default function MessagesPage() {
  // For now, we'll handle this as a client component
  // You might want to implement client-side auth checking

  // Mock user id; replace with real user id from auth if available
  const userId = "current-user"

  return (
    <NotificationProvider userId={userId}>
      <div className="h-screen bg-white">
        <DMInbox 
          onBack={() => window.history.back()}
          onConversationChange={(hasConversation) => {
            // Handle conversation change if needed
            console.log('Conversation changed:', hasConversation)
          }}
          showSidebarHeaderOnMobile={false}
        />
      </div>
    </NotificationProvider>
  )
}
