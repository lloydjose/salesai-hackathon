import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { WrapperWithQuery } from "@/components/theme/wrapper";
import { createMetadata } from "@/lib/metadata";
import { Archivo, Spectral } from "next/font/google";
import { cn } from "@/lib/utils";

const archivo = Archivo({
	subsets: ["latin"],
	variable: "--font-sans",
	display: 'swap',
});

const url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const spectral = Spectral({
	subsets: ["latin"],
	weight: ["300"],
	style: ["normal", "italic"],
	variable: "--font-spectral",
	display: 'swap',
});

export const metadata = createMetadata({
	title: {
		template: "%s | Scalaro",
		default: "Scalaro",
	},
	description: "Scalaro is a sales intelligence platform that helps you analyze your prospects and get prepared to sell them.",
	metadataBase: new URL(url),
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon/favicon.ico" sizes="any" />
			</head>
			<body className={cn("min-h-screen bg-background font-sans antialiased", archivo.variable, spectral.variable)}>
				<ThemeProvider attribute="class" defaultTheme="light">
					<WrapperWithQuery>
						{children}
					</WrapperWithQuery>
					<Toaster richColors closeButton />
				</ThemeProvider>
			</body>
		</html>
	);
}
