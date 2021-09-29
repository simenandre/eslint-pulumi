import {ESLintUtils} from "@typescript-eslint/experimental-utils";
import * as ts from 'typescript';
import {unionTypeParts} from 'tsutils';

// note - cannot migrate this to an import statement because it will make TSC copy the package.json to the dist folder
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
const version: string = require('../../package.json').version;

export const createRule = ESLintUtils.RuleCreator(name => `https://github.com/cobraz/eslint-pulumi/blob/v${version}/docs/rules/${name}.md`)

/**
 * Gets all of the type flags in a type, iterating through unions automatically
 */
export function getTypeFlags(type: ts.Type): ts.TypeFlags {
    let flags: ts.TypeFlags = 0;
    for (const t of unionTypeParts(type)) {
        flags |= t.flags;
    }
    return flags;
}

/**
 * Checks if the given type is (or accepts) the given flags
 * @param type … TODO
 * @param flagsToCheck … TODO
 * @param isReceiver true if the type is a receiving type (i.e. the type of a called function's parameter)
 */
export function isTypeFlagSet(
    type: ts.Type,
    flagsToCheck: ts.TypeFlags,
    isReceiver?: boolean,
): boolean {
    const flags = getTypeFlags(type);

    if (isReceiver && flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) {
        return true;
    }

    return (flags & flagsToCheck) !== 0;
}

/**
 * Resolves the given node's type. Will resolve to the type's generic constraint, if it has one.
 */
export function getConstrainedTypeAtLocation(
    checker: ts.TypeChecker,
    node: ts.Node,
): ts.Type {
    const nodeType = checker.getTypeAtLocation(node);
    const constrained = checker.getBaseConstraintOfType(nodeType);

    return constrained ?? nodeType;
}
