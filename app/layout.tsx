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
	description: "The most comprehensive authentication library for typescript",
	metadataBase: new URL("https://demo.better-auth.com"),
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
