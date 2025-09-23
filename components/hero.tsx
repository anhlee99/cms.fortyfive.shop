export function Hero() {
  return (
    <div className="tw-flex tw-flex-col tw-gap-16 ">
      <div className="tw-flex tw-gap-8 tw-justify-center tw-items-center">
        {/* <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
          <Image src="/images/logo.png" alt="FortyFive" className="tw-h-[25rem] w-auto" />
        </a> */}
      </div>
      <h1 className="tw-sr-only">FortyFive - Nền tảng quản lý bán hàng đa kênh</h1>
      <p className="tw-text-3xl lg:tw-text-4xl !tw-leading-tight tw-mx-auto tw-max-w-xl tw-text-center">
        Xây dựng một hệ thống quản lý dễ dàng với{" "}
        <a
          href="https://cms.fortyfive.shop"
          target="_blank"
          className="tw-font-bold tw-hover:underline"
          rel="noreferrer"
        >
          FortyFive
        </a>{" "}
      </p>
    </div>
  );
}
