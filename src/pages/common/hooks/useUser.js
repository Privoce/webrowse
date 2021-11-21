import { useEffect } from 'react'
import {
  useMutation,
  gql
} from "@apollo/client";

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
const UPSERT_USER = gql`
  mutation UpSertUser($objects: [portal_user_insert_input!]!) {
    insert_portal_user(objects: $objects, on_conflict: {constraint: user_aid_key, update_columns: [username]}) {
      affected_rows
      returning {
        aid
        id
        nickname
        username
        updated_at
        created_at
        avatar
      }
    }
  }
`;

const useUser = () => {
  const [upsertUser, { data: upsertUserData, loading: upsertUserLoading }] = useMutation(UPSERT_USER);
  const [upsertRoom] = useMutation(UPSERT_PERSONAL_ROOM);
  useEffect(() => {
    if (!upsertUserLoading && upsertUserData) {
      //  create personal room
      const { id, username } = upsertUserData?.insert_portal_user.returning[0] || {};
      const obj = { id: `${id}`, name: username, personal: true }
      upsertRoom({ variables: { obj } })
    }
  }, [upsertUserLoading, upsertUserData])
  const initialUser = (user) => {
    const { id, username, photo, nickname } = user;
    upsertUser({ variables: { objects: [{ aid: id, username, avatar: photo, nickname }] } })
  }
  return {
    initialUser,
    uid: upsertUserData?.insert_portal_user?.returning[0]?.id
  }
}

export default useUser;
