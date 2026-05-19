import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ContactMessagesTable } from "./_components/contact-messages-table";
import prisma from "@/lib/prisma";

export default async function MessagesPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) redirect("/sign-in")
    if (session.user.role !== "ADMIN") redirect("/");

    const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" }
    });

    // Used to count the amount of unread messages
    const unreadCount = messages.filter(msg => !msg.read).length;

    // Used to convert the data to the proper types
    const serializedMessages = messages.map(msg => ({
        id: msg.id,
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
        read: msg.read,
        dateString: msg.createdAt.toDateString(),
    }));

    return (
        <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="font-display text-3xl tracking-wide text-(--text)">
                        Manage <span className="text-(--gold)">Messages</span>
                    </h1>
                    <p className="mt-1 font-serif italic text-(--text-muted)">
                        {messages.length} total messages ·{" "}
                        {unreadCount != 0 ?
                            `${unreadCount} unread ${unreadCount > 1 ?
                                "messages" :
                                "message"}`
                            : `${unreadCount} unread messages`
                        }
                    </p>
                </div>
            </div>
            <ContactMessagesTable msg={serializedMessages} />
        </div>
    )
}