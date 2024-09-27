import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { NavLink, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/slices/usersApiSlice";
import { setCredentials } from "@/slices/authSlice";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  bio: z.string().max(200, "Bio must not exceed 200 characters"),
  profession: z.string().min(2, "Profession must be at least 2 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const RegisterPage: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const [step, setStep] = useState(1);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      username: "",
      bio: "",
      profession: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await register(data).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: err?.data?.message || err.error || "An error occurred",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="flex flex-row justify-center items-center min-h-screen min-w-screen bg-background">
      <div className="side-bg w-full h-screen bg-primary opacity-15 lg:block hidden"></div>
      <div className="authCard w-full flex flex-col gap-6 items-center justify-center lg:px-0 px-4">
        <CardHeader>
          <CardTitle className="lg:text-6xl text-4xl">Register</CardTitle>
        </CardHeader>
        <Card className="lg:max-w-[600px] w-full mx-4 h-full px-4 pb-6">
          <CardHeader>
            <CardDescription className="lg:text-lg">
              Create your account. Step {step} of 3
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col justify-between h-full min-h-[330px] lg:space-y-10"
            >
              <CardContent className="lg:space-y-6 flex flex-col lg:gap-0 gap-6  ">
                {step === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">Name</FormLabel>
                          <FormControl>
                            <Input
                              className="lg:h-12 lg:text-lg lg:px-4 lg:py-2"
                              placeholder="John Doe"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              className="lg:h-12 lg:text-lg lg:px-4 lg:py-2"
                              placeholder="johndoe@email.com"
                              {...field}
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
                          <FormLabel className="text-lg">Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              className="lg:h-12 lg:text-lg lg:px-4 lg:py-2"
                              placeholder="******"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                {step === 2 && (
                  <>
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">Username</FormLabel>
                          <FormControl>
                            <Input
                              className="lg:h-12 lg:text-lg lg:px-4 lg:py-2"
                              placeholder="johndoe"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              className="lg:text-lg lg:px-4 lg:py-2"
                              placeholder="Tell us about yourself"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                {step === 3 && (
                  <>
                    <FormField
                      control={form.control}
                      name="profession"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">Profession</FormLabel>
                          <FormControl>
                            <Input
                              className="lg:h-12 lg:text-lg lg:px-4 lg:py-2"
                              placeholder="Developer"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {step > 1 && (
                  <Button
                    className="lg:h-12 lg:text-lg"
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                  >
                    Previous
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    className="lg:h-12 lg:text-lg"
                    type="button"
                    onClick={nextStep}
                  >
                    Next
                  </Button>
                ) : (
                  <Button className="lg:h-12 lg:text-lg" type="submit">
                    {isLoading ? "Registering" : "Register"}
                  </Button>
                )}
              </CardFooter>
            </form>
          </Form>

          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-muted-foreground">or register with</span>
            <Separator className="flex-1" />
          </div>

          <CardContent className="flex flex-row gap-6 h-[100px] w-full p-0 mt-6">
            {/* GITHUB LOGIN BUTTON */}
            <Button
              variant={"outline"}
              className="text-4xl p-4 h-fit w-full"
              onClick={() => {
                window.location.href = "api/auth/github";
              }}
            >
              <FaGithub />
            </Button>
            <Button
              variant={"outline"}
              className="text-4xl p-4 h-fit w-full"
              onClick={() => {
                window.location.href = "api/auth/linkedin";
              }}
            >
              <FaLinkedin />
            </Button>
          </CardContent>

          <div className="signup-option flex w-full items-center justify-center ml-2 ">
            <div className="msg">
              Already have an account?{" "}
              <NavLink to={"/login"} className={"text-primary"}>
                Login.
              </NavLink>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
