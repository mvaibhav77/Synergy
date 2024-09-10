import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function   LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Welcome to Synergy
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Connect with friends and the world around you on Synergy.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/login")}>
            Log In
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
