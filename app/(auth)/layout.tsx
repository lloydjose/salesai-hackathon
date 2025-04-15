import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = 'force-dynamic'

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className={`min-h-screen grid place-items-center ${inter.className}`}>
			<div className="w-full max-w-[450px] p-4 sm:p-6 lg:p-8">
				{children}
			</div>
		</div>
	);
} 