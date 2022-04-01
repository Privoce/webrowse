import React from 'react'
import ReactContentLoader from "react-content-loader";

export default function ContentLoader() {
  return (
    <>
      <ReactContentLoader height={70}>
        <rect x="15" y="15" rx="4" ry="4" width="240" height="8"/>
        <rect x="15" y="35" rx="3" ry="3" width="60" height="8"/>
        <rect x="15" y="55" rx="3" ry="3" width="180" height="8"/>
      </ReactContentLoader>
    </>
  )
}
