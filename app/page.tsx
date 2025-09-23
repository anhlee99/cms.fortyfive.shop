import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Image from 'next/image'

export default function Home() {
  return (
    <main className="tw-min-h-screen tw-flex tw-flex-col tw-items-center">
      <div className="tw-flex-1 tw-w-full tw-flex tw-flex-col tw-gap-20 tw-items-center">
        <nav className="tw-w-full tw-flex tw-justify-center tw-border-b tw-border-b-foreground/10 tw-h-16">
          <div className="tw-w-full tw-max-w-5xl tw-flex tw-justify-between tw-items-center tw-p-3 tw-px-5 tw-text-sm">
            <div className="tw-flex tw-gap-5 tw-items-center tw-font-semibold">
              {/* <Link href={"/"}>FortyFive</Link> */}
              <Image src="/images/logo.png" alt="FortyFive"  width={130} height={130} priority sizes="(max-width: 768px) 160px, 400px" />
            </div>
            <div className="tw-flex tw-gap-3 tw-items-center">
              <AuthButton />
              <ThemeSwitcher />
            </div>

          </div>
        </nav>
        <div className="tw-flex-1 tw-flex tw-flex-col tw-gap-20 tw-max-w-5xl tw-p-5">
          <Hero />
        </div>

        <footer className="tw-w-full tw-flex tw-items-center tw-justify-center tw-border-t tw-mx-auto tw-text-center tw-text-xs tw-gap-8 tw-py-16">
          <p>
            Powered by{" "}
            <a
              href="https://cms.fortyfive.shop"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              FortyFive
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
