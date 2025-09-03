import Image from "next/image";
import loader from "@/assets/loader.gif";

const LoadingPage = () => {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				width: "100vw",
			}}
		>
			<Image
				src={loader}
				className="w-auto h-auto"
				height={150}
				width={150}
				alt="Loading..."
				unoptimized
			/>
		</div>
	);
};

export default LoadingPage;
