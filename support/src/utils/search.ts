/** 表示中行のクライアント検索。空クエリは全件一致。 */
export const matchesSearch = (haystacks: Array<string | number | null | undefined>, query: string): boolean => {
  const needle = query.trim().toLocaleLowerCase('ja')
  if (needle === '') {
    return true
  }
  return haystacks.some((value) => {
    if (value == null) {
      return false
    }
    return String(value).toLocaleLowerCase('ja').includes(needle)
  })
}
