import ConnectSocials from './ConnectSocials'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { UserInfo } from '@/utils/types'

type Props =  {
  userInfo : UserInfo;
}

const Socials = (props: Props) => {
  return (
    <div className="socialApps mt-8 flex flex-col items-center">
    <h3 className="mb-2 p-2">
      Connected Social Apps
    </h3>
    <div className="flex gap-4">
      {props.userInfo.socialMedia?.map((platform) => (
        <button key={platform.platform}>
          {platform.platform === "github" && (
            <FaGithub className="text-5xl " />
          )}
          {platform.platform === "linkedin" && (
            <FaLinkedin className="text-5xl" />
          )}
          {platform.platform === "twitter" && (
            <FaTwitter className="text-5xl" />
          )}
        </button>
      ))}
      {props.userInfo.socialMedia &&
        props.userInfo.socialMedia?.length < 3 && (
          <ConnectSocials
          // socials={profileData.socialMedia}
          />
        )}
    </div>
  </div>
  )
}

export default Socials;
