import '../styles/globals.css'
import type {AppProps} from 'next/app'
import Head from 'next/head'
import React from 'react'

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <title>无穷的开始</title>

        <meta
          name="description"
          content="David Deutsch《无穷的开始》阅读笔记：一切失败都源于知识不足。"
        />
        <meta
          name="og:description"
          content="David Deutsch《无穷的开始》阅读笔记：一切失败都源于知识不足。"
        />
        <meta name="og:title" content="无穷的开始" />
        <meta name="og:url" content="https://thebeginningofinfinity.xyz" />
        <meta name="apple-mobile-web-app-title" content="无穷的开始" />

        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:image"
          content="https://thebeginningofinfinity.xyz/twitter-summary-card.png"
        />
        <meta name="og:title" content="无穷的开始" />
        <meta
          name="og:image"
          content="https://thebeginningofinfinity.xyz/twitter-summary-card.png"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
