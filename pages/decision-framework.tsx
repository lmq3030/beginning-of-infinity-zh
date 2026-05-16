import {DecisionFramework} from 'app/components/decision-framework'
import {Header} from 'app/components/header'
import {Layout} from 'app/components/layout'
import type {NextPage} from 'next'
import React from 'react'

const DecisionFrameworkPage: NextPage = () => {
  return (
    <Layout>
      <Header />
      <DecisionFramework />
    </Layout>
  )
}

export default DecisionFrameworkPage
