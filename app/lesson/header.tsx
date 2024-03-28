import { Progress } from "@/components/ui/progress";
import { InfinityIcon, X } from "lucide-react";
import Image from "next/image";

type Props = {
    hearts: number;
    percentage: number;
    hasActiveSubscription: boolean;
}

export const Header = ({
    hearts,
    percentage,
    hasActiveSubscription
}: Props) => {
    return (
        <header className="lg:pt-[50px] pt-[20px]  px-10 flex gap-x-7 items-center justify-between max-w-[1440px] mx-auto w-full">
            <X
                onClick={() => console.log('close')}
                className="text-slate-500 hover:opacty-75 transition cursor-pointer"
            />
            <Progress value={percentage} />
            <div className="text-rose-500 flex items-center font-bold">
                <Image src="/heart.svg" width={28} height={28} alt="heart" className="mr-2" />
                {hasActiveSubscription ? <InfinityIcon className="h-6 w-6 stroke-[3]" /> : hearts}
            </div>
        </header>
    );
}
