import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;
