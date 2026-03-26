'use client'

import { createContext, useContext } from 'react'

interface SocketContextType {
  socket: null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export function SocketProvider({ children }: { children: React.ReactNode }) {
  return <SocketContext.Provider value={{ socket: null, isConnected: false }}>{children}</SocketContext.Provider>
}

export function useSocket() {
  return useContext(SocketContext)
}
