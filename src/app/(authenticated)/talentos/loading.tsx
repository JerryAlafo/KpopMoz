export default function TalentosLoading() {
  return (
    <>
      <section className="pt-28 lg:pt-36 pb-12 lg:pb-16 bg-bone-200/40 border-b border-ink/15">
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
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
              <div key={item} className="space-y-4 animate-pulse">
                <div className="aspect-[4/5] bg-ink/10" />
                <div className="h-5 w-3/4 bg-ink/10" />
                <div className="h-3 w-1/2 bg-ink/10" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
