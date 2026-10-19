import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Send } from 'lucide-react'
import Navbar from '../Components/Navbar'
import { getSocket } from '../socketClient'

const Messages = () => {
    const [conversations, setConversations] = useState([])
    const [activeUserId, setActiveUserId] = useState(null)
    const [messages, setMessages] = useState([])
    const [text, setText] = useState('')
    const [loadingConvos, setLoadingConvos] = useState(true)
    const [loadingMessages, setLoadingMessages] = useState(false)
    const bottomRef = useRef(null)
    const activeUserIdRef = useRef(null) // lets the socket listener always see the current value, not a stale closure

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    useEffect(() => {
        activeUserIdRef.current = activeUserId
    }, [activeUserId])

    useEffect(() => {
        axios
            .get('http://localhost:3000/messages/conversations', { headers })
            .then((res) => {
                setConversations(res.data)
                if (res.data.length > 0) setActiveUserId(res.data[0].userId)
            })
            .catch((error) => console.log('error occured', error.response?.data))
            .finally(() => setLoadingConvos(false))
    }, [])

    useEffect(() => {
        if (!activeUserId) return
        setLoadingMessages(true)
        axios
            .get(`http://localhost:3000/messages/${activeUserId}`, { headers })
            .then((res) => setMessages(res.data))
            .catch((error) => console.log('error occured', error.response?.data))
            .finally(() => setLoadingMessages(false))
    }, [activeUserId])

    // live incoming messages via socket, instead of polling
    useEffect(() => {
        const socket = getSocket()
        if (!socket) return

        const handleNewMessage = (message) => {
            if (message.fromUserId === activeUserIdRef.current) {
                setMessages((prev) => [...prev, message])
            }
            setConversations((prev) =>
                prev.map((c) =>
                    c.userId === message.fromUserId
                        ? { ...c, lastMessage: message.text, lastMessageAt: message.createdAt }
                        : c
                )
            )
        }

        socket.on('newMessage', handleNewMessage)
        return () => socket.off('newMessage', handleNewMessage)
    }, [])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async (e) => {
        e.preventDefault()
        if (!text.trim() || !activeUserId) return

        try {
            const res = await axios.post(
                `http://localhost:3000/messages/${activeUserId}`,
                { text },
                { headers }
            )
            setMessages((prev) => [...prev, res.data])
            setConversations((prev) =>
                prev.map((c) =>
                    c.userId === activeUserId
                        ? { ...c, lastMessage: res.data.text, lastMessageAt: res.data.createdAt }
                        : c
                )
            )
            setText('')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to send message')
        }
    }

    const activeConversation = conversations.find((c) => c.userId === activeUserId)

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            <div className="flex-1 max-w-5xl w-full mx-auto flex border-x border-pink-100">
                <div className="w-72 border-r border-pink-100 flex-shrink-0 overflow-y-auto">
                    {loadingConvos ? (
                        <p className="p-4 text-sm text-gray-400">Loading...</p>
                    ) : conversations.length === 0 ? (
                        <p className="p-4 text-sm text-gray-400">
                            No conversations yet — matches you message will show up here.
                        </p>
                    ) : (
                        conversations.map((c) => (
                            <button
                                key={c.userId}
                                onClick={() => setActiveUserId(c.userId)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-pink-50 transition-colors ${
                                    activeUserId === c.userId ? 'bg-pink-50' : 'hover:bg-pink-50/50'
                                }`}
                            >
                                <div className="w-10 h-10 rounded-full bg-pink-100 flex-shrink-0 overflow-hidden">
                                    {c.photoUrl && (
                                        <img src={c.photoUrl} alt={c.name} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                                    <p className="text-xs text-gray-400 truncate">
                                        {c.lastMessage || 'Say hello 👋'}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                    {!activeConversation ? (
                        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                            {conversations.length === 0
                                ? 'Match with someone to start a conversation.'
                                : 'Select a conversation to start chatting.'}
                        </div>
                    ) : (
                        <>
                            <div className="px-5 py-3 border-b border-pink-100 font-semibold text-gray-900">
                                {activeConversation.name}
                            </div>

                            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
                                {loadingMessages ? (
                                    <p className="text-sm text-gray-400">Loading messages...</p>
                                ) : messages.length === 0 ? (
                                    <p className="text-sm text-gray-400">No messages yet — say hello!</p>
                                ) : (
                                    messages.map((m) => (
                                        <div
                                            key={m._id}
                                            className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                                                m.fromUserId === activeUserId
                                                    ? 'bg-pink-50 text-gray-800 mr-auto rounded-bl-sm'
                                                    : 'bg-pink-600 text-white ml-auto rounded-br-sm'
                                            }`}
                                        >
                                            {m.text}
                                        </div>
                                    ))
                                )}
                                <div ref={bottomRef} />
                            </div>

                            <form onSubmit={handleSend} className="flex gap-2 p-3 border-t border-pink-100">
                                <input
                                    type="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 border border-pink-200 rounded-full px-4 py-2 text-sm outline-none focus:border-pink-400 transition-colors"
                                />
                                <button
                                    type="submit"
                                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-pink-600 hover:bg-pink-700 text-white rounded-full transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Messages
