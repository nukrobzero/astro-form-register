import { type SubmitHandler, Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Checkbox, Input } from "@nextui-org/react";

const validationSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "Firstname is required" })
    .min(2, { message: "Firstname must be at least 2 characters" }),
  lastName: z
    .string()
    .min(1, { message: "Lastname is required" })
    .min(2, { message: "Lastname must be at least 2 characters" }),
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email",
  }),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^[0-9]{9,10}$/, { message: "Phone number must be 9 to 10 digits" })
    .max(10),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept Terms and Conditions" }),
  }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const Form = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => console.log(data);

  return (
    <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="md:flex md:justify-between max-md:space-y-4 md:space-x-4 ">
        <div className="w-full">
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Input
                isClearable
                type="text"
                variant="flat"
                label="First Name"
                onClear={() => setValue("firstName", "")}
                {...field}
                color={errors.firstName?.message ? "danger" : "default"}
                errorMessage={errors.firstName?.message}
              />
            )}
          />
        </div>
        <div className="w-full">
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Input
                isClearable
                type="text"
                variant="flat"
                label="Last Name"
                onClear={() => setValue("lastName", "")}
                {...field}
                color={errors.lastName?.message ? "danger" : "default"}
                errorMessage={errors.lastName?.message}
              />
            )}
          />
        </div>
      </div>
      <div className="md:flex md:justify-between max-md:space-y-4 md:space-x-4 ">
        <div className="w-full">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                isClearable
                type="email"
                variant="flat"
                label="Email"
                onClear={() => setValue("email", "")}
                {...field}
                color={errors.email?.message ? "danger" : "default"}
                errorMessage={errors.email?.message}
              />
            )}
          />
        </div>
        <div className="w-full">
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <Input
                isClearable
                type="text"
                variant="flat"
                label="Phone"
                onClear={() => setValue("phoneNumber", "")}
                {...field}
                color={errors.phoneNumber?.message ? "danger" : "default"}
                errorMessage={errors.phoneNumber?.message}
              />
            )}
          />
        </div>
      </div>
      <div className="mb-4">
        <Controller
          name="terms"
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <Checkbox
              isInvalid={!!errors.terms?.message}
              color="primary"
              onChange={(e) => onChange(e.target.checked)}
              checked={value}
              {...field}
            >
              Accept Terms & Conditions
            </Checkbox>
          )}
        />
      </div>
      <div className="mb-6 text-center">
        <Button
          type="submit"
          variant="flat"
          color="primary"
          fullWidth
          isDisabled={!isValid}
        >
          Submit
        </Button>
      </div>
      <hr className="mb-6 border-t" />
    </form>
  );
};

export default Form;
