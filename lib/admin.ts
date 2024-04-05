import { auth, currentUser } from "@clerk/nextjs";

export const isAdmin = async () => {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        return false;
    }

    return user?.privateMetadata?.role === "admin";
};
