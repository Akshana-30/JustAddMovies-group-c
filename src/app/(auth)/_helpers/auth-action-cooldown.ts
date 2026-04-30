import { useState, useEffect } from "react";

export const setCooldown = () => {
	const expiry = Date.now() + 60000;
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
	const [countdown, setCountdown] = useState<number>(getRemainingCooldown);

	const isTimerActive = countdown > 0;

	useEffect(() => {
		if (!isTimerActive) return;

		const interval = setInterval(() => {
			setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
		}, 1000);

		return () => clearInterval(interval);
	}, [isTimerActive]);

	return { countdown, setCountdown };
}