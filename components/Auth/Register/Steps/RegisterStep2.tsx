import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { type RegisterMemberForm } from "../RegisterMemberForm";
import { type RegisterGymOwnerForm } from "../RegisterGymOwnerForm";

// using discriminated unions to assign conditional types
// learn more at: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions
type StepProps = {} & (
    | {
          formType: "member";
          register: UseFormRegister<RegisterMemberForm>;
          errors: FieldErrors<RegisterMemberForm>;
          loading: boolean;
      }
    | {
          formType: "gymOwner";
          register: UseFormRegister<RegisterGymOwnerForm>;
          errors: FieldErrors<RegisterGymOwnerForm>;
          loading: boolean;
      }
);

export default function RegisterStep2({ register, errors, loading }: StepProps) {
    // defining the type of the register function
    // using a ternary operator that checks if the
    // formType property = "member" using extends
    type TypedRegister = StepProps["formType"] extends "member"
        ? UseFormRegister<RegisterMemberForm>
        : UseFormRegister<RegisterGymOwnerForm>;

    // assigning the type to the function
    const typedRegister = register as TypedRegister;

    return (
        <div>
            <Label htmlFor='email'>Email</Label>
            <Input
                disabled={loading}
                key={3}
                placeholder='example@email.com'
                id='email'
                type='email'
                className='mt-2'
                {...typedRegister("email", {
                    required: "Please fill in this field.",
                    pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "This is not a valid email.",
                    },
                })}
            ></Input>
            {errors.email && (
                <p className='text-xs text-destructive mt-2'>{errors.email.message}</p>
            )}
        </div>
    );
}
