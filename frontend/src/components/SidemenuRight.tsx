import { MIN_SECTION_HEIGHT } from "@/utils/constants";
import { Link, useNavigate } from "react-router-dom";
// import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useEffect, useState } from "react";
import { UserInfo } from "@/utils/types";
import { useGetRecommendationsMutation } from "@/slices/recommendApiSlice";
import { useToast } from "@/hooks/use-toast";
import Loader from "./Loader";

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
      className={`${MIN_SECTION_HEIGHT} lg:block hidden h-full w-full border-l-[1px] border-white-700 p-4`}
    >
      <div className="flex flex-col gap-12 h-full w-full items-center">
        {/* skeleton */}
        {/* <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[450px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div> */}

        {/* recommendation suggestin card */}
        <Card className="w-full">
          <CardTitle>
            <CardHeader className="text-primary">
              Latest Recommendations
            </CardHeader>
          </CardTitle>
          <CardContent>
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  {/* Avatar */}
                  {recommendations.slice(0, 4).map((recommendation) => (
                    <div className="flex items-center justify-between p-2  ">
                      <div className="flex items-center">
                        <img
                          src={
                            recommendation.avatar ||
                            "https://github.com/shadcn.png"
                          }
                          alt={`${recommendation.name}'s avatar`}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h4 className="text-lg font-semibold">
                            {recommendation.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {recommendation.username}
                          </p>
                        </div>
                      </div>

                      {/* Approve/Reject buttons */}
                      <Button onClick={() => {}}>Connect</Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant={"link"}
                  onClick={() => navigate("/recommendations")}
                  className="text-lg text-inherit mt-2"
                >
                  See more
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer with navigation links */}
        <div className="flex flex-col items-center mt-8 w-full">
          <nav className="px-4">
            <ul className="flex flex-row flex-wrap gap-4">
              <Button variant={"link"}>
                <Link to="/" className="text-link hoverunderline0">
                  Home
                </Link>
              </Button>
              <Button variant={"link"}>
                <Link to="/messages" className="text-link hover:underline">
                  Messages
                </Link>
              </Button>
              <Button variant={"link"}>
                <Link to="/settings" className="text-link  hover:underline">
                  Settings
                </Link>
              </Button>
              {/* Add more navigation links as needed */}
            </ul>
          </nav>

          {/* Company Info */}
          <div className="flex flex-row gap-2 mt-4 px-4 text-gray-500 ">
            <p>Synergy</p>
            <p>&copy; 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidemenu;
