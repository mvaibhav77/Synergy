import { Button } from "@/components/ui/button";
import { MIN_SECTION_HEIGHT } from "@/utils/constants";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className={`flex flex-col ${MIN_SECTION_HEIGHT} items-center mx-4 justify-center min-h-screen bg-background text-foreground`}
    >
      <div className="text-center space-y-6">
        <h1 className="lg:text-6xl text-2xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Welcome to <span className="text-primary">Synergy</span>
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-2xl/relaxed lg:text-base/relaxed xl:text-2xl/relaxed">
          Connect with friends and the world around you on Synergy.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="text-xl p-8"
            onClick={() => navigate("/login")}
          >
            Log In
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-xl py-8"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
