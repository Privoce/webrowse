import { useState, useEffect } from 'react';
import { sendMessageToBackground, MessageLocation } from '@wbet/message-api';
import { EVENTS } from '../../../common'
import { getWindowTabs, getWindowTitle } from '../utils'
import {
  useLazyQuery,
  useMutation,
  gql
} from "@apollo/client";
const REMOVE_WINDOW = gql`
mutation RmoveWindow($where: portal_window_user_bool_exp = {} ) {
  delete_portal_window_user(where: $where){
    affected_rows
    returning {
      id
      window_id
    }
  }
}
`;
const UPSERT_WINDOW = gql`
  mutation UpsertWindow($obj: [portal_window_insert_input!]!) {
    insert_portal_window(objects: $obj, on_conflict: {constraint: window_id_key, update_columns: title}) {
      affected_rows
      returning {
        id
        room
        title
        tabs {
          id
        }
      }
    }
  }
`;
const INSERT_TABS = gql`
  mutation InsertTabs($objs:[portal_tab_insert_input!]!) {
    insert_portal_tab(objects: $objs) {
      affected_rows
      returning {
        id
        updated_at
        window
      }
    }
  }
`;
const CLEAR_TABS = gql`
  mutation ClearTabs($winId: uuid!) {
    delete_portal_tab(where: {window: {_eq: $winId}}) {
      affected_rows
      returning {
        url
        title
        window
        id
      }
    }
  }
`;
const INSERT_WIN_USER = gql`
  mutation InsertWindowUser($obj: [portal_window_user_insert_input!]!) {
    insert_portal_window_user(objects: $obj, on_conflict: {constraint: window_user_window_id_user_id_key, update_columns: window_id}) {
      affected_rows
      returning {
        id
        created_at
      }
    }
  }
`;
const WINDOW_USER = gql`
    query WindowUser($wid: uuid = "", $uid: bigint = "") {
      portal_window_user(where: {_and: {user_id: {_eq: $uid}, window_id: {_eq: $wid}}}) {
        id
        user_id
        window_id
      }
    }
`;

const SAVED_WINDOWS = gql`
  query WindowList($uid: bigint ) {
    portal_window_user(where: {user_id: {_eq: $uid}},order_by: {updated_at: desc}) {
      attr
      created_at
      updated_at
      id
      window {
        id
        room
        created_at
        active
        tabs {
          id
          title
          updated_at
          url
          icon
        }
        title
        updated_at
      }
      window_id
      user_id
    }
  }
`;
const useWindow = (uid) => {
  // const [fav, setFav] = useState(false)
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [windows, setWindows] = useState([])
  const [loadWindows, { loading, data, refetch: reloadWindows }] = useLazyQuery(SAVED_WINDOWS);
  const [loadWindowUser, { loading: winUserLoading, data: windowUserData, refetch: reloadWindowUser }] = useLazyQuery(WINDOW_USER);
  const [remove, { loading: removeLoading }] = useMutation(REMOVE_WINDOW, { refetchQueries: [{ query: SAVED_WINDOWS }, { query: WINDOW_USER }] });

  const [upsertWindow] = useMutation(UPSERT_WINDOW);
  const [insertWinUser] = useMutation(INSERT_WIN_USER, { refetchQueries: [{ query: WINDOW_USER }] });
  const [clearTabs] = useMutation(CLEAR_TABS);
  const [insertTabs] = useMutation(INSERT_TABS, { refetchQueries: [{ query: SAVED_WINDOWS }] });
  const continueNexts = async ({ winId, uid, tabs, hasTabs }) => {
    try {
      await insertWinUser({ variables: { obj: { window_id: winId, user_id: uid } } });
      if (hasTabs) {
        await clearTabs({ variables: { winId } });
      }
      insertTabs({
        variables: {
          objs: tabs.map((tab) => {
            tab.window = winId;
            return tab;
          })
        },
        onQueryUpdated: () => {
          return reloadWindows()
        }
      })
    } catch (error) {
      setSaving(false)
      console.log("upsert window error", error);
    }
  }

  const saveWindow = async (data = {}) => {
    setSaving(true);
    const { tabs = [], ...obj } = data;
    const { data: gData } = await upsertWindow({ variables: { obj } });
    const newObj = gData.insert_portal_window.returning[0] || {};
    const { id: win_id, tabs: savedTabs } = newObj;
    if (win_id) {
      console.log("uid in hooks", uid);
      await continueNexts({ winId: win_id, uid, tabs, hasTabs: !!savedTabs.length })
    }
    setSaving(false)
    return newObj
  }
  const updateWindowTitle = async (data = {}) => {
    setUpdating(true);
    const { id, title } = data;
    if (id) {
      await upsertWindow({ variables: { obj: { id, title } } });
    }
    setUpdating(false)
  }
  useEffect(() => {
    if (uid) {
      loadWindows({ variables: { uid } })
    }
  }, [uid]);
  useEffect(() => {
    if (data) {
      const formated = data?.portal_window_user?.map(({ id: rid, window }) => {
        const { id, title, room, active } = window;
        const tabs = window.tabs.map(({ url, icon, title, id }) => {
          return { id, url, icon, title, windowId: window.id }
        });
        return { relation_id: rid, id, title, room, tabs, active }
      })
      setWindows(formated);
      chrome.storage.sync.set({ [`local_windows`]: formated })
    } else {
      chrome.storage.sync.get(['local_windows'], (res) => {
        const { local_windows } = res;
        if (local_windows) {
          setWindows(local_windows)
        }
      })
    }
  }, [data]);
  const removeWindow = (data = {}) => {
    if (!data.rid) return;
    const where = { id: { _eq: data.rid } }
    remove({
      variables: { where },
      onQueryUpdated: () => {
        return reloadWindows();
      }
    })
  }
  const checkFavorite = (wid) => {
    if (wid) {
      loadWindowUser({ variables: { wid, uid } })
    }
  }
  const toggleFavorite = async ({ wid, fav = false }) => {
    if (!wid) return;
    const where = { _and: { window_id: { _eq: wid }, user_id: { _eq: uid } } };
    if (!fav) {
      remove({
        variables: { where },
        onQueryUpdated: () => {
          return reloadWindowUser();
        }
      })
    } else {
      // update title to ensure window exsit
      const title = await getWindowTitle() || 'Temporary Window';
      const tabs = await getWindowTabs();
      await saveWindow({ id: wid, title, tabs })
      insertWinUser({
        variables: { obj: { window_id: wid, user_id: uid } },
        onQueryUpdated: () => {
          return reloadWindowUser()
        }
      });
    }
  }
  useEffect(() => {
    if (!winUserLoading && windowUserData) {
      const isFav = !!windowUserData.portal_window_user?.length;
      // 同步给background
      sendMessageToBackground({ fav: isFav }, MessageLocation.Content, EVENTS.TOGGLE_FAV)
    }
  }, [winUserLoading, windowUserData])
  return {
    windows,
    removeWindow,
    loadWindows,
    reloadWindows,
    saveWindow,
    updateWindowTitle,
    checkFavorite,
    toggleFavorite,
    // favorite: fav,
    loading,
    updating,
    removing: removeLoading,
    saving
  }
}
export default useWindow
