"use client";

import { challengesOptions, challenges } from "@/db/schema";
import { useState, useTransition } from "react";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { toast } from "sonner";
import { reduceHearts } from "@/actions/user-progress";
import { useAudio, useMount } from "react-use";
import Image from "next/image";
import { ResultCard } from "./result-card";
import { useRouter } from "next/navigation";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePraticeModal } from "@/store/use-pratice-modal";

type Props = {
    initialPercentage: number;
    initialHearts: number;
    initialLessonId: number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengesOptions: (typeof challengesOptions.$inferSelect)[];
    })[];
    userSubscription: any;
};

export const Quizz = ({ initialPercentage, initialHearts, initialLessonId, initialLessonChallenges, userSubscription }: Props) => {
    const { open: openModalHearts } = useHeartsModal();
    const { open: openModalPractice } = usePraticeModal();

    useMount(() => {
        if (initialPercentage === 100) {
            openModalPractice();
        }
    });

    const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.wav" });
    const [incorrectAudio, _i, incorrectControls] = useAudio({ src: "/incorrect.wav" });
    const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true });

    const [pending, startTransition] = useTransition();

    const router = useRouter();

    const [lessonId] = useState(initialLessonId);
    const [hearts, setHearts] = useState(initialHearts);
    const [percentage, setPercentage] = useState(() => {
        return initialPercentage === 100 ? 0 : initialPercentage;
    });
    const [challenges] = useState(initialLessonChallenges);
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed);
        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    });

    const [selectedOption, setSelectedOption] = useState<number>();
    const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

    const onNext = () => {
        setActiveIndex((current) => current + 1);
    };

    const onSelect = (id: number) => {
        if (status !== "none") {
            return;
        }

        setSelectedOption(id);
    };

    const onContinue = () => {
        if (!selectedOption) {
            return;
        }

        if (status === "wrong") {
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }

        if (status === "correct") {
            onNext();
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }

        const correctOption = options.find((option) => option.correct);

        if (!correctOption) {
            return;
        }

        if (correctOption && correctOption.id === selectedOption) {
            startTransition(() => {
                upsertChallengeProgress(challenge.id)
                    .then((response) => {
                        if (response?.error === "hearts") {
                            openModalHearts();
                            return;
                        }

                        correctControls.play();
                        setStatus("correct");
                        setPercentage((prev) => prev + 100 / challenges.length);

                        if (initialPercentage === 100) {
                            setHearts((prev) => Math.min(prev + 1, 5));
                        }
                    })
                    .catch(() => {
                        toast.error("Something went wrong. Please try again.");
                    });
            });
        } else {
            startTransition(() => {
                reduceHearts(challenge.id)
                    .then((response) => {
                        if (response?.error === "hearts") {
                            openModalHearts();
                            return;
                        }

                        incorrectControls.play();
                        setStatus("wrong");

                        if (!response?.error) {
                            setHearts((prev) => Math.max(prev - 1, 0));
                        }
                    })
                    .catch(() => {
                        toast.error("Something went wrong. Please try again.");
                    });
            });
        }
    };

    const challenge = challenges[activeIndex];
    const options = challenge?.challengesOptions ?? [];

    if (!challenge) {
        return (
            <>
                {finishAudio}
                <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-y-4 text-center lg:gap-y-8">
                    <Image src="/finish.svg" alt="Finish" className="hidden lg:block" height={100} width={100} />
                    <Image src="/finish.svg" alt="Finish" className="block lg:hidden" height={50} width={50} />
                    <h1 className="text-lg font-bold text-neutral-700 lg:text-3xl">
                        Congratulations! <br /> You have completed the lesson.
                    </h1>
                    <div className="flex w-full items-center gap-x-4">
                        <ResultCard variant="points" value={challenges.length * 10} />
                        <ResultCard variant="hearts" value={hearts} />
                    </div>
                </div>
                <Footer status="completed" disabled={false} onCheck={() => router.push("/learn")} lessonId={lessonId} />
            </>
        );
    }

    const title = challenge.type === "ASSIST" ? "Select the correct meaning" : challenge.question;

    return (
        <>
            {correctAudio}
            {incorrectAudio}
            <Header hearts={hearts} percentage={percentage} hasActiveSubscription={!!userSubscription?.isActive} />
            <div className="flex-1">
                <div className="flex h-full items-center justify-center">
                    <div className="flex w-full flex-col gap-y-12 px-6 lg:min-h-[350px] lg:w-[600px] lg:px-0">
                        <h1 className="text-center text-lg font-bold text-neutral-700 lg:text-start lg:text-3xl">{title}</h1>
                        <div>
                            {challenge.type === "ASSIST" && <QuestionBubble question={challenge.question} />}
                            <Challenge
                                options={options}
                                onSelect={onSelect}
                                status={status}
                                selectedOption={selectedOption}
                                disabled={pending}
                                type={challenge.type}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer disabled={pending || !selectedOption} status={status} onCheck={onContinue} />
        </>
    );
};
