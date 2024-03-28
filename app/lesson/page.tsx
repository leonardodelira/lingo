import { getLesson, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { Quizz } from "./quizz";

const LessonPage = async () => {
    const lessonPromisse = await getLesson();
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
            userSubscription={false}
        />
    )
}

export default LessonPage;
