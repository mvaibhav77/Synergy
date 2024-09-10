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
import { MultiSelect } from "@/components/MultiSelect";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/slices/usersApiSlice";
import { setCredentials } from "@/slices/authSlice";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const skillOptions = [
  { label: "Mern", value: "Mern" },
  { label: "React.js", value: "React.js" },
  { label: "Node.js", value: "Node.js" },
  { label: "Tailwind", value: "Tailwind" },
  { label: "Shadcn", value: "Shadcn" },
  { label: "Full Stack Development", value: "Full Stack Development" },
];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  bio: z.string().max(200, "Bio must not exceed 200 characters"),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  profession: z.string().min(2, "Profession must be at least 2 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    console.log(userInfo);
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
      skills: [],
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
        description: err?.data?.message || err.error,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  const nextStep = async () => {
    console.log("next");
    // const isValid = await form.trigger();
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-[400px] h-[450px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Create your account. Step {step} of 3
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {step === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
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
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe" {...field} />
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
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
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
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={skillOptions}
                            selected={field.value}
                            onChange={field.onChange}
                            placeholder="Select skills"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profession</FormLabel>
                        <FormControl>
                          <Input placeholder="Developer" {...field} />
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
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit">
                  {isLoading ? "Registering" : "Register"}
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
