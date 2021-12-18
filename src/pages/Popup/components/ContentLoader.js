import React from 'react'
import ReactContentLoader from "react-content-loader";
export default function ContentLoader() {
    return (
        <>
            <ReactContentLoader>
                <rect x="15" y="15" rx="4" ry="4" width="300" height="12" />
                <rect x="15" y="35" rx="3" ry="3" width="250" height="8" />
                <rect x="15" y="55" rx="3" ry="3" width="250" height="8" />
                <rect x="15" y="75" rx="3" ry="3" width="230" height="8" />
            </ReactContentLoader>
            <ReactContentLoader>
                <rect x="15" y="15" rx="4" ry="4" width="300" height="12" />
                <rect x="15" y="35" rx="3" ry="3" width="250" height="8" />
                <rect x="15" y="55" rx="3" ry="3" width="250" height="8" />
                <rect x="15" y="75" rx="3" ry="3" width="230" height="8" />
            </ReactContentLoader>
        </>
    )
}
