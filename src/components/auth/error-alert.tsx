import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";

interface ErrorAlertProps {
    error: { message?: string } | null;
}

// Alert needs some styling and color change

export const ErrorAlert = ({ error }: ErrorAlertProps) => (
    <AlertDialog>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Something went wrong!</AlertDialogTitle>

                <AlertDialogDescription>
                    {error?.message || "An unknown error occurred. Please try again."}
                </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
                <AlertDialogAction className="m-auto">Okay</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);