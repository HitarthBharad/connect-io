"use client"

import { Chain } from "@/types/chains"
import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'

type ChainContextType = {
    chains: Chain[]
    addChain: (chain: Omit<Chain, "_id" | "dateCreated" | "lastModified">) => void
    updateChain: (id: string, chain: Partial<Chain>) => void
    deleteChain: (id: string) => void
}

const ChainContext = createContext<ChainContextType | undefined>(undefined)

export function ChainProvider({ children }: { children: React.ReactNode }) {

    const router = useRouter();
    const [chains, setChains] = useState<Chain[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("chains")
            return saved ? JSON.parse(saved) : []
        }
        return []
    })

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await fetch("/api/chains/get");
                if (!response.ok) toast.error("Something went wrong");
                const data: Chain[] = await response.json();
                setChains(data);
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        };

        fetchTopics();
    }, []);

    const addChain = async (chain: Omit<Chain, "_id" | "dateCreated" | "lastModified">) => {
        try {
            const response = await fetch("/api/chains/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(chain),
            });
      
            if (!response.ok) {
                toast.error("Something went wrong while creating a new topic");
                return;
            }
      
            const newChain: Chain = await response.json();
            setChains((prev) => [...prev, newChain]); 
            router.push("/chains");           
          } catch (error: any) {
            toast.error(error.message);
          }
    }

    const updateChain = async (_id: string, chain: Partial<Chain>) => {
        try {
      
            const response = await fetch(`/api/topics/update`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({...chain, _id}),
            });
      
            if (!response.ok) toast.error("Something went wrong while updating your topic");
      
            setChains((prev) => prev.map((t) => (t._id === _id ? { ...t, ...chain } : t)));
          } catch (error) {
            console.error("Error updating topic:", error);
          }
    }

    const deleteChain = (id: string) => {
        setChains((prev) => prev.filter((c) => c._id !== id))
    }

    // const importChain = async (file: File): Promise<void> => {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader()

    //         reader.onload = (event) => {
    //             try {
    //                 if (!event.target?.result) {
    //                     reject(new Error("Failed to read file"))
    //                     return
    //                 }

    //                 const content = JSON.parse(event.target.result as string)

    //                 if (!content.nodes || !content.edges) {
    //                     reject(new Error("Invalid chain format"))
    //                     return
    //                 }

    //                 const chainName = file.name.replace(/\.json$/, "")

    //                 addChain({
    //                     name: chainName,
    //                     description: `Imported from ${file.name}`,
    //                     nodes: content.nodes,
    //                     edges: content.edges,
    //                 })

    //                 resolve()
    //             } catch (error) {
    //                 reject(error)
    //             }
    //         }

    //         reader.onerror = () => {
    //             reject(new Error("Error reading file"))
    //         }

    //         reader.readAsText(file)
    //     })
    // }

    return (
        <ChainContext.Provider value={{ chains, addChain, updateChain, deleteChain }}>
            {children}
        </ChainContext.Provider>
    )
}

export function useChains() {
    const context = useContext(ChainContext)
    if (context === undefined) {
        throw new Error("useChains must be used within a ChainProvider")
    }
    return context
}

