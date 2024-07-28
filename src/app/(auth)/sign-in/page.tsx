"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signinSchema } from "@/schemas/signinSchema";
import { signIn } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    setIsSubmitting(false);
    if (result?.error) {
      toast.toast({
        title: "Login Failed",
        description: result.error,
        variant: "destructive",
      });
    }
    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    const result = await signIn("google", { redirect: false });
    setIsGoogleSubmitting(false);
    if (result?.error) {
      toast.toast({
        title: "Google Login Failed",
        description: result.error,
        variant: "destructive",
      });
    }
    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-teal-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-gray-800">
            Join Anonymous Messaging
          </h1>
          <p className="mb-4 text-gray-600">
            Sign in to start your anonymous messaging journey
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email/Username"
                      {...field}
                      className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Sign In"}
            </Button>
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleSubmitting}
              className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg mt-4"
            >
              {isGoogleSubmitting ? <Loader2 className="animate-spin" /> : "Sign In with Google"}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already a Member?{" "}
            <Link href="/sign-in" className="text-blue-500 hover:text-blue-800">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
