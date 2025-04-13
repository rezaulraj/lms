import React, { useState } from "react";

const Blog = () => {
  const [title, setTitle] = useState("");
  
  return (
    <div className="container md:px-0 m-auto pt-20 pb-4">
      <div className="flex items-center justify-between gap-6 border-b-2 border-gray-950 py-4">
        <h1 className="text-4xl font-bold">Crowning English Blog</h1>
        <div className="underline text-red-600">Leatest News</div>
      </div>
      {/* image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <div className="">
          <img
            src="https://miro.medium.com/v2/resize:fit:4800/format:webp/1*UL5BbmV_kEo1elj99S7KHQ.jpeg"
            alt=""
            // className="h-[20rem] w-"
          />
        </div>
        <div className="">
          <div className="">
            <h1 className="font-bold text-3xl ">
              Why we’ve suspended Partner Program accounts this week
            </h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur
              facere tempora assumenda incidunt, totam obcaecati aliquam? Vel
              ducimus iste, accusamus corrupti perferendis minus ad excepturi
              beatae eos debitis, a aut. Lorem ipsum dolor sit amet, consectetur
              adipisicing elit. Sapiente voluptates voluptatibus fuga animi? Aut
              delectus ex ipsa nemo, iusto quidem recusandae veniam nisi
              assumenda similique necessitatibus, voluptatem quo minus debitis!
            </p>
          </div>
          <div className="flex items-center gap-3 mt-8">
            <img
              src="https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png"
              alt=""
              className="size-14 rounded-full bg-slate-500 border p-1"
            />
            <div>
              <h3 className="text-lg font-semibold">Shampod Bhowmick</h3>
              <p>Jan 9</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {Array.from({ length: 4 }).map((news, idex) => (
          <div className="border cursor-pointer group" key={idex}>
            <img
              src="https://miro.medium.com/v2/resize:fit:4800/format:webp/1*6tXJ2lH6ay1hZEVAdX772Q.jpeg"
              alt=""
              className="transition duration-500 group-hover:scale-105 w-full block"
            />
            <div className="p-2">
              <h1 className="text-xl font-semibold">
                Lorem ipsum dolor sit amet.
              </h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Assumenda vel tempora nulla repellendus distinctio unde eaque
                velit, alias suscipit quo!
              </p>
              <div className="flex items-center gap-3 mt-2">
                <img
                  src="https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png"
                  alt=""
                  className="size-14 rounded-full bg-slate-500 border p-1"
                />
                <div>
                  <h3 className="text-lg font-semibold">Shampod Bhowmick</h3>
                  <p>Jan 9</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
