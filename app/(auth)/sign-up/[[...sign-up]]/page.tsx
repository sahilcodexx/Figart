"use client";

import { useEffect, useRef } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SignUpPage, Testimonial } from "@/components/ui/sign-up";
import { toast } from "sonner";

const testimonials: Testimonial[] = [];

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const email = new URLSearchParams(window.location.search).get("email");
    if (emailInputRef.current && email && !emailInputRef.current.value) {
      emailInputRef.current.value = email.slice(0, 254);
    }
  }, []);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded) return;

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signUp.create({ emailAddress: email, password });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else if (result.status === "missing_requirements") {
        // Email verification required
        toast.success("Check your email for a verification link");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch {
      toast.error("Failed to sign up with Google");
    }
  };

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  return (
    <SignUpPage
      heroImageSrc="/signupbanner.jpg"
      testimonials={testimonials}
      emailInputRef={emailInputRef}
      onSignUp={handleSignUp}
      onGoogleSignUp={handleGoogleSignUp}
      onSignIn={handleSignIn}
    />
  );
};

export default SignUp;
