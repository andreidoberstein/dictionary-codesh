import { of, throwError } from 'rxjs';

export const httpServiceMock = () => ({
  get: jest.fn().mockReturnValue(of({ data: [] })), // default: sucesso com array vazio
  // use .mockReturnValueOnce(...) em cada teste p/ customizar
});

export const httpOk = (data: any) => of({ data });
export const httpErr = (status = 500, message = 'err') =>
  throwError(() => ({ response: { status }, message }));
