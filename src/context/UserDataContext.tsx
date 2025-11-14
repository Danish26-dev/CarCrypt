import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type DidHistoryEntry = {
  id: string
  time: string
  title: string
  description: string
}

export type CredentialDocument = {
  id: string
  name: string
  size: number
  uploadedAt: string
  objectUrl: string
}

type UserDataContextValue = {
  didHistory: DidHistoryEntry[]
  addDidEntry: (entry: DidHistoryEntry) => void
  documents: CredentialDocument[]
  addDocument: (file: File) => void
}

const initialDidHistory: DidHistoryEntry[] = [
  {
    id: 'history-1',
    time: 'Today · 11:04',
    title: 'Linked DAO contributor credential',
    description: 'Credential hash stored in Backpack ledger.',
  },
  {
    id: 'history-2',
    time: 'Yesterday · 18:23',
    title: 'Rotated encryption key',
    description: 'New recovery phrase encrypted and pushed to secure storage.',
  },
  {
    id: 'history-3',
    time: '2 days ago',
    title: 'Added DID:did:ppn:studio:493',
    description: 'MongoDB replication completed · 5 region nodes confirmed.',
  },
]

const UserDataContext = createContext<UserDataContextValue | undefined>(undefined)

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const [didHistory, setDidHistory] = useState<DidHistoryEntry[]>(initialDidHistory)
  const [documents, setDocuments] = useState<CredentialDocument[]>([])

  const value = useMemo<UserDataContextValue>(
    () => ({
      didHistory,
      addDidEntry: (entry) => setDidHistory((previous) => [entry, ...previous]),
      documents,
      addDocument: (file) => {
        const objectUrl = URL.createObjectURL(file)
        const entry: CredentialDocument = {
          id: `doc-${Date.now()}`,
          name: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          objectUrl,
        }
        setDocuments((prev) => [entry, ...prev])
      },
    }),
    [didHistory, documents],
  )

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>
}

export const useUserData = () => {
  const context = useContext(UserDataContext)
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider')
  }
  return context
}

