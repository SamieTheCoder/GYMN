import { type Exercise } from "@/types/Workout";
import { Badge } from "@/components/ui/badge";
import GlowingCard from "@/components/ui/glowingCard";
import { useGetScreenWidth } from "@/lib/hooks/useGetScreenWidth";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GymnLogo from "@/public/gymn_BlackGLogo.svg";

export interface APIExercise extends Exercise {
    created_by: string;
    created_at: string;
}

export default function ExerciseCard({
    exercise,
    className,
    seeMore,
}: {
    exercise: APIExercise;
    seeMore?: boolean;
    className?: string;
}) {
    type DifficultiesMap = {
        [key: string]: string;
    };
    const difficultyColor = ({ level }: { level: string }) => {
        const difficulties: DifficultiesMap = {
            Beginner: "#22c55e",
            Intermediate: "#f59e0b",
            Advanced: "#ef4444",
        };
        return difficulties[level] || "#8a2be2";
    };

    const isDesktop = useMediaQuery("(min-width: 768px)");
    const admin_uuid = "da89627e-3917-4e7c-a583-dab21d5ef726";

    return (
        <GlowingCard
            className={cn(
                `${
                    seeMore ? "h-[150px]" : "h-auto"
                } relative w-full  md:h-[250px] lg:h-[300px] group`,
                className
            )}
        >
            <div
                id='difficulty_indicator'
                className={`hidden md:block w-full h-2 rounded-full`}
                style={{ backgroundColor: difficultyColor({ level: exercise.level[0] }) }}
            ></div>
            <Badge
                variant={exercise.level[0] as any}
                className='rounded-md absolute bottom-100 md:bottom-0 right-0 mb-4 mr-4'
            >
                {exercise.level}
            </Badge>

            <Avatar
                id='creatoravatar'
                className={`absolute w-8 h-8 mt-3 ${
                    isDesktop ? "right-0 mr-4" : "bottom-0 mb-4"
                } rounded-full ${exercise.created_by === admin_uuid ? "" : "border-[1px]"}`}
            >
                <AvatarImage
                    className={
                        exercise.created_by === admin_uuid
                            ? "h-6 grid place-items-center dark:invert"
                            : "border-[1px]"
                    }
                    src={
                        exercise.created_by !== admin_uuid
                            ? `/api/users/${exercise.created_by}/avatar?cache=true`
                            : GymnLogo.src
                    }
                />
                <AvatarFallback>?</AvatarFallback>
            </Avatar>

            <div id='info' className='mt-0 md:mt-2 h-full'>
                <h2
                    id='nome'
                    className='text-base md:text-lg font font-semibold max-w-[200px] md:max-w-none'
                >
                    {exercise.name}
                </h2>
                <span className='flex gap-2 mt-1 w-full flex-wrap'>
                    {exercise?.muscles?.map((muscle) => (
                        <Badge key={muscle} className='rounded-md'>
                            {muscle}
                        </Badge>
                    ))}
                </span>
                <span className='mt-1 w-full text-muted-foreground text-xs'>
                    Equipment:{" "}
                    {exercise.equipment.length == 1 ? (
                        <span>{exercise.equipment[0]}</span>
                    ) : (
                        exercise.equipment.map((equipment, index) => (
                            <span key={equipment}>
                                {index === exercise.equipment.length - 1 // if the index equals the last one
                                    ? equipment // just the equipment name
                                    : equipment !== "Machine" && ( // if the text is different from 'Machine' (equipment is registered as machine, [specific machine])
                                          <>{equipment} or </>
                                      )}
                            </span>
                        ))
                    )}
                </span>
                {isDesktop && (
                    <>
                        <hr className='md:my-2 lg:my-4'></hr>
                        <h4 className='font-semibold '>Execution:</h4>
                        <p
                            className='text-xs mt-2 text-muted-foreground h-[50px] lg:h-75px '
                            style={{ overflow: "clip", textOverflow: "..." }}
                        >
                            {exercise.description}
                        </p>
                    </>
                )}
            </div>
            {seeMore && (
                <span className='group-hover:underline absolute bottom-0 right-0 mb-3 mr-3 md:right-auto md:mb-4 text-xs flex items-center gap-[0.15rem]'>
                    See more <ArrowRight className='scale-[0.65] inline-block' />
                </span>
            )}
        </GlowingCard>
    );
}
