"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useExitModal } from "@/store/user-exit-modal";

export const ExitModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const { isOpen, close } = useExitModal();

    useEffect(() => { setIsClient(true) }, []);

    if (!isClient) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex flex-col items-center justify-center mb-5">
                        <Image src="/mascot_sad.svg" width={70} height={70} alt="Mascot Sad" />
                    </div>
                    <DialogTitle className="text-center font-bold text-2xl">Wait, dont go!</DialogTitle>
                    <DialogDescription className="text-center text-base">Are you sure you want to exit?</DialogDescription>
                </DialogHeader>
                <DialogFooter className="mb-4">
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button onClick={close} variant="primary" size="lg" className="w-full">Keep Learning</Button>
                        <Button onClick={() => { close(); router.push("/learn") }} variant="dangerOutline" size="lg" className="w-full">End Session</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};
