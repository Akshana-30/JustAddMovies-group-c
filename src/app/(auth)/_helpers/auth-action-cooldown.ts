import { useState, useEffect } from "react";

export const setCooldown = () => {
	const expiry = Date.now() + 30000;
	localStorage.setItem("auth_action_cooldown", expiry.toString());
};

const getRemainingCooldown = () => {
	if (typeof window === "undefined") return 0;

	const storedExpiry = localStorage.getItem("auth_action_cooldown");

	if (!storedExpiry) return 0;

	const remaining = Math.ceil((parseInt(storedExpiry) - Date.now()) / 1000);

	return remaining > 0 ? remaining : 0;
}

export function useCooldown() {
	const [countdown, setCountdown] = useState<number>(0);

	useEffect(() => {
		queueMicrotask(() => setCountdown(getRemainingCooldown()));
	}, [setCountdown]);

	useEffect(() => {
		if (countdown <= 0) return;

		const interval = setInterval(() => {
			const remaining = getRemainingCooldown();
			setCountdown(remaining);
		}, 1000);

		return () => clearInterval(interval);
	}, [countdown]);

	return { countdown, setCountdown };
}