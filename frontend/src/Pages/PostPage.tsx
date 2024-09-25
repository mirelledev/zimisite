import { useParams } from "react-router-dom";
import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { getPostById } from "../slices/postSlice";
import Post from "../components/Post";
import Like from "../components/Like";
import { likePost } from "../slices/postSlice";
import CommentPost from "../components/CommentPost";
import { commentPost } from "../slices/postSlice";
import Loading from "../components/Loading";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const PostPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { post, loading } = useSelector((state: RootState) => state.post);
  const { user } = useSelector((state: RootState) => state.auth);
  const [commentText, setCommentText] = useState<string>("");
  const [likeSuccess, setLikeSuccess] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getPostById(id!));
  }, [dispatch, id]);

  useEffect(() => {
    if (likeSuccess) {
      dispatch(getPostById(id!));

      setLikeSuccess(false);
    }
  }, [likeSuccess, dispatch, id]);

  const handleLike = (id: string) => {
    dispatch(likePost(id)).then(() => {
      setLikeSuccess(true);
    });
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (commentText && id) {
      const commentData = {
        comment: commentText,
        id: id,
        username: user.username,
        userRealName: user.userRealName,
      };
      dispatch(commentPost(commentData));
      setCommentText("");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center lg:ml-[10px] xl:mr-[0px] ml-[-130px] xl:ml-[0px] mr-[15px]  ">
      <button
        className="mr-auto bg-slate-100 p-2 "
        onClick={() => navigate(-2)}
      >
        <IoIosArrowBack className=" w-8 h-8 rounded-full text-white bg-slate-400" />
      </button>
      <div className="w-full max-w-[900px] p-8">
        {post && (
          <>
            <Post
              post={post}
              type="postpage"
              profilePicture={post.userProfilePicture}
            />
            <Like
              post={post}
              userId={String(user.id)}
              handleLike={() => handleLike(post._id)}
              type="postpage"
            />
            <form className="flex flex-row" onSubmit={handleSubmit}>
              <textarea
                name="comment"
                className="resize-none xl:w-[800px] md:w-[410px] lg:w-[510px] w-[250px] h-[40px] p-2 rounded-md  focus:outline-none"
                placeholder="Adicione um comentário."
                maxLength={200}
                value={commentText}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setCommentText(e.target.value)
                }
              ></textarea>
              <button className=" bg-green-500 p-2 rounded-md text-white font-bold">
                Comentar
              </button>
            </form>
            <p className="font-extrabold ml-1 mb-1 mt-2">comentários</p>
            <div>
              {post?.comments &&
                post?.comments.map((comment, index) => (
                  <div key={index}>
                    <CommentPost
                      comment={comment?.comment}
                      userId={String(comment?.userId)}
                      username={comment?.username}
                      userRealName={comment?.userRealName}
                      userProfilePicture={comment?.userProfilePicture}
                    />
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostPage;
