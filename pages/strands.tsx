import {Header} from 'app/components/header'
import {Layout} from 'app/components/layout'
import {BookStrandsMap} from 'app/components/book-strands-map'
import type {NextPage} from 'next'
import React from 'react'

const StrandsPage: NextPage = () => {
  return (
    <Layout>
      <Header />
      <BookStrandsMap />
    </Layout>
  )
}

export default StrandsPage
