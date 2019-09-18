// Returns skewer version of given text
export default function skewer (text: string): string[] {
  const replaceVowels: string = text.replace(/[aeiou]/gi, (letter) => '[]')
  const replaceConsonants: string = replaceVowels
    .replace(/[bcdfghjklmnpqrstvwxyz]/gi, (letter) => 'o')
  const makeSkewers: string[] = replaceConsonants
    .split(' ')
    .map((word) => {
      if (word.endsWith(',')) {
        return '---{' + word.slice(0, -1) + '--,'
      }
      if (word.endsWith('.')) {
        return '---{' + word.slice(0, -1) + '--.'
      }
      return '---{' + word + '--'
    })

  return makeSkewers
}
