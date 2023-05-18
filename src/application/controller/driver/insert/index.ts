/* eslint-disable no-undefined */
/* eslint-disable no-ternary */
import { DataSource } from '@infra/database';
import { ValidationError } from 'yup';
import { arrayExists } from '@application/helpers';
import { badRequest, errorLogger, ok, validationErrorResponse } from '@main/utils';
import { env } from '@main/config';
import { hash } from 'bcrypt';
import { insertDriverSchema } from '@data/validation';
import { messages } from '@domain/helpers';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

interface Body {
  name: string;
  email: string;
  password: string;
  vehicleFleetList?: string[];
}

export const insertDriverController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      await insertDriverSchema.validate(request, { abortEarly: false });

      const { name, email, password, vehicleFleetList } = request.body as Body;

      const hasDriver = await DataSource.driver.findFirst({
        where: {
          AND: {
            email,
            isDisable: false
          }
        }
      });

      if (hasDriver !== null)
        return badRequest({ message: messages.account.emailAlreadyExists, response });

      const { hashSalt } = env;

      const hashedPassword = await hash(password, hashSalt);

      const vehicleFleetDriver = arrayExists(vehicleFleetList)
        ? {
            createMany: {
              data:
                vehicleFleetList?.map((driver) => ({
                  vehicleFleetId: driver
                })) ?? [],
              skipDuplicates: true
            }
          }
        : undefined;

      await DataSource.driver.create({
        data: {
          accountId: request.account.id,
          email,
          name,
          password: hashedPassword,
          vehicleFleetDriver
        }
      });

      return ok({ response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return badRequest({ response });
    }
  };