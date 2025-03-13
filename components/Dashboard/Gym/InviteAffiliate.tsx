import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Merge } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useSession } from "@/lib/supabase/useSession";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";

export default function InviteAffiliate() {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='whitespace-nowrap w-full md:w-auto' variant={"outline"}>
                    <Merge className='w-4 h-4 inline-block mr-1' /> Invite student
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-md'>
                <DialogHeader>
                    <DialogTitle>Invite student</DialogTitle>
                    <DialogDescription>
                        Invite a student who <b>already has</b> a Gymn account.
                    </DialogDescription>
                </DialogHeader>
                <Tabs className='w-full' defaultValue='email'>
                    <TabsList className='grid w-full grid-cols-2'>
                        <TabsTrigger value='email' className='w-full'>
                            By email
                        </TabsTrigger>
                        <TabsTrigger value='username' className='w-full'>
                            By username
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value='email'>
                        <InviteAffiliateByEmail setOpen={setOpen} />
                    </TabsContent>
                    <TabsContent value='username'>
                        <InviteAffiliateByUsername setOpen={setOpen} />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

const InviteAffiliateByEmail = ({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) => {
    const [loading, setLoading] = useState<boolean>(false);

    const inviteByEmailFormSchema = z.object({
        email: z.string().email({ message: "Enter a valid email" }),
    });
    const form = useForm<z.infer<typeof inviteByEmailFormSchema>>({
        resolver: zodResolver(inviteByEmailFormSchema),
        defaultValues: {
            email: "",
        },
        mode: "all",
    });

    const { formState } = form;

    const queryClient = useQueryClient();

    async function onSubmit(values: z.infer<typeof inviteByEmailFormSchema>) {
        setLoading(true);
        try {
            const invite = await axios.post(`/api/affiliates/invite/existing`, {
                email: values.email,
            });

            if (invite.data.success == false) {
                return toast({
                    title: "An unexpected error occurred.",
                    description: "Please try again in a moment.",
                    variant: "destructive",
                });
            }
            setLoading(false);
            setOpen(false);
            toast({
                variant: "success",
                title: `User ${values.email} has been invited.`,
                description: (
                    <span>
                        They can accept the invitation through <b>notifications</b>.
                    </span>
                ),
            });
            queryClient.refetchQueries(["affiliates"]);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.data) {
                    setLoading(false);

                    return toast({
                        variant: "destructive",
                        title: error.response.data.error.title,
                        description: error.response.data.error.description,
                    });
                }
            }
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <Form {...form}>
                <form
                    id='invitebyemail'
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4'
                >
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder='example@domain.com' {...field} />
                                </FormControl>
                                <FormDescription>
                                    The user with this email will be invited to your gym.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button
                            type='submit'
                            className='w-full'
                            disabled={loading || !formState.isValid}
                        >
                            Invite
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </>
    );
};

const InviteAffiliateByUsername = ({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const inviteByUsernameFormSchema = z.object({
        username: z
            .string()
            .min(3, { message: "Username cannot be too short" })
            .max(30, { message: "Username cannot be too long" })
            .refine((x) => /^[a-zA-Z0-9]*$/.test(x), {
                message: "Username cannot contain special characters.",
            }),
    });
    const form = useForm<z.infer<typeof inviteByUsernameFormSchema>>({
        resolver: zodResolver(inviteByUsernameFormSchema),
        defaultValues: {
            username: "",
        },
        mode: "all",
    });
    const { formState } = form;

    const queryClient = useQueryClient();

    async function onSubmit(values: z.infer<typeof inviteByUsernameFormSchema>) {
        setLoading(true);
        try {
            const invite = await axios.post(`/api/affiliates/invite/existing`, {
                username: values.username,
            });

            if (invite.data.success == false) {
                return toast({
                    title: "An unexpected error occurred.",
                    description: "Please try again in a moment.",
                    variant: "destructive",
                });
            }
            setLoading(false);
            setOpen(false);
            toast({
                variant: "success",
                title: `User ${values.username} has been invited.`,
                description: (
                    <span>
                        They can accept the invitation through <b>notifications</b>.
                    </span>
                ),
            });
            queryClient.refetchQueries(["affiliates"]);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.data) {
                    setLoading(false);

                    return toast({
                        variant: "destructive",
                        title: error.response.data.error.title,
                        description: error.response.data.error.description,
                    });
                }
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Form {...form}>
                <form
                    id='invitebyusername'
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
                                    <Input placeholder='risixdzn' {...field} />
                                </FormControl>
                                <FormDescription>
                                    This user will be invited to your gym.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button
                            type='submit'
                            className='w-full'
                            disabled={loading || !formState.isValid}
                        >
                            Invite
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </>
    );
};
