import { ErrorSource } from './error.source';
import { JsonSource } from './json.source';
import { XmlSource } from './xml.source';

export type SourceModel =
  | typeof ErrorSource
  | typeof JsonSource
  | typeof XmlSource;

const currencySources: SourceModel[] = [JsonSource, XmlSource, ErrorSource];

export function* sourceIterator(): Generator<SourceModel, void, unknown> {
  let iterator = currencySources.values();
  while (true) {
    const { value, done } = iterator.next();
    if (done) {
      iterator = currencySources.values();
    } else {
      yield value;
    }
  }
}
