import React, { useEffect, useRef, useState } from "react";

import {
BrowserRouter,
Routes,
Route,
useLocation
}
from "react-router-dom";

import HomePage from "./components/HomePage.jsx";
import Login from "./components/login.jsx";
import Signup from "./components/signup.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ForgotPassword from "./components/forgot-password.jsx";
import ResetPassword from "./components/reset-password.jsx";
import GithubCallback from "./components/github-callback.jsx";

function AppRoutes() {
const location = useLocation();
const [isRouteLoading, setIsRouteLoading] = useState(true);
const timerRef = useRef(null);

useEffect(() => {
setIsRouteLoading(true);

if (timerRef.current) {
clearTimeout(timerRef.current);
}

timerRef.current = window.setTimeout(() => {
setIsRouteLoading(false);
}, 820);

return () => {
if (timerRef.current) {
clearTimeout(timerRef.current);
}
};
}, [location.pathname, location.search]);

return (
<>
<div className={`route-loader ${isRouteLoading ? "is-visible" : ""}`}>
<div className="route-loader-backdrop" />
<div className="route-loader-core">
<div className="route-loader-rings">
<span className="route-loader-ring route-loader-ring-a" />
<span className="route-loader-ring route-loader-ring-b" />
<span className="route-loader-ring route-loader-ring-c" />
</div>
<span className="route-loader-text">Loading page</span>
</div>
</div>

<div className={`route-stage ${isRouteLoading ? "is-loading" : "is-ready"}`}>
<Routes>

<Route
path="/"
element={<HomePage/>}
/>

<Route
path="/login"
element={<Login/>}
/>

<Route
path="/signup"
element={<Signup/>}
/>

<Route
path="/forgot-password"
element={<ForgotPassword/>}
/>

<Route
path="/reset-password"
element={<ResetPassword/>}
/>

<Route
path="/auth/github/callback"
element={<GithubCallback/>}
/>

<Route
path="/dashboard"
element={<Dashboard/>}
/>

</Routes>
</div>
</>
);
}

function App(){
return(

<BrowserRouter>
<AppRoutes/>
</BrowserRouter>

);

}

export default App;
