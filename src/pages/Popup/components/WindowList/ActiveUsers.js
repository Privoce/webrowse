import { useEffect, useState } from 'react'
// import useSWR from 'swr'
import AvatarList from '../../../common/AvatarList'
import { SOCKET_SERVER_DOMAIN } from '../../../../common'

// const fetcher = (...args) => fetch(...args).then(res => res.json());
const prefix = SOCKET_SERVER_DOMAIN.indexOf('localhost') > -1 ? 'http:' : 'https:'
export default function ActiveUsers({ wid }) {
  const [users, setUsers] = useState(null)
  // const { data, error } = useSWR(`${prefix}//${SOCKET_SERVER_DOMAIN}/webrowse/user/active/window/${wid}`, fetcher)
  useEffect(() => {
    const fetchActiveUsers = async () => {
      const resp = await fetch(`${prefix}//${SOCKET_SERVER_DOMAIN}/webrowse/user/active/window/${wid}`);
      const res = await resp.json();
      setUsers(res.users)
    }

    if (wid) {
      fetchActiveUsers()
    }
  }, [wid])
  if (!users) return null;
  return (
    <AvatarList users={users} />
  )
}
