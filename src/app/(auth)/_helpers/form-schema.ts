import z from 'zod';

const passwordRules = z
	.string()
	.min(8, 'Password needs to be at least 8 characters')
	.max(128, 'Password is too long')
	.regex(
		/^[a-zA-Z0-9!ÅÄÖåäö@#$%^&*()_+=\-[\]{}|;':",./<>?]+$/,
		'Password can only contain letters, numbers, and common symbols',
	);

const emailRules = z.email().max(128, 'Email is too long');
const nameRules = z.string().min(1, 'Name is required').max(32);
const confirmPasswordRules = z.string();

export const registerSchema = z
	.object({
		name: nameRules,
		email: emailRules,
		password: passwordRules,
		confirmPassword: confirmPasswordRules
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

// export const loginSchema = z.object({
// 	email: z.email(),
// 	password: z.string(),
// });

export const resetEmailSchema = z.object({
	email: emailRules,
});

export const resetPasswordSchema = z
	.object({
		password: passwordRules,
		confirmPassword: confirmPasswordRules
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

export const settingsSchema = z
	.object({
		name: nameRules,
		email: emailRules,
		password: passwordRules.or(z.literal('')),
		confirmPassword: confirmPasswordRules.or(z.literal('')),
		currentPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});
