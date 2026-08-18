export default function NoticiasLoading() {
  return (
    <>
      <section className="pt-28 lg:pt-36 pb-12 lg:pb-16 border-b border-ink/15">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="h-3 w-44 bg-ink/10 animate-pulse" />
          <div className="mt-6 h-16 sm:h-24 max-w-4xl bg-ink/10 animate-pulse" />
          <div className="mt-10 flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="h-9 w-28 bg-ink/10 animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="aspect-[4/3] lg:aspect-[5/4] bg-ink/10 animate-pulse" />
          <div className="space-y-5">
            <div className="h-3 w-24 bg-ink/10 animate-pulse" />
            <div className="h-14 w-full bg-ink/10 animate-pulse" />
            <div className="h-20 w-5/6 bg-ink/10 animate-pulse" />
            <div className="h-3 w-72 bg-ink/10 animate-pulse" />
          </div>
        </div>
      </section>
    </>
  );
}
