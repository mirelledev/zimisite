import { BsHeart, BsHeartFill } from "react-icons/bs";
import { IPost } from "../interfaces";
import { FaRegCommentDots } from "react-icons/fa";
import { T } from "../interfaces";
import { useNavigate } from "react-router-dom";

type Props = {
  post?: IPost;
  comment?: T;
  userId?: string;
  handleLike?: (postId: any) => void;
  type: "comment" | "post" | "postpage";
};

const Like = ({ post, userId, handleLike, type }: Props) => {
  const likesArray = Array.isArray(post?.likes) ? post.likes : [];
  const navigate = useNavigate();

  const userLiked = likesArray.some((like) => String(like._id) === userId);

  return (
    <div
      className={
        type === "post"
          ? "flex  bg-white border-b-2 "
          : "flex mb-1 bg-white rounded-lg-2 lg:w-[600px] xl:w-[835px] md:w-[500px] sm:w-[450px] w-[340px]"
      }
    >
      {userLiked ? (
        <BsHeartFill
          className="mt-2.5 ml-3 cursor-pointer"
          onClick={handleLike}
        />
      ) : (
        <BsHeart className="mt-2.5 ml-3 cursor-pointer" onClick={handleLike} />
      )}

      <p className="ml-5 mb-2 mt-1.5">{likesArray.length}</p>
      <div className="flex flex-row mt-2 ml-5">
        {type === "post" || "postpage" ? (
          <>
            <FaRegCommentDots
              className="mr-2 size-5 cursor-pointer"
              onClick={() => navigate(`/posts/${post?._id}`)}
            />
            <p
              className="mt-[-2px] cursor-pointer"
              onClick={() => navigate(`/posts/${post?._id}`)}
            >
              {post?.comments?.length}
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
};
export default Like;
