"use client";

import { ErrorAlert } from "@/components/auth/error-alert";
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SendVerificationButton() {
    async function HandleClick() {
        const { error } = await authClient.sendVerificationEmail({
            email: "",
        });

        if(error) {
            <ErrorAlert error={error} />

            return;
        } 

        <AlertDialog>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Success!</AlertDialogTitle>

                    <AlertDialogDescription>
                        
                    </AlertDialogDescription>
                </AlertDialogHeader>
                    Verification code sent! Please check your email &#40;including the spam folder&#41;.
                <AlertDialogFooter>
                    <AlertDialogAction className="m-auto">Okay</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    }

    return (
        <Button className="w-full" onClick={HandleClick}>
            Re-send Verification Email
        </Button>
    )
}