"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tumbleweed } from "@/public/svg/Tumbleweed";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    ArrowRight,
    ChevronRight,
    Compass,
    Dumbbell,
    Info,
    Loader2,
    Crown,
    MapPin,
} from "lucide-react";
import QrCodeExample from "@/public/qrcode_example.png";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { z } from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { type Data as GymType } from "@/app/api/gym/route";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function NoGym() {
    const [collapsibleOpen, setCollapsibleOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [fetchedGym, setFetchedGym] = useState<GymType | null>(null);

    const variants = {
        open: { opacity: 1, height: "auto" },
        closed: { opacity: 0, height: 0 },
    };

    const formSchema = z.object({
        code: z
            .string()
            .min(1, { message: "Gym code is required" })
            .max(7, { message: "Oops! This is not a valid code." })
            .refine((x) => /^[a-zA-Z0-9]{7}$/.test(x), {
                message: "Oops! This is not a valid code.",
            }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
        },
        mode: "all",
    });

    const {
        formState: { isValid },
    } = form;

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        setLoading(true);
        try {
            const gymData = await axios.get(`/api/gym/${values.code}`);
            setFetchedGym(gymData.data.data);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response!.status === 400) {
                    setLoading(false);
                    return toast({
                        variant: "destructive",
                        title: "Oops! This code is not valid.",
                        description: "Try again with a 7-letter/number code.",
                    });
                }
                if (error.response!.status === 404) {
                    setLoading(false);

                    return toast({
                        variant: "destructive",
                        title: "Oops! Gym not found.",
                        description: "Try again with another gym.",
                    });
                }
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (fetchedGym) {
            setConfirmDialogOpen(true);
        }
    }, [fetchedGym]);

    return (
        <>
            <div className='flex items-center justify-center w-full h-[calc(100vh-10rem)]'>
                <Card className='max-w-md'>
                    <CardHeader>
                        <Tumbleweed className='w-16 h-16 mb-4 fill-muted-foreground/50' />
                        <CardTitle>You don't have a gym!</CardTitle>
                        <CardDescription>
                            Are you at one and it doesn't appear here? Enter the{" "}
                            <span className='text-foreground'>gym code</span> below!
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                id='formCode'
                                className='space-y-8'
                            >
                                <FormField
                                    control={form.control}
                                    name='code'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder='a1B2c3' {...field} />
                                            </FormControl>
                                            <Collapsible
                                                open={collapsibleOpen}
                                                onOpenChange={setCollapsibleOpen}
                                            >
                                                <CollapsibleTrigger
                                                    className={`text-xs text-muted-foreground ${
                                                        collapsibleOpen && "mb-6"
                                                    } transition-all`}
                                                >
                                                    <ChevronRight
                                                        className={`w-4 h-4 inline-block text-foreground ${
                                                            collapsibleOpen && "rotate-90 "
                                                        } `}
                                                    />
                                                    How do I get the code?
                                                    <Info className='w-3 h-3 inline-block ml-1' />
                                                </CollapsibleTrigger>
                                                <AnimatePresence>
                                                    <motion.div
                                                        animate={
                                                            collapsibleOpen ? "open" : "closed"
                                                        }
                                                        variants={variants}
                                                    >
                                                        <CollapsibleContent className='lg:p-4'>
                                                            <h4 className='text-lg font-semibold'>
                                                                What is the gym code?
                                                            </h4>
                                                            <p className='text-sm text-muted-foreground'>
                                                                The gym code is a unique code used to{" "}
                                                                <b>link students</b> to it.
                                                            </p>
                                                            <br></br>
                                                            <p className='text-sm text-muted-foreground'>
                                                                Ask for the code from the person in
                                                                charge of your gym. It can be a QR
                                                                code or a set of letters.
                                                            </p>
                                                            <div className='flex mt-4 gap-2 text-muted-foreground items-center'>
                                                                <Image
                                                                    src={QrCodeExample}
                                                                    alt=''
                                                                    width={128}
                                                                    height={128}
                                                                    className='p-2 bg-white rounded-lg shadow-md'
                                                                />
                                                                or
                                                                <div className='relative w-full h-32 bg-accent/50 border-dashed border-2 border-muted-foreground/30 rounded-lg flex items-center justify-center flex-col '>
                                                                    <span className=' font-semibold tracking-tight text-xl lg:text-3xl'>
                                                                        a1B2c3
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </CollapsibleContent>
                                                    </motion.div>
                                                </AnimatePresence>
                                            </Collapsible>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className='items-center justify-end gap-2'>
                        <Button variant={"outline"}>
                            Explore
                            <Compass className='w-4 h-4 inline-block ml-1' />
                        </Button>

                        <Button disabled={!isValid || loading} type='submit' form='formCode'>
                            {loading && (
                                <Loader2 className='w-4 h-4 inline-block mr-1 animate-spin' />
                            )}
                            Continue{" "}
                            {!loading && <ArrowRight className='w-4 h-4 inline-block ml-1' />}
                        </Button>
                    </CardFooter>
                </Card>
                <JoinFetchedGym
                    confirmDialogOpen={confirmDialogOpen}
                    setConfirmDialogOpen={setConfirmDialogOpen}
                    fetchedGym={fetchedGym}
                />
            </div>
        </>
    );
}

const JoinFetchedGym = ({
    confirmDialogOpen,
    setConfirmDialogOpen,
    fetchedGym,
}: {
    confirmDialogOpen: boolean;
    setConfirmDialogOpen: Dispatch<SetStateAction<boolean>>;
    fetchedGym: GymType | null;
}) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const queryClient = useQueryClient();

    async function joinGym() {
        setLoading(true);
        try {
            const join = await axios.post(`/api/gym/join/${fetchedGym?.referral_code}`);
            if (join.data.success == false) {
                return toast({
                    title: "An unexpected error occurred.",
                    description: "Please try again in a moment.",
                    variant: "destructive",
                });
            }
            setLoading(false);
            setConfirmDialogOpen(false);
            toast({
                variant: "success",
                title: `You are now a member of ${fetchedGym?.name}!`,
                description: (
                    <span>
                        Enjoy your new possibilities in <b>&quot;Your Gym&quot;</b>
                    </span>
                ),
            });
            router.push("/dashboard/gym");
            queryClient.refetchQueries(["gym"]);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response!.status === 404) {
                    setLoading(false);

                    return toast({
                        variant: "destructive",
                        title: "Oops! Gym not found.",
                        description: "Try again with another gym.",
                    });
                }
                setLoading(false);
                return toast({
                    variant: "destructive",
                    title: "Unknown error",
                    description: "Please try again in a moment.",
                });
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
            <DialogContent className='max-w-md'>
                <DialogHeader>
                    <DialogTitle>Gym found!</DialogTitle>
                    <DialogDescription>
                        Confirm the information below and start at <b>{fetchedGym?.name}</b>!
                    </DialogDescription>
                </DialogHeader>
                <div className='w-full relative bg-accent rounded-md h-24'></div>
                <div className='flex items-center gap-6'>
                    <Avatar className=' w-20 h-20 rounded-md'>
                        <AvatarFallback className='rounded-md text-2xl '>
                            {fetchedGym?.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className=''>
                        <h1 className='text-xl tracking-tight font-semibold '>
                            {fetchedGym?.name}
                        </h1>
                        <span className='text-muted-foreground text-sm flex gap-1 items-center '>
                            <MapPin className='inline-block scale-75' />
                            <span className='text-sm text-muted-foreground'>
                                {fetchedGym?.address}
                            </span>
                        </span>
                        <div className='flex gap-2 items-center text-xs'>
                            <Avatar className='w-6 h-6'>
                                <AvatarImage
                                    src={`/api/users/${fetchedGym?.owner?.username}/avatar?cache=true`}
                                />
                                <AvatarFallback className='text-xs'>
                                    {fetchedGym?.owner?.username?.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className='hidden lg:block'>Owner:</span>
                            <b>{fetchedGym?.owner?.display_name}</b>
                            <Crown className='w-4 h-4 text-amber-400 inline-block' />
                        </div>
                    </div>
                </div>
                <DialogFooter className='mt-4'>
                    <Button
                        disabled={loading}
                        variant={"highlight"}
                        className='w-full'
                        onClick={() => joinGym()}
                    >
                        {loading ? (
                            <Loader2 className='w-4 h-4 inline-block mr-1 animate-spin' />
                        ) : (
                            <Dumbbell className='w-4 h-4 inline-block mr-1' />
                        )}
                        Get Started!
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
