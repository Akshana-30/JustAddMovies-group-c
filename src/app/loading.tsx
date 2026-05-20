import { Spinner } from "@/components/ui/spinner";

export default function Loading(){

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center gap-4">
            <Spinner className="size-8"/>
            Loading...
        </div>
    )
}