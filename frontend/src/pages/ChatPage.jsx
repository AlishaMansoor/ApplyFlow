import React from 'react'
import axios from 'axios';
import { AuthDataContext } from '../context/AuthContext.jsx';
import { UserDataContext } from '../context/UserContext.jsx';
import ConversationList from '../components/ui/ConversationList.jsx';
import ChatWindow from '../components/ui/ChatWindow.jsx';
import Sidebar from '../components/layout/Sidebar.jsx'
import Navbar from '../components/layout/Navbar.jsx';
import { AnimatePresence } from 'framer-motion';
import { ChatDataContext } from '../context/ChatContext.jsx'
import { useNavigate } from 'react-router-dom';
const Chats = () => {



    const { serverUrl } = React.useContext(AuthDataContext);
    const { userData } = React.useContext(UserDataContext);
    const {
        chats,
        setChats,
        requestCount,
        setRequestCount,
        selectedConversation,
        setSelectedConversation,
        invites,
        setInvites } = React.useContext(ChatDataContext);

    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const navigate = useNavigate();



    const handleCloseConversation = () => {

        if (selectedConversation) {
            setSelectedConversation(null);

        } else {
            // console.log("No conversation selected, navigating back.");
            navigate(-1);
        }
    }



    return (
        <div className="mt-[80px] h-[calc(100vh-80px)] w-full flex bg-gray-50 p-6">
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Sidebar — small/medium */}
            <div className="lg:hidden">
                <AnimatePresence>
                    {sidebarOpen && (
                        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    )}
                </AnimatePresence>
            </div>

            {/* Sidebar — large */}
            <div className="hidden lg:block">
                <Sidebar sidebarOpen={true} setSidebarOpen={setSidebarOpen} />
            </div>

            {!selectedConversation ? <ConversationList onClose={handleCloseConversation} /> :
                <ChatWindow conversation={selectedConversation} />
            }
        </div>
    )
}

export default Chats
