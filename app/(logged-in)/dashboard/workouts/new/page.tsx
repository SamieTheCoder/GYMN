"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/DrawerOrVaul";
import { useGetScreenWidth } from "@/lib/hooks/useGetScreenWidth";
import { Dumbbell, Grip, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import ExerciseDisplay from "@/components/Dashboard/Workouts/Exercise";
import ExerciseSelector from "@/components/Dashboard/Workouts/ExerciseSelector";
import { Workout } from "@/types/Workout";
import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, Reorder } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { muscles } from "@/lib/filters";
import axios from "axios";
import { useRouter } from "next/navigation";

const ExerciseNumbersData = ({
    exerciseNumbersData,
    className,
}: {
    exerciseNumbersData: {
        totalExercises: number;
        totalSets: number;
        totalReps: number;
        totalVolume: number;
    };
    className?: string;
}) => {
    return (
        <div id='exerciseNumbersData' className={className}>
            <h3 className='text-sm font-semibold mb-1'>Workout Totals</h3>
            <span className='flex gap-4'>
                <div>
                    <h4 className='text-xs text-muted-foreground'>Exercises</h4>
                    <p className='text-sm'>{exerciseNumbersData.totalExercises}</p>
                </div>
                <div>
                    <h4 className='text-xs text-muted-foreground'>Sets</h4>
                    <p className='text-sm'>{exerciseNumbersData.totalSets}</p>
                </div>
                <div>
                    <h4 className='text-xs text-muted-foreground'>Reps</h4>
                    <p className='text-sm'>{exerciseNumbersData.totalReps}</p>
                </div>
                <div>
                    <h4 className='text-xs text-muted-foreground'>Volume</h4>
                    <p className='text-sm'>
                        {exerciseNumbersData.totalVolume}
                        <span className='text-xs ml-1 text-muted-foreground'>kg</span>
                    </p>
                </div>
            </span>
        </div>
    );
};

