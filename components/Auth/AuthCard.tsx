"use client";

import { createContext, useState, Dispatch, SetStateAction } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import RegistrationFormProvider from "./Register/RegistrationFormProvider";
import LoginForm from "./Login/LoginForm";

export type AuthState = "login" | "register";

export type AuthCardContextType = {
    authState: AuthState;
    setAuthState: Dispatch<SetStateAction<AuthState>>;
};

// This context is exported here to be used in the registration component, where redirect to login is done through authstate
// Creating a context avoids prop drilling and has positive impacts on performance
export const AuthCardContext = createContext<AuthCardContextType>({
    authState: "login",
    setAuthState: () => {},
});

export default function AuthCard() {
    const [authState, setAuthState] = useState<AuthState>("login");

    return (
        <AuthCardContext.Provider value={{ authState, setAuthState }}>
            <Card>
                <CardHeader>
                    <CardTitle>{authState == "login" ? "Login" : "Register"}</CardTitle>
                    <CardDescription>
                        {authState == "login"
                            ? "Fill in the fields below to log in to the application"
                            : "Fill in the fields below to register for the application"}
                    </CardDescription>
                    <div className='w-full h-[1px] bg-muted-foreground/20'></div>
                </CardHeader>
                <CardContent>
                    {authState == "login" ? <LoginForm /> : <RegistrationFormProvider />}
                </CardContent>
                <CardFooter>
                    <p className='text-sm text-muted-foreground'>
                        {authState == "login"
                            ? "Don't have an account yet? "
                            : "Already have an account? "}
                        <button
                            className='underline text-foreground'
                            onClick={() =>
                                setAuthState(authState == "login" ? "register" : "login")
                            }
                        >
                            {authState == "login" ? "Register" : "Login"}
                        </button>
                    </p>
                </CardFooter>
            </Card>
        </AuthCardContext.Provider>
    );
}
