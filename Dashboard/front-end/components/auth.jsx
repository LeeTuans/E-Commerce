"use client";

import { useGetMeQuery } from "@/redux/api/userApi";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import CustomSpinner from "./spinner";

function AuthMiddleware({ children }) {
  const pathName = usePathname();
  const router = useRouter();
  const { refetch, data, isLoading } = useGetMeQuery();

  useEffect(() => {
    refetch();
  }, [pathName]);

  if (isLoading) {
    return <CustomSpinner className={"h-10 w-10"} />;
  }

  if (pathName === "/login" && data) {
    router.push("/dashboard");
    return <CustomSpinner className={"h-10 w-10"} />;
  }

  if (pathName !== "/login" && !data) {
    router.push("/login");
    return <CustomSpinner className={"h-10 w-10"} />;
  }

  return children;
}

export default AuthMiddleware;
