"use client";

import { useAuthStore } from "@/store/auth-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { isEmpty } from "lodash";
export default function TaskDialog() {
  const [localTitle, setLocalTitle] = useState("");
  const { dialog, setDialog, data, setData } = useAuthStore();

  const handleSubmit = () => {
    debugger;
    if (isEmpty(localTitle)) return;
    if (isEmpty(data)) {
      let updateData = [
        {
          title: localTitle,
          isParent: dialog.isFor === "Add Folder",
          children: [],
        },
      ];

      setData([...data, ...updateData]);
    }
    setDialog({ open: false, isFor: "Add Folder", data: {} });
  };
  return (
    <Dialog open={dialog.open} onOpenChange={setDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialog.isFor}</DialogTitle>
        </DialogHeader>
        <Input
          label="Task Name"
          placeholder="Enter Task Name"
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogContent>
    </Dialog>
  );
}
