import { MIN_SECTION_HEIGHT } from "@/utils/constants";
import { Link, useNavigate } from "react-router-dom";
// import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useEffect, useState } from "react";
import { UserInfo } from "@/utils/types";
import { useGetRecommendationsMutation } from "@/slices/recommendApiSlice";
import { useToast } from "@/hooks/use-toast";

const Sidemenu = () => {
  const [recommendations, setRecommendations] = useState<UserInfo[]>([]);
  const [getRecommendations, { isLoading }] = useGetRecommendationsMutation();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!recommendations || recommendations.length == 0) {
      getRecommendations({})
        .unwrap()
        .then((res: UserInfo[]) => {
          // dispatch(setRecommendations(res));
          setRecommendations(res);
        })
        .catch((err) => {
          toast({ title: "Error", description: err.message });
        });
    }
  }, []);

  return (
    <div
      className={`${MIN_SECTION_HEIGHT} lg:block hidden h-[calc(100vh-100px)] w-full border-l border-border p-6 bg-background`}
    >
      <div className="flex flex-col h-full">
        {/* Recommendation Suggestion Card */}
        <div className="flex-1">
          <Card className="w-full border-border">
            <CardHeader className="pb-3">
              <h2 className="text-2xl font-semibold tracking-tight">
                Latest Recommendations
              </h2>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="animate-pulse flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-full" />
                      <div className="flex flex-col gap-2 w-full">
                        <div className="h-4 bg-muted rounded w-3/5" />
                        <div className="h-3 bg-muted rounded w-2/5" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {recommendations.slice(0, 4).map((recommendation) => (
                    <div
                      key={recommendation.username}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-muted transition bg-muted dark:bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={recommendation.avatar || "https://github.com/shadcn.png"}
                          alt={`${recommendation.name}'s avatar`}
                          className="w-12 h-12 rounded-full object-cover border border-border"
                        />
                        <div>
                          <h4 className="text-base font-semibold leading-none tracking-tight mb-1">
                            {recommendation.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">@{recommendation.username}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="default" className="font-medium">
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-end mt-6">
                <Button
                  variant="link"
                  onClick={() => navigate("/recommendations")}
                  className="font-medium text-base px-0"
                >
                  See more
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer with Navigation Links */}
        <div className="mt-auto pb-8">
          <nav className="mb-4">
            <ul className="flex flex-wrap justify-center gap-6 text-sm font-medium">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/messages" className="text-muted-foreground hover:text-primary transition-colors">
                Messages
              </Link>
              <Link to="/settings" className="text-muted-foreground hover:text-primary transition-colors">
                Settings
              </Link>
            </ul>
          </nav>
          <div className="text-muted-foreground/60 text-sm text-center font-medium">
            <p>Synergy &copy; 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidemenu;
