/**
 * Type Definitions
 */
export declare type ISrcItem<I, C> = {
    id: I;
    content: C;
};
export declare type IDstItem<C> = {
    content: C;
};
export declare type ISrcIndex = {
    srcIndex: number;
};
export declare type IDstIndex = {
    dstIndex: number;
};
export declare type IComparisonResult<I, C> = {
    srcOnly: (ISrcItem<I, C> & ISrcIndex)[];
    dstOnly: (IDstItem<C> & IDstIndex)[];
    both: (ISrcItem<I, C> & ISrcIndex & IDstIndex)[];
};
export declare type IRemovalStep<I> = {
    id: I;
};
export declare type IMovingStep<I> = {
    id: I;
    index: number;
};
export declare type IUpdatingStep<I, C> = {
    id: I;
    content: C;
};
export declare type ICreationStep<C> = {
    content: C;
    index: number;
};
export declare type IModificationSteps<I, C> = {
    removalSteps: IRemovalStep<I>[];
    movingSteps: IMovingStep<I>[];
    updatingSteps: IUpdatingStep<I, C>[];
    creationSteps: ICreationStep<C>[];
};
export declare class ModificationStepsSolver<I, C> {
    compareLists: (src: ISrcItem<I, C>[], dst: IDstItem<C>[]) => IComparisonResult<I, C>;
    getModificationSteps: (src: ISrcItem<I, C>[], dst: IDstItem<C>[]) => IModificationSteps<I, C>;
}
