import { prisma } from "../../lib/prisma";

const adminStates = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const [
      totalUsers,
      totalZone,
      totalSubstation,
      totalFeeder,
      totalArea,
      totalOutages,
      outageReports,
      totalAdmin,
      totalZone_manager,
      totalOperator,
      totalTechnician,
      totalCustomar,
      totalServiceRequest,
      totalPayment,
    ] = await Promise.all([
      tx.user.count(),
      tx.zone.count(),
      tx.substation.count(),
      tx.feeder.count(),
      tx.area.count(),
      tx.outage.count(),
      tx.outageReport.count(),

      tx.user.count({
        where: {
          role: "ADMIN",
        },
      }),
      tx.user.count({
        where: {
          role: "ZONE_MANAGER",
        },
      }),
      tx.user.count({
        where: {
          role: "POWER_OPERATOR",
        },
      }),
      tx.user.count({
        where: {
          role: "TECHNICIAN",
        },
      }),
      tx.user.count({
        where: {
          role: "CUSTOMER",
        },
      }),
      tx.serviceRequest.count(),
      tx.payment.count(),
    ]);

    return {
      totalUsers,
      totalZone,
      totalSubstation,
      totalFeeder,
      totalArea,
      totalOutages,
      outageReports,
      totalAdmin,
      totalZone_manager,
      totalOperator,
      totalTechnician,
      totalCustomar,
      totalServiceRequest,
      totalPayment,
    };
  });

  return transactionResult;
};
const zoneAndOperatorStates = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const [
      totalZone,
      totalSubstation,
      totalFeeder,
      totalArea,
      totalOutages,
      outageReports,
    ] = await Promise.all([
      tx.zone.count(),
      tx.substation.count(),
      tx.feeder.count(),
      tx.area.count(),
      tx.outage.count(),
      tx.outageReport.count(),
    ]);

    return {
      totalZone,
      totalSubstation,
      totalFeeder,
      totalArea,
      totalOutages,
      outageReports,
    };
  });

  return transactionResult;
};

export const stateService = {
  adminStates,
  zoneAndOperatorStates,
};
