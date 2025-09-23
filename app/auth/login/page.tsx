import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div className="tw-flex tw-min-h-svh tw-w-full tw-items-center tw-justify-center tw-p-6 tw-md:p-10">
      <div className="tw-w-full tw-max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
