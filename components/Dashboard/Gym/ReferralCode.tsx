import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Root as GymResponse } from "@/app/api/gym/route";

import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import { cn } from "@/lib/utils";
import GIcon from "@/public/g_SquareIcon.png";
import Image from "next/image";
import { CSSProperties, MutableRefObject, ReactInstance, useState } from "react";
import { QrCode, ArrowRight, Printer, Clipboard } from "lucide-react";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

const PrintedQrCode = ({
    ref,
    gym,
    style,
}: {
    ref: MutableRefObject<any>;
    gym: Omit<GymResponse, "success" | "error">;
    style?: CSSProperties;
}) => {
    const data = gym.data;

    return (
        <div className='w-full' style={style}>
            <section
                className='max-w-md bg-background px-10 space-y-4 flex items-center flex-col py-24'
                ref={ref}
            >
                <Image className='w-8 h-8 rounded-full mb-3' src={GIcon} alt='' />
                <h1 className='text-3xl font-semibold text-center tracking-tight'>
                    Join {data?.name}!
                </h1>
                <p className='text-center'>
                    Want to have various <b>personalized workouts and exercises</b> and still be able to 
                    chat with your <b>training partners?</b>
                </p>
                <span className='text-center pb-6'>
                    Scan the QR code and join <b>Gymn!</b>
                </span>
                <div className='p-3 mx-auto bg-white  rounded-lg border-border border-[1px]'>
                    <QRCodeCanvas
                        value={`${appUrl}/api/gym/join/${data?.referral_code}`}
                        size={128}
                        bgColor={"#ffffff"}
                        fgColor={"#000000"}
                        level={"L"}
                        includeMargin={false}
                        imageSettings={{
                            src: GIcon.src,
                            x: undefined,
                            y: undefined,
                            height: 24,
                            width: 24,
                            excavate: true,
                        }}
                    />
                </div>
            </section>
        </div>
    );
};

import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export const GymRefferal = ({
    className,
    gym,
    url,
}: {
    className?: string;
    gym: Omit<GymResponse, "success" | "error">;
    url: string;
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn("hover:bg-neutral border-border", className)}
                >
                    Gym Code
                    <QrCode className='w-5 h-5 inline-block ml-1' />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Gym Code</DialogTitle>
                <DialogDescription>
                    Share the gym code with your affiliated students so they can join your gym.
                </DialogDescription>
                <div className='relative w-full h-32 bg-accent/50 border-dashed border-2 border-muted-foreground/30 rounded-lg flex items-center justify-center flex-col '>
                    <Button
                        variant={"ghost"}
                        className='absolute top-0 right-0 mr-2 mt-2 text-muted-foreground h-8'
                        onClick={() => {
                            navigator.clipboard.writeText(gym.data?.referral_code as string);
                            toast({ title: "Code copied!" });
                        }}
                    >
                        Copy
                        <Clipboard className='w-4 h-4 ml-1 inline-block' />
                    </Button>
                    <span className=' font-semibold tracking-tight text-3xl'>
                        {gym.data?.referral_code}
                    </span>
                </div>
                <div className='flex'>
                    <div className='mx-auto space-y-3 flex-col flex items-center justify-center'>
                        <QrCode />
                        <p className='text-sm'>
                            Or print this QR Code <ArrowRight className='w-4 h-4 inline-block' />
                        </p>
                        <Button>
                            Print
                            <Printer className='w-5 h-5 inline-block ml-1' />
                        </Button>
                    </div>
                    <div className='p-3 mx-auto bg-white rounded-lg border-border border-[1px]'>
                        <QRCodeCanvas
                            value={new URL(`/api/gym/join/${gym.data?.referral_code}`, url).href}
                            size={128}
                            bgColor={"#ffffff"}
                            fgColor={"#000000"}
                            level={"Q"}
                            includeMargin={false}
                            imageSettings={{
                                src: GIcon.src,
                                x: undefined,
                                y: undefined,
                                height: 24,
                                width: 24,
                                excavate: true,
                            }}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
