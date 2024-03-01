import type { ShoppingItem } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import ItemModel from "../components/itemModel";
import { HiX } from "react-icons/hi";
import { api } from "../utils/api";
import { motion } from "framer-motion";
import { FaRegEdit } from "react-icons/fa";

const Home: NextPage = () => {
  const [items, setItems] = useState<ShoppingItem[]>([] as ShoppingItem[]);
  const [modelOpen, setModelOpen] = useState<boolean>(false);
  const [editInputValue, setEditInputValue] = useState<string>("");
  const [editInput, setEditInput] = useState<boolean>(false);
  const [inputId, setInputId] = useState<string>("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const { data: itemsData, isLoading } = api.items.getAll.useQuery("degeaba", {
    onSuccess(itemsList) {
      setItems(itemsList);
    },
  });

  const { mutate: deleteItem } = api.items.deleteItem.useMutation({
    onSuccess(item) {
      setItems((prev) => prev.filter((el) => el.id !== item.id));
    },
  });

  const { mutate: checkItem } = api.items.toggleCheckItem.useMutation({
    onSuccess(item) {
      setItems((prev) => prev.map((el) => (el.id === item.id ? item : el)));
    },
  });

  const { mutate: editItem } = api.items.editItem.useMutation({
    onSuccess(item) {
      setItems((prev) => prev.map((el) => (el.id === item.id ? item : el)));
    },
    onMutate: ({ id, newName }) => {
      const prevItems = items;
      setItems((prev) =>
        prev.map((el) => (el.id === id ? { ...el, name: newName } : el)),
      );
      return prevItems;
    },
  });
  useEffect(() => {
    if (editInput && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editInput]);

  if (!itemsData || isLoading)
    return (
      <main className="flex h-screen items-center justify-center">
        <div className="animate-spin text-3xl">Loading...</div>
      </main>
    );

  return (
    <>
      <Head>
        <title>Shopping List</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {modelOpen && (
        <ItemModel setModelOpen={setModelOpen} setItems={setItems} />
      )}

      <main className="mx-auto my-12 max-w-3xl">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold">My shopping list</h2>
          <button
            type="button"
            className="rounded-md bg-violet-400 p-2 text-sm text-white transition hover:bg-violet-700 hover:text-blue-100"
            onClick={() => setModelOpen(true)}
          >
            Add shopping item
          </button>
        </div>
        <ul className="mt-4">
          {items.map((item) => {
            return (
              <li
                key={item.id}
                className="flex w-full items-center justify-between py-0.5"
              >
                {editInput && item.id === inputId ? (
                  <input
                    type="text"
                    value={editInputValue}
                    onChange={(event) => setEditInputValue(event.target.value)}
                    className="w-40 rounded-md border-gray-300 bg-gray-200 shadow-sm focus:border-violet-300 focus:ring focus:ring-violet-200 focus:ring-opacity-50"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        setEditInput(false);
                        editItem({ id: item.id, newName: editInputValue });
                      }
                    }}
                    ref={editInputRef}
                  />
                ) : (
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-0 flex origin-left items-center justify-center">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: item.checked ? "100%" : 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="h-[2px] w-full translate-y-px bg-red-500"
                      />
                    </div>
                    <span
                      className="cursor-pointer"
                      onClick={() => {
                        checkItem(item);
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                )}
                {!editInput && (
                  <div className="flex">
                    <FaRegEdit
                      className="mr-2 cursor-pointer text-lg text-violet-400 hover:text-violet-700"
                      onClick={() => {
                        setEditInput(true);
                        setInputId(item.id);
                        setEditInputValue(item.name);
                      }}
                    />
                    <HiX
                      className="cursor-pointer text-lg text-red-500"
                      onClick={() => deleteItem(item)}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
};

export default Home;
