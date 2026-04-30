import z from 'zod';

export const formSchema = z
	.object({
		name: z.string().min(1, 'Name is required').max(32).optional(),
		email: z.email().max(128, 'Email is too long').optional(),
		password: z
			.string()
			.min(8, 'Password needs to be at least 8 characters')
			.max(128, 'Password is too long')
			.regex(
				/^[a-zA-Z0-9!ÅÄÖåäö@#$%^&*()_+=\-[\]{}|;':",./<>?]+$/,
				'Password can only contain letters, numbers, and common symbols',
			)
			.optional(),
		confirmPassword: z.string().optional(),
	})
	.refine(
		(data) => {
			if (data.confirmPassword === undefined) return true;
			return data.password === data.confirmPassword;
		},
		{
			message: "Passwords don't match",
			path: ['confirmPassword'],
		},
	);
