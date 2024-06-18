import { prisma, errorResponse } from "../utils";
import { Request, Response } from "express";
//import { isAddress } from "ethers";

const getNotification = async (req: Request, res: Response) => {
  //check if userAddress property is set
  //const { userAddress } = req.query;
  const callerAddress = (req as any).address;

  //if (!userAddress) return errorResponse(401, "ID empty or not set", res);

  try {
    //retrieve notification
    let notification = await prisma.notification.findMany({
      where: {
        userAddress: callerAddress as string,
      },
    });

    //clean up
    await prisma.$disconnect();

    //check if user is authorized to get notification
    if (
      notification.length < 1 ||
      callerAddress === notification[0].userAddress
    ) {
      //send notification
      res.status(201).json({
        success: true,
        data: notification,
      });
    } else {
      //send error
      return errorResponse(403, "Unauthorized access", res);
    }
  } catch (error) {
    return errorResponse(500, error, res);
  }
};

const updateNotification = async (req: Request, res: Response) => {
  let { id } = req.body;

  const _id = parseInt(id as string)

  if (isNaN(_id)) {
    return errorResponse(400, "Notification ID invalid format", res)
  }

  const callerAddress = (req as any).address

  try {
    let notification = await prisma.notification.findUnique({
      where: {
        id: id as unknown as number
      }
    })

    if (
      callerAddress === notification?.userAddress
    ) {
      notification = await prisma.notification.update({
        where: {id: id as unknown as number},
        data: { isRead: notification?.isRead? false: true }
      })

      res.status(201).json({
        success: true
      })
    } else {
      return errorResponse(403, "Unauthorized access", res);
    }
  } catch(error) {
    return errorResponse(500, error, res)
  }
}
export { 
  getNotification,
  updateNotification 
};
