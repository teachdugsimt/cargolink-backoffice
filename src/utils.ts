export interface IQueryParams {
  [key: string]: string;
}
export const searchToQueryParams = (search: string): IQueryParams | null => {
  if (search.length === 0) return null;
  if (!search.startsWith('?')) return null;
  const withOutQuestionMark = search.substr(1);
  const paramsArray = withOutQuestionMark.split('&');
  return paramsArray.reduce((result: IQueryParams, current: string) => {
    const [key, value] = current.split('=');
    if (!key || !key.length) return result;
    return {
      ...result,
      [key]: value,
    };
  }, {});
}