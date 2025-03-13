import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { type RegisterMemberForm } from "../RegisterMemberForm";
import { type RegisterGymOwnerForm } from "../RegisterGymOwnerForm";
import { PasswordInput } from "@/components/ui/input";

// using discriminated unions to assign conditional types
// learn more at: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions
type StepProps = {} & (
    | {
          formType: "member";
          register: UseFormRegister<RegisterMemberForm>;
          errors: FieldErrors<RegisterMemberForm>;
          watch: UseFormWatch<RegisterMemberForm>;
          loading: boolean;
      }
    | {
          formType: "gymOwner";
          register: UseFormRegister<RegisterGymOwnerForm>;
          errors: FieldErrors<RegisterGymOwnerForm>;
          watch: UseFormWatch<RegisterGymOwnerForm>;
          loading: boolean;
      }
);

export default function RegisterStep3({ register, errors, watch, loading }: StepProps) {
    // defining the type of the register function
    // in a ternary operator that checks if the
    // formType property = "member" using extends
    type TypedRegister = StepProps["formType"] extends "member"
        ? UseFormRegister<RegisterMemberForm>
        : UseFormRegister<RegisterGymOwnerForm>;

    // assigning the typedRegister type to the function
    const typedRegister = register as TypedRegister;

    // same logic for the watch function
    type TypedWatch = StepProps["formType"] extends "member"
        ? UseFormWatch<RegisterMemberForm>
        : UseFormWatch<RegisterGymOwnerForm>;

    const typedWatch = watch as TypedWatch;

    return (
        <div>
            <div>
                <Label htmlFor='password'>Password</Label>
                <TooltipProvider delayDuration={0}>
                    <Tooltip defaultOpen>
                        <TooltipTrigger asChild>
                            <PasswordInput
                                disabled={loading}
                                key={4}
                                placeholder='••••••••'
                                id='password'
                                className='mt-2'
                                {...typedRegister("password", {
                                    required: "Please fill in this field.",
                                    minLength: {
                                        value: 6,
                                        message: "Password must contain 6 or more characters.",
                                    },
                                    maxLength: {
                                        value: 40,
                                        message: "Password must be shorter.",
                                    },
                                    validate: {
                                        lowerCase: (value: string) =>
                                            /^(?=.*[a-z])/.test(value) ||
                                            "Password must contain a lowercase letter.",
                                        upperCase: (value: string) =>
                                            /^(?=.*[A-Z])/.test(value) ||
                                            "Password must contain an uppercase letter.",
                                        number: (value: string) =>
                                            /^(?=.*[0-9])/.test(value) ||
                                            "Password must contain a number.",
                                    },
                                })}
                            ></PasswordInput>
                        </TooltipTrigger>
                        <TooltipContent side='bottom'>
                            <h4>Your password must contain at least:</h4>
                            <ul className='text-xs text-muted-foreground list-disc'>
                                <li className='list-inside'>One lowercase letter</li>
                                <li className='list-inside'>One uppercase letter</li>
                                <li className='list-inside'>One number</li>
                            </ul>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                {errors.password && (
                    <p className='text-xs text-destructive mt-2'>{errors.password.message}</p>
                )}
            </div>

            <div className='mt-2'>
                <Label htmlFor='confirmPassword'>Confirm password</Label>
                <PasswordInput
                    disabled={loading}
                    key={5}
                    placeholder='••••••••'
                    id='confirmPassword'
                    className='mt-2'
                    {...typedRegister("confirmPassword", {
                        required: "Please fill in this field.",
                        validate: (value: string) => {
                            if (typedWatch("password") != value) {
                                return "Passwords do not match.";
                            }
                        },
                    })}
                ></PasswordInput>
                {errors.confirmPassword && (
                    <p className='text-xs text-destructive mt-2'>
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>
        </div>
    );
}
