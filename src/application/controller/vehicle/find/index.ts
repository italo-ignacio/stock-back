/* eslint-disable no-ternary */
import { DataSource } from '@infra/database';
import { badRequest, errorLogger, ok } from '@main/utils';
import { pagination } from '@application/helpers';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

export const findVehicleController: Controller =
  () => async (request: Request, response: Response) => {
    const { skip, take } = pagination(request);

    const searchParams =
      request.account.role === 'driver'
        ? {
            vehicleDriver: {
              every: {
                driverId: request.account.id
              }
            }
          }
        : {
            fleet: {
              accountId: request.account.id
            }
          };

    try {
      const search = await DataSource.vehicle.findMany({
        select: {
          cost: true,
          fleet: true,
          id: true,
          image: true,
          licensePlate: true,
          name: true,
          type: true,
          work: true
        },
        skip,
        take,
        where: { ...searchParams }
      });

      return ok({
        payload: search,
        response
      });
    } catch (error) {
      errorLogger(error);

      return badRequest({ response });
    }
  };
