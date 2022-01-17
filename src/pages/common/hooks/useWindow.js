import { useState, useEffect } from 'react';
import { sendMessageToBackground, MessageLocation } from '@wbet/message-api';
import EVENTS from '../../common/events'
import { getWindowTabs, getWindowTitle } from '../utils'
import {
  useLazyQuery,
  useMutation,
  gql
} from "@apollo/client";
const REMOVE_WINDOW = gql`
mutation RemoveWindow($wid: uuid!) {
  delete_portal_window(where: {id: {_eq: $wid}}) {
    affected_rows
    returning {
      id
      title
    }
  }
}
`;
const REMOVE_WINDOW_RELATION = gql`
mutation RmoveWindowRelation($where: portal_window_user_bool_exp = {} ) {
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
        owner
        user{
          username
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
    insert_portal_window_user(objects: $obj, on_conflict: {constraint: window_user_user_id_window_id_attr_key, update_columns: window_id}) {
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
        attr
        user_id
        window_id
      }
    }
`;
const WINDOW_USER_BY_WID = gql`
    query WindowUser($wid: uuid = "") {
      portal_window_user(where: { window_id: {_eq: $wid}}) {
        id
        attr
        user_id
        window_id
      }
    }
`;

const SAVED_WINDOWS = gql`
  query WindowList($uid: bigint ) {
    portal_window_user(where: {user_id: {_eq: $uid}},order_by: {window: {updated_at: desc}}) {
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
  const [relationWithWid] = useLazyQuery(WINDOW_USER_BY_WID);
  const [loadWindowUser, { loading: winUserLoading, data: windowUserData, refetch: reloadWindowUser }] = useLazyQuery(WINDOW_USER);
  const [removeWindowFromDB] = useMutation(REMOVE_WINDOW);
  const [removeRelation, { loading: removeRelationLoading }] = useMutation(REMOVE_WINDOW_RELATION, { refetchQueries: [{ query: SAVED_WINDOWS }, { query: WINDOW_USER }] });

  const [upsertWindow] = useMutation(UPSERT_WINDOW);
  const [insertWinUser] = useMutation(INSERT_WIN_USER, { refetchQueries: [{ query: WINDOW_USER }] });
  const [clearTabs] = useMutation(CLEAR_TABS);
  const [insertTabs] = useMutation(INSERT_TABS, { refetchQueries: [{ query: SAVED_WINDOWS }] });
  const continueNexts = async ({ winId, uid, tabs, hasTabs, attr = 'save', onlySave }) => {
    try {
      if (!onlySave) {
        await insertWinUser({ variables: { obj: { window_id: winId, user_id: uid, attr } } });
      }
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
    const { onlySave = false, tabs = [], attr = "save", ...obj } = data;
    const { data: gData } = await upsertWindow({ variables: { obj: { ...obj, owner: uid } } });
    const newObj = gData.insert_portal_window.returning[0] || {};
    const { id: win_id, tabs: savedTabs } = newObj;
    if (win_id) {
      console.log("uid in hooks", uid);
      await continueNexts({ winId: win_id, uid, tabs, hasTabs: !!savedTabs.length, attr, onlySave })
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
      const favs = [];
      let formated = data?.portal_window_user?.map(({ id: rid, window, attr }) => {
        if (attr == 'fav') {
          favs.push(window.id);
          return null;
        }
        const { id, title, room, active, updated_at } = window;
        const tabs = window.tabs.map(({ url, icon, title, id }) => {
          return { id, url, icon, title, windowId: window.id }
        });
        return { relation_id: rid, id, title, room, tabs, active, updated_at }
      })
      formated = formated?.filter(w => !!w).map(w => {
        if (favs.includes(w.id)) {
          w.fav = true;
        }
        return w;
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
  const tryClearWindowData = async (wid) => {
    if (!wid) return;
    try {
      const { data } = await relationWithWid({ variables: { wid } });
      console.log("relation with wid", data);
      if (data?.portal_window_user?.length === 0) {
        // 尝试清除window数据
        await removeWindowFromDB({ variables: { wid } })
      }
    } catch (error) {
      console.log("clear window data error", error);
    }
  }
  const removeWindow = async (data = {}) => {
    if (!data.rid) return;
    const where = { id: { _eq: data.rid } }
    const { data: removeData } = await removeRelation({
      variables: { where },
      onQueryUpdated: () => {
        return reloadWindows();
      }
    });
    const winId = removeData.delete_portal_window_user.returning[0]?.window_id;
    if (winId) {
      await tryClearWindowData(winId)
    }
    console.log("remove data", removeData);
  }
  const checkFavorite = (wid) => {
    if (wid) {
      loadWindowUser({ variables: { wid, uid } })
    }
  }
  const toggleFavorite = async ({ wid, fav = false }) => {
    if (!wid) return;
    const where = { _and: { window_id: { _eq: wid }, user_id: { _eq: uid }, attr: { _eq: 'fav' } } };
    if (!fav) {
      await removeRelation({
        variables: { where },
        onQueryUpdated: () => {
          return reloadWindowUser();
        }
      });
      await tryClearWindowData(wid)
    } else {
      // update title to ensure window exsit
      const title = await getWindowTitle() || 'Temporary Window';
      const tabs = await getWindowTabs();
      await saveWindow({ id: wid, title, tabs, attr: 'fav' })
      await insertWinUser({
        variables: { obj: { window_id: wid, user_id: uid, attr: "fav" } },
        onQueryUpdated: () => {
          return reloadWindowUser()
        }
      });
    }
  }
  useEffect(() => {
    if (!winUserLoading && windowUserData) {
      const filtered = windowUserData.portal_window_user?.filter(({ attr }) => attr == 'fav');
      const isFav = !!filtered?.length;
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
    removing: removeRelationLoading,
    saving
  }
}
export default useWindow
