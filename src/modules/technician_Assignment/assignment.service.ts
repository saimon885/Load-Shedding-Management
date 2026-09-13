import {
  AssignmentStatus,
  OutageStatus,
  ReportStatus,
  UserRole,
} from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createAssignment = async (payload: {
  outageId: string;
  technicianId: string;
}) => {
  const { outageId, technicianId } = payload;

  const outage = await prisma.outage.findUnique({
    where: { id: outageId },
  });

  if (!outage) {
    throw new Error("Outage not found!");
  }

  if (
    outage.status === OutageStatus.RESTORED ||
    outage.status === OutageStatus.CANCELLED
  ) {
    throw new Error(
      "Cannot assign a technician to a resolved or cancelled outage!",
    );
  }

  const technician = await prisma.user.findFirst({
    where: { id: technicianId, role: UserRole.TECHNICIAN },
  });

  if (!technician) {
    throw new Error("this is not a technician. please valid technician id");
  }

  const existingActiveAssign = await prisma.technicianAssign.findFirst({
    where: {
      outageId,
      technicianId,
      status: {
        in: [
          AssignmentStatus.PENDING,
          AssignmentStatus.IN_PROGRESS,
          AssignmentStatus.ACCEPTED,
        ],
      },
    },
  });

  if (existingActiveAssign) {
    throw new Error(
      "This technician is already actively assigned to this outage!",
    );
  }
  const result = await prisma.technicianAssign.create({
    data: {
      outageId,
      technicianId,
      status: AssignmentStatus.PENDING,
    },
    include: {
      outage: true,
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};
const updateAssignmentStatus = async (
  assignmentId: string,
  newStatus: AssignmentStatus,
  currentUserId: string,
  currentUserRole: string,
) => {
  const assignment = await prisma.technicianAssign.findUnique({
    where: { id: assignmentId },
    include: { outage: true },
  });

  if (!assignment) {
    throw new Error("Assignment not found!");
  }
  if (
    currentUserRole === "TECHNICIAN" &&
    assignment.technicianId !== currentUserId
  ) {
    throw new Error("You are not authorized to update this assignment!");
  }

  const result = await prisma.$transaction(async (tx) => {
    const now = new Date();
    const updatedAssignment = await tx.technicianAssign.update({
      where: { id: assignmentId },
      data: {
        status: newStatus,
        ...(newStatus === AssignmentStatus.COMPLETED && { resolvedAt: now }),
      },
    });

    if (newStatus === AssignmentStatus.COMPLETED) {
      await tx.outage.update({
        where: { id: assignment.outageId },
        data: {
          status: OutageStatus.RESTORED,
          actualRestorationTime: now,
        },
      });

      await tx.outageReport.updateMany({
        where: {
          outageId: assignment.outageId,
        },
        data: {
          status: ReportStatus.RESOLVED,
        },
      });
    }

    return updatedAssignment;
  });

  return result;
};

export const assignmentService = {
  createAssignment,
  updateAssignmentStatus,
};
