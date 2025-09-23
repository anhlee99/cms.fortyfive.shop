import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="tw-flex tw-min-h-svh tw-w-full tw-items-center tw-justify-center tw-p-6 tw-md:p-10">
      <div className="tw-w-full tw-max-w-sm">
        <div className="tw-flex tw-flex-col tw-gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="tw-text-2xl">
                Thank you for signing up!
              </CardTitle>
              <CardDescription>Check your email to confirm</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="tw-text-sm tw-text-muted-foreground">
                You&apos;ve successfully signed up. Please check your email to
                confirm your account before signing in.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
