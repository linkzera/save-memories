import Link from 'next/link'

export const Copyright = () => {
  return (
    <p className="text-sm leading-relaxed text-gray-200">
      Feito com 💜 no NLW da{' '}
      <Link
        className="underline hover:text-gray-100"
        href={'https://www.rocketseat.com.br/'}
        target="_blank"
        rel="noopener noreferrer"
      >
        Rocketseat
      </Link>
    </p>
  )
}
