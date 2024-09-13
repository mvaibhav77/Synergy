"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { setConnections, setCredentials } from "@/slices/authSlice";
import {
  useGetUserByIdMutation,
  useLoginMutation,
} from "@/slices/usersApiSlice";
import { RootState } from "@/store";
import { UserInfo } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  password: z.string().min(1, { message: "This field has to be filled." }),
});

const LoginScreen = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    console.log(userInfo);
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [getUser] = useGetUserByIdMutation();
  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      // Log the user in
      const response: UserInfo = await login(data).unwrap();

      // Dispatch user credentials to Redux
      dispatch(setCredentials({ ...response }));

      // Initialize an array to hold connected requests
      const fetchedRequests: UserInfo[] = [];

      // Fetch connection data if the user has any connections
      if (response.connections) {
        for (const connection of response.connections) {
          if (connection.status === "connected") {
            try {
              const userData = await getUser(connection.userId).unwrap();
              if (userData) {
                fetchedRequests.push(userData);
              }
            } catch (error) {
              console.error(`Error fetching user ${connection.userId}:`, error);
              toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch user data.",
                action: (
                  <ToastAction altText="Try again">Try again</ToastAction>
                ),
              });
            }
          }
        }
      }

      // Dispatch the fetched connected users
      dispatch(setConnections(fetchedRequests));

      // Navigate to the homepage after successful login
      navigate("/");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Error handling for login failure
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: err?.data?.message || err.error || "An error occurred",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full lg:w-[400px] h-[450px] px-2 mx-4">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>Use your email to login.</FormDescription>
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
                      <Input placeholder="*******" type="password" {...field} />
                    </FormControl>
                    <FormDescription>Enter your password</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </CardContent>
          </form>
        </Form>
        <Separator className="mt-2" />
        <CardContent className="relative h-[85px] w-full p-0">
          {/* GITHUB LOGIN BUTTON */}
          <Button
            className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 flex gap-2"
            onClick={() => {
              window.location.href = "api/auth/github";
            }}
          >
            <GitHubLogoIcon /> Login with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
