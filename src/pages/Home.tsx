import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div>
        <Link to="/">
          <button className="border-2 border-red-700 bg-orange-600 rounded-sm px-4 py-2 mx-2 hover:bg-lime-600">
            Home
          </button>
        </Link>
        <Link
          className="border-2 border-red-700 bg-orange-600 rounded-sm px-4 py-2 mx-2 hover:bg-lime-600"
          to="/dashboard"
        >
          Dashboard
        </Link>
        <Link
          className="border-2 border-red-700 bg-orange-600 rounded-sm px-4 py-2 mx-2 hover:bg-lime-600"
          to="/signup"
        >
          Sign Up
        </Link>
        <Link
          className="border-2 border-red-700 bg-orange-600 rounded-sm px-4 py-2 mx-2 hover:bg-lime-600"
          to="/login"
        >
          Login
        </Link>
        <Link
          className="border-2 border-red-700 bg-orange-600 rounded-sm px-4 py-2 mx-2 hover:bg-lime-600"
          to="/partner"
        >
          Link your partner!
        </Link>
      </div>
    </>
  );
};

export default Home;
