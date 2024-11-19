import React from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'

export default function HelmetConatiner() {
  const getPageTitle = () => {
    const url = window.location.href.split('#')
    if (url.length > 1) {
      const newUrl = url[1]
        .split('/')
        .reverse()
        .map(item => {
          if (typeof item !== 'string') return item
          return item.charAt(0).toUpperCase() + item.slice(1)
        })
      return `${newUrl.join(' | ')} Control D`
    }
    return 'Control D'
  }

  return (
    <HelmetProvider>
      <Helmet>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="description" content="ControlD" />
        <meta name="author" content="Łukasz Holeczek" />
        <meta
          name="keyword"
          content="Bootstrap,Admin,Template,Open,Source,CSS,SCSS,HTML,RWD,Dashboard,React"
        />
        <title>{getPageTitle()}</title>
      </Helmet>
    </HelmetProvider>
  )
}
