import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { type RegisterMemberForm } from "../RegisterMemberForm";
import { type RegisterGymOwnerForm } from "../RegisterGymOwnerForm";

// using discriminated unions to assign conditional types
// see more at: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions
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

export default function RegisterStep1({ register, errors, loading }: StepProps) {
    // defining the type of the register function
    // in a ternary operator that checks if the
    // formtype property = "member" using extends
    type TypedRegister = StepProps["formType"] extends "member"
        ? UseFormRegister<RegisterMemberForm>
        : UseFormRegister<RegisterGymOwnerForm>;

    // assigning the typedregister type to the function
    const typedRegister = register as TypedRegister;

    return (
        <div>
            <div>
                <Label htmlFor='displayName'>Display Name</Label>
                <Input
                    disabled={loading}
                    key={1}
                    placeholder='John'
                    id='displayName'
                    type='text'
                    className='mt-2'
                    {...typedRegister("displayName", {
                        required: "Please fill in this field.",
                        minLength: {
                            value: 2,
                            message: "The name cannot be too short.",
                        },
                        maxLength: {
                            value: 25,
                            message: "The name cannot be too long.",
                        },
                        pattern: {
                            value: /^[a-zA-Z0-9_ äëiöüÄËÏÖÜáéíóúÁÉÍÓÚãõñÃÕÑâêîôûÂÊÎÔÛ]*$/,
                            message: "The name cannot contain special characters.",
                        },
                    })}
                ></Input>
                <p className='text-xs text-muted-foreground mt-2'>This will be your display name</p>
                {errors.displayName && (
                    <p className='text-xs text-destructive mt-2'>{errors.displayName.message}</p>
                )}
            </div>

            <div className='mt-2'>
                <Label htmlFor='username'>Username</Label>
                <Input
                    disabled={loading}
                    key={2}
                    placeholder='John_Doe'
                    id='username'
                    type='text'
                    className='mt-2'
                    {...typedRegister("username", {
                        required: "Please fill in this field.",
                        minLength: {
                            value: 3,
                            message: "The name cannot be too short.",
                        },
                        maxLength: {
                            value: 30,
                            message: "The name cannot be too long.",
                        },
                        pattern: {
                            value: /^[a-zA-Z0-9]*$/,
                            message: "The username cannot contain special characters.",
                        },
                    })}
                ></Input>
                <p className='text-xs text-muted-foreground mt-2'>
                    You will be identified by this name.
                </p>
                {errors.username && (
                    <p className='text-xs text-destructive mt-2'>{errors.username.message}</p>
                )}
            </div>
        </div>
    );
}
