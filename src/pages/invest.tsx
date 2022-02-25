import Layout from '@components/Layout'
import React, { ReactElement } from 'react';

export default function Invest() {
	return <div className="px-28 py-11">Invest page</div>
}

Invest.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout.WithSideMenu>
      <Layout.WithMainMenu showLogo={false}>{page}</Layout.WithMainMenu>
    </Layout.WithSideMenu>
  )
}
