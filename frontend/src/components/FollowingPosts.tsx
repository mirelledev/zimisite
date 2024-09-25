import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { AppDispatch, RootState } from "../store";
import { likePost } from "../slices/postSlice";
import Post from "./Post";

import Like from "./Like";

import HomeNavBar from "./HomeNavBar";
import { getFollowingUsersPosts } from "../slices/postSlice";
import Loading from "./Loading";

const FollowingPosts = () => {
  const dispatch: AppDispatch = useDispatch();
  const { posts, loading } = useSelector((state: RootState) => state.post);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getFollowingUsersPosts());
    console.log(posts);
  }, [dispatch]);

  const handleLike = (id: string) => {
    dispatch(likePost(id));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col justify-center items-center xl:mr-[0px] xl:ml-[10px] md:mr-[100px] sm:mr-[100px]  mr-[100px]">
      <div className="flex-col justify-center items-center lg:max-w-[900px] md:max-w-[600px] w-300 xl:p-8 md:p-8">
        <HomeNavBar />
        {posts && posts?.length > 0 ? (
          posts.map((post, index) => (
            <div key={index}>
              <Post
                post={post}
                type="post"
                userId={user?.id}
                profilePicture={post?.userProfilePicture}
              />
              <Like
                type="post"
                userId={user?.id}
                handleLike={() => handleLike(post._id)}
                post={post}
              />
            </div>
          ))
        ) : (
          <div className="bg-white p-4 mt-4 rounded-md">
            <p className="text-center ">
              Siga pessoas para aparecer postagens na aba{" "}
              <span className="font-bold">Following</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowingPosts;