export default function NewWorkout() {
    const form = useForm<z.infer<typeof Workout>>({
        resolver: zodResolver(Workout),
        defaultValues: {
            title: "",
            muscle_group: [],
            exercises: [
                // {
                //     name: "test",
                //     muscles: ["test"],
                //     sets: [{ variant: "Warm-up", load: 0, reps: 0 }],
                // },
            ],
            description: "",
        },
        mode: "all",
    });

    const { toast } = useToast();
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    async function onSubmit(event: FormEvent, values: z.infer<typeof Workout>) {
        event.preventDefault();
        setLoading(true);
        //Validate if the workout has exercises
        if (!values.exercises || values.exercises.length === 0) {
            toast({
                variant: "destructive",
                title: "The workout must have at least one exercise",
                description: "Add an exercise and try again.",
            });
            setLoading(false);
            return;
        }

        // Validate each exercise
        for (const exercise of values.exercises) {
            // Validate if there is at least one set in each exercise
            if (!exercise.sets || exercise.sets.length === 0) {
                toast({
                    variant: "destructive",
                    title: "Every exercise must have at least one set",
                    description: "Add a set and try again.",
                });
                setLoading(false);
                return;
            }
        }

        // Validate the title
        if (!values.title || values.title.trim() === "") {
            toast({
                variant: "destructive",
                title: "The workout must have a title",
                description: "Give the workout a name and try again.",
            });
            setLoading(false);
            return;
        }

        // If all validations pass, proceed with the submission

        var muscleGroup: typeof muscles = [];
        for (const exercise of values.exercises) {
            if (exercise.muscles) {
                for (const muscle of exercise.muscles) {
                    if (!muscleGroup.includes(muscle)) {
                        muscleGroup.push(muscle);
                    }
                }
            }
        }

        const updatedExercises = values.exercises.map((exercise) => {
            const updatedSets = exercise.sets?.map((set) => ({
                ...set,
                reps:
                    (set.reps as unknown as string) !== ""
                        ? parseInt(set.reps as unknown as string, 10)
                        : 0,
                load:
                    (set.load as unknown as string) !== ""
                        ? parseFloat(set.load as unknown as string)
                        : 0,
            }));
            return {
                ...exercise,
                sets: updatedSets,
            };
        });

        console.log(updatedExercises);

        const finalWorkout = {
            ...values,
            muscle_group: muscleGroup,
            exercises: updatedExercises,
        };

        const { data } = await axios.post("/api/workouts", finalWorkout);
        if (data.success === true) {
            console.log(data);
            toast({
                variant: "success",
                title: `Workout ${values.title} created successfully!`,
                description: `You can view it on your workouts page.`,
            });
            router.push("/dashboard/workouts");
            setLoading(false);
        } else {
            console.log(data);
            toast({
                variant: "destructive",
                title: "An error occurred while creating the workout",
                description: "Please wait and try again",
            });
            setLoading(false);
        }
        setLoading(false);
    }

    const { watch, setValue } = form;
    const formValues = watch();
    const { screenWidth } = useGetScreenWidth();
    const [exerciseSelectorOpen, setExerciseSelectorOpen] = useState(false);
    const [exerciseReordererOpen, setExerciseReordererOpen] = useState(false);

    const exercises = watch("exercises");

    const exerciseNumbersData = exercises.reduce(
        (acc, exercise) => {
            // Iterate through sets for each exercise
            if (exercise.sets && exercise.sets.length > 0) {
                exercise.sets.forEach((set) => {
                    // Increment totalSets by 1
                    acc.totalSets += 1;
                    // Increment totalReps by the reps in this set
                    acc.totalReps +=
                        !isNaN(set.reps) && (set.reps as unknown as string) !== ""
                            ? parseInt(set.reps as unknown as string, 10)
                            : 0;
                    // Increment totalVolume by the load in this set
                    acc.totalVolume += !isNaN(set.load)
                        ? parseInt((set.load * set.reps) as unknown as string, 10)
                        : 0;
                });
            }
            // Increment totalExercises for each exercise in the workout
            acc.totalExercises += 1;

            return acc;
        },
        {
            totalExercises: 0,
            totalSets: 0,
            totalReps: 0,
            totalVolume: 0,
        }
    );

    useEffect(() => {
        console.log("exercises=> ", exercises);
    }, [exercises]);

    return (
        <>
            <Form {...form}>
                {/* Workout editing form */}
                <form className='mt-20 lg:mt-0 w-full grid lg:grid-cols-[20rem_minmax(0,_1fr)] xl:grid-cols-[25rem_minmax(0,_1fr)] gap-2'>
                    <div className='lg:hidden w-full h-20 z-20 fixed -translate-x-5 px-5 -translate-y-[5.75rem] flex items-center justify-between bg-background'>
                        {/* Numeric workout data (sets, volume, reps...) */}
                        <ExerciseNumbersData exerciseNumbersData={exerciseNumbersData} />
                        {/* Save button */}
                        <Button type='submit' onClick={(event) => onSubmit(event, formValues)}>
                            Save
                        </Button>
                    </div>
                    {/* Editing text information (title, desc...) */}
                    <div id='infoediting' className='border-border lg:border-r-[1px] lg:pr-8'>
                        <h2 className='text-lg lg:text-xl font-semibold'>Create workout</h2>
                        {/* Edit title */}
                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem className='mt-2'>
                                    <span className='flex gap-2 items-center'>
                                        <Input
                                            {...field}
                                            className='text-2xl lg:text-3xl py-0 focus:none focus-visible:ring-0 rounded-none font-semibold border-none px-0 outline-none bg-none'
                                            placeholder={"Workout title"}
                                        ></Input>
                                    </span>
                                    <hr></hr>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Edit description */}
                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem className='mt-4'>
                                    <FormLabel>Description</FormLabel>
                                    <Textarea placeholder='Workout description...' {...field} />
                                    <FormDescription>
                                        Brief or detailed description about this workout.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            className='w-full mt-4 hidden lg:block'
                            onClick={(event) => onSubmit(event, formValues)}
                            type='submit'
                        >
                            Save Workout
                        </Button>
                        <ExerciseNumbersData
                            exerciseNumbersData={exerciseNumbersData}
                            className='lg:block hidden mt-4'
                        />
                    </div>
                    {/* Display selected exercises */}
                    <div className='w-full overflow-x-hidden lg:pl-8 flex items-center flex-col relative'>
                        <FormField
                            control={form.control}
                            name='exercises'
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    {/* If there are exercises */}
                                    {exercises?.length ? (
                                        <>
                                            {/* List title */}
                                            <span
                                                id='exerciselisttitle'
                                                className='lg:hidden w-full mt-4'
                                            >
                                                <hr></hr>
                                                <h2 className='my-4 text-xl text-left font-semibold'>
                                                    Exercises
                                                </h2>
                                            </span>
                                            {/* Exercise display container */}
                                            <div
                                                id='exercisescontainer'
                                                className='h-auto lg:max-h-[calc(100vh-7rem)] w-full overflow-y-auto overflow-x-hidden
                                                 flex flex-col pb-24 lg:pb-0
                                                 scrollbar-thin pr-2 scrollbar-thumb-accent scrollbar-track-background scrollbar-rounded-full '
                                            >
                                                <AnimatePresence>
                                                    {exercises.map((exercise, index) => (
                                                        <ExerciseDisplay
                                                            setExerciseReordererOpen={
                                                                setExerciseReordererOpen
                                                            }
                                                            setterFn={setValue}
                                                            watch={watch}
                                                            index={index}
                                                            exercise={exercise}
                                                            key={exercise.id}
                                                        />
                                                    ))}
                                                </AnimatePresence>
                                                <Drawer
                                                    screenWidth={screenWidth}
                                                    open={exerciseSelectorOpen}
                                                    onOpenChange={setExerciseSelectorOpen}
                                                >
                                                    <DrawerTrigger
                                                        screenWidth={screenWidth}
                                                        asChild
                                                    >
                                                        <Button
                                                            type='button'
                                                            className='flex items-center gap-2 w-full'
                                                        >
                                                            <Plus className='scale-75' />
                                                            Add exercise
                                                        </Button>
                                                    </DrawerTrigger>
                                                    <DrawerContent
                                                        asChild
                                                        desktopClassname='sm:w-[calc(100%-20rem)] max-w-full'
                                                        screenWidth={screenWidth}
                                                        className=''
                                                    >
                                                        <ExerciseSelector
                                                            setExerciseSelectorOpen={
                                                                setExerciseSelectorOpen
                                                            }
                                                            watch={watch}
                                                            screenWidth={screenWidth}
                                                            setterFn={setValue}
                                                        />
                                                    </DrawerContent>
                                                </Drawer>
                                            </div>
                                            {/* Exercise reorderer */}
                                            <Dialog
                                                open={exerciseReordererOpen}
                                                onOpenChange={setExerciseReordererOpen}
                                            >
                                                <DialogContent>
                                                    <DialogTitle>Reorder exercises</DialogTitle>
                                                    <DialogDescription>
                                                        Drag exercises to change their order
                                                    </DialogDescription>
                                                    <Reorder.Group
                                                        className='w-full flex flex-col gap-2 max-h-96 overflow-y-auto overflow-x-hidden scrollbar-thin pr-2 scrollbar-thumb-accent scrollbar-track-background'
                                                        axis='y'
                                                        values={exercises}
                                                        layoutScroll
                                                        onReorder={(exercise) =>
                                                            setValue("exercises", exercise)
                                                        }
                                                    >
                                                        {exercises.map((exercise, index) => (
                                                            <Reorder.Item
                                                                className='w-full py-2 bg-card px-4 rounded-md text-sm flex justify-between items-center'
                                                                key={exercise.id}
                                                                value={exercise}
                                                            >
                                                                {exercise.name}
                                                                <Grip className='text-muted-foreground' />
                                                            </Reorder.Item>
                                                        ))}
                                                    </Reorder.Group>
                                                </DialogContent>
                                            </Dialog>
                                        </>
                                    ) : (
                                        // /* If there are no exercises, show the selector */
                                        <div
                                            className='text-center mt-6 lg:mt-0 
                                        w-full lg:h-[calc(100vh-7rem)] 
                                        flex items-center justify-center flex-col gap-4 
                                        text-sm text-muted-foreground'
                                        >
                                            <Dumbbell className='text-g_purple' />
                                            <span className='text-foreground -mb-2 font-semibold'>
                                                No exercises
                                            </span>
                                            Start by adding an exercise to your workout
                                            <Drawer
                                                screenWidth={screenWidth}
                                                open={exerciseSelectorOpen}
                                                onOpenChange={setExerciseSelectorOpen}
                                            >
                                                <DrawerTrigger screenWidth={screenWidth}>
                                                    <Button
                                                        type='button'
                                                        className='flex items-center gap-2'
                                                    >
                                                        Add exercise
                                                        <Plus className='scale-75' />
                                                    </Button>
                                                </DrawerTrigger>
                                                <DrawerContent
                                                    desktopClassname='sm:w-[calc(100%-20rem)] max-w-full'
                                                    screenWidth={screenWidth}
                                                    className=''
                                                >
                                                    <ExerciseSelector
                                                        setExerciseSelectorOpen={
                                                            setExerciseSelectorOpen
                                                        }
                                                        watch={watch}
                                                        screenWidth={screenWidth}
                                                        setterFn={setValue}
                                                    />
                                                </DrawerContent>
                                            </Drawer>
                                        </div>
                                    )}
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
        </>
    );
}
