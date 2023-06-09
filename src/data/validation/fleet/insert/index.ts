import { booleanNotRequired, stringRequired } from '@main/utils';
import { yup } from '@infra/yup';

export const insertFleetSchema = yup.object().shape({
  body: yup.object().shape({
    autoApproveCost: booleanNotRequired(),
    autoApproveWork: booleanNotRequired(),
    name: stringRequired({
      english: 'name',
      portuguese: 'nome'
    })
  })
});
