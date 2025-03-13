"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import GymnLogo from "@/components/ui/Icons/GymnLogo";

export default function DashboardNotFound() {
    const router = useRouter();
    return (
        <div className='w-full h-[calc(100vh-10rem)] lg:h-[calc(100vh-5rem)] flex items-center justify-center flex-col'>
            <Image src={"/g_Icon.png"} alt='' width={60} height={60} />
            <h1 className='text-3xl lg:text-5xl font-semibold tracking-tighter mt-5'>
                Page not found
            </h1>
            <p className='text-muted-foreground text-sm mt-3'>
                We couldn't find the page you were looking for
            </p>
            <Button className='mt-4' onClick={() => router.back()}>
                <ArrowLeft className='scale-75' /> Go back
            </Button>
            <Popover>
                <PopoverTrigger>
                    <Button variant={"link"} className='mt-3'>
                        About
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='text-sm flex items-center justify-center flex-col'>
                    <GymnLogo className='w-16 mb-2 inline-block fill-card-foreground' />
                    <p className='text-center'>
                        Gymn is a webapp in <b>development.</b>
                        <br></br> Some features may not yet be available in production, which will lead to a 404 page.
                    </p>
                </PopoverContent>
            </Popover>
        </div>
    );
}
