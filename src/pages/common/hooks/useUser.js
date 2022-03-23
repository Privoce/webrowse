import { useEffect } from 'react'
import {
  useLazyQuery,
  useMutation,
  gql
} from "@apollo/client";

const QUERY_USER = gql`
  query FetchUser($aid: String = "") {
    portal_user(where: {aid: {_eq: $aid}}) {
      aid
      avatar
      created_at
      customer
      email
      id
      level
      nickname
      updated_at
      username
    }
  }
`;
const UPSERT_PERSONAL_ROOM = gql`
  mutation UpsertRoom($obj: [portal_room_insert_input!]!) {
    insert_portal_room(objects:$obj, on_conflict: {constraint: room_id_key, update_columns: [personal,name]}) {
      returning {
        id
        name
        personal
        created_at
      }
      affected_rows
    }
  }
`;

const useUser = () => {
  const [loadUserWithAid, { loading, data: userData }] = useLazyQuery(QUERY_USER)
  // const [upsertUser, { data: userData, loading: loading }] = useMutation(UPSERT_USER);
  const [upsertRoom] = useMutation(UPSERT_PERSONAL_ROOM);
  useEffect(() => {
    if (!loading && userData) {
      //  create personal room
      const { id, username, level, customer } = userData?.portal_user[0] || {};
      const obj = { id: `${id}`, name: username, personal: true }
      upsertRoom({ variables: { obj } });
      // update level to local data
      if (typeof level !== 'undefined') {
        chrome.storage.sync.get(['user'], (res) => {
          console.log('local user data', res.user);
          const { user = null } = res;
          if (user) {
            chrome.storage.sync.set({ user: { ...user, level, customer, intUid: id } })
          }
        }
        )
      }
    }
  }, [loading, userData])
  const initialUser = (aid) => {
    loadUserWithAid({ variables: { aid } })
  }

  return {
    initialUser,
    level: userData?.portal_user[0]?.level,
    uid: userData?.portal_user[0]?.id,
    loading,
    user: userData?.portal_user[0]
  }
}

export default useUser;
