import React from 'react';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Router,
  RouterProvider,
} from "react-router-dom";

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Admin from './pages/admin/Admin';
import Movies from './pages/admin/movies/Movies';
import AddMovie from './pages/admin/movies/AddMovie';
import EditMovie from './pages/admin/movies/EditMovie';
import DeleteMovie from './pages/admin/movies/DeleteMovie';
import Showtimes from './pages/admin/showtimes/Showtimes';
import AddShowtimes from './pages/admin/showtimes/AddShowtimes';
import EditShowtimes from './pages/admin/showtimes/EditShowtimes';
import DeleteShowtimes from './pages/admin/showtimes/DeleteShowtimes';
import Theaters from './pages/admin/theaters/Theaters';
import MoviesDetail from './pages/MoviesDetail';
import BuyTicket from './pages/BuyTicket';
import Profile from './pages/Profile';
import Topup from './pages/Topup';

// Create browser router
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route 
        path    = "/" 
        element = {<Landing />}
      />
      <Route 
        path    = "login" 
        element = {<Login />}
      />
      <Route
        path    = "register"
        element = {<Register />}
      />   
      <Route
        path    = "forgot-password"
        element = {<ForgotPassword />}
      /> 
      <Route
        path    = "home"
        element = {<Home/>}
      />
      <Route
        path    = "admin"
        element = {<Admin/> }
      />
      <Route
        path    = "admin/movies"
        element = {<Movies />}
      />
      <Route
        path    = "admin/movies/add-movie"
        element = {<AddMovie />}
      />
      <Route
        path    = "admin/movies/edit-movie/:id"
        element = {<EditMovie />}      
      />
      <Route 
        path    = "admin/movies/delete-movie/:id"
        element = {<DeleteMovie />}
      />
      <Route
        path    = "admin/showtimes"
        element = {<Showtimes/>}
      />      
      <Route
        path    = "admin/showtimes/add-showtime"
        element = {<AddShowtimes/>}
      />
      <Route
        path    = "admin/showtimes/edit-showtime/:id"
        element = {<EditShowtimes />}
      />
      <Route
        path    = "admin/showtimes/delete-showtime/:id"
        element = {<DeleteShowtimes />}
      />
      <Route
        path    = "admin/theaters"
        element = {<Theaters/>}
      />
      <Route
        path    = "movie/:id"
        element = {<MoviesDetail/>}
      />
      <Route
        path    = "buy-ticket/:id"
        element = {<BuyTicket/>}
      />
      <Route
        path    = "profile"
        element = {<Profile/>}
      />
      <Route
        path    = "topup"
        element = {<Topup/>}
      />                   
    </>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
