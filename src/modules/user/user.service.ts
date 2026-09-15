import type { UploadApiResponse } from "cloudinary";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import type { UpdateProfiePayload } from "./user.interface";
import { cloudinary } from "../../lib/cloudinary";
import { AppError } from "../../utility/AppError";

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
    throw new AppError(httpStatus.NOT_FOUND, "user not found!");
  }
  return user;
};
const getAllUser = async () => {
  const user = await prisma.user.findMany({
    omit: {
      password: true,
    },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "users not found!");
  }
  return user;
};

const updateMyProfile = async (
  buffer: Buffer,
  payload: any,
  userId: string,
) => {
  const userExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      profile: {
        select: { profileImage: true, imagePublishedID: true },
      },
    },
  });
  if (!userExist) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found!");
  }

  const cloudinaryResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "auto" }, async (error, result) => {
          if (error) {
            throw new AppError(
              httpStatus.INTERNAL_SERVER_ERROR,
              "Failed to upload image to Cloudinary",
            );
          }
          if (!result) {
            return reject(
              new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                "No result returned from Cloudinary upload",
              ),
            );
          }
          resolve(result);
        })
        .end(buffer);
    },
  );
  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: payload.name,
      areaId: payload.areaId,
      profile: {
        update: {
          address: payload.address,
          phone: payload.phone,
          profileImage: cloudinaryResult.secure_url,
          imagePublishedID: cloudinaryResult.public_id,
        },
      },
    },
    include: {
      profile: true,
    },
    omit: {
      password: true,
    },
  });
  if (userExist?.profile?.profileImage || cloudinaryResult.public_id) {
    await cloudinary.uploader.destroy(
      userExist?.profile?.imagePublishedID || cloudinaryResult.public_id,
      { resource_type: "image" },
    );
  }
  return updateUser;
};

export const userService = {
  getMyprofile,
  updateMyProfile,
  getAllUser,
};
