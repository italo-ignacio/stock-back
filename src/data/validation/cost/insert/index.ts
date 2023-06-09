import { stringNotRequired, stringRequired } from '@main/utils';
import { yup } from '@infra/yup';

export const insertCostSchema = yup.object().shape({
  body: yup.object().shape({
    date: stringNotRequired(),
    description: stringNotRequired(),
    driverId: stringNotRequired(),
    name: stringRequired({
      english: 'name',
      portuguese: 'nome'
    }),
    value: stringRequired({
      english: 'value',
      portuguese: 'valor'
    }),
    vehicleId: stringRequired({
      english: 'id',
      portuguese: 'id'
    })
  })
});
