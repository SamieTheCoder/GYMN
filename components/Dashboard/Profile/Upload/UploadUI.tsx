"use client";

import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, Dispatch, SetStateAction } from "react";
import { Loader2 } from "lucide-react";
import { UserProfile } from "@/types/UserProfile";
import { uploadPicture } from "@/lib/supabase/uploadPicture";
import { DropArea } from "./Droparea";
import { ReviewPic } from "./ReviewPic";

export type UploadStages = "selectpic" | "reviewpic";

export default function UploadUI({
    user,
    setDialogOpen,
    refetchUser,
    uploadingTo,
}: {
    user: UserProfile | null;
    setDialogOpen: Dispatch<SetStateAction<boolean>>;
    refetchUser: Function;
    uploadingTo: "avatars" | "banners";
}) {
    const [uploadStage, setUploadStage] = useState<UploadStages>("selectpic");
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);

    const renderDialogTitle = () => {
        return uploadStage == "selectpic"
            ? `Upload a ${uploadingTo == "avatars" ? "profile photo" : "banner"}`
            : "Do you like the result?";
    };
    const renderDialogDescription = () => {
        return uploadStage == "selectpic"
            ? `Change ${
                  uploadingTo == "avatars" ? "your profile photo" : "your banner"
              } here. Click save changes when you're ready.`
            : "If the profile preview meets your expectations, click save.";
    };

    const renderDialogFooter = () => {
        return (
            uploadStage == "reviewpic" && (
                <>
                    <Button variant={"ghost"} onClick={() => handleBackstage()}>
                        Choose another photo
                    </Button>
                    <Button
                        type='submit'
                        onClick={() =>
                            uploadPicture({
                                files: files,
                                username: user?.username,
                                userId: user?.id,
                                setFiles: setFiles,
                                setDialogOpen: setDialogOpen,
                                setLoading: setLoading,
                                refetchUser: refetchUser,
                                uploadingTo: uploadingTo,
                            })
                        }
                    >
                        Save changes
                    </Button>
                </>
            )
        );
    };

    function handleBackstage() {
        setFiles([]);
        setUploadStage("selectpic");
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>{renderDialogTitle()}</DialogTitle>
                <DialogDescription>{renderDialogDescription()}</DialogDescription>
            </DialogHeader>
            {!loading ? (
                uploadStage == "selectpic" ? (
                    <DropArea setFiles={setFiles} setUploadStage={setUploadStage} />
                ) : (
                    <ReviewPic files={files} user={user} uploadingTo={uploadingTo} />
                )
            ) : (
                //loader ui
                <div className='w-full h-64 flex items-center justify-center border-border border-[1px] rounded-lg bg-gradient-to-b from-transparent to-border/20 flex-col gap-2'>
                    <Loader2 className='animate-spin w-10 h-10 text-muted-foreground' />
                    <p className='text-sm text-muted-foreground'>Uploading</p>
                </div>
            )}
            <DialogFooter>{renderDialogFooter()}</DialogFooter>
        </>
    );
}
