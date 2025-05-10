import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { HTMLAttributes, ReactNode } from "react";

export function ShinyRotatingBorderButton({
	children,
	className,
	...props
}: Readonly<{ children: ReactNode; className?: string }> &
	HTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			className={cn(
				"group relative overflow-hidden rounded-full bg-neutral-200 p-px transition-transform active:scale-95 dark:bg-black",
				"shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(59,196,242,0.3),0_8px_30px_rgba(122,105,249,0.3),0_8px_30px_rgba(242,99,120,0.3)]",
				"dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_30px_rgba(59,196,242,0.2),0_8px_30px_rgba(122,105,249,0.2),0_8px_30px_rgba(242,99,120,0.2)]",
				"transition-all duration-500",
				className
			)}
			type="button"
			{...props}
		>
			<motion.span
				animate={{
					top: ["50%", "0%", "50%", "100%", "50%"],
					left: ["0%", "50%", "100%", "50%", "0%"],
				}}
				className="-translate-x-1/2 -translate-y-1/2 absolute z-10 size-8 transform-gpu blur-sm"
				initial={{ top: 0, left: 0, scale: 3 }}
				transition={{
					duration: 3,
					ease: "linear",
					repeat: Number.POSITIVE_INFINITY,
				}}
			>
				<motion.span
					animate={{
						rotate: ["0deg", "360deg"],
					}}
					className="block size-full transform-gpu rounded-full"
					style={{
						background:
							"linear-gradient(135deg, #3BC4F2, #7A69F9, #F26378, #F5833F)",
					}}
					transition={{
						duration: 3,
						ease: "linear",
						repeat: Number.POSITIVE_INFINITY,
					}}
				/>
			</motion.span>
			<span className="relative z-10 block rounded-full bg-white px-6 py-3 dark:bg-black">
				<motion.span
					animate={{
						backgroundImage: [
							"linear-gradient(90deg, #3BC4F2, #7A69F9, #F26378, #F5833F)",
							"linear-gradient(90deg, #F5833F,#3BC4F2, #7A69F9, #F26378)",
							"linear-gradient(90deg, #F26378, #F5833F,#3BC4F2, #7A69F9)",
							"linear-gradient(90deg, #7A69F9, #F26378, #F5833F,#3BC4F2)",
							"linear-gradient(90deg, #3BC4F2, #7A69F9, #F26378, #F5833F)",
						],
					}}
					className="block transform-gpu bg-clip-text text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter text-transparent"
					transition={{
						duration: 1,
						ease: "linear",
						repeat: Number.POSITIVE_INFINITY,
					}}
				>
					{children}
				</motion.span>
			</span>
		</button>
	);
}
