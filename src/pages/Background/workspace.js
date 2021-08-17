class Workspace {
  constructor(wid) {
    this.windowId = wid;

  }

}

const TabEvent = {
  onActivated: 0,
  onAttached: 1,
  onCreated: 2,
  onDetached: 3,
  onHighlighted: 4,
  onMoved: 5,
  onRemoved: 6,
  onUpdated: 7,
};
export { TabEvent }
export default Workspace;
