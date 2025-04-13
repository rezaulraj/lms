import {Link} from "react-router-dom"

const MyCourses = () => {
  return (
    <div className="grid sm:grid-cols-12  gap-4 ">
      <div className="sm:col-span-4 bg-coching-nav_color p-2">
        <Link to={"/course/content"}>
          <img
            src={"../public/images/math.jpg"}
            className="w-full h-full object-cover"
            alt=""
          />
        </Link>
      </div>
      <div className="sm:col-span-4 bg-coching-nav_color p-2">
        <Link to={"/course/content"}>
          <img
            src={"../public/images/physic.jpg"}
            className="w-full h-full object-cover"
            alt=""
          />
        </Link>
      </div>
      <div className="sm:col-span-4 bg-coching-nav_color p-2">
        <Link to={"/course/content"}>
          <img
            src={"../public/images/physic.jpg"}
            className="w-full h-full object-cover"
            alt=""
          />
        </Link>
      </div>
      <div className="sm:col-span-4 bg-coching-nav_color p-2">
        <Link to={"/course/content"}>
          <img
            src={"../public/images/physic.jpg"}
            className="w-full h-full object-cover"
            alt=""
          />
        </Link>
      </div>
      <div className="sm:col-span-4 bg-coching-nav_color p-2">
        <Link to={"/course/content"}>
          <img
            src={"../public/images/physic.jpg"}
            className="w-full h-full object-cover"
            alt=""
          />
        </Link>
      </div>
    </div>
  );
};

export default MyCourses;
