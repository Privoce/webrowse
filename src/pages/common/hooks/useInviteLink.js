import { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
const UPSERT_INVITE = gql`
  mutation UpsertInvite(
    $objects: [portal_invite_insert_input!] = { rand: "", data: "" }
  ) {
    insert_portal_invite(
      objects: $objects
      on_conflict: { update_columns: data, constraint: invite_data_key }
    ) {
      affected_rows
      returning {
        id
        rand
        updated_at
        created_at
      }
    }
  }
`;
export default function useInviteLink({ roomId, winId }) {
  const [upsertInvite, { data, loading }] = useMutation(UPSERT_INVITE);
  const [inviteLink, setInviteLink] = useState("");

  useEffect(() => {
    console.log("debug", winId, roomId);
    if (roomId && winId) {
      upsertInvite({
        variables: {
          objects: {
            data: `${roomId}|${winId}`,
            rand: Math.random().toString(36).substring(7),
          },
        },
      });
    }
  }, [roomId, winId]);
  useEffect(() => {
    console.log("debug", loading, data);
    if (!loading && data) {
      const [{ id, rand, update_at }] = data.insert_portal_invite.returning;
      console.log({ id, rand, update_at });
      if (rand) {
        setInviteLink(`https://webrow.se/i#${rand}`);
      }
    }
  }, [data, loading]);
  const getInviteLink = async (data = null) => {
    if (!data) return "";
    const { roomId, winId } = data;
    const resp = await upsertInvite({
      variables: {
        objects: {
          data: `${roomId}|${winId}`,
          rand: Math.random().toString(36).substring(7),
        },
      },
    });
    const [obj] = resp.data.insert_portal_invite.returning;
    return `https://webrow.se/i#${obj.rand}`;
  };
  return {
    getInviteLink,
    link: inviteLink,
  };
}
