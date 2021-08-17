/* eslint-disable no-fallthrough */

"use strict";
/**
 * Type Definitions
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0: case 1: t = op; break;
        case 4: _.label++; return { value: op[1], done: false };
        case 5: _.label++; y = op[1]; op = [0]; continue;
        case 7: op = _.ops.pop(); _.trys.pop(); continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
          if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
          if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
          if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
          if (t[2]) _.ops.pop();
          _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workspace = exports.TabEvent = void 0;
var algo_1 = require("../services/algo");
var TabEvent;
(function (TabEvent) {
  TabEvent[TabEvent["onActivated"] = 0] = "onActivated";
  TabEvent[TabEvent["onAttached"] = 1] = "onAttached";
  TabEvent[TabEvent["onCreated"] = 2] = "onCreated";
  TabEvent[TabEvent["onDetached"] = 3] = "onDetached";
  TabEvent[TabEvent["onHighlighted"] = 4] = "onHighlighted";
  TabEvent[TabEvent["onMoved"] = 5] = "onMoved";
  TabEvent[TabEvent["onRemoved"] = 6] = "onRemoved";
  TabEvent[TabEvent["onUpdated"] = 7] = "onUpdated";
})(TabEvent = exports.TabEvent || (exports.TabEvent = {}));
/**
 * Utilities
 */
