import { useAppStore } from '@/store';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ContactsContainer from './components/contacts-container';
import EmptyChatContainer from './components/empty-chat-container';
import ChatContainer from './components/chat-container';

const Chat = () => {
    const {userInfo} = useAppStore()
    const navigate = useNavigate()
    useEffect(
        () => {
            if (!userInfo.profileSetup) {
                toast("please setup profile to continue.")
                navigate("/profile")
            }
        }, [userInfo, navigate]
    )
    return (
        <div className='flex h-[100vh] overflow-hidden text-white'>
            <ContactsContainer />
            {/* <EmptyChatContainer /> */}
            <ChatContainer />
        </div>
    )
}

export default Chat;