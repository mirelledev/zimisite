import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../slices/userSlice";
import { AppDispatch, RootState } from "../store";
import { getUserPosts } from "../slices/postSlice";
import Post from "../components/Post";
import Like from "../components/Like";
import { likePost } from "../slices/postSlice";
import { uploads } from "../utils/config";
import Loading from "../components/Loading";
import { followUser } from "../slices/userSlice";
import { logout } from "../slices/authSlice";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import EditProfileForm from "../components/EditProfileForm";

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { id } = useParams();
  const { user, loading } = useSelector((state: RootState) => state.user);
  const { user: userAuth } = useSelector((state: RootState) => state.auth);
  const { posts, loading: postsLoading } = useSelector(
    (state: RootState) => state.post
  );

  const dispatch: AppDispatch = useDispatch();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    dispatch(getUserById(id));
    dispatch(getUserPosts(id!));
  }, [dispatch, id, user.followers?.length]);

  const temporra = user?.followers?.some((followers) => {
    return followers.userId === userAuth?.id;
  });

  const handleLike = (id: string) => {
    dispatch(likePost(id));
  };

  const handleFollowUser = (id: any) => {
    dispatch(followUser(id));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const getFormattedMonthYear = (dateString: string) => {
    const dataCriacao = new Date(dateString);
    if (!isNaN(dataCriacao.getTime())) {
      return format(dataCriacao, "MMMM 'de' yyyy", { locale: ptBR });
    } else {
      console.error("Data inválida:", dateString);
      return "Data inválida";
    }
  };

  if (loading) {
    return <Loading />;
  }
  if (postsLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-col items-center xl:mt-[70px] mt-[0px] md:justify-center mr-[15px] xl:mr[0px]">
        <div className="border-2 rounded-lg p-3 xl:mr-[0px] xl:m-[16px] bg-white lg:w-[600px] lg:mr-[-40px] xl:w-[800px] md:w-[500px] md:mr-[200px] sm:w-[460px] sm:mr-[100px] w-[400px] ml-[-30px]">
          <div className="bg-slate-200 p-3">
            <img
              src={
                user?.profileImage
                  ? `${uploads}/users/${user?.profileImage}`
                  : "https://static-00.iconduck.com/assets.00/profile-circle-icon-512x512-zxne30hp.png"
              }
              alt="foto de perfil"
              className="w-20 h-20 rounded-full"
            />
          </div>
          {user && (
            <div className=" flex flex-col">
              <div className="flex">
                <p className="ml-3 mt-3 text-2xl font-bold break-words overflow-hidden   ">
                  {user?.name}
                </p>
                {user?._id === userAuth?.id ? (
                  <div className="ml-auto">
                    <button
                      className="bg-green-500 text-white font-bold p-2 rounded-md ml-auto mt-2"
                      onClick={openModal}
                    >
                      editar perfil
                    </button>
                    <button
                      onClick={handleLogout}
                      className="border-b-2 ml-2 p-1 mt-2 font-bold text-red-400 rounded-md"
                    >
                      Sair
                    </button>
                  </div>
                ) : temporra ? (
                  <div className="ml-auto">
                    <button
                      className="bg-slate-600 text-white font-extrabold p-2 rounded-md ml-auto mt-2"
                      onClick={() => handleFollowUser(user?._id)}
                    >
                      seguindo
                    </button>
                  </div>
                ) : (
                  <div className="ml-auto">
                    <button
                      className="bg-green-500 text-white font-extrabold p-2 rounded-md ml-auto mt-2"
                      onClick={() => handleFollowUser(user?._id)}
                    >
                      + seguir
                    </button>
                  </div>
                )}
              </div>
              {isModalOpen && (
                <EditProfileForm
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  user={user}
                />
              )}
              <p className="ml-3 ">@{user?.username}</p>

              <p className="ml-3 mt-2">{user?.bio}</p>

              <div className="flex flex-row">
                <p className="ml-3 mt-2">
                  <span className="font-bold">{user?.followers?.length}</span>{" "}
                  followers
                </p>
                <p className="ml-3 mt-2">
                  <span className="font-bold">{user?.following?.length}</span>{" "}
                  following
                </p>
                <p className="ml-3 mt-2">
                  <span className="font-bold">{posts?.length} </span>postagens
                </p>
              </div>
              <p className="mb-3 mt-3 ml-3">
                Entrou em{" "}
                {user?.createdAt
                  ? getFormattedMonthYear(user?.createdAt)
                  : "Data não disponível"}
              </p>
            </div>
          )}
        </div>

        <p className="mr-auto font-bold mb-10 lg:ml-14 xl:ml-10 md:ml-[20px]">
          posts:
        </p>
        {posts && (
          <div className="flex flex-col items-center md:mr-[200px] sm:mr-[100px] ml-[-30px] xl:mr-[0px] lg:mr-[-20px]">
            <div className="max-w-[900px] lg:ml-10 xl:ml-10">
              {posts.length > 0 &&
                posts.map((post, index) => (
                  <div key={index}>
                    <Post
                      userId={String(post.userId)}
                      post={post}
                      type="post"
                      profilePicture={user?.profileImage}
                    />
                    <Like
                      post={post}
                      userId={userAuth?.id}
                      handleLike={() => handleLike(post._id)}
                      type="post"
                    />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
