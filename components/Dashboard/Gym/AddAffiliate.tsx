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
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
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
import { useQueryClient } from "@tanstack/react-query";

const addAffiliateFormSchema = z.object({
    display_name: z
        .string()
        .min(2, { message: "Name cannot be too short" })
        .max(25, { message: "Name cannot be too long" })
        .refine((x) => /^[a-zA-Z0-9_ äëiöüÄËÏÖÜáéíóúÁÉÍÓÚãõñÃÕÑâêîôûÂÊÎÔÛ]*$/.test(x), {
            message: "Name cannot contain special characters.",
        }),
    email: z.string().email({ message: "Enter a valid email" }),
});

export default function AddAffiliate() {
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const form = useForm<z.infer<typeof addAffiliateFormSchema>>({
        resolver: zodResolver(addAffiliateFormSchema),
        defaultValues: {
            display_name: "",
            email: "",
        },
        mode: "all",
    });

    const { formState } = form;

    const session = useSession();
    const queryClient = useQueryClient();

    async function onSubmit(values: z.infer<typeof addAffiliateFormSchema>) {
        setLoading(true);
        const { data } = await supabase.rpc("check_email_exists", {
            email_param: values.email.toLowerCase(),
        });

        if (data === false) {
            const gym = await axios.get(`/api/gym`);
            const metadata = {
                gym_id: gym.data.data.id,
                gym_name: gym.data.data.name,
                inviter: session?.user.user_metadata.username,
                display_name: values.display_name,
                email: values.email,
                profile: "Member",
            };

            const invite = await axios.post(`/api/affiliates/invite`, metadata);

            if (invite.status !== 200) {
                toast({
                    title: "Error inviting user",
                    description: "Something unexpected happened.",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "User registered",
                    description: `An invitation has been sent to ${values.email}`,
                    variant: "success",
                });
                setOpen(false);
                setLoading(false);
                queryClient.refetchQueries(["affiliates"]);
            }
        } else {
            toast({
                title: "This user already exists.",
                description: "Try using another email, or go to the login page.",
                variant: "destructive",
            });
            setLoading(false);
        }
        setLoading(false);
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='whitespace-nowrap w-full md:w-auto'>
                    <Plus className='w-4 h-4 inline-block mr-1' /> Register student
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Register student</DialogTitle>
                    <DialogDescription>
                        Fill in the information below to <b>register</b> a student in Gymn and{" "}
                        <b>affiliate</b> them with your gym.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        id='addaffiliate'
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
                                        <Input placeholder='email@example.com' {...field} />
                                    </FormControl>
                                    <FormDescription>Email of the affiliated student</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='display_name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='John Doe' {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the name of the student to be registered.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>

                <DialogFooter className='gap-4 items-center'>
                    {loading && (
                        <span className='text-xs text-muted-foreground/50 text-right max-w-[15rem]'>
                            Psst... Adding a user might take a little while, but nothing too serious.
                        </span>
                    )}
                    <Button
                        disabled={loading || !formState.isValid}
                        type='submit'
                        form='addaffiliate'
                    >
                        {loading && <Loader2 className='w-4 h-4 animate-spin inline-block mr-1' />}
                        Register
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