var checkEnv = function () {
  if (typeof chrome === 'undefined') {
    throw new ReferenceError('chrome is not defined, make sure you are using this package within a chrome environment');
  }
  if (typeof chrome.tabs === 'undefined') {
    throw new ReferenceError('chrome.tab is not defined, make sure you are using this package with a chrome extension environment');
  }
};
var queryAllTabs = function (windowId) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0: return [4 /*yield*/, new Promise(function (resolve) {
          chrome.tabs.query({ windowId: windowId }, resolve);
        })];
        case 1: return [2 /*return*/, _a.sent()];
      }
    });
  });
};
var rawTab2Tab = function (rawTab) {
  return ({
    url: rawTab.url || '',
  });
};
var removeTab = function (id) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0: return [4 /*yield*/, new Promise(function (resolve) {
          chrome.tabs.remove(id, resolve);
        })];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
};
var moveTab = function (id, index) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0: return [4 /*yield*/, new Promise(function (resolve) {
          chrome.tabs.move(id, {
            index: index,
          }, function () {
            resolve();
          });
        })];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
};
var updateTab = function (id, url) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0: return [4 /*yield*/, new Promise(function (resolve) {
          chrome.tabs.update(id, {
            url: url,
          }, function () {
            resolve();
          });
        })];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
};
var createTab = function (windowId, index, url) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0: return [4 /*yield*/, new Promise(function (resolve) {
          chrome.tabs.create({
            windowId: windowId,
            index: index,
            url: url,
            active: false,
          }, function () {
            resolve();
          });
        })];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
};
var activateTab = function (windowId, index) {
  return __awaiter(void 0, void 0, void 0, function () {
    var allTabs;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0: return [4 /*yield*/, queryAllTabs(windowId)];
        case 1:
          allTabs = _a.sent();
          return [4 /*yield*/, new Promise(function (resolve) {
            var _a, _b;
            chrome.tabs.update(typeof ((_a = allTabs[index]) === null || _a === void 0 ? void 0 : _a.id) !== 'undefined' ? (_b = allTabs[index]) === null || _b === void 0 ? void 0 : _b.id : -1, {
              active: true,
            }, function () {
              resolve();
            });
          })];
        case 2:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
};
var stringifyTabFeatures = function (tabFeatures) {
  return JSON.stringify(tabFeatures);
};
var parseTabFeatures = function (tabFeatures) {
  return JSON.parse(tabFeatures);
};
var Workspace = /** @class */ (function () {
  function Workspace(windowId, verbose) {
    var _this = this;
    if (verbose === void 0) { verbose = false; }
    /**
     * Clean-up all internal resources.
     */
    this.destroy = function () {
      _this.batchRemoveListeners();
    };
    /**
     * Add a callback function to handle workspace events.
     * @param handlerToAdd callback function
     */
    this.addEventHandler = function (handlerToAdd) {
      _this.eventHandlers.push(handlerToAdd);
    };
    /**
     * Remove a callback function.
     * @param handlerToRemove callback function
     */
    this.removeEventHandler = function (handlerToRemove) {
      _this.eventHandlers = _this.eventHandlers.filter(function (handler) { return handler !== handlerToRemove; });
    };
    /**
     * Read workspace and return an object in compatible format.
     */
    this.read = function () {
      return __awaiter(_this, void 0, void 0, function () {
        var tabs, index;
        var _a;
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0: return [4 /*yield*/, queryAllTabs(this.windowId)];
            case 1:
              tabs = _b.sent();
              index = (_a = tabs.filter(function (tab) { return tab.active; })[0]) === null || _a === void 0 ? void 0 : _a.index;
              return [2 /*return*/, {
                activeTabIndex: typeof index !== 'undefined' ? index : -1,
                tabs: tabs.map(rawTab2Tab),
              }];
          }
        });
      });
    };
    /**
     * Read workspace and return all its tabs.
     */
    this.readRaw = function () {
      return __awaiter(_this, void 0, void 0, function () {
        var tabs;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0: return [4 /*yield*/, queryAllTabs(this.windowId)];
            case 1:
              tabs = _a.sent();
              return [2 /*return*/, {
                tabs: tabs,
              }];
          }
        });
      });
    };
    this.shouldApply = function (filter, evt) {
      if (filter === void 0) { filter = []; }
      if (filter.length == 0)
        return true;
      return filter.includes(evt);
    };
    /**
     * Accept an object in compatible format and update the workspace to aligned with it.
     * @param data workspace data
     */
    this.write = function (data, opts) {
      if (opts === void 0) { opts = {}; }
      return __awaiter(_this, void 0, void 0, function () {
        var filter, src, dst, mss, steps, i, shouldActive;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              this.isOperating = true;
              filter = opts.filter;
              if (!(typeof data.tabs !== 'undefined')) return [3 /*break*/, 17];
              return [4 /*yield*/, queryAllTabs(this.windowId)];
            case 1:
              src = (_a.sent()).map(function (tab) {
                return ({
                  id: typeof tab.id !== 'undefined' ? tab.id : -1,
                  content: stringifyTabFeatures({ url: tab.url || '' }),
                });
              });
              dst = data.tabs.map(function (tab) {
                return ({
                  content: stringifyTabFeatures({ url: tab.url || '' }),
                });
              });
              mss = new algo_1.ModificationStepsSolver();
              steps = mss.getModificationSteps(src, dst);
              if (this.verbose) {
                console.log({ steps: steps });
              }
              if (!this.shouldApply(filter, TabEvent.onRemoved)) return [3 /*break*/, 5];
              i = 0;
              _a.label = 2;
            case 2:
              if (!(i < steps.removalSteps.length)) return [3 /*break*/, 5];
              return [4 /*yield*/, removeTab(steps.removalSteps[i].id)];
            case 3:
              _a.sent();
              _a.label = 4;
            case 4:
              i++;
              return [3 /*break*/, 2];
            case 5:
              if (!this.shouldApply(filter, TabEvent.onMoved)) return [3 /*break*/, 9];
              i = 0;
              _a.label = 6;
            case 6:
              if (!(i < steps.movingSteps.length)) return [3 /*break*/, 9];
              return [4 /*yield*/, moveTab(steps.movingSteps[i].id, steps.movingSteps[i].index)];
            case 7:
              _a.sent();
              _a.label = 8;
            case 8:
              i++;
              return [3 /*break*/, 6];
            case 9:
              if (!this.shouldApply(filter, TabEvent.onUpdated)) return [3 /*break*/, 13];
              i = 0;
              _a.label = 10;
            case 10:
              if (!(i < steps.updatingSteps.length)) return [3 /*break*/, 13];
              return [4 /*yield*/, updateTab(steps.updatingSteps[i].id, parseTabFeatures(steps.updatingSteps[i].content).url)];
            case 11:
              _a.sent();
              _a.label = 12;
            case 12:
              i++;
              return [3 /*break*/, 10];
            case 13:
              if (!this.shouldApply(filter, TabEvent.onCreated)) return [3 /*break*/, 17];
              i = 0;
              _a.label = 14;
            case 14:
              if (!(i < steps.creationSteps.length)) return [3 /*break*/, 17];
              return [4 /*yield*/, createTab(this.windowId, steps.creationSteps[i].index, parseTabFeatures(steps.creationSteps[i].content).url)];
            case 15:
              _a.sent();
              _a.label = 16;
            case 16:
              i++;
              return [3 /*break*/, 14];
            case 17:
              if (!(typeof data.activeTabIndex !== 'undefined')) return [3 /*break*/, 19];
              shouldActive = this.shouldApply(filter, TabEvent.onActivated) || this.shouldApply(filter, TabEvent.onHighlighted);
              console.log("workspace api", { filter: filter, shouldActive: shouldActive });
              if (!shouldActive) return [3 /*break*/, 19];
              return [4 /*yield*/, activateTab(this.windowId, data.activeTabIndex)];
            case 18:
              _a.sent();
              _a.label = 19;
            case 19:
              this.isOperating = false;
              return [2 /*return*/];
          }
        });
      });
    };
    /**
     * Internal Listeners
     */
    this.onActivatedListener = function (activeInfo) {
      if (!_this.isOperating && _this.eventHandlers.length !== 0 && activeInfo.windowId === _this.windowId) {
        _this.eventHandlers.map(function (handler) { return handler({ event: TabEvent.onActivated, rawParams: { activeInfo: activeInfo } }); });
      }
    };
    this.onAttachedListener = function (tabId, attachInfo) {
      if (!_this.isOperating && _this.eventHandlers.length !== 0 && attachInfo.newWindowId === _this.windowId) {
        _this.eventHandlers.map(function (handler) { return handler({ event: TabEvent.onAttached, rawParams: { tabId: tabId, attachInfo: attachInfo } }); });
      }
    };
    this.onCreatedListener = function (tab) {
      if (!_this.isOperating && _this.eventHandlers.length !== 0 && tab.windowId === _this.windowId) {
        _this.eventHandlers.map(function (handler) { return handler({ event: TabEvent.onCreated, rawParams: { tab: tab } }); });
      }
    };
    this.onDetachedListener = function (tabId, detachInfo) {
      if (!_this.isOperating && _this.eventHandlers.length !== 0 && detachInfo.oldWindowId === _this.windowId) {
        _this.eventHandlers.map(function (handler) { return handler({ event: TabEvent.onDetached, rawParams: { tabId: tabId, detachInfo: detachInfo } }); });
      }
    };
    this.onHighlightedListener = function (highlightInfo) {
      if (!_this.isOperating && _this.eventHandlers.length !== 0 && highlightInfo.windowId === _this.windowId) {
        _this.eventHandlers.map(function (handler) { return handler({ event: TabEvent.onHighlighted, rawParams: { highlightInfo: highlightInfo } }); });
      }
    };
    this.onMovedListener = function (tabId, moveInfo) {
      if (!_this.isOperating && _this.eventHandlers.length !== 0 && moveInfo.windowId === _this.windowId) {
        _this.eventHandlers.map(function (handler) { return handler({ event: TabEvent.onMoved, rawParams: { tabId: tabId, moveInfo: moveInfo } }); });
      }
    };
    this.onRemovedListener = function (tabId, removeInfo) {
      if (!_this.isOperating && _this.eventHandlers.length !== 0 && removeInfo.windowId === _this.windowId) {
        _this.eventHandlers.map(function (handler) { return handler({ event: TabEvent.onRemoved, rawParams: { tabId: tabId, removeInfo: removeInfo } }); });
      }
    };
    this.onUpdatedListener = function (tabId, changeInfo, tab) {
      if (!_this.isOperating && _this.eventHandlers.length !== 0 && tab.windowId === _this.windowId) {
        _this.eventHandlers.map(function (handler) {
          return handler({ event: TabEvent.onUpdated, rawParams: { tabId: tabId, changeInfo: changeInfo, tab: tab } });
        });
      }
    };
    /**
     * Batch Listener Operations
     */
    this.batchAddListeners = function () {
      chrome.tabs.onActivated.addListener(_this.onActivatedListener);
      chrome.tabs.onAttached.addListener(_this.onAttachedListener);
      chrome.tabs.onCreated.addListener(_this.onCreatedListener);
      chrome.tabs.onDetached.addListener(_this.onDetachedListener);
      chrome.tabs.onHighlighted.addListener(_this.onHighlightedListener);
      chrome.tabs.onMoved.addListener(_this.onMovedListener);
      chrome.tabs.onRemoved.addListener(_this.onRemovedListener);
      chrome.tabs.onUpdated.addListener(_this.onUpdatedListener);
    };
    this.batchRemoveListeners = function () {
      chrome.tabs.onActivated.removeListener(_this.onActivatedListener);
      chrome.tabs.onAttached.removeListener(_this.onAttachedListener);
      chrome.tabs.onCreated.removeListener(_this.onCreatedListener);
      chrome.tabs.onDetached.removeListener(_this.onDetachedListener);
      chrome.tabs.onHighlighted.removeListener(_this.onHighlightedListener);
      chrome.tabs.onMoved.removeListener(_this.onMovedListener);
      chrome.tabs.onRemoved.removeListener(_this.onRemovedListener);
      chrome.tabs.onUpdated.removeListener(_this.onUpdatedListener);
    };
    this.verbose = verbose;
    checkEnv();
    this.windowId = windowId;
    this.eventHandlers = [];
    this.isOperating = false;
    this.batchAddListeners();
  }
  return Workspace;
}());
exports.Workspace = Workspace;
