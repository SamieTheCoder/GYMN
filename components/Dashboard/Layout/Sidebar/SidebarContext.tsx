"use client";

import { usePathname } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from "react";

interface SidebarContextType {
    sidebarOpen: boolean;
    setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    isClient: boolean;
    screenWidth: number;
    pathname: string;
}

export const SidebarData = createContext<SidebarContextType>({
    sidebarOpen: false,
    setSidebarOpen: () => {}, // Provide a no-op function as default
    isClient: false,
    screenWidth: 0,
    pathname: "",
});

export default function SidebarContext({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [isClient, setIsClient] = useState(false);
    const [screenWidth, setScreenWidth] = useState<number>(0); // Initialize with 0

    const pathname = usePathname();

    function getCurrentDimension() {
        return window.innerWidth;
    }

    // HANDLER Sidebar Size
    useEffect(() => {
        setIsClient(true);
        setScreenWidth(getCurrentDimension()); // Sets the initial width when the component is mounted

        // Adds the event listener only on the client side
        const updateDimension = () => {
            setScreenWidth(getCurrentDimension());
        };
        window.addEventListener("resize", updateDimension);

        return () => {
            window.removeEventListener("resize", updateDimension); // Removes the event listener when unmounting the component
        };
    }, []);

    return (
        <SidebarData.Provider
            value={{ sidebarOpen, setSidebarOpen, isClient, screenWidth, pathname }}
        >
            {children}
        </SidebarData.Provider>
    );
}
