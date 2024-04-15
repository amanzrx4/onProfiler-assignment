import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import toast from "react-hot-toast";
import { Link } from "wouter";
import { ScrapSession } from "../../backend/src/utils";
import "./App.css";
import { Loading } from "./components/SessionDetail";
import { CommonResponse, backendUrl } from "./utils";

dayjs.extend(relativeTime);

function App() {
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const keyword = data.get("keyword");
    const name = data.get("name");

    if (typeof keyword !== "string" || keyword.trim().length === 0) {
      return toast.error("Please enter a valid keyword");
    }
    if (typeof name !== "string" || name.trim().length === 0) {
      return toast.error("Please enter a valid session name");
    }
    mutation.mutate({ keyword, name });
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ keyword, name }: { keyword: string; name: string }) =>
      fetch(`${backendUrl}/scrap`, {
        method: "POST",
        body: JSON.stringify({ keyword, name }),
        headers: {
          "Content-Type": "application/json",
        },
      }),

    onSuccess: () => {
      toast.success("fetched successfully");
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
    onError: (e) => {
      toast.error(`Error occured ${e.message}`);
    },

    mutationKey: ["scrap"],
  });

  const sessions = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const response = await fetch(`${backendUrl}/sessions`);
      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }

      const data = (await response.json()) as unknown as CommonResponse<
        ScrapSession[]
      >;
      if (!data.status) {
        throw Error(data.message);
      }
      return data;
    },
  });

  return (
    <div className="max-w-xl m-auto">
      <form onSubmit={onSubmit} className="flex items-center  mx-auto">
        <label htmlFor="voice-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <div className="flex gap-2 ">
            <input
              type="text"
              name="name"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 grow-0"
              placeholder="Enter a random session name"
              required
            />

            <input
              type="text"
              name="keyword"
              id="keyword"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 grow"
              placeholder="Enter the keyword you want to scrap"
              required
            />
          </div>
          <button
            type="button"
            className="absolute inset-y-0 end-0 flex items-center pe-3"
          ></button>
        </div>
        <button
          disabled={mutation.status === "pending"}
          type="submit"
          className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-300 disabled:border-blue-300"
        >
          <svg
            className="w-4 h-4 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          Scrap
        </button>
      </form>

      {mutation.status === "pending" && (
        <div className="font-large m-8 mb-16">
          <div>scraping data ..</div>
          <div>This might take a while ..</div>

          <Loading />
        </div>
      )}

      <div className="text-xl font-bold m-4">All sessions</div>

      {sessions.status === "pending" && <Loading />}

      <ul>
        {sessions?.data?.data?.map((s) => {
          const ahref = `/session/${s.id}`;
          const timeAgoText = dayjs().to(dayjs(s.createdAt));

          return (
            <li
              className="text-black  flex gap-4 justify-center m-4 items-baseline"
              key={s.id}
            >
              <Link className="hover:underline text-start text-xl" href={ahref}>
                {s.name}
              </Link>

              <div>({timeAgoText})</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
