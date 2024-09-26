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
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
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
    <div className="flex flex-row justify-center items-center min-h-screen min-w-screen bg-background">
      <div className="side-bg w-full h-screen bg-primary opacity-15 lg:block hidden"></div>
      <div className="authCard w-full flex flex-col gap-6 items-center justify-center lg:px-0 px-4">
        <CardHeader className="lg:block hidden">
          <CardTitle className="text-6xl">Welcome To Synergy</CardTitle>
        </CardHeader>
        <CardHeader className="lg:hidden block">
          <CardTitle className="text-2xl">
            Welcome back! 👋 <br /> Glad to see you again!
          </CardTitle>
        </CardHeader>
        <Card className="w-full lg:max-w-[600px] h-[550px] px-4 py-6 mx-4 ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="lg:space-y-10"
            >
              <CardContent className="lg:space-y-6 flex flex-col lg:gap-0 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Email</FormLabel>
                      <FormControl>
                        <Input
                          className="lg:h-12 lg:text-lg lg:px-4 lg:py-2"
                          placeholder="example@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Use your email to login.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Password</FormLabel>
                      <FormControl>
                        <Input
                          className="lg:h-12 lg:text-lg lg:px-4 lg:py-2"
                          placeholder="*******"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Enter your password</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="lg:h-12 lg:text-lg" type="submit">
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
                <span className="signup-option ml-2 ">
                  {" "}
                  or{" "}
                  <NavLink to={"/register"} className={"text-primary"}>
                    register.
                  </NavLink>{" "}
                </span>
              </CardContent>
            </form>
          </Form>
          <Separator className="mt-2" />
          <CardContent className="relative h-[100px] w-full p-0">
            {/* GITHUB LOGIN BUTTON */}
            <Button
              className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 flex gap-2 h-12 text-lg px-4"
              onClick={() => {
                window.location.href = "api/auth/github";
              }}
            >
              <GitHubLogoIcon /> Login with GitHub
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;
