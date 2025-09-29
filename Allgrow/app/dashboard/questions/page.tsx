"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";

interface TestCase {
  input: string;
  output: string;
}

interface Question {
  id: string;
  title: string;
  description: string;
  input_format: string;
  output_format: string;
  sample_input: string;
  sample_output: string;
  test_cases: TestCase[];
  difficulty: "easy" | "medium" | "hard";
  createdAt: Date;
  updatedAt: Date;
}

const getBadgeColor = (difficulty: Question["difficulty"]) => {
  switch (difficulty) {
    case "easy":
      return "bg-green-600/80 text-green-100 border border-green-400 shadow-lg shadow-green-600/40";
    case "medium":
      return "bg-yellow-600/80 text-yellow-100 border border-yellow-400 shadow-lg shadow-yellow-600/40";
    case "hard":
      return "bg-red-600/80 text-red-100 border border-red-400 shadow-lg shadow-red-600/40";
    default:
      return "bg-gray-600 text-gray-100";
  }
};

const DashboardPage = () => {
  const [data, setData] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setData(resp.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentItems = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#111] flex flex-col text-white">
      {/* Header */}
      <h2 className="text-3xl font-bold text-center py-6 border-b border-gray-800 tracking-wide relative">
        📋 Questions
        <span className="absolute left-1/2 -bottom-[2px] w-20 h-[3px] bg-gradient-to-r from-pink-500 to-purple-500 rounded-full -translate-x-1/2" />
      </h2>

      {/* Main list */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
        {loading ? (
          <div className="grid gap-4">
            {[...Array(itemsPerPage)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-20 w-full bg-gray-800/70 rounded-xl"
              />
            ))}
          </div>
        ) : (
          <>
            <ul className="grid gap-6 w-full">
              {currentItems.map((q, idx) => (
                <li
                  key={q.id}
                  className="flex items-start justify-between bg-gray-900/80 hover:bg-gray-800 transition transform hover:scale-[1.01] duration-200 p-5 rounded-xl shadow-lg border border-gray-700/60"
                >
                  <div className="flex flex-col max-w-[80%]">
                    <span className="text-lg font-semibold text-gray-100">
                      {(currentPage - 1) * itemsPerPage + idx + 1}. {q.title}
                    </span>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                      {q.description}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full self-start ${getBadgeColor(
                      q.difficulty
                    )}`}
                  >
                    {q.difficulty}
                  </span>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 pt-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="text-gray-300 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
