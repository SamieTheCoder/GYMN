import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

// Updated validation schema with English error messages
const inviteExistingAffiliateSchema = z.object({
    email: z.string().email().optional(),
    username: z
        .string()
        .min(3, { message: "Username cannot be too short" })
        .max(30, { message: "Username cannot be too long" })
        .refine((x) => /^[a-zA-Z0-9]*$/.test(x), {
            message: "Username cannot contain special characters.",
        })
        .optional(),
});

export async function POST(req: Request) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const {
        data: { session },
        error,
    } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { email, username } = inviteExistingAffiliateSchema.parse(await req.json());

        if (email && username) {
            return NextResponse.json(
                {
                    success: false,
                    error: "You can only pass either a username or an email, not both at the same req.",
                },
                { status: 401 }
            );
        }

        const user = await supabase.from("users").select("profile").eq("id", session.user.id);
        //only gymowners can invite affiliates
        if (user.data![0].profile !== "GymOwner") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        /*
            EMAIL AFFILIATION
            -the requesting user should be a gymowner to affiliate someone
            -the specified user being affiliated should not be a gymowner
            -the specified user being affiliated should not belong to any gym
            -the specified user being affiliated should not be the same as the user affiliating    
        */
        if (email && !username) {
            //check if the user exists
            const { data } = await supabase.rpc("check_email_exists", {
                email_param: email.toLowerCase(),
            });
            if (data == false) {
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            title: "User does not exist.",
                            description: "The specified user does not exist.",
                        },
                    },
                    { status: 404 }
                );
            }

            //1. validate if the user is a gym owner (cant affiliate gymowners)
            const userProfile = await supabase
                .from("users")
                .select("email, profile, id")
                .eq("email", email);

            if (userProfile.data![0].profile === "GymOwner") {
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            title: "Action denied",
                            description: "You cannot affiliate a gym owner.",
                        },
                    },
                    { status: 401 }
                );
            }

            //2. validate if the user is not affiliated to any gym
            const afilliateStatus = await supabase
                .from("affiliates")
                .select("*")
                .eq("user_id", userProfile.data![0].id);
            if (afilliateStatus.data?.length !== 0) {
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            title: "Action denied",
                            description: "The specified user is already affiliated with a gym.",
                        },
                    },
                    { status: 401 }
                );
            }

            //3: validate if the user is not affiliating himself
            if (email === session?.user?.email) {
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            title: "Action denied",
                            description: "You cannot affiliate yourself.",
                        },
                    },
                    { status: 401 }
                );
            }

            //4. if all pass, affiliate the user to the gym.
            const gymId = await supabase.from("gym").select("id").eq("owner", session.user.id);
            if (gymId.data?.length == 0) {
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            title: "Action denied",
                            description: "Gym does not exist.",
                        },
                    },
                    { status: 404 }
                );
            }

            const createdAffiliation = await supabase.from("affiliates").insert({
                user_id: userProfile.data![0].id,
                belongs_to: gymId.data![0].id,
                verified: false,
                invite_type: "existing",
            });
            return NextResponse.json(
                { success: true, data: createdAffiliation.data },
                { status: 200 }
            );
        }

        /*
            USERNAME AFFILIATION
            -the requesting user should be a gymowner to affiliate someone
            -the specified user being affiliated should not be a gymowner
            -the specified user being affiliated should not belong to any gym
            -the specified user being affiliated should not be the same as the user affiliating    
        */
        if (username && !email) {
            //check if the user exists
            const { data } = await supabase
                .from("users")
                .select("username")
                .eq("username", username.toLowerCase());

            if (data?.length == 0) {
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            title: "User does not exist.",
                            description: "The specified user does not exist.",
                        },
                    },
                    { status: 404 }
                );
            }

            //1. validate if the user is a gym owner (cant affiliate gymowners)
            const userProfile = await supabase
                .from("users")
                .select("email, profile, id")
                .eq("username", username);

            if (userProfile.data![0].profile === "GymOwner") {
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            title: "Action denied",
                            description: "You cannot affiliate a gym owner.",
                        },
                    },
                    { status: 401 }
                );
            }

            //2. validate if the user is not affiliated to any gym
            const afilliateStatus = await supabase
                .from("affiliates")
                .select("*")
                .eq("user_id", userProfile.data![0].id);
            if (afilliateStatus.data?.length !== 0) {
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            title: "Action denied",
                            description: "The specified user is already affiliated with a gym.",
                        },
                    },
                    { status: 401 }
                );
            }

            //3: validate if the user is not affiliating himself
            if (userProfile.data![0].email === session?.user?.email) {
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            title: "Action denied",
                            description: "You cannot affiliate yourself.",
                        },
                    },
                    { status: 401 }
                );
            }

            //4. if all pass, affiliate the user to the gym.
            const gymId = await supabase.from("gym").select("id").eq("owner", session.user.id);
            if (gymId.data?.length == 0) {
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            title: "Action denied",
                            description: "Gym does not exist.",
                        },
                    },
                    { status: 404 }
                );
            }

            const createdAffiliation = await supabase.from("affiliates").insert({
                user_id: userProfile.data![0].id,
                belongs_to: gymId.data![0].id,
                verified: false,
                invite_type: "existing",
            });
            return NextResponse.json(
                { success: true, data: createdAffiliation.data },
                { status: 200 }
            );
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}
