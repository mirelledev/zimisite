import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store";
import Navbar from "./components/Navbar";
import { useAuth } from "./hooks/useAuth";
import PostPage from "./Pages/PostPage";
import Profile from "./Pages/Profile";
import { AppDispatch } from "./store";
import { profile } from "./slices/userSlice";
import { useEffect } from "react";
import SearchComponent from "./components/SearchComponent";
import SearchResults from "./Pages/SearchResults";
import FollowingPosts from "./components/FollowingPosts";
import AllPosts from "./components/AllPosts";

function App() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { auth, loading } = useAuth();
  const { user: userState } = useSelector((state: RootState) => state.user);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(profile());
    console.log("aa");
  }, [dispatch]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <div className="flex justify-center min-h-screen bg-gray-100 overflow-x-hidden">
        <BrowserRouter>
          <div className={user ? "flex w-full max-w-[1440px]" : ""}>
            <div className={user ? "w-[250px] p-4 " : ""}>
              {user ? <Navbar userState={userState} /> : null}
            </div>

            <div className="flex-1 p-4">
              <Routes>
                <Route
                  path="/register"
                  element={!auth ? <Register /> : <Navigate to="/" />}
                />
                <Route
                  path="/login"
                  element={!auth ? <Login /> : <Navigate to="/" />}
                />

                <Route
                  path="/profile"
                  element={auth ? <Profile /> : <Navigate to="/login" />}
                />
                <Route
                  path="/posts/:id"
                  element={auth ? <PostPage /> : <Navigate to="/login" />}
                />
                <Route
                  path="/users/:id"
                  element={auth ? <Profile /> : <Navigate to="/login" />}
                />
                <Route
                  path="/pesquisar"
                  element={
                    auth ? <SearchComponent /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="/search"
                  element={auth ? <SearchResults /> : <Navigate to="/login" />}
                />
                <Route
                  path="/following"
                  element={auth ? <FollowingPosts /> : <Navigate to="/login" />}
                />
                <Route
                  path="/"
                  element={auth ? <AllPosts /> : <Navigate to="/login" />}
                />
              </Routes>
            </div>

            {user ? (
              <div className="w-[300px] p-4 hidden lg:block mt-10">
                <div className="bg-white p-4 rounded-lg shadow hidden lg:block">
                  <h2 className="font-bold">Informações Adicionais</h2>
                  <p>
                    Esse site está em fase de desenvolvimento, em breve terá
                    mais funções
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
