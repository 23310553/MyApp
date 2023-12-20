import React, { useEffect } from 'react';
//import bg from './components/assets/bg.png';
// import Sidebar from './components/widgets/Sidebar';
import Home from './components/home';
import MyTree from './components/myTree';
import Signup from './components/createUser';
import Login from './components/signInUser';
import { Routes, Route } from 'react-router-dom';
// import Navbar from './components/widgets/Navbar';
// import Layout from './components/widgets/Layout';
import { BrowserRouter as Router } from 'react-router-dom';
// import NoteDetail from './page/NoteDetail';
import ProtectedRoute from './components/widgets/ProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './components/store/userSlice';
import GridExample from './components/myTable';
import NotFound from './components/widgets/NotFound';
// import Sidebar from './components/widgets/Sidebar';


function App() {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  // const user = "asasa";
  console.log(user);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch])


  return (
    <Router>
      <div className="md:overflow-x-auto overflow-x-hidden bg-primary">
        <section>
          <div>
            <Routes>
              <Route element={<ProtectedRoute user={user} />}>
                <Route
                  path="/home"
                  element={
                    < Home />
                  }
                />

                <Route
                  path="/mytree"
                  element={<MyTree />}
                />

                <Route
                  path="/mytable"
                  element={<GridExample />}
                />


              </Route>

              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<Login />} />
              <Route path="*" element={< NotFound />} />
            </Routes>
          </div>
        </section>

      </div>
    </Router>
  );
}

export default App;
