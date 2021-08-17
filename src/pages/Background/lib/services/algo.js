"use strict";
/**
 * Type Definitions
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModificationStepsSolver = void 0;
var ModificationStepsSolver = /** @class */ (function () {
    function ModificationStepsSolver() {
        var _this = this;
        this.compareLists = function (src, dst) {
            var result = {
                srcOnly: [],
                dstOnly: [],
                both: [],
            };
            var srcMappedIndices = [];
            // scan for intersection
            dst.forEach(function (dstItem, dstIndex) {
                var found = src.some(function (srcItem, srcIndex) {
                    if (dstItem.content === srcItem.content && !srcMappedIndices.includes(srcIndex)) {
                        result.both.push(__assign(__assign({}, srcItem), { srcIndex: srcIndex,
                            dstIndex: dstIndex }));
                        srcMappedIndices.push(srcIndex);
                        return true;
                    }
                });
                if (!found) {
                    result.dstOnly.push(__assign(__assign({}, dstItem), { dstIndex: dstIndex }));
                }
            });
            // process the residual of src
            src.forEach(function (srcItem, srcIndex) {
                if (!srcMappedIndices.includes(srcIndex)) {
                    result.srcOnly.push(__assign(__assign({}, srcItem), { srcIndex: srcIndex }));
                }
            });
            return result;
        };
        this.getModificationSteps = function (src, dst) {
            var result = {
                removalSteps: [],
                movingSteps: [],
                updatingSteps: [],
                creationSteps: [],
            };
            var comparisonResult = _this.compareLists(src, dst);
            var srcOnly = comparisonResult.srcOnly, dstOnly = comparisonResult.dstOnly, both = comparisonResult.both;
            var reCompare = function () {
                comparisonResult = _this.compareLists(src, dst);
                srcOnly = comparisonResult.srcOnly;
                dstOnly = comparisonResult.dstOnly;
                both = comparisonResult.both;
            };
            // get removal steps
            // if `srcOnly` is longer, remove the excess part
            if (srcOnly.length > dstOnly.length) {
                // get steps
                var removalSteps_1 = srcOnly.slice(dstOnly.length, srcOnly.length).map(function (item) { return ({
                    id: item.id,
                }); });
                result.removalSteps = removalSteps_1;
                // update `src` and re-compare
                src = src.filter(function (item) { return !removalSteps_1.map(function (step) { return step.id; }).includes(item.id); });
                reCompare();
            }
            // get creation steps
            // since the `srcOnly` has been truncated, `srcOnly.length` must be smaller than or equal to `dstOnly.length`
            if (srcOnly.length < dstOnly.length) {
                result.creationSteps = dstOnly.slice(srcOnly.length).map(function (item) { return ({
                    content: item.content,
                    index: item.dstIndex,
                }); });
                // update `dst` and re-compare
                dst = dst.filter(function (_, index) { return !result.creationSteps.map(function (item) { return item.index; }).includes(index); });
                reCompare();
            }
            // get moving steps
            // now `srcOnly.length` must be equal to `dstOnly.length`
            var movingSteps = [];
            // get steps from `both`
            both.forEach(function (item) {
                movingSteps.push({
                    id: item.id,
                    index: item.dstIndex,
                });
            });
            // get steps from `srcOnly` and `dstOnly`
            dstOnly.forEach(function (dstOnlyItem, index) {
                var srcOnlyItem = srcOnly[index];
                movingSteps.push({
                    id: srcOnlyItem.id,
                    index: dstOnlyItem.dstIndex,
                });
            });
            // sort steps by index
            movingSteps = movingSteps.sort(function (a, b) { return a.index - b.index; });
            // filter steps and update `src` and re-compare
            movingSteps.forEach(function (tmpStep) {
                // locate target in `src` and get its index
                var realIndex = src.map(function (item) { return item.id; }).indexOf(tmpStep.id);
                // check if moving is necessary
                if (realIndex !== tmpStep.index) {
                    // add this step
                    result.movingSteps.push(tmpStep);
                    // update `src`
                    src = [].concat(src.slice(0, tmpStep.index), [src[realIndex]], src.slice(tmpStep.index, realIndex), src.slice(realIndex + 1));
                }
            });
            reCompare();
            // get updating steps
            // get steps from `dstOnly` and `srcOnly`
            dstOnly.forEach(function (dstOnlyItem, index) {
                var srcOnlyItem = srcOnly[index];
                result.updatingSteps.push({
                    id: srcOnlyItem.id,
                    content: dstOnlyItem.content,
                });
            });
            return result;
        };
    }
    return ModificationStepsSolver;
}());
exports.ModificationStepsSolver = ModificationStepsSolver;
