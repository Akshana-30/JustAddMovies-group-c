import {
    Table,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { CollapsibleMessage } from "./collapsible-message";
import { MessageProp } from "../_types/message-prop";

export const ContactMessagesTable = ({ msg }: { msg: MessageProp[] }) => (
    <div className="m-auto xl:w-[calc(100%-1/2)] w-[calc(100%-5rem)] rounded-xl border border-(--gold)/40 overflow-x-auto">
        <Table className="border-collapse bg-(--surface) table-fixed min-w-175 [&_td]:truncate">
            <TableHeader className="bg-(--surface2)">
                <TableRow className="xl:[&_th]:w-full hover:bg-transparent!">
                    <TableHead>Created At</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-27.5">Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="w-auto">Message</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>

            {msg.length > 0 && (msg.map(msg => (
                <CollapsibleMessage key={msg.id} msg={msg} />
            )))}
        </Table>

        {msg.length === 0 && (
            <div className="flex items-center justify-center bg-muted h-25 text-center">
                <p>No messages found</p>
            </div>
        )}
    </div>
)