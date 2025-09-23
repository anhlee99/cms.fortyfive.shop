import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="tw-flex tw-min-h-svh tw-w-full tw-items-center tw-justify-center tw-p-6 tw-md:p-10">
      <div className="tw-w-full tw-max-w-sm">
        <div className="tw-flex tw-flex-col tw-gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="tw-text-2xl">
                Sorry, something went wrong.
              </CardTitle>
            </CardHeader>
            <CardContent>
              {params?.error ? (
                <p className="tw-text-sm tw-text-muted-foreground">
                  Code error: {params.error}
                </p>
              ) : (
                <p className="tw-text-sm tw-text-muted-foreground">
                  An unspecified error occurred.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
