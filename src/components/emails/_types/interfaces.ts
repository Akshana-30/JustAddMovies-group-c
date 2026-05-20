// ── Props ─────────────────────────────────────────────────────────
// Exported so send-order-confirmation.tsx can reuse the same type
// without duplicating the shape in two places.
export interface OrderConfirmationEmailProps {
	userName: string;
	userEmail: string;
	orderId: string;
	items: { title: string; quantity: number; price: number }[];
	total: number;
	shippingAddress: {
		street: string;
		city: string;
		zip: string;
		country: string;
	};
}

export interface UserProp {
    userName: string;
}

export interface WebsiteProp extends UserProp {
    websiteName: string;
}