export default interface ResponseDto<T> {
  statusCode: number,
  message: string,
  data: T | null
}