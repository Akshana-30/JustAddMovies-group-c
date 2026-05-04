import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function AdminDashboard(){
    return(
        <div>
            <h1>Admin Dashboard</h1>
            <ul>
                <li>
                    <Button><Link href="/admin-dashboard/add-movie">Add Movie</Link></Button>
                </li>
                <li>
                    <Button><Link href="/admin-dashboard/orders">View all orders</Link></Button>
                </li>
            </ul>
        </div>
    )
}