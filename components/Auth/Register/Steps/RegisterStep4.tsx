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

export default function RegisterStep4({ register, errors, loading }: StepProps) {
    // defining the type of the register function
    // using a ternary operator that checks if the
    // formType property = "member" using extends
    type TypedRegister = StepProps["formType"] extends "member"
        ? UseFormRegister<RegisterMemberForm>
        : UseFormRegister<RegisterGymOwnerForm>;

    // assigning the typedRegister type to the function
    const typedRegister = register as TypedRegister;

    // same logic for the errors function
    type TypedErrors = StepProps["formType"] extends "member"
        ? FieldErrors<RegisterMemberForm>
        : FieldErrors<RegisterGymOwnerForm>;

    const typedErrors = errors as TypedErrors;

    return (
        <div>
            <div>
                <Label htmlFor='gymName'>Gym Name</Label>
                <Input
                    disabled={loading}
                    key={6}
                    placeholder='Example Fitness'
                    id='gymName'
                    type='text'
                    className='mt-2'
                    {...typedRegister("gymName", {
                        required: "Please fill in this field.",
                        minLength: {
                            value: 2,
                            message: "The name cannot be too short.",
                        },
                        maxLength: {
                            value: 30,
                            message: "The name cannot be too long.",
                        },
                        pattern: {
                            value: /^[a-zA-Z0-9äëiöüÄËÏÖÜáéíóúÁÉÍÓÚãõñÃÕÑâêîôûÂÊÎÔÛ ]*$/,
                            message: "The name cannot contain special characters.",
                        },
                    })}
                ></Input>
                <p className='text-xs text-muted-foreground mt-2'>
                    This is the gym that you manage.
                </p>
                {typedErrors.gymName && (
                    <p className='text-xs text-destructive mt-2'>{typedErrors.gymName.message}</p>
                )}
            </div>

            <div className='mt-2'>
                <Label htmlFor='gymAddress'>Gym Address</Label>
                <Input
                    disabled={loading}
                    key={7}
                    placeholder='123 Main Street'
                    id='gymAddress'
                    type='text'
                    className='mt-2'
                    {...typedRegister("gymAddress", {
                        required: "Please fill in this field.",
                        minLength: {
                            value: 2,
                            message: "The address cannot be too short.",
                        },
                        maxLength: {
                            value: 30,
                            message: "The name cannot be too long.",
                        },
                        pattern: {
                            value: /^[a-zA-Z0-9äëiöüÄËÏÖÜáéíóúÁÉÍÓÚãõñÃÕÑâêîôûÂÊÎÔÛ#°, ]*$/,
                            message: "The name cannot contain special characters.",
                        },
                    })}
                ></Input>
                {typedErrors.gymAddress && (
                    <p className='text-xs text-destructive mt-2'>
                        {typedErrors.gymAddress.message}
                    </p>
                )}
            </div>
        </div>
    );
}
