"use client";

import { courses, userProgress } from "@/db/schema";
import { Card } from "./card";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { upsertUserProgress } from "@/actions/user-progress";
import { toast } from "sonner";

type Props = {
    courses: typeof courses.$inferSelect[],
    activeCourseId?: typeof userProgress.$inferSelect.activeCourseId;
}

export const List = ({ courses, activeCourseId }: Props) => {
    const router = useRouter();
    const [pending, startTransaction] = useTransition();

    const onClick = (id: number) => {
        if (pending) null;

        if (id === activeCourseId) {
            return router.push("/learn");
        }

        startTransaction(() => {
            upsertUserProgress(id)
                .catch(() => toast.error("Something went wront"));
        });
    }

    return (
        <div className="pt-6 grid grid-cols-2 
            lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
            {courses.map(course => (
                <Card
                    id={course.id}
                    key={course.id}
                    title={course.title}
                    imageSrc={course.imageSrc}
                    active={course.id === activeCourseId}
                    disable={pending}
                    onClick={onClick} />
            ))}
        </div>
    )
};
