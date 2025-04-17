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
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";


import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  password: z.string().min(1, { message: "This field has to be filled." }),
});

const LoginScreen: React.FC = () => {
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
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-16 dark:bg-transparent">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
          <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
            <div className="text-center">
              <Link to="/" className="mx-auto block w-fit">
                <img src="../../logo-synergy.png" alt="Logo" className="h-8 w-8 mr-2" />
              </Link>
              <h1 className="mb-1 mt-4 text-xl font-semibold">Sign In to Synergy</h1>
              <p className="text-sm">Welcome back! Sign in to continue</p>
            </div>

            <div className="mt-6 space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Email</FormLabel>
                    <FormControl>
                      <Input
                        className=""
                        placeholder="Email Address"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-0.5">

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-title text-sm justify-between flex">Password
                        <Button asChild variant="link" size="sm">
                          <a href="#" className="link intent-info variant-ghost text-sm">
                            Forgot your Password ?
                          </a>
                        </Button>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="input sz-md variant-mixed"
                          placeholder="Password"
                          type="password"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

              <Button className="w-full"
                type="submit"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </div>

            <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <hr className="border-dashed" />
              <span className="text-muted-foreground text-xs">Or continue With</span>
              <hr className="border-dashed" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => {
                  window.location.href = "api/auth/github";
                }}
                className="space-x-2" type="button" variant="outline">
                <FaGithub />
                <span>Github</span>
              </Button>
              <Button
                onClick={() => {
                  window.location.href = "api/auth/linkedin";
                }}
                className="space-x-2" type="button" variant="outline">
                <FaLinkedin />
                <span >Linkedin</span>
              </Button>
            </div>
          </div>

          <div className="p-3">
            <p className="text-accent-foreground text-center text-sm">
              Don't have an account ?
              <Button asChild variant="link" className="px-2">
                <a href="/register">Create account</a>
              </Button>
            </p>
          </div>
        </form>
      </Form>

    </section>
  );
};

export default LoginScreen;
