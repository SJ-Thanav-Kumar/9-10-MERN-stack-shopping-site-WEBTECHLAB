import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="page-container">
          Made by: SJ Thanav Kumar &bull; Sreyas Shyam &bull; Pranav Shreyas TC &bull; SK Tharun Rakesh
        </div>
      </footer>
    </>
  );
}
