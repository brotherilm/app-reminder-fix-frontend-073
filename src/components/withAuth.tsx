// src/components/withAuth.tsx

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuthComponent(props: P) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Check if we're on the client side
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth/login");
        }
      }
    }, [router]);

    if (!isAuthenticated) {
      return null; // Or you could return a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
}
