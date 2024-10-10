import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";

const dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlparams = new URLSearchParams(location.search);
    const tabFromUrl = urlparams.get("tab");
    setTab(tabFromUrl);
  }, [location.search]);
  console.log(tab);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* side bar */}
        <DashSidebar />
      </div>
      {/* right side */}
      {tab === "profile" && <DashProfile />}
    </div>
  );
};

export default dashboard;
