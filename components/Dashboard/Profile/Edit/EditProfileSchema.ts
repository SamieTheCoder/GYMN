import * as z from "zod";

export const EditProfileFormSchema = z.object({
    display_name: z
        .string()
        .min(2, "The name cannot be too short.")
        .max(25, "The name cannot be too long.")
        .refine(
            (value) => /^[a-zA-Z0-9_ äëiöüÄËÏÖÜáéíóúÁÉÍÓÚãõñÃÕÑâêîôûÂÊÎÔÛ]*$/.test(value),
            "The name cannot contain special characters."
        ),
    bio: z
        .string()
        .max(160, "The bio cannot be too long")
        .refine((value) => value.split("\n").length <= 4, {
            message: `The bio should not have more than ${4} lines.`,
        }),
    location: z.string().max(30, "Your location must be shorter"),
});
