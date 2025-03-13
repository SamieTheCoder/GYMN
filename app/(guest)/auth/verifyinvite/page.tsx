"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { z } from "zod";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/ui/input";

const verifyInviteSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username cannot be too short" })
        .max(30, { message: "Username cannot be too long" })
        .refine((x) => /^[a-zA-Z0-9]*$/.test(x), {
            message: "Username cannot contain special characters.",
        }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .max(40, { message: "Password must be shorter." })
        .refine((x) => /^(?=.*[a-z])/.test(x), "Password must contain a lowercase letter.")
        .refine((x) => /^(?=.*[A-Z])/.test(x), "Password must contain an uppercase letter.")
        .refine((x) => /^(?=.*[0-9])/.test(x), "Password must contain a number."),
});

export default function VerifyInvite() {
    const [loading, setLoading] = useState<boolean>(false);
    const access_token = useRef<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const form = useForm<z.infer<typeof verifyInviteSchema>>({
        resolver: zodResolver(verifyInviteSchema),
        defaultValues: {
            username: "",
            password: "",
        },
        mode: "all",
    });

    const { formState } = form;

    useEffect(() => {
        const fragment = Object.fromEntries(new URLSearchParams(window.location.hash.slice(1)));
        const accessToken = fragment.access_token;
        access_token.current = accessToken;
        
        if (!accessToken) {
            router.push("/auth");
            toast({
                title: "Access Denied",
                description: "You cannot access this area. Please try again.",
                variant: "destructive",
            });
        }
    }, [router]);

    const onSubmit = async (values: z.infer<typeof verifyInviteSchema>) => {
        setLoading(true);
        const body = {
            ...values,
            access_token: access_token.current,
            email: searchParams.get("email"),
        };

        try {
            const update = await axios.post(`/api/affiliates/verify`, body);
            if (update.status !== 200) {
                toast({
                    title: "Update Error",
                    description: "Something unexpected happened during the update.",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Profile Updated",
                    description: "You will be redirected shortly!",
                    variant: "success",
                });
                router.push("/dashboard/profile");
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast({
                title: "Submission Failed",
                description: "Please check your connection and try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className='flex min-h-screen flex-col justify-center items-center bg-loginBGWhite dark:bg-loginBGDark bg-cover bg-center'>
            <Card className='max-w-md'>
                <CardHeader>
                    <CardTitle>You're In!</CardTitle>
                    <CardDescription>
                        Complete your registration to start using the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            id='verify-info'
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-4'
                        >
                            <FormField
                                control={form.control}
                                name='username'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="yourusername" 
                                                {...field} 
                                                autoComplete="username"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Choose your public display name
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                className='mt-2'
                                                placeholder='••••••••'
                                                {...field}
                                                autoComplete="new-password"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Create a strong password
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <Button
                        disabled={!formState.isValid || loading}
                        type='submit'
                        form='verify-info'
                        className='w-full'
                    >
                        {loading ? (
                            <Loader2 className='w-4 h-4 animate-spin mr-2' />
                        ) : (
                            <ArrowRight className='w-4 h-4 mr-2' />
                        )}
                        Complete Registration
                    </Button>
                </CardFooter>
            </Card>
        </main>
    );
}
