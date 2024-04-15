import { useQuery } from "@tanstack/react-query";
import {
  Profile,
  ScrapSession as ScrapSessionP,
} from "../../../backend/src/utils";
import { CommonResponse, backendUrl } from "../utils";
import { useState } from "react";
import toast from "react-hot-toast";

type ScrapSession = ScrapSessionP & {
  profiles: Profile[];
};

export const Loading = () => (
  <div role="status" className="flex justify-center items-center">
    <svg
      aria-hidden="true"
      className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
    <span className="sr-only">Loading...</span>
  </div>
);

const SessionDetail = ({ sessionId }: { sessionId: string }) => {
  const profiles = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      let queryParamsStr = `?sessionId=${sessionId}`;

      if (queryParamsObj.from > queryParamsObj.to) {
        throw new Error("minFollowers should be less than maxFollowers");
      }

      if (queryParamsObj.from) {
        queryParamsStr =
          queryParamsStr + `&minFollowers=${queryParamsObj.from}`;
      }
      if (queryParamsObj.to) {
        queryParamsStr = queryParamsStr + `&maxFollowers=${queryParamsObj.to}`;
      }

      return fetch(`${backendUrl}/scrap${queryParamsStr}`).then(async (r) => {
        const data =
          (await r.json()) as unknown as CommonResponse<ScrapSession>;
        if (!data.status) {
          throw new Error(data.message);
        }
        return data;
      });
    },
  });

  const initialState = { from: 0, to: 0 };
  const [queryParamsObj, setQueryParamsObj] = useState(initialState);

  const onReset = () => {
    setQueryParamsObj(initialState);
  };

  const onSearch: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (queryParamsObj.from > queryParamsObj.to) {
      toast.error("from should be less than to");
      setQueryParamsObj(initialState);
      return;
    }
    profiles.refetch();
  };

  if (profiles.isError) {
    console.log("error");
    return (
      <div className="text-red"> Error occured: {profiles.error.message} </div>
    );
  }
  if (profiles.status !== "success") return <Loading />;

  // const keysToExclude: (keyof Profile)[] = ["id", "scrapSessionId"]
  const filteredProfiles = profiles.data.data.profiles.map(
    ({ scrapSessionId, ...rest }) => rest
  );

  const keys = ["followers", "following", "fid", "address", "username"];

  return (
    <div>
      {/*  */}
      <form onSubmit={onSearch} className=" max-w-screen-md m-auto mb-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
          <h2 className="text-stone-700 text-xl font-bold">Apply filters</h2>
          <p className="mt-1 text-sm">Filter by follower range</p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-stone-600 text-sm font-medium text-left"
              >
                From
              </label>
              <input
                name="from"
                value={queryParamsObj.from}
                onChange={(e) =>
                  setQueryParamsObj((p) => ({
                    ...p,
                    from: parseInt(e.target.value),
                  }))
                }
                className="mt-2 block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="manufacturer"
                className="text-stone-600 text-sm font-medium text-left"
              >
                To
              </label>
              <input
                type="number"
                id="manufacturer"
                name="to"
                value={queryParamsObj.to}
                onChange={(e) =>
                  setQueryParamsObj((prev) => ({
                    ...prev,
                    to: parseInt(e.target.value),
                  }))
                }
                className="mt-2 block w-full rounded-md border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          <div className="mt-6 grid w-full grid-cols-2 justify-end space-x-4 md:flex">
            <button
              onClick={onReset}
              className="active:scale-95 rounded-lg bg-gray-200 px-8 py-2 font-medium text-gray-600 outline-none focus:ring hover:opacity-90"
            >
              Reset
            </button>
            <button
              type="submit"
              className="active:scale-95 rounded-lg bg-blue-600 px-8 py-2 font-medium text-white outline-none focus:ring hover:opacity-90"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/*  */}

      <div>
        <h1 className="text-xl text-left my-4">
          Results for keyword: {profiles.data.data.keyword}
        </h1>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                S. No.
              </th>

              {keys.map((k, i) => {
                return (
                  <th scope="col" className="px-6 py-3" key={i}>
                    {k}
                  </th>
                );
              })}
            </tr>
            {filteredProfiles.length > 0 ? null : null}
          </thead>

          {filteredProfiles.length > 0 ? (
            <tbody>
              {filteredProfiles.map((profile, i) => {
                return (
                  <tr className="bg-white dark:bg-gray-800" key={profile.id}>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {i + 1}
                    </th>

                    <td className="px-6 py-4">{profile.followers}</td>
                    <td className="px-6 py-4">{profile.following}</td>
                    <td className="px-6 py-4">{profile.fid}</td>
                    <td className="px-6 py-4">{profile.address}</td>
                    <td className="px-6 py-4">{profile.username}</td>
                  </tr>
                );
              })}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  No profiles found.
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default SessionDetail;
