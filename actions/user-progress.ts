"use server";

import db from "@/db/drizzle";
import { getCourseById, getUserProgress } from "@/db/queries";
import { challenges, challengesProgress, userProgress } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const upsertUserProgress = async (courseId: number) => {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId || !user) {
        throw new Error("Unauthorized");
    }

    const course = await getCourseById(courseId);
    
    if (!course) {
        throw new Error("Course not found");
    }

    const existingCourseProgress = await getUserProgress();

    if (existingCourseProgress) {
        await db.update(userProgress).set({
            activeCourseId: courseId,
            userName: user.username || 'User',
            userImageSrc: user.imageUrl || './mascot.svg'
        });

        revalidatePath("/courses");
        revalidatePath("/learn");
        redirect("/learn");
    }

    await db.insert(userProgress).values({
        userId: userId,
        activeCourseId: courseId,
        userName: user.username || 'User',
        userImageSrc: user.imageUrl || './mascot.svg'
    });

    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
}

export const reduceHearts = async (challengeId: number) => {
    const { userId } = await auth();
  
    if (!userId) {
      throw new Error("Unauthorized");
    }
  
    const currentUserProgress = await getUserProgress();
    //const userSubscription = await getUserSubscription();
  
    const challenge = await db.query.challenges.findFirst({
      where: eq(challenges.id, challengeId),
    });
  
    if (!challenge) {
      throw new Error("Challenge not found");
    }
  
    const lessonId = challenge.lessonId;
  
    const existingChallengeProgress = await db.query.challengesProgress.findFirst({
      where: and(
        eq(challengesProgress.userId, userId),
        eq(challengesProgress.challengeId, challengeId),
      ),
    });
  
    const isPractice = !!existingChallengeProgress;
  
    if (isPractice) {
      return { error: "practice" }; 
    }
  
    if (!currentUserProgress) {
      throw new Error("User progress not found");
    }
  
    // if (userSubscription?.isActive) {
    //   return { error: "subscription" };
    // }
  
    if (currentUserProgress.hearts === 0) {
      return { error: "hearts" };
    }
  
    await db.update(userProgress).set({
      hearts: Math.max(currentUserProgress.hearts - 1, 0),
    }).where(eq(userProgress.userId, userId));
  
    revalidatePath("/shop");
    revalidatePath("/learn");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);
  };
