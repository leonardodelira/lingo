import { Progress } from "@/components/ui/progress";
import { useExitModal } from "@/store/user-exit-modal";
import { InfinityIcon, X } from "lucide-react";
import Image from "next/image";

type Props = {
  hearts: number;
  percentage: number;
  hasActiveSubscription: boolean;
};

export const Header = ({ hearts, percentage, hasActiveSubscription }: Props) => {
  const { open } = useExitModal();

  return (
    <header className="mx-auto flex  w-full max-w-[1440px] items-center justify-between gap-x-7 px-10 pt-[20px] lg:pt-[50px]">
      <X onClick={open} className="hover:opacty-75 cursor-pointer text-slate-500 transition" />
      <Progress value={percentage} />
      <div className="flex items-center font-bold text-rose-500">
        <Image src="/heart.svg" width={28} height={28} alt="heart" className="mr-2" />
        {hasActiveSubscription ? <InfinityIcon className="h-6 w-6 shrink-0 stroke-[3]" /> : hearts}
      </div>
    </header>
  );
};
