import quertyString from 'query-string';

export default function getQueryParams(string) {
  return quertyString.parse(string);
} 