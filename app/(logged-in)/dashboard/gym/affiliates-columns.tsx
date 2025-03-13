"use client";

import { ColumnDef } from "@tanstack/react-table";
import { type Root as Affiliation } from "@/app/api/affiliates/route";
import { MoreHorizontal, Unlink, User, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const columns: ColumnDef<Affiliation>[] = [
    {
        accessorKey: "affiliate_info.display_name",
        header: "Name",
    },
    {
        accessorKey: "affiliate_info.username",
        header: "Username",
    },
    {
        accessorKey: "affiliate_info.email",
        header: "Email",
    },
    {
        accessorKey: "affiliate_info.verified",
        header: "Verification Status",
        cell: ({ row }) => {
            type returns =
                | "default"
                | "secondary"
                | "destructive"
                | "outline"
                | "Beginner"
                | "Intermediate"
                | "Advanced";

            const lookup: { [key: string]: returns } = {
                true: "Beginner",
                false: "Intermediate",
            };
            const colorLookup: { [key: string]: string } = {
                Beginner: "#22c55e",
                Intermediate: "#f59e0b",
            };

            const root = row.original;
            // @ts-ignore: Unreachable code error
            const verified = root.verified;

            return (
                <Badge variant={lookup[verified as string]}>
                    <div
                        className='w-2 h-2 rounded-full mr-1'
                        style={{ backgroundColor: colorLookup[lookup[verified as string]] }}
                    ></div>
                    {verified ? "Verified" : "Pending"}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const root = row.original;
            // @ts-ignore: Unreachable code error
            const affiliate_info = root.affiliate_info;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                            <span className='sr-only'>Open menu</span>
                            <MoreHorizontal className='h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link
                            className=''
                            href={`/dashboard/profile/${affiliate_info.username}`}
                            target='_blank'
                        >
                            <DropdownMenuItem className='hover:cursor-pointer flex items-center gap-1 '>
                                <User className='scale-75' />
                                View user
                            </DropdownMenuItem>
                        </Link>
                        <RemoveAffiliate affiliate_info={affiliate_info} />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const RemoveAffiliate = ({
    affiliate_info,
}: {
    affiliate_info: { id: string; display_name: string };
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    async function handleSubmit() {
        setLoading(true);
        try {
            const deleteAffiliation = await axios.post("/api/affiliates/remove", {
                id: affiliate_info.id,
            });
            if (deleteAffiliation.data.success == false) {
                toast({
                    title: "An unexpected error occurred.",
                    description: "Please try again in a moment.",
                    variant: "destructive",
                });
                setLoading(false);
            }
            toast({
                title: `You removed ${affiliate_info.display_name}.`,
                description: "If needed, invite them again.",
            });
            setLoading(false);
            setOpen(false);
            queryClient.refetchQueries(["affiliates"]);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem
                    className='flex items-center gap-1 text-destructive'
                    onSelect={(e) => e.preventDefault()}
                >
                    <Unlink className='scale-75' />
                    Remove affiliation
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>
                    <Unlink className='w-5 h-5 inline-block mr-2' />
                    Remove affiliated student
                </DialogTitle>
                <DialogDescription>
                    The student{" "}
                    <span className='font-semibold text-foreground'>
                        {affiliate_info.display_name}
                    </span>{" "}
                    will lose access to workouts and exercises provided by the gym.
                </DialogDescription>
                <DialogFooter>
                    <Button onClick={() => setOpen(false)} variant={"outline"}>
                        Cancel
                    </Button>
                    <Button type='submit' onClick={() => handleSubmit()} disabled={loading}>
                        {loading && <Loader2 className='w-4 h-4 animate-spin inline-block mr-1' />}
                        Remove {affiliate_info.display_name}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
