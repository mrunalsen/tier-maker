type BoardHeadingProps = {
  title: string;
  onTitleChange: (title: string) => void;
};

export function BoardHeading({ title, onTitleChange }: BoardHeadingProps) {
  return (
    <div className="mb-6 flex animate-rise-in items-end justify-between gap-4 md:mb-[31px] md:gap-[30px]">
      <div className="min-w-0">
        <input
          aria-label="Tier list title"
          className="w-full max-w-[760px] border-0 bg-transparent p-0 font-serif text-[clamp(27px,8vw,36px)] font-medium leading-[1.12] text-[#213329] outline-none focus:shadow-[0_2px_0_#d2a44e] focus-visible:outline-none md:text-[clamp(30px,4vw,44px)]"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          maxLength={64}
        />
      </div>
    </div>
  );
}
