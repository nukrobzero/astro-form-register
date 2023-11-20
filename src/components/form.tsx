import { type SubmitHandler, Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Button, Checkbox, Input } from "@nextui-org/react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

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
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
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

type FormProps = {
  userFrom: string;
};

const Form = ({ userFrom }: FormProps) => {
  const getUserFromUrl = userFrom === "fb" ? "Facebook" : "Link";

  const [emailDuclicate, setEmailDuclicate] = useState("");
  const [thankU, setThankU] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<ValidationSchema> = async (values) => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        "/api/postForm",
        {
          values,
          getUserFromUrl,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (data === "Email already exists") {
        setEmailDuclicate(data);
        setIsLoading(false);
        toast.error("Email already exists");
      }
      if (data === "Somting want wrong, Please try again.") {
        setIsLoading(false);
        toast.error("Plese try again.");
      }
      if (data.status === "success") {
        setThankU(true);
        setIsLoading(false);
        reset();
        toast.success("Successfully");
      }
    } catch (error) {
      toast.error("Something went wrong!,Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      {thankU ? (
        <div className="shadow-lg p-12 bg-white rounded-b-md">
          <div className="flex flex-col lg:h-48 justify-center items-center space-y-6">
            <h1 className="text-base text-black font-semibold text-center">
              ขอบคุณที่ท่านได้ลงทะเบียนล่วงหน้า ทางเราได้ส่ง Bar code
              ไปให้ท่านทางอีเมล์
            </h1>
            <Button
              color="primary"
              onClick={() => {
                setThankU(false);
                setEmailDuclicate("");
              }}
            >
              ย้อนกลับ
            </Button>
          </div>
        </div>
      ) : (
        <form
          className="w-full px-6 pt-8 pb-12"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="p-2 rounded-md shadow-small text-white bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600">
            <h1 className="font-bold text-sm md:text-xl">
              ลงทะเบียน (Register)
            </h1>
          </div>
          <div className="md:flex md:justify-between max-md:space-y-4 md:space-x-4 pt-6">
            <div className="w-full">
              <Controller
                name="firstName"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    isClearable
                    type="text"
                    variant="flat"
                    label="First Name"
                    maxLength={100}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
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
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    isClearable
                    type="text"
                    variant="flat"
                    label="Last Name"
                    maxLength={100}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
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
                render={({ field: { onChange, ...field } }) => (
                  <Input
                    isClearable
                    type="email"
                    variant="flat"
                    label="Email"
                    maxLength={100}
                    onChange={(e) => {
                      onChange(e.target.value);
                      setEmailDuclicate("");
                    }}
                    onClear={() => setValue("email", "")}
                    {...field}
                    color={
                      errors.email?.message || emailDuclicate !== ""
                        ? "danger"
                        : "default"
                    }
                    errorMessage={errors.email?.message || emailDuclicate}
                  />
                )}
              />
            </div>
            <div className="w-full">
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    isClearable
                    type="text"
                    variant="flat"
                    label="Phone"
                    maxLength={14}
                    value={value}
                    onChange={(e) => {
                      const input = e.target.value
                        .replace(/\D/g, "")
                        .substring(0, 10);
                      const match = input.match(/^(\d{2})(\d{3})(\d{4})$/);
                      const matchPhone = input.match(/^(\d{3})(\d{3})(\d{4})$/);
                      if (match) {
                        e.target.value = `${match[1]}-${match[2]}-${match[3]}`;
                      } else if (matchPhone) {
                        e.target.value = `${matchPhone[1]}-${matchPhone[2]}-${matchPhone[3]}`;
                      } else {
                        e.target.value = input;
                      }
                      onChange(e.target.value);
                    }}
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
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    isClearable
                    type="text"
                    variant="flat"
                    label="Company Name"
                    maxLength={100}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
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
                render={({ field: { onChange, value, ...field } }) => (
                  <Input
                    isClearable
                    type="text"
                    variant="flat"
                    label="Job position"
                    maxLength={100}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
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
              <h2 className="font-semibold text-sm md:text-base">
                การให้ความยินยอมในการใช้ข้อมูลเพื่อการประชาสัมพันธ์ข่าวสารและการตลาด
              </h2>
              <p className="indent-9 lg:indent-6 text-xs lg:text-sm overflow-y-auto h-14 lg:h-[70px] scrollbar border p-2 rounded-md">
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
                  <p className="text-sm font-semibold">
                    ยอมรับข้อกำหนดและเงื่อนไข
                  </p>
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
              isLoading={isLoading}
              className="text-white bg-blue-500"
            >
              Submit
            </Button>
          </div>
        </form>
      )}
    </>
  );
};

export default Form;
