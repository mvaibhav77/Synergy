import Loader from "@/components/Loader";
import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import ProfileCards from "@/components/Recommendations/ProfileCards";
import { useToast } from "@/hooks/use-toast";
import { useGetRecommendationsMutation } from "@/slices/recommendApiSlice";
// import { setRecommendations } from "@/slices/recommendSlice";
// import { RootState } from "@/store";
import { MIN_SECTION_HEIGHT } from "@/utils/constants";
import { UserInfo } from "@/utils/types";
import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";

const Recommendations = () => {
  // const dispatch = useDispatch();
  const { toast } = useToast();
  // const { recommendations } = useSelector(
  //   (state: RootState) => state.recommend
  // ) as { recommendations: UserInfo[] };
  const [recommendations, setRecommendations] = useState<UserInfo[]>();

  const [getRecommendations, { isLoading }] = useGetRecommendationsMutation();

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
    <Page>
      <div
        className={`recommendations ${MIN_SECTION_HEIGHT} border-x-[1px] border-gray-500`}
      >
        <PageHeader title="Recommendations" />
        {isLoading ? (
          <Loader />
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 px-6 mt-6">
            {(recommendations || []).length < 1
              ? "No Recommendations for now..."
              : recommendations?.map((user) => (
                  <ProfileCards
                    type={"recommend"}
                    name={user.name}
                    username={user.username}
                    similarity={user.similarityScore}
                    bio={user.bio}
                    avatar={user.avatar}
                    key={user._id}
                  />
                ))}
          </div>
        )}
      </div>
    </Page>
  );
};

export default Recommendations;
