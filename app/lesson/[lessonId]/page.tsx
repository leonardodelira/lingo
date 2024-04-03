import { getLesson, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { Quizz } from "../quizz";

type Props = {
    params: {
        lessonId: number;
    }
}

const LessonIdPage = async ({ params }: Props) => {
    const lessonPromisse = await getLesson(params.lessonId);
    const userProgressPromisse = await getUserProgress();

    const [lesson, userProgress] = await Promise.all([lessonPromisse, userProgressPromisse]);

    if (!lesson || !userProgress) {
        redirect('/learn');
    }

    const initialPercentage = lesson.challenges
        .filter(challenge => challenge.completed)
        .length / lesson.challenges.length * 100;

    return (
        <Quizz
            initialPercentage={initialPercentage}
            initialHearts={userProgress.hearts}
            initialLessonId={lesson.id}
            initialLessonChallenges={lesson.challenges}
            userSubscription={null}
        />
    )
}

export default LessonIdPage;
