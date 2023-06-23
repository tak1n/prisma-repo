import { PrismaClient, Prisma, Message, Author } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const author = await prisma.author.create({
    data: {
      name: "Alice",
    },
  });

  const room = await prisma.room.create({
    data: {
      channel: "WhatsApp",
    },
  });

  const message = await prisma.message.create({
    data: {
      roomId: room.id,
      authorId: author.id,
      content: "Test",
      kind: "Input",
    },
  });

  const findManyInput: Prisma.MessageFindManyArgs = {
    where: { room: { channel: "WhatsApp" } },
    take: 5,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  };

  let messagesWithAuthor: (Message & { author: Author })[];
  messagesWithAuthor = await prisma.message.findMany({
    ...findManyInput,
    include: { author: true },
  });

  console.dir(messagesWithAuthor, { depth: null });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
