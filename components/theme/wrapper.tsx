"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Wrapper({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative min-h-screen bg-background">
			<div className="flex flex-col">
				{children}
			</div>
		</div>
	);
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 1000,
		},
	},
});

export function WrapperWithQuery({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<Wrapper>{children}</Wrapper>
		</QueryClientProvider>
	);
}
