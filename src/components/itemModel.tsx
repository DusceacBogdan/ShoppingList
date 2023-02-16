import { ShoppingItem } from "@prisma/client";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { api } from "../utils/api";

interface ItemModelProps {
  setModelOpen: Dispatch<SetStateAction<boolean>>;
  setItems: Dispatch<SetStateAction<ShoppingItem[]>>;
}

const ItemModel: FC<ItemModelProps> = ({ setModelOpen, setItems }) => {
  const [input, setInput] = useState<string>("");
  const { mutate: addItem } = api.items.addItem.useMutation({
    onSuccess(shoppingItem) {
      setItems((prev) => [...prev, shoppingItem]);
    },
  });

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/75">
      <div className="space-y-4 bg-white p-3">
        <h3 className="text-xl font-semibold">Name of item</h3>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          type="text"
          className="w-full rounded-md border-gray-300 bg-gray-200 shadow-sm focus:border-violet-300 focus:ring focus:ring-violet-200 focus:ring-opacity-50"
        />
        <div className="grid grid-cols-2 gap-8">
          <button
            className="rounded-md bg-gray-500 p-1 text-xs text-white transition hover:bg-gray-600"
            onClick={() => setModelOpen(false)}
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-violet-500 p-1 text-xs text-white transition hover:bg-violet-600"
            onClick={() => {
              addItem({ name: input });
              setModelOpen(false);
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemModel;
