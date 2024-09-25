import { useEffect } from "react";
import SearchComponent from "../components/SearchComponent";
import { useQuery } from "../hooks/useQuery";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { searchPostsAndUsers } from "../slices/postSlice";
import { likePost } from "../slices/postSlice";
import Loading from "../components/Loading";
import Post from "../components/Post";
import Like from "../components/Like";

const SearchResults = () => {
  const query = useQuery();
  const search = query.get("q");
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { posts, loading, users } = useSelector(
    (state: RootState) => state.post
  );

  useEffect(() => {
    if (search) {
      dispatch(searchPostsAndUsers(search));
      console.log(posts);
      console.log(users);
    }
  }, [dispatch, search]);

  const handleLike = (id: string) => {
    dispatch(likePost(id));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center xl:ml-[0px] xl:mr-[0px] ml-[-20px]">
      <div className="xl:mr-[0px] xl:ml-[0px] sm:ml-[80px] md:mr-[-100px]">
        <SearchComponent />
      </div>
      <div className="xl:ml-[0px] xl:mr-0 ml-[-200px]">
        <h2>
          Você está buscando por : <span className="font-bold">{search}</span>
        </h2>
      </div>
      <div className="xl:w-[900px] p-8 xl:mr-[0px] md:mr-[190px] sm:mr-[140px] ml-[-250px] xl:ml-[0px] lg:ml-12 md:ml-[90px] sm:ml-[40px]">
        {posts && posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={index}>
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
          <div className="xl:text-center xl:ml-[0px] xl:mr-[0px] mr-[90px]">
            <p className="xl:text-center font-bold text-2xl xl:mr-[0px] xl:ml-[0px]">
              Não foram encontrado resultados
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
