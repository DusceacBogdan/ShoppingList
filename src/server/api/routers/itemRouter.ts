import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
export const itemRouter = createTRPCRouter({
  addItem: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { name } = input;

      const item = await ctx.prisma.shoppingItem.create({
        data: {
          name,
        },
      });

      return item;
    }),
  getAll: publicProcedure.input(z.string()).query(async ({ ctx }) => {
    return await ctx.prisma.shoppingItem.findMany();
  }),
  deleteItem: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const del = await ctx.prisma.shoppingItem.delete({
        where: {
          id,
        },
      });

      return del;
    }),
  toggleCheckItem: publicProcedure
    .input(z.object({ checked: z.boolean(), id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      let { checked } = input;
      const { id } = input;

      checked = !checked;
      const check = await ctx.prisma.shoppingItem.update({
        where: {
          id,
        },
        data: {
          checked,
        },
      });

      return check;
    }),
  editItem: publicProcedure
    .input(z.object({ id: z.string(), newName: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id, newName } = input;
      const edit = await ctx.prisma.shoppingItem.update({
        where: {
          id,
        },
        data: {
          name: newName,
        },
      });

      return edit;
    }),
});
