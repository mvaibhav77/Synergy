import { Button } from "@/components/ui/button";
import { CONTENT_HEIGHT } from "@/utils/constants";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className={`flex flex-col ${CONTENT_HEIGHT} items-center mx-4 justify-center bg-background text-foreground relative overflow-hidden`}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-secondary/20 rounded-full blur-2xl"></div>
      </div>

      <div className="text-center space-y-4 max-w-3xl px-4 animate-fade-in">
        {/* <h1 className="lg:text-7xl text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome to <span className="text-primary">Synergy</span>
        </h1> */}
        <h1 className="text-4xl md:text-4xl lg:text-7xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
        Welcome to Synergy
      </h1>
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
          Connect, collaborate and create meaningful relationships in a vibrant community built for professionals like you.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
          <Button
            size="lg" 
            className="text-lg "
            onClick={() => navigate("/login")}
          >
            Log In
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
