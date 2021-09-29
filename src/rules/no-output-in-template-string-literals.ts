import {
    TSESTree,
    // AST_NODE_TYPES,
    ESLintUtils,
} from '@typescript-eslint/experimental-utils';
import * as util from '../util';
import {getTypeFlags} from "../util";

type Options = [
    {
        // allowNumber?: boolean;
        // allowBoolean?: boolean;
        // allowAny?: boolean;
        // allowNullish?: boolean;
        // allowRegExp?: boolean;
    },
];

// TODO
const messages = {
    'invalidType': 'Invalid type "{{type}}" of template literal expression.',
};
type MessageId = keyof typeof messages;

export default util.createRule<Options, MessageId>({
    name: '@eslint-pulumi/no-output-in-template-string-literals',
    meta: {
        type: 'problem',
        docs: {
            description: 'Enforce Pulumi Output objects to not be used in template string literal expressions',
            category: 'Possible Errors',
            recommended: 'error',
            requiresTypeChecking: true,
        },
        messages,
        schema: [
            {
                type: 'object',
                properties: {
                    // allowNumber: { type: 'boolean' },
                    // allowBoolean: { type: 'boolean' },
                    // allowAny: { type: 'boolean' },
                    // allowNullish: { type: 'boolean' },
                    // allowRegExp: { type: 'boolean' },
                },
            },
        ],
    },
    defaultOptions: [{}],
    create(
        context
    ) {
        console.log('CREATING');
        const service = ESLintUtils.getParserServices(context);
        const typeChecker = service.program.getTypeChecker();

        // function isUnderlyingTypePrimitive(type: ts.Type): boolean {
        //     if (
        //         options.allowBoolean &&
        //         util.isTypeFlagSet(type, ts.TypeFlags.BooleanLike)
        //     ) {
        //         return true;
        //     }
        //
        //     if (options.allowAny && util.isTypeAnyType(type)) {
        //         return true;
        //     }
        //
        //     if (
        //         options.allowRegExp &&
        //         util.getTypeName(typeChecker, type) === 'RegExp'
        //     ) {
        //         return true;
        //     }
        //
        //     if (
        //         options.allowNullish &&
        //         util.isTypeFlagSet(type, ts.TypeFlags.Null | ts.TypeFlags.Undefined)
        //     ) {
        //         return true;
        //     }
        //
        //     return false;
        // }
        //
        return {
            TemplateLiteral(
                node: TSESTree.TemplateLiteral
            ): void {
                //         // don't check tagged template literals
                //         if (node.parent!.type === AST_NODE_TYPES.TaggedTemplateExpression) {
                //             return;
                //         }
                //
                        for (const expression of node.expressions) {
                            const expressionType = util.getConstrainedTypeAtLocation(
                                typeChecker,
                                service.esTreeNodeToTSNodeMap.get(expression),
                            );

                            // TODO: look at https://github.com/typescript-eslint/typescript-eslint/blob/02c6ff3c5a558f9308d7166d524156dc12e32759/packages/eslint-plugin/src/rules/ban-types.ts#L31 to see how to check if something is a specific type
                            let report = {
                                node, messageId: 'invalidType' as const, data: {
                                    type: typeChecker.typeToString(expressionType),
                                    typeFlags: getTypeFlags(expressionType),
                                    apparentType: typeChecker.typeToString(typeChecker.getApparentType(expressionType)),
                                    defaultFromTypeParameter: typeChecker.getDefaultFromTypeParameter(expressionType) ,
                                    indexInfosOfType: typeChecker.getIndexInfosOfType(expressionType) ,
                                    widenedType: typeChecker.typeToString(typeChecker.getWidenedType(expressionType)),
                                }
                            };
                            context.report(report)
                            console.log('report', {...report.data})
                        }
                //
                //             // if (
                //             //     !isInnerUnionOrIntersectionConformingTo(
                //             //         expressionType,
                //             //         isUnderlyingTypePrimitive,
                //             //     )
                //             // ) {
                //             //     context.report({
                //             //         node: expression,
                //             //         messageId: 'invalidType',
                //             //         data: { type: typeChecker.typeToString(expressionType) },
                //             //     });
                //             // }
                //         }
                //     },
                // };
                // //
                // // function isInnerUnionOrIntersectionConformingTo(
                // //     type: ts.Type,
                // //     predicate: (underlyingType: ts.Type) => boolean,
                // // ): boolean {
                // //     return rec(type);
                // //
                // //     function rec(innerType: ts.Type): boolean {
                // //         if (innerType.isUnion()) {
                // //             return innerType.types.every(rec);
                // //         }
                // //
                // //         if (innerType.isIntersection()) {
                // //             return innerType.types.some(rec);
                // //         }
                // //
                // //         return predicate(innerType);
                // //     }
                // // }
            }
            }
    },
});
