import { prisma } from "../../lib/prisma";
import { UpdateProfiePayload } from "./user.interface";

const getMyprofile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      profile: true,
    },
    omit: {
      password: true,
    },
  });
  if (!user) {
    throw new Error("user not found!");
  }
  return user;
};
const updateMyProfile = async (
  payload: UpdateProfiePayload,
  userId: string,
) => {
  const userExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!userExist) {
    throw new Error("user not found!");
  }
  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: payload.name,
      profile: {
        update: {
          address: payload.address,
          phone: payload.phone,
          profileImage: payload.profileImage,
        },
      },
    },
    omit: {
      password: true,
    },
  });
  return updateUser;
};

export const userService = {
  getMyprofile,
  updateMyProfile,
};
