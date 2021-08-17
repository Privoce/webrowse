/**
 * Type Definitions
 */
/// <reference types="chrome" />
export declare enum TabEvent {
    onActivated = 0,
    onAttached = 1,
    onCreated = 2,
    onDetached = 3,
    onHighlighted = 4,
    onMoved = 5,
    onRemoved = 6,
    onUpdated = 7
}
export declare type EventHandlerParams = {
    event: TabEvent.onActivated;
    rawParams: {
        activeInfo: chrome.tabs.TabActiveInfo;
    };
} | {
    event: TabEvent.onAttached;
    rawParams: {
        tabId: number;
        attachInfo: chrome.tabs.TabAttachInfo;
    };
} | {
    event: TabEvent.onCreated;
    rawParams: {
        tab: chrome.tabs.Tab;
    };
} | {
    event: TabEvent.onDetached;
    rawParams: {
        tabId: number;
        detachInfo: chrome.tabs.TabDetachInfo;
    };
} | {
    event: TabEvent.onHighlighted;
    rawParams: {
        highlightInfo: chrome.tabs.TabHighlightInfo;
    };
} | {
    event: TabEvent.onMoved;
    rawParams: {
        tabId: number;
        moveInfo: chrome.tabs.TabMoveInfo;
    };
} | {
    event: TabEvent.onRemoved;
    rawParams: {
        tabId: number;
        removeInfo: chrome.tabs.TabRemoveInfo;
    };
} | {
    event: TabEvent.onUpdated;
    rawParams: {
        tabId: number;
        changeInfo: chrome.tabs.TabChangeInfo;
        tab: chrome.tabs.Tab;
    };
};
export declare type EventHandler = (params: EventHandlerParams) => void;
export declare type Tab = {
    url: string;
};
export declare type RawTab = chrome.tabs.Tab;
export declare type Data = {
    activeTabIndex: number;
    tabs: Tab[];
};
export declare type OptionalData = {
    activeTabIndex?: number;
    tabs?: Tab[];
};
export declare type RawData = {
    tabs: RawTab[];
};
export declare type TabFeatures = {
    url: string;
};
export declare class Workspace {
    private readonly verbose;
    private readonly windowId;
    private eventHandlers;
    private isOperating;
    constructor(windowId: number, verbose?: boolean);
    /**
     * Clean-up all internal resources.
     */
    destroy: () => void;
    /**
     * Add a callback function to handle workspace events.
     * @param handlerToAdd callback function
     */
    addEventHandler: (handlerToAdd: EventHandler) => void;
    /**
     * Remove a callback function.
     * @param handlerToRemove callback function
     */
    removeEventHandler: (handlerToRemove: EventHandler) => void;
    /**
     * Read workspace and return an object in compatible format.
     */
    read: () => Promise<Data>;
    /**
     * Read workspace and return all its tabs.
     */
    readRaw: () => Promise<RawData>;
    private shouldApply;
    /**
     * Accept an object in compatible format and update the workspace to aligned with it.
     * @param data workspace data
     */
    write: (data: OptionalData, opts?: any) => Promise<void>;
    /**
     * Internal Listeners
     */
    private onActivatedListener;
    private onAttachedListener;
    private onCreatedListener;
    private onDetachedListener;
    private onHighlightedListener;
    private onMovedListener;
    private onRemovedListener;
    private onUpdatedListener;
    /**
     * Batch Listener Operations
     */
    private batchAddListeners;
    private batchRemoveListeners;
}
