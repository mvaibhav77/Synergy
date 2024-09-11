import PageHeader from "@/components/PageHeader";
import ProfileCards from "@/components/Recommendations/ProfileCards";
import { useToast } from "@/hooks/use-toast";
import { useGetRecommendationsMutation } from "@/slices/recommendApiSlice";
import { setRecommendations } from "@/slices/recommendSlice";
import { RootState } from "@/store";
import { MIN_SECTION_HEIGHT } from "@/utils/constants";
import { UserInfo } from "@/utils/types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Recommendations = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { recommendations } = useSelector(
    (state: RootState) => state.recommend
  ) as { recommendations: UserInfo[] };

  const [getRecommendations, { isLoading }] = useGetRecommendationsMutation();

  useEffect(() => {
    if (!recommendations || recommendations.length == 0) {
      getRecommendations({})
        .unwrap()
        .then((res) => {
          dispatch(setRecommendations(res));
          console.log(res);
        })
        .catch((err) => {
          toast({ title: "Error", description: err.message });
        });
    }
  }, []);

  return (
    <div
      className={`recommendations ${MIN_SECTION_HEIGHT} border-x-[1px] border-gray-500`}
    >
      <PageHeader title="Recommendations" />
      {isLoading ? (
        <>Please wait while we fetch some things</>
      ) : (
        <div className="grid grid-cols-3 gap-6 px-6 mt-6">
          {recommendations.map((user) => (
            <ProfileCards
              name={user.name}
              username={user.username}
              similarity={user.similarityScore}
              bio={user.bio}
              avatar={user.avatar}
            />
            // <div key={user.id} className="recommendation-card">
            //   <img
            //     src={user.avatar || "https://github.com/shadcn/avatar.png"}
            //     alt={user.name}
            //     className="avatar"
            //   />
            //   <div className="user-info">
            //     <h4>{user.name}</h4>
            //     <p>@{user.username}</p>
            //     <p>{user.bio}</p>
            //   </div>
            // </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
