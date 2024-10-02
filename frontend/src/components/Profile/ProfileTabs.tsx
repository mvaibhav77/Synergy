import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ProfileField from "./ProfileField";
import ProfileListField from "./ProfileListField";
import { UserInfo } from "@/utils/types";
import Posts from "../Dashboard/Posts";

type Props = {
  profileData: UserInfo;
  isCurrentUser: boolean;
};

const ProfileTabs = (props: Props) => {
  const googleKey = import.meta.env.VITE_GOOGLE_API_KEY;
  return (
    <Tabs defaultValue="profile">
      {/* Tab List */}
      <TabsList className="grid w-full justify-center items-center grid-cols-3">
        <TabsTrigger value="profile">Basic Profile</TabsTrigger>
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="location">Location</TabsTrigger>
      </TabsList>

      {/* Profile Details */}
      <TabsContent value="profile" className="flex flex-col gap-4">
        <Card className="py-4">
          <CardContent>
            <h2 className="text-2xl font-semibold p-2 text-primary">
              Basic Profile Details
            </h2>
            <div className="other_fields">
              <ProfileField
                title="Email"
                value={props.profileData.email}
                editable={props.isCurrentUser}
              />
              <ProfileField
                title="Username"
                value={props.profileData.username}
                editable={false}
              />
              <ProfileField
                title="Profession"
                value={props.profileData.profession}
                editable={props.isCurrentUser}
              />

              <ProfileField
                title="Location"
                value={props.profileData.location}
                editable={props.isCurrentUser}
              />
              {props.profileData?.skills && (
                <ProfileListField
                  title="Skills"
                  value={props.profileData.skills}
                  editable={props.isCurrentUser}
                />
              )}
              {props.profileData?.interests && (
                <ProfileListField
                  title="Interests"
                  value={props.profileData.interests}
                  editable={props.isCurrentUser}
                />
              )}
            </div>
          </CardContent>
        </Card>
        {/* Connection Preferences */}
        <Card className="py-4 h-fit">
          <CardContent>
            <h2 className="text-2xl mb-2 font-semibold">
              Connection Preferences
            </h2>
            <div className="flex flex-col gap-4">
              <ProfileListField
                title="Connection Interests"
                value={props.profileData.connectionPreferences?.interests}
                editable={props.isCurrentUser}
              />
              {/* <ProfileListField
        title="Connection Skills"
        value={profileData.connectionPreferences?.skills}
        editable={isCurrentUser}
      /> */}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* posts */}
      <TabsContent value="posts">
        <Posts />
      </TabsContent>

      {/* Location */}
      <TabsContent value="location">
        <div className="section-image w-full h-[500px] overflow-x-hidden">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            src={`https://www.google.com/maps/embed/v1/place?q=${props.profileData.location}&key=${googleKey}&zoom=11`}
          ></iframe>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
