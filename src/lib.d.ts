interface Array<T> {
  filter(predicate: typeof Boolean): NonFalsy<T>[]
}
