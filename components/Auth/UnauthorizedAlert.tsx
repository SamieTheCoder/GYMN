"use client";

import { useEffect } from "react";
import { useToast } from "../ui/use-toast";

export default function UnauthorizedAlert() {
    const { toast } = useToast();
    useEffect(() => {
        //extract cookies, separating them
        const cookies = document.cookie.split("; ");
        const unauthorizedAction = cookies.find(
            (cookie) => cookie.startsWith("UnauthorizedAction=") // find the verification alert cookie
        );

        if (unauthorizedAction?.split("=")[1] === "true") {
            toast({
                variant: "destructive",
                title: "Access denied.",
                description: "Create an account or log in to access this page.",
            });
        }

        //delete the unused cookie
        document.cookie = "UnauthorizedAction=false; Max-Age=0";
    }, [toast]);
    return true;
}
