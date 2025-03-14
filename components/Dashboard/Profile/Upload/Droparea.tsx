import { useDropzone } from "react-dropzone";
import { PlusCircle, UploadCloud } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Dispatch, SetStateAction } from "react";
import { type UploadStages } from "./UploadUI";

interface DropAreaProps {
    setFiles: Dispatch<SetStateAction<any>>;
    setUploadStage: Dispatch<SetStateAction<UploadStages>>;
}

export function DropArea({ setFiles, setUploadStage }: DropAreaProps) {
    const { toast } = useToast();

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "image/*": [".png", ".jpg", ".jpeg"],
        },
        maxSize: 10485760,
        maxFiles: 1,
        onDropAccepted: (acceptedFiles) => acceptedFile(acceptedFiles),
        onDropRejected: () => rejectedFile(),
    });

    function acceptedFile(acceptedFiles: any) {
        setFiles(
            acceptedFiles.map((file: any) => ({
                url: URL.createObjectURL(file),
                file: file,
            }))
        );
        setUploadStage("reviewpic");
    }

    function rejectedFile() {
        toast({
            title: "File rejected",
            description: "You can only upload png or jpg images up to 10MB.",
            variant: "destructive",
        });
    }

    return (
        <div
            className='flex items-center justify-center w-full'
            {...getRootProps({ onClick: (event) => event.stopPropagation() })}
        >
            <label
                htmlFor='dropzone-file'
                className='flex flex-col items-center justify-center w-full h-64 
                border-2 border-border border-dashed 
                rounded-lg cursor-pointer bg-accent/50 dark:hover:bg-bray-800 hover:bg-accent'
            >
                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                    {!isDragActive ? (
                        <>
                            <UploadCloud className='scale-125 mb-2' />
                            <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                                <span className='font-semibold'>Click to upload</span> or drag and drop
                            </p>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                PNG or JPG (Maximum size: 10mb)
                            </p>
                        </>
                    ) : (
                        <>
                            <PlusCircle className='scale-125 mb-2' />
                            <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                                <span className='font-semibold'>Drop the file here.</span>
                            </p>
                        </>
                    )}
                </div>
                <input id='dropzone-file' type='file' className='hidden' {...getInputProps()} />
            </label>
        </div>
    );
}
