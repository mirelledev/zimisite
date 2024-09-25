import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { uploads } from "../utils/config";

type Props = {
  comment?: string;
  userId?: string;
  username?: string;
  userRealName?: string;
  userProfilePicture?: string;
};

const CommentPost = ({
  comment,
  userId,
  username,
  userRealName,
  userProfilePicture,
}: Props) => {
  const navigate = useNavigate();

  return (
    <div
      className={
        "rounded-lg p-3 flex items-start border-b-2 bg-white cursor-pointer xl:w-full lg:w-[600px] md:w-[500px] sm:w-[450px] w-[340px]"
      }
    >
      <img
        src={
          userProfilePicture
            ? `${uploads}/users/${userProfilePicture}`
            : "https://static-00.iconduck.com/assets.00/profile-circle-icon-512x512-zxne30hp.png"
        }
        alt="foto de perfil"
        className="w-12 h-12 rounded-full"
      />

      <div className="flex flex-col flex-1 p-2">
        <div className="flex items-center">
          <span className={"font-extrabold hover:underline cursor-pointer"}>
            <Link to={`/users/${userId}`}>{userRealName}</Link>
          </span>
        </div>

        <span className={"text-slate-800 cursor-pointer "}>
          <Link to={`/users/${userId}`}>@{username}</Link>
        </span>
        <p
          className={
            "mt-2 text-left cursor-pointer break-words overflow-hidden lg:w-[500px] xl:w-[650px] md:w-[400px] sm:w-[350px] w-[200px]"
          }
          onClick={() => navigate(`/posts/${userId}`)}
        >
          {comment}
        </p>
      </div>
    </div>
  );
};

export default CommentPost;
