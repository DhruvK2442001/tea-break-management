"use client";

import TaskDialog from "@/components/others/TaskDialog";
import { useAuthStore } from "@/store/auth-store";
import { useState } from "react";

export default function TaskDashboard() {
  const { dialog, setDialog, data, setData } = useAuthStore();
  const [openFolder, setOpenFolder] = useState([]);

  const handleAddFolder = (item) => {
    setDialog({ open: true, isFor: "Add Folder", data: item });
  };

  const toggleFolder = (item) => {
    setOpenFolder((prev) =>
      prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id]
    );
  };

  const RenderMenu = (item, depth = 0) => {
    const isFolder = item.isParent;
    const isOpen = openFolder.includes(item.id);

    return (
      <div key={item.id} className="flex flex-col">
        <div
          className={`
            px-2 py-1 w-[300px] cursor-pointer 
            ${isFolder ? "bg-blue-500/70" : "bg-green-500/70"}
          `}
          style={{ paddingLeft: depth * 20 }}
          onClick={() => isFolder && handleAddFolder(item)}
        >
          <div className="flex justify-between w-full">
            {item.title}{" "}
            <span
              className={`ml-2 cursor-pointer ${isFolder ? "block" : "hidden"}`}
              onClick={() => isFolder && toggleFolder(item)}
            >
              {" "}
              {isOpen ? "-" : "+"}
            </span>
          </div>
        </div>

        {isFolder && isOpen && item.children?.length > 0 && (
          <div>
            {item.children.map((child) => RenderMenu(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div>
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={handleAddFolder}
        >
          Add Folder
        </h1>

        <div className="flex flex-col gap-2 mt-4">
          {Array.isArray(data) && data.map((item) => RenderMenu(item, 0))}
        </div>
      </div>

      <TaskDialog />
    </>
  );
}
