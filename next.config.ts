import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options */
    images: {
	remotePatterns: [
	    {
		hostname: "ik.imagekit.io",
		protocol: "https"
	    
	    }
	]	
    },
};

export default nextConfig;
