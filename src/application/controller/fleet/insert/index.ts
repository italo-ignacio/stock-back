import { DataSource } from '@infra/database';
import { ValidationError } from 'yup';
import { badRequest, errorLogger, ok, validationErrorResponse } from '@main/utils';
import { insertFleetSchema } from '@data/validation';
import type { Controller } from '@application/protocols';
import type { Request, Response } from 'express';

interface Body {
  name: string;
}

export const insertFleetController: Controller =
  () => async (request: Request, response: Response) => {
    try {
      await insertFleetSchema.validate(request, { abortEarly: false });

      const { name } = request.body as Body;

      await DataSource.fleet.create({
        data: {
          accountId: request.account.id,
          name
        },
        select: {
          id: true
        }
      });

      return ok({ response });
    } catch (error) {
      errorLogger(error);

      if (error instanceof ValidationError) return validationErrorResponse({ error, response });

      return badRequest({ response });
    }
  };
