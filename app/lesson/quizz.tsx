"use client";

import { challengesOptions, challenges } from "@/db/schema";
import { useState } from "react";
import { Header } from "./header";

type Props = {
    initialPercentage: number;
    initialHearts: number;
    initialLessonId: number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengesOptions: typeof challengesOptions.$inferSelect[];
    })[];
    userSubscription: any;
};

export const Quizz = ({
    initialPercentage,
    initialHearts,
    initialLessonId,
    initialLessonChallenges,
}: Props) => {
    const [hearts, setHearts] = useState(initialHearts);
    const [percentage, setPercenatge] = useState(initialPercentage);

    return (
        <div>
            <Header hearts={hearts} percentage={percentage} hasActiveSubscription={false} />
        </div>
    );
};
