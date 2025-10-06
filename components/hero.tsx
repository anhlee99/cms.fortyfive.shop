export function Hero() {
  return (
    <div className="flex flex-col gap-16 ">
      <div className="flex gap-8 justify-center items-center">
        {/* <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
          <Image src="/images/logo.png" alt="FortyFive" className="h-[25rem] w-auto" />
        </a> */}
      </div>
      <h1 className="sr-only">FortyFive - Nền tảng quản lý bán hàng đa kênh</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Xây dựng một hệ thống quản lý dễ dàng với{" "}
        <a
          href="https://cms.fortyfive.shop"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          FortyFive
        </a>{" "}
      </p>
    </div>
  );
}
