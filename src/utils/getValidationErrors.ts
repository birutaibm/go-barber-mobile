import { ValidationError } from 'yup';

type Errors = {[key: string]: string}

export default function getValidationErrors(yupValidation: ValidationError) {
  const result:Errors = {};
  yupValidation.inner.forEach(err => result[err.path] = err.message);
  return result;
}
