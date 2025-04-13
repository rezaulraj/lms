import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
const Search = () => {
  return (
    <div className="w-[100%]">
      <div className="bg-coching-text_color flex h-10 p-1 items-center rounded">
        <input
          type="text"
          className="flex grow bg-coching-nav_color items-center p-2 h-[100%] outline-none text-while"
        />
        <button className="w-[45px]">
          <MagnifyingGlassIcon className="h-[27px] m-auto stroke-slate-900" />
        </button>
      </div>
    </div>
  );
};

export default Search;
