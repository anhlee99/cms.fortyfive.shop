import { AuthButton } from "@/components/auth/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              {/* <Link href={"/"}>FortyFive</Link> */}
              <Image
                src="/images/logo.png"
                alt="FortyFive"
                width={130}
                height={130}
                priority
                sizes="(max-width: 768px) 160px, 400px"
              />
            </div>
            <div className="flex gap-3 items-center">
              <AuthButton />
              <ThemeSwitcher />
            </div>
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <Hero />
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://cms.fortyfive.shop"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              FortyFive <span className="text-foreground/50">CMS</span>
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
