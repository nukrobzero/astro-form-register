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
  companyName: z
    .string()
    .min(1, { message: "Companyname is required" })
    .min(2, { message: "Companyname must be at least 2 characters" }),
  jobPosition: z
    .string()
    .min(1, { message: "Job position is required" })
    .min(2, { message: "Job position must be at least 2 characters" }),
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
    <form
      className="w-full px-6 pt-6 pb-12"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="p-2 rounded-md shadow-small text-white bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600">
        <h1 className="font-bold text-sm md:text-xl">ลงทะเบียน (Register)</h1>
      </div>
      <div className="md:flex md:justify-between max-md:space-y-4 md:space-x-4 pt-6">
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
      <div className="md:flex md:justify-between max-md:space-y-4 md:space-x-4 pt-6">
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
      <div className="md:flex md:justify-between max-md:space-y-4 md:space-x-4 pt-6">
        <div className="w-full">
          <Controller
            name="companyName"
            control={control}
            render={({ field }) => (
              <Input
                isClearable
                type="text"
                variant="flat"
                label="Company Name"
                onClear={() => setValue("companyName", "")}
                {...field}
                color={errors.companyName?.message ? "danger" : "default"}
                errorMessage={errors.companyName?.message}
              />
            )}
          />
        </div>
        <div className="w-full">
          <Controller
            name="jobPosition"
            control={control}
            render={({ field }) => (
              <Input
                isClearable
                type="text"
                variant="flat"
                label="Job position"
                onClear={() => setValue("jobPosition", "")}
                {...field}
                color={errors.jobPosition?.message ? "danger" : "default"}
                errorMessage={errors.jobPosition?.message}
              />
            )}
          />
        </div>
      </div>
      <div className="space-y-6 pt-12">
        <div className="space-y-4">
          <h2 className="font-medium text-sm md:text-base">
            การให้ความยินยอมในการใช้ข้อมูลเพื่อการประชาสัมพันธ์ข่าวสารและการตลาด
          </h2>
          <p className="indent-9 text-xs overflow-y-auto h-14 scrollbar border p-2 rounded-md">
            ข้าพเจ้ายินยอมให้บริษัทสุมิพล คอร์ปอเรชั่น จํากัด เก็บรวบรวม ใช้
            หรือเปิดเผยข้อมูลส่วนบุคคลและเพื่อวัตถุประสงค์ในการประชาสัมพันธ์ข่าวสารและการตลาด
            อาทิ การนำเสนอผลิตภัณฑ์และบริการ ข้อมูลทางการตลาด
            และกิจกรรมส่งเสริมการตลาดของบริษัทและพันธมิตรของบริษัทฯ
            กรณีที่บริษัทฯจะขอเพิ่มวัตถุประสงค์ในการเก็บรวบรวม ใช้
            หรือเปิดเผยข้อมูลส่วนบุคคล
            บริษัทฯจะแจ้งให้ข้าพเจ้าทราบล่วงหน้าพร้อมทั้งแจ้งสิทธิและช่องทางในการปฏิเสธการเพิ่มวัตถุประสงค์การเก็บรวบรวม
            ใช้ หรือเปิดเผยข้อมูลส่วนบุคคล
            หากข้าพเจ้าไม่ได้ปฏิเสธคำขอดังกล่าวภายในระยะเวลาที่กำหนด
            ให้ถือว่าข้าพเจ้ายินยอมให้บริษัทฯเก็บรวบรวม ใช้
            หรือเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้าตามที่บริษัทฯแจ้งเพิ่มเติม
          </p>
        </div>
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
              <p className="text-sm font-semibold">ยอมรับข้อกำหนดและเงื่อนไข</p>
            </Checkbox>
          )}
        />
      </div>
      <hr className="mb-6 border-t" />
      <div className="mb-6 text-center">
        <Button
          type="submit"
          variant="flat"
          fullWidth
          isDisabled={!isValid}
          className="text-white bg-blue-500"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default Form;