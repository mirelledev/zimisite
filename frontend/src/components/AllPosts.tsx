import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllPosts } from "../slices/postSlice";
import { AppDispatch, RootState } from "../store";
import Post from "../components/Post";
import Like from "../components/Like";
import { likePost } from "../slices/postSlice";

import HomeNavBar from "./HomeNavBar";
import Loading from "./Loading";

const AllPosts = () => {
  const dispatch: AppDispatch = useDispatch();
  const { posts, loading } = useSelector((state: RootState) => state.post);
  const { user } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    dispatch(getAllPosts());
    console.log(user);
  }, [dispatch]);

  const handleLike = (id: string) => {
    dispatch(likePost(id));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col justify-center items-center xl:mr-[0px] xl:ml-[10px] md:mr-[140px] sm:mr-[100px]  mr-[100px] ">
      <div className="flex-col justify-center items-center lg:max-w-[900px] md:max-w-[600px] w-300 xl:p-8 md:p-8 ">
        <HomeNavBar />
        {posts && posts.length > 0 ? (
          posts.map((post, index) => (
            <div className="" key={index}>
              <Post
                post={post}
                type="post"
                userId={user?.id}
                profilePicture={post?.userProfilePicture}
              />

              <Like
                post={post}
                userId={user?.id}
                handleLike={() => handleLike(post._id)}
                type="post"
              />
            </div>
          ))
        ) : (
          <p>Ainda não há posts.</p>
        )}
      </div>
    </div>
  );
};

export default AllPosts;
