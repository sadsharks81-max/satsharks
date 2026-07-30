// src/core/compat.ts
var Feature = /* @__PURE__ */ ((Feature2) => {
  Feature2[Feature2["AggregateError"] = 1] = "AggregateError";
  Feature2[Feature2["ArrowFunction"] = 2] = "ArrowFunction";
  Feature2[Feature2["ErrorPrototypeStack"] = 4] = "ErrorPrototypeStack";
  Feature2[Feature2["ObjectAssign"] = 8] = "ObjectAssign";
  Feature2[Feature2["BigIntTypedArray"] = 16] = "BigIntTypedArray";
  Feature2[Feature2["RegExp"] = 32] = "RegExp";
  return Feature2;
})(Feature || {});
var ALL_ENABLED = 1 /* AggregateError */ | 2 /* ArrowFunction */ | 4 /* ErrorPrototypeStack */ | 8 /* ObjectAssign */ | 16 /* BigIntTypedArray */ | 32 /* RegExp */;

// src/core/symbols.ts
var SYM_ASYNC_ITERATOR = Symbol.asyncIterator;
var SYM_HAS_INSTANCE = Symbol.hasInstance;
var SYM_IS_CONCAT_SPREADABLE = Symbol.isConcatSpreadable;
var SYM_ITERATOR = Symbol.iterator;
var SYM_MATCH = Symbol.match;
var SYM_MATCH_ALL = Symbol.matchAll;
var SYM_REPLACE = Symbol.replace;
var SYM_SEARCH = Symbol.search;
var SYM_SPECIES = Symbol.species;
var SYM_SPLIT = Symbol.split;
var SYM_TO_PRIMITIVE = Symbol.toPrimitive;
var SYM_TO_STRING_TAG = Symbol.toStringTag;
var SYM_UNSCOPABLES = Symbol.unscopables;

// src/core/constants.ts
var SYMBOL_STRING = {
  [0 /* AsyncIterator */]: "Symbol.asyncIterator",
  [1 /* HasInstance */]: "Symbol.hasInstance",
  [2 /* IsConcatSpreadable */]: "Symbol.isConcatSpreadable",
  [3 /* Iterator */]: "Symbol.iterator",
  [4 /* Match */]: "Symbol.match",
  [5 /* MatchAll */]: "Symbol.matchAll",
  [6 /* Replace */]: "Symbol.replace",
  [7 /* Search */]: "Symbol.search",
  [8 /* Species */]: "Symbol.species",
  [9 /* Split */]: "Symbol.split",
  [10 /* ToPrimitive */]: "Symbol.toPrimitive",
  [11 /* ToStringTag */]: "Symbol.toStringTag",
  [12 /* Unscopables */]: "Symbol.unscopables"
};
var INV_SYMBOL_REF = {
  [SYM_ASYNC_ITERATOR]: 0 /* AsyncIterator */,
  [SYM_HAS_INSTANCE]: 1 /* HasInstance */,
  [SYM_IS_CONCAT_SPREADABLE]: 2 /* IsConcatSpreadable */,
  [SYM_ITERATOR]: 3 /* Iterator */,
  [SYM_MATCH]: 4 /* Match */,
  [SYM_MATCH_ALL]: 5 /* MatchAll */,
  [SYM_REPLACE]: 6 /* Replace */,
  [SYM_SEARCH]: 7 /* Search */,
  [SYM_SPECIES]: 8 /* Species */,
  [SYM_SPLIT]: 9 /* Split */,
  [SYM_TO_PRIMITIVE]: 10 /* ToPrimitive */,
  [SYM_TO_STRING_TAG]: 11 /* ToStringTag */,
  [SYM_UNSCOPABLES]: 12 /* Unscopables */
};
var SYMBOL_REF = {
  [0 /* AsyncIterator */]: SYM_ASYNC_ITERATOR,
  [1 /* HasInstance */]: SYM_HAS_INSTANCE,
  [2 /* IsConcatSpreadable */]: SYM_IS_CONCAT_SPREADABLE,
  [3 /* Iterator */]: SYM_ITERATOR,
  [4 /* Match */]: SYM_MATCH,
  [5 /* MatchAll */]: SYM_MATCH_ALL,
  [6 /* Replace */]: SYM_REPLACE,
  [7 /* Search */]: SYM_SEARCH,
  [8 /* Species */]: SYM_SPECIES,
  [9 /* Split */]: SYM_SPLIT,
  [10 /* ToPrimitive */]: SYM_TO_PRIMITIVE,
  [11 /* ToStringTag */]: SYM_TO_STRING_TAG,
  [12 /* Unscopables */]: SYM_UNSCOPABLES
};
var CONSTANT_STRING = {
  [2 /* True */]: "!0",
  [3 /* False */]: "!1",
  [1 /* Undefined */]: "void 0",
  [0 /* Null */]: "null",
  [4 /* NegZero */]: "-0",
  [5 /* Inf */]: "1/0",
  [6 /* NegInf */]: "-1/0",
  [7 /* Nan */]: "0/0"
};
var NIL = void 0;
var CONSTANT_VAL = {
  [2 /* True */]: true,
  [3 /* False */]: false,
  [1 /* Undefined */]: NIL,
  [0 /* Null */]: null,
  [4 /* NegZero */]: -0,
  [5 /* Inf */]: Number.POSITIVE_INFINITY,
  [6 /* NegInf */]: Number.NEGATIVE_INFINITY,
  [7 /* Nan */]: Number.NaN
};
var ERROR_CONSTRUCTOR_STRING = {
  [0 /* Error */]: "Error",
  [1 /* EvalError */]: "EvalError",
  [2 /* RangeError */]: "RangeError",
  [3 /* ReferenceError */]: "ReferenceError",
  [4 /* SyntaxError */]: "SyntaxError",
  [5 /* TypeError */]: "TypeError",
  [6 /* URIError */]: "URIError"
};
var ERROR_CONSTRUCTOR = {
  [0 /* Error */]: Error,
  [1 /* EvalError */]: EvalError,
  [2 /* RangeError */]: RangeError,
  [3 /* ReferenceError */]: ReferenceError,
  [4 /* SyntaxError */]: SyntaxError,
  [5 /* TypeError */]: TypeError,
  [6 /* URIError */]: URIError
};

// src/core/node.ts
function createSerovalNode(t, i, s, c, m, p, e, a, f, b, o, l) {
  return {
    t,
    i,
    s,
    c,
    m,
    p,
    e,
    a,
    f,
    b,
    o,
    l
  };
}

// src/core/literals.ts
function createConstantNode(value) {
  return createSerovalNode(
    2 /* Constant */,
    NIL,
    value,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL
  );
}
var TRUE_NODE = /* @__PURE__ */ createConstantNode(
  2 /* True */
);
var FALSE_NODE = /* @__PURE__ */ createConstantNode(
  3 /* False */
);
var UNDEFINED_NODE = /* @__PURE__ */ createConstantNode(
  1 /* Undefined */
);
var NULL_NODE = /* @__PURE__ */ createConstantNode(
  0 /* Null */
);
var NEG_ZERO_NODE = /* @__PURE__ */ createConstantNode(
  4 /* NegZero */
);
var INFINITY_NODE = /* @__PURE__ */ createConstantNode(
  5 /* Inf */
);
var NEG_INFINITY_NODE = /* @__PURE__ */ createConstantNode(
  6 /* NegInf */
);
var NAN_NODE = /* @__PURE__ */ createConstantNode(7 /* Nan */);

// src/core/string.ts
function serializeChar(str) {
  switch (str) {
    case '"':
      return '\\"';
    case "\\":
      return "\\\\";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "\b":
      return "\\b";
    case "	":
      return "\\t";
    case "\f":
      return "\\f";
    case "<":
      return "\\x3C";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return NIL;
  }
}
function serializeString(str) {
  let result = "";
  let lastPos = 0;
  let replacement;
  for (let i = 0, len = str.length; i < len; i++) {
    replacement = serializeChar(str[i]);
    if (replacement) {
      result += str.slice(lastPos, i) + replacement;
      lastPos = i + 1;
    }
  }
  if (lastPos === 0) {
    result = str;
  } else {
    result += str.slice(lastPos);
  }
  return result;
}
function deserializeReplacer(str) {
  switch (str) {
    case "\\\\":
      return "\\";
    case '\\"':
      return '"';
    case "\\n":
      return "\n";
    case "\\r":
      return "\r";
    case "\\b":
      return "\b";
    case "\\t":
      return "	";
    case "\\f":
      return "\f";
    case "\\x3C":
      return "<";
    case "\\u2028":
      return "\u2028";
    case "\\u2029":
      return "\u2029";
    default:
      return str;
  }
}
function deserializeString(str) {
  return str.replace(
    /(\\\\|\\"|\\n|\\r|\\b|\\t|\\f|\\u2028|\\u2029|\\x3C)/g,
    deserializeReplacer
  );
}

// src/core/keys.ts
var REFERENCES_KEY = "__SEROVAL_REFS__";
var GLOBAL_CONTEXT_REFERENCES = "$R";
var GLOBAL_CONTEXT_R = `self.${GLOBAL_CONTEXT_REFERENCES}`;
function getCrossReferenceHeader(id) {
  if (id == null) {
    return `${GLOBAL_CONTEXT_R}=${GLOBAL_CONTEXT_R}||[]`;
  }
  return `(${GLOBAL_CONTEXT_R}=${GLOBAL_CONTEXT_R}||{})["${serializeString(
    id
  )}"]=[]`;
}

// src/core/reference.ts
var REFERENCE = /* @__PURE__ */ new Map();
var INV_REFERENCE = /* @__PURE__ */ new Map();
function createReference(id, value) {
  REFERENCE.set(value, id);
  INV_REFERENCE.set(id, value);
  return value;
}
function hasReferenceID(value) {
  return REFERENCE.has(value);
}
function hasReference(id) {
  return INV_REFERENCE.has(id);
}
function getReferenceID(value) {
  if (hasReferenceID(value)) {
    return REFERENCE.get(value);
  }
  throw new SerovalMissingReferenceError(value);
}
function getReference(id) {
  if (hasReference(id)) {
    return INV_REFERENCE.get(id);
  }
  throw new SerovalMissingReferenceForIdError(id);
}
if (typeof globalThis !== "undefined") {
  Object.defineProperty(globalThis, REFERENCES_KEY, {
    value: INV_REFERENCE,
    configurable: true,
    writable: false,
    enumerable: false
  });
} else if (typeof window !== "undefined") {
  Object.defineProperty(window, REFERENCES_KEY, {
    value: INV_REFERENCE,
    configurable: true,
    writable: false,
    enumerable: false
  });
} else if (typeof self !== "undefined") {
  Object.defineProperty(self, REFERENCES_KEY, {
    value: INV_REFERENCE,
    configurable: true,
    writable: false,
    enumerable: false
  });
} else if (typeof global !== "undefined") {
  Object.defineProperty(global, REFERENCES_KEY, {
    value: INV_REFERENCE,
    configurable: true,
    writable: false,
    enumerable: false
  });
}

// src/core/utils/error.ts
function getErrorConstructor(error) {
  if (error instanceof EvalError) {
    return 1 /* EvalError */;
  }
  if (error instanceof RangeError) {
    return 2 /* RangeError */;
  }
  if (error instanceof ReferenceError) {
    return 3 /* ReferenceError */;
  }
  if (error instanceof SyntaxError) {
    return 4 /* SyntaxError */;
  }
  if (error instanceof TypeError) {
    return 5 /* TypeError */;
  }
  if (error instanceof URIError) {
    return 6 /* URIError */;
  }
  return 0 /* Error */;
}
function getInitialErrorOptions(error) {
  const construct = ERROR_CONSTRUCTOR_STRING[getErrorConstructor(error)];
  if (error.name !== construct) {
    return { name: error.name };
  }
  if (error.constructor.name !== construct) {
    return { name: error.constructor.name };
  }
  return {};
}
function getErrorOptions(error, features) {
  let options = getInitialErrorOptions(error);
  const names = Object.getOwnPropertyNames(error);
  for (let i = 0, len = names.length, name; i < len; i++) {
    name = names[i];
    if (name !== "name" && name !== "message") {
      if (name === "stack") {
        if (features & 4 /* ErrorPrototypeStack */) {
          options = options || {};
          options[name] = error[name];
        }
      } else {
        options = options || {};
        options[name] = error[name];
      }
    }
  }
  return options;
}

// src/core/utils/get-object-flag.ts
function getObjectFlag(obj) {
  if (Object.isFrozen(obj)) {
    return 3 /* Frozen */;
  }
  if (Object.isSealed(obj)) {
    return 2 /* Sealed */;
  }
  if (Object.isExtensible(obj)) {
    return 0 /* None */;
  }
  return 1 /* NonExtensible */;
}

// src/core/base-primitives.ts
function createNumberNode(value) {
  switch (value) {
    case Number.POSITIVE_INFINITY:
      return INFINITY_NODE;
    case Number.NEGATIVE_INFINITY:
      return NEG_INFINITY_NODE;
  }
  if (value !== value) {
    return NAN_NODE;
  }
  if (Object.is(value, -0)) {
    return NEG_ZERO_NODE;
  }
  return createSerovalNode(
    0 /* Number */,
    NIL,
    value,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL
  );
}
function createStringNode(value) {
  return createSerovalNode(
    1 /* String */,
    NIL,
    serializeString(value),
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL
  );
}
function createBigIntNode(current) {
  return createSerovalNode(
    3 /* BigInt */,
    NIL,
    "" + current,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL
  );
}
function createIndexedValueNode(id) {
  return createSerovalNode(
    4 /* IndexedValue */,
    id,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL
  );
}
function createDateNode(id, current) {
  const timestamp = current.valueOf();
  return createSerovalNode(
    5 /* Date */,
    id,
    timestamp !== timestamp ? "" : current.toISOString(),
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL
  );
}
function createRegExpNode(id, current) {
  return createSerovalNode(
    6 /* RegExp */,
    id,
    NIL,
    serializeString(current.source),
    current.flags,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL
  );
}
function createWKSymbolNode(id, current) {
  return createSerovalNode(
    17 /* WKSymbol */,
    id,
    INV_SYMBOL_REF[current],
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL
  );
}
function createReferenceNode(id, ref) {
  return createSerovalNode(
    18 /* Reference */,
    id,
    serializeString(getReferenceID(ref)),
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL
  );
}
function createPluginNode(id, tag, value) {
  return createSerovalNode(
    25 /* Plugin */,
    id,
    value,
    serializeString(tag),
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL
  );
}
function createArrayNode(id, current, parsedItems) {
  return createSerovalNode(
    9 /* Array */,
    id,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    parsedItems,
    NIL,
    NIL,
    getObjectFlag(current),
    NIL
  );
}
function createBoxedNode(id, boxed) {
  return createSerovalNode(
    21 /* Boxed */,
    id,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    boxed,
    NIL,
    NIL,
    NIL
  );
}
function createTypedArrayNode(id, current, buffer) {
  return createSerovalNode(
    15 /* TypedArray */,
    id,
    NIL,
    current.constructor.name,
    NIL,
    NIL,
    NIL,
    NIL,
    buffer,
    current.byteOffset,
    NIL,
    current.length
  );
}
function createBigIntTypedArrayNode(id, current, buffer) {
  return createSerovalNode(
    16 /* BigIntTypedArray */,
    id,
    NIL,
    current.constructor.name,
    NIL,
    NIL,
    NIL,
    NIL,
    buffer,
    current.byteOffset,
    NIL,
    current.byteLength
  );
}
function createDataViewNode(id, current, buffer) {
  return createSerovalNode(
    20 /* DataView */,
    id,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    buffer,
    current.byteOffset,
    NIL,
    current.byteLength
  );
}
function createErrorNode(id, current, options) {
  return createSerovalNode(
    13 /* Error */,
    id,
    getErrorConstructor(current),
    NIL,
    serializeString(current.message),
    options,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL
  );
}
function createAggregateErrorNode(id, current, options) {
  return createSerovalNode(
    14 /* AggregateError */,
    id,
    getErrorConstructor(current),
    NIL,
    serializeString(current.message),
    options,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL
  );
}
function createSetNode(id, items) {
  return createSerovalNode(
    7 /* Set */,
    id,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    items,
    NIL,
    NIL,
    NIL,
    NIL
  );
}
function createIteratorFactoryInstanceNode(factory, items) {
  return createSerovalNode(
    28 /* IteratorFactoryInstance */,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    [factory, items],
    NIL,
    NIL,
    NIL,
    NIL
  );
}
function createAsyncIteratorFactoryInstanceNode(factory, items) {
  return createSerovalNode(
    30 /* AsyncIteratorFactoryInstance */,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    [factory, items],
    NIL,
    NIL,
    NIL,
    NIL
  );
}
function createStreamConstructorNode(id, factory, sequence) {
  return createSerovalNode(
    31 /* StreamConstructor */,
    id,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    sequence,
    factory,
    NIL,
    NIL,
    NIL
  );
}
function createStreamNextNode(id, parsed) {
  return createSerovalNode(
    32 /* StreamNext */,
    id,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    parsed,
    NIL,
    NIL,
    NIL
  );
}
function createStreamThrowNode(id, parsed) {
  return createSerovalNode(
    33 /* StreamThrow */,
    id,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    parsed,
    NIL,
    NIL,
    NIL
  );
}
function createStreamReturnNode(id, parsed) {
  return createSerovalNode(
    34 /* StreamReturn */,
    id,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    parsed,
    NIL,
    NIL,
    NIL
  );
}
function createSequenceNode(id, sequence, throwAt, doneAt) {
  return createSerovalNode(
    35 /* Sequence */,
    id,
    throwAt,
    NIL,
    NIL,
    NIL,
    NIL,
    sequence,
    NIL,
    NIL,
    NIL,
    doneAt
  );
}

// src/core/errors.ts
var { toString: objectToString } = Object.prototype;
function getErrorMessageDev(type, cause) {
  if (cause instanceof Error) {
    return `Seroval caught an error during the ${type} process.

${cause.name}
${cause.message}

- For more information, please check the "cause" property of this error.
- If you believe this is an error in Seroval, please submit an issue at https://github.com/lxsmnsyc/seroval/issues/new`;
  }
  return `Seroval caught an error during the ${type} process.

"${objectToString.call(cause)}"

For more information, please check the "cause" property of this error.`;
}
var getErrorMessage = (type, cause) => false ? getErrorMessageProd(type) : getErrorMessageDev(type, cause);
var SerovalError = class extends Error {
  constructor(type, cause) {
    super(getErrorMessage(type, cause));
    this.cause = cause;
  }
};
var SerovalParserError = class extends SerovalError {
  constructor(cause) {
    super("parsing", cause);
  }
};
var SerovalSerializationError = class extends SerovalError {
  constructor(cause) {
    super("serialization", cause);
  }
};
var SerovalDeserializationError = class extends SerovalError {
  constructor(cause) {
    super("deserialization", cause);
  }
};
var SerovalUnsupportedTypeError = class extends Error {
  constructor(value) {
    super(
      false ? getSpecificErrorMessage(1 /* UnsupportedType */) : `The value ${objectToString.call(value)} of type "${typeof value}" cannot be parsed/serialized.
      
There are few workarounds for this problem:
- Transform the value in a way that it can be serialized.
- If the reference is present on multiple runtimes (isomorphic), you can use the Reference API to map the references.`
    );
    this.value = value;
  }
};
var SerovalUnsupportedNodeError = class extends Error {
  constructor(node) {
    super(
      false ? getSpecificErrorMessage(2 /* UnsupportedNode */) : 'Unsupported node type "' + node.t + '".'
    );
  }
};
var SerovalMissingPluginError = class extends Error {
  constructor(tag) {
    super(
      false ? getSpecificErrorMessage(3 /* MissingPlugin */) : 'Missing plugin for tag "' + tag + '".'
    );
  }
};
var SerovalMissingInstanceError = class extends Error {
  constructor(tag) {
    super(
      false ? getSpecificErrorMessage(4 /* MissingInstance */) : 'Missing "' + tag + '" instance.'
    );
  }
};
var SerovalMissingReferenceError = class extends Error {
  constructor(value) {
    super(
      false ? getSpecificErrorMessage(5 /* MissingReference */) : 'Missing reference for the value "' + objectToString.call(value) + '" of type "' + typeof value + '"'
    );
    this.value = value;
  }
};
var SerovalMissingReferenceForIdError = class extends Error {
  constructor(id) {
    super(
      false ? getSpecificErrorMessage(6 /* MissingReferenceForId */) : 'Missing reference for id "' + serializeString(id) + '"'
    );
  }
};
var SerovalUnknownTypedArrayError = class extends Error {
  constructor(name) {
    super(
      false ? getSpecificErrorMessage(7 /* UnknownTypedArray */) : 'Unknown TypedArray "' + name + '"'
    );
  }
};
var SerovalMalformedNodeError = class extends Error {
  constructor(node) {
    super(
      false ? getSpecificErrorMessage(8 /* MalformedNode */) : 'Malformed node type "' + node.t + '".'
    );
  }
};
var SerovalConflictedNodeIdError = class extends Error {
  constructor(node) {
    super(
      false ? getSpecificErrorMessage(9 /* ConflictedNodeId */) : 'Conflicted node id "' + node.i + '".'
    );
  }
};
var SerovalDepthLimitError = class extends Error {
  constructor(limit) {
    super(
      false ? getSpecificErrorMessage(9 /* ConflictedNodeId */) : "Depth limit of " + limit + " reached"
    );
  }
};

// src/core/opaque-reference.ts
var OpaqueReference = class {
  constructor(value, replacement) {
    this.value = value;
    this.replacement = replacement;
  }
};

// src/core/constructors.ts
var PROMISE_CONSTRUCTOR = () => {
  const resolver = {
    p: 0,
    s: 0,
    f: 0
  };
  resolver.p = new Promise((resolve, reject) => {
    resolver.s = resolve;
    resolver.f = reject;
  });
  return resolver;
};
var PROMISE_SUCCESS = (resolver, data) => {
  resolver.s(data);
  resolver.p.s = 1;
  resolver.p.v = data;
};
var PROMISE_FAILURE = (resolver, data) => {
  resolver.f(data);
  resolver.p.s = 2;
  resolver.p.v = data;
};
var SERIALIZED_PROMISE_CONSTRUCTOR = /* @__PURE__ */ PROMISE_CONSTRUCTOR.toString();
var SERIALIZED_PROMISE_SUCCESS = /* @__PURE__ */ PROMISE_SUCCESS.toString();
var SERIALIZED_PROMISE_FAILURE = /* @__PURE__ */ PROMISE_FAILURE.toString();
var STREAM_CONSTRUCTOR = () => {
  const buffer = [];
  const listeners = [];
  let alive = true;
  let success = false;
  let count = 0;
  const flush = (value, mode, x) => {
    for (x = 0; x < count; x++) {
      if (listeners[x]) {
        listeners[x][mode](value);
      }
    }
  };
  const up = (listener, x, z, current) => {
    for (x = 0, z = buffer.length; x < z; x++) {
      current = buffer[x];
      if (!alive && x === z - 1) {
        listener[success ? "return" : "throw"](current);
      } else {
        listener.next(current);
      }
    }
  };
  const on = (listener, temp) => {
    if (alive) {
      temp = count++;
      listeners[temp] = listener;
    }
    up(listener);
    return () => {
      if (alive) {
        listeners[temp] = listeners[count];
        listeners[count--] = void 0;
      }
    };
  };
  return {
    __SEROVAL_STREAM__: true,
    on: (listener) => on(listener),
    next: (value) => {
      if (alive) {
        buffer.push(value);
        flush(value, "next");
      }
    },
    throw: (value) => {
      if (alive) {
        buffer.push(value);
        flush(value, "throw");
        alive = false;
        success = false;
        listeners.length = 0;
      }
    },
    return: (value) => {
      if (alive) {
        buffer.push(value);
        flush(value, "return");
        alive = false;
        success = true;
        listeners.length = 0;
      }
    }
  };
};
var SERIALIZED_STREAM_CONSTRUCTOR = /* @__PURE__ */ STREAM_CONSTRUCTOR.toString();
var ITERATOR_CONSTRUCTOR = (symbol) => (sequence) => () => {
  let index = 0;
  const instance = {
    [symbol]: () => instance,
    next: () => {
      if (index > sequence.d) {
        return {
          done: true,
          value: void 0
        };
      }
      const currentIndex = index++;
      const data = sequence.v[currentIndex];
      if (currentIndex === sequence.t) {
        throw data;
      }
      return {
        done: currentIndex === sequence.d,
        value: data
      };
    }
  };
  return instance;
};
var SERIALIZED_ITERATOR_CONSTRUCTOR = /* @__PURE__ */ ITERATOR_CONSTRUCTOR.toString();
var ASYNC_ITERATOR_CONSTRUCTOR = (symbol, createPromise) => (stream) => () => {
  let count = 0;
  let doneAt = -1;
  let isThrow = false;
  const buffer = [];
  const pending = [];
  const finalize = (i = 0, len = pending.length) => {
    for (; i < len; i++) {
      pending[i].s({
        done: true,
        value: void 0
      });
    }
  };
  stream.on({
    next: (value) => {
      const temp = pending.shift();
      if (temp) {
        temp.s({ done: false, value });
      }
      buffer.push(value);
    },
    throw: (value) => {
      const temp = pending.shift();
      if (temp) {
        temp.f(value);
      }
      finalize();
      doneAt = buffer.length;
      isThrow = true;
      buffer.push(value);
    },
    return: (value) => {
      const temp = pending.shift();
      if (temp) {
        temp.s({ done: true, value });
      }
      finalize();
      doneAt = buffer.length;
      buffer.push(value);
    }
  });
  const instance = {
    [symbol]: () => instance,
    next: () => {
      if (doneAt === -1) {
        const index2 = count++;
        if (index2 >= buffer.length) {
          const temp = createPromise();
          pending.push(temp);
          return temp.p;
        }
        return {
          done: false,
          value: buffer[index2]
        };
      }
      if (count > doneAt) {
        return {
          done: true,
          value: void 0
        };
      }
      const index = count++;
      const value = buffer[index];
      if (index !== doneAt) {
        return {
          done: false,
          value
        };
      }
      if (isThrow) {
        throw value;
      }
      return {
        done: true,
        value
      };
    }
  };
  return instance;
};
var SERIALIZED_ASYNC_ITERATOR_CONSTRUCTOR = /* @__PURE__ */ ASYNC_ITERATOR_CONSTRUCTOR.toString();
var ARRAY_BUFFER_CONSTRUCTOR = (b64) => {
  const decoded = atob(b64);
  const length = decoded.length;
  const arr = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    arr[i] = decoded.charCodeAt(i);
  }
  return arr.buffer;
};
var SERIALIZED_ARRAY_BUFFER_CONSTRUCTOR = /* @__PURE__ */ ARRAY_BUFFER_CONSTRUCTOR.toString();

// src/core/sequence.ts
function isSequence(value) {
  return "__SEROVAL_SEQUENCE__" in value;
}
function createSequence(values, throwAt, doneAt) {
  return {
    __SEROVAL_SEQUENCE__: true,
    v: values,
    t: throwAt,
    d: doneAt
  };
}
function createSequenceFromIterable(source) {
  const values = [];
  let throwsAt = -1;
  let doneAt = -1;
  const iterator = source[SYM_ITERATOR]();
  while (true) {
    try {
      const value = iterator.next();
      values.push(value.value);
      if (value.done) {
        doneAt = values.length - 1;
        break;
      }
    } catch (error) {
      throwsAt = values.length;
      values.push(error);
    }
  }
  return createSequence(values, throwsAt, doneAt);
}
var createIterator = ITERATOR_CONSTRUCTOR(SYM_ITERATOR);
function sequenceToIterator(sequence) {
  return createIterator(sequence);
}

// src/core/special-reference.ts
var ITERATOR = {};
var ASYNC_ITERATOR = {};
var SPECIAL_REFS = {
  [0 /* MapSentinel */]: {},
  [1 /* PromiseConstructor */]: {},
  [2 /* PromiseSuccess */]: {},
  [3 /* PromiseFailure */]: {},
  [4 /* StreamConstructor */]: {},
  [5 /* ArrayBufferConstructor */]: {}
};
var SPECIAL_REF_STRING = {
  [0 /* MapSentinel */]: "[]",
  [1 /* PromiseConstructor */]: SERIALIZED_PROMISE_CONSTRUCTOR,
  [2 /* PromiseSuccess */]: SERIALIZED_PROMISE_SUCCESS,
  [3 /* PromiseFailure */]: SERIALIZED_PROMISE_FAILURE,
  [4 /* StreamConstructor */]: SERIALIZED_STREAM_CONSTRUCTOR,
  [5 /* ArrayBufferConstructor */]: SERIALIZED_ARRAY_BUFFER_CONSTRUCTOR
};

// src/core/stream.ts
function isStream(value) {
  return "__SEROVAL_STREAM__" in value;
}
function createStream() {
  return STREAM_CONSTRUCTOR();
}
function createStreamFromAsyncIterable(iterable) {
  const stream = createStream();
  const iterator = iterable[SYM_ASYNC_ITERATOR]();
  async function push() {
    try {
      const value = await iterator.next();
      if (value.done) {
        stream.return(value.value);
      } else {
        stream.next(value.value);
        await push();
      }
    } catch (error) {
      stream.throw(error);
    }
  }
  push().catch(() => {
  });
  return stream;
}
var createAsyncIterable = ASYNC_ITERATOR_CONSTRUCTOR(
  SYM_ASYNC_ITERATOR,
  PROMISE_CONSTRUCTOR
);
function streamToAsyncIterable(stream) {
  return createAsyncIterable(
    stream
  );
}

// src/core/utils/promise-to-result.ts
async function promiseToResult(current) {
  try {
    return [1, await current];
  } catch (e) {
    return [0, e];
  }
}

// src/core/context/parser.ts
function createBaseParserContext(mode, options) {
  return {
    plugins: options.plugins,
    mode,
    marked: /* @__PURE__ */ new Set(),
    features: ALL_ENABLED ^ (options.disabledFeatures || 0),
    refs: options.refs || /* @__PURE__ */ new Map(),
    depthLimit: options.depthLimit || 1e3
  };
}
function markParserRef(ctx, id) {
  ctx.marked.add(id);
}
function createIndexForValue(ctx, current) {
  const id = ctx.refs.size;
  ctx.refs.set(current, id);
  return id;
}
function getNodeForIndexedValue(ctx, current) {
  const registeredId = ctx.refs.get(current);
  if (registeredId != null) {
    markParserRef(ctx, registeredId);
    return {
      type: 1 /* Indexed */,
      value: createIndexedValueNode(registeredId)
    };
  }
  return {
    type: 0 /* Fresh */,
    value: createIndexForValue(ctx, current)
  };
}
function getReferenceNode(ctx, current) {
  const indexed = getNodeForIndexedValue(ctx, current);
  if (indexed.type === 1 /* Indexed */) {
    return indexed;
  }
  if (hasReferenceID(current)) {
    return {
      type: 2 /* Referenced */,
      value: createReferenceNode(indexed.value, current)
    };
  }
  return indexed;
}
function parseWellKnownSymbol(ctx, current) {
  const ref = getReferenceNode(ctx, current);
  if (ref.type !== 0 /* Fresh */) {
    return ref.value;
  }
  if (current in INV_SYMBOL_REF) {
    return createWKSymbolNode(ref.value, current);
  }
  throw new SerovalUnsupportedTypeError(current);
}
function parseSpecialReference(ctx, ref) {
  const result = getNodeForIndexedValue(ctx, SPECIAL_REFS[ref]);
  if (result.type === 1 /* Indexed */) {
    return result.value;
  }
  return createSerovalNode(
    26 /* SpecialReference */,
    result.value,
    ref,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL
  );
}
function parseIteratorFactory(ctx) {
  const result = getNodeForIndexedValue(ctx, ITERATOR);
  if (result.type === 1 /* Indexed */) {
    return result.value;
  }
  return createSerovalNode(
    27 /* IteratorFactory */,
    result.value,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    parseWellKnownSymbol(ctx, SYM_ITERATOR),
    NIL,
    NIL,
    NIL
  );
}
function parseAsyncIteratorFactory(ctx) {
  const result = getNodeForIndexedValue(ctx, ASYNC_ITERATOR);
  if (result.type === 1 /* Indexed */) {
    return result.value;
  }
  return createSerovalNode(
    29 /* AsyncIteratorFactory */,
    result.value,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    [
      parseSpecialReference(ctx, 1 /* PromiseConstructor */),
      parseWellKnownSymbol(ctx, SYM_ASYNC_ITERATOR)
    ],
    NIL,
    NIL,
    NIL,
    NIL
  );
}
function createObjectNode(id, current, empty, record) {
  return createSerovalNode(
    empty ? 11 /* NullConstructor */ : 10 /* Object */,
    id,
    NIL,
    NIL,
    NIL,
    record,
    NIL,
    NIL,
    NIL,
    NIL,
    getObjectFlag(current),
    NIL
  );
}
function createMapNode(ctx, id, k, v) {
  return createSerovalNode(
    8 /* Map */,
    id,
    NIL,
    NIL,
    NIL,
    NIL,
    { k, v },
    NIL,
    parseSpecialReference(ctx, 0 /* MapSentinel */),
    NIL,
    NIL,
    NIL
  );
}
function createPromiseConstructorNode(ctx, id, resolver) {
  return createSerovalNode(
    22 /* PromiseConstructor */,
    id,
    resolver,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    parseSpecialReference(ctx, 1 /* PromiseConstructor */),
    NIL,
    NIL,
    NIL
  );
}
function createArrayBufferNode(ctx, id, current) {
  const bytes = new Uint8Array(current);
  let result = "";
  for (let i = 0, len = bytes.length; i < len; i++) {
    result += String.fromCharCode(bytes[i]);
  }
  return createSerovalNode(
    19 /* ArrayBuffer */,
    id,
    serializeString(btoa(result)),
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    parseSpecialReference(ctx, 5 /* ArrayBufferConstructor */),
    NIL,
    NIL,
    NIL
  );
}

// src/core/context/async-parser.ts
function createAsyncParserContext(mode, options) {
  return {
    base: createBaseParserContext(mode, options),
    child: void 0
  };
}
var AsyncParsePluginContext = class {
  constructor(_p, depth) {
    this._p = _p;
    this.depth = depth;
  }
  parse(current) {
    return parseAsync(this._p, this.depth, current);
  }
};
async function parseItems(ctx, depth, current) {
  const nodes = [];
  for (let i = 0, len = current.length; i < len; i++) {
    if (i in current) {
      nodes[i] = await parseAsync(ctx, depth, current[i]);
    } else {
      nodes[i] = 0;
    }
  }
  return nodes;
}
async function parseArray(ctx, depth, id, current) {
  return createArrayNode(id, current, await parseItems(ctx, depth, current));
}
async function parseProperties(ctx, depth, properties) {
  const entries = Object.entries(properties);
  const keyNodes = [];
  const valueNodes = [];
  for (let i = 0, len = entries.length; i < len; i++) {
    keyNodes.push(serializeString(entries[i][0]));
    valueNodes.push(await parseAsync(ctx, depth, entries[i][1]));
  }
  if (SYM_ITERATOR in properties) {
    keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_ITERATOR));
    valueNodes.push(
      createIteratorFactoryInstanceNode(
        parseIteratorFactory(ctx.base),
        await parseAsync(
          ctx,
          depth,
          createSequenceFromIterable(
            properties
          )
        )
      )
    );
  }
  if (SYM_ASYNC_ITERATOR in properties) {
    keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_ASYNC_ITERATOR));
    valueNodes.push(
      createAsyncIteratorFactoryInstanceNode(
        parseAsyncIteratorFactory(ctx.base),
        await parseAsync(
          ctx,
          depth,
          createStreamFromAsyncIterable(
            properties
          )
        )
      )
    );
  }
  if (SYM_TO_STRING_TAG in properties) {
    keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_TO_STRING_TAG));
    valueNodes.push(createStringNode(properties[SYM_TO_STRING_TAG]));
  }
  if (SYM_IS_CONCAT_SPREADABLE in properties) {
    keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_IS_CONCAT_SPREADABLE));
    valueNodes.push(
      properties[SYM_IS_CONCAT_SPREADABLE] ? TRUE_NODE : FALSE_NODE
    );
  }
  return {
    k: keyNodes,
    v: valueNodes
  };
}
async function parsePlainObject(ctx, depth, id, current, empty) {
  return createObjectNode(
    id,
    current,
    empty,
    await parseProperties(ctx, depth, current)
  );
}
async function parseBoxed(ctx, depth, id, current) {
  return createBoxedNode(id, await parseAsync(ctx, depth, current.valueOf()));
}
async function parseTypedArray(ctx, depth, id, current) {
  return createTypedArrayNode(
    id,
    current,
    await parseAsync(ctx, depth, current.buffer)
  );
}
async function parseBigIntTypedArray(ctx, depth, id, current) {
  return createBigIntTypedArrayNode(
    id,
    current,
    await parseAsync(ctx, depth, current.buffer)
  );
}
async function parseDataView(ctx, depth, id, current) {
  return createDataViewNode(
    id,
    current,
    await parseAsync(ctx, depth, current.buffer)
  );
}
async function parseError(ctx, depth, id, current) {
  const options = getErrorOptions(current, ctx.base.features);
  return createErrorNode(
    id,
    current,
    options ? await parseProperties(ctx, depth, options) : NIL
  );
}
async function parseAggregateError(ctx, depth, id, current) {
  const options = getErrorOptions(current, ctx.base.features);
  return createAggregateErrorNode(
    id,
    current,
    options ? await parseProperties(ctx, depth, options) : NIL
  );
}
async function parseMap(ctx, depth, id, current) {
  const keyNodes = [];
  const valueNodes = [];
  for (const [key, value] of current.entries()) {
    keyNodes.push(await parseAsync(ctx, depth, key));
    valueNodes.push(await parseAsync(ctx, depth, value));
  }
  return createMapNode(ctx.base, id, keyNodes, valueNodes);
}
async function parseSet(ctx, depth, id, current) {
  const items = [];
  for (const item of current.keys()) {
    items.push(await parseAsync(ctx, depth, item));
  }
  return createSetNode(id, items);
}
async function parsePlugin(ctx, depth, id, current) {
  const currentPlugins = ctx.base.plugins;
  if (currentPlugins) {
    for (let i = 0, len = currentPlugins.length; i < len; i++) {
      const plugin = currentPlugins[i];
      if (plugin.parse.async && plugin.test(current)) {
        return createPluginNode(
          id,
          plugin.tag,
          await plugin.parse.async(
            current,
            new AsyncParsePluginContext(ctx, depth),
            {
              id
            }
          )
        );
      }
    }
  }
  return NIL;
}
async function parsePromise(ctx, depth, id, current) {
  const [status, result] = await promiseToResult(current);
  return createSerovalNode(
    12 /* Promise */,
    id,
    status,
    NIL,
    NIL,
    NIL,
    NIL,
    NIL,
    await parseAsync(ctx, depth, result),
    NIL,
    NIL,
    NIL
  );
}
function parseStreamHandle(depth, id, current, resolve, reject) {
  const sequence = [];
  const cleanup = current.on({
    next: (value) => {
      markParserRef(this.base, id);
      parseAsync(this, depth, value).then(
        (data) => {
          sequence.push(createStreamNextNode(id, data));
        },
        (data) => {
          reject(data);
          cleanup();
        }
      );
    },
    throw: (value) => {
      markParserRef(this.base, id);
      parseAsync(this, depth, value).then(
        (data) => {
          sequence.push(createStreamThrowNode(id, data));
          resolve(sequence);
          cleanup();
        },
        (data) => {
          reject(data);
          cleanup();
        }
      );
    },
    return: (value) => {
      markParserRef(this.base, id);
      parseAsync(this, depth, value).then(
        (data) => {
          sequence.push(createStreamReturnNode(id, data));
          resolve(sequence);
          cleanup();
        },
        (data) => {
          reject(data);
          cleanup();
        }
      );
    }
  });
}
async function parseStream(ctx, depth, id, current) {
  return createStreamConstructorNode(
    id,
    parseSpecialReference(ctx.base, 4 /* StreamConstructor */),
    await new Promise(
      parseStreamHandle.bind(ctx, depth, id, current)
    )
  );
}
async function parseSequence(ctx, depth, id, current) {
  const nodes = [];
  for (let i = 0, len = current.v.length; i < len; i++) {
    nodes[i] = await parseAsync(ctx, depth, current.v[i]);
  }
  return createSequenceNode(id, nodes, current.t, current.d);
}
async function parseObjectAsync(ctx, depth, id, current) {
  if (Array.isArray(current)) {
    return parseArray(ctx, depth, id, current);
  }
  if (isStream(current)) {
    return parseStream(ctx, depth, id, current);
  }
  if (isSequence(current)) {
    return parseSequence(ctx, depth, id, current);
  }
  const currentClass = current.constructor;
  if (currentClass === OpaqueReference) {
    return parseAsync(
      ctx,
      depth,
      current.replacement
    );
  }
  const parsed = await parsePlugin(ctx, depth, id, current);
  if (parsed) {
    return parsed;
  }
  switch (currentClass) {
    case Object:
      return parsePlainObject(
        ctx,
        depth,
        id,
        current,
        false
      );
    case NIL:
      return parsePlainObject(
        ctx,
        depth,
        id,
        current,
        true
      );
    case Date:
      return createDateNode(id, current);
    case Error:
    case EvalError:
    case RangeError:
    case ReferenceError:
    case SyntaxError:
    case TypeError:
    case URIError:
      return parseError(ctx, depth, id, current);
    case Number:
    case Boolean:
    case String:
    case BigInt:
      return parseBoxed(ctx, depth, id, current);
    case ArrayBuffer:
      return createArrayBufferNode(
        ctx.base,
        id,
        current
      );
    case Int8Array:
    case Int16Array:
    case Int32Array:
    case Uint8Array:
    case Uint16Array:
    case Uint32Array:
    case Uint8ClampedArray:
    case Float32Array:
    case Float64Array:
      return parseTypedArray(
        ctx,
        depth,
        id,
        current
      );
    case DataView:
      return parseDataView(ctx, depth, id, current);
    case Map:
      return parseMap(
        ctx,
        depth,
        id,
        current
      );
    case Set:
      return parseSet(ctx, depth, id, current);
    default:
      break;
  }
  if (currentClass === Promise || current instanceof Promise) {
    return parsePromise(ctx, depth, id, current);
  }
  const currentFeatures = ctx.base.features;
  if (currentFeatures & 32 /* RegExp */ && currentClass === RegExp) {
    return createRegExpNode(id, current);
  }
  if (currentFeatures & 16 /* BigIntTypedArray */) {
    switch (currentClass) {
      case BigInt64Array:
      case BigUint64Array:
        return parseBigIntTypedArray(
          ctx,
          depth,
          id,
          current
        );
      default:
        break;
    }
  }
  if (currentFeatures & 1 /* AggregateError */ && typeof AggregateError !== "undefined" && (currentClass === AggregateError || current instanceof AggregateError)) {
    return parseAggregateError(
      ctx,
      depth,
      id,
      current
    );
  }
  if (current instanceof Error) {
    return parseError(ctx, depth, id, current);
  }
  if (SYM_ITERATOR in current || SYM_ASYNC_ITERATOR in current) {
    return parsePlainObject(ctx, depth, id, current, !!currentClass);
  }
  throw new SerovalUnsupportedTypeError(current);
}
async function parseFunctionAsync(ctx, depth, current) {
  const ref = getReferenceNode(ctx.base, current);
  if (ref.type !== 0 /* Fresh */) {
    return ref.value;
  }
  const plugin = await parsePlugin(ctx, depth, ref.value, current);
  if (plugin) {
    return plugin;
  }
  throw new SerovalUnsupportedTypeError(current);
}
async function parseAsync(ctx, depth, current) {
  switch (typeof current) {
    case "boolean":
      return current ? TRUE_NODE : FALSE_NODE;
    case "undefined":
      return UNDEFINED_NODE;
    case "string":
      return createStringNode(current);
    case "number":
      return createNumberNode(current);
    case "bigint":
      return createBigIntNode(current);
    case "object": {
      if (current) {
        const ref = getReferenceNode(ctx.base, current);
        return ref.type === 0 ? await parseObjectAsync(ctx, depth + 1, ref.value, current) : ref.value;
      }
      return NULL_NODE;
    }
    case "symbol":
      return parseWellKnownSymbol(ctx.base, current);
    case "function":
      return parseFunctionAsync(ctx, depth, current);
    default:
      throw new SerovalUnsupportedTypeError(current);
  }
}
async function parseTopAsync(ctx, current) {
  try {
    return await parseAsync(ctx, 0, current);
  } catch (error) {
    throw error instanceof SerovalParserError ? error : new SerovalParserError(error);
  }
}

// src/core/plugin.ts
var SerovalMode = /* @__PURE__ */ ((SerovalMode2) => {
  SerovalMode2[SerovalMode2["Vanilla"] = 1] = "Vanilla";
  SerovalMode2[SerovalMode2["Cross"] = 2] = "Cross";
  return SerovalMode2;
})(SerovalMode || {});
function createPlugin(plugin) {
  return plugin;
}
function dedupePlugins(deduped, plugins) {
  for (let i = 0, len = plugins.length; i < len; i++) {
    const current = plugins[i];
    if (!deduped.has(current)) {
      deduped.add(current);
      if (current.extends) {
        dedupePlugins(deduped, current.extends);
      }
    }
  }
}
function resolvePlugins(plugins) {
  if (plugins) {
    const deduped = /* @__PURE__ */ new Set();
    dedupePlugins(deduped, plugins);
    return [...deduped];
  }
  return void 0;
}

// src/core/utils/typed-array.ts
function getTypedArrayConstructor(name) {
  switch (name) {
    case "Int8Array":
      return Int8Array;
    case "Int16Array":
      return Int16Array;
    case "Int32Array":
      return Int32Array;
    case "Uint8Array":
      return Uint8Array;
    case "Uint16Array":
      return Uint16Array;
    case "Uint32Array":
      return Uint32Array;
    case "Uint8ClampedArray":
      return Uint8ClampedArray;
    case "Float32Array":
      return Float32Array;
    case "Float64Array":
      return Float64Array;
    case "BigInt64Array":
      return BigInt64Array;
    case "BigUint64Array":
      return BigUint64Array;
    default:
      throw new SerovalUnknownTypedArrayError(name);
  }
}

// src/core/context/deserializer.ts
var MAX_BASE64_LENGTH = 1e6;
var MAX_BIGINT_LENGTH = 1e4;
var MAX_REGEXP_SOURCE_LENGTH = 2e4;
function applyObjectFlag(obj, flag) {
  switch (flag) {
    case 3 /* Frozen */:
      return Object.freeze(obj);
    case 1 /* NonExtensible */:
      return Object.preventExtensions(obj);
    case 2 /* Sealed */:
      return Object.seal(obj);
    default:
      return obj;
  }
}
var DEFAULT_DEPTH_LIMIT = 1e3;
function createBaseDeserializerContext(mode, options) {
  var _a;
  const refs = options.refs || /* @__PURE__ */ new Map();
  if (!("types" in refs)) {
    Object.assign(refs, {
      types: /* @__PURE__ */ new Map()
    });
  }
  return {
    mode,
    plugins: options.plugins,
    refs,
    features: (_a = options.features) != null ? _a : ALL_ENABLED ^ (options.disabledFeatures || 0),
    depthLimit: options.depthLimit || DEFAULT_DEPTH_LIMIT
  };
}
function createVanillaDeserializerContext(options) {
  return {
    mode: 1 /* Vanilla */,
    base: createBaseDeserializerContext(1 /* Vanilla */, options),
    child: NIL,
    state: {
      marked: new Set(options.markedRefs)
    }
  };
}
function createCrossDeserializerContext(options) {
  return {
    mode: 2 /* Cross */,
    base: createBaseDeserializerContext(2 /* Cross */, options),
    child: NIL
  };
}
var DeserializePluginContext = class {
  constructor(_p, depth) {
    this._p = _p;
    this.depth = depth;
  }
  deserialize(node) {
    return deserialize(this._p, this.depth, node);
  }
};
function guardIndexedValue(ctx, id) {
  if (id < 0 || !Number.isFinite(id) || !Number.isInteger(id)) {
    throw new SerovalMalformedNodeError({
      t: 4 /* IndexedValue */,
      i: id
    });
  }
  if (ctx.refs.has(id)) {
    throw new Error("Conflicted ref id: " + id);
  }
}
function assignIndexedValueVanilla(ctx, id, value) {
  guardIndexedValue(ctx.base, id);
  if (ctx.state.marked.has(id)) {
    ctx.base.refs.set(id, value);
  }
  return value;
}
function assignIndexedValueCross(ctx, id, value) {
  guardIndexedValue(ctx.base, id);
  ctx.base.refs.set(id, value);
  return value;
}
function assignIndexedValue(ctx, id, value) {
  return ctx.mode === 1 /* Vanilla */ ? assignIndexedValueVanilla(ctx, id, value) : assignIndexedValueCross(ctx, id, value);
}
function deserializeKnownValue(node, record, key) {
  if (Object.hasOwn(record, key)) {
    return record[key];
  }
  throw new SerovalMalformedNodeError(node);
}
function deserializeReference(ctx, node) {
  return assignIndexedValue(
    ctx,
    node.i,
    getReference(deserializeString(node.s))
  );
}
function deserializeArray(ctx, depth, node) {
  const items = node.a;
  const len = items.length;
  const result = assignIndexedValue(
    ctx,
    node.i,
    new Array(len)
  );
  for (let i = 0, item; i < len; i++) {
    item = items[i];
    if (item) {
      result[i] = deserialize(ctx, depth, item);
    }
  }
  applyObjectFlag(result, node.o);
  return result;
}
function isValidKey(key) {
  switch (key) {
    case "constructor":
    case "__proto__":
    case "prototype":
    case "__defineGetter__":
    case "__defineSetter__":
    case "__lookupGetter__":
    case "__lookupSetter__":
      return false;
    default:
      return true;
  }
}
function isValidSymbol(symbol) {
  switch (symbol) {
    case SYM_ASYNC_ITERATOR:
    case SYM_IS_CONCAT_SPREADABLE:
    case SYM_TO_STRING_TAG:
    case SYM_ITERATOR:
      return true;
    default:
      return false;
  }
}
function assignStringProperty(object, key, value) {
  if (isValidKey(key)) {
    object[key] = value;
  } else {
    Object.defineProperty(object, key, {
      value,
      configurable: true,
      enumerable: true,
      writable: true
    });
  }
}
function assignProperty(ctx, depth, object, key, value) {
  if (typeof key === "string") {
    assignStringProperty(
      object,
      deserializeString(key),
      deserialize(ctx, depth, value)
    );
  } else {
    const actual = deserialize(ctx, depth, key);
    switch (typeof actual) {
      case "string":
        assignStringProperty(object, actual, deserialize(ctx, depth, value));
        break;
      case "symbol":
        if (isValidSymbol(actual)) {
          object[actual] = deserialize(ctx, depth, value);
        }
        break;
      default:
        throw new SerovalMalformedNodeError(key);
    }
  }
}
function assignNodeType(ctx, id, type) {
  ctx.base.refs.types.set(id, type);
}
function validateNodeType(ctx, node, id, type) {
  if (ctx.base.refs.types.get(id) !== type) {
    throw new SerovalMalformedNodeError(node);
  }
}
function deserializeProperties(ctx, depth, node, result) {
  const keys = node.k;
  const len = keys.length;
  if (len > 0) {
    for (let i = 0, vals = node.v, len2 = keys.length; i < len2; i++) {
      assignProperty(ctx, depth, result, keys[i], vals[i]);
    }
  }
  return result;
}
function deserializeObject(ctx, depth, node) {
  const result = assignIndexedValue(
    ctx,
    node.i,
    node.t === 10 /* Object */ ? {} : /* @__PURE__ */ Object.create(null)
  );
  deserializeProperties(ctx, depth, node.p, result);
  applyObjectFlag(result, node.o);
  return result;
}
function deserializeDate(ctx, node) {
  return assignIndexedValue(ctx, node.i, new Date(node.s));
}
function deserializeRegExp(ctx, node) {
  if (ctx.base.features & 32 /* RegExp */) {
    const source = deserializeString(node.c);
    if (source.length > MAX_REGEXP_SOURCE_LENGTH) {
      throw new SerovalMalformedNodeError(node);
    }
    return assignIndexedValue(ctx, node.i, new RegExp(source, node.m));
  }
  throw new SerovalUnsupportedNodeError(node);
}
function deserializeSet(ctx, depth, node) {
  const result = assignIndexedValue(ctx, node.i, /* @__PURE__ */ new Set());
  for (let i = 0, items = node.a, len = items.length; i < len; i++) {
    result.add(deserialize(ctx, depth, items[i]));
  }
  return result;
}
function deserializeMap(ctx, depth, node) {
  const result = assignIndexedValue(ctx, node.i, /* @__PURE__ */ new Map());
  for (let i = 0, keys = node.e.k, vals = node.e.v, len = keys.length; i < len; i++) {
    result.set(
      deserialize(ctx, depth, keys[i]),
      deserialize(ctx, depth, vals[i])
    );
  }
  return result;
}
function deserializeArrayBuffer(ctx, node) {
  if (node.s.length > MAX_BASE64_LENGTH) {
    throw new SerovalMalformedNodeError(node);
  }
  const result = assignIndexedValue(
    ctx,
    node.i,
    ARRAY_BUFFER_CONSTRUCTOR(deserializeString(node.s))
  );
  return result;
}
function deserializeTypedArray(ctx, depth, node) {
  var _a;
  const construct = getTypedArrayConstructor(node.c);
  const source = deserialize(ctx, depth, node.f);
  const offset = (_a = node.b) != null ? _a : 0;
  if (offset < 0 || offset > source.byteLength) {
    throw new SerovalMalformedNodeError(node);
  }
  const result = assignIndexedValue(
    ctx,
    node.i,
    new construct(source, offset, node.l)
  );
  return result;
}
function deserializeDataView(ctx, depth, node) {
  var _a;
  const source = deserialize(ctx, depth, node.f);
  const offset = (_a = node.b) != null ? _a : 0;
  if (offset < 0 || offset > source.byteLength) {
    throw new SerovalMalformedNodeError(node);
  }
  const result = assignIndexedValue(
    ctx,
    node.i,
    new DataView(source, offset, node.l)
  );
  return result;
}
function deserializeDictionary(ctx, depth, node, result) {
  if (node.p) {
    const fields = deserializeProperties(ctx, depth, node.p, {});
    Object.defineProperties(result, Object.getOwnPropertyDescriptors(fields));
  }
  return result;
}
function deserializeAggregateError(ctx, depth, node) {
  const result = assignIndexedValue(
    ctx,
    node.i,
    new AggregateError([], deserializeString(node.m))
  );
  return deserializeDictionary(ctx, depth, node, result);
}
function deserializeError(ctx, depth, node) {
  const construct = deserializeKnownValue(node, ERROR_CONSTRUCTOR, node.s);
  const result = assignIndexedValue(
    ctx,
    node.i,
    new construct(deserializeString(node.m))
  );
  return deserializeDictionary(ctx, depth, node, result);
}
function deserializePromise(ctx, depth, node) {
  const deferred = PROMISE_CONSTRUCTOR();
  const result = assignIndexedValue(ctx, node.i, deferred.p);
  const deserialized = deserialize(ctx, depth, node.f);
  if (node.s) {
    deferred.s(deserialized);
  } else {
    deferred.f(deserialized);
  }
  return result;
}
function deserializeBoxed(ctx, depth, node) {
  return assignIndexedValue(
    ctx,
    node.i,
    // biome-ignore lint/style/useConsistentBuiltinInstantiation: intended
    Object(deserialize(ctx, depth, node.f))
  );
}
function deserializePlugin(ctx, depth, node) {
  const currentPlugins = ctx.base.plugins;
  if (currentPlugins) {
    const tag = deserializeString(node.c);
    for (let i = 0, len = currentPlugins.length; i < len; i++) {
      const plugin = currentPlugins[i];
      if (plugin.tag === tag) {
        return assignIndexedValue(
          ctx,
          node.i,
          plugin.deserialize(node.s, new DeserializePluginContext(ctx, depth), {
            id: node.i
          })
        );
      }
    }
  }
  throw new SerovalMissingPluginError(node.c);
}
function deserializePromiseConstructor(ctx, node) {
  const value = assignIndexedValue(
    ctx,
    node.i,
    assignIndexedValue(ctx, node.s, PROMISE_CONSTRUCTOR()).p
  );
  assignNodeType(ctx, node.s, 22 /* PromiseConstructor */);
  return value;
}
function deserializePromiseResolve(ctx, depth, node) {
  const deferred = ctx.base.refs.get(node.i);
  if (deferred) {
    validateNodeType(ctx, node, node.i, 22 /* PromiseConstructor */);
    deferred.s(deserialize(ctx, depth, node.a[1]));
    return NIL;
  }
  throw new SerovalMissingInstanceError("Promise");
}
function deserializePromiseReject(ctx, depth, node) {
  const deferred = ctx.base.refs.get(node.i);
  if (deferred) {
    validateNodeType(ctx, node, node.i, 22 /* PromiseConstructor */);
    deferred.f(deserialize(ctx, depth, node.a[1]));
    return NIL;
  }
  throw new SerovalMissingInstanceError("Promise");
}
function deserializeIteratorFactoryInstance(ctx, depth, node) {
  deserialize(ctx, depth, node.a[0]);
  const source = deserialize(ctx, depth, node.a[1]);
  return sequenceToIterator(source);
}
function deserializeAsyncIteratorFactoryInstance(ctx, depth, node) {
  deserialize(ctx, depth, node.a[0]);
  const source = deserialize(ctx, depth, node.a[1]);
  return streamToAsyncIterable(source);
}
function deserializeStreamConstructor(ctx, depth, node) {
  const result = assignIndexedValue(ctx, node.i, createStream());
  assignNodeType(ctx, node.i, 31 /* StreamConstructor */);
  const items = node.a;
  const len = items.length;
  if (len) {
    for (let i = 0; i < len; i++) {
      deserialize(ctx, depth, items[i]);
    }
  }
  return result;
}
function deserializeStreamNext(ctx, depth, node) {
  const deferred = ctx.base.refs.get(node.i);
  if (deferred) {
    validateNodeType(ctx, node, node.i, 31 /* StreamConstructor */);
    deferred.next(deserialize(ctx, depth, node.f));
    return NIL;
  }
  throw new SerovalMissingInstanceError("Stream");
}
function deserializeStreamThrow(ctx, depth, node) {
  const deferred = ctx.base.refs.get(node.i);
  if (deferred) {
    validateNodeType(ctx, node, node.i, 31 /* StreamConstructor */);
    deferred.throw(deserialize(ctx, depth, node.f));
    return NIL;
  }
  throw new SerovalMissingInstanceError("Stream");
}
function deserializeStreamReturn(ctx, depth, node) {
  const deferred = ctx.base.refs.get(node.i);
  if (deferred) {
    validateNodeType(ctx, node, node.i, 31 /* StreamConstructor */);
    deferred.return(deserialize(ctx, depth, node.f));
    return NIL;
  }
  throw new SerovalMissingInstanceError("Stream");
}
function deserializeIteratorFactory(ctx, depth, node) {
  deserialize(ctx, depth, node.f);
  return NIL;
}
function deserializeAsyncIteratorFactory(ctx, depth, node) {
  deserialize(ctx, depth, node.a[1]);
  return NIL;
}
function deserializeSequence(ctx, depth, node) {
  const result = assignIndexedValue(
    ctx,
    node.i,
    createSequence([], node.s, node.l)
  );
  for (let i = 0, len = node.a.length; i < len; i++) {
    result.v[i] = deserialize(ctx, depth, node.a[i]);
  }
  return result;
}
function deserialize(ctx, depth, node) {
  if (depth > ctx.base.depthLimit) {
    throw new SerovalDepthLimitError(ctx.base.depthLimit);
  }
  depth += 1;
  switch (node.t) {
    case 2 /* Constant */:
      return deserializeKnownValue(node, CONSTANT_VAL, node.s);
    case 0 /* Number */:
      return Number(node.s);
    case 1 /* String */:
      return deserializeString(String(node.s));
    case 3 /* BigInt */:
      if (String(node.s).length > MAX_BIGINT_LENGTH) {
        throw new SerovalMalformedNodeError(node);
      }
      return BigInt(node.s);
    case 4 /* IndexedValue */:
      return ctx.base.refs.get(node.i);
    case 18 /* Reference */:
      return deserializeReference(ctx, node);
    case 9 /* Array */:
      return deserializeArray(ctx, depth, node);
    case 10 /* Object */:
    case 11 /* NullConstructor */:
      return deserializeObject(ctx, depth, node);
    case 5 /* Date */:
      return deserializeDate(ctx, node);
    case 6 /* RegExp */:
      return deserializeRegExp(ctx, node);
    case 7 /* Set */:
      return deserializeSet(ctx, depth, node);
    case 8 /* Map */:
      return deserializeMap(ctx, depth, node);
    case 19 /* ArrayBuffer */:
      return deserializeArrayBuffer(ctx, node);
    case 16 /* BigIntTypedArray */:
    case 15 /* TypedArray */:
      return deserializeTypedArray(ctx, depth, node);
    case 20 /* DataView */:
      return deserializeDataView(ctx, depth, node);
    case 14 /* AggregateError */:
      return deserializeAggregateError(ctx, depth, node);
    case 13 /* Error */:
      return deserializeError(ctx, depth, node);
    case 12 /* Promise */:
      return deserializePromise(ctx, depth, node);
    case 17 /* WKSymbol */:
      return deserializeKnownValue(node, SYMBOL_REF, node.s);
    case 21 /* Boxed */:
      return deserializeBoxed(ctx, depth, node);
    case 25 /* Plugin */:
      return deserializePlugin(ctx, depth, node);
    case 22 /* PromiseConstructor */:
      return deserializePromiseConstructor(ctx, node);
    case 23 /* PromiseSuccess */:
      return deserializePromiseResolve(ctx, depth, node);
    case 24 /* PromiseFailure */:
      return deserializePromiseReject(ctx, depth, node);
    case 28 /* IteratorFactoryInstance */:
      return deserializeIteratorFactoryInstance(ctx, depth, node);
    case 30 /* AsyncIteratorFactoryInstance */:
      return deserializeAsyncIteratorFactoryInstance(ctx, depth, node);
    case 31 /* StreamConstructor */:
      return deserializeStreamConstructor(ctx, depth, node);
    case 32 /* StreamNext */:
      return deserializeStreamNext(ctx, depth, node);
    case 33 /* StreamThrow */:
      return deserializeStreamThrow(ctx, depth, node);
    case 34 /* StreamReturn */:
      return deserializeStreamReturn(ctx, depth, node);
    case 27 /* IteratorFactory */:
      return deserializeIteratorFactory(ctx, depth, node);
    case 29 /* AsyncIteratorFactory */:
      return deserializeAsyncIteratorFactory(ctx, depth, node);
    // case SerovalNodeType.SpecialReference:
    case 35 /* Sequence */:
      return deserializeSequence(ctx, depth, node);
    default:
      throw new SerovalUnsupportedNodeError(node);
  }
}
function deserializeTop(ctx, node) {
  try {
    return deserialize(ctx, 0, node);
  } catch (error) {
    throw new SerovalDeserializationError(error);
  }
}

// src/core/function-string.ts
var RETURN = () => T;
var SERIALIZED_RETURN = /* @__PURE__ */ RETURN.toString();
var IS_MODERN = /* @__PURE__ */ /=>/.test(SERIALIZED_RETURN);
function createFunction(parameters, body) {
  if (IS_MODERN) {
    const joined = parameters.length === 1 ? parameters[0] : "(" + parameters.join(",") + ")";
    return joined + "=>" + (body.startsWith("{") ? "(" + body + ")" : body);
  }
  return "function(" + parameters.join(",") + "){return " + body + "}";
}
function createEffectfulFunction(parameters, body) {
  if (IS_MODERN) {
    const joined = parameters.length === 1 ? parameters[0] : "(" + parameters.join(",") + ")";
    return joined + "=>{" + body + "}";
  }
  return "function(" + parameters.join(",") + "){" + body + "}";
}

// src/core/utils/get-identifier.ts
var REF_START_CHARS = "hjkmoquxzABCDEFGHIJKLNPQRTUVWXYZ$_";
var REF_START_CHARS_LEN = REF_START_CHARS.length;
var REF_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_";
var REF_CHARS_LEN = REF_CHARS.length;
function getIdentifier(index) {
  let mod = index % REF_START_CHARS_LEN;
  let ref = REF_START_CHARS[mod];
  index = (index - mod) / REF_START_CHARS_LEN;
  while (index > 0) {
    mod = index % REF_CHARS_LEN;
    ref += REF_CHARS[mod];
    index = (index - mod) / REF_CHARS_LEN;
  }
  return ref;
}

// src/core/utils/is-valid-identifier.ts
var IDENTIFIER_CHECK = /^[$A-Z_][0-9A-Z_$]*$/i;
function isValidIdentifier(name) {
  const char = name[0];
  return (char === "$" || char === "_" || char >= "A" && char <= "Z" || char >= "a" && char <= "z") && IDENTIFIER_CHECK.test(name);
}

// src/core/context/serializer.ts
function getAssignmentExpression(assignment) {
  switch (assignment.t) {
    case 0 /* Index */:
      return assignment.s + "=" + assignment.v;
    case 2 /* Set */:
      return assignment.s + ".set(" + assignment.k + "," + assignment.v + ")";
    case 1 /* Add */:
      return assignment.s + ".add(" + assignment.v + ")";
    case 3 /* Delete */:
      return assignment.s + ".delete(" + assignment.k + ")";
  }
}
function mergeAssignments(assignments) {
  const newAssignments = [];
  let current = assignments[0];
  for (let i = 1, len = assignments.length, item, prev = current; i < len; i++) {
    item = assignments[i];
    if (item.t === 0 /* Index */ && item.v === prev.v) {
      current = {
        t: 0 /* Index */,
        s: item.s,
        k: NIL,
        v: getAssignmentExpression(current)
      };
    } else if (item.t === 2 /* Set */ && item.s === prev.s) {
      current = {
        t: 2 /* Set */,
        s: getAssignmentExpression(current),
        k: item.k,
        v: item.v
      };
    } else if (item.t === 1 /* Add */ && item.s === prev.s) {
      current = {
        t: 1 /* Add */,
        s: getAssignmentExpression(current),
        k: NIL,
        v: item.v
      };
    } else if (item.t === 3 /* Delete */ && item.s === prev.s) {
      current = {
        t: 3 /* Delete */,
        s: getAssignmentExpression(current),
        k: item.k,
        v: NIL
      };
    } else {
      newAssignments.push(current);
      current = item;
    }
    prev = item;
  }
  newAssignments.push(current);
  return newAssignments;
}
function resolveAssignments(assignments) {
  if (assignments.length) {
    let result = "";
    const merged = mergeAssignments(assignments);
    for (let i = 0, len = merged.length; i < len; i++) {
      result += getAssignmentExpression(merged[i]) + ",";
    }
    return result;
  }
  return NIL;
}
var NULL_CONSTRUCTOR = "Object.create(null)";
var SET_CONSTRUCTOR = "new Set";
var MAP_CONSTRUCTOR = "new Map";
var PROMISE_RESOLVE = "Promise.resolve";
var PROMISE_REJECT = "Promise.reject";
var OBJECT_FLAG_CONSTRUCTOR = {
  [3 /* Frozen */]: "Object.freeze",
  [2 /* Sealed */]: "Object.seal",
  [1 /* NonExtensible */]: "Object.preventExtensions",
  [0 /* None */]: NIL
};
function createBaseSerializerContext(mode, options) {
  return {
    mode,
    plugins: options.plugins,
    features: options.features,
    marked: new Set(options.markedRefs),
    stack: [],
    flags: [],
    assignments: []
  };
}
function createVanillaSerializerState() {
  return {
    valid: /* @__PURE__ */ new Map(),
    vars: []
  };
}
function createVanillaSerializerContext(options) {
  return {
    mode: 1 /* Vanilla */,
    base: createBaseSerializerContext(1 /* Vanilla */, options),
    state: createVanillaSerializerState(),
    child: NIL
  };
}
function createCrossSerializerContext(options) {
  return {
    mode: 2 /* Cross */,
    base: createBaseSerializerContext(2 /* Cross */, options),
    state: options,
    child: NIL
  };
}
var SerializePluginContext = class {
  constructor(_p) {
    this._p = _p;
  }
  serialize(node) {
    return serialize(this._p, node);
  }
};
function getVanillaRefParam(state, index) {
  let actualIndex = state.valid.get(index);
  if (actualIndex == null) {
    actualIndex = state.valid.size;
    state.valid.set(index, actualIndex);
  }
  let identifier = state.vars[actualIndex];
  if (identifier == null) {
    identifier = getIdentifier(actualIndex);
    state.vars[actualIndex] = identifier;
  }
  return identifier;
}
function getCrossRefParam(id) {
  return GLOBAL_CONTEXT_REFERENCES + "[" + id + "]";
}
function getRefParam(ctx, id) {
  return ctx.mode === 1 /* Vanilla */ ? getVanillaRefParam(ctx.state, id) : getCrossRefParam(id);
}
function markSerializerRef(ctx, id) {
  ctx.marked.add(id);
}
function isSerializerRefMarked(ctx, id) {
  return ctx.marked.has(id);
}
function pushObjectFlag(ctx, flag, id) {
  if (flag !== 0 /* None */) {
    markSerializerRef(ctx.base, id);
    ctx.base.flags.push({
      type: flag,
      value: getRefParam(ctx, id)
    });
  }
}
function resolveFlags(ctx) {
  let result = "";
  for (let i = 0, current = ctx.flags, len = current.length; i < len; i++) {
    const flag = current[i];
    result += OBJECT_FLAG_CONSTRUCTOR[flag.type] + "(" + flag.value + "),";
  }
  return result;
}
function resolvePatches(ctx) {
  const assignments = resolveAssignments(ctx.assignments);
  const flags = resolveFlags(ctx);
  if (assignments) {
    if (flags) {
      return assignments + flags;
    }
    return assignments;
  }
  return flags;
}
function createAssignment(ctx, source, value) {
  ctx.assignments.push({
    t: 0 /* Index */,
    s: source,
    k: NIL,
    v: value
  });
}
function createAddAssignment(ctx, ref, value) {
  ctx.base.assignments.push({
    t: 1 /* Add */,
    s: getRefParam(ctx, ref),
    k: NIL,
    v: value
  });
}
function createSetAssignment(ctx, ref, key, value) {
  ctx.base.assignments.push({
    t: 2 /* Set */,
    s: getRefParam(ctx, ref),
    k: key,
    v: value
  });
}
function createDeleteAssignment(ctx, ref, key) {
  ctx.base.assignments.push({
    t: 3 /* Delete */,
    s: getRefParam(ctx, ref),
    k: key,
    v: NIL
  });
}
function createArrayAssign(ctx, ref, index, value) {
  createAssignment(ctx.base, getRefParam(ctx, ref) + "[" + index + "]", value);
}
function createObjectAssign(ctx, ref, key, value) {
  createAssignment(ctx.base, getRefParam(ctx, ref) + "." + key, value);
}
function createSequenceAssign(ctx, ref, index, value) {
  createAssignment(
    ctx.base,
    getRefParam(ctx, ref) + ".v[" + index + "]",
    value
  );
}
function isIndexedValueInStack(ctx, node) {
  return node.t === 4 /* IndexedValue */ && ctx.stack.includes(node.i);
}
function assignIndexedValue2(ctx, index, value) {
  if (ctx.mode === 1 /* Vanilla */ && !isSerializerRefMarked(ctx.base, index)) {
    return value;
  }
  return getRefParam(ctx, index) + "=" + value;
}
function serializeReference(node) {
  return REFERENCES_KEY + '.get("' + node.s + '")';
}
function serializeArrayItem(ctx, id, item, index) {
  if (item) {
    if (isIndexedValueInStack(ctx.base, item)) {
      markSerializerRef(ctx.base, id);
      createArrayAssign(
        ctx,
        id,
        index,
        getRefParam(ctx, item.i)
      );
      return "";
    }
    return serialize(ctx, item);
  }
  return "";
}
function serializeArray(ctx, node) {
  const id = node.i;
  const list = node.a;
  const len = list.length;
  if (len > 0) {
    ctx.base.stack.push(id);
    let values = serializeArrayItem(ctx, id, list[0], 0);
    let isHoley = values === "";
    for (let i = 1, item; i < len; i++) {
      item = serializeArrayItem(ctx, id, list[i], i);
      values += "," + item;
      isHoley = item === "";
    }
    ctx.base.stack.pop();
    pushObjectFlag(ctx, node.o, node.i);
    return "[" + values + (isHoley ? ",]" : "]");
  }
  return "[]";
}
function serializeProperty(ctx, source, key, val) {
  if (typeof key === "string") {
    const check = Number(key);
    const isIdentifier = (
      // Test if key is a valid positive number or JS identifier
      // so that we don't have to serialize the key and wrap with brackets
      check >= 0 && // It's also important to consider that if the key is
      // indeed numeric, we need to make sure that when
      // converted back into a string, it's still the same
      // to the original key. This allows us to differentiate
      // keys that has numeric formats but in a different
      // format, which can cause unintentional key declaration
      // Example: { 0x1: 1 } vs { '0x1': 1 }
      check.toString() === key || isValidIdentifier(key)
    );
    if (isIndexedValueInStack(ctx.base, val)) {
      const refParam = getRefParam(ctx, val.i);
      markSerializerRef(ctx.base, source.i);
      if (isIdentifier && check !== check) {
        createObjectAssign(ctx, source.i, key, refParam);
      } else {
        createArrayAssign(
          ctx,
          source.i,
          isIdentifier ? key : '"' + key + '"',
          refParam
        );
      }
      return "";
    }
    return (isIdentifier ? key : '"' + key + '"') + ":" + serialize(ctx, val);
  }
  return "[" + serialize(ctx, key) + "]:" + serialize(ctx, val);
}
function serializeProperties(ctx, source, record) {
  const keys = record.k;
  const len = keys.length;
  if (len > 0) {
    const values = record.v;
    ctx.base.stack.push(source.i);
    let result = serializeProperty(ctx, source, keys[0], values[0]);
    for (let i = 1, item = result; i < len; i++) {
      item = serializeProperty(ctx, source, keys[i], values[i]);
      result += (item && result && ",") + item;
    }
    ctx.base.stack.pop();
    return "{" + result + "}";
  }
  return "{}";
}
function serializeObject(ctx, node) {
  pushObjectFlag(ctx, node.o, node.i);
  return serializeProperties(ctx, node, node.p);
}
function serializeWithObjectAssign(ctx, source, value, serialized) {
  const fields = serializeProperties(ctx, source, value);
  if (fields !== "{}") {
    return "Object.assign(" + serialized + "," + fields + ")";
  }
  return serialized;
}
function serializeStringKeyAssignment(ctx, source, mainAssignments, key, value) {
  const base = ctx.base;
  const serialized = serialize(ctx, value);
  const check = Number(key);
  const isIdentifier = (
    // Test if key is a valid positive number or JS identifier
    // so that we don't have to serialize the key and wrap with brackets
    check >= 0 && // It's also important to consider that if the key is
    // indeed numeric, we need to make sure that when
    // converted back into a string, it's still the same
    // to the original key. This allows us to differentiate
    // keys that has numeric formats but in a different
    // format, which can cause unintentional key declaration
    // Example: { 0x1: 1 } vs { '0x1': 1 }
    check.toString() === key || isValidIdentifier(key)
  );
  if (isIndexedValueInStack(base, value)) {
    if (isIdentifier && check !== check) {
      createObjectAssign(ctx, source.i, key, serialized);
    } else {
      createArrayAssign(
        ctx,
        source.i,
        isIdentifier ? key : '"' + key + '"',
        serialized
      );
    }
  } else {
    const parentAssignment = base.assignments;
    base.assignments = mainAssignments;
    if (isIdentifier && check !== check) {
      createObjectAssign(ctx, source.i, key, serialized);
    } else {
      createArrayAssign(
        ctx,
        source.i,
        isIdentifier ? key : '"' + key + '"',
        serialized
      );
    }
    base.assignments = parentAssignment;
  }
}
function serializeAssignment(ctx, source, mainAssignments, key, value) {
  if (typeof key === "string") {
    serializeStringKeyAssignment(ctx, source, mainAssignments, key, value);
  } else {
    const base = ctx.base;
    const parent = base.stack;
    base.stack = [];
    const serialized = serialize(ctx, value);
    base.stack = parent;
    const parentAssignment = base.assignments;
    base.assignments = mainAssignments;
    createArrayAssign(ctx, source.i, serialize(ctx, key), serialized);
    base.assignments = parentAssignment;
  }
}
function serializeAssignments(ctx, source, node) {
  const keys = node.k;
  const len = keys.length;
  if (len > 0) {
    const mainAssignments = [];
    const values = node.v;
    ctx.base.stack.push(source.i);
    for (let i = 0; i < len; i++) {
      serializeAssignment(ctx, source, mainAssignments, keys[i], values[i]);
    }
    ctx.base.stack.pop();
    return resolveAssignments(mainAssignments);
  }
  return NIL;
}
function serializeDictionary(ctx, node, init) {
  if (node.p) {
    const base = ctx.base;
    if (base.features & 8 /* ObjectAssign */) {
      init = serializeWithObjectAssign(ctx, node, node.p, init);
    } else {
      markSerializerRef(base, node.i);
      const assignments = serializeAssignments(ctx, node, node.p);
      if (assignments) {
        return "(" + assignIndexedValue2(ctx, node.i, init) + "," + assignments + getRefParam(ctx, node.i) + ")";
      }
    }
  }
  return init;
}
function serializeNullConstructor(ctx, node) {
  pushObjectFlag(ctx, node.o, node.i);
  return serializeDictionary(ctx, node, NULL_CONSTRUCTOR);
}
function serializeDate(node) {
  return 'new Date("' + node.s + '")';
}
function serializeRegExp(ctx, node) {
  if (ctx.base.features & 32 /* RegExp */) {
    return "/" + node.c + "/" + node.m;
  }
  throw new SerovalUnsupportedNodeError(node);
}
function serializeSetItem(ctx, id, item) {
  const base = ctx.base;
  if (isIndexedValueInStack(base, item)) {
    markSerializerRef(base, id);
    createAddAssignment(
      ctx,
      id,
      getRefParam(ctx, item.i)
    );
    return "";
  }
  return serialize(ctx, item);
}
function serializeSet(ctx, node) {
  let serialized = SET_CONSTRUCTOR;
  const items = node.a;
  const size = items.length;
  const id = node.i;
  if (size > 0) {
    ctx.base.stack.push(id);
    let result = serializeSetItem(ctx, id, items[0]);
    for (let i = 1, item = result; i < size; i++) {
      item = serializeSetItem(ctx, id, items[i]);
      result += (item && result && ",") + item;
    }
    ctx.base.stack.pop();
    if (result) {
      serialized += "([" + result + "])";
    }
  }
  return serialized;
}
function serializeMapEntry(ctx, id, key, val, sentinel) {
  const base = ctx.base;
  if (isIndexedValueInStack(base, key)) {
    const keyRef = getRefParam(ctx, key.i);
    markSerializerRef(base, id);
    if (isIndexedValueInStack(base, val)) {
      const valueRef = getRefParam(ctx, val.i);
      createSetAssignment(ctx, id, keyRef, valueRef);
      return "";
    }
    if (val.t !== 4 /* IndexedValue */ && val.i != null && isSerializerRefMarked(base, val.i)) {
      const serialized = "(" + serialize(ctx, val) + ",[" + sentinel + "," + sentinel + "])";
      createSetAssignment(ctx, id, keyRef, getRefParam(ctx, val.i));
      createDeleteAssignment(ctx, id, sentinel);
      return serialized;
    }
    const parent = base.stack;
    base.stack = [];
    createSetAssignment(ctx, id, keyRef, serialize(ctx, val));
    base.stack = parent;
    return "";
  }
  if (isIndexedValueInStack(base, val)) {
    const valueRef = getRefParam(ctx, val.i);
    markSerializerRef(base, id);
    if (key.t !== 4 /* IndexedValue */ && key.i != null && isSerializerRefMarked(base, key.i)) {
      const serialized = "(" + serialize(ctx, key) + ",[" + sentinel + "," + sentinel + "])";
      createSetAssignment(ctx, id, getRefParam(ctx, key.i), valueRef);
      createDeleteAssignment(ctx, id, sentinel);
      return serialized;
    }
    const parent = base.stack;
    base.stack = [];
    createSetAssignment(ctx, id, serialize(ctx, key), valueRef);
    base.stack = parent;
    return "";
  }
  return "[" + serialize(ctx, key) + "," + serialize(ctx, val) + "]";
}
function serializeMap(ctx, node) {
  let serialized = MAP_CONSTRUCTOR;
  const keys = node.e.k;
  const size = keys.length;
  const id = node.i;
  const sentinel = node.f;
  const sentinelId = getRefParam(ctx, sentinel.i);
  const base = ctx.base;
  if (size > 0) {
    const vals = node.e.v;
    base.stack.push(id);
    let result = serializeMapEntry(ctx, id, keys[0], vals[0], sentinelId);
    for (let i = 1, item = result; i < size; i++) {
      item = serializeMapEntry(ctx, id, keys[i], vals[i], sentinelId);
      result += (item && result && ",") + item;
    }
    base.stack.pop();
    if (result) {
      serialized += "([" + result + "])";
    }
  }
  if (sentinel.t === 26 /* SpecialReference */) {
    markSerializerRef(base, sentinel.i);
    serialized = "(" + serialize(ctx, sentinel) + "," + serialized + ")";
  }
  return serialized;
}
function serializeArrayBuffer(ctx, node) {
  return getConstructor(ctx, node.f) + '("' + node.s + '")';
}
function serializeTypedArray(ctx, node) {
  return "new " + node.c + "(" + serialize(ctx, node.f) + "," + node.b + "," + node.l + ")";
}
function serializeDataView(ctx, node) {
  return "new DataView(" + serialize(ctx, node.f) + "," + node.b + "," + node.l + ")";
}
function serializeAggregateError(ctx, node) {
  const id = node.i;
  ctx.base.stack.push(id);
  const serialized = serializeDictionary(
    ctx,
    node,
    'new AggregateError([],"' + node.m + '")'
  );
  ctx.base.stack.pop();
  return serialized;
}
function serializeError(ctx, node) {
  return serializeDictionary(
    ctx,
    node,
    "new " + ERROR_CONSTRUCTOR_STRING[node.s] + '("' + node.m + '")'
  );
}
function serializePromise(ctx, node) {
  let serialized;
  const fulfilled = node.f;
  const id = node.i;
  const promiseConstructor = node.s ? PROMISE_RESOLVE : PROMISE_REJECT;
  const base = ctx.base;
  if (isIndexedValueInStack(base, fulfilled)) {
    const ref = getRefParam(ctx, fulfilled.i);
    serialized = promiseConstructor + (node.s ? "().then(" + createFunction([], ref) + ")" : "().catch(" + createEffectfulFunction([], "throw " + ref) + ")");
  } else {
    base.stack.push(id);
    const result = serialize(ctx, fulfilled);
    base.stack.pop();
    serialized = promiseConstructor + "(" + result + ")";
  }
  return serialized;
}
function serializeBoxed(ctx, node) {
  return "Object(" + serialize(ctx, node.f) + ")";
}
function getConstructor(ctx, node) {
  const current = serialize(ctx, node);
  return node.t === 4 /* IndexedValue */ ? current : "(" + current + ")";
}
function serializePromiseConstructor(ctx, node) {
  if (ctx.mode === 1 /* Vanilla */) {
    throw new SerovalUnsupportedNodeError(node);
  }
  const resolver = assignIndexedValue2(
    ctx,
    node.s,
    getConstructor(ctx, node.f) + "()"
  );
  return "(" + resolver + ").p";
}
function serializePromiseResolve(ctx, node) {
  if (ctx.mode === 1 /* Vanilla */) {
    throw new SerovalUnsupportedNodeError(node);
  }
  return getConstructor(ctx, node.a[0]) + "(" + getRefParam(ctx, node.i) + "," + serialize(ctx, node.a[1]) + ")";
}
function serializePromiseReject(ctx, node) {
  if (ctx.mode === 1 /* Vanilla */) {
    throw new SerovalUnsupportedNodeError(node);
  }
  return getConstructor(ctx, node.a[0]) + "(" + getRefParam(ctx, node.i) + "," + serialize(ctx, node.a[1]) + ")";
}
function serializePlugin(ctx, node) {
  const currentPlugins = ctx.base.plugins;
  if (currentPlugins) {
    for (let i = 0, len = currentPlugins.length; i < len; i++) {
      const plugin = currentPlugins[i];
      if (plugin.tag === node.c) {
        if (ctx.child == null) {
          ctx.child = new SerializePluginContext(ctx);
        }
        return plugin.serialize(node.s, ctx.child, {
          id: node.i
        });
      }
    }
  }
  throw new SerovalMissingPluginError(node.c);
}
function serializeIteratorFactory(ctx, node) {
  let result = "";
  let initialized = false;
  if (node.f.t !== 4 /* IndexedValue */) {
    markSerializerRef(ctx.base, node.f.i);
    result = "(" + serialize(ctx, node.f) + ",";
    initialized = true;
  }
  result += assignIndexedValue2(
    ctx,
    node.i,
    "(" + SERIALIZED_ITERATOR_CONSTRUCTOR + ")(" + getRefParam(ctx, node.f.i) + ")"
  );
  if (initialized) {
    result += ")";
  }
  return result;
}
function serializeIteratorFactoryInstance(ctx, node) {
  return getConstructor(ctx, node.a[0]) + "(" + serialize(ctx, node.a[1]) + ")";
}
function serializeAsyncIteratorFactory(ctx, node) {
  const promise = node.a[0];
  const symbol = node.a[1];
  const base = ctx.base;
  let result = "";
  if (promise.t !== 4 /* IndexedValue */) {
    markSerializerRef(base, promise.i);
    result += "(" + serialize(ctx, promise);
  }
  if (symbol.t !== 4 /* IndexedValue */) {
    markSerializerRef(base, symbol.i);
    result += (result ? "," : "(") + serialize(ctx, symbol);
  }
  if (result) {
    result += ",";
  }
  const iterator = assignIndexedValue2(
    ctx,
    node.i,
    "(" + SERIALIZED_ASYNC_ITERATOR_CONSTRUCTOR + ")(" + getRefParam(ctx, symbol.i) + "," + getRefParam(ctx, promise.i) + ")"
  );
  if (result) {
    return result + iterator + ")";
  }
  return iterator;
}
function serializeAsyncIteratorFactoryInstance(ctx, node) {
  return getConstructor(ctx, node.a[0]) + "(" + serialize(ctx, node.a[1]) + ")";
}
function serializeStreamConstructor(ctx, node) {
  const result = assignIndexedValue2(
    ctx,
    node.i,
    getConstructor(ctx, node.f) + "()"
  );
  const len = node.a.length;
  if (len) {
    let values = serialize(ctx, node.a[0]);
    for (let i = 1; i < len; i++) {
      values += "," + serialize(ctx, node.a[i]);
    }
    return "(" + result + "," + values + "," + getRefParam(ctx, node.i) + ")";
  }
  return result;
}
function serializeStreamNext(ctx, node) {
  return getRefParam(ctx, node.i) + ".next(" + serialize(ctx, node.f) + ")";
}
function serializeStreamThrow(ctx, node) {
  return getRefParam(ctx, node.i) + ".throw(" + serialize(ctx, node.f) + ")";
}
function serializeStreamReturn(ctx, node) {
  return getRefParam(ctx, node.i) + ".return(" + serialize(ctx, node.f) + ")";
}
function serializeSequenceItem(ctx, id, index, item) {
  const base = ctx.base;
  if (isIndexedValueInStack(base, item)) {
    markSerializerRef(base, id);
    createSequenceAssign(
      ctx,
      id,
      index,
      getRefParam(ctx, item.i)
    );
    return "";
  }
  return serialize(ctx, item);
}
function serializeSequence(ctx, node) {
  const items = node.a;
  const size = items.length;
  const id = node.i;
  if (size > 0) {
    ctx.base.stack.push(id);
    let result = serializeSequenceItem(ctx, id, 0, items[0]);
    for (let i = 1, item = result; i < size; i++) {
      item = serializeSequenceItem(ctx, id, i, items[i]);
      result += (item && result && ",") + item;
    }
    ctx.base.stack.pop();
    if (result) {
      return "{__SEROVAL_SEQUENCE__:!0,v:[" + result + "],t:" + node.s + ",d:" + node.l + "}";
    }
  }
  return "{__SEROVAL_SEQUENCE__:!0,v:[],t:-1,d:0}";
}
function serializeAssignable(ctx, node) {
  switch (node.t) {
    case 17 /* WKSymbol */:
      return SYMBOL_STRING[node.s];
    case 18 /* Reference */:
      return serializeReference(node);
    case 9 /* Array */:
      return serializeArray(ctx, node);
    case 10 /* Object */:
      return serializeObject(ctx, node);
    case 11 /* NullConstructor */:
      return serializeNullConstructor(ctx, node);
    case 5 /* Date */:
      return serializeDate(node);
    case 6 /* RegExp */:
      return serializeRegExp(ctx, node);
    case 7 /* Set */:
      return serializeSet(ctx, node);
    case 8 /* Map */:
      return serializeMap(ctx, node);
    case 19 /* ArrayBuffer */:
      return serializeArrayBuffer(ctx, node);
    case 16 /* BigIntTypedArray */:
    case 15 /* TypedArray */:
      return serializeTypedArray(ctx, node);
    case 20 /* DataView */:
      return serializeDataView(ctx, node);
    case 14 /* AggregateError */:
      return serializeAggregateError(ctx, node);
    case 13 /* Error */:
      return serializeError(ctx, node);
    case 12 /* Promise */:
      return serializePromise(ctx, node);
    case 21 /* Boxed */:
      return serializeBoxed(ctx, node);
    case 22 /* PromiseConstructor */:
      return serializePromiseConstructor(ctx, node);
    case 25 /* Plugin */:
      return serializePlugin(ctx, node);
    case 26 /* SpecialReference */:
      return SPECIAL_REF_STRING[node.s];
    case 35 /* Sequence */:
      return serializeSequence(ctx, node);
    default:
      throw new SerovalUnsupportedNodeError(node);
  }
}
function serialize(ctx, node) {
  switch (node.t) {
    case 2 /* Constant */:
      return CONSTANT_STRING[node.s];
    case 0 /* Number */:
      return "" + node.s;
    case 1 /* String */:
      return '"' + node.s + '"';
    case 3 /* BigInt */:
      return node.s + "n";
    case 4 /* IndexedValue */:
      return getRefParam(ctx, node.i);
    case 23 /* PromiseSuccess */:
      return serializePromiseResolve(ctx, node);
    case 24 /* PromiseFailure */:
      return serializePromiseReject(ctx, node);
    case 27 /* IteratorFactory */:
      return serializeIteratorFactory(ctx, node);
    case 28 /* IteratorFactoryInstance */:
      return serializeIteratorFactoryInstance(ctx, node);
    case 29 /* AsyncIteratorFactory */:
      return serializeAsyncIteratorFactory(ctx, node);
    case 30 /* AsyncIteratorFactoryInstance */:
      return serializeAsyncIteratorFactoryInstance(ctx, node);
    case 31 /* StreamConstructor */:
      return serializeStreamConstructor(ctx, node);
    case 32 /* StreamNext */:
      return serializeStreamNext(ctx, node);
    case 33 /* StreamThrow */:
      return serializeStreamThrow(ctx, node);
    case 34 /* StreamReturn */:
      return serializeStreamReturn(ctx, node);
    default:
      return assignIndexedValue2(ctx, node.i, serializeAssignable(ctx, node));
  }
}
function serializeTopVanilla(ctx, tree) {
  const result = serialize(ctx, tree);
  if (tree.i != null && ctx.state.vars.length) {
    const patches = resolvePatches(ctx.base);
    let body = result;
    if (patches) {
      const index = getRefParam(ctx, tree.i);
      body = result + "," + patches + index;
      if (!result.startsWith(index + "=")) {
        body = index + "=" + body;
      }
      body = "(" + body + ")";
    }
    return "(" + createFunction(ctx.state.vars, body) + ")()";
  }
  if (tree.t === 10 /* Object */) {
    return "(" + result + ")";
  }
  return result;
}
function serializeTopCross(ctx, tree) {
  const result = serialize(ctx, tree);
  const id = tree.i;
  if (id == null) {
    return result;
  }
  const patches = resolvePatches(ctx.base);
  const ref = getRefParam(ctx, id);
  const scopeId = ctx.state.scopeId;
  const params = scopeId == null ? "" : GLOBAL_CONTEXT_REFERENCES;
  const body = patches ? "(" + result + "," + patches + ref + ")" : result;
  if (params === "") {
    if (tree.t === 10 /* Object */ && !patches) {
      return "(" + body + ")";
    }
    return body;
  }
  const args = scopeId == null ? "()" : "(" + GLOBAL_CONTEXT_REFERENCES + '["' + serializeString(scopeId) + '"])';
  return "(" + createFunction([params], body) + ")" + args;
}

// src/core/context/sync-parser.ts
function createSyncParserContext(mode, options) {
  return {
    type: 1 /* Sync */,
    base: createBaseParserContext(mode, options),
    child: NIL
  };
}
var SyncParsePluginContext = class {
  constructor(_p, depth) {
    this._p = _p;
    this.depth = depth;
  }
  parse(current) {
    return parseSOS(this._p, this.depth, current);
  }
};
var StreamParsePluginContext = class {
  constructor(_p, depth) {
    this._p = _p;
    this.depth = depth;
  }
  parse(current) {
    return parseSOS(this._p, this.depth, current);
  }
  parseWithError(current) {
    return parseWithError(this._p, this.depth, current);
  }
  isAlive() {
    return this._p.state.alive;
  }
  pushPendingState() {
    pushPendingState(this._p);
  }
  popPendingState() {
    popPendingState(this._p);
  }
  onParse(node) {
    onParse(this._p, node);
  }
  onError(error) {
    onError(this._p, error);
  }
};
function createStreamParserState(options) {
  return {
    alive: true,
    pending: 0,
    initial: true,
    buffer: [],
    onParse: options.onParse,
    onError: options.onError,
    onDone: options.onDone
  };
}
function createStreamParserContext(options) {
  return {
    type: 2 /* Stream */,
    base: createBaseParserContext(2 /* Cross */, options),
    state: createStreamParserState(options)
  };
}
function parseItems2(ctx, depth, current) {
  const nodes = [];
  for (let i = 0, len = current.length; i < len; i++) {
    if (i in current) {
      nodes[i] = parseSOS(ctx, depth, current[i]);
    } else {
      nodes[i] = 0;
    }
  }
  return nodes;
}
function parseArray2(ctx, depth, id, current) {
  return createArrayNode(id, current, parseItems2(ctx, depth, current));
}
function parseProperties2(ctx, depth, properties) {
  const entries = Object.entries(properties);
  const keyNodes = [];
  const valueNodes = [];
  for (let i = 0, len = entries.length; i < len; i++) {
    keyNodes.push(serializeString(entries[i][0]));
    valueNodes.push(parseSOS(ctx, depth, entries[i][1]));
  }
  if (SYM_ITERATOR in properties) {
    keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_ITERATOR));
    valueNodes.push(
      createIteratorFactoryInstanceNode(
        parseIteratorFactory(ctx.base),
        parseSOS(
          ctx,
          depth,
          createSequenceFromIterable(
            properties
          )
        )
      )
    );
  }
  if (SYM_ASYNC_ITERATOR in properties) {
    keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_ASYNC_ITERATOR));
    valueNodes.push(
      createAsyncIteratorFactoryInstanceNode(
        parseAsyncIteratorFactory(ctx.base),
        parseSOS(
          ctx,
          depth,
          ctx.type === 1 /* Sync */ ? createStream() : createStreamFromAsyncIterable(
            properties
          )
        )
      )
    );
  }
  if (SYM_TO_STRING_TAG in properties) {
    keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_TO_STRING_TAG));
    valueNodes.push(createStringNode(properties[SYM_TO_STRING_TAG]));
  }
  if (SYM_IS_CONCAT_SPREADABLE in properties) {
    keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_IS_CONCAT_SPREADABLE));
    valueNodes.push(
      properties[SYM_IS_CONCAT_SPREADABLE] ? TRUE_NODE : FALSE_NODE
    );
  }
  return {
    k: keyNodes,
    v: valueNodes
  };
}
function parsePlainObject2(ctx, depth, id, current, empty) {
  return createObjectNode(
    id,
    current,
    empty,
    parseProperties2(ctx, depth, current)
  );
}
function parseBoxed2(ctx, depth, id, current) {
  return createBoxedNode(id, parseSOS(ctx, depth, current.valueOf()));
}
function parseTypedArray2(ctx, depth, id, current) {
  return createTypedArrayNode(
    id,
    current,
    parseSOS(ctx, depth, current.buffer)
  );
}
function parseBigIntTypedArray2(ctx, depth, id, current) {
  return createBigIntTypedArrayNode(
    id,
    current,
    parseSOS(ctx, depth, current.buffer)
  );
}
function parseDataView2(ctx, depth, id, current) {
  return createDataViewNode(id, current, parseSOS(ctx, depth, current.buffer));
}
function parseError2(ctx, depth, id, current) {
  const options = getErrorOptions(current, ctx.base.features);
  return createErrorNode(
    id,
    current,
    options ? parseProperties2(ctx, depth, options) : NIL
  );
}
function parseAggregateError2(ctx, depth, id, current) {
  const options = getErrorOptions(current, ctx.base.features);
  return createAggregateErrorNode(
    id,
    current,
    options ? parseProperties2(ctx, depth, options) : NIL
  );
}
function parseMap2(ctx, depth, id, current) {
  const keyNodes = [];
  const valueNodes = [];
  for (const [key, value] of current.entries()) {
    keyNodes.push(parseSOS(ctx, depth, key));
    valueNodes.push(parseSOS(ctx, depth, value));
  }
  return createMapNode(ctx.base, id, keyNodes, valueNodes);
}
function parseSet2(ctx, depth, id, current) {
  const items = [];
  for (const item of current.keys()) {
    items.push(parseSOS(ctx, depth, item));
  }
  return createSetNode(id, items);
}
function parseStream2(ctx, depth, id, current) {
  const result = createStreamConstructorNode(
    id,
    parseSpecialReference(ctx.base, 4 /* StreamConstructor */),
    []
  );
  if (ctx.type === 1 /* Sync */) {
    return result;
  }
  pushPendingState(ctx);
  current.on({
    next: (value) => {
      if (ctx.state.alive) {
        const parsed = parseWithError(ctx, depth, value);
        if (parsed) {
          onParse(ctx, createStreamNextNode(id, parsed));
        }
      }
    },
    throw: (value) => {
      if (ctx.state.alive) {
        const parsed = parseWithError(ctx, depth, value);
        if (parsed) {
          onParse(ctx, createStreamThrowNode(id, parsed));
        }
      }
      popPendingState(ctx);
    },
    return: (value) => {
      if (ctx.state.alive) {
        const parsed = parseWithError(ctx, depth, value);
        if (parsed) {
          onParse(ctx, createStreamReturnNode(id, parsed));
        }
      }
      popPendingState(ctx);
    }
  });
  return result;
}
function handlePromiseSuccess(id, depth, data) {
  if (this.state.alive) {
    const parsed = parseWithError(this, depth, data);
    if (parsed) {
      onParse(
        this,
        createSerovalNode(
          23 /* PromiseSuccess */,
          id,
          NIL,
          NIL,
          NIL,
          NIL,
          NIL,
          [
            parseSpecialReference(this.base, 2 /* PromiseSuccess */),
            parsed
          ],
          NIL,
          NIL,
          NIL,
          NIL
        )
      );
    }
    popPendingState(this);
  }
}
function handlePromiseFailure(id, depth, data) {
  if (this.state.alive) {
    const parsed = parseWithError(this, depth, data);
    if (parsed) {
      onParse(
        this,
        createSerovalNode(
          24 /* PromiseFailure */,
          id,
          NIL,
          NIL,
          NIL,
          NIL,
          NIL,
          [
            parseSpecialReference(this.base, 3 /* PromiseFailure */),
            parsed
          ],
          NIL,
          NIL,
          NIL,
          NIL
        )
      );
    }
  }
  popPendingState(this);
}
function parsePromise2(ctx, depth, id, current) {
  const resolver = createIndexForValue(ctx.base, {});
  if (ctx.type === 2 /* Stream */) {
    pushPendingState(ctx);
    current.then(
      handlePromiseSuccess.bind(ctx, resolver, depth),
      handlePromiseFailure.bind(ctx, resolver, depth)
    );
  }
  return createPromiseConstructorNode(ctx.base, id, resolver);
}
function parsePluginSync(ctx, depth, id, current, currentPlugins) {
  for (let i = 0, len = currentPlugins.length; i < len; i++) {
    const plugin = currentPlugins[i];
    if (plugin.parse.sync && plugin.test(current)) {
      return createPluginNode(
        id,
        plugin.tag,
        plugin.parse.sync(current, new SyncParsePluginContext(ctx, depth), {
          id
        })
      );
    }
  }
  return NIL;
}
function parsePluginStream(ctx, depth, id, current, currentPlugins) {
  for (let i = 0, len = currentPlugins.length; i < len; i++) {
    const plugin = currentPlugins[i];
    if (plugin.parse.stream && plugin.test(current)) {
      return createPluginNode(
        id,
        plugin.tag,
        plugin.parse.stream(current, new StreamParsePluginContext(ctx, depth), {
          id
        })
      );
    }
  }
  return NIL;
}
function parsePlugin2(ctx, depth, id, current) {
  const currentPlugins = ctx.base.plugins;
  if (currentPlugins) {
    return ctx.type === 1 /* Sync */ ? parsePluginSync(ctx, depth, id, current, currentPlugins) : parsePluginStream(ctx, depth, id, current, currentPlugins);
  }
  return NIL;
}
function parseSequence2(ctx, depth, id, current) {
  const nodes = [];
  for (let i = 0, len = current.v.length; i < len; i++) {
    nodes[i] = parseSOS(ctx, depth, current.v[i]);
  }
  return createSequenceNode(id, nodes, current.t, current.d);
}
function parseObjectPhase2(ctx, depth, id, current, currentClass) {
  switch (currentClass) {
    case Object:
      return parsePlainObject2(
        ctx,
        depth,
        id,
        current,
        false
      );
    case NIL:
      return parsePlainObject2(
        ctx,
        depth,
        id,
        current,
        true
      );
    case Date:
      return createDateNode(id, current);
    case Error:
    case EvalError:
    case RangeError:
    case ReferenceError:
    case SyntaxError:
    case TypeError:
    case URIError:
      return parseError2(ctx, depth, id, current);
    case Number:
    case Boolean:
    case String:
    case BigInt:
      return parseBoxed2(ctx, depth, id, current);
    case ArrayBuffer:
      return createArrayBufferNode(
        ctx.base,
        id,
        current
      );
    case Int8Array:
    case Int16Array:
    case Int32Array:
    case Uint8Array:
    case Uint16Array:
    case Uint32Array:
    case Uint8ClampedArray:
    case Float32Array:
    case Float64Array:
      return parseTypedArray2(
        ctx,
        depth,
        id,
        current
      );
    case DataView:
      return parseDataView2(ctx, depth, id, current);
    case Map:
      return parseMap2(
        ctx,
        depth,
        id,
        current
      );
    case Set:
      return parseSet2(ctx, depth, id, current);
    default:
      break;
  }
  if (currentClass === Promise || current instanceof Promise) {
    return parsePromise2(ctx, depth, id, current);
  }
  const currentFeatures = ctx.base.features;
  if (currentFeatures & 32 /* RegExp */ && currentClass === RegExp) {
    return createRegExpNode(id, current);
  }
  if (currentFeatures & 16 /* BigIntTypedArray */) {
    switch (currentClass) {
      case BigInt64Array:
      case BigUint64Array:
        return parseBigIntTypedArray2(
          ctx,
          depth,
          id,
          current
        );
      default:
        break;
    }
  }
  if (currentFeatures & 1 /* AggregateError */ && typeof AggregateError !== "undefined" && (currentClass === AggregateError || current instanceof AggregateError)) {
    return parseAggregateError2(
      ctx,
      depth,
      id,
      current
    );
  }
  if (current instanceof Error) {
    return parseError2(ctx, depth, id, current);
  }
  if (SYM_ITERATOR in current || SYM_ASYNC_ITERATOR in current) {
    return parsePlainObject2(ctx, depth, id, current, !!currentClass);
  }
  throw new SerovalUnsupportedTypeError(current);
}
function parseObject(ctx, depth, id, current) {
  if (Array.isArray(current)) {
    return parseArray2(ctx, depth, id, current);
  }
  if (isStream(current)) {
    return parseStream2(ctx, depth, id, current);
  }
  if (isSequence(current)) {
    return parseSequence2(ctx, depth, id, current);
  }
  const currentClass = current.constructor;
  if (currentClass === OpaqueReference) {
    return parseSOS(
      ctx,
      depth,
      current.replacement
    );
  }
  const parsed = parsePlugin2(ctx, depth, id, current);
  if (parsed) {
    return parsed;
  }
  return parseObjectPhase2(ctx, depth, id, current, currentClass);
}
function parseFunction(ctx, depth, current) {
  const ref = getReferenceNode(ctx.base, current);
  if (ref.type !== 0 /* Fresh */) {
    return ref.value;
  }
  const plugin = parsePlugin2(ctx, depth, ref.value, current);
  if (plugin) {
    return plugin;
  }
  throw new SerovalUnsupportedTypeError(current);
}
function parseSOS(ctx, depth, current) {
  if (depth >= ctx.base.depthLimit) {
    throw new SerovalDepthLimitError(ctx.base.depthLimit);
  }
  switch (typeof current) {
    case "boolean":
      return current ? TRUE_NODE : FALSE_NODE;
    case "undefined":
      return UNDEFINED_NODE;
    case "string":
      return createStringNode(current);
    case "number":
      return createNumberNode(current);
    case "bigint":
      return createBigIntNode(current);
    case "object": {
      if (current) {
        const ref = getReferenceNode(ctx.base, current);
        return ref.type === 0 /* Fresh */ ? parseObject(ctx, depth + 1, ref.value, current) : ref.value;
      }
      return NULL_NODE;
    }
    case "symbol":
      return parseWellKnownSymbol(ctx.base, current);
    case "function": {
      return parseFunction(ctx, depth, current);
    }
    default:
      throw new SerovalUnsupportedTypeError(current);
  }
}
function parseTop(ctx, current) {
  try {
    return parseSOS(ctx, 0, current);
  } catch (error) {
    throw error instanceof SerovalParserError ? error : new SerovalParserError(error);
  }
}
function onParse(ctx, node) {
  if (ctx.state.initial) {
    ctx.state.buffer.push(node);
  } else {
    onParseInternal(ctx, node, false);
  }
}
function onError(ctx, error) {
  if (ctx.state.onError) {
    ctx.state.onError(error);
  } else {
    throw error instanceof SerovalParserError ? error : new SerovalParserError(error);
  }
}
function onDone(ctx) {
  if (ctx.state.onDone) {
    ctx.state.onDone();
  }
}
function onParseInternal(ctx, node, initial) {
  try {
    ctx.state.onParse(node, initial);
  } catch (error) {
    onError(ctx, error);
  }
}
function pushPendingState(ctx) {
  ctx.state.pending++;
}
function popPendingState(ctx) {
  if (--ctx.state.pending <= 0) {
    onDone(ctx);
  }
}
function parseWithError(ctx, depth, current) {
  try {
    return parseSOS(ctx, depth, current);
  } catch (err) {
    onError(ctx, err);
    return NIL;
  }
}
function startStreamParse(ctx, current) {
  const parsed = parseWithError(ctx, 0, current);
  if (parsed) {
    onParseInternal(ctx, parsed, true);
    ctx.state.initial = false;
    flushStreamParse(ctx, ctx.state);
    if (ctx.state.pending <= 0) {
      destroyStreamParse(ctx);
    }
  }
}
function flushStreamParse(ctx, state) {
  for (let i = 0, len = state.buffer.length; i < len; i++) {
    onParseInternal(ctx, state.buffer[i], false);
  }
}
function destroyStreamParse(ctx) {
  if (ctx.state.alive) {
    onDone(ctx);
    ctx.state.alive = false;
  }
}

// src/core/cross/index.ts
function crossSerialize(source, options = {}) {
  const plugins = resolvePlugins(options.plugins);
  const ctx = createSyncParserContext(2 /* Cross */, {
    plugins,
    disabledFeatures: options.disabledFeatures,
    refs: options.refs
  });
  const tree = parseTop(ctx, source);
  const serial = createCrossSerializerContext({
    plugins,
    features: ctx.base.features,
    scopeId: options.scopeId,
    markedRefs: ctx.base.marked
  });
  return serializeTopCross(serial, tree);
}
async function crossSerializeAsync(source, options = {}) {
  const plugins = resolvePlugins(options.plugins);
  const ctx = createAsyncParserContext(2 /* Cross */, {
    plugins,
    disabledFeatures: options.disabledFeatures,
    refs: options.refs
  });
  const tree = await parseTopAsync(ctx, source);
  const serial = createCrossSerializerContext({
    plugins,
    features: ctx.base.features,
    scopeId: options.scopeId,
    markedRefs: ctx.base.marked
  });
  return serializeTopCross(serial, tree);
}
function toCrossJSON(source, options = {}) {
  const plugins = resolvePlugins(options.plugins);
  const ctx = createSyncParserContext(2 /* Cross */, {
    plugins,
    disabledFeatures: options.disabledFeatures,
    refs: options.refs
  });
  return parseTop(ctx, source);
}
async function toCrossJSONAsync(source, options = {}) {
  const plugins = resolvePlugins(options.plugins);
  const ctx = createAsyncParserContext(2 /* Cross */, {
    plugins,
    disabledFeatures: options.disabledFeatures,
    refs: options.refs
  });
  return await parseTopAsync(ctx, source);
}
function crossSerializeStream(source, options) {
  const plugins = resolvePlugins(options.plugins);
  const ctx = createStreamParserContext({
    plugins,
    refs: options.refs,
    disabledFeatures: options.disabledFeatures,
    onParse(node, initial) {
      const serial = createCrossSerializerContext({
        plugins,
        features: ctx.base.features,
        scopeId: options.scopeId,
        markedRefs: ctx.base.marked
      });
      let serialized;
      try {
        serialized = serializeTopCross(serial, node);
      } catch (err) {
        if (options.onError) {
          options.onError(err);
        }
        return;
      }
      options.onSerialize(serialized, initial);
    },
    onError: options.onError,
    onDone: options.onDone
  });
  startStreamParse(ctx, source);
  return destroyStreamParse.bind(null, ctx);
}
function toCrossJSONStream(source, options) {
  const plugins = resolvePlugins(options.plugins);
  const ctx = createStreamParserContext({
    plugins,
    refs: options.refs,
    disabledFeatures: options.disabledFeatures,
    depthLimit: options.depthLimit,
    onParse: options.onParse,
    onError: options.onError,
    onDone: options.onDone
  });
  startStreamParse(ctx, source);
  return destroyStreamParse.bind(null, ctx);
}
function fromCrossJSON(source, options) {
  const plugins = resolvePlugins(options.plugins);
  const ctx = createCrossDeserializerContext({
    plugins,
    refs: options.refs,
    features: options.features,
    disabledFeatures: options.disabledFeatures,
    depthLimit: options.depthLimit
  });
  return deserializeTop(ctx, source);
}

// src/core/Serializer.ts
var Serializer = class {
  constructor(options) {
    this.options = options;
    this.alive = true;
    this.flushed = false;
    this.done = false;
    this.pending = 0;
    this.cleanups = [];
    this.refs = /* @__PURE__ */ new Map();
    this.keys = /* @__PURE__ */ new Set();
    this.ids = 0;
    this.plugins = resolvePlugins(options.plugins);
  }
  write(key, value) {
    if (this.alive && !this.flushed) {
      this.pending++;
      this.keys.add(key);
      this.cleanups.push(
        crossSerializeStream(value, {
          plugins: this.plugins,
          scopeId: this.options.scopeId,
          refs: this.refs,
          disabledFeatures: this.options.disabledFeatures,
          onError: this.options.onError,
          onSerialize: (data, initial) => {
            if (this.alive) {
              this.options.onData(
                initial ? this.options.globalIdentifier + '["' + serializeString(key) + '"]=' + data : data
              );
            }
          },
          onDone: () => {
            if (this.alive) {
              this.pending--;
              if (this.pending <= 0 && this.flushed && !this.done && this.options.onDone) {
                this.options.onDone();
                this.done = true;
              }
            }
          }
        })
      );
    }
  }
  getNextID() {
    while (this.keys.has("" + this.ids)) {
      this.ids++;
    }
    return "" + this.ids;
  }
  push(value) {
    const newID = this.getNextID();
    this.write(newID, value);
    return newID;
  }
  flush() {
    if (this.alive) {
      this.flushed = true;
      if (this.pending <= 0 && !this.done && this.options.onDone) {
        this.options.onDone();
        this.done = true;
      }
    }
  }
  close() {
    if (this.alive) {
      for (let i = 0, len = this.cleanups.length; i < len; i++) {
        this.cleanups[i]();
      }
      if (!this.done && this.options.onDone) {
        this.options.onDone();
        this.done = true;
      }
      this.alive = false;
    }
  }
};

// src/core/tree/index.ts
function serialize2(source, options = {}) {
  const plugins = resolvePlugins(options.plugins);
  const ctx = createSyncParserContext(1 /* Vanilla */, {
    plugins,
    disabledFeatures: options.disabledFeatures
  });
  const tree = parseTop(ctx, source);
  const serial = createVanillaSerializerContext({
    plugins,
    features: ctx.base.features,
    markedRefs: ctx.base.marked
  });
  return serializeTopVanilla(serial, tree);
}
async function serializeAsync(source, options = {}) {
  const plugins = resolvePlugins(options.plugins);
  const ctx = createAsyncParserContext(1 /* Vanilla */, {
    plugins,
    disabledFeatures: options.disabledFeatures
  });
  const tree = await parseTopAsync(ctx, source);
  const serial = createVanillaSerializerContext({
    plugins,
    features: ctx.base.features,
    markedRefs: ctx.base.marked
  });
  return serializeTopVanilla(serial, tree);
}
function deserialize2(source) {
  return (0, eval)(source);
}
function toJSON(source, options = {}) {
  const plugins = resolvePlugins(options.plugins);
  const ctx = createSyncParserContext(1 /* Vanilla */, {
    plugins,
    disabledFeatures: options.disabledFeatures
  });
  return {
    t: parseTop(ctx, source),
    f: ctx.base.features,
    m: Array.from(ctx.base.marked)
  };
}
async function toJSONAsync(source, options = {}) {
  const plugins = resolvePlugins(options.plugins);
  const ctx = createAsyncParserContext(1 /* Vanilla */, {
    plugins,
    disabledFeatures: options.disabledFeatures
  });
  return {
    t: await parseTopAsync(ctx, source),
    f: ctx.base.features,
    m: Array.from(ctx.base.marked)
  };
}
function compileJSON(source, options = {}) {
  const plugins = resolvePlugins(options.plugins);
  const ctx = createVanillaSerializerContext({
    plugins,
    features: source.f,
    markedRefs: source.m
  });
  return serializeTopVanilla(ctx, source.t);
}
function fromJSON(source, options = {}) {
  var _a;
  const plugins = resolvePlugins(options.plugins);
  const disabledFeatures = options.disabledFeatures || 0;
  const sourceFeatures = (_a = source.f) != null ? _a : ALL_ENABLED;
  const ctx = createVanillaDeserializerContext({
    plugins,
    markedRefs: source.m,
    features: sourceFeatures & ~disabledFeatures,
    disabledFeatures
  });
  return deserializeTop(ctx, source.t);
}
export {
  Feature,
  OpaqueReference,
  Serializer,
  SerovalConflictedNodeIdError,
  SerovalDepthLimitError,
  SerovalDeserializationError,
  SerovalError,
  SerovalMalformedNodeError,
  SerovalMissingInstanceError,
  SerovalMissingPluginError,
  SerovalMissingReferenceError,
  SerovalMissingReferenceForIdError,
  SerovalMode,
  SerovalParserError,
  SerovalSerializationError,
  SerovalUnknownTypedArrayError,
  SerovalUnsupportedNodeError,
  SerovalUnsupportedTypeError,
  compileJSON,
  createPlugin,
  createReference,
  createStream,
  crossSerialize,
  crossSerializeAsync,
  crossSerializeStream,
  deserialize2 as deserialize,
  fromCrossJSON,
  fromJSON,
  getCrossReferenceHeader,
  resolvePlugins,
  serialize2 as serialize,
  serializeAsync,
  toCrossJSON,
  toCrossJSONAsync,
  toCrossJSONStream,
  toJSON,
  toJSONAsync
};
                                  

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL2NvbXBhdC50cyIsIi4uLy4uLy4uL3NyYy9jb3JlL3N5bWJvbHMudHMiLCIuLi8uLi8uLi9zcmMvY29yZS9jb25zdGFudHMudHMiLCIuLi8uLi8uLi9zcmMvY29yZS9ub2RlLnRzIiwiLi4vLi4vLi4vc3JjL2NvcmUvbGl0ZXJhbHMudHMiLCIuLi8uLi8uLi9zcmMvY29yZS9zdHJpbmcudHMiLCIuLi8uLi8uLi9zcmMvY29yZS9rZXlzLnRzIiwiLi4vLi4vLi4vc3JjL2NvcmUvcmVmZXJlbmNlLnRzIiwiLi4vLi4vLi4vc3JjL2NvcmUvdXRpbHMvZXJyb3IudHMiLCIuLi8uLi8uLi9zcmMvY29yZS91dGlscy9nZXQtb2JqZWN0LWZsYWcudHMiLCIuLi8uLi8uLi9zcmMvY29yZS9iYXNlLXByaW1pdGl2ZXMudHMiLCIuLi8uLi8uLi9zcmMvY29yZS9lcnJvcnMudHMiLCIuLi8uLi8uLi9zcmMvY29yZS9vcGFxdWUtcmVmZXJlbmNlLnRzIiwiLi4vLi4vLi4vc3JjL2NvcmUvY29uc3RydWN0b3JzLnRzIiwiLi4vLi4vLi4vc3JjL2NvcmUvc2VxdWVuY2UudHMiLCIuLi8uLi8uLi9zcmMvY29yZS9zcGVjaWFsLXJlZmVyZW5jZS50cyIsIi4uLy4uLy4uL3NyYy9jb3JlL3N0cmVhbS50cyIsIi4uLy4uLy4uL3NyYy9jb3JlL3V0aWxzL3Byb21pc2UtdG8tcmVzdWx0LnRzIiwiLi4vLi4vLi4vc3JjL2NvcmUvY29udGV4dC9wYXJzZXIudHMiLCIuLi8uLi8uLi9zcmMvY29yZS9jb250ZXh0L2FzeW5jLXBhcnNlci50cyIsIi4uLy4uLy4uL3NyYy9jb3JlL3BsdWdpbi50cyIsIi4uLy4uLy4uL3NyYy9jb3JlL3V0aWxzL3R5cGVkLWFycmF5LnRzIiwiLi4vLi4vLi4vc3JjL2NvcmUvY29udGV4dC9kZXNlcmlhbGl6ZXIudHMiLCIuLi8uLi8uLi9zcmMvY29yZS9mdW5jdGlvbi1zdHJpbmcudHMiLCIuLi8uLi8uLi9zcmMvY29yZS91dGlscy9nZXQtaWRlbnRpZmllci50cyIsIi4uLy4uLy4uL3NyYy9jb3JlL3V0aWxzL2lzLXZhbGlkLWlkZW50aWZpZXIudHMiLCIuLi8uLi8uLi9zcmMvY29yZS9jb250ZXh0L3NlcmlhbGl6ZXIudHMiLCIuLi8uLi8uLi9zcmMvY29yZS9jb250ZXh0L3N5bmMtcGFyc2VyLnRzIiwiLi4vLi4vLi4vc3JjL2NvcmUvY3Jvc3MvaW5kZXgudHMiLCIuLi8uLi8uLi9zcmMvY29yZS9TZXJpYWxpemVyLnRzIiwiLi4vLi4vLi4vc3JjL2NvcmUvdHJlZS9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFJlZmVyZW5jZXNcbiAqIC0gaHR0cHM6Ly9jb21wYXQtdGFibGUuZ2l0aHViLmlvL2NvbXBhdC10YWJsZS9lczYvXG4gKiAtIE1ETlxuICovXG5cbmV4cG9ydCBlbnVtIEZlYXR1cmUge1xuICBBZ2dyZWdhdGVFcnJvciA9IDB4MDEsXG4gIC8vIEBkZXByZWNhdGVkXG4gIEFycm93RnVuY3Rpb24gPSAweDAyLFxuICBFcnJvclByb3RvdHlwZVN0YWNrID0gMHgwNCxcbiAgT2JqZWN0QXNzaWduID0gMHgwOCxcbiAgQmlnSW50VHlwZWRBcnJheSA9IDB4MTAsXG4gIFJlZ0V4cCA9IDB4MjAsXG59XG5cbmV4cG9ydCBjb25zdCBBTExfRU5BQkxFRCA9XG4gIEZlYXR1cmUuQWdncmVnYXRlRXJyb3IgfFxuICBGZWF0dXJlLkFycm93RnVuY3Rpb24gfFxuICBGZWF0dXJlLkVycm9yUHJvdG90eXBlU3RhY2sgfFxuICBGZWF0dXJlLk9iamVjdEFzc2lnbiB8XG4gIEZlYXR1cmUuQmlnSW50VHlwZWRBcnJheSB8XG4gIEZlYXR1cmUuUmVnRXhwO1xuIiwiZXhwb3J0IGNvbnN0IFNZTV9BU1lOQ19JVEVSQVRPUjogdHlwZW9mIFN5bWJvbC5hc3luY0l0ZXJhdG9yID1cbiAgU3ltYm9sLmFzeW5jSXRlcmF0b3I7XG5leHBvcnQgY29uc3QgU1lNX0hBU19JTlNUQU5DRTogdHlwZW9mIFN5bWJvbC5oYXNJbnN0YW5jZSA9IFN5bWJvbC5oYXNJbnN0YW5jZTtcbmV4cG9ydCBjb25zdCBTWU1fSVNfQ09OQ0FUX1NQUkVBREFCTEU6IHR5cGVvZiBTeW1ib2wuaXNDb25jYXRTcHJlYWRhYmxlID1cbiAgU3ltYm9sLmlzQ29uY2F0U3ByZWFkYWJsZTtcbmV4cG9ydCBjb25zdCBTWU1fSVRFUkFUT1I6IHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPSBTeW1ib2wuaXRlcmF0b3I7XG5leHBvcnQgY29uc3QgU1lNX01BVENIOiB0eXBlb2YgU3ltYm9sLm1hdGNoID0gU3ltYm9sLm1hdGNoO1xuZXhwb3J0IGNvbnN0IFNZTV9NQVRDSF9BTEw6IHR5cGVvZiBTeW1ib2wubWF0Y2hBbGwgPSBTeW1ib2wubWF0Y2hBbGw7XG5leHBvcnQgY29uc3QgU1lNX1JFUExBQ0U6IHR5cGVvZiBTeW1ib2wucmVwbGFjZSA9IFN5bWJvbC5yZXBsYWNlO1xuZXhwb3J0IGNvbnN0IFNZTV9TRUFSQ0g6IHR5cGVvZiBTeW1ib2wuc2VhcmNoID0gU3ltYm9sLnNlYXJjaDtcbmV4cG9ydCBjb25zdCBTWU1fU1BFQ0lFUzogdHlwZW9mIFN5bWJvbC5zcGVjaWVzID0gU3ltYm9sLnNwZWNpZXM7XG5leHBvcnQgY29uc3QgU1lNX1NQTElUOiB0eXBlb2YgU3ltYm9sLnNwbGl0ID0gU3ltYm9sLnNwbGl0O1xuZXhwb3J0IGNvbnN0IFNZTV9UT19QUklNSVRJVkU6IHR5cGVvZiBTeW1ib2wudG9QcmltaXRpdmUgPSBTeW1ib2wudG9QcmltaXRpdmU7XG5leHBvcnQgY29uc3QgU1lNX1RPX1NUUklOR19UQUc6IHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPSBTeW1ib2wudG9TdHJpbmdUYWc7XG5leHBvcnQgY29uc3QgU1lNX1VOU0NPUEFCTEVTOiB0eXBlb2YgU3ltYm9sLnVuc2NvcGFibGVzID0gU3ltYm9sLnVuc2NvcGFibGVzO1xuXG4vLyBGb3IgdGhlIGZ1dHVyZVxuXG4vLyBleHBvcnQgY29uc3QgU1lNX0RJU1BPU0UgPSBTeW1ib2wuZGlzcG9zZTtcbi8vIGV4cG9ydCBjb25zdCBTWU1fQVNZTkNfRElTUE9TRSA9IFN5bWJvbC5hc3luY0Rpc3Bvc2U7XG4iLCJpbXBvcnQge1xuICBTWU1fQVNZTkNfSVRFUkFUT1IsXG4gIFNZTV9IQVNfSU5TVEFOQ0UsXG4gIFNZTV9JU19DT05DQVRfU1BSRUFEQUJMRSxcbiAgU1lNX0lURVJBVE9SLFxuICBTWU1fTUFUQ0gsXG4gIFNZTV9NQVRDSF9BTEwsXG4gIFNZTV9SRVBMQUNFLFxuICBTWU1fU0VBUkNILFxuICBTWU1fU1BFQ0lFUyxcbiAgU1lNX1NQTElULFxuICBTWU1fVE9fUFJJTUlUSVZFLFxuICBTWU1fVE9fU1RSSU5HX1RBRyxcbiAgU1lNX1VOU0NPUEFCTEVTLFxufSBmcm9tICcuL3N5bWJvbHMnO1xuXG5leHBvcnQgY29uc3QgZW51bSBTZXJvdmFsQ29uc3RhbnQge1xuICBOdWxsID0gMCxcbiAgVW5kZWZpbmVkID0gMSxcbiAgVHJ1ZSA9IDIsXG4gIEZhbHNlID0gMyxcbiAgTmVnWmVybyA9IDQsXG4gIEluZiA9IDUsXG4gIE5lZ0luZiA9IDYsXG4gIE5hbiA9IDcsXG59XG5cbmV4cG9ydCBjb25zdCBlbnVtIFNlcm92YWxOb2RlVHlwZSB7XG4gIE51bWJlciA9IDAsXG4gIFN0cmluZyA9IDEsXG4gIENvbnN0YW50ID0gMixcbiAgQmlnSW50ID0gMyxcbiAgSW5kZXhlZFZhbHVlID0gNCxcbiAgRGF0ZSA9IDUsXG4gIFJlZ0V4cCA9IDYsXG4gIFNldCA9IDcsXG4gIE1hcCA9IDgsXG4gIEFycmF5ID0gOSxcbiAgT2JqZWN0ID0gMTAsXG4gIE51bGxDb25zdHJ1Y3RvciA9IDExLFxuICBQcm9taXNlID0gMTIsXG4gIEVycm9yID0gMTMsXG4gIEFnZ3JlZ2F0ZUVycm9yID0gMTQsXG4gIFR5cGVkQXJyYXkgPSAxNSxcbiAgQmlnSW50VHlwZWRBcnJheSA9IDE2LFxuICBXS1N5bWJvbCA9IDE3LFxuICBSZWZlcmVuY2UgPSAxOCxcbiAgQXJyYXlCdWZmZXIgPSAxOSxcbiAgRGF0YVZpZXcgPSAyMCxcbiAgQm94ZWQgPSAyMSxcbiAgUHJvbWlzZUNvbnN0cnVjdG9yID0gMjIsXG4gIFByb21pc2VTdWNjZXNzID0gMjMsXG4gIFByb21pc2VGYWlsdXJlID0gMjQsXG4gIFBsdWdpbiA9IDI1LFxuICBTcGVjaWFsUmVmZXJlbmNlID0gMjYsXG4gIEl0ZXJhdG9yRmFjdG9yeSA9IDI3LFxuICBJdGVyYXRvckZhY3RvcnlJbnN0YW5jZSA9IDI4LFxuICBBc3luY0l0ZXJhdG9yRmFjdG9yeSA9IDI5LFxuICBBc3luY0l0ZXJhdG9yRmFjdG9yeUluc3RhbmNlID0gMzAsXG4gIFN0cmVhbUNvbnN0cnVjdG9yID0gMzEsXG4gIFN0cmVhbU5leHQgPSAzMixcbiAgU3RyZWFtVGhyb3cgPSAzMyxcbiAgU3RyZWFtUmV0dXJuID0gMzQsXG4gIFNlcXVlbmNlID0gMzUsXG59XG5cbmV4cG9ydCBjb25zdCBlbnVtIFNlcm92YWxPYmplY3RGbGFncyB7XG4gIE5vbmUgPSAwLFxuICBOb25FeHRlbnNpYmxlID0gMSxcbiAgU2VhbGVkID0gMixcbiAgRnJvemVuID0gMyxcbn1cblxuZXhwb3J0IGNvbnN0IGVudW0gU3ltYm9scyB7XG4gIEFzeW5jSXRlcmF0b3IgPSAwLFxuICBIYXNJbnN0YW5jZSA9IDEsXG4gIElzQ29uY2F0U3ByZWFkYWJsZSA9IDIsXG4gIEl0ZXJhdG9yID0gMyxcbiAgTWF0Y2ggPSA0LFxuICBNYXRjaEFsbCA9IDUsXG4gIFJlcGxhY2UgPSA2LFxuICBTZWFyY2ggPSA3LFxuICBTcGVjaWVzID0gOCxcbiAgU3BsaXQgPSA5LFxuICBUb1ByaW1pdGl2ZSA9IDEwLFxuICBUb1N0cmluZ1RhZyA9IDExLFxuICBVbnNjb3BhYmxlcyA9IDEyLFxufVxuXG5leHBvcnQgY29uc3QgU1lNQk9MX1NUUklORzogUmVjb3JkPFN5bWJvbHMsIHN0cmluZz4gPSB7XG4gIFtTeW1ib2xzLkFzeW5jSXRlcmF0b3JdOiAnU3ltYm9sLmFzeW5jSXRlcmF0b3InLFxuICBbU3ltYm9scy5IYXNJbnN0YW5jZV06ICdTeW1ib2wuaGFzSW5zdGFuY2UnLFxuICBbU3ltYm9scy5Jc0NvbmNhdFNwcmVhZGFibGVdOiAnU3ltYm9sLmlzQ29uY2F0U3ByZWFkYWJsZScsXG4gIFtTeW1ib2xzLkl0ZXJhdG9yXTogJ1N5bWJvbC5pdGVyYXRvcicsXG4gIFtTeW1ib2xzLk1hdGNoXTogJ1N5bWJvbC5tYXRjaCcsXG4gIFtTeW1ib2xzLk1hdGNoQWxsXTogJ1N5bWJvbC5tYXRjaEFsbCcsXG4gIFtTeW1ib2xzLlJlcGxhY2VdOiAnU3ltYm9sLnJlcGxhY2UnLFxuICBbU3ltYm9scy5TZWFyY2hdOiAnU3ltYm9sLnNlYXJjaCcsXG4gIFtTeW1ib2xzLlNwZWNpZXNdOiAnU3ltYm9sLnNwZWNpZXMnLFxuICBbU3ltYm9scy5TcGxpdF06ICdTeW1ib2wuc3BsaXQnLFxuICBbU3ltYm9scy5Ub1ByaW1pdGl2ZV06ICdTeW1ib2wudG9QcmltaXRpdmUnLFxuICBbU3ltYm9scy5Ub1N0cmluZ1RhZ106ICdTeW1ib2wudG9TdHJpbmdUYWcnLFxuICBbU3ltYm9scy5VbnNjb3BhYmxlc106ICdTeW1ib2wudW5zY29wYWJsZXMnLFxufTtcblxuZXhwb3J0IGNvbnN0IElOVl9TWU1CT0xfUkVGID0gLyogQF9fUFVSRV9fICovIHtcbiAgW1NZTV9BU1lOQ19JVEVSQVRPUl06IFN5bWJvbHMuQXN5bmNJdGVyYXRvcixcbiAgW1NZTV9IQVNfSU5TVEFOQ0VdOiBTeW1ib2xzLkhhc0luc3RhbmNlLFxuICBbU1lNX0lTX0NPTkNBVF9TUFJFQURBQkxFXTogU3ltYm9scy5Jc0NvbmNhdFNwcmVhZGFibGUsXG4gIFtTWU1fSVRFUkFUT1JdOiBTeW1ib2xzLkl0ZXJhdG9yLFxuICBbU1lNX01BVENIXTogU3ltYm9scy5NYXRjaCxcbiAgW1NZTV9NQVRDSF9BTExdOiBTeW1ib2xzLk1hdGNoQWxsLFxuICBbU1lNX1JFUExBQ0VdOiBTeW1ib2xzLlJlcGxhY2UsXG4gIFtTWU1fU0VBUkNIXTogU3ltYm9scy5TZWFyY2gsXG4gIFtTWU1fU1BFQ0lFU106IFN5bWJvbHMuU3BlY2llcyxcbiAgW1NZTV9TUExJVF06IFN5bWJvbHMuU3BsaXQsXG4gIFtTWU1fVE9fUFJJTUlUSVZFXTogU3ltYm9scy5Ub1ByaW1pdGl2ZSxcbiAgW1NZTV9UT19TVFJJTkdfVEFHXTogU3ltYm9scy5Ub1N0cmluZ1RhZyxcbiAgW1NZTV9VTlNDT1BBQkxFU106IFN5bWJvbHMuVW5zY29wYWJsZXMsXG59O1xuXG5leHBvcnQgdHlwZSBXZWxsS25vd25TeW1ib2xzID0ga2V5b2YgdHlwZW9mIElOVl9TWU1CT0xfUkVGO1xuXG5leHBvcnQgY29uc3QgU1lNQk9MX1JFRjogUmVjb3JkPFN5bWJvbHMsIFdlbGxLbm93blN5bWJvbHM+ID0ge1xuICBbU3ltYm9scy5Bc3luY0l0ZXJhdG9yXTogU1lNX0FTWU5DX0lURVJBVE9SLFxuICBbU3ltYm9scy5IYXNJbnN0YW5jZV06IFNZTV9IQVNfSU5TVEFOQ0UsXG4gIFtTeW1ib2xzLklzQ29uY2F0U3ByZWFkYWJsZV06IFNZTV9JU19DT05DQVRfU1BSRUFEQUJMRSxcbiAgW1N5bWJvbHMuSXRlcmF0b3JdOiBTWU1fSVRFUkFUT1IsXG4gIFtTeW1ib2xzLk1hdGNoXTogU1lNX01BVENILFxuICBbU3ltYm9scy5NYXRjaEFsbF06IFNZTV9NQVRDSF9BTEwsXG4gIFtTeW1ib2xzLlJlcGxhY2VdOiBTWU1fUkVQTEFDRSxcbiAgW1N5bWJvbHMuU2VhcmNoXTogU1lNX1NFQVJDSCxcbiAgW1N5bWJvbHMuU3BlY2llc106IFNZTV9TUEVDSUVTLFxuICBbU3ltYm9scy5TcGxpdF06IFNZTV9TUExJVCxcbiAgW1N5bWJvbHMuVG9QcmltaXRpdmVdOiBTWU1fVE9fUFJJTUlUSVZFLFxuICBbU3ltYm9scy5Ub1N0cmluZ1RhZ106IFNZTV9UT19TVFJJTkdfVEFHLFxuICBbU3ltYm9scy5VbnNjb3BhYmxlc106IFNZTV9VTlNDT1BBQkxFUyxcbn07XG5cbmV4cG9ydCBjb25zdCBDT05TVEFOVF9TVFJJTkc6IFJlY29yZDxTZXJvdmFsQ29uc3RhbnQsIHN0cmluZz4gPSB7XG4gIFtTZXJvdmFsQ29uc3RhbnQuVHJ1ZV06ICchMCcsXG4gIFtTZXJvdmFsQ29uc3RhbnQuRmFsc2VdOiAnITEnLFxuICBbU2Vyb3ZhbENvbnN0YW50LlVuZGVmaW5lZF06ICd2b2lkIDAnLFxuICBbU2Vyb3ZhbENvbnN0YW50Lk51bGxdOiAnbnVsbCcsXG4gIFtTZXJvdmFsQ29uc3RhbnQuTmVnWmVyb106ICctMCcsXG4gIFtTZXJvdmFsQ29uc3RhbnQuSW5mXTogJzEvMCcsXG4gIFtTZXJvdmFsQ29uc3RhbnQuTmVnSW5mXTogJy0xLzAnLFxuICBbU2Vyb3ZhbENvbnN0YW50Lk5hbl06ICcwLzAnLFxufTtcblxuZXhwb3J0IGNvbnN0IE5JTCA9IHZvaWQgMDtcblxuZXhwb3J0IGNvbnN0IENPTlNUQU5UX1ZBTDogUmVjb3JkPFNlcm92YWxDb25zdGFudCwgdW5rbm93bj4gPSB7XG4gIFtTZXJvdmFsQ29uc3RhbnQuVHJ1ZV06IHRydWUsXG4gIFtTZXJvdmFsQ29uc3RhbnQuRmFsc2VdOiBmYWxzZSxcbiAgW1Nlcm92YWxDb25zdGFudC5VbmRlZmluZWRdOiBOSUwsXG4gIFtTZXJvdmFsQ29uc3RhbnQuTnVsbF06IG51bGwsXG4gIFtTZXJvdmFsQ29uc3RhbnQuTmVnWmVyb106IC0wLFxuICBbU2Vyb3ZhbENvbnN0YW50LkluZl06IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcbiAgW1Nlcm92YWxDb25zdGFudC5OZWdJbmZdOiBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFksXG4gIFtTZXJvdmFsQ29uc3RhbnQuTmFuXTogTnVtYmVyLk5hTixcbn07XG5cbmV4cG9ydCBjb25zdCBlbnVtIEVycm9yQ29uc3RydWN0b3JUYWcge1xuICBFcnJvciA9IDAsXG4gIEV2YWxFcnJvciA9IDEsXG4gIFJhbmdlRXJyb3IgPSAyLFxuICBSZWZlcmVuY2VFcnJvciA9IDMsXG4gIFN5bnRheEVycm9yID0gNCxcbiAgVHlwZUVycm9yID0gNSxcbiAgVVJJRXJyb3IgPSA2LFxufVxuXG5leHBvcnQgY29uc3QgRVJST1JfQ09OU1RSVUNUT1JfU1RSSU5HOiBSZWNvcmQ8RXJyb3JDb25zdHJ1Y3RvclRhZywgc3RyaW5nPiA9IHtcbiAgW0Vycm9yQ29uc3RydWN0b3JUYWcuRXJyb3JdOiAnRXJyb3InLFxuICBbRXJyb3JDb25zdHJ1Y3RvclRhZy5FdmFsRXJyb3JdOiAnRXZhbEVycm9yJyxcbiAgW0Vycm9yQ29uc3RydWN0b3JUYWcuUmFuZ2VFcnJvcl06ICdSYW5nZUVycm9yJyxcbiAgW0Vycm9yQ29uc3RydWN0b3JUYWcuUmVmZXJlbmNlRXJyb3JdOiAnUmVmZXJlbmNlRXJyb3InLFxuICBbRXJyb3JDb25zdHJ1Y3RvclRhZy5TeW50YXhFcnJvcl06ICdTeW50YXhFcnJvcicsXG4gIFtFcnJvckNvbnN0cnVjdG9yVGFnLlR5cGVFcnJvcl06ICdUeXBlRXJyb3InLFxuICBbRXJyb3JDb25zdHJ1Y3RvclRhZy5VUklFcnJvcl06ICdVUklFcnJvcicsXG59O1xuXG50eXBlIEVycm9yQ29uc3RydWN0b3JzID1cbiAgfCBFcnJvckNvbnN0cnVjdG9yXG4gIHwgRXZhbEVycm9yQ29uc3RydWN0b3JcbiAgfCBSYW5nZUVycm9yQ29uc3RydWN0b3JcbiAgfCBSZWZlcmVuY2VFcnJvckNvbnN0cnVjdG9yXG4gIHwgU3ludGF4RXJyb3JDb25zdHJ1Y3RvclxuICB8IFR5cGVFcnJvckNvbnN0cnVjdG9yXG4gIHwgVVJJRXJyb3JDb25zdHJ1Y3RvcjtcblxuZXhwb3J0IGNvbnN0IEVSUk9SX0NPTlNUUlVDVE9SOiBSZWNvcmQ8RXJyb3JDb25zdHJ1Y3RvclRhZywgRXJyb3JDb25zdHJ1Y3RvcnM+ID1cbiAge1xuICAgIFtFcnJvckNvbnN0cnVjdG9yVGFnLkVycm9yXTogRXJyb3IsXG4gICAgW0Vycm9yQ29uc3RydWN0b3JUYWcuRXZhbEVycm9yXTogRXZhbEVycm9yLFxuICAgIFtFcnJvckNvbnN0cnVjdG9yVGFnLlJhbmdlRXJyb3JdOiBSYW5nZUVycm9yLFxuICAgIFtFcnJvckNvbnN0cnVjdG9yVGFnLlJlZmVyZW5jZUVycm9yXTogUmVmZXJlbmNlRXJyb3IsXG4gICAgW0Vycm9yQ29uc3RydWN0b3JUYWcuU3ludGF4RXJyb3JdOiBTeW50YXhFcnJvcixcbiAgICBbRXJyb3JDb25zdHJ1Y3RvclRhZy5UeXBlRXJyb3JdOiBUeXBlRXJyb3IsXG4gICAgW0Vycm9yQ29uc3RydWN0b3JUYWcuVVJJRXJyb3JdOiBVUklFcnJvcixcbiAgfTtcbiIsImltcG9ydCB0eXBlIHsgU2Vyb3ZhbE5vZGVUeXBlIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHR5cGUgeyBTZXJvdmFsTm9kZSB9IGZyb20gJy4vdHlwZXMnO1xuXG50eXBlIEV4dHJhY3RlZE5vZGVUeXBlPFQgZXh0ZW5kcyBTZXJvdmFsTm9kZVR5cGU+ID0gRXh0cmFjdDxcbiAgU2Vyb3ZhbE5vZGUsXG4gIHsgdDogVCB9XG4+O1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2Vyb3ZhbE5vZGU8XG4gIFQgZXh0ZW5kcyBTZXJvdmFsTm9kZVR5cGUsXG4gIE4gZXh0ZW5kcyBFeHRyYWN0ZWROb2RlVHlwZTxUPixcbj4oXG4gIHQ6IFQsXG4gIGk6IE5bJ2knXSxcbiAgczogTlsncyddLFxuICBjOiBOWydjJ10sXG4gIG06IE5bJ20nXSxcbiAgcDogTlsncCddLFxuICBlOiBOWydlJ10sXG4gIGE6IE5bJ2EnXSxcbiAgZjogTlsnZiddLFxuICBiOiBOWydiJ10sXG4gIG86IE5bJ28nXSxcbiAgbDogTlsnbCddLFxuKTogTiB7XG4gIHJldHVybiB7XG4gICAgdCxcbiAgICBpLFxuICAgIHMsXG4gICAgYyxcbiAgICBtLFxuICAgIHAsXG4gICAgZSxcbiAgICBhLFxuICAgIGYsXG4gICAgYixcbiAgICBvLFxuICAgIGwsXG4gIH0gYXMgTjtcbn1cbiIsImltcG9ydCB7IE5JTCwgU2Vyb3ZhbENvbnN0YW50LCBTZXJvdmFsTm9kZVR5cGUgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBjcmVhdGVTZXJvdmFsTm9kZSB9IGZyb20gJy4vbm9kZSc7XG5pbXBvcnQgdHlwZSB7IFNlcm92YWxDb25zdGFudE5vZGUgfSBmcm9tICcuL3R5cGVzJztcblxuZnVuY3Rpb24gY3JlYXRlQ29uc3RhbnROb2RlKHZhbHVlOiBTZXJvdmFsQ29uc3RhbnQpOiBTZXJvdmFsQ29uc3RhbnROb2RlIHtcbiAgcmV0dXJuIGNyZWF0ZVNlcm92YWxOb2RlKFxuICAgIFNlcm92YWxOb2RlVHlwZS5Db25zdGFudCxcbiAgICBOSUwsXG4gICAgdmFsdWUsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICk7XG59XG5cbmV4cG9ydCBjb25zdCBUUlVFX05PREUgPSAvKiBAX19QVVJFX18gKi8gY3JlYXRlQ29uc3RhbnROb2RlKFxuICBTZXJvdmFsQ29uc3RhbnQuVHJ1ZSxcbik7XG5leHBvcnQgY29uc3QgRkFMU0VfTk9ERSA9IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVDb25zdGFudE5vZGUoXG4gIFNlcm92YWxDb25zdGFudC5GYWxzZSxcbik7XG5leHBvcnQgY29uc3QgVU5ERUZJTkVEX05PREUgPSAvKiBAX19QVVJFX18gKi8gY3JlYXRlQ29uc3RhbnROb2RlKFxuICBTZXJvdmFsQ29uc3RhbnQuVW5kZWZpbmVkLFxuKTtcbmV4cG9ydCBjb25zdCBOVUxMX05PREUgPSAvKiBAX19QVVJFX18gKi8gY3JlYXRlQ29uc3RhbnROb2RlKFxuICBTZXJvdmFsQ29uc3RhbnQuTnVsbCxcbik7XG5leHBvcnQgY29uc3QgTkVHX1pFUk9fTk9ERSA9IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVDb25zdGFudE5vZGUoXG4gIFNlcm92YWxDb25zdGFudC5OZWdaZXJvLFxuKTtcbmV4cG9ydCBjb25zdCBJTkZJTklUWV9OT0RFID0gLyogQF9fUFVSRV9fICovIGNyZWF0ZUNvbnN0YW50Tm9kZShcbiAgU2Vyb3ZhbENvbnN0YW50LkluZixcbik7XG5leHBvcnQgY29uc3QgTkVHX0lORklOSVRZX05PREUgPSAvKiBAX19QVVJFX18gKi8gY3JlYXRlQ29uc3RhbnROb2RlKFxuICBTZXJvdmFsQ29uc3RhbnQuTmVnSW5mLFxuKTtcbmV4cG9ydCBjb25zdCBOQU5fTk9ERSA9IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVDb25zdGFudE5vZGUoU2Vyb3ZhbENvbnN0YW50Lk5hbik7XG4iLCJpbXBvcnQgeyBOSUwgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemVDaGFyKHN0cjogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgc3dpdGNoIChzdHIpIHtcbiAgICBjYXNlICdcIic6XG4gICAgICByZXR1cm4gJ1xcXFxcIic7XG4gICAgY2FzZSAnXFxcXCc6XG4gICAgICByZXR1cm4gJ1xcXFxcXFxcJztcbiAgICBjYXNlICdcXG4nOlxuICAgICAgcmV0dXJuICdcXFxcbic7XG4gICAgY2FzZSAnXFxyJzpcbiAgICAgIHJldHVybiAnXFxcXHInO1xuICAgIGNhc2UgJ1xcYic6XG4gICAgICByZXR1cm4gJ1xcXFxiJztcbiAgICBjYXNlICdcXHQnOlxuICAgICAgcmV0dXJuICdcXFxcdCc7XG4gICAgY2FzZSAnXFxmJzpcbiAgICAgIHJldHVybiAnXFxcXGYnO1xuICAgIGNhc2UgJzwnOlxuICAgICAgcmV0dXJuICdcXFxceDNDJztcbiAgICBjYXNlICdcXHUyMDI4JzpcbiAgICAgIHJldHVybiAnXFxcXHUyMDI4JztcbiAgICBjYXNlICdcXHUyMDI5JzpcbiAgICAgIHJldHVybiAnXFxcXHUyMDI5JztcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIE5JTDtcbiAgfVxufVxuXG4vLyBXcml0dGVuIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9EeWxhblBpZXJjZXkgYW5kIGlzIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbi8vIENyZWF0ZXMgYSBKYXZhU2NyaXB0IGRvdWJsZSBxdW90ZWQgc3RyaW5nIGFuZCBlc2NhcGVzIGFsbCBjaGFyYWN0ZXJzXG4vLyBub3QgbGlzdGVkIGFzIERvdWJsZVN0cmluZ0NoYXJhY3RlcnMgb25cbi8vIEFsc28gaW5jbHVkZXMgXCI8XCIgdG8gZXNjYXBlIFwiPC9zY3JpcHQ+XCIgYW5kIFwiXFxcIiB0byBhdm9pZCBpbnZhbGlkIGVzY2FwZXMgaW4gdGhlIG91dHB1dC5cbi8vIGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi81LjEvI3NlYy03LjguNFxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZVN0cmluZyhzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIGxldCByZXN1bHQgPSAnJztcbiAgbGV0IGxhc3RQb3MgPSAwO1xuICBsZXQgcmVwbGFjZW1lbnQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHN0ci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHJlcGxhY2VtZW50ID0gc2VyaWFsaXplQ2hhcihzdHJbaV0pO1xuICAgIGlmIChyZXBsYWNlbWVudCkge1xuICAgICAgcmVzdWx0ICs9IHN0ci5zbGljZShsYXN0UG9zLCBpKSArIHJlcGxhY2VtZW50O1xuICAgICAgbGFzdFBvcyA9IGkgKyAxO1xuICAgIH1cbiAgfVxuICBpZiAobGFzdFBvcyA9PT0gMCkge1xuICAgIHJlc3VsdCA9IHN0cjtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgKz0gc3RyLnNsaWNlKGxhc3RQb3MpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGRlc2VyaWFsaXplUmVwbGFjZXIoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICBzd2l0Y2ggKHN0cikge1xuICAgIGNhc2UgJ1xcXFxcXFxcJzpcbiAgICAgIHJldHVybiAnXFxcXCc7XG4gICAgY2FzZSAnXFxcXFwiJzpcbiAgICAgIHJldHVybiAnXCInO1xuICAgIGNhc2UgJ1xcXFxuJzpcbiAgICAgIHJldHVybiAnXFxuJztcbiAgICBjYXNlICdcXFxccic6XG4gICAgICByZXR1cm4gJ1xccic7XG4gICAgY2FzZSAnXFxcXGInOlxuICAgICAgcmV0dXJuICdcXGInO1xuICAgIGNhc2UgJ1xcXFx0JzpcbiAgICAgIHJldHVybiAnXFx0JztcbiAgICBjYXNlICdcXFxcZic6XG4gICAgICByZXR1cm4gJ1xcZic7XG4gICAgY2FzZSAnXFxcXHgzQyc6XG4gICAgICByZXR1cm4gJ1xceDNDJztcbiAgICBjYXNlICdcXFxcdTIwMjgnOlxuICAgICAgcmV0dXJuICdcXHUyMDI4JztcbiAgICBjYXNlICdcXFxcdTIwMjknOlxuICAgICAgcmV0dXJuICdcXHUyMDI5JztcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVzZXJpYWxpemVTdHJpbmcoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoXG4gICAgLyhcXFxcXFxcXHxcXFxcXCJ8XFxcXG58XFxcXHJ8XFxcXGJ8XFxcXHR8XFxcXGZ8XFxcXHUyMDI4fFxcXFx1MjAyOXxcXFxceDNDKS9nLFxuICAgIGRlc2VyaWFsaXplUmVwbGFjZXIsXG4gICk7XG59XG4iLCJpbXBvcnQgeyBzZXJpYWxpemVTdHJpbmcgfSBmcm9tICcuL3N0cmluZyc7XG5cbi8vIFVzZWQgZm9yIG1hcHBpbmcgaXNvbW9ycGhpYyByZWZlcmVuY2VzXG5leHBvcnQgY29uc3QgUkVGRVJFTkNFU19LRVkgPSAnX19TRVJPVkFMX1JFRlNfXyc7XG5cbmV4cG9ydCBjb25zdCBHTE9CQUxfQ09OVEVYVF9SRUZFUkVOQ0VTID0gJyRSJztcblxuY29uc3QgR0xPQkFMX0NPTlRFWFRfUiA9IGBzZWxmLiR7R0xPQkFMX0NPTlRFWFRfUkVGRVJFTkNFU31gO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3Jvc3NSZWZlcmVuY2VIZWFkZXIoaWQ/OiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoaWQgPT0gbnVsbCkge1xuICAgIHJldHVybiBgJHtHTE9CQUxfQ09OVEVYVF9SfT0ke0dMT0JBTF9DT05URVhUX1J9fHxbXWA7XG4gIH1cbiAgcmV0dXJuIGAoJHtHTE9CQUxfQ09OVEVYVF9SfT0ke0dMT0JBTF9DT05URVhUX1J9fHx7fSlbXCIke3NlcmlhbGl6ZVN0cmluZyhcbiAgICBpZCxcbiAgKX1cIl09W11gO1xufVxuIiwiaW1wb3J0IHtcbiAgU2Vyb3ZhbE1pc3NpbmdSZWZlcmVuY2VFcnJvcixcbiAgU2Vyb3ZhbE1pc3NpbmdSZWZlcmVuY2VGb3JJZEVycm9yLFxufSBmcm9tICcuLic7XG5pbXBvcnQgeyBSRUZFUkVOQ0VTX0tFWSB9IGZyb20gJy4va2V5cyc7XG5cbmNvbnN0IFJFRkVSRU5DRSA9IG5ldyBNYXA8dW5rbm93biwgc3RyaW5nPigpO1xuY29uc3QgSU5WX1JFRkVSRU5DRSA9IG5ldyBNYXA8c3RyaW5nLCB1bmtub3duPigpO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVmZXJlbmNlPFQ+KGlkOiBzdHJpbmcsIHZhbHVlOiBUKTogVCB7XG4gIFJFRkVSRU5DRS5zZXQodmFsdWUsIGlkKTtcbiAgSU5WX1JFRkVSRU5DRS5zZXQoaWQsIHZhbHVlKTtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzUmVmZXJlbmNlSUQ8VD4odmFsdWU6IFQpOiBib29sZWFuIHtcbiAgcmV0dXJuIFJFRkVSRU5DRS5oYXModmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzUmVmZXJlbmNlKGlkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIElOVl9SRUZFUkVOQ0UuaGFzKGlkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlZmVyZW5jZUlEPFQ+KHZhbHVlOiBUKTogc3RyaW5nIHtcbiAgaWYgKGhhc1JlZmVyZW5jZUlEKHZhbHVlKSkge1xuICAgIHJldHVybiBSRUZFUkVOQ0UuZ2V0KHZhbHVlKSE7XG4gIH1cbiAgdGhyb3cgbmV3IFNlcm92YWxNaXNzaW5nUmVmZXJlbmNlRXJyb3IodmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVmZXJlbmNlPFQ+KGlkOiBzdHJpbmcpOiBUIHtcbiAgaWYgKGhhc1JlZmVyZW5jZShpZCkpIHtcbiAgICByZXR1cm4gSU5WX1JFRkVSRU5DRS5nZXQoaWQpIGFzIFQ7XG4gIH1cbiAgdGhyb3cgbmV3IFNlcm92YWxNaXNzaW5nUmVmZXJlbmNlRm9ySWRFcnJvcihpZCk7XG59XG5cbmlmICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGdsb2JhbFRoaXMsIFJFRkVSRU5DRVNfS0VZLCB7XG4gICAgdmFsdWU6IElOVl9SRUZFUkVOQ0UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgfSk7XG59IGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csIFJFRkVSRU5DRVNfS0VZLCB7XG4gICAgdmFsdWU6IElOVl9SRUZFUkVOQ0UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgfSk7XG59IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2VsZiwgUkVGRVJFTkNFU19LRVksIHtcbiAgICB2YWx1ZTogSU5WX1JFRkVSRU5DRSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IGZhbHNlLFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICB9KTtcbn0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGdsb2JhbCwgUkVGRVJFTkNFU19LRVksIHtcbiAgICB2YWx1ZTogSU5WX1JFRkVSRU5DRSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IGZhbHNlLFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICB9KTtcbn1cbiIsImltcG9ydCB7IEZlYXR1cmUgfSBmcm9tICcuLi9jb21wYXQnO1xuaW1wb3J0IHsgRVJST1JfQ09OU1RSVUNUT1JfU1RSSU5HLCBFcnJvckNvbnN0cnVjdG9yVGFnIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxudHlwZSBFcnJvclZhbHVlID1cbiAgfCBFcnJvclxuICB8IEFnZ3JlZ2F0ZUVycm9yXG4gIHwgRXZhbEVycm9yXG4gIHwgUmFuZ2VFcnJvclxuICB8IFJlZmVyZW5jZUVycm9yXG4gIHwgVHlwZUVycm9yXG4gIHwgU3ludGF4RXJyb3JcbiAgfCBVUklFcnJvcjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVycm9yQ29uc3RydWN0b3IoZXJyb3I6IEVycm9yVmFsdWUpOiBFcnJvckNvbnN0cnVjdG9yVGFnIHtcbiAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXZhbEVycm9yKSB7XG4gICAgcmV0dXJuIEVycm9yQ29uc3RydWN0b3JUYWcuRXZhbEVycm9yO1xuICB9XG4gIGlmIChlcnJvciBpbnN0YW5jZW9mIFJhbmdlRXJyb3IpIHtcbiAgICByZXR1cm4gRXJyb3JDb25zdHJ1Y3RvclRhZy5SYW5nZUVycm9yO1xuICB9XG4gIGlmIChlcnJvciBpbnN0YW5jZW9mIFJlZmVyZW5jZUVycm9yKSB7XG4gICAgcmV0dXJuIEVycm9yQ29uc3RydWN0b3JUYWcuUmVmZXJlbmNlRXJyb3I7XG4gIH1cbiAgaWYgKGVycm9yIGluc3RhbmNlb2YgU3ludGF4RXJyb3IpIHtcbiAgICByZXR1cm4gRXJyb3JDb25zdHJ1Y3RvclRhZy5TeW50YXhFcnJvcjtcbiAgfVxuICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICByZXR1cm4gRXJyb3JDb25zdHJ1Y3RvclRhZy5UeXBlRXJyb3I7XG4gIH1cbiAgaWYgKGVycm9yIGluc3RhbmNlb2YgVVJJRXJyb3IpIHtcbiAgICByZXR1cm4gRXJyb3JDb25zdHJ1Y3RvclRhZy5VUklFcnJvcjtcbiAgfVxuICByZXR1cm4gRXJyb3JDb25zdHJ1Y3RvclRhZy5FcnJvcjtcbn1cblxuZnVuY3Rpb24gZ2V0SW5pdGlhbEVycm9yT3B0aW9ucyhcbiAgZXJyb3I6IEVycm9yLFxuKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCB1bmRlZmluZWQge1xuICBjb25zdCBjb25zdHJ1Y3QgPSBFUlJPUl9DT05TVFJVQ1RPUl9TVFJJTkdbZ2V0RXJyb3JDb25zdHJ1Y3RvcihlcnJvcildO1xuICAvLyBOYW1lIGhhcyBiZWVuIG1vZGlmaWVkXG4gIGlmIChlcnJvci5uYW1lICE9PSBjb25zdHJ1Y3QpIHtcbiAgICByZXR1cm4geyBuYW1lOiBlcnJvci5uYW1lIH07XG4gIH1cbiAgaWYgKGVycm9yLmNvbnN0cnVjdG9yLm5hbWUgIT09IGNvbnN0cnVjdCkge1xuICAgIC8vIE90aGVyd2lzZSwgbmFtZSBpcyBvdmVycmlkZW4gYmVjYXVzZVxuICAgIC8vIHRoZSBFcnJvciBjbGFzcyBpcyBleHRlbmRlZFxuICAgIHJldHVybiB7IG5hbWU6IGVycm9yLmNvbnN0cnVjdG9yLm5hbWUgfTtcbiAgfVxuICByZXR1cm4ge307XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFcnJvck9wdGlvbnMoXG4gIGVycm9yOiBFcnJvcixcbiAgZmVhdHVyZXM6IG51bWJlcixcbik6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgdW5kZWZpbmVkIHtcbiAgbGV0IG9wdGlvbnMgPSBnZXRJbml0aWFsRXJyb3JPcHRpb25zKGVycm9yKTtcbiAgY29uc3QgbmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhlcnJvcik7XG4gIGZvciAobGV0IGkgPSAwLCBsZW4gPSBuYW1lcy5sZW5ndGgsIG5hbWU6IHN0cmluZzsgaSA8IGxlbjsgaSsrKSB7XG4gICAgbmFtZSA9IG5hbWVzW2ldO1xuICAgIGlmIChuYW1lICE9PSAnbmFtZScgJiYgbmFtZSAhPT0gJ21lc3NhZ2UnKSB7XG4gICAgICBpZiAobmFtZSA9PT0gJ3N0YWNrJykge1xuICAgICAgICBpZiAoZmVhdHVyZXMgJiBGZWF0dXJlLkVycm9yUHJvdG90eXBlU3RhY2spIHtcbiAgICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgICBvcHRpb25zW25hbWVdID0gZXJyb3JbbmFtZSBhcyBrZXlvZiBFcnJvcl07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICBvcHRpb25zW25hbWVdID0gZXJyb3JbbmFtZSBhcyBrZXlvZiBFcnJvcl07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBvcHRpb25zO1xufVxuIiwiaW1wb3J0IHsgU2Vyb3ZhbE9iamVjdEZsYWdzIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE9iamVjdEZsYWcob2JqOiB1bmtub3duKTogU2Vyb3ZhbE9iamVjdEZsYWdzIHtcbiAgaWYgKE9iamVjdC5pc0Zyb3plbihvYmopKSB7XG4gICAgcmV0dXJuIFNlcm92YWxPYmplY3RGbGFncy5Gcm96ZW47XG4gIH1cbiAgaWYgKE9iamVjdC5pc1NlYWxlZChvYmopKSB7XG4gICAgcmV0dXJuIFNlcm92YWxPYmplY3RGbGFncy5TZWFsZWQ7XG4gIH1cbiAgaWYgKE9iamVjdC5pc0V4dGVuc2libGUob2JqKSkge1xuICAgIHJldHVybiBTZXJvdmFsT2JqZWN0RmxhZ3MuTm9uZTtcbiAgfVxuICByZXR1cm4gU2Vyb3ZhbE9iamVjdEZsYWdzLk5vbkV4dGVuc2libGU7XG59XG4iLCJpbXBvcnQgdHlwZSB7IFdlbGxLbm93blN5bWJvbHMgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBJTlZfU1lNQk9MX1JFRiwgTklMLCBTZXJvdmFsTm9kZVR5cGUgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQge1xuICBJTkZJTklUWV9OT0RFLFxuICBOQU5fTk9ERSxcbiAgTkVHX0lORklOSVRZX05PREUsXG4gIE5FR19aRVJPX05PREUsXG59IGZyb20gJy4vbGl0ZXJhbHMnO1xuaW1wb3J0IHsgY3JlYXRlU2Vyb3ZhbE5vZGUgfSBmcm9tICcuL25vZGUnO1xuaW1wb3J0IHsgZ2V0UmVmZXJlbmNlSUQgfSBmcm9tICcuL3JlZmVyZW5jZSc7XG5pbXBvcnQgeyBzZXJpYWxpemVTdHJpbmcgfSBmcm9tICcuL3N0cmluZyc7XG5pbXBvcnQgdHlwZSB7XG4gIFNlcm92YWxBZ2dyZWdhdGVFcnJvck5vZGUsXG4gIFNlcm92YWxBcnJheU5vZGUsXG4gIFNlcm92YWxBc3luY0l0ZXJhdG9yRmFjdG9yeUluc3RhbmNlTm9kZSxcbiAgU2Vyb3ZhbEJpZ0ludE5vZGUsXG4gIFNlcm92YWxCaWdJbnRUeXBlZEFycmF5Tm9kZSxcbiAgU2Vyb3ZhbEJveGVkTm9kZSxcbiAgU2Vyb3ZhbENvbnN0YW50Tm9kZSxcbiAgU2Vyb3ZhbERhdGFWaWV3Tm9kZSxcbiAgU2Vyb3ZhbERhdGVOb2RlLFxuICBTZXJvdmFsRXJyb3JOb2RlLFxuICBTZXJvdmFsSW5kZXhlZFZhbHVlTm9kZSxcbiAgU2Vyb3ZhbEl0ZXJhdG9yRmFjdG9yeUluc3RhbmNlTm9kZSxcbiAgU2Vyb3ZhbE5vZGUsXG4gIFNlcm92YWxOb2RlV2l0aElELFxuICBTZXJvdmFsTnVtYmVyTm9kZSxcbiAgU2Vyb3ZhbE9iamVjdFJlY29yZE5vZGUsXG4gIFNlcm92YWxQbHVnaW5Ob2RlLFxuICBTZXJvdmFsUmVmZXJlbmNlTm9kZSxcbiAgU2Vyb3ZhbFJlZ0V4cE5vZGUsXG4gIFNlcm92YWxTZXF1ZW5jZU5vZGUsXG4gIFNlcm92YWxTZXROb2RlLFxuICBTZXJvdmFsU3RyZWFtQ29uc3RydWN0b3JOb2RlLFxuICBTZXJvdmFsU3RyZWFtTmV4dE5vZGUsXG4gIFNlcm92YWxTdHJlYW1SZXR1cm5Ob2RlLFxuICBTZXJvdmFsU3RyZWFtVGhyb3dOb2RlLFxuICBTZXJvdmFsU3RyaW5nTm9kZSxcbiAgU2Vyb3ZhbFR5cGVkQXJyYXlOb2RlLFxuICBTZXJvdmFsV0tTeW1ib2xOb2RlLFxufSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IGdldEVycm9yQ29uc3RydWN0b3IgfSBmcm9tICcuL3V0aWxzL2Vycm9yJztcbmltcG9ydCB7IGdldE9iamVjdEZsYWcgfSBmcm9tICcuL3V0aWxzL2dldC1vYmplY3QtZmxhZyc7XG5pbXBvcnQgdHlwZSB7XG4gIEJpZ0ludFR5cGVkQXJyYXlWYWx1ZSxcbiAgVHlwZWRBcnJheVZhbHVlLFxufSBmcm9tICcuL3V0aWxzL3R5cGVkLWFycmF5JztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU51bWJlck5vZGUoXG4gIHZhbHVlOiBudW1iZXIsXG4pOiBTZXJvdmFsQ29uc3RhbnROb2RlIHwgU2Vyb3ZhbE51bWJlck5vZGUge1xuICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgY2FzZSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk6XG4gICAgICByZXR1cm4gSU5GSU5JVFlfTk9ERTtcbiAgICBjYXNlIE51bWJlci5ORUdBVElWRV9JTkZJTklUWTpcbiAgICAgIHJldHVybiBORUdfSU5GSU5JVFlfTk9ERTtcbiAgfVxuICBpZiAodmFsdWUgIT09IHZhbHVlKSB7XG4gICAgcmV0dXJuIE5BTl9OT0RFO1xuICB9XG4gIGlmIChPYmplY3QuaXModmFsdWUsIC0wKSkge1xuICAgIHJldHVybiBORUdfWkVST19OT0RFO1xuICB9XG4gIHJldHVybiBjcmVhdGVTZXJvdmFsTm9kZShcbiAgICBTZXJvdmFsTm9kZVR5cGUuTnVtYmVyLFxuICAgIE5JTCxcbiAgICB2YWx1ZSxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVN0cmluZ05vZGUodmFsdWU6IHN0cmluZyk6IFNlcm92YWxTdHJpbmdOb2RlIHtcbiAgcmV0dXJuIGNyZWF0ZVNlcm92YWxOb2RlKFxuICAgIFNlcm92YWxOb2RlVHlwZS5TdHJpbmcsXG4gICAgTklMLFxuICAgIHNlcmlhbGl6ZVN0cmluZyh2YWx1ZSksXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVCaWdJbnROb2RlKGN1cnJlbnQ6IGJpZ2ludCk6IFNlcm92YWxCaWdJbnROb2RlIHtcbiAgcmV0dXJuIGNyZWF0ZVNlcm92YWxOb2RlKFxuICAgIFNlcm92YWxOb2RlVHlwZS5CaWdJbnQsXG4gICAgTklMLFxuICAgICcnICsgY3VycmVudCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUluZGV4ZWRWYWx1ZU5vZGUoaWQ6IG51bWJlcik6IFNlcm92YWxJbmRleGVkVmFsdWVOb2RlIHtcbiAgcmV0dXJuIGNyZWF0ZVNlcm92YWxOb2RlKFxuICAgIFNlcm92YWxOb2RlVHlwZS5JbmRleGVkVmFsdWUsXG4gICAgaWQsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRGF0ZU5vZGUoaWQ6IG51bWJlciwgY3VycmVudDogRGF0ZSk6IFNlcm92YWxEYXRlTm9kZSB7XG4gIGNvbnN0IHRpbWVzdGFtcCA9IGN1cnJlbnQudmFsdWVPZigpO1xuICByZXR1cm4gY3JlYXRlU2Vyb3ZhbE5vZGUoXG4gICAgU2Vyb3ZhbE5vZGVUeXBlLkRhdGUsXG4gICAgaWQsXG4gICAgdGltZXN0YW1wICE9PSB0aW1lc3RhbXAgPyAnJyA6IGN1cnJlbnQudG9JU09TdHJpbmcoKSxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJlZ0V4cE5vZGUoXG4gIGlkOiBudW1iZXIsXG4gIGN1cnJlbnQ6IFJlZ0V4cCxcbik6IFNlcm92YWxSZWdFeHBOb2RlIHtcbiAgcmV0dXJuIGNyZWF0ZVNlcm92YWxOb2RlKFxuICAgIFNlcm92YWxOb2RlVHlwZS5SZWdFeHAsXG4gICAgaWQsXG4gICAgTklMLFxuICAgIHNlcmlhbGl6ZVN0cmluZyhjdXJyZW50LnNvdXJjZSksXG4gICAgY3VycmVudC5mbGFncyxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVXS1N5bWJvbE5vZGUoXG4gIGlkOiBudW1iZXIsXG4gIGN1cnJlbnQ6IFdlbGxLbm93blN5bWJvbHMsXG4pOiBTZXJvdmFsV0tTeW1ib2xOb2RlIHtcbiAgcmV0dXJuIGNyZWF0ZVNlcm92YWxOb2RlKFxuICAgIFNlcm92YWxOb2RlVHlwZS5XS1N5bWJvbCxcbiAgICBpZCxcbiAgICBJTlZfU1lNQk9MX1JFRltjdXJyZW50XSxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJlZmVyZW5jZU5vZGU8VD4oXG4gIGlkOiBudW1iZXIsXG4gIHJlZjogVCxcbik6IFNlcm92YWxSZWZlcmVuY2VOb2RlIHtcbiAgcmV0dXJuIGNyZWF0ZVNlcm92YWxOb2RlKFxuICAgIFNlcm92YWxOb2RlVHlwZS5SZWZlcmVuY2UsXG4gICAgaWQsXG4gICAgc2VyaWFsaXplU3RyaW5nKGdldFJlZmVyZW5jZUlEKHJlZikpLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUGx1Z2luTm9kZShcbiAgaWQ6IG51bWJlcixcbiAgdGFnOiBzdHJpbmcsXG4gIHZhbHVlOiBSZWNvcmQ8c3RyaW5nLCBTZXJvdmFsTm9kZT4sXG4pOiBTZXJvdmFsUGx1Z2luTm9kZSB7XG4gIHJldHVybiBjcmVhdGVTZXJvdmFsTm9kZShcbiAgICBTZXJvdmFsTm9kZVR5cGUuUGx1Z2luLFxuICAgIGlkLFxuICAgIHZhbHVlLFxuICAgIHNlcmlhbGl6ZVN0cmluZyh0YWcpLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBcnJheU5vZGUoXG4gIGlkOiBudW1iZXIsXG4gIGN1cnJlbnQ6IHVua25vd25bXSxcbiAgcGFyc2VkSXRlbXM6IFNlcm92YWxBcnJheU5vZGVbJ2EnXSxcbik6IFNlcm92YWxBcnJheU5vZGUge1xuICByZXR1cm4gY3JlYXRlU2Vyb3ZhbE5vZGUoXG4gICAgU2Vyb3ZhbE5vZGVUeXBlLkFycmF5LFxuICAgIGlkLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgcGFyc2VkSXRlbXMsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBnZXRPYmplY3RGbGFnKGN1cnJlbnQpLFxuICAgIE5JTCxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUJveGVkTm9kZShcbiAgaWQ6IG51bWJlcixcbiAgYm94ZWQ6IFNlcm92YWxOb2RlLFxuKTogU2Vyb3ZhbEJveGVkTm9kZSB7XG4gIHJldHVybiBjcmVhdGVTZXJvdmFsTm9kZShcbiAgICBTZXJvdmFsTm9kZVR5cGUuQm94ZWQsXG4gICAgaWQsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgYm94ZWQsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUeXBlZEFycmF5Tm9kZShcbiAgaWQ6IG51bWJlcixcbiAgY3VycmVudDogVHlwZWRBcnJheVZhbHVlLFxuICBidWZmZXI6IFNlcm92YWxOb2RlLFxuKTogU2Vyb3ZhbFR5cGVkQXJyYXlOb2RlIHtcbiAgcmV0dXJuIGNyZWF0ZVNlcm92YWxOb2RlKFxuICAgIFNlcm92YWxOb2RlVHlwZS5UeXBlZEFycmF5LFxuICAgIGlkLFxuICAgIE5JTCxcbiAgICBjdXJyZW50LmNvbnN0cnVjdG9yLm5hbWUsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIGJ1ZmZlcixcbiAgICBjdXJyZW50LmJ5dGVPZmZzZXQsXG4gICAgTklMLFxuICAgIGN1cnJlbnQubGVuZ3RoLFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQmlnSW50VHlwZWRBcnJheU5vZGUoXG4gIGlkOiBudW1iZXIsXG4gIGN1cnJlbnQ6IEJpZ0ludFR5cGVkQXJyYXlWYWx1ZSxcbiAgYnVmZmVyOiBTZXJvdmFsTm9kZSxcbik6IFNlcm92YWxCaWdJbnRUeXBlZEFycmF5Tm9kZSB7XG4gIHJldHVybiBjcmVhdGVTZXJvdmFsTm9kZShcbiAgICBTZXJvdmFsTm9kZVR5cGUuQmlnSW50VHlwZWRBcnJheSxcbiAgICBpZCxcbiAgICBOSUwsXG4gICAgY3VycmVudC5jb25zdHJ1Y3Rvci5uYW1lLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBidWZmZXIsXG4gICAgY3VycmVudC5ieXRlT2Zmc2V0LFxuICAgIE5JTCxcbiAgICBjdXJyZW50LmJ5dGVMZW5ndGgsXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVEYXRhVmlld05vZGUoXG4gIGlkOiBudW1iZXIsXG4gIGN1cnJlbnQ6IERhdGFWaWV3LFxuICBidWZmZXI6IFNlcm92YWxOb2RlLFxuKTogU2Vyb3ZhbERhdGFWaWV3Tm9kZSB7XG4gIHJldHVybiBjcmVhdGVTZXJvdmFsTm9kZShcbiAgICBTZXJvdmFsTm9kZVR5cGUuRGF0YVZpZXcsXG4gICAgaWQsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgYnVmZmVyLFxuICAgIGN1cnJlbnQuYnl0ZU9mZnNldCxcbiAgICBOSUwsXG4gICAgY3VycmVudC5ieXRlTGVuZ3RoLFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRXJyb3JOb2RlKFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiBFcnJvcixcbiAgb3B0aW9uczogU2Vyb3ZhbE9iamVjdFJlY29yZE5vZGUgfCB1bmRlZmluZWQsXG4pOiBTZXJvdmFsRXJyb3JOb2RlIHtcbiAgcmV0dXJuIGNyZWF0ZVNlcm92YWxOb2RlKFxuICAgIFNlcm92YWxOb2RlVHlwZS5FcnJvcixcbiAgICBpZCxcbiAgICBnZXRFcnJvckNvbnN0cnVjdG9yKGN1cnJlbnQpLFxuICAgIE5JTCxcbiAgICBzZXJpYWxpemVTdHJpbmcoY3VycmVudC5tZXNzYWdlKSxcbiAgICBvcHRpb25zLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQWdncmVnYXRlRXJyb3JOb2RlKFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiBBZ2dyZWdhdGVFcnJvcixcbiAgb3B0aW9uczogU2Vyb3ZhbE9iamVjdFJlY29yZE5vZGUgfCB1bmRlZmluZWQsXG4pOiBTZXJvdmFsQWdncmVnYXRlRXJyb3JOb2RlIHtcbiAgcmV0dXJuIGNyZWF0ZVNlcm92YWxOb2RlKFxuICAgIFNlcm92YWxOb2RlVHlwZS5BZ2dyZWdhdGVFcnJvcixcbiAgICBpZCxcbiAgICBnZXRFcnJvckNvbnN0cnVjdG9yKGN1cnJlbnQpLFxuICAgIE5JTCxcbiAgICBzZXJpYWxpemVTdHJpbmcoY3VycmVudC5tZXNzYWdlKSxcbiAgICBvcHRpb25zLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2V0Tm9kZShcbiAgaWQ6IG51bWJlcixcbiAgaXRlbXM6IFNlcm92YWxOb2RlW10sXG4pOiBTZXJvdmFsU2V0Tm9kZSB7XG4gIHJldHVybiBjcmVhdGVTZXJvdmFsTm9kZShcbiAgICBTZXJvdmFsTm9kZVR5cGUuU2V0LFxuICAgIGlkLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgaXRlbXMsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSXRlcmF0b3JGYWN0b3J5SW5zdGFuY2VOb2RlKFxuICBmYWN0b3J5OiBTZXJvdmFsTm9kZVdpdGhJRCxcbiAgaXRlbXM6IFNlcm92YWxOb2RlV2l0aElELFxuKTogU2Vyb3ZhbEl0ZXJhdG9yRmFjdG9yeUluc3RhbmNlTm9kZSB7XG4gIHJldHVybiBjcmVhdGVTZXJvdmFsTm9kZShcbiAgICBTZXJvdmFsTm9kZVR5cGUuSXRlcmF0b3JGYWN0b3J5SW5zdGFuY2UsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgW2ZhY3RvcnksIGl0ZW1zXSxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBc3luY0l0ZXJhdG9yRmFjdG9yeUluc3RhbmNlTm9kZShcbiAgZmFjdG9yeTogU2Vyb3ZhbE5vZGVXaXRoSUQsXG4gIGl0ZW1zOiBTZXJvdmFsTm9kZVdpdGhJRCxcbik6IFNlcm92YWxBc3luY0l0ZXJhdG9yRmFjdG9yeUluc3RhbmNlTm9kZSB7XG4gIHJldHVybiBjcmVhdGVTZXJvdmFsTm9kZShcbiAgICBTZXJvdmFsTm9kZVR5cGUuQXN5bmNJdGVyYXRvckZhY3RvcnlJbnN0YW5jZSxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBbZmFjdG9yeSwgaXRlbXNdLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVN0cmVhbUNvbnN0cnVjdG9yTm9kZShcbiAgaWQ6IG51bWJlcixcbiAgZmFjdG9yeTogU2Vyb3ZhbE5vZGVXaXRoSUQsXG4gIHNlcXVlbmNlOiBTZXJvdmFsTm9kZVtdLFxuKTogU2Vyb3ZhbFN0cmVhbUNvbnN0cnVjdG9yTm9kZSB7XG4gIHJldHVybiBjcmVhdGVTZXJvdmFsTm9kZShcbiAgICBTZXJvdmFsTm9kZVR5cGUuU3RyZWFtQ29uc3RydWN0b3IsXG4gICAgaWQsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBzZXF1ZW5jZSxcbiAgICBmYWN0b3J5LFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3RyZWFtTmV4dE5vZGUoXG4gIGlkOiBudW1iZXIsXG4gIHBhcnNlZDogU2Vyb3ZhbE5vZGUsXG4pOiBTZXJvdmFsU3RyZWFtTmV4dE5vZGUge1xuICByZXR1cm4gY3JlYXRlU2Vyb3ZhbE5vZGUoXG4gICAgU2Vyb3ZhbE5vZGVUeXBlLlN0cmVhbU5leHQsXG4gICAgaWQsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgcGFyc2VkLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3RyZWFtVGhyb3dOb2RlKFxuICBpZDogbnVtYmVyLFxuICBwYXJzZWQ6IFNlcm92YWxOb2RlLFxuKTogU2Vyb3ZhbFN0cmVhbVRocm93Tm9kZSB7XG4gIHJldHVybiBjcmVhdGVTZXJvdmFsTm9kZShcbiAgICBTZXJvdmFsTm9kZVR5cGUuU3RyZWFtVGhyb3csXG4gICAgaWQsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgcGFyc2VkLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3RyZWFtUmV0dXJuTm9kZShcbiAgaWQ6IG51bWJlcixcbiAgcGFyc2VkOiBTZXJvdmFsTm9kZSxcbik6IFNlcm92YWxTdHJlYW1SZXR1cm5Ob2RlIHtcbiAgcmV0dXJuIGNyZWF0ZVNlcm92YWxOb2RlKFxuICAgIFNlcm92YWxOb2RlVHlwZS5TdHJlYW1SZXR1cm4sXG4gICAgaWQsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgcGFyc2VkLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2VxdWVuY2VOb2RlKFxuICBpZDogbnVtYmVyLFxuICBzZXF1ZW5jZTogU2Vyb3ZhbE5vZGVbXSxcbiAgdGhyb3dBdDogbnVtYmVyLFxuICBkb25lQXQ6IG51bWJlcixcbik6IFNlcm92YWxTZXF1ZW5jZU5vZGUge1xuICByZXR1cm4gY3JlYXRlU2Vyb3ZhbE5vZGUoXG4gICAgU2Vyb3ZhbE5vZGVUeXBlLlNlcXVlbmNlLFxuICAgIGlkLFxuICAgIHRocm93QXQsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIHNlcXVlbmNlLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIGRvbmVBdCxcbiAgKTtcbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwicHJpZGVwYWNrL2VudlwiIC8+XG5cbmltcG9ydCB7IHNlcmlhbGl6ZVN0cmluZyB9IGZyb20gJy4vc3RyaW5nJztcbmltcG9ydCB0eXBlIHsgU2Vyb3ZhbE5vZGUgfSBmcm9tICcuL3R5cGVzJztcblxuY29uc3QgeyB0b1N0cmluZzogb2JqZWN0VG9TdHJpbmcgfSA9IC8qIEBfX1BVUkVfXyAqLyBPYmplY3QucHJvdG90eXBlO1xuXG5jb25zdCBlbnVtIFN0ZXBFcnJvckNvZGVzIHtcbiAgUGFyc2UgPSAxLFxuICBTZXJpYWxpemUgPSAyLFxuICBEZXNlcmlhbGl6ZSA9IDMsXG59XG5cbmZ1bmN0aW9uIGdldEVycm9yTWVzc2FnZURldih0eXBlOiBzdHJpbmcsIGNhdXNlOiB1bmtub3duKTogc3RyaW5nIHtcbiAgaWYgKGNhdXNlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICByZXR1cm4gYFNlcm92YWwgY2F1Z2h0IGFuIGVycm9yIGR1cmluZyB0aGUgJHt0eXBlfSBwcm9jZXNzLlxuXG4ke2NhdXNlLm5hbWV9XG4ke2NhdXNlLm1lc3NhZ2V9XG5cbi0gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHBsZWFzZSBjaGVjayB0aGUgXCJjYXVzZVwiIHByb3BlcnR5IG9mIHRoaXMgZXJyb3IuXG4tIElmIHlvdSBiZWxpZXZlIHRoaXMgaXMgYW4gZXJyb3IgaW4gU2Vyb3ZhbCwgcGxlYXNlIHN1Ym1pdCBhbiBpc3N1ZSBhdCBodHRwczovL2dpdGh1Yi5jb20vbHhzbW5zeWMvc2Vyb3ZhbC9pc3N1ZXMvbmV3YDtcbiAgfVxuICByZXR1cm4gYFNlcm92YWwgY2F1Z2h0IGFuIGVycm9yIGR1cmluZyB0aGUgJHt0eXBlfSBwcm9jZXNzLlxuXG5cIiR7b2JqZWN0VG9TdHJpbmcuY2FsbChjYXVzZSl9XCJcblxuRm9yIG1vcmUgaW5mb3JtYXRpb24sIHBsZWFzZSBjaGVjayB0aGUgXCJjYXVzZVwiIHByb3BlcnR5IG9mIHRoaXMgZXJyb3IuYDtcbn1cblxuY29uc3QgU1RFUF9FUlJPUl9DT0RFUzogUmVjb3JkPHN0cmluZywgU3RlcEVycm9yQ29kZXM+ID0ge1xuICBwYXJzaW5nOiBTdGVwRXJyb3JDb2Rlcy5QYXJzZSxcbiAgc2VyaWFsaXphdGlvbjogU3RlcEVycm9yQ29kZXMuU2VyaWFsaXplLFxuICBkZXNlcmlhbGl6YXRpb246IFN0ZXBFcnJvckNvZGVzLkRlc2VyaWFsaXplLFxufTtcblxuZnVuY3Rpb24gZ2V0RXJyb3JNZXNzYWdlUHJvZCh0eXBlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gYFNlcm92YWwgRXJyb3IgKHN0ZXA6ICR7U1RFUF9FUlJPUl9DT0RFU1t0eXBlXX0pYDtcbn1cblxuY29uc3QgZ2V0RXJyb3JNZXNzYWdlID0gKHR5cGU6IHN0cmluZywgY2F1c2U6IGFueSkgPT5cbiAgaW1wb3J0Lm1ldGEuZW52LlBST0RcbiAgICA/IGdldEVycm9yTWVzc2FnZVByb2QodHlwZSlcbiAgICA6IGdldEVycm9yTWVzc2FnZURldih0eXBlLCBjYXVzZSk7XG5cbmV4cG9ydCBjbGFzcyBTZXJvdmFsRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHR5cGU6IHN0cmluZyxcbiAgICBwdWJsaWMgY2F1c2U6IHVua25vd24sXG4gICkge1xuICAgIHN1cGVyKGdldEVycm9yTWVzc2FnZSh0eXBlLCBjYXVzZSkpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXJvdmFsUGFyc2VyRXJyb3IgZXh0ZW5kcyBTZXJvdmFsRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihjYXVzZTogdW5rbm93bikge1xuICAgIHN1cGVyKCdwYXJzaW5nJywgY2F1c2UpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXJvdmFsU2VyaWFsaXphdGlvbkVycm9yIGV4dGVuZHMgU2Vyb3ZhbEVycm9yIHtcbiAgY29uc3RydWN0b3IoY2F1c2U6IHVua25vd24pIHtcbiAgICBzdXBlcignc2VyaWFsaXphdGlvbicsIGNhdXNlKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2Vyb3ZhbERlc2VyaWFsaXphdGlvbkVycm9yIGV4dGVuZHMgU2Vyb3ZhbEVycm9yIHtcbiAgY29uc3RydWN0b3IoY2F1c2U6IHVua25vd24pIHtcbiAgICBzdXBlcignZGVzZXJpYWxpemF0aW9uJywgY2F1c2UpO1xuICB9XG59XG5cbmNvbnN0IGVudW0gU3BlY2lmaWNFcnJvckNvZGVzIHtcbiAgVW5zdXBwb3J0ZWRUeXBlID0gMSxcbiAgVW5zdXBwb3J0ZWROb2RlID0gMixcbiAgTWlzc2luZ1BsdWdpbiA9IDMsXG4gIE1pc3NpbmdJbnN0YW5jZSA9IDQsXG4gIE1pc3NpbmdSZWZlcmVuY2UgPSA1LFxuICBNaXNzaW5nUmVmZXJlbmNlRm9ySWQgPSA2LFxuICBVbmtub3duVHlwZWRBcnJheSA9IDcsXG4gIE1hbGZvcm1lZE5vZGUgPSA4LFxuICBDb25mbGljdGVkTm9kZUlkID0gOSxcbiAgRGVwdGhMaW1pdCA9IDEwLFxufVxuXG5mdW5jdGlvbiBnZXRTcGVjaWZpY0Vycm9yTWVzc2FnZShjb2RlOiBTcGVjaWZpY0Vycm9yQ29kZXMpOiBzdHJpbmcge1xuICByZXR1cm4gYFNlcm92YWwgRXJyb3IgKHNwZWNpZmljOiAke2NvZGV9KWA7XG59XG5cbmV4cG9ydCBjbGFzcyBTZXJvdmFsVW5zdXBwb3J0ZWRUeXBlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogdW5rbm93bikge1xuICAgIHN1cGVyKFxuICAgICAgaW1wb3J0Lm1ldGEuZW52LlBST0RcbiAgICAgICAgPyBnZXRTcGVjaWZpY0Vycm9yTWVzc2FnZShTcGVjaWZpY0Vycm9yQ29kZXMuVW5zdXBwb3J0ZWRUeXBlKVxuICAgICAgICA6IGBUaGUgdmFsdWUgJHtvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKX0gb2YgdHlwZSBcIiR7dHlwZW9mIHZhbHVlfVwiIGNhbm5vdCBiZSBwYXJzZWQvc2VyaWFsaXplZC5cbiAgICAgIFxuVGhlcmUgYXJlIGZldyB3b3JrYXJvdW5kcyBmb3IgdGhpcyBwcm9ibGVtOlxuLSBUcmFuc2Zvcm0gdGhlIHZhbHVlIGluIGEgd2F5IHRoYXQgaXQgY2FuIGJlIHNlcmlhbGl6ZWQuXG4tIElmIHRoZSByZWZlcmVuY2UgaXMgcHJlc2VudCBvbiBtdWx0aXBsZSBydW50aW1lcyAoaXNvbW9ycGhpYyksIHlvdSBjYW4gdXNlIHRoZSBSZWZlcmVuY2UgQVBJIHRvIG1hcCB0aGUgcmVmZXJlbmNlcy5gLFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNlcm92YWxVbnN1cHBvcnRlZE5vZGVFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3Iobm9kZTogU2Vyb3ZhbE5vZGUpIHtcbiAgICBzdXBlcihcbiAgICAgIGltcG9ydC5tZXRhLmVudi5QUk9EXG4gICAgICAgID8gZ2V0U3BlY2lmaWNFcnJvck1lc3NhZ2UoU3BlY2lmaWNFcnJvckNvZGVzLlVuc3VwcG9ydGVkTm9kZSlcbiAgICAgICAgOiAnVW5zdXBwb3J0ZWQgbm9kZSB0eXBlIFwiJyArIG5vZGUudCArICdcIi4nLFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNlcm92YWxNaXNzaW5nUGx1Z2luRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKHRhZzogc3RyaW5nKSB7XG4gICAgc3VwZXIoXG4gICAgICBpbXBvcnQubWV0YS5lbnYuUFJPRFxuICAgICAgICA/IGdldFNwZWNpZmljRXJyb3JNZXNzYWdlKFNwZWNpZmljRXJyb3JDb2Rlcy5NaXNzaW5nUGx1Z2luKVxuICAgICAgICA6ICdNaXNzaW5nIHBsdWdpbiBmb3IgdGFnIFwiJyArIHRhZyArICdcIi4nLFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNlcm92YWxNaXNzaW5nSW5zdGFuY2VFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IodGFnOiBzdHJpbmcpIHtcbiAgICBzdXBlcihcbiAgICAgIGltcG9ydC5tZXRhLmVudi5QUk9EXG4gICAgICAgID8gZ2V0U3BlY2lmaWNFcnJvck1lc3NhZ2UoU3BlY2lmaWNFcnJvckNvZGVzLk1pc3NpbmdJbnN0YW5jZSlcbiAgICAgICAgOiAnTWlzc2luZyBcIicgKyB0YWcgKyAnXCIgaW5zdGFuY2UuJyxcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXJvdmFsTWlzc2luZ1JlZmVyZW5jZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsdWU6IHVua25vd24pIHtcbiAgICBzdXBlcihcbiAgICAgIGltcG9ydC5tZXRhLmVudi5QUk9EXG4gICAgICAgID8gZ2V0U3BlY2lmaWNFcnJvck1lc3NhZ2UoU3BlY2lmaWNFcnJvckNvZGVzLk1pc3NpbmdSZWZlcmVuY2UpXG4gICAgICAgIDogJ01pc3NpbmcgcmVmZXJlbmNlIGZvciB0aGUgdmFsdWUgXCInICtcbiAgICAgICAgICAgIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpICtcbiAgICAgICAgICAgICdcIiBvZiB0eXBlIFwiJyArXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgK1xuICAgICAgICAgICAgJ1wiJyxcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXJvdmFsTWlzc2luZ1JlZmVyZW5jZUZvcklkRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihcbiAgICAgIGltcG9ydC5tZXRhLmVudi5QUk9EXG4gICAgICAgID8gZ2V0U3BlY2lmaWNFcnJvck1lc3NhZ2UoU3BlY2lmaWNFcnJvckNvZGVzLk1pc3NpbmdSZWZlcmVuY2VGb3JJZClcbiAgICAgICAgOiAnTWlzc2luZyByZWZlcmVuY2UgZm9yIGlkIFwiJyArIHNlcmlhbGl6ZVN0cmluZyhpZCkgKyAnXCInLFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNlcm92YWxVbmtub3duVHlwZWRBcnJheUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcpIHtcbiAgICBzdXBlcihcbiAgICAgIGltcG9ydC5tZXRhLmVudi5QUk9EXG4gICAgICAgID8gZ2V0U3BlY2lmaWNFcnJvck1lc3NhZ2UoU3BlY2lmaWNFcnJvckNvZGVzLlVua25vd25UeXBlZEFycmF5KVxuICAgICAgICA6ICdVbmtub3duIFR5cGVkQXJyYXkgXCInICsgbmFtZSArICdcIicsXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2Vyb3ZhbE1hbGZvcm1lZE5vZGVFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3Iobm9kZTogU2Vyb3ZhbE5vZGUpIHtcbiAgICBzdXBlcihcbiAgICAgIGltcG9ydC5tZXRhLmVudi5QUk9EXG4gICAgICAgID8gZ2V0U3BlY2lmaWNFcnJvck1lc3NhZ2UoU3BlY2lmaWNFcnJvckNvZGVzLk1hbGZvcm1lZE5vZGUpXG4gICAgICAgIDogJ01hbGZvcm1lZCBub2RlIHR5cGUgXCInICsgbm9kZS50ICsgJ1wiLicsXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2Vyb3ZhbENvbmZsaWN0ZWROb2RlSWRFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3Iobm9kZTogU2Vyb3ZhbE5vZGUpIHtcbiAgICBzdXBlcihcbiAgICAgIGltcG9ydC5tZXRhLmVudi5QUk9EXG4gICAgICAgID8gZ2V0U3BlY2lmaWNFcnJvck1lc3NhZ2UoU3BlY2lmaWNFcnJvckNvZGVzLkNvbmZsaWN0ZWROb2RlSWQpXG4gICAgICAgIDogJ0NvbmZsaWN0ZWQgbm9kZSBpZCBcIicgKyBub2RlLmkgKyAnXCIuJyxcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXJvdmFsRGVwdGhMaW1pdEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihsaW1pdDogbnVtYmVyKSB7XG4gICAgc3VwZXIoXG4gICAgICBpbXBvcnQubWV0YS5lbnYuUFJPRFxuICAgICAgICA/IGdldFNwZWNpZmljRXJyb3JNZXNzYWdlKFNwZWNpZmljRXJyb3JDb2Rlcy5Db25mbGljdGVkTm9kZUlkKVxuICAgICAgICA6ICdEZXB0aCBsaW1pdCBvZiAnICsgbGltaXQgKyAnIHJlYWNoZWQnLFxuICAgICk7XG4gIH1cbn1cbiIsIi8qKlxuICogQW4gb3BhcXVlIHJlZmVyZW5jZSBhbGxvd3MgaGlkaW5nIHZhbHVlcyBmcm9tIHRoZSBzZXJpYWxpemVyLlxuICovXG5leHBvcnQgY2xhc3MgT3BhcXVlUmVmZXJlbmNlPFYsIFIgPSB1bmRlZmluZWQ+IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHJlYWRvbmx5IHZhbHVlOiBWLFxuICAgIHB1YmxpYyByZWFkb25seSByZXBsYWNlbWVudD86IFIsXG4gICkge31cbn1cbiIsImltcG9ydCB0eXBlIHsgU2VxdWVuY2UgfSBmcm9tICcuL3NlcXVlbmNlJztcbmltcG9ydCB0eXBlIHsgU3RyZWFtIH0gZnJvbSAnLi9zdHJlYW0nO1xuXG50eXBlIFNwZWNpYWxQcm9taXNlID0gUHJvbWlzZTx1bmtub3duPiAmIHsgcz86IDEgfCAyOyB2PzogdW5rbm93biB9O1xuXG5leHBvcnQgaW50ZXJmYWNlIFByb21pc2VDb25zdHJ1Y3RvclJlc29sdmVyIHtcbiAgcDogU3BlY2lhbFByb21pc2U7XG4gIHM6ICh2YWx1ZTogdW5rbm93bikgPT4gdm9pZDtcbiAgZjogKHZhbHVlOiB1bmtub3duKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgY29uc3QgUFJPTUlTRV9DT05TVFJVQ1RPUiA9ICgpOiBQcm9taXNlQ29uc3RydWN0b3JSZXNvbHZlciA9PiB7XG4gIGNvbnN0IHJlc29sdmVyID0ge1xuICAgIHA6IDAsXG4gICAgczogMCxcbiAgICBmOiAwLFxuICB9IGFzIHVua25vd24gYXMgUHJvbWlzZUNvbnN0cnVjdG9yUmVzb2x2ZXI7XG4gIHJlc29sdmVyLnAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgcmVzb2x2ZXIucyA9IHJlc29sdmU7XG4gICAgcmVzb2x2ZXIuZiA9IHJlamVjdDtcbiAgfSk7XG4gIHJldHVybiByZXNvbHZlcjtcbn07XG5cbmV4cG9ydCBjb25zdCBQUk9NSVNFX1NVQ0NFU1MgPSAoXG4gIHJlc29sdmVyOiBQcm9taXNlQ29uc3RydWN0b3JSZXNvbHZlcixcbiAgZGF0YTogdW5rbm93bixcbik6IHZvaWQgPT4ge1xuICByZXNvbHZlci5zKGRhdGEpO1xuICByZXNvbHZlci5wLnMgPSAxO1xuICByZXNvbHZlci5wLnYgPSBkYXRhO1xufTtcblxuZXhwb3J0IGNvbnN0IFBST01JU0VfRkFJTFVSRSA9IChcbiAgcmVzb2x2ZXI6IFByb21pc2VDb25zdHJ1Y3RvclJlc29sdmVyLFxuICBkYXRhOiB1bmtub3duLFxuKTogdm9pZCA9PiB7XG4gIHJlc29sdmVyLmYoZGF0YSk7XG4gIHJlc29sdmVyLnAucyA9IDI7XG4gIHJlc29sdmVyLnAudiA9IGRhdGE7XG59O1xuXG5leHBvcnQgY29uc3QgU0VSSUFMSVpFRF9QUk9NSVNFX0NPTlNUUlVDVE9SID1cbiAgLyogQF9fUFVSRV9fICovIFBST01JU0VfQ09OU1RSVUNUT1IudG9TdHJpbmcoKTtcbmV4cG9ydCBjb25zdCBTRVJJQUxJWkVEX1BST01JU0VfU1VDQ0VTUyA9XG4gIC8qIEBfX1BVUkVfXyAqLyBQUk9NSVNFX1NVQ0NFU1MudG9TdHJpbmcoKTtcbmV4cG9ydCBjb25zdCBTRVJJQUxJWkVEX1BST01JU0VfRkFJTFVSRSA9XG4gIC8qIEBfX1BVUkVfXyAqLyBQUk9NSVNFX0ZBSUxVUkUudG9TdHJpbmcoKTtcblxuaW50ZXJmYWNlIFN0cmVhbUxpc3RlbmVyPFQ+IHtcbiAgbmV4dCh2YWx1ZTogVCk6IHZvaWQ7XG4gIHRocm93KHZhbHVlOiB1bmtub3duKTogdm9pZDtcbiAgcmV0dXJuKHZhbHVlOiBUKTogdm9pZDtcbn1cblxuZXhwb3J0IGNvbnN0IFNUUkVBTV9DT05TVFJVQ1RPUiA9ICgpID0+IHtcbiAgY29uc3QgYnVmZmVyOiB1bmtub3duW10gPSBbXTtcbiAgY29uc3QgbGlzdGVuZXJzOiBTdHJlYW1MaXN0ZW5lcjx1bmtub3duPltdID0gW107XG4gIGxldCBhbGl2ZSA9IHRydWU7XG4gIGxldCBzdWNjZXNzID0gZmFsc2U7XG4gIGxldCBjb3VudCA9IDA7XG4gIGNvbnN0IGZsdXNoID0gKFxuICAgIHZhbHVlOiB1bmtub3duLFxuICAgIG1vZGU6IGtleW9mIFN0cmVhbUxpc3RlbmVyPHVua25vd24+LFxuICAgIHg/OiBudW1iZXIsXG4gICkgPT4ge1xuICAgIGZvciAoeCA9IDA7IHggPCBjb3VudDsgeCsrKSB7XG4gICAgICBpZiAobGlzdGVuZXJzW3hdKSB7XG4gICAgICAgIGxpc3RlbmVyc1t4XVttb2RlXSh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjb25zdCB1cCA9IChcbiAgICBsaXN0ZW5lcjogU3RyZWFtTGlzdGVuZXI8dW5rbm93bj4sXG4gICAgeD86IG51bWJlcixcbiAgICB6PzogbnVtYmVyLFxuICAgIGN1cnJlbnQ/OiB1bmtub3duLFxuICApID0+IHtcbiAgICBmb3IgKHggPSAwLCB6ID0gYnVmZmVyLmxlbmd0aDsgeCA8IHo7IHgrKykge1xuICAgICAgY3VycmVudCA9IGJ1ZmZlclt4XTtcbiAgICAgIGlmICghYWxpdmUgJiYgeCA9PT0geiAtIDEpIHtcbiAgICAgICAgbGlzdGVuZXJbc3VjY2VzcyA/ICdyZXR1cm4nIDogJ3Rocm93J10oY3VycmVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaXN0ZW5lci5uZXh0KGN1cnJlbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgY29uc3Qgb24gPSAobGlzdGVuZXI6IFN0cmVhbUxpc3RlbmVyPHVua25vd24+LCB0ZW1wPzogbnVtYmVyKSA9PiB7XG4gICAgaWYgKGFsaXZlKSB7XG4gICAgICB0ZW1wID0gY291bnQrKztcbiAgICAgIGxpc3RlbmVyc1t0ZW1wXSA9IGxpc3RlbmVyO1xuICAgIH1cbiAgICB1cChsaXN0ZW5lcik7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChhbGl2ZSkge1xuICAgICAgICBsaXN0ZW5lcnNbdGVtcCFdID0gbGlzdGVuZXJzW2NvdW50XTtcbiAgICAgICAgbGlzdGVuZXJzW2NvdW50LS1dID0gdW5kZWZpbmVkIGFzIGFueTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuICByZXR1cm4ge1xuICAgIF9fU0VST1ZBTF9TVFJFQU1fXzogdHJ1ZSxcbiAgICBvbjogKGxpc3RlbmVyOiBTdHJlYW1MaXN0ZW5lcjx1bmtub3duPikgPT4gb24obGlzdGVuZXIpLFxuICAgIG5leHQ6ICh2YWx1ZTogdW5rbm93bikgPT4ge1xuICAgICAgaWYgKGFsaXZlKSB7XG4gICAgICAgIGJ1ZmZlci5wdXNoKHZhbHVlKTtcbiAgICAgICAgZmx1c2godmFsdWUsICduZXh0Jyk7XG4gICAgICB9XG4gICAgfSxcbiAgICB0aHJvdzogKHZhbHVlOiB1bmtub3duKSA9PiB7XG4gICAgICBpZiAoYWxpdmUpIHtcbiAgICAgICAgYnVmZmVyLnB1c2godmFsdWUpO1xuICAgICAgICBmbHVzaCh2YWx1ZSwgJ3Rocm93Jyk7XG4gICAgICAgIGFsaXZlID0gZmFsc2U7XG4gICAgICAgIHN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgbGlzdGVuZXJzLmxlbmd0aCA9IDA7XG4gICAgICB9XG4gICAgfSxcbiAgICByZXR1cm46ICh2YWx1ZTogdW5rbm93bikgPT4ge1xuICAgICAgaWYgKGFsaXZlKSB7XG4gICAgICAgIGJ1ZmZlci5wdXNoKHZhbHVlKTtcbiAgICAgICAgZmx1c2godmFsdWUsICdyZXR1cm4nKTtcbiAgICAgICAgYWxpdmUgPSBmYWxzZTtcbiAgICAgICAgc3VjY2VzcyA9IHRydWU7XG4gICAgICAgIGxpc3RlbmVycy5sZW5ndGggPSAwO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgU0VSSUFMSVpFRF9TVFJFQU1fQ09OU1RSVUNUT1IgPVxuICAvKiBAX19QVVJFX18gKi8gU1RSRUFNX0NPTlNUUlVDVE9SLnRvU3RyaW5nKCk7XG5cbmV4cG9ydCBjb25zdCBJVEVSQVRPUl9DT05TVFJVQ1RPUiA9XG4gIChzeW1ib2w6IHN5bWJvbCkgPT4gKHNlcXVlbmNlOiBTZXF1ZW5jZSkgPT4gKCkgPT4ge1xuICAgIGxldCBpbmRleCA9IDA7XG4gICAgY29uc3QgaW5zdGFuY2UgPSB7XG4gICAgICBbc3ltYm9sXTogKCkgPT4gaW5zdGFuY2UsXG4gICAgICBuZXh0OiAoKSA9PiB7XG4gICAgICAgIGlmIChpbmRleCA+IHNlcXVlbmNlLmQpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZG9uZTogdHJ1ZSxcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBpbmRleCsrO1xuICAgICAgICBjb25zdCBkYXRhID0gc2VxdWVuY2UudltjdXJyZW50SW5kZXhdO1xuICAgICAgICBpZiAoY3VycmVudEluZGV4ID09PSBzZXF1ZW5jZS50KSB7XG4gICAgICAgICAgdGhyb3cgZGF0YTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGRvbmU6IGN1cnJlbnRJbmRleCA9PT0gc2VxdWVuY2UuZCxcbiAgICAgICAgICB2YWx1ZTogZGF0YSxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgfTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH07XG5cbmV4cG9ydCBjb25zdCBTRVJJQUxJWkVEX0lURVJBVE9SX0NPTlNUUlVDVE9SID1cbiAgLyogQF9fUFVSRV9fICovIElURVJBVE9SX0NPTlNUUlVDVE9SLnRvU3RyaW5nKCk7XG5cbmV4cG9ydCBjb25zdCBBU1lOQ19JVEVSQVRPUl9DT05TVFJVQ1RPUiA9XG4gIChzeW1ib2w6IHN5bWJvbCwgY3JlYXRlUHJvbWlzZTogdHlwZW9mIFBST01JU0VfQ09OU1RSVUNUT1IpID0+XG4gIChzdHJlYW06IFN0cmVhbTx1bmtub3duPikgPT5cbiAgKCkgPT4ge1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgbGV0IGRvbmVBdCA9IC0xO1xuICAgIGxldCBpc1Rocm93ID0gZmFsc2U7XG4gICAgY29uc3QgYnVmZmVyOiB1bmtub3duW10gPSBbXTtcbiAgICBjb25zdCBwZW5kaW5nOiBQcm9taXNlQ29uc3RydWN0b3JSZXNvbHZlcltdID0gW107XG4gICAgY29uc3QgZmluYWxpemUgPSAoaSA9IDAsIGxlbiA9IHBlbmRpbmcubGVuZ3RoKSA9PiB7XG4gICAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHBlbmRpbmdbaV0ucyh7XG4gICAgICAgICAgZG9uZTogdHJ1ZSxcbiAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHN0cmVhbS5vbih7XG4gICAgICBuZXh0OiB2YWx1ZSA9PiB7XG4gICAgICAgIGNvbnN0IHRlbXAgPSBwZW5kaW5nLnNoaWZ0KCk7XG4gICAgICAgIGlmICh0ZW1wKSB7XG4gICAgICAgICAgdGVtcC5zKHsgZG9uZTogZmFsc2UsIHZhbHVlIH0pO1xuICAgICAgICB9XG4gICAgICAgIGJ1ZmZlci5wdXNoKHZhbHVlKTtcbiAgICAgIH0sXG4gICAgICB0aHJvdzogdmFsdWUgPT4ge1xuICAgICAgICBjb25zdCB0ZW1wID0gcGVuZGluZy5zaGlmdCgpO1xuICAgICAgICBpZiAodGVtcCkge1xuICAgICAgICAgIHRlbXAuZih2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxpemUoKTtcbiAgICAgICAgZG9uZUF0ID0gYnVmZmVyLmxlbmd0aDtcbiAgICAgICAgaXNUaHJvdyA9IHRydWU7XG4gICAgICAgIGJ1ZmZlci5wdXNoKHZhbHVlKTtcbiAgICAgIH0sXG4gICAgICByZXR1cm46IHZhbHVlID0+IHtcbiAgICAgICAgY29uc3QgdGVtcCA9IHBlbmRpbmcuc2hpZnQoKTtcbiAgICAgICAgaWYgKHRlbXApIHtcbiAgICAgICAgICB0ZW1wLnMoeyBkb25lOiB0cnVlLCB2YWx1ZSB9KTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGl6ZSgpO1xuICAgICAgICBkb25lQXQgPSBidWZmZXIubGVuZ3RoO1xuICAgICAgICBidWZmZXIucHVzaCh2YWx1ZSk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgaW5zdGFuY2UgPSB7XG4gICAgICBbc3ltYm9sXTogKCkgPT4gaW5zdGFuY2UsXG4gICAgICBuZXh0OiAoKSA9PiB7XG4gICAgICAgIGlmIChkb25lQXQgPT09IC0xKSB7XG4gICAgICAgICAgY29uc3QgaW5kZXggPSBjb3VudCsrO1xuICAgICAgICAgIGlmIChpbmRleCA+PSBidWZmZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gY3JlYXRlUHJvbWlzZSgpO1xuICAgICAgICAgICAgcGVuZGluZy5wdXNoKHRlbXApO1xuICAgICAgICAgICAgcmV0dXJuIHRlbXAucDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRvbmU6IGZhbHNlLFxuICAgICAgICAgICAgdmFsdWU6IGJ1ZmZlcltpbmRleF0sXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY291bnQgPiBkb25lQXQpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZG9uZTogdHJ1ZSxcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbmRleCA9IGNvdW50Kys7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gYnVmZmVyW2luZGV4XTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSBkb25lQXQpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1Rocm93KSB7XG4gICAgICAgICAgdGhyb3cgdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBkb25lOiB0cnVlLFxuICAgICAgICAgIHZhbHVlLFxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9O1xuXG5leHBvcnQgY29uc3QgU0VSSUFMSVpFRF9BU1lOQ19JVEVSQVRPUl9DT05TVFJVQ1RPUiA9XG4gIC8qIEBfX1BVUkVfXyAqLyBBU1lOQ19JVEVSQVRPUl9DT05TVFJVQ1RPUi50b1N0cmluZygpO1xuXG5leHBvcnQgY29uc3QgQVJSQVlfQlVGRkVSX0NPTlNUUlVDVE9SID0gKGI2NDogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IGRlY29kZWQgPSBhdG9iKGI2NCk7XG4gIGNvbnN0IGxlbmd0aCA9IGRlY29kZWQubGVuZ3RoO1xuICBjb25zdCBhcnIgPSBuZXcgVWludDhBcnJheShsZW5ndGgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgYXJyW2ldID0gZGVjb2RlZC5jaGFyQ29kZUF0KGkpO1xuICB9XG4gIHJldHVybiBhcnIuYnVmZmVyO1xufTtcblxuZXhwb3J0IGNvbnN0IFNFUklBTElaRURfQVJSQVlfQlVGRkVSX0NPTlNUUlVDVE9SID1cbiAgLyogQF9fUFVSRV9fICovIEFSUkFZX0JVRkZFUl9DT05TVFJVQ1RPUi50b1N0cmluZygpO1xuIiwiaW1wb3J0IHsgSVRFUkFUT1JfQ09OU1RSVUNUT1IgfSBmcm9tICcuL2NvbnN0cnVjdG9ycyc7XG5pbXBvcnQgeyBTWU1fSVRFUkFUT1IgfSBmcm9tICcuL3N5bWJvbHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlcXVlbmNlIHtcbiAgX19TRVJPVkFMX1NFUVVFTkNFX186IHRydWU7XG5cbiAgdjogdW5rbm93bltdO1xuICB0OiBudW1iZXI7XG4gIGQ6IG51bWJlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU2VxdWVuY2UodmFsdWU6IG9iamVjdCk6IHZhbHVlIGlzIFNlcXVlbmNlIHtcbiAgcmV0dXJuICdfX1NFUk9WQUxfU0VRVUVOQ0VfXycgaW4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTZXF1ZW5jZShcbiAgdmFsdWVzOiB1bmtub3duW10sXG4gIHRocm93QXQ6IG51bWJlcixcbiAgZG9uZUF0OiBudW1iZXIsXG4pOiBTZXF1ZW5jZSB7XG4gIHJldHVybiB7XG4gICAgX19TRVJPVkFMX1NFUVVFTkNFX186IHRydWUsXG5cbiAgICB2OiB2YWx1ZXMsXG4gICAgdDogdGhyb3dBdCxcbiAgICBkOiBkb25lQXQsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTZXF1ZW5jZUZyb21JdGVyYWJsZTxUPihzb3VyY2U6IEl0ZXJhYmxlPFQ+KTogU2VxdWVuY2Uge1xuICBjb25zdCB2YWx1ZXM6IHVua25vd25bXSA9IFtdO1xuICBsZXQgdGhyb3dzQXQgPSAtMTtcbiAgbGV0IGRvbmVBdCA9IC0xO1xuICBjb25zdCBpdGVyYXRvciA9IHNvdXJjZVtTWU1fSVRFUkFUT1JdKCk7XG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdmFsdWUgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICB2YWx1ZXMucHVzaCh2YWx1ZS52YWx1ZSk7XG4gICAgICBpZiAodmFsdWUuZG9uZSkge1xuICAgICAgICBkb25lQXQgPSB2YWx1ZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRocm93c0F0ID0gdmFsdWVzLmxlbmd0aDtcbiAgICAgIHZhbHVlcy5wdXNoKGVycm9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY3JlYXRlU2VxdWVuY2UodmFsdWVzLCB0aHJvd3NBdCwgZG9uZUF0KTtcbn1cblxuY29uc3QgY3JlYXRlSXRlcmF0b3IgPSBJVEVSQVRPUl9DT05TVFJVQ1RPUihTWU1fSVRFUkFUT1IpO1xuXG5leHBvcnQgZnVuY3Rpb24gc2VxdWVuY2VUb0l0ZXJhdG9yPFQ+KFxuICBzZXF1ZW5jZTogU2VxdWVuY2UsXG4pOiAoKSA9PiBJdGVyYWJsZUl0ZXJhdG9yPFQ+IHtcbiAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yKHNlcXVlbmNlKSBhcyB1bmtub3duIGFzICgpID0+IEl0ZXJhYmxlSXRlcmF0b3I8VD47XG59XG4iLCJpbXBvcnQge1xuICBTRVJJQUxJWkVEX0FSUkFZX0JVRkZFUl9DT05TVFJVQ1RPUixcbiAgU0VSSUFMSVpFRF9QUk9NSVNFX0NPTlNUUlVDVE9SLFxuICBTRVJJQUxJWkVEX1BST01JU0VfRkFJTFVSRSxcbiAgU0VSSUFMSVpFRF9QUk9NSVNFX1NVQ0NFU1MsXG4gIFNFUklBTElaRURfU1RSRUFNX0NPTlNUUlVDVE9SLFxufSBmcm9tICcuL2NvbnN0cnVjdG9ycyc7XG5cbmV4cG9ydCBjb25zdCBJVEVSQVRPUiA9IHt9O1xuXG5leHBvcnQgY29uc3QgQVNZTkNfSVRFUkFUT1IgPSB7fTtcblxuZXhwb3J0IGNvbnN0IGVudW0gU3BlY2lhbFJlZmVyZW5jZSB7XG4gIE1hcFNlbnRpbmVsID0gMCxcbiAgUHJvbWlzZUNvbnN0cnVjdG9yID0gMSxcbiAgUHJvbWlzZVN1Y2Nlc3MgPSAyLFxuICBQcm9taXNlRmFpbHVyZSA9IDMsXG4gIFN0cmVhbUNvbnN0cnVjdG9yID0gNCxcbiAgQXJyYXlCdWZmZXJDb25zdHJ1Y3RvciA9IDUsXG59XG5cbi8qKlxuICogUGxhY2Vob2xkZXIgcmVmZXJlbmNlc1xuICovXG5leHBvcnQgY29uc3QgU1BFQ0lBTF9SRUZTOiBSZWNvcmQ8U3BlY2lhbFJlZmVyZW5jZSwgdW5rbm93bj4gPSB7XG4gIFtTcGVjaWFsUmVmZXJlbmNlLk1hcFNlbnRpbmVsXToge30sXG4gIFtTcGVjaWFsUmVmZXJlbmNlLlByb21pc2VDb25zdHJ1Y3Rvcl06IHt9LFxuICBbU3BlY2lhbFJlZmVyZW5jZS5Qcm9taXNlU3VjY2Vzc106IHt9LFxuICBbU3BlY2lhbFJlZmVyZW5jZS5Qcm9taXNlRmFpbHVyZV06IHt9LFxuICBbU3BlY2lhbFJlZmVyZW5jZS5TdHJlYW1Db25zdHJ1Y3Rvcl06IHt9LFxuICBbU3BlY2lhbFJlZmVyZW5jZS5BcnJheUJ1ZmZlckNvbnN0cnVjdG9yXToge30sXG59O1xuXG5leHBvcnQgY29uc3QgU1BFQ0lBTF9SRUZfU1RSSU5HOiBSZWNvcmQ8U3BlY2lhbFJlZmVyZW5jZSwgc3RyaW5nPiA9IHtcbiAgW1NwZWNpYWxSZWZlcmVuY2UuTWFwU2VudGluZWxdOiAnW10nLFxuICBbU3BlY2lhbFJlZmVyZW5jZS5Qcm9taXNlQ29uc3RydWN0b3JdOiBTRVJJQUxJWkVEX1BST01JU0VfQ09OU1RSVUNUT1IsXG4gIFtTcGVjaWFsUmVmZXJlbmNlLlByb21pc2VTdWNjZXNzXTogU0VSSUFMSVpFRF9QUk9NSVNFX1NVQ0NFU1MsXG4gIFtTcGVjaWFsUmVmZXJlbmNlLlByb21pc2VGYWlsdXJlXTogU0VSSUFMSVpFRF9QUk9NSVNFX0ZBSUxVUkUsXG4gIFtTcGVjaWFsUmVmZXJlbmNlLlN0cmVhbUNvbnN0cnVjdG9yXTogU0VSSUFMSVpFRF9TVFJFQU1fQ09OU1RSVUNUT1IsXG4gIFtTcGVjaWFsUmVmZXJlbmNlLkFycmF5QnVmZmVyQ29uc3RydWN0b3JdOlxuICAgIFNFUklBTElaRURfQVJSQVlfQlVGRkVSX0NPTlNUUlVDVE9SLFxufTtcbiIsImltcG9ydCB7XG4gIEFTWU5DX0lURVJBVE9SX0NPTlNUUlVDVE9SLFxuICBQUk9NSVNFX0NPTlNUUlVDVE9SLFxuICBTVFJFQU1fQ09OU1RSVUNUT1IsXG59IGZyb20gJy4vY29uc3RydWN0b3JzJztcbmltcG9ydCB7IFNZTV9BU1lOQ19JVEVSQVRPUiB9IGZyb20gJy4vc3ltYm9scyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RyZWFtTGlzdGVuZXI8VD4ge1xuICBuZXh0KHZhbHVlOiBUKTogdm9pZDtcbiAgdGhyb3codmFsdWU6IHVua25vd24pOiB2b2lkO1xuICByZXR1cm4odmFsdWU6IFQpOiB2b2lkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFN0cmVhbTxUPiB7XG4gIF9fU0VST1ZBTF9TVFJFQU1fXzogdHJ1ZTtcblxuICBvbihsaXN0ZW5lcjogU3RyZWFtTGlzdGVuZXI8VD4pOiAoKSA9PiB2b2lkO1xuXG4gIG5leHQodmFsdWU6IFQpOiB2b2lkO1xuICB0aHJvdyh2YWx1ZTogdW5rbm93bik6IHZvaWQ7XG4gIHJldHVybih2YWx1ZTogVCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1N0cmVhbTxUPih2YWx1ZTogb2JqZWN0KTogdmFsdWUgaXMgU3RyZWFtPFQ+IHtcbiAgcmV0dXJuICdfX1NFUk9WQUxfU1RSRUFNX18nIGluIHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3RyZWFtPFQ+KCk6IFN0cmVhbTxUPiB7XG4gIHJldHVybiBTVFJFQU1fQ09OU1RSVUNUT1IoKSBhcyB1bmtub3duIGFzIFN0cmVhbTxUPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVN0cmVhbUZyb21Bc3luY0l0ZXJhYmxlPFQ+KFxuICBpdGVyYWJsZTogQXN5bmNJdGVyYWJsZTxUPixcbik6IFN0cmVhbTxUPiB7XG4gIGNvbnN0IHN0cmVhbSA9IGNyZWF0ZVN0cmVhbTxUPigpO1xuXG4gIGNvbnN0IGl0ZXJhdG9yID0gaXRlcmFibGVbU1lNX0FTWU5DX0lURVJBVE9SXSgpO1xuXG4gIGFzeW5jIGZ1bmN0aW9uIHB1c2goKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gYXdhaXQgaXRlcmF0b3IubmV4dCgpO1xuICAgICAgaWYgKHZhbHVlLmRvbmUpIHtcbiAgICAgICAgc3RyZWFtLnJldHVybih2YWx1ZS52YWx1ZSBhcyBUKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0cmVhbS5uZXh0KHZhbHVlLnZhbHVlKTtcbiAgICAgICAgYXdhaXQgcHVzaCgpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBzdHJlYW0udGhyb3coZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIHB1c2goKS5jYXRjaCgoKSA9PiB7XG4gICAgLy8gbm8tb3BcbiAgfSk7XG5cbiAgcmV0dXJuIHN0cmVhbTtcbn1cblxuY29uc3QgY3JlYXRlQXN5bmNJdGVyYWJsZSA9IEFTWU5DX0lURVJBVE9SX0NPTlNUUlVDVE9SKFxuICBTWU1fQVNZTkNfSVRFUkFUT1IsXG4gIFBST01JU0VfQ09OU1RSVUNUT1IsXG4pO1xuXG5leHBvcnQgZnVuY3Rpb24gc3RyZWFtVG9Bc3luY0l0ZXJhYmxlPFQ+KFxuICBzdHJlYW06IFN0cmVhbTxUPixcbik6ICgpID0+IEFzeW5jSXRlcmFibGVJdGVyYXRvcjxUPiB7XG4gIHJldHVybiBjcmVhdGVBc3luY0l0ZXJhYmxlKFxuICAgIHN0cmVhbSxcbiAgKSBhcyB1bmtub3duIGFzICgpID0+IEFzeW5jSXRlcmFibGVJdGVyYXRvcjxUPjtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIHByb21pc2VUb1Jlc3VsdChcbiAgY3VycmVudDogUHJvbWlzZTx1bmtub3duPixcbik6IFByb21pc2U8WzAgfCAxLCB1bmtub3duXT4ge1xuICB0cnkge1xuICAgIHJldHVybiBbMSwgYXdhaXQgY3VycmVudF07XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gWzAsIGVdO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBjcmVhdGVJbmRleGVkVmFsdWVOb2RlLFxuICBjcmVhdGVSZWZlcmVuY2VOb2RlLFxuICBjcmVhdGVXS1N5bWJvbE5vZGUsXG59IGZyb20gJy4uL2Jhc2UtcHJpbWl0aXZlcyc7XG5pbXBvcnQgeyBBTExfRU5BQkxFRCB9IGZyb20gJy4uL2NvbXBhdCc7XG5pbXBvcnQgdHlwZSB7IFdlbGxLbm93blN5bWJvbHMgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgSU5WX1NZTUJPTF9SRUYsIE5JTCwgU2Vyb3ZhbE5vZGVUeXBlIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCB7IFNlcm92YWxVbnN1cHBvcnRlZFR5cGVFcnJvciB9IGZyb20gJy4uL2Vycm9ycyc7XG5pbXBvcnQgeyBjcmVhdGVTZXJvdmFsTm9kZSB9IGZyb20gJy4uL25vZGUnO1xuaW1wb3J0IHR5cGUgeyBQbHVnaW5BY2Nlc3NPcHRpb25zLCBTZXJvdmFsTW9kZSB9IGZyb20gJy4uL3BsdWdpbic7XG5pbXBvcnQgeyBoYXNSZWZlcmVuY2VJRCB9IGZyb20gJy4uL3JlZmVyZW5jZSc7XG5pbXBvcnQge1xuICBBU1lOQ19JVEVSQVRPUixcbiAgSVRFUkFUT1IsXG4gIFNQRUNJQUxfUkVGUyxcbiAgU3BlY2lhbFJlZmVyZW5jZSxcbn0gZnJvbSAnLi4vc3BlY2lhbC1yZWZlcmVuY2UnO1xuaW1wb3J0IHsgc2VyaWFsaXplU3RyaW5nIH0gZnJvbSAnLi4vc3RyaW5nJztcbmltcG9ydCB7IFNZTV9BU1lOQ19JVEVSQVRPUiwgU1lNX0lURVJBVE9SIH0gZnJvbSAnLi4vc3ltYm9scyc7XG5pbXBvcnQgdHlwZSB7XG4gIFNlcm92YWxBcnJheUJ1ZmZlck5vZGUsXG4gIFNlcm92YWxBc3luY0l0ZXJhdG9yRmFjdG9yeU5vZGUsXG4gIFNlcm92YWxJbmRleGVkVmFsdWVOb2RlLFxuICBTZXJvdmFsSXRlcmF0b3JGYWN0b3J5Tm9kZSxcbiAgU2Vyb3ZhbE1hcE5vZGUsXG4gIFNlcm92YWxOb2RlLFxuICBTZXJvdmFsTnVsbENvbnN0cnVjdG9yTm9kZSxcbiAgU2Vyb3ZhbE9iamVjdE5vZGUsXG4gIFNlcm92YWxPYmplY3RSZWNvcmROb2RlLFxuICBTZXJvdmFsUHJvbWlzZUNvbnN0cnVjdG9yTm9kZSxcbiAgU2Vyb3ZhbFJlZmVyZW5jZU5vZGUsXG4gIFNlcm92YWxTcGVjaWFsUmVmZXJlbmNlTm9kZSxcbiAgU2Vyb3ZhbFdLU3ltYm9sTm9kZSxcbn0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgZ2V0T2JqZWN0RmxhZyB9IGZyb20gJy4uL3V0aWxzL2dldC1vYmplY3QtZmxhZyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmFzZVBhcnNlckNvbnRleHRPcHRpb25zIGV4dGVuZHMgUGx1Z2luQWNjZXNzT3B0aW9ucyB7XG4gIGRpc2FibGVkRmVhdHVyZXM/OiBudW1iZXI7XG4gIHJlZnM/OiBNYXA8dW5rbm93biwgbnVtYmVyPjtcbiAgZGVwdGhMaW1pdD86IG51bWJlcjtcbn1cblxuZXhwb3J0IGNvbnN0IGVudW0gUGFyc2VyTm9kZVR5cGUge1xuICBGcmVzaCA9IDAsXG4gIEluZGV4ZWQgPSAxLFxuICBSZWZlcmVuY2VkID0gMixcbn1cblxuZXhwb3J0IGludGVyZmFjZSBGcmVzaE5vZGUge1xuICB0eXBlOiBQYXJzZXJOb2RlVHlwZS5GcmVzaDtcbiAgdmFsdWU6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJbmRleGVkTm9kZSB7XG4gIHR5cGU6IFBhcnNlck5vZGVUeXBlLkluZGV4ZWQ7XG4gIHZhbHVlOiBTZXJvdmFsSW5kZXhlZFZhbHVlTm9kZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZWZlcmVuY2VkTm9kZSB7XG4gIHR5cGU6IFBhcnNlck5vZGVUeXBlLlJlZmVyZW5jZWQ7XG4gIHZhbHVlOiBTZXJvdmFsUmVmZXJlbmNlTm9kZTtcbn1cblxudHlwZSBPYmplY3ROb2RlID0gRnJlc2hOb2RlIHwgSW5kZXhlZE5vZGUgfCBSZWZlcmVuY2VkTm9kZTtcblxuZXhwb3J0IGludGVyZmFjZSBCYXNlUGFyc2VyQ29udGV4dCBleHRlbmRzIFBsdWdpbkFjY2Vzc09wdGlvbnMge1xuICByZWFkb25seSBtb2RlOiBTZXJvdmFsTW9kZTtcblxuICBtYXJrZWQ6IFNldDxudW1iZXI+O1xuXG4gIHJlZnM6IE1hcDx1bmtub3duLCBudW1iZXI+O1xuXG4gIGZlYXR1cmVzOiBudW1iZXI7XG5cbiAgZGVwdGhMaW1pdDogbnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQmFzZVBhcnNlckNvbnRleHQoXG4gIG1vZGU6IFNlcm92YWxNb2RlLFxuICBvcHRpb25zOiBCYXNlUGFyc2VyQ29udGV4dE9wdGlvbnMsXG4pOiBCYXNlUGFyc2VyQ29udGV4dCB7XG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogb3B0aW9ucy5wbHVnaW5zLFxuICAgIG1vZGUsXG4gICAgbWFya2VkOiBuZXcgU2V0KCksXG4gICAgZmVhdHVyZXM6IEFMTF9FTkFCTEVEIF4gKG9wdGlvbnMuZGlzYWJsZWRGZWF0dXJlcyB8fCAwKSxcbiAgICByZWZzOiBvcHRpb25zLnJlZnMgfHwgbmV3IE1hcCgpLFxuICAgIGRlcHRoTGltaXQ6IG9wdGlvbnMuZGVwdGhMaW1pdCB8fCAxMDAwLFxuICB9O1xufVxuXG4vKipcbiAqIEVuc3VyZXMgdGhhdCB0aGUgdmFsdWUgKGJhc2VkIG9uIGFuIGlkZW50aWZpZXIpIGhhcyBiZWVuIHZpc2l0ZWQgYnkgdGhlIHBhcnNlci5cbiAqIEBwYXJhbSBjdHhcbiAqIEBwYXJhbSBpZFxuICovXG5leHBvcnQgZnVuY3Rpb24gbWFya1BhcnNlclJlZihjdHg6IEJhc2VQYXJzZXJDb250ZXh0LCBpZDogbnVtYmVyKTogdm9pZCB7XG4gIGN0eC5tYXJrZWQuYWRkKGlkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGFyc2VyUmVmTWFya2VkKGN0eDogQmFzZVBhcnNlckNvbnRleHQsIGlkOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIGN0eC5tYXJrZWQuaGFzKGlkKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGlkZW50aWZpZXIgZm9yIGEgdmFsdWVcbiAqIEBwYXJhbSBjdHhcbiAqIEBwYXJhbSBjdXJyZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVJbmRleEZvclZhbHVlPFQ+KFxuICBjdHg6IEJhc2VQYXJzZXJDb250ZXh0LFxuICBjdXJyZW50OiBULFxuKTogbnVtYmVyIHtcbiAgY29uc3QgaWQgPSBjdHgucmVmcy5zaXplO1xuICBjdHgucmVmcy5zZXQoY3VycmVudCwgaWQpO1xuICByZXR1cm4gaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROb2RlRm9ySW5kZXhlZFZhbHVlPFQ+KFxuICBjdHg6IEJhc2VQYXJzZXJDb250ZXh0LFxuICBjdXJyZW50OiBULFxuKTogRnJlc2hOb2RlIHwgSW5kZXhlZE5vZGUge1xuICBjb25zdCByZWdpc3RlcmVkSWQgPSBjdHgucmVmcy5nZXQoY3VycmVudCk7XG4gIGlmIChyZWdpc3RlcmVkSWQgIT0gbnVsbCkge1xuICAgIG1hcmtQYXJzZXJSZWYoY3R4LCByZWdpc3RlcmVkSWQpO1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBQYXJzZXJOb2RlVHlwZS5JbmRleGVkLFxuICAgICAgdmFsdWU6IGNyZWF0ZUluZGV4ZWRWYWx1ZU5vZGUocmVnaXN0ZXJlZElkKSxcbiAgICB9O1xuICB9XG4gIHJldHVybiB7XG4gICAgdHlwZTogUGFyc2VyTm9kZVR5cGUuRnJlc2gsXG4gICAgdmFsdWU6IGNyZWF0ZUluZGV4Rm9yVmFsdWUoY3R4LCBjdXJyZW50KSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlZmVyZW5jZU5vZGU8VD4oXG4gIGN0eDogQmFzZVBhcnNlckNvbnRleHQsXG4gIGN1cnJlbnQ6IFQsXG4pOiBPYmplY3ROb2RlIHtcbiAgY29uc3QgaW5kZXhlZCA9IGdldE5vZGVGb3JJbmRleGVkVmFsdWUoY3R4LCBjdXJyZW50KTtcbiAgaWYgKGluZGV4ZWQudHlwZSA9PT0gUGFyc2VyTm9kZVR5cGUuSW5kZXhlZCkge1xuICAgIHJldHVybiBpbmRleGVkO1xuICB9XG4gIC8vIFNwZWNpYWwgcmVmZXJlbmNlcyBhcmUgc3BlY2lhbCA7KVxuICBpZiAoaGFzUmVmZXJlbmNlSUQoY3VycmVudCkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogUGFyc2VyTm9kZVR5cGUuUmVmZXJlbmNlZCxcbiAgICAgIHZhbHVlOiBjcmVhdGVSZWZlcmVuY2VOb2RlKGluZGV4ZWQudmFsdWUsIGN1cnJlbnQpLFxuICAgIH07XG4gIH1cbiAgcmV0dXJuIGluZGV4ZWQ7XG59XG5cbi8qKlxuICogUGFyc2luZyBtZXRob2RzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVdlbGxLbm93blN5bWJvbChcbiAgY3R4OiBCYXNlUGFyc2VyQ29udGV4dCxcbiAgY3VycmVudDogc3ltYm9sLFxuKTogU2Vyb3ZhbEluZGV4ZWRWYWx1ZU5vZGUgfCBTZXJvdmFsV0tTeW1ib2xOb2RlIHwgU2Vyb3ZhbFJlZmVyZW5jZU5vZGUge1xuICBjb25zdCByZWYgPSBnZXRSZWZlcmVuY2VOb2RlKGN0eCwgY3VycmVudCk7XG4gIGlmIChyZWYudHlwZSAhPT0gUGFyc2VyTm9kZVR5cGUuRnJlc2gpIHtcbiAgICByZXR1cm4gcmVmLnZhbHVlO1xuICB9XG4gIGlmIChjdXJyZW50IGluIElOVl9TWU1CT0xfUkVGKSB7XG4gICAgcmV0dXJuIGNyZWF0ZVdLU3ltYm9sTm9kZShyZWYudmFsdWUsIGN1cnJlbnQgYXMgV2VsbEtub3duU3ltYm9scyk7XG4gIH1cbiAgdGhyb3cgbmV3IFNlcm92YWxVbnN1cHBvcnRlZFR5cGVFcnJvcihjdXJyZW50KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU3BlY2lhbFJlZmVyZW5jZShcbiAgY3R4OiBCYXNlUGFyc2VyQ29udGV4dCxcbiAgcmVmOiBTcGVjaWFsUmVmZXJlbmNlLFxuKTogU2Vyb3ZhbEluZGV4ZWRWYWx1ZU5vZGUgfCBTZXJvdmFsU3BlY2lhbFJlZmVyZW5jZU5vZGUge1xuICBjb25zdCByZXN1bHQgPSBnZXROb2RlRm9ySW5kZXhlZFZhbHVlKGN0eCwgU1BFQ0lBTF9SRUZTW3JlZl0pO1xuICBpZiAocmVzdWx0LnR5cGUgPT09IFBhcnNlck5vZGVUeXBlLkluZGV4ZWQpIHtcbiAgICByZXR1cm4gcmVzdWx0LnZhbHVlO1xuICB9XG4gIHJldHVybiBjcmVhdGVTZXJvdmFsTm9kZShcbiAgICBTZXJvdmFsTm9kZVR5cGUuU3BlY2lhbFJlZmVyZW5jZSxcbiAgICByZXN1bHQudmFsdWUsXG4gICAgcmVmLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VJdGVyYXRvckZhY3RvcnkoXG4gIGN0eDogQmFzZVBhcnNlckNvbnRleHQsXG4pOiBTZXJvdmFsSW5kZXhlZFZhbHVlTm9kZSB8IFNlcm92YWxJdGVyYXRvckZhY3RvcnlOb2RlIHtcbiAgY29uc3QgcmVzdWx0ID0gZ2V0Tm9kZUZvckluZGV4ZWRWYWx1ZShjdHgsIElURVJBVE9SKTtcbiAgaWYgKHJlc3VsdC50eXBlID09PSBQYXJzZXJOb2RlVHlwZS5JbmRleGVkKSB7XG4gICAgcmV0dXJuIHJlc3VsdC52YWx1ZTtcbiAgfVxuICByZXR1cm4gY3JlYXRlU2Vyb3ZhbE5vZGUoXG4gICAgU2Vyb3ZhbE5vZGVUeXBlLkl0ZXJhdG9yRmFjdG9yeSxcbiAgICByZXN1bHQudmFsdWUsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgcGFyc2VXZWxsS25vd25TeW1ib2woY3R4LCBTWU1fSVRFUkFUT1IpLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VBc3luY0l0ZXJhdG9yRmFjdG9yeShcbiAgY3R4OiBCYXNlUGFyc2VyQ29udGV4dCxcbik6IFNlcm92YWxJbmRleGVkVmFsdWVOb2RlIHwgU2Vyb3ZhbEFzeW5jSXRlcmF0b3JGYWN0b3J5Tm9kZSB7XG4gIGNvbnN0IHJlc3VsdCA9IGdldE5vZGVGb3JJbmRleGVkVmFsdWUoY3R4LCBBU1lOQ19JVEVSQVRPUik7XG4gIGlmIChyZXN1bHQudHlwZSA9PT0gUGFyc2VyTm9kZVR5cGUuSW5kZXhlZCkge1xuICAgIHJldHVybiByZXN1bHQudmFsdWU7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZVNlcm92YWxOb2RlKFxuICAgIFNlcm92YWxOb2RlVHlwZS5Bc3luY0l0ZXJhdG9yRmFjdG9yeSxcbiAgICByZXN1bHQudmFsdWUsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBbXG4gICAgICBwYXJzZVNwZWNpYWxSZWZlcmVuY2UoY3R4LCBTcGVjaWFsUmVmZXJlbmNlLlByb21pc2VDb25zdHJ1Y3RvciksXG4gICAgICBwYXJzZVdlbGxLbm93blN5bWJvbChjdHgsIFNZTV9BU1lOQ19JVEVSQVRPUiksXG4gICAgXSxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVPYmplY3ROb2RlKFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbiAgZW1wdHk6IGJvb2xlYW4sXG4gIHJlY29yZDogU2Vyb3ZhbE9iamVjdFJlY29yZE5vZGUsXG4pOiBTZXJvdmFsT2JqZWN0Tm9kZSB8IFNlcm92YWxOdWxsQ29uc3RydWN0b3JOb2RlIHtcbiAgcmV0dXJuIGNyZWF0ZVNlcm92YWxOb2RlKFxuICAgIGVtcHR5ID8gU2Vyb3ZhbE5vZGVUeXBlLk51bGxDb25zdHJ1Y3RvciA6IFNlcm92YWxOb2RlVHlwZS5PYmplY3QsXG4gICAgaWQsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgcmVjb3JkLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBnZXRPYmplY3RGbGFnKGN1cnJlbnQpLFxuICAgIE5JTCxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1hcE5vZGUoXG4gIGN0eDogQmFzZVBhcnNlckNvbnRleHQsXG4gIGlkOiBudW1iZXIsXG4gIGs6IFNlcm92YWxOb2RlW10sXG4gIHY6IFNlcm92YWxOb2RlW10sXG4pOiBTZXJvdmFsTWFwTm9kZSB7XG4gIHJldHVybiBjcmVhdGVTZXJvdmFsTm9kZShcbiAgICBTZXJvdmFsTm9kZVR5cGUuTWFwLFxuICAgIGlkLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICB7IGssIHYgfSxcbiAgICBOSUwsXG4gICAgcGFyc2VTcGVjaWFsUmVmZXJlbmNlKGN0eCwgU3BlY2lhbFJlZmVyZW5jZS5NYXBTZW50aW5lbCksXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQcm9taXNlQ29uc3RydWN0b3JOb2RlKFxuICBjdHg6IEJhc2VQYXJzZXJDb250ZXh0LFxuICBpZDogbnVtYmVyLFxuICByZXNvbHZlcjogbnVtYmVyLFxuKTogU2Vyb3ZhbFByb21pc2VDb25zdHJ1Y3Rvck5vZGUge1xuICByZXR1cm4gY3JlYXRlU2Vyb3ZhbE5vZGUoXG4gICAgU2Vyb3ZhbE5vZGVUeXBlLlByb21pc2VDb25zdHJ1Y3RvcixcbiAgICBpZCxcbiAgICByZXNvbHZlcixcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIHBhcnNlU3BlY2lhbFJlZmVyZW5jZShjdHgsIFNwZWNpYWxSZWZlcmVuY2UuUHJvbWlzZUNvbnN0cnVjdG9yKSxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFycmF5QnVmZmVyTm9kZShcbiAgY3R4OiBCYXNlUGFyc2VyQ29udGV4dCxcbiAgaWQ6IG51bWJlcixcbiAgY3VycmVudDogQXJyYXlCdWZmZXIsXG4pOiBTZXJvdmFsQXJyYXlCdWZmZXJOb2RlIHtcbiAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheShjdXJyZW50KTtcbiAgbGV0IHJlc3VsdCA9ICcnO1xuICBmb3IgKGxldCBpID0gMCwgbGVuID0gYnl0ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICByZXN1bHQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSk7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZVNlcm92YWxOb2RlKFxuICAgIFNlcm92YWxOb2RlVHlwZS5BcnJheUJ1ZmZlcixcbiAgICBpZCxcbiAgICBzZXJpYWxpemVTdHJpbmcoYnRvYShyZXN1bHQpKSxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIHBhcnNlU3BlY2lhbFJlZmVyZW5jZShjdHgsIFNwZWNpYWxSZWZlcmVuY2UuQXJyYXlCdWZmZXJDb25zdHJ1Y3RvciksXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICk7XG59XG4iLCJpbXBvcnQge1xuICBjcmVhdGVBZ2dyZWdhdGVFcnJvck5vZGUsXG4gIGNyZWF0ZUFycmF5Tm9kZSxcbiAgY3JlYXRlQXN5bmNJdGVyYXRvckZhY3RvcnlJbnN0YW5jZU5vZGUsXG4gIGNyZWF0ZUJpZ0ludE5vZGUsXG4gIGNyZWF0ZUJpZ0ludFR5cGVkQXJyYXlOb2RlLFxuICBjcmVhdGVCb3hlZE5vZGUsXG4gIGNyZWF0ZURhdGFWaWV3Tm9kZSxcbiAgY3JlYXRlRGF0ZU5vZGUsXG4gIGNyZWF0ZUVycm9yTm9kZSxcbiAgY3JlYXRlSXRlcmF0b3JGYWN0b3J5SW5zdGFuY2VOb2RlLFxuICBjcmVhdGVOdW1iZXJOb2RlLFxuICBjcmVhdGVQbHVnaW5Ob2RlLFxuICBjcmVhdGVSZWdFeHBOb2RlLFxuICBjcmVhdGVTZXF1ZW5jZU5vZGUsXG4gIGNyZWF0ZVNldE5vZGUsXG4gIGNyZWF0ZVN0cmVhbUNvbnN0cnVjdG9yTm9kZSxcbiAgY3JlYXRlU3RyZWFtTmV4dE5vZGUsXG4gIGNyZWF0ZVN0cmVhbVJldHVybk5vZGUsXG4gIGNyZWF0ZVN0cmVhbVRocm93Tm9kZSxcbiAgY3JlYXRlU3RyaW5nTm9kZSxcbiAgY3JlYXRlVHlwZWRBcnJheU5vZGUsXG59IGZyb20gJy4uL2Jhc2UtcHJpbWl0aXZlcyc7XG5pbXBvcnQgeyBGZWF0dXJlIH0gZnJvbSAnLi4vY29tcGF0JztcbmltcG9ydCB7IE5JTCwgU2Vyb3ZhbE5vZGVUeXBlIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCB7IFNlcm92YWxQYXJzZXJFcnJvciwgU2Vyb3ZhbFVuc3VwcG9ydGVkVHlwZUVycm9yIH0gZnJvbSAnLi4vZXJyb3JzJztcbmltcG9ydCB7IEZBTFNFX05PREUsIE5VTExfTk9ERSwgVFJVRV9OT0RFLCBVTkRFRklORURfTk9ERSB9IGZyb20gJy4uL2xpdGVyYWxzJztcbmltcG9ydCB7IGNyZWF0ZVNlcm92YWxOb2RlIH0gZnJvbSAnLi4vbm9kZSc7XG5pbXBvcnQgeyBPcGFxdWVSZWZlcmVuY2UgfSBmcm9tICcuLi9vcGFxdWUtcmVmZXJlbmNlJztcbmltcG9ydCB0eXBlIHsgU2Vyb3ZhbE1vZGUgfSBmcm9tICcuLi9wbHVnaW4nO1xuaW1wb3J0IHtcbiAgY3JlYXRlU2VxdWVuY2VGcm9tSXRlcmFibGUsXG4gIGlzU2VxdWVuY2UsXG4gIHR5cGUgU2VxdWVuY2UsXG59IGZyb20gJy4uL3NlcXVlbmNlJztcbmltcG9ydCB7IFNwZWNpYWxSZWZlcmVuY2UgfSBmcm9tICcuLi9zcGVjaWFsLXJlZmVyZW5jZSc7XG5pbXBvcnQgdHlwZSB7IFN0cmVhbSB9IGZyb20gJy4uL3N0cmVhbSc7XG5pbXBvcnQgeyBjcmVhdGVTdHJlYW1Gcm9tQXN5bmNJdGVyYWJsZSwgaXNTdHJlYW0gfSBmcm9tICcuLi9zdHJlYW0nO1xuaW1wb3J0IHsgc2VyaWFsaXplU3RyaW5nIH0gZnJvbSAnLi4vc3RyaW5nJztcbmltcG9ydCB7XG4gIFNZTV9BU1lOQ19JVEVSQVRPUixcbiAgU1lNX0lTX0NPTkNBVF9TUFJFQURBQkxFLFxuICBTWU1fSVRFUkFUT1IsXG4gIFNZTV9UT19TVFJJTkdfVEFHLFxufSBmcm9tICcuLi9zeW1ib2xzJztcbmltcG9ydCB0eXBlIHtcbiAgU2Vyb3ZhbEFnZ3JlZ2F0ZUVycm9yTm9kZSxcbiAgU2Vyb3ZhbEFycmF5Tm9kZSxcbiAgU2Vyb3ZhbEJpZ0ludFR5cGVkQXJyYXlOb2RlLFxuICBTZXJvdmFsQm94ZWROb2RlLFxuICBTZXJvdmFsRGF0YVZpZXdOb2RlLFxuICBTZXJvdmFsRXJyb3JOb2RlLFxuICBTZXJvdmFsTWFwTm9kZSxcbiAgU2Vyb3ZhbE5vZGUsXG4gIFNlcm92YWxOb2RlV2l0aElELFxuICBTZXJvdmFsTnVsbENvbnN0cnVjdG9yTm9kZSxcbiAgU2Vyb3ZhbE9iamVjdE5vZGUsXG4gIFNlcm92YWxPYmplY3RSZWNvcmRLZXksXG4gIFNlcm92YWxPYmplY3RSZWNvcmROb2RlLFxuICBTZXJvdmFsUGx1Z2luTm9kZSxcbiAgU2Vyb3ZhbFByb21pc2VOb2RlLFxuICBTZXJvdmFsU2VxdWVuY2VOb2RlLFxuICBTZXJvdmFsU2V0Tm9kZSxcbiAgU2Vyb3ZhbFN0cmVhbUNvbnN0cnVjdG9yTm9kZSxcbiAgU2Vyb3ZhbFR5cGVkQXJyYXlOb2RlLFxufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBnZXRFcnJvck9wdGlvbnMgfSBmcm9tICcuLi91dGlscy9lcnJvcic7XG5pbXBvcnQgcHJvbWlzZVRvUmVzdWx0IGZyb20gJy4uL3V0aWxzL3Byb21pc2UtdG8tcmVzdWx0JztcbmltcG9ydCB0eXBlIHtcbiAgQmlnSW50VHlwZWRBcnJheVZhbHVlLFxuICBUeXBlZEFycmF5VmFsdWUsXG59IGZyb20gJy4uL3V0aWxzL3R5cGVkLWFycmF5JztcbmltcG9ydCB0eXBlIHsgQmFzZVBhcnNlckNvbnRleHQsIEJhc2VQYXJzZXJDb250ZXh0T3B0aW9ucyB9IGZyb20gJy4vcGFyc2VyJztcbmltcG9ydCB7XG4gIGNyZWF0ZUFycmF5QnVmZmVyTm9kZSxcbiAgY3JlYXRlQmFzZVBhcnNlckNvbnRleHQsXG4gIGNyZWF0ZU1hcE5vZGUsXG4gIGNyZWF0ZU9iamVjdE5vZGUsXG4gIGdldFJlZmVyZW5jZU5vZGUsXG4gIG1hcmtQYXJzZXJSZWYsXG4gIHBhcnNlQXN5bmNJdGVyYXRvckZhY3RvcnksXG4gIHBhcnNlSXRlcmF0b3JGYWN0b3J5LFxuICBQYXJzZXJOb2RlVHlwZSxcbiAgcGFyc2VTcGVjaWFsUmVmZXJlbmNlLFxuICBwYXJzZVdlbGxLbm93blN5bWJvbCxcbn0gZnJvbSAnLi9wYXJzZXInO1xuXG50eXBlIE9iamVjdExpa2VOb2RlID1cbiAgfCBTZXJvdmFsT2JqZWN0Tm9kZVxuICB8IFNlcm92YWxOdWxsQ29uc3RydWN0b3JOb2RlXG4gIHwgU2Vyb3ZhbFByb21pc2VOb2RlO1xuXG5leHBvcnQgdHlwZSBBc3luY1BhcnNlckNvbnRleHRPcHRpb25zID0gQmFzZVBhcnNlckNvbnRleHRPcHRpb25zO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFzeW5jUGFyc2VyQ29udGV4dCB7XG4gIGJhc2U6IEJhc2VQYXJzZXJDb250ZXh0O1xuICBjaGlsZDogQXN5bmNQYXJzZVBsdWdpbkNvbnRleHQgfCB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBc3luY1BhcnNlckNvbnRleHQoXG4gIG1vZGU6IFNlcm92YWxNb2RlLFxuICBvcHRpb25zOiBBc3luY1BhcnNlckNvbnRleHRPcHRpb25zLFxuKTogQXN5bmNQYXJzZXJDb250ZXh0IHtcbiAgcmV0dXJuIHtcbiAgICBiYXNlOiBjcmVhdGVCYXNlUGFyc2VyQ29udGV4dChtb2RlLCBvcHRpb25zKSxcbiAgICBjaGlsZDogdW5kZWZpbmVkLFxuICB9O1xufVxuXG5leHBvcnQgY2xhc3MgQXN5bmNQYXJzZVBsdWdpbkNvbnRleHQge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9wOiBBc3luY1BhcnNlckNvbnRleHQsXG4gICAgcHJpdmF0ZSBkZXB0aDogbnVtYmVyLFxuICApIHt9XG5cbiAgcGFyc2U8VD4oY3VycmVudDogVCk6IFByb21pc2U8U2Vyb3ZhbE5vZGU+IHtcbiAgICByZXR1cm4gcGFyc2VBc3luYyh0aGlzLl9wLCB0aGlzLmRlcHRoLCBjdXJyZW50KTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBwYXJzZUl0ZW1zKFxuICBjdHg6IEFzeW5jUGFyc2VyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgY3VycmVudDogdW5rbm93bltdLFxuKTogUHJvbWlzZTwoU2Vyb3ZhbE5vZGUgfCAwKVtdPiB7XG4gIGNvbnN0IG5vZGVzOiAoU2Vyb3ZhbE5vZGUgfCAwKVtdID0gW107XG4gIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjdXJyZW50Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgLy8gRm9yIGNvbnNpc3RlbmN5IGluIGhvbGVzXG4gICAgaWYgKGkgaW4gY3VycmVudCkge1xuICAgICAgbm9kZXNbaV0gPSBhd2FpdCBwYXJzZUFzeW5jKGN0eCwgZGVwdGgsIGN1cnJlbnRbaV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2Rlc1tpXSA9IDA7XG4gICAgfVxuICB9XG4gIHJldHVybiBub2Rlcztcbn1cblxuYXN5bmMgZnVuY3Rpb24gcGFyc2VBcnJheShcbiAgY3R4OiBBc3luY1BhcnNlckNvbnRleHQsXG4gIGRlcHRoOiBudW1iZXIsXG4gIGlkOiBudW1iZXIsXG4gIGN1cnJlbnQ6IHVua25vd25bXSxcbik6IFByb21pc2U8U2Vyb3ZhbEFycmF5Tm9kZT4ge1xuICByZXR1cm4gY3JlYXRlQXJyYXlOb2RlKGlkLCBjdXJyZW50LCBhd2FpdCBwYXJzZUl0ZW1zKGN0eCwgZGVwdGgsIGN1cnJlbnQpKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcGFyc2VQcm9wZXJ0aWVzKFxuICBjdHg6IEFzeW5jUGFyc2VyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgcHJvcGVydGllczogUmVjb3JkPHN0cmluZyB8IHN5bWJvbCwgdW5rbm93bj4sXG4pOiBQcm9taXNlPFNlcm92YWxPYmplY3RSZWNvcmROb2RlPiB7XG4gIGNvbnN0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyhwcm9wZXJ0aWVzKTtcbiAgY29uc3Qga2V5Tm9kZXM6IFNlcm92YWxPYmplY3RSZWNvcmRLZXlbXSA9IFtdO1xuICBjb25zdCB2YWx1ZU5vZGVzOiBTZXJvdmFsTm9kZVtdID0gW107XG4gIGZvciAobGV0IGkgPSAwLCBsZW4gPSBlbnRyaWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAga2V5Tm9kZXMucHVzaChzZXJpYWxpemVTdHJpbmcoZW50cmllc1tpXVswXSkpO1xuICAgIHZhbHVlTm9kZXMucHVzaChhd2FpdCBwYXJzZUFzeW5jKGN0eCwgZGVwdGgsIGVudHJpZXNbaV1bMV0pKTtcbiAgfVxuICAvLyBDaGVjayBzcGVjaWFsIHByb3BlcnRpZXNcbiAgaWYgKFNZTV9JVEVSQVRPUiBpbiBwcm9wZXJ0aWVzKSB7XG4gICAga2V5Tm9kZXMucHVzaChwYXJzZVdlbGxLbm93blN5bWJvbChjdHguYmFzZSwgU1lNX0lURVJBVE9SKSk7XG4gICAgdmFsdWVOb2Rlcy5wdXNoKFxuICAgICAgY3JlYXRlSXRlcmF0b3JGYWN0b3J5SW5zdGFuY2VOb2RlKFxuICAgICAgICBwYXJzZUl0ZXJhdG9yRmFjdG9yeShjdHguYmFzZSksXG4gICAgICAgIChhd2FpdCBwYXJzZUFzeW5jKFxuICAgICAgICAgIGN0eCxcbiAgICAgICAgICBkZXB0aCxcbiAgICAgICAgICBjcmVhdGVTZXF1ZW5jZUZyb21JdGVyYWJsZShcbiAgICAgICAgICAgIHByb3BlcnRpZXMgYXMgdW5rbm93biBhcyBJdGVyYWJsZTx1bmtub3duPixcbiAgICAgICAgICApLFxuICAgICAgICApKSBhcyBTZXJvdmFsTm9kZVdpdGhJRCxcbiAgICAgICksXG4gICAgKTtcbiAgfVxuICBpZiAoU1lNX0FTWU5DX0lURVJBVE9SIGluIHByb3BlcnRpZXMpIHtcbiAgICBrZXlOb2Rlcy5wdXNoKHBhcnNlV2VsbEtub3duU3ltYm9sKGN0eC5iYXNlLCBTWU1fQVNZTkNfSVRFUkFUT1IpKTtcbiAgICB2YWx1ZU5vZGVzLnB1c2goXG4gICAgICBjcmVhdGVBc3luY0l0ZXJhdG9yRmFjdG9yeUluc3RhbmNlTm9kZShcbiAgICAgICAgcGFyc2VBc3luY0l0ZXJhdG9yRmFjdG9yeShjdHguYmFzZSksXG4gICAgICAgIChhd2FpdCBwYXJzZUFzeW5jKFxuICAgICAgICAgIGN0eCxcbiAgICAgICAgICBkZXB0aCxcbiAgICAgICAgICBjcmVhdGVTdHJlYW1Gcm9tQXN5bmNJdGVyYWJsZShcbiAgICAgICAgICAgIHByb3BlcnRpZXMgYXMgdW5rbm93biBhcyBBc3luY0l0ZXJhYmxlPHVua25vd24+LFxuICAgICAgICAgICksXG4gICAgICAgICkpIGFzIFNlcm92YWxOb2RlV2l0aElELFxuICAgICAgKSxcbiAgICApO1xuICB9XG4gIGlmIChTWU1fVE9fU1RSSU5HX1RBRyBpbiBwcm9wZXJ0aWVzKSB7XG4gICAga2V5Tm9kZXMucHVzaChwYXJzZVdlbGxLbm93blN5bWJvbChjdHguYmFzZSwgU1lNX1RPX1NUUklOR19UQUcpKTtcbiAgICB2YWx1ZU5vZGVzLnB1c2goY3JlYXRlU3RyaW5nTm9kZShwcm9wZXJ0aWVzW1NZTV9UT19TVFJJTkdfVEFHXSBhcyBzdHJpbmcpKTtcbiAgfVxuICBpZiAoU1lNX0lTX0NPTkNBVF9TUFJFQURBQkxFIGluIHByb3BlcnRpZXMpIHtcbiAgICBrZXlOb2Rlcy5wdXNoKHBhcnNlV2VsbEtub3duU3ltYm9sKGN0eC5iYXNlLCBTWU1fSVNfQ09OQ0FUX1NQUkVBREFCTEUpKTtcbiAgICB2YWx1ZU5vZGVzLnB1c2goXG4gICAgICBwcm9wZXJ0aWVzW1NZTV9JU19DT05DQVRfU1BSRUFEQUJMRV0gPyBUUlVFX05PREUgOiBGQUxTRV9OT0RFLFxuICAgICk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBrOiBrZXlOb2RlcyxcbiAgICB2OiB2YWx1ZU5vZGVzLFxuICB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBwYXJzZVBsYWluT2JqZWN0KFxuICBjdHg6IEFzeW5jUGFyc2VyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgaWQ6IG51bWJlcixcbiAgY3VycmVudDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gIGVtcHR5OiBib29sZWFuLFxuKTogUHJvbWlzZTxPYmplY3RMaWtlTm9kZT4ge1xuICByZXR1cm4gY3JlYXRlT2JqZWN0Tm9kZShcbiAgICBpZCxcbiAgICBjdXJyZW50LFxuICAgIGVtcHR5LFxuICAgIGF3YWl0IHBhcnNlUHJvcGVydGllcyhjdHgsIGRlcHRoLCBjdXJyZW50KSxcbiAgKTtcbn1cblxuLy8gVE9ETzogY2hlY2sgaWYgcGFyc2VCb3hlZFN5bmMgY2FuIGJlIHVzZWRcbmFzeW5jIGZ1bmN0aW9uIHBhcnNlQm94ZWQoXG4gIGN0eDogQXN5bmNQYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiBvYmplY3QsXG4pOiBQcm9taXNlPFNlcm92YWxCb3hlZE5vZGU+IHtcbiAgcmV0dXJuIGNyZWF0ZUJveGVkTm9kZShpZCwgYXdhaXQgcGFyc2VBc3luYyhjdHgsIGRlcHRoLCBjdXJyZW50LnZhbHVlT2YoKSkpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBwYXJzZVR5cGVkQXJyYXkoXG4gIGN0eDogQXN5bmNQYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiBUeXBlZEFycmF5VmFsdWUsXG4pOiBQcm9taXNlPFNlcm92YWxUeXBlZEFycmF5Tm9kZT4ge1xuICByZXR1cm4gY3JlYXRlVHlwZWRBcnJheU5vZGUoXG4gICAgaWQsXG4gICAgY3VycmVudCxcbiAgICBhd2FpdCBwYXJzZUFzeW5jKGN0eCwgZGVwdGgsIGN1cnJlbnQuYnVmZmVyKSxcbiAgKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcGFyc2VCaWdJbnRUeXBlZEFycmF5KFxuICBjdHg6IEFzeW5jUGFyc2VyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgaWQ6IG51bWJlcixcbiAgY3VycmVudDogQmlnSW50VHlwZWRBcnJheVZhbHVlLFxuKTogUHJvbWlzZTxTZXJvdmFsQmlnSW50VHlwZWRBcnJheU5vZGU+IHtcbiAgcmV0dXJuIGNyZWF0ZUJpZ0ludFR5cGVkQXJyYXlOb2RlKFxuICAgIGlkLFxuICAgIGN1cnJlbnQsXG4gICAgYXdhaXQgcGFyc2VBc3luYyhjdHgsIGRlcHRoLCBjdXJyZW50LmJ1ZmZlciksXG4gICk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHBhcnNlRGF0YVZpZXcoXG4gIGN0eDogQXN5bmNQYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiBEYXRhVmlldyxcbik6IFByb21pc2U8U2Vyb3ZhbERhdGFWaWV3Tm9kZT4ge1xuICByZXR1cm4gY3JlYXRlRGF0YVZpZXdOb2RlKFxuICAgIGlkLFxuICAgIGN1cnJlbnQsXG4gICAgYXdhaXQgcGFyc2VBc3luYyhjdHgsIGRlcHRoLCBjdXJyZW50LmJ1ZmZlciksXG4gICk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHBhcnNlRXJyb3IoXG4gIGN0eDogQXN5bmNQYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiBFcnJvcixcbik6IFByb21pc2U8U2Vyb3ZhbEVycm9yTm9kZT4ge1xuICBjb25zdCBvcHRpb25zID0gZ2V0RXJyb3JPcHRpb25zKGN1cnJlbnQsIGN0eC5iYXNlLmZlYXR1cmVzKTtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yTm9kZShcbiAgICBpZCxcbiAgICBjdXJyZW50LFxuICAgIG9wdGlvbnMgPyBhd2FpdCBwYXJzZVByb3BlcnRpZXMoY3R4LCBkZXB0aCwgb3B0aW9ucykgOiBOSUwsXG4gICk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHBhcnNlQWdncmVnYXRlRXJyb3IoXG4gIGN0eDogQXN5bmNQYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiBBZ2dyZWdhdGVFcnJvcixcbik6IFByb21pc2U8U2Vyb3ZhbEFnZ3JlZ2F0ZUVycm9yTm9kZT4ge1xuICBjb25zdCBvcHRpb25zID0gZ2V0RXJyb3JPcHRpb25zKGN1cnJlbnQsIGN0eC5iYXNlLmZlYXR1cmVzKTtcbiAgcmV0dXJuIGNyZWF0ZUFnZ3JlZ2F0ZUVycm9yTm9kZShcbiAgICBpZCxcbiAgICBjdXJyZW50LFxuICAgIG9wdGlvbnMgPyBhd2FpdCBwYXJzZVByb3BlcnRpZXMoY3R4LCBkZXB0aCwgb3B0aW9ucykgOiBOSUwsXG4gICk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHBhcnNlTWFwKFxuICBjdHg6IEFzeW5jUGFyc2VyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgaWQ6IG51bWJlcixcbiAgY3VycmVudDogTWFwPHVua25vd24sIHVua25vd24+LFxuKTogUHJvbWlzZTxTZXJvdmFsTWFwTm9kZT4ge1xuICBjb25zdCBrZXlOb2RlczogU2Vyb3ZhbE5vZGVbXSA9IFtdO1xuICBjb25zdCB2YWx1ZU5vZGVzOiBTZXJvdmFsTm9kZVtdID0gW107XG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGN1cnJlbnQuZW50cmllcygpKSB7XG4gICAga2V5Tm9kZXMucHVzaChhd2FpdCBwYXJzZUFzeW5jKGN0eCwgZGVwdGgsIGtleSkpO1xuICAgIHZhbHVlTm9kZXMucHVzaChhd2FpdCBwYXJzZUFzeW5jKGN0eCwgZGVwdGgsIHZhbHVlKSk7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZU1hcE5vZGUoY3R4LmJhc2UsIGlkLCBrZXlOb2RlcywgdmFsdWVOb2Rlcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHBhcnNlU2V0KFxuICBjdHg6IEFzeW5jUGFyc2VyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgaWQ6IG51bWJlcixcbiAgY3VycmVudDogU2V0PHVua25vd24+LFxuKTogUHJvbWlzZTxTZXJvdmFsU2V0Tm9kZT4ge1xuICBjb25zdCBpdGVtczogU2Vyb3ZhbE5vZGVbXSA9IFtdO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2YgY3VycmVudC5rZXlzKCkpIHtcbiAgICBpdGVtcy5wdXNoKGF3YWl0IHBhcnNlQXN5bmMoY3R4LCBkZXB0aCwgaXRlbSkpO1xuICB9XG4gIHJldHVybiBjcmVhdGVTZXROb2RlKGlkLCBpdGVtcyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHBhcnNlUGx1Z2luKFxuICBjdHg6IEFzeW5jUGFyc2VyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgaWQ6IG51bWJlcixcbiAgY3VycmVudDogdW5rbm93bixcbik6IFByb21pc2U8U2Vyb3ZhbFBsdWdpbk5vZGUgfCB1bmRlZmluZWQ+IHtcbiAgY29uc3QgY3VycmVudFBsdWdpbnMgPSBjdHguYmFzZS5wbHVnaW5zO1xuICBpZiAoY3VycmVudFBsdWdpbnMpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gY3VycmVudFBsdWdpbnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGN1cnJlbnRQbHVnaW5zW2ldO1xuICAgICAgaWYgKHBsdWdpbi5wYXJzZS5hc3luYyAmJiBwbHVnaW4udGVzdChjdXJyZW50KSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlUGx1Z2luTm9kZShcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBwbHVnaW4udGFnLFxuICAgICAgICAgIGF3YWl0IHBsdWdpbi5wYXJzZS5hc3luYyhcbiAgICAgICAgICAgIGN1cnJlbnQsXG4gICAgICAgICAgICBuZXcgQXN5bmNQYXJzZVBsdWdpbkNvbnRleHQoY3R4LCBkZXB0aCksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICApLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gTklMO1xufVxuXG5hc3luYyBmdW5jdGlvbiBwYXJzZVByb21pc2UoXG4gIGN0eDogQXN5bmNQYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiBQcm9taXNlPHVua25vd24+LFxuKTogUHJvbWlzZTxTZXJvdmFsUHJvbWlzZU5vZGU+IHtcbiAgY29uc3QgW3N0YXR1cywgcmVzdWx0XSA9IGF3YWl0IHByb21pc2VUb1Jlc3VsdChjdXJyZW50KTtcblxuICByZXR1cm4gY3JlYXRlU2Vyb3ZhbE5vZGUoXG4gICAgU2Vyb3ZhbE5vZGVUeXBlLlByb21pc2UsXG4gICAgaWQsXG4gICAgc3RhdHVzLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgYXdhaXQgcGFyc2VBc3luYyhjdHgsIGRlcHRoLCByZXN1bHQpLFxuICAgIE5JTCxcbiAgICBOSUwsXG4gICAgTklMLFxuICApO1xufVxuXG5mdW5jdGlvbiBwYXJzZVN0cmVhbUhhbmRsZTxUPihcbiAgdGhpczogQXN5bmNQYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiBTdHJlYW08VD4sXG4gIHJlc29sdmU6ICh2YWx1ZTogU2Vyb3ZhbE5vZGVbXSB8IFByb21pc2VMaWtlPFNlcm92YWxOb2RlW10+KSA9PiB2b2lkLFxuICByZWplY3Q6IChyZWFzb24/OiBhbnkpID0+IHZvaWQsXG4pOiB2b2lkIHtcbiAgY29uc3Qgc2VxdWVuY2U6IFNlcm92YWxOb2RlW10gPSBbXTtcbiAgLy8gVE9ETyBPcHRpbWl6YWJsZVxuICBjb25zdCBjbGVhbnVwID0gY3VycmVudC5vbih7XG4gICAgbmV4dDogdmFsdWUgPT4ge1xuICAgICAgbWFya1BhcnNlclJlZih0aGlzLmJhc2UsIGlkKTtcbiAgICAgIHBhcnNlQXN5bmModGhpcywgZGVwdGgsIHZhbHVlKS50aGVuKFxuICAgICAgICBkYXRhID0+IHtcbiAgICAgICAgICBzZXF1ZW5jZS5wdXNoKGNyZWF0ZVN0cmVhbU5leHROb2RlKGlkLCBkYXRhKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGRhdGEgPT4ge1xuICAgICAgICAgIHJlamVjdChkYXRhKTtcbiAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0sXG4gICAgdGhyb3c6IHZhbHVlID0+IHtcbiAgICAgIG1hcmtQYXJzZXJSZWYodGhpcy5iYXNlLCBpZCk7XG4gICAgICBwYXJzZUFzeW5jKHRoaXMsIGRlcHRoLCB2YWx1ZSkudGhlbihcbiAgICAgICAgZGF0YSA9PiB7XG4gICAgICAgICAgc2VxdWVuY2UucHVzaChjcmVhdGVTdHJlYW1UaHJvd05vZGUoaWQsIGRhdGEpKTtcbiAgICAgICAgICByZXNvbHZlKHNlcXVlbmNlKTtcbiAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGRhdGEgPT4ge1xuICAgICAgICAgIHJlamVjdChkYXRhKTtcbiAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0sXG4gICAgcmV0dXJuOiB2YWx1ZSA9PiB7XG4gICAgICBtYXJrUGFyc2VyUmVmKHRoaXMuYmFzZSwgaWQpO1xuICAgICAgcGFyc2VBc3luYyh0aGlzLCBkZXB0aCwgdmFsdWUpLnRoZW4oXG4gICAgICAgIGRhdGEgPT4ge1xuICAgICAgICAgIHNlcXVlbmNlLnB1c2goY3JlYXRlU3RyZWFtUmV0dXJuTm9kZShpZCwgZGF0YSkpO1xuICAgICAgICAgIHJlc29sdmUoc2VxdWVuY2UpO1xuICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YSA9PiB7XG4gICAgICAgICAgcmVqZWN0KGRhdGEpO1xuICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfSxcbiAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHBhcnNlU3RyZWFtKFxuICBjdHg6IEFzeW5jUGFyc2VyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgaWQ6IG51bWJlcixcbiAgY3VycmVudDogU3RyZWFtPHVua25vd24+LFxuKTogUHJvbWlzZTxTZXJvdmFsU3RyZWFtQ29uc3RydWN0b3JOb2RlPiB7XG4gIHJldHVybiBjcmVhdGVTdHJlYW1Db25zdHJ1Y3Rvck5vZGUoXG4gICAgaWQsXG4gICAgcGFyc2VTcGVjaWFsUmVmZXJlbmNlKGN0eC5iYXNlLCBTcGVjaWFsUmVmZXJlbmNlLlN0cmVhbUNvbnN0cnVjdG9yKSxcbiAgICBhd2FpdCBuZXcgUHJvbWlzZTxTZXJvdmFsTm9kZVtdPihcbiAgICAgIHBhcnNlU3RyZWFtSGFuZGxlLmJpbmQoY3R4LCBkZXB0aCwgaWQsIGN1cnJlbnQpLFxuICAgICksXG4gICk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHBhcnNlU2VxdWVuY2UoXG4gIGN0eDogQXN5bmNQYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiBTZXF1ZW5jZSxcbik6IFByb21pc2U8U2Vyb3ZhbFNlcXVlbmNlTm9kZT4ge1xuICBjb25zdCBub2RlczogU2Vyb3ZhbE5vZGVbXSA9IFtdO1xuICBmb3IgKGxldCBpID0gMCwgbGVuID0gY3VycmVudC52Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgbm9kZXNbaV0gPSBhd2FpdCBwYXJzZUFzeW5jKGN0eCwgZGVwdGgsIGN1cnJlbnQudltpXSk7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZVNlcXVlbmNlTm9kZShpZCwgbm9kZXMsIGN1cnJlbnQudCwgY3VycmVudC5kKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBhcnNlT2JqZWN0QXN5bmMoXG4gIGN0eDogQXN5bmNQYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiBvYmplY3QsXG4pOiBQcm9taXNlPFNlcm92YWxOb2RlPiB7XG4gIGlmIChBcnJheS5pc0FycmF5KGN1cnJlbnQpKSB7XG4gICAgcmV0dXJuIHBhcnNlQXJyYXkoY3R4LCBkZXB0aCwgaWQsIGN1cnJlbnQpO1xuICB9XG4gIGlmIChpc1N0cmVhbShjdXJyZW50KSkge1xuICAgIHJldHVybiBwYXJzZVN0cmVhbShjdHgsIGRlcHRoLCBpZCwgY3VycmVudCk7XG4gIH1cbiAgaWYgKGlzU2VxdWVuY2UoY3VycmVudCkpIHtcbiAgICByZXR1cm4gcGFyc2VTZXF1ZW5jZShjdHgsIGRlcHRoLCBpZCwgY3VycmVudCk7XG4gIH1cbiAgY29uc3QgY3VycmVudENsYXNzID0gY3VycmVudC5jb25zdHJ1Y3RvcjtcbiAgaWYgKGN1cnJlbnRDbGFzcyA9PT0gT3BhcXVlUmVmZXJlbmNlKSB7XG4gICAgcmV0dXJuIHBhcnNlQXN5bmMoXG4gICAgICBjdHgsXG4gICAgICBkZXB0aCxcbiAgICAgIChjdXJyZW50IGFzIE9wYXF1ZVJlZmVyZW5jZTx1bmtub3duLCB1bmtub3duPikucmVwbGFjZW1lbnQsXG4gICAgKTtcbiAgfVxuICBjb25zdCBwYXJzZWQgPSBhd2FpdCBwYXJzZVBsdWdpbihjdHgsIGRlcHRoLCBpZCwgY3VycmVudCk7XG4gIGlmIChwYXJzZWQpIHtcbiAgICByZXR1cm4gcGFyc2VkO1xuICB9XG4gIHN3aXRjaCAoY3VycmVudENsYXNzKSB7XG4gICAgY2FzZSBPYmplY3Q6XG4gICAgICByZXR1cm4gcGFyc2VQbGFpbk9iamVjdChcbiAgICAgICAgY3R4LFxuICAgICAgICBkZXB0aCxcbiAgICAgICAgaWQsXG4gICAgICAgIGN1cnJlbnQgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gICAgICAgIGZhbHNlLFxuICAgICAgKTtcbiAgICBjYXNlIE5JTDpcbiAgICAgIHJldHVybiBwYXJzZVBsYWluT2JqZWN0KFxuICAgICAgICBjdHgsXG4gICAgICAgIGRlcHRoLFxuICAgICAgICBpZCxcbiAgICAgICAgY3VycmVudCBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbiAgICAgICAgdHJ1ZSxcbiAgICAgICk7XG4gICAgY2FzZSBEYXRlOlxuICAgICAgcmV0dXJuIGNyZWF0ZURhdGVOb2RlKGlkLCBjdXJyZW50IGFzIHVua25vd24gYXMgRGF0ZSk7XG4gICAgY2FzZSBFcnJvcjpcbiAgICBjYXNlIEV2YWxFcnJvcjpcbiAgICBjYXNlIFJhbmdlRXJyb3I6XG4gICAgY2FzZSBSZWZlcmVuY2VFcnJvcjpcbiAgICBjYXNlIFN5bnRheEVycm9yOlxuICAgIGNhc2UgVHlwZUVycm9yOlxuICAgIGNhc2UgVVJJRXJyb3I6XG4gICAgICByZXR1cm4gcGFyc2VFcnJvcihjdHgsIGRlcHRoLCBpZCwgY3VycmVudCBhcyB1bmtub3duIGFzIEVycm9yKTtcbiAgICBjYXNlIE51bWJlcjpcbiAgICBjYXNlIEJvb2xlYW46XG4gICAgY2FzZSBTdHJpbmc6XG4gICAgY2FzZSBCaWdJbnQ6XG4gICAgICByZXR1cm4gcGFyc2VCb3hlZChjdHgsIGRlcHRoLCBpZCwgY3VycmVudCk7XG4gICAgY2FzZSBBcnJheUJ1ZmZlcjpcbiAgICAgIHJldHVybiBjcmVhdGVBcnJheUJ1ZmZlck5vZGUoXG4gICAgICAgIGN0eC5iYXNlLFxuICAgICAgICBpZCxcbiAgICAgICAgY3VycmVudCBhcyB1bmtub3duIGFzIEFycmF5QnVmZmVyLFxuICAgICAgKTtcbiAgICBjYXNlIEludDhBcnJheTpcbiAgICBjYXNlIEludDE2QXJyYXk6XG4gICAgY2FzZSBJbnQzMkFycmF5OlxuICAgIGNhc2UgVWludDhBcnJheTpcbiAgICBjYXNlIFVpbnQxNkFycmF5OlxuICAgIGNhc2UgVWludDMyQXJyYXk6XG4gICAgY2FzZSBVaW50OENsYW1wZWRBcnJheTpcbiAgICBjYXNlIEZsb2F0MzJBcnJheTpcbiAgICBjYXNlIEZsb2F0NjRBcnJheTpcbiAgICAgIHJldHVybiBwYXJzZVR5cGVkQXJyYXkoXG4gICAgICAgIGN0eCxcbiAgICAgICAgZGVwdGgsXG4gICAgICAgIGlkLFxuICAgICAgICBjdXJyZW50IGFzIHVua25vd24gYXMgVHlwZWRBcnJheVZhbHVlLFxuICAgICAgKTtcbiAgICBjYXNlIERhdGFWaWV3OlxuICAgICAgcmV0dXJuIHBhcnNlRGF0YVZpZXcoY3R4LCBkZXB0aCwgaWQsIGN1cnJlbnQgYXMgdW5rbm93biBhcyBEYXRhVmlldyk7XG4gICAgY2FzZSBNYXA6XG4gICAgICByZXR1cm4gcGFyc2VNYXAoXG4gICAgICAgIGN0eCxcbiAgICAgICAgZGVwdGgsXG4gICAgICAgIGlkLFxuICAgICAgICBjdXJyZW50IGFzIHVua25vd24gYXMgTWFwPHVua25vd24sIHVua25vd24+LFxuICAgICAgKTtcbiAgICBjYXNlIFNldDpcbiAgICAgIHJldHVybiBwYXJzZVNldChjdHgsIGRlcHRoLCBpZCwgY3VycmVudCBhcyB1bmtub3duIGFzIFNldDx1bmtub3duPik7XG4gICAgZGVmYXVsdDpcbiAgICAgIGJyZWFrO1xuICB9XG4gIC8vIFByb21pc2VzXG4gIGlmIChjdXJyZW50Q2xhc3MgPT09IFByb21pc2UgfHwgY3VycmVudCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICByZXR1cm4gcGFyc2VQcm9taXNlKGN0eCwgZGVwdGgsIGlkLCBjdXJyZW50IGFzIHVua25vd24gYXMgUHJvbWlzZTx1bmtub3duPik7XG4gIH1cbiAgY29uc3QgY3VycmVudEZlYXR1cmVzID0gY3R4LmJhc2UuZmVhdHVyZXM7XG4gIGlmIChjdXJyZW50RmVhdHVyZXMgJiBGZWF0dXJlLlJlZ0V4cCAmJiBjdXJyZW50Q2xhc3MgPT09IFJlZ0V4cCkge1xuICAgIHJldHVybiBjcmVhdGVSZWdFeHBOb2RlKGlkLCBjdXJyZW50IGFzIHVua25vd24gYXMgUmVnRXhwKTtcbiAgfVxuICAvLyBCaWdJbnQgVHlwZWQgQXJyYXlzXG4gIGlmIChjdXJyZW50RmVhdHVyZXMgJiBGZWF0dXJlLkJpZ0ludFR5cGVkQXJyYXkpIHtcbiAgICBzd2l0Y2ggKGN1cnJlbnRDbGFzcykge1xuICAgICAgY2FzZSBCaWdJbnQ2NEFycmF5OlxuICAgICAgY2FzZSBCaWdVaW50NjRBcnJheTpcbiAgICAgICAgcmV0dXJuIHBhcnNlQmlnSW50VHlwZWRBcnJheShcbiAgICAgICAgICBjdHgsXG4gICAgICAgICAgZGVwdGgsXG4gICAgICAgICAgaWQsXG4gICAgICAgICAgY3VycmVudCBhcyB1bmtub3duIGFzIEJpZ0ludFR5cGVkQXJyYXlWYWx1ZSxcbiAgICAgICAgKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBpZiAoXG4gICAgY3VycmVudEZlYXR1cmVzICYgRmVhdHVyZS5BZ2dyZWdhdGVFcnJvciAmJlxuICAgIHR5cGVvZiBBZ2dyZWdhdGVFcnJvciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAoY3VycmVudENsYXNzID09PSBBZ2dyZWdhdGVFcnJvciB8fCBjdXJyZW50IGluc3RhbmNlb2YgQWdncmVnYXRlRXJyb3IpXG4gICkge1xuICAgIHJldHVybiBwYXJzZUFnZ3JlZ2F0ZUVycm9yKFxuICAgICAgY3R4LFxuICAgICAgZGVwdGgsXG4gICAgICBpZCxcbiAgICAgIGN1cnJlbnQgYXMgdW5rbm93biBhcyBBZ2dyZWdhdGVFcnJvcixcbiAgICApO1xuICB9XG4gIC8vIFNsb3cgcGF0aC4gV2Ugb25seSBuZWVkIHRvIGhhbmRsZSBFcnJvcnMgYW5kIEl0ZXJhdG9yc1xuICAvLyBzaW5jZSB0aGV5IGhhdmUgdmVyeSBicm9hZCBpbXBsZW1lbnRhdGlvbnMuXG4gIGlmIChjdXJyZW50IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICByZXR1cm4gcGFyc2VFcnJvcihjdHgsIGRlcHRoLCBpZCwgY3VycmVudCk7XG4gIH1cbiAgLy8gR2VuZXJhdG9yIGZ1bmN0aW9ucyBkb24ndCBoYXZlIGEgZ2xvYmFsIGNvbnN0cnVjdG9yXG4gIC8vIGRlc3BpdGUgZXhpc3RpbmdcbiAgaWYgKFNZTV9JVEVSQVRPUiBpbiBjdXJyZW50IHx8IFNZTV9BU1lOQ19JVEVSQVRPUiBpbiBjdXJyZW50KSB7XG4gICAgcmV0dXJuIHBhcnNlUGxhaW5PYmplY3QoY3R4LCBkZXB0aCwgaWQsIGN1cnJlbnQsICEhY3VycmVudENsYXNzKTtcbiAgfVxuICB0aHJvdyBuZXcgU2Vyb3ZhbFVuc3VwcG9ydGVkVHlwZUVycm9yKGN1cnJlbnQpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcGFyc2VGdW5jdGlvbkFzeW5jKFxuICBjdHg6IEFzeW5jUGFyc2VyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgY3VycmVudDogdW5rbm93bixcbik6IFByb21pc2U8U2Vyb3ZhbE5vZGU+IHtcbiAgY29uc3QgcmVmID0gZ2V0UmVmZXJlbmNlTm9kZShjdHguYmFzZSwgY3VycmVudCk7XG4gIGlmIChyZWYudHlwZSAhPT0gUGFyc2VyTm9kZVR5cGUuRnJlc2gpIHtcbiAgICByZXR1cm4gcmVmLnZhbHVlO1xuICB9XG4gIGNvbnN0IHBsdWdpbiA9IGF3YWl0IHBhcnNlUGx1Z2luKGN0eCwgZGVwdGgsIHJlZi52YWx1ZSwgY3VycmVudCk7XG4gIGlmIChwbHVnaW4pIHtcbiAgICByZXR1cm4gcGx1Z2luO1xuICB9XG4gIHRocm93IG5ldyBTZXJvdmFsVW5zdXBwb3J0ZWRUeXBlRXJyb3IoY3VycmVudCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwYXJzZUFzeW5jPFQ+KFxuICBjdHg6IEFzeW5jUGFyc2VyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgY3VycmVudDogVCxcbik6IFByb21pc2U8U2Vyb3ZhbE5vZGU+IHtcbiAgc3dpdGNoICh0eXBlb2YgY3VycmVudCkge1xuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgcmV0dXJuIGN1cnJlbnQgPyBUUlVFX05PREUgOiBGQUxTRV9OT0RFO1xuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICByZXR1cm4gVU5ERUZJTkVEX05PREU7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiBjcmVhdGVTdHJpbmdOb2RlKGN1cnJlbnQgYXMgc3RyaW5nKTtcbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIGNyZWF0ZU51bWJlck5vZGUoY3VycmVudCBhcyBudW1iZXIpO1xuICAgIGNhc2UgJ2JpZ2ludCc6XG4gICAgICByZXR1cm4gY3JlYXRlQmlnSW50Tm9kZShjdXJyZW50IGFzIGJpZ2ludCk7XG4gICAgY2FzZSAnb2JqZWN0Jzoge1xuICAgICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgICAgY29uc3QgcmVmID0gZ2V0UmVmZXJlbmNlTm9kZShjdHguYmFzZSwgY3VycmVudCk7XG4gICAgICAgIHJldHVybiByZWYudHlwZSA9PT0gMFxuICAgICAgICAgID8gYXdhaXQgcGFyc2VPYmplY3RBc3luYyhjdHgsIGRlcHRoICsgMSwgcmVmLnZhbHVlLCBjdXJyZW50IGFzIG9iamVjdClcbiAgICAgICAgICA6IHJlZi52YWx1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBOVUxMX05PREU7XG4gICAgfVxuICAgIGNhc2UgJ3N5bWJvbCc6XG4gICAgICByZXR1cm4gcGFyc2VXZWxsS25vd25TeW1ib2woY3R4LmJhc2UsIGN1cnJlbnQpO1xuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgIHJldHVybiBwYXJzZUZ1bmN0aW9uQXN5bmMoY3R4LCBkZXB0aCwgY3VycmVudCk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBTZXJvdmFsVW5zdXBwb3J0ZWRUeXBlRXJyb3IoY3VycmVudCk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBhcnNlVG9wQXN5bmM8VD4oXG4gIGN0eDogQXN5bmNQYXJzZXJDb250ZXh0LFxuICBjdXJyZW50OiBULFxuKTogUHJvbWlzZTxTZXJvdmFsTm9kZT4ge1xuICB0cnkge1xuICAgIHJldHVybiBhd2FpdCBwYXJzZUFzeW5jKGN0eCwgMCwgY3VycmVudCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgZXJyb3IgaW5zdGFuY2VvZiBTZXJvdmFsUGFyc2VyRXJyb3JcbiAgICAgID8gZXJyb3JcbiAgICAgIDogbmV3IFNlcm92YWxQYXJzZXJFcnJvcihlcnJvcik7XG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgQXN5bmNQYXJzZVBsdWdpbkNvbnRleHQgfSBmcm9tICcuL2NvbnRleHQvYXN5bmMtcGFyc2VyJztcbmltcG9ydCB0eXBlIHsgRGVzZXJpYWxpemVQbHVnaW5Db250ZXh0IH0gZnJvbSAnLi9jb250ZXh0L2Rlc2VyaWFsaXplcic7XG5pbXBvcnQgdHlwZSB7IFNlcmlhbGl6ZVBsdWdpbkNvbnRleHQgfSBmcm9tICcuL2NvbnRleHQvc2VyaWFsaXplcic7XG5pbXBvcnQgdHlwZSB7XG4gIFN0cmVhbVBhcnNlUGx1Z2luQ29udGV4dCxcbiAgU3luY1BhcnNlUGx1Z2luQ29udGV4dCxcbn0gZnJvbSAnLi9jb250ZXh0L3N5bmMtcGFyc2VyJztcbmltcG9ydCB0eXBlIHsgU2Vyb3ZhbE5vZGUgfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IGVudW0gU2Vyb3ZhbE1vZGUge1xuICBWYW5pbGxhID0gMSxcbiAgQ3Jvc3MgPSAyLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBsdWdpbkRhdGEge1xuICBpZDogbnVtYmVyO1xufVxuXG5leHBvcnQgdHlwZSBQbHVnaW5JbmZvID0ge1xuICBba2V5OiBzdHJpbmddOiBTZXJvdmFsTm9kZTtcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGx1Z2luPFZhbHVlLCBJbmZvIGV4dGVuZHMgUGx1Z2luSW5mbz4ge1xuICAvKipcbiAgICogQSB1bmlxdWUgc3RyaW5nIHRoYXQgaGVscHMgaWRlbmZpdHkgdGhlIHBsdWdpblxuICAgKi9cbiAgdGFnOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBMaXN0IG9mIGRlcGVuZGVuY3kgcGx1Z2luc1xuICAgKi9cbiAgZXh0ZW5kcz86IFBsdWdpbjxhbnksIGFueT5bXTtcbiAgLyoqXG4gICAqIE1ldGhvZCB0byB0ZXN0IGlmIGEgdmFsdWUgaXMgYW4gZXhwZWN0ZWQgdmFsdWUgb2YgdGhlIHBsdWdpblxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICovXG4gIHRlc3QodmFsdWU6IHVua25vd24pOiBib29sZWFuO1xuICAvKipcbiAgICogUGFyc2luZyBtb2Rlc1xuICAgKi9cbiAgcGFyc2U6IHtcbiAgICBzeW5jPzogKFxuICAgICAgdmFsdWU6IFZhbHVlLFxuICAgICAgY3R4OiBTeW5jUGFyc2VQbHVnaW5Db250ZXh0LFxuICAgICAgZGF0YTogUGx1Z2luRGF0YSxcbiAgICApID0+IEluZm87XG4gICAgYXN5bmM/OiAoXG4gICAgICB2YWx1ZTogVmFsdWUsXG4gICAgICBjdHg6IEFzeW5jUGFyc2VQbHVnaW5Db250ZXh0LFxuICAgICAgZGF0YTogUGx1Z2luRGF0YSxcbiAgICApID0+IFByb21pc2U8SW5mbz47XG4gICAgc3RyZWFtPzogKFxuICAgICAgdmFsdWU6IFZhbHVlLFxuICAgICAgY3R4OiBTdHJlYW1QYXJzZVBsdWdpbkNvbnRleHQsXG4gICAgICBkYXRhOiBQbHVnaW5EYXRhLFxuICAgICkgPT4gSW5mbztcbiAgfTtcbiAgLyoqXG4gICAqIENvbnZlcnQgdGhlIHBhcnNlZCBub2RlIGludG8gYSBKUyBzdHJpbmdcbiAgICovXG4gIHNlcmlhbGl6ZShub2RlOiBJbmZvLCBjdHg6IFNlcmlhbGl6ZVBsdWdpbkNvbnRleHQsIGRhdGE6IFBsdWdpbkRhdGEpOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBDb252ZXJ0IHRoZSBwYXJzZWQgbm9kZSBpbnRvIGl0cyBydW50aW1lIGVxdWl2YWxlbnQuXG4gICAqL1xuICBkZXNlcmlhbGl6ZShcbiAgICBub2RlOiBJbmZvLFxuICAgIGN0eDogRGVzZXJpYWxpemVQbHVnaW5Db250ZXh0LFxuICAgIGRhdGE6IFBsdWdpbkRhdGEsXG4gICk6IFZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUGx1Z2luPFZhbHVlLCBJbmZvIGV4dGVuZHMgUGx1Z2luSW5mbz4oXG4gIHBsdWdpbjogUGx1Z2luPFZhbHVlLCBJbmZvPixcbik6IFBsdWdpbjxWYWx1ZSwgSW5mbz4ge1xuICByZXR1cm4gcGx1Z2luO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBsdWdpbkFjY2Vzc09wdGlvbnMge1xuICBwbHVnaW5zPzogUGx1Z2luPGFueSwgYW55PltdO1xufVxuXG5mdW5jdGlvbiBkZWR1cGVQbHVnaW5zKFxuICBkZWR1cGVkOiBTZXQ8UGx1Z2luPGFueSwgYW55Pj4sXG4gIHBsdWdpbnM6IFBsdWdpbjxhbnksIGFueT5bXSxcbik6IHZvaWQge1xuICBmb3IgKGxldCBpID0gMCwgbGVuID0gcGx1Z2lucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGNvbnN0IGN1cnJlbnQgPSBwbHVnaW5zW2ldO1xuICAgIGlmICghZGVkdXBlZC5oYXMoY3VycmVudCkpIHtcbiAgICAgIGRlZHVwZWQuYWRkKGN1cnJlbnQpO1xuICAgICAgaWYgKGN1cnJlbnQuZXh0ZW5kcykge1xuICAgICAgICBkZWR1cGVQbHVnaW5zKGRlZHVwZWQsIGN1cnJlbnQuZXh0ZW5kcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlUGx1Z2lucyhcbiAgcGx1Z2lucz86IFBsdWdpbjxhbnksIGFueT5bXSxcbik6IFBsdWdpbjxhbnksIGFueT5bXSB8IHVuZGVmaW5lZCB7XG4gIGlmIChwbHVnaW5zKSB7XG4gICAgY29uc3QgZGVkdXBlZCA9IG5ldyBTZXQ8UGx1Z2luPGFueSwgYW55Pj4oKTtcbiAgICBkZWR1cGVQbHVnaW5zKGRlZHVwZWQsIHBsdWdpbnMpO1xuICAgIHJldHVybiBbLi4uZGVkdXBlZF07XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbiIsImltcG9ydCB7IFNlcm92YWxVbmtub3duVHlwZWRBcnJheUVycm9yIH0gZnJvbSAnLi4vZXJyb3JzJztcblxudHlwZSBUeXBlZEFycmF5Q29uc3RydWN0b3IgPVxuICB8IEludDhBcnJheUNvbnN0cnVjdG9yXG4gIHwgSW50MTZBcnJheUNvbnN0cnVjdG9yXG4gIHwgSW50MzJBcnJheUNvbnN0cnVjdG9yXG4gIHwgVWludDhBcnJheUNvbnN0cnVjdG9yXG4gIHwgVWludDE2QXJyYXlDb25zdHJ1Y3RvclxuICB8IFVpbnQzMkFycmF5Q29uc3RydWN0b3JcbiAgfCBVaW50OENsYW1wZWRBcnJheUNvbnN0cnVjdG9yXG4gIHwgRmxvYXQzMkFycmF5Q29uc3RydWN0b3JcbiAgfCBGbG9hdDY0QXJyYXlDb25zdHJ1Y3RvclxuICB8IEJpZ0ludDY0QXJyYXlDb25zdHJ1Y3RvclxuICB8IEJpZ1VpbnQ2NEFycmF5Q29uc3RydWN0b3I7XG5cbmV4cG9ydCB0eXBlIFR5cGVkQXJyYXlWYWx1ZSA9XG4gIHwgSW50OEFycmF5XG4gIHwgSW50MTZBcnJheVxuICB8IEludDMyQXJyYXlcbiAgfCBVaW50OEFycmF5XG4gIHwgVWludDE2QXJyYXlcbiAgfCBVaW50MzJBcnJheVxuICB8IFVpbnQ4Q2xhbXBlZEFycmF5XG4gIHwgRmxvYXQzMkFycmF5XG4gIHwgRmxvYXQ2NEFycmF5O1xuXG5leHBvcnQgdHlwZSBCaWdJbnRUeXBlZEFycmF5VmFsdWUgPSBCaWdJbnQ2NEFycmF5IHwgQmlnVWludDY0QXJyYXk7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUeXBlZEFycmF5Q29uc3RydWN0b3IobmFtZTogc3RyaW5nKTogVHlwZWRBcnJheUNvbnN0cnVjdG9yIHtcbiAgc3dpdGNoIChuYW1lKSB7XG4gICAgY2FzZSAnSW50OEFycmF5JzpcbiAgICAgIHJldHVybiBJbnQ4QXJyYXk7XG4gICAgY2FzZSAnSW50MTZBcnJheSc6XG4gICAgICByZXR1cm4gSW50MTZBcnJheTtcbiAgICBjYXNlICdJbnQzMkFycmF5JzpcbiAgICAgIHJldHVybiBJbnQzMkFycmF5O1xuICAgIGNhc2UgJ1VpbnQ4QXJyYXknOlxuICAgICAgcmV0dXJuIFVpbnQ4QXJyYXk7XG4gICAgY2FzZSAnVWludDE2QXJyYXknOlxuICAgICAgcmV0dXJuIFVpbnQxNkFycmF5O1xuICAgIGNhc2UgJ1VpbnQzMkFycmF5JzpcbiAgICAgIHJldHVybiBVaW50MzJBcnJheTtcbiAgICBjYXNlICdVaW50OENsYW1wZWRBcnJheSc6XG4gICAgICByZXR1cm4gVWludDhDbGFtcGVkQXJyYXk7XG4gICAgY2FzZSAnRmxvYXQzMkFycmF5JzpcbiAgICAgIHJldHVybiBGbG9hdDMyQXJyYXk7XG4gICAgY2FzZSAnRmxvYXQ2NEFycmF5JzpcbiAgICAgIHJldHVybiBGbG9hdDY0QXJyYXk7XG4gICAgY2FzZSAnQmlnSW50NjRBcnJheSc6XG4gICAgICByZXR1cm4gQmlnSW50NjRBcnJheTtcbiAgICBjYXNlICdCaWdVaW50NjRBcnJheSc6XG4gICAgICByZXR1cm4gQmlnVWludDY0QXJyYXk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBTZXJvdmFsVW5rbm93blR5cGVkQXJyYXlFcnJvcihuYW1lKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQUxMX0VOQUJMRUQsIEZlYXR1cmUgfSBmcm9tICcuLi9jb21wYXQnO1xuaW1wb3J0IHtcbiAgQ09OU1RBTlRfVkFMLFxuICBFUlJPUl9DT05TVFJVQ1RPUixcbiAgTklMLFxuICBTZXJvdmFsTm9kZVR5cGUsXG4gIFNlcm92YWxPYmplY3RGbGFncyxcbiAgU1lNQk9MX1JFRixcbn0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCB7XG4gIEFSUkFZX0JVRkZFUl9DT05TVFJVQ1RPUixcbiAgUFJPTUlTRV9DT05TVFJVQ1RPUixcbiAgdHlwZSBQcm9taXNlQ29uc3RydWN0b3JSZXNvbHZlcixcbn0gZnJvbSAnLi4vY29uc3RydWN0b3JzJztcbmltcG9ydCB7XG4gIFNlcm92YWxEZXB0aExpbWl0RXJyb3IsXG4gIFNlcm92YWxEZXNlcmlhbGl6YXRpb25FcnJvcixcbiAgU2Vyb3ZhbE1hbGZvcm1lZE5vZGVFcnJvcixcbiAgU2Vyb3ZhbE1pc3NpbmdJbnN0YW5jZUVycm9yLFxuICBTZXJvdmFsTWlzc2luZ1BsdWdpbkVycm9yLFxuICBTZXJvdmFsVW5zdXBwb3J0ZWROb2RlRXJyb3IsXG59IGZyb20gJy4uL2Vycm9ycyc7XG5pbXBvcnQgdHlwZSB7IFBsdWdpbkFjY2Vzc09wdGlvbnMgfSBmcm9tICcuLi9wbHVnaW4nO1xuaW1wb3J0IHsgU2Vyb3ZhbE1vZGUgfSBmcm9tICcuLi9wbHVnaW4nO1xuaW1wb3J0IHsgZ2V0UmVmZXJlbmNlIH0gZnJvbSAnLi4vcmVmZXJlbmNlJztcbmltcG9ydCB7IGNyZWF0ZVNlcXVlbmNlLCB0eXBlIFNlcXVlbmNlLCBzZXF1ZW5jZVRvSXRlcmF0b3IgfSBmcm9tICcuLi9zZXF1ZW5jZSc7XG5pbXBvcnQgdHlwZSB7IFN0cmVhbSB9IGZyb20gJy4uL3N0cmVhbSc7XG5pbXBvcnQgeyBjcmVhdGVTdHJlYW0sIHN0cmVhbVRvQXN5bmNJdGVyYWJsZSB9IGZyb20gJy4uL3N0cmVhbSc7XG5pbXBvcnQgeyBkZXNlcmlhbGl6ZVN0cmluZyB9IGZyb20gJy4uL3N0cmluZyc7XG5pbXBvcnQge1xuICBTWU1fQVNZTkNfSVRFUkFUT1IsXG4gIFNZTV9JU19DT05DQVRfU1BSRUFEQUJMRSxcbiAgU1lNX0lURVJBVE9SLFxuICBTWU1fVE9fU1RSSU5HX1RBRyxcbn0gZnJvbSAnLi4vc3ltYm9scyc7XG5pbXBvcnQgdHlwZSB7XG4gIFNlcm92YWxBZ2dyZWdhdGVFcnJvck5vZGUsXG4gIFNlcm92YWxBcnJheUJ1ZmZlck5vZGUsXG4gIFNlcm92YWxBcnJheU5vZGUsXG4gIFNlcm92YWxBc3luY0l0ZXJhdG9yRmFjdG9yeUluc3RhbmNlTm9kZSxcbiAgU2Vyb3ZhbEFzeW5jSXRlcmF0b3JGYWN0b3J5Tm9kZSxcbiAgU2Vyb3ZhbEJpZ0ludFR5cGVkQXJyYXlOb2RlLFxuICBTZXJvdmFsQm94ZWROb2RlLFxuICBTZXJvdmFsRGF0YVZpZXdOb2RlLFxuICBTZXJvdmFsRGF0ZU5vZGUsXG4gIFNlcm92YWxFcnJvck5vZGUsXG4gIFNlcm92YWxJdGVyYXRvckZhY3RvcnlJbnN0YW5jZU5vZGUsXG4gIFNlcm92YWxJdGVyYXRvckZhY3RvcnlOb2RlLFxuICBTZXJvdmFsTWFwTm9kZSxcbiAgU2Vyb3ZhbE5vZGUsXG4gIFNlcm92YWxOdWxsQ29uc3RydWN0b3JOb2RlLFxuICBTZXJvdmFsT2JqZWN0Tm9kZSxcbiAgU2Vyb3ZhbE9iamVjdFJlY29yZE5vZGUsXG4gIFNlcm92YWxQbHVnaW5Ob2RlLFxuICBTZXJvdmFsUHJvbWlzZUNvbnN0cnVjdG9yTm9kZSxcbiAgU2Vyb3ZhbFByb21pc2VOb2RlLFxuICBTZXJvdmFsUHJvbWlzZVJlamVjdE5vZGUsXG4gIFNlcm92YWxQcm9taXNlUmVzb2x2ZU5vZGUsXG4gIFNlcm92YWxSZWZlcmVuY2VOb2RlLFxuICBTZXJvdmFsUmVnRXhwTm9kZSxcbiAgU2Vyb3ZhbFNlcXVlbmNlTm9kZSxcbiAgU2Vyb3ZhbFNldE5vZGUsXG4gIFNlcm92YWxTdHJlYW1Db25zdHJ1Y3Rvck5vZGUsXG4gIFNlcm92YWxTdHJlYW1OZXh0Tm9kZSxcbiAgU2Vyb3ZhbFN0cmVhbVJldHVybk5vZGUsXG4gIFNlcm92YWxTdHJlYW1UaHJvd05vZGUsXG4gIFNlcm92YWxUeXBlZEFycmF5Tm9kZSxcbn0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHR5cGUge1xuICBCaWdJbnRUeXBlZEFycmF5VmFsdWUsXG4gIFR5cGVkQXJyYXlWYWx1ZSxcbn0gZnJvbSAnLi4vdXRpbHMvdHlwZWQtYXJyYXknO1xuaW1wb3J0IHsgZ2V0VHlwZWRBcnJheUNvbnN0cnVjdG9yIH0gZnJvbSAnLi4vdXRpbHMvdHlwZWQtYXJyYXknO1xuXG5jb25zdCBNQVhfQkFTRTY0X0xFTkdUSCA9IDFfMDAwXzAwMDsgLy8gfjAuNzVNQiBkZWNvZGVkXG5jb25zdCBNQVhfQklHSU5UX0xFTkdUSCA9IDEwXzAwMDtcbmNvbnN0IE1BWF9SRUdFWFBfU09VUkNFX0xFTkdUSCA9IDIwXzAwMDtcblxuZnVuY3Rpb24gYXBwbHlPYmplY3RGbGFnKG9iajogdW5rbm93biwgZmxhZzogU2Vyb3ZhbE9iamVjdEZsYWdzKTogdW5rbm93biB7XG4gIHN3aXRjaCAoZmxhZykge1xuICAgIGNhc2UgU2Vyb3ZhbE9iamVjdEZsYWdzLkZyb3plbjpcbiAgICAgIHJldHVybiBPYmplY3QuZnJlZXplKG9iaik7XG4gICAgY2FzZSBTZXJvdmFsT2JqZWN0RmxhZ3MuTm9uRXh0ZW5zaWJsZTpcbiAgICAgIHJldHVybiBPYmplY3QucHJldmVudEV4dGVuc2lvbnMob2JqKTtcbiAgICBjYXNlIFNlcm92YWxPYmplY3RGbGFncy5TZWFsZWQ6XG4gICAgICByZXR1cm4gT2JqZWN0LnNlYWwob2JqKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG9iajtcbiAgfVxufVxuXG50eXBlIEFzc2lnbmFibGVWYWx1ZSA9IEFnZ3JlZ2F0ZUVycm9yIHwgRXJyb3IgfCBJdGVyYWJsZTx1bmtub3duPjtcbnR5cGUgQXNzaWduYWJsZU5vZGUgPSBTZXJvdmFsQWdncmVnYXRlRXJyb3JOb2RlIHwgU2Vyb3ZhbEVycm9yTm9kZTtcblxuZXhwb3J0IGludGVyZmFjZSBCYXNlRGVzZXJpYWxpemVyQ29udGV4dE9wdGlvbnMgZXh0ZW5kcyBQbHVnaW5BY2Nlc3NPcHRpb25zIHtcbiAgcmVmcz86IE1hcDxudW1iZXIsIHVua25vd24+O1xuICBmZWF0dXJlcz86IG51bWJlcjtcbiAgZGlzYWJsZWRGZWF0dXJlcz86IG51bWJlcjtcbiAgZGVwdGhMaW1pdD86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCYXNlRGVzZXJpYWxpemVyQ29udGV4dCBleHRlbmRzIFBsdWdpbkFjY2Vzc09wdGlvbnMge1xuICByZWFkb25seSBtb2RlOiBTZXJvdmFsTW9kZTtcbiAgLyoqXG4gICAqIE1hcHBpbmcgaWRzIHRvIHZhbHVlc1xuICAgKi9cbiAgcmVmczogTWFwPG51bWJlciwgdW5rbm93bj4gJiB7IHR5cGVzOiBNYXA8bnVtYmVyLCBTZXJvdmFsTm9kZVR5cGU+IH07XG4gIGZlYXR1cmVzOiBudW1iZXI7XG4gIGRlcHRoTGltaXQ6IG51bWJlcjtcbn1cblxuY29uc3QgREVGQVVMVF9ERVBUSF9MSU1JVCA9IDEwMDA7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVCYXNlRGVzZXJpYWxpemVyQ29udGV4dChcbiAgbW9kZTogU2Vyb3ZhbE1vZGUsXG4gIG9wdGlvbnM6IEJhc2VEZXNlcmlhbGl6ZXJDb250ZXh0T3B0aW9ucyxcbik6IEJhc2VEZXNlcmlhbGl6ZXJDb250ZXh0IHtcbiAgY29uc3QgcmVmcyA9IG9wdGlvbnMucmVmcyB8fCBuZXcgTWFwKCk7XG4gIGlmICghKCd0eXBlcycgaW4gcmVmcykpIHtcbiAgICBPYmplY3QuYXNzaWduKHJlZnMsIHtcbiAgICAgIHR5cGVzOiBuZXcgTWFwKCksXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBtb2RlLFxuICAgIHBsdWdpbnM6IG9wdGlvbnMucGx1Z2lucyxcbiAgICByZWZzOiByZWZzIGFzIEJhc2VEZXNlcmlhbGl6ZXJDb250ZXh0WydyZWZzJ10sXG4gICAgZmVhdHVyZXM6IG9wdGlvbnMuZmVhdHVyZXMgPz8gQUxMX0VOQUJMRUQgXiAob3B0aW9ucy5kaXNhYmxlZEZlYXR1cmVzIHx8IDApLFxuICAgIGRlcHRoTGltaXQ6IG9wdGlvbnMuZGVwdGhMaW1pdCB8fCBERUZBVUxUX0RFUFRIX0xJTUlULFxuICB9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFZhbmlsbGFEZXNlcmlhbGl6ZXJDb250ZXh0T3B0aW9uc1xuICBleHRlbmRzIE9taXQ8QmFzZURlc2VyaWFsaXplckNvbnRleHRPcHRpb25zLCAncmVmcyc+IHtcbiAgbWFya2VkUmVmczogbnVtYmVyW10gfCBTZXQ8bnVtYmVyPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBWYW5pbGxhRGVzZXJpYWxpemVyU3RhdGUge1xuICBtYXJrZWQ6IFNldDxudW1iZXI+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFZhbmlsbGFEZXNlcmlhbGl6ZXJDb250ZXh0IHtcbiAgbW9kZTogU2Vyb3ZhbE1vZGUuVmFuaWxsYTtcbiAgYmFzZTogQmFzZURlc2VyaWFsaXplckNvbnRleHQ7XG4gIGNoaWxkOiBEZXNlcmlhbGl6ZVBsdWdpbkNvbnRleHQgfCB1bmRlZmluZWQ7XG4gIHN0YXRlOiBWYW5pbGxhRGVzZXJpYWxpemVyU3RhdGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVWYW5pbGxhRGVzZXJpYWxpemVyQ29udGV4dChcbiAgb3B0aW9uczogVmFuaWxsYURlc2VyaWFsaXplckNvbnRleHRPcHRpb25zLFxuKTogVmFuaWxsYURlc2VyaWFsaXplckNvbnRleHQge1xuICByZXR1cm4ge1xuICAgIG1vZGU6IFNlcm92YWxNb2RlLlZhbmlsbGEsXG4gICAgYmFzZTogY3JlYXRlQmFzZURlc2VyaWFsaXplckNvbnRleHQoU2Vyb3ZhbE1vZGUuVmFuaWxsYSwgb3B0aW9ucyksXG4gICAgY2hpbGQ6IE5JTCxcbiAgICBzdGF0ZToge1xuICAgICAgbWFya2VkOiBuZXcgU2V0KG9wdGlvbnMubWFya2VkUmVmcyksXG4gICAgfSxcbiAgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDcm9zc0Rlc2VyaWFsaXplckNvbnRleHQge1xuICBtb2RlOiBTZXJvdmFsTW9kZS5Dcm9zcztcbiAgYmFzZTogQmFzZURlc2VyaWFsaXplckNvbnRleHQ7XG4gIGNoaWxkOiBEZXNlcmlhbGl6ZVBsdWdpbkNvbnRleHQgfCB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCB0eXBlIENyb3NzRGVzZXJpYWxpemVyQ29udGV4dE9wdGlvbnMgPSBCYXNlRGVzZXJpYWxpemVyQ29udGV4dE9wdGlvbnM7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDcm9zc0Rlc2VyaWFsaXplckNvbnRleHQoXG4gIG9wdGlvbnM6IENyb3NzRGVzZXJpYWxpemVyQ29udGV4dE9wdGlvbnMsXG4pOiBDcm9zc0Rlc2VyaWFsaXplckNvbnRleHQge1xuICByZXR1cm4ge1xuICAgIG1vZGU6IFNlcm92YWxNb2RlLkNyb3NzLFxuICAgIGJhc2U6IGNyZWF0ZUJhc2VEZXNlcmlhbGl6ZXJDb250ZXh0KFNlcm92YWxNb2RlLkNyb3NzLCBvcHRpb25zKSxcbiAgICBjaGlsZDogTklMLFxuICB9O1xufVxuXG50eXBlIERlc2VyaWFsaXplckNvbnRleHQgPVxuICB8IFZhbmlsbGFEZXNlcmlhbGl6ZXJDb250ZXh0XG4gIHwgQ3Jvc3NEZXNlcmlhbGl6ZXJDb250ZXh0O1xuXG5leHBvcnQgY2xhc3MgRGVzZXJpYWxpemVQbHVnaW5Db250ZXh0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfcDogRGVzZXJpYWxpemVyQ29udGV4dCxcbiAgICBwcml2YXRlIGRlcHRoOiBudW1iZXIsXG4gICkge31cblxuICBkZXNlcmlhbGl6ZTxUPihub2RlOiBTZXJvdmFsTm9kZSk6IFQge1xuICAgIHJldHVybiBkZXNlcmlhbGl6ZSh0aGlzLl9wLCB0aGlzLmRlcHRoLCBub2RlKSBhcyBUO1xuICB9XG59XG5cbmZ1bmN0aW9uIGd1YXJkSW5kZXhlZFZhbHVlKGN0eDogQmFzZURlc2VyaWFsaXplckNvbnRleHQsIGlkOiBudW1iZXIpOiB2b2lkIHtcbiAgaWYgKGlkIDwgMCB8fCAhTnVtYmVyLmlzRmluaXRlKGlkKSB8fCAhTnVtYmVyLmlzSW50ZWdlcihpZCkpIHtcbiAgICB0aHJvdyBuZXcgU2Vyb3ZhbE1hbGZvcm1lZE5vZGVFcnJvcih7XG4gICAgICB0OiBTZXJvdmFsTm9kZVR5cGUuSW5kZXhlZFZhbHVlLFxuICAgICAgaTogaWQsXG4gICAgfSBhcyBTZXJvdmFsTm9kZSk7XG4gIH1cbiAgaWYgKGN0eC5yZWZzLmhhcyhpZCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbmZsaWN0ZWQgcmVmIGlkOiAnICsgaWQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2lnbkluZGV4ZWRWYWx1ZVZhbmlsbGE8VD4oXG4gIGN0eDogVmFuaWxsYURlc2VyaWFsaXplckNvbnRleHQsXG4gIGlkOiBudW1iZXIsXG4gIHZhbHVlOiBULFxuKTogVCB7XG4gIGd1YXJkSW5kZXhlZFZhbHVlKGN0eC5iYXNlLCBpZCk7XG4gIGlmIChjdHguc3RhdGUubWFya2VkLmhhcyhpZCkpIHtcbiAgICBjdHguYmFzZS5yZWZzLnNldChpZCwgdmFsdWUpO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gYXNzaWduSW5kZXhlZFZhbHVlQ3Jvc3M8VD4oXG4gIGN0eDogQ3Jvc3NEZXNlcmlhbGl6ZXJDb250ZXh0LFxuICBpZDogbnVtYmVyLFxuICB2YWx1ZTogVCxcbik6IFQge1xuICBndWFyZEluZGV4ZWRWYWx1ZShjdHguYmFzZSwgaWQpO1xuICBjdHguYmFzZS5yZWZzLnNldChpZCwgdmFsdWUpO1xuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGFzc2lnbkluZGV4ZWRWYWx1ZTxUPihcbiAgY3R4OiBEZXNlcmlhbGl6ZXJDb250ZXh0LFxuICBpZDogbnVtYmVyLFxuICB2YWx1ZTogVCxcbik6IFQge1xuICByZXR1cm4gY3R4Lm1vZGUgPT09IFNlcm92YWxNb2RlLlZhbmlsbGFcbiAgICA/IGFzc2lnbkluZGV4ZWRWYWx1ZVZhbmlsbGEoY3R4LCBpZCwgdmFsdWUpXG4gICAgOiBhc3NpZ25JbmRleGVkVmFsdWVDcm9zcyhjdHgsIGlkLCB2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGRlc2VyaWFsaXplS25vd25WYWx1ZTxcbiAgVCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICBLIGV4dGVuZHMga2V5b2YgVCxcbj4obm9kZTogU2Vyb3ZhbE5vZGUsIHJlY29yZDogVCwga2V5OiBLKTogVFtLXSB7XG4gIGlmIChPYmplY3QuaGFzT3duKHJlY29yZCwga2V5KSkge1xuICAgIHJldHVybiByZWNvcmRba2V5XTtcbiAgfVxuICB0aHJvdyBuZXcgU2Vyb3ZhbE1hbGZvcm1lZE5vZGVFcnJvcihub2RlKTtcbn1cblxuZnVuY3Rpb24gZGVzZXJpYWxpemVSZWZlcmVuY2UoXG4gIGN0eDogRGVzZXJpYWxpemVyQ29udGV4dCxcbiAgbm9kZTogU2Vyb3ZhbFJlZmVyZW5jZU5vZGUsXG4pOiB1bmtub3duIHtcbiAgcmV0dXJuIGFzc2lnbkluZGV4ZWRWYWx1ZShcbiAgICBjdHgsXG4gICAgbm9kZS5pLFxuICAgIGdldFJlZmVyZW5jZShkZXNlcmlhbGl6ZVN0cmluZyhub2RlLnMpKSxcbiAgKTtcbn1cblxuZnVuY3Rpb24gZGVzZXJpYWxpemVBcnJheShcbiAgY3R4OiBEZXNlcmlhbGl6ZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBub2RlOiBTZXJvdmFsQXJyYXlOb2RlLFxuKTogdW5rbm93bltdIHtcbiAgY29uc3QgaXRlbXMgPSBub2RlLmE7XG4gIGNvbnN0IGxlbiA9IGl0ZW1zLmxlbmd0aDtcbiAgY29uc3QgcmVzdWx0OiB1bmtub3duW10gPSBhc3NpZ25JbmRleGVkVmFsdWUoXG4gICAgY3R4LFxuICAgIG5vZGUuaSxcbiAgICBuZXcgQXJyYXk8dW5rbm93bj4obGVuKSxcbiAgKTtcbiAgZm9yIChsZXQgaSA9IDAsIGl0ZW06IFNlcm92YWxOb2RlIHwgMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaXRlbSA9IGl0ZW1zW2ldO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICByZXN1bHRbaV0gPSBkZXNlcmlhbGl6ZShjdHgsIGRlcHRoLCBpdGVtKTtcbiAgICB9XG4gIH1cbiAgYXBwbHlPYmplY3RGbGFnKHJlc3VsdCwgbm9kZS5vKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZEtleShrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBzd2l0Y2ggKGtleSkge1xuICAgIGNhc2UgJ2NvbnN0cnVjdG9yJzpcbiAgICBjYXNlICdfX3Byb3RvX18nOlxuICAgIGNhc2UgJ3Byb3RvdHlwZSc6XG4gICAgY2FzZSAnX19kZWZpbmVHZXR0ZXJfXyc6XG4gICAgY2FzZSAnX19kZWZpbmVTZXR0ZXJfXyc6XG4gICAgY2FzZSAnX19sb29rdXBHZXR0ZXJfXyc6XG4gICAgY2FzZSAnX19sb29rdXBTZXR0ZXJfXyc6XG4gICAgICAvLyBjYXNlICd0aGVuJzpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNWYWxpZFN5bWJvbChzeW1ib2w6IHN5bWJvbCk6IGJvb2xlYW4ge1xuICBzd2l0Y2ggKHN5bWJvbCkge1xuICAgIGNhc2UgU1lNX0FTWU5DX0lURVJBVE9SOlxuICAgIGNhc2UgU1lNX0lTX0NPTkNBVF9TUFJFQURBQkxFOlxuICAgIGNhc2UgU1lNX1RPX1NUUklOR19UQUc6XG4gICAgY2FzZSBTWU1fSVRFUkFUT1I6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2lnblN0cmluZ1Byb3BlcnR5KFxuICBvYmplY3Q6IFJlY29yZDxzdHJpbmcgfCBzeW1ib2wsIHVua25vd24+LFxuICBrZXk6IHN0cmluZyxcbiAgdmFsdWU6IHVua25vd24sXG4pOiB2b2lkIHtcbiAgaWYgKGlzVmFsaWRLZXkoa2V5KSkge1xuICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwga2V5LCB7XG4gICAgICB2YWx1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhc3NpZ25Qcm9wZXJ0eShcbiAgY3R4OiBEZXNlcmlhbGl6ZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBvYmplY3Q6IFJlY29yZDxzdHJpbmcgfCBzeW1ib2wsIHVua25vd24+LFxuICBrZXk6IHN0cmluZyB8IFNlcm92YWxOb2RlLFxuICB2YWx1ZTogU2Vyb3ZhbE5vZGUsXG4pOiB2b2lkIHtcbiAgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKSB7XG4gICAgYXNzaWduU3RyaW5nUHJvcGVydHkoXG4gICAgICBvYmplY3QsXG4gICAgICBkZXNlcmlhbGl6ZVN0cmluZyhrZXkpLFxuICAgICAgZGVzZXJpYWxpemUoY3R4LCBkZXB0aCwgdmFsdWUpLFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgYWN0dWFsID0gZGVzZXJpYWxpemUoY3R4LCBkZXB0aCwga2V5KTtcbiAgICBzd2l0Y2ggKHR5cGVvZiBhY3R1YWwpIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIGFzc2lnblN0cmluZ1Byb3BlcnR5KG9iamVjdCwgYWN0dWFsLCBkZXNlcmlhbGl6ZShjdHgsIGRlcHRoLCB2YWx1ZSkpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N5bWJvbCc6XG4gICAgICAgIGlmIChpc1ZhbGlkU3ltYm9sKGFjdHVhbCkpIHtcbiAgICAgICAgICBvYmplY3RbYWN0dWFsXSA9IGRlc2VyaWFsaXplKGN0eCwgZGVwdGgsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBTZXJvdmFsTWFsZm9ybWVkTm9kZUVycm9yKGtleSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGFzc2lnbk5vZGVUeXBlKFxuICBjdHg6IERlc2VyaWFsaXplckNvbnRleHQsXG4gIGlkOiBudW1iZXIsXG4gIHR5cGU6IFNlcm92YWxOb2RlVHlwZSxcbik6IHZvaWQge1xuICBjdHguYmFzZS5yZWZzLnR5cGVzLnNldChpZCwgdHlwZSk7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlTm9kZVR5cGUoXG4gIGN0eDogRGVzZXJpYWxpemVyQ29udGV4dCxcbiAgbm9kZTogU2Vyb3ZhbE5vZGUsXG4gIGlkOiBudW1iZXIsXG4gIHR5cGU6IFNlcm92YWxOb2RlVHlwZSxcbik6IGFzc2VydHMgaWQgaXMgU2Vyb3ZhbE5vZGVUeXBlIHtcbiAgaWYgKGN0eC5iYXNlLnJlZnMudHlwZXMuZ2V0KGlkKSAhPT0gdHlwZSkge1xuICAgIHRocm93IG5ldyBTZXJvdmFsTWFsZm9ybWVkTm9kZUVycm9yKG5vZGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRlc2VyaWFsaXplUHJvcGVydGllcyhcbiAgY3R4OiBEZXNlcmlhbGl6ZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBub2RlOiBTZXJvdmFsT2JqZWN0UmVjb3JkTm9kZSxcbiAgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nIHwgc3ltYm9sLCB1bmtub3duPixcbik6IFJlY29yZDxzdHJpbmcgfCBzeW1ib2wsIHVua25vd24+IHtcbiAgY29uc3Qga2V5cyA9IG5vZGUuaztcbiAgY29uc3QgbGVuID0ga2V5cy5sZW5ndGg7XG4gIGlmIChsZW4gPiAwKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIHZhbHMgPSBub2RlLnYsIGxlbiA9IGtleXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGFzc2lnblByb3BlcnR5KGN0eCwgZGVwdGgsIHJlc3VsdCwga2V5c1tpXSwgdmFsc1tpXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGRlc2VyaWFsaXplT2JqZWN0KFxuICBjdHg6IERlc2VyaWFsaXplckNvbnRleHQsXG4gIGRlcHRoOiBudW1iZXIsXG4gIG5vZGU6IFNlcm92YWxPYmplY3ROb2RlIHwgU2Vyb3ZhbE51bGxDb25zdHJ1Y3Rvck5vZGUsXG4pOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gIGNvbnN0IHJlc3VsdCA9IGFzc2lnbkluZGV4ZWRWYWx1ZShcbiAgICBjdHgsXG4gICAgbm9kZS5pLFxuICAgIChub2RlLnQgPT09IFNlcm92YWxOb2RlVHlwZS5PYmplY3QgPyB7fSA6IE9iamVjdC5jcmVhdGUobnVsbCkpIGFzIFJlY29yZDxcbiAgICAgIHN0cmluZyxcbiAgICAgIHVua25vd25cbiAgICA+LFxuICApO1xuICBkZXNlcmlhbGl6ZVByb3BlcnRpZXMoY3R4LCBkZXB0aCwgbm9kZS5wLCByZXN1bHQpO1xuICBhcHBseU9iamVjdEZsYWcocmVzdWx0LCBub2RlLm8pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZURhdGUoXG4gIGN0eDogRGVzZXJpYWxpemVyQ29udGV4dCxcbiAgbm9kZTogU2Vyb3ZhbERhdGVOb2RlLFxuKTogRGF0ZSB7XG4gIHJldHVybiBhc3NpZ25JbmRleGVkVmFsdWUoY3R4LCBub2RlLmksIG5ldyBEYXRlKG5vZGUucykpO1xufVxuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZVJlZ0V4cChcbiAgY3R4OiBEZXNlcmlhbGl6ZXJDb250ZXh0LFxuICBub2RlOiBTZXJvdmFsUmVnRXhwTm9kZSxcbik6IFJlZ0V4cCB7XG4gIGlmIChjdHguYmFzZS5mZWF0dXJlcyAmIEZlYXR1cmUuUmVnRXhwKSB7XG4gICAgY29uc3Qgc291cmNlID0gZGVzZXJpYWxpemVTdHJpbmcobm9kZS5jKTtcbiAgICBpZiAoc291cmNlLmxlbmd0aCA+IE1BWF9SRUdFWFBfU09VUkNFX0xFTkdUSCkge1xuICAgICAgdGhyb3cgbmV3IFNlcm92YWxNYWxmb3JtZWROb2RlRXJyb3Iobm9kZSk7XG4gICAgfVxuICAgIHJldHVybiBhc3NpZ25JbmRleGVkVmFsdWUoY3R4LCBub2RlLmksIG5ldyBSZWdFeHAoc291cmNlLCBub2RlLm0pKTtcbiAgfVxuICB0aHJvdyBuZXcgU2Vyb3ZhbFVuc3VwcG9ydGVkTm9kZUVycm9yKG5vZGUpO1xufVxuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZVNldChcbiAgY3R4OiBEZXNlcmlhbGl6ZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBub2RlOiBTZXJvdmFsU2V0Tm9kZSxcbik6IFNldDx1bmtub3duPiB7XG4gIGNvbnN0IHJlc3VsdCA9IGFzc2lnbkluZGV4ZWRWYWx1ZShjdHgsIG5vZGUuaSwgbmV3IFNldDx1bmtub3duPigpKTtcbiAgZm9yIChsZXQgaSA9IDAsIGl0ZW1zID0gbm9kZS5hLCBsZW4gPSBpdGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHJlc3VsdC5hZGQoZGVzZXJpYWxpemUoY3R4LCBkZXB0aCwgaXRlbXNbaV0pKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZU1hcChcbiAgY3R4OiBEZXNlcmlhbGl6ZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBub2RlOiBTZXJvdmFsTWFwTm9kZSxcbik6IE1hcDx1bmtub3duLCB1bmtub3duPiB7XG4gIGNvbnN0IHJlc3VsdCA9IGFzc2lnbkluZGV4ZWRWYWx1ZShjdHgsIG5vZGUuaSwgbmV3IE1hcDx1bmtub3duLCB1bmtub3duPigpKTtcbiAgZm9yIChcbiAgICBsZXQgaSA9IDAsIGtleXMgPSBub2RlLmUuaywgdmFscyA9IG5vZGUuZS52LCBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICBpIDwgbGVuO1xuICAgIGkrK1xuICApIHtcbiAgICByZXN1bHQuc2V0KFxuICAgICAgZGVzZXJpYWxpemUoY3R4LCBkZXB0aCwga2V5c1tpXSksXG4gICAgICBkZXNlcmlhbGl6ZShjdHgsIGRlcHRoLCB2YWxzW2ldKSxcbiAgICApO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGRlc2VyaWFsaXplQXJyYXlCdWZmZXIoXG4gIGN0eDogRGVzZXJpYWxpemVyQ29udGV4dCxcbiAgbm9kZTogU2Vyb3ZhbEFycmF5QnVmZmVyTm9kZSxcbik6IEFycmF5QnVmZmVyIHtcbiAgaWYgKG5vZGUucy5sZW5ndGggPiBNQVhfQkFTRTY0X0xFTkdUSCkge1xuICAgIHRocm93IG5ldyBTZXJvdmFsTWFsZm9ybWVkTm9kZUVycm9yKG5vZGUpO1xuICB9XG4gIGNvbnN0IHJlc3VsdCA9IGFzc2lnbkluZGV4ZWRWYWx1ZShcbiAgICBjdHgsXG4gICAgbm9kZS5pLFxuICAgIEFSUkFZX0JVRkZFUl9DT05TVFJVQ1RPUihkZXNlcmlhbGl6ZVN0cmluZyhub2RlLnMpKSxcbiAgKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZGVzZXJpYWxpemVUeXBlZEFycmF5KFxuICBjdHg6IERlc2VyaWFsaXplckNvbnRleHQsXG4gIGRlcHRoOiBudW1iZXIsXG4gIG5vZGU6IFNlcm92YWxUeXBlZEFycmF5Tm9kZSB8IFNlcm92YWxCaWdJbnRUeXBlZEFycmF5Tm9kZSxcbik6IFR5cGVkQXJyYXlWYWx1ZSB8IEJpZ0ludFR5cGVkQXJyYXlWYWx1ZSB7XG4gIGNvbnN0IGNvbnN0cnVjdCA9IGdldFR5cGVkQXJyYXlDb25zdHJ1Y3Rvcihub2RlLmMpIGFzIEludDhBcnJheUNvbnN0cnVjdG9yO1xuICBjb25zdCBzb3VyY2UgPSBkZXNlcmlhbGl6ZShjdHgsIGRlcHRoLCBub2RlLmYpIGFzIEFycmF5QnVmZmVyO1xuICBjb25zdCBvZmZzZXQgPSBub2RlLmIgPz8gMDtcbiAgaWYgKG9mZnNldCA8IDAgfHwgb2Zmc2V0ID4gc291cmNlLmJ5dGVMZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgU2Vyb3ZhbE1hbGZvcm1lZE5vZGVFcnJvcihub2RlKTtcbiAgfVxuICBjb25zdCByZXN1bHQgPSBhc3NpZ25JbmRleGVkVmFsdWUoXG4gICAgY3R4LFxuICAgIG5vZGUuaSxcbiAgICBuZXcgY29uc3RydWN0KHNvdXJjZSwgb2Zmc2V0LCBub2RlLmwpLFxuICApO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZURhdGFWaWV3KFxuICBjdHg6IERlc2VyaWFsaXplckNvbnRleHQsXG4gIGRlcHRoOiBudW1iZXIsXG4gIG5vZGU6IFNlcm92YWxEYXRhVmlld05vZGUsXG4pOiBEYXRhVmlldyB7XG4gIGNvbnN0IHNvdXJjZSA9IGRlc2VyaWFsaXplKGN0eCwgZGVwdGgsIG5vZGUuZikgYXMgQXJyYXlCdWZmZXI7XG4gIGNvbnN0IG9mZnNldCA9IG5vZGUuYiA/PyAwO1xuICBpZiAob2Zmc2V0IDwgMCB8fCBvZmZzZXQgPiBzb3VyY2UuYnl0ZUxlbmd0aCkge1xuICAgIHRocm93IG5ldyBTZXJvdmFsTWFsZm9ybWVkTm9kZUVycm9yKG5vZGUpO1xuICB9XG4gIGNvbnN0IHJlc3VsdCA9IGFzc2lnbkluZGV4ZWRWYWx1ZShcbiAgICBjdHgsXG4gICAgbm9kZS5pLFxuICAgIG5ldyBEYXRhVmlldyhzb3VyY2UsIG9mZnNldCwgbm9kZS5sKSxcbiAgKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZGVzZXJpYWxpemVEaWN0aW9uYXJ5PFQgZXh0ZW5kcyBBc3NpZ25hYmxlVmFsdWU+KFxuICBjdHg6IERlc2VyaWFsaXplckNvbnRleHQsXG4gIGRlcHRoOiBudW1iZXIsXG4gIG5vZGU6IEFzc2lnbmFibGVOb2RlLFxuICByZXN1bHQ6IFQsXG4pOiBUIHtcbiAgaWYgKG5vZGUucCkge1xuICAgIGNvbnN0IGZpZWxkcyA9IGRlc2VyaWFsaXplUHJvcGVydGllcyhjdHgsIGRlcHRoLCBub2RlLnAsIHt9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhyZXN1bHQsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKGZpZWxkcykpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGRlc2VyaWFsaXplQWdncmVnYXRlRXJyb3IoXG4gIGN0eDogRGVzZXJpYWxpemVyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgbm9kZTogU2Vyb3ZhbEFnZ3JlZ2F0ZUVycm9yTm9kZSxcbik6IEFnZ3JlZ2F0ZUVycm9yIHtcbiAgLy8gU2VyaWFsaXplIHRoZSByZXF1aXJlZCBhcmd1bWVudHNcbiAgY29uc3QgcmVzdWx0ID0gYXNzaWduSW5kZXhlZFZhbHVlKFxuICAgIGN0eCxcbiAgICBub2RlLmksXG4gICAgbmV3IEFnZ3JlZ2F0ZUVycm9yKFtdLCBkZXNlcmlhbGl6ZVN0cmluZyhub2RlLm0pKSxcbiAgKTtcbiAgLy8gYEFnZ3JlZ2F0ZUVycm9yYCBtaWdodCd2ZSBiZWVuIGV4dGVuZGVkXG4gIC8vIGVpdGhlciB0aHJvdWdoIGNsYXNzIG9yIGN1c3RvbSBwcm9wZXJ0aWVzXG4gIC8vIE1ha2Ugc3VyZSB0byBhc3NpZ24gZXh0cmEgcHJvcGVydGllc1xuICByZXR1cm4gZGVzZXJpYWxpemVEaWN0aW9uYXJ5KGN0eCwgZGVwdGgsIG5vZGUsIHJlc3VsdCk7XG59XG5cbmZ1bmN0aW9uIGRlc2VyaWFsaXplRXJyb3IoXG4gIGN0eDogRGVzZXJpYWxpemVyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgbm9kZTogU2Vyb3ZhbEVycm9yTm9kZSxcbik6IEVycm9yIHtcbiAgY29uc3QgY29uc3RydWN0ID0gZGVzZXJpYWxpemVLbm93blZhbHVlKG5vZGUsIEVSUk9SX0NPTlNUUlVDVE9SLCBub2RlLnMpO1xuICBjb25zdCByZXN1bHQgPSBhc3NpZ25JbmRleGVkVmFsdWUoXG4gICAgY3R4LFxuICAgIG5vZGUuaSxcbiAgICBuZXcgY29uc3RydWN0KGRlc2VyaWFsaXplU3RyaW5nKG5vZGUubSkpLFxuICApO1xuICByZXR1cm4gZGVzZXJpYWxpemVEaWN0aW9uYXJ5KGN0eCwgZGVwdGgsIG5vZGUsIHJlc3VsdCk7XG59XG5cbmZ1bmN0aW9uIGRlc2VyaWFsaXplUHJvbWlzZShcbiAgY3R4OiBEZXNlcmlhbGl6ZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBub2RlOiBTZXJvdmFsUHJvbWlzZU5vZGUsXG4pOiBQcm9taXNlPHVua25vd24+IHtcbiAgY29uc3QgZGVmZXJyZWQgPSBQUk9NSVNFX0NPTlNUUlVDVE9SKCk7XG4gIGNvbnN0IHJlc3VsdCA9IGFzc2lnbkluZGV4ZWRWYWx1ZShjdHgsIG5vZGUuaSwgZGVmZXJyZWQucCk7XG4gIGNvbnN0IGRlc2VyaWFsaXplZCA9IGRlc2VyaWFsaXplKGN0eCwgZGVwdGgsIG5vZGUuZik7XG4gIGlmIChub2RlLnMpIHtcbiAgICBkZWZlcnJlZC5zKGRlc2VyaWFsaXplZCk7XG4gIH0gZWxzZSB7XG4gICAgZGVmZXJyZWQuZihkZXNlcmlhbGl6ZWQpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGRlc2VyaWFsaXplQm94ZWQoXG4gIGN0eDogRGVzZXJpYWxpemVyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgbm9kZTogU2Vyb3ZhbEJveGVkTm9kZSxcbik6IHVua25vd24ge1xuICByZXR1cm4gYXNzaWduSW5kZXhlZFZhbHVlKFxuICAgIGN0eCxcbiAgICBub2RlLmksXG4gICAgLy8gYmlvbWUtaWdub3JlIGxpbnQvc3R5bGUvdXNlQ29uc2lzdGVudEJ1aWx0aW5JbnN0YW50aWF0aW9uOiBpbnRlbmRlZFxuICAgIE9iamVjdChkZXNlcmlhbGl6ZShjdHgsIGRlcHRoLCBub2RlLmYpKSxcbiAgKTtcbn1cblxuZnVuY3Rpb24gZGVzZXJpYWxpemVQbHVnaW4oXG4gIGN0eDogRGVzZXJpYWxpemVyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgbm9kZTogU2Vyb3ZhbFBsdWdpbk5vZGUsXG4pOiB1bmtub3duIHtcbiAgY29uc3QgY3VycmVudFBsdWdpbnMgPSBjdHguYmFzZS5wbHVnaW5zO1xuICBpZiAoY3VycmVudFBsdWdpbnMpIHtcbiAgICBjb25zdCB0YWcgPSBkZXNlcmlhbGl6ZVN0cmluZyhub2RlLmMpO1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjdXJyZW50UGx1Z2lucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3VycmVudFBsdWdpbnNbaV07XG4gICAgICBpZiAocGx1Z2luLnRhZyA9PT0gdGFnKSB7XG4gICAgICAgIHJldHVybiBhc3NpZ25JbmRleGVkVmFsdWUoXG4gICAgICAgICAgY3R4LFxuICAgICAgICAgIG5vZGUuaSxcbiAgICAgICAgICBwbHVnaW4uZGVzZXJpYWxpemUobm9kZS5zLCBuZXcgRGVzZXJpYWxpemVQbHVnaW5Db250ZXh0KGN0eCwgZGVwdGgpLCB7XG4gICAgICAgICAgICBpZDogbm9kZS5pLFxuICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICB0aHJvdyBuZXcgU2Vyb3ZhbE1pc3NpbmdQbHVnaW5FcnJvcihub2RlLmMpO1xufVxuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZVByb21pc2VDb25zdHJ1Y3RvcihcbiAgY3R4OiBEZXNlcmlhbGl6ZXJDb250ZXh0LFxuICBub2RlOiBTZXJvdmFsUHJvbWlzZUNvbnN0cnVjdG9yTm9kZSxcbik6IHVua25vd24ge1xuICBjb25zdCB2YWx1ZSA9IGFzc2lnbkluZGV4ZWRWYWx1ZShcbiAgICBjdHgsXG4gICAgbm9kZS5pLFxuICAgIGFzc2lnbkluZGV4ZWRWYWx1ZShjdHgsIG5vZGUucywgUFJPTUlTRV9DT05TVFJVQ1RPUigpKS5wLFxuICApO1xuICBhc3NpZ25Ob2RlVHlwZShjdHgsIG5vZGUucywgU2Vyb3ZhbE5vZGVUeXBlLlByb21pc2VDb25zdHJ1Y3Rvcik7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gZGVzZXJpYWxpemVQcm9taXNlUmVzb2x2ZShcbiAgY3R4OiBEZXNlcmlhbGl6ZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBub2RlOiBTZXJvdmFsUHJvbWlzZVJlc29sdmVOb2RlLFxuKTogdW5rbm93biB7XG4gIGNvbnN0IGRlZmVycmVkID0gY3R4LmJhc2UucmVmcy5nZXQobm9kZS5pKSBhc1xuICAgIHwgUHJvbWlzZUNvbnN0cnVjdG9yUmVzb2x2ZXJcbiAgICB8IHVuZGVmaW5lZDtcbiAgaWYgKGRlZmVycmVkKSB7XG4gICAgdmFsaWRhdGVOb2RlVHlwZShjdHgsIG5vZGUsIG5vZGUuaSwgU2Vyb3ZhbE5vZGVUeXBlLlByb21pc2VDb25zdHJ1Y3Rvcik7XG4gICAgZGVmZXJyZWQucyhkZXNlcmlhbGl6ZShjdHgsIGRlcHRoLCBub2RlLmFbMV0pKTtcbiAgICByZXR1cm4gTklMO1xuICB9XG4gIHRocm93IG5ldyBTZXJvdmFsTWlzc2luZ0luc3RhbmNlRXJyb3IoJ1Byb21pc2UnKTtcbn1cblxuZnVuY3Rpb24gZGVzZXJpYWxpemVQcm9taXNlUmVqZWN0KFxuICBjdHg6IERlc2VyaWFsaXplckNvbnRleHQsXG4gIGRlcHRoOiBudW1iZXIsXG4gIG5vZGU6IFNlcm92YWxQcm9taXNlUmVqZWN0Tm9kZSxcbik6IHVua25vd24ge1xuICBjb25zdCBkZWZlcnJlZCA9IGN0eC5iYXNlLnJlZnMuZ2V0KG5vZGUuaSkgYXNcbiAgICB8IFByb21pc2VDb25zdHJ1Y3RvclJlc29sdmVyXG4gICAgfCB1bmRlZmluZWQ7XG4gIGlmIChkZWZlcnJlZCkge1xuICAgIHZhbGlkYXRlTm9kZVR5cGUoY3R4LCBub2RlLCBub2RlLmksIFNlcm92YWxOb2RlVHlwZS5Qcm9taXNlQ29uc3RydWN0b3IpO1xuICAgIGRlZmVycmVkLmYoZGVzZXJpYWxpemUoY3R4LCBkZXB0aCwgbm9kZS5hWzFdKSk7XG4gICAgcmV0dXJuIE5JTDtcbiAgfVxuICB0aHJvdyBuZXcgU2Vyb3ZhbE1pc3NpbmdJbnN0YW5jZUVycm9yKCdQcm9taXNlJyk7XG59XG5cbmZ1bmN0aW9uIGRlc2VyaWFsaXplSXRlcmF0b3JGYWN0b3J5SW5zdGFuY2UoXG4gIGN0eDogRGVzZXJpYWxpemVyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgbm9kZTogU2Vyb3ZhbEl0ZXJhdG9yRmFjdG9yeUluc3RhbmNlTm9kZSxcbik6IHVua25vd24ge1xuICBkZXNlcmlhbGl6ZShjdHgsIGRlcHRoLCBub2RlLmFbMF0pO1xuICBjb25zdCBzb3VyY2UgPSBkZXNlcmlhbGl6ZShjdHgsIGRlcHRoLCBub2RlLmFbMV0pO1xuICByZXR1cm4gc2VxdWVuY2VUb0l0ZXJhdG9yKHNvdXJjZSBhcyBTZXF1ZW5jZSk7XG59XG5cbmZ1bmN0aW9uIGRlc2VyaWFsaXplQXN5bmNJdGVyYXRvckZhY3RvcnlJbnN0YW5jZShcbiAgY3R4OiBEZXNlcmlhbGl6ZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBub2RlOiBTZXJvdmFsQXN5bmNJdGVyYXRvckZhY3RvcnlJbnN0YW5jZU5vZGUsXG4pOiB1bmtub3duIHtcbiAgZGVzZXJpYWxpemUoY3R4LCBkZXB0aCwgbm9kZS5hWzBdKTtcbiAgY29uc3Qgc291cmNlID0gZGVzZXJpYWxpemUoY3R4LCBkZXB0aCwgbm9kZS5hWzFdKTtcbiAgcmV0dXJuIHN0cmVhbVRvQXN5bmNJdGVyYWJsZShzb3VyY2UgYXMgU3RyZWFtPGFueT4pO1xufVxuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZVN0cmVhbUNvbnN0cnVjdG9yKFxuICBjdHg6IERlc2VyaWFsaXplckNvbnRleHQsXG4gIGRlcHRoOiBudW1iZXIsXG4gIG5vZGU6IFNlcm92YWxTdHJlYW1Db25zdHJ1Y3Rvck5vZGUsXG4pOiB1bmtub3duIHtcbiAgY29uc3QgcmVzdWx0ID0gYXNzaWduSW5kZXhlZFZhbHVlKGN0eCwgbm9kZS5pLCBjcmVhdGVTdHJlYW0oKSk7XG4gIGFzc2lnbk5vZGVUeXBlKGN0eCwgbm9kZS5pLCBTZXJvdmFsTm9kZVR5cGUuU3RyZWFtQ29uc3RydWN0b3IpO1xuICBjb25zdCBpdGVtcyA9IG5vZGUuYTtcbiAgY29uc3QgbGVuID0gaXRlbXMubGVuZ3RoO1xuICBpZiAobGVuKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgZGVzZXJpYWxpemUoY3R4LCBkZXB0aCwgaXRlbXNbaV0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZVN0cmVhbU5leHQoXG4gIGN0eDogRGVzZXJpYWxpemVyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgbm9kZTogU2Vyb3ZhbFN0cmVhbU5leHROb2RlLFxuKTogdW5rbm93biB7XG4gIGNvbnN0IGRlZmVycmVkID0gY3R4LmJhc2UucmVmcy5nZXQobm9kZS5pKSBhcyBTdHJlYW08dW5rbm93bj4gfCB1bmRlZmluZWQ7XG4gIGlmIChkZWZlcnJlZCkge1xuICAgIHZhbGlkYXRlTm9kZVR5cGUoY3R4LCBub2RlLCBub2RlLmksIFNlcm92YWxOb2RlVHlwZS5TdHJlYW1Db25zdHJ1Y3Rvcik7XG4gICAgZGVmZXJyZWQubmV4dChkZXNlcmlhbGl6ZShjdHgsIGRlcHRoLCBub2RlLmYpKTtcbiAgICByZXR1cm4gTklMO1xuICB9XG4gIHRocm93IG5ldyBTZXJvdmFsTWlzc2luZ0luc3RhbmNlRXJyb3IoJ1N0cmVhbScpO1xufVxuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZVN0cmVhbVRocm93KFxuICBjdHg6IERlc2VyaWFsaXplckNvbnRleHQsXG4gIGRlcHRoOiBudW1iZXIsXG4gIG5vZGU6IFNlcm92YWxTdHJlYW1UaHJvd05vZGUsXG4pOiB1bmtub3duIHtcbiAgY29uc3QgZGVmZXJyZWQgPSBjdHguYmFzZS5yZWZzLmdldChub2RlLmkpIGFzIFN0cmVhbTx1bmtub3duPiB8IHVuZGVmaW5lZDtcbiAgaWYgKGRlZmVycmVkKSB7XG4gICAgdmFsaWRhdGVOb2RlVHlwZShjdHgsIG5vZGUsIG5vZGUuaSwgU2Vyb3ZhbE5vZGVUeXBlLlN0cmVhbUNvbnN0cnVjdG9yKTtcbiAgICBkZWZlcnJlZC50aHJvdyhkZXNlcmlhbGl6ZShjdHgsIGRlcHRoLCBub2RlLmYpKTtcbiAgICByZXR1cm4gTklMO1xuICB9XG4gIHRocm93IG5ldyBTZXJvdmFsTWlzc2luZ0luc3RhbmNlRXJyb3IoJ1N0cmVhbScpO1xufVxuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZVN0cmVhbVJldHVybihcbiAgY3R4OiBEZXNlcmlhbGl6ZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBub2RlOiBTZXJvdmFsU3RyZWFtUmV0dXJuTm9kZSxcbik6IHVua25vd24ge1xuICBjb25zdCBkZWZlcnJlZCA9IGN0eC5iYXNlLnJlZnMuZ2V0KG5vZGUuaSkgYXMgU3RyZWFtPHVua25vd24+IHwgdW5kZWZpbmVkO1xuICBpZiAoZGVmZXJyZWQpIHtcbiAgICB2YWxpZGF0ZU5vZGVUeXBlKGN0eCwgbm9kZSwgbm9kZS5pLCBTZXJvdmFsTm9kZVR5cGUuU3RyZWFtQ29uc3RydWN0b3IpO1xuICAgIGRlZmVycmVkLnJldHVybihkZXNlcmlhbGl6ZShjdHgsIGRlcHRoLCBub2RlLmYpKTtcbiAgICByZXR1cm4gTklMO1xuICB9XG4gIHRocm93IG5ldyBTZXJvdmFsTWlzc2luZ0luc3RhbmNlRXJyb3IoJ1N0cmVhbScpO1xufVxuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZUl0ZXJhdG9yRmFjdG9yeShcbiAgY3R4OiBEZXNlcmlhbGl6ZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBub2RlOiBTZXJvdmFsSXRlcmF0b3JGYWN0b3J5Tm9kZSxcbik6IHVua25vd24ge1xuICBkZXNlcmlhbGl6ZShjdHgsIGRlcHRoLCBub2RlLmYpO1xuICByZXR1cm4gTklMO1xufVxuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZUFzeW5jSXRlcmF0b3JGYWN0b3J5KFxuICBjdHg6IERlc2VyaWFsaXplckNvbnRleHQsXG4gIGRlcHRoOiBudW1iZXIsXG4gIG5vZGU6IFNlcm92YWxBc3luY0l0ZXJhdG9yRmFjdG9yeU5vZGUsXG4pOiB1bmtub3duIHtcbiAgZGVzZXJpYWxpemUoY3R4LCBkZXB0aCwgbm9kZS5hWzFdKTtcbiAgcmV0dXJuIE5JTDtcbn1cblxuZnVuY3Rpb24gZGVzZXJpYWxpemVTZXF1ZW5jZShcbiAgY3R4OiBEZXNlcmlhbGl6ZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBub2RlOiBTZXJvdmFsU2VxdWVuY2VOb2RlLFxuKTogU2VxdWVuY2Uge1xuICBjb25zdCByZXN1bHQgPSBhc3NpZ25JbmRleGVkVmFsdWUoXG4gICAgY3R4LFxuICAgIG5vZGUuaSxcbiAgICBjcmVhdGVTZXF1ZW5jZShbXSwgbm9kZS5zLCBub2RlLmwpLFxuICApO1xuICBmb3IgKGxldCBpID0gMCwgbGVuID0gbm9kZS5hLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgcmVzdWx0LnZbaV0gPSBkZXNlcmlhbGl6ZShjdHgsIGRlcHRoLCBub2RlLmFbaV0pO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGRlc2VyaWFsaXplKFxuICBjdHg6IERlc2VyaWFsaXplckNvbnRleHQsXG4gIGRlcHRoOiBudW1iZXIsXG4gIG5vZGU6IFNlcm92YWxOb2RlLFxuKTogdW5rbm93biB7XG4gIGlmIChkZXB0aCA+IGN0eC5iYXNlLmRlcHRoTGltaXQpIHtcbiAgICB0aHJvdyBuZXcgU2Vyb3ZhbERlcHRoTGltaXRFcnJvcihjdHguYmFzZS5kZXB0aExpbWl0KTtcbiAgfVxuICBkZXB0aCArPSAxO1xuICBzd2l0Y2ggKG5vZGUudCkge1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLkNvbnN0YW50OlxuICAgICAgcmV0dXJuIGRlc2VyaWFsaXplS25vd25WYWx1ZShub2RlLCBDT05TVEFOVF9WQUwsIG5vZGUucyk7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuTnVtYmVyOlxuICAgICAgcmV0dXJuIE51bWJlcihub2RlLnMpO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLlN0cmluZzpcbiAgICAgIHJldHVybiBkZXNlcmlhbGl6ZVN0cmluZyhTdHJpbmcobm9kZS5zKSk7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuQmlnSW50OlxuICAgICAgaWYgKFN0cmluZyhub2RlLnMpLmxlbmd0aCA+IE1BWF9CSUdJTlRfTEVOR1RIKSB7XG4gICAgICAgIHRocm93IG5ldyBTZXJvdmFsTWFsZm9ybWVkTm9kZUVycm9yKG5vZGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIEJpZ0ludChub2RlLnMpO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLkluZGV4ZWRWYWx1ZTpcbiAgICAgIHJldHVybiBjdHguYmFzZS5yZWZzLmdldChub2RlLmkpO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLlJlZmVyZW5jZTpcbiAgICAgIHJldHVybiBkZXNlcmlhbGl6ZVJlZmVyZW5jZShjdHgsIG5vZGUpO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLkFycmF5OlxuICAgICAgcmV0dXJuIGRlc2VyaWFsaXplQXJyYXkoY3R4LCBkZXB0aCwgbm9kZSk7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuT2JqZWN0OlxuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLk51bGxDb25zdHJ1Y3RvcjpcbiAgICAgIHJldHVybiBkZXNlcmlhbGl6ZU9iamVjdChjdHgsIGRlcHRoLCBub2RlKTtcbiAgICBjYXNlIFNlcm92YWxOb2RlVHlwZS5EYXRlOlxuICAgICAgcmV0dXJuIGRlc2VyaWFsaXplRGF0ZShjdHgsIG5vZGUpO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLlJlZ0V4cDpcbiAgICAgIHJldHVybiBkZXNlcmlhbGl6ZVJlZ0V4cChjdHgsIG5vZGUpO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLlNldDpcbiAgICAgIHJldHVybiBkZXNlcmlhbGl6ZVNldChjdHgsIGRlcHRoLCBub2RlKTtcbiAgICBjYXNlIFNlcm92YWxOb2RlVHlwZS5NYXA6XG4gICAgICByZXR1cm4gZGVzZXJpYWxpemVNYXAoY3R4LCBkZXB0aCwgbm9kZSk7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuQXJyYXlCdWZmZXI6XG4gICAgICByZXR1cm4gZGVzZXJpYWxpemVBcnJheUJ1ZmZlcihjdHgsIG5vZGUpO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLkJpZ0ludFR5cGVkQXJyYXk6XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuVHlwZWRBcnJheTpcbiAgICAgIHJldHVybiBkZXNlcmlhbGl6ZVR5cGVkQXJyYXkoY3R4LCBkZXB0aCwgbm9kZSk7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuRGF0YVZpZXc6XG4gICAgICByZXR1cm4gZGVzZXJpYWxpemVEYXRhVmlldyhjdHgsIGRlcHRoLCBub2RlKTtcbiAgICBjYXNlIFNlcm92YWxOb2RlVHlwZS5BZ2dyZWdhdGVFcnJvcjpcbiAgICAgIHJldHVybiBkZXNlcmlhbGl6ZUFnZ3JlZ2F0ZUVycm9yKGN0eCwgZGVwdGgsIG5vZGUpO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLkVycm9yOlxuICAgICAgcmV0dXJuIGRlc2VyaWFsaXplRXJyb3IoY3R4LCBkZXB0aCwgbm9kZSk7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuUHJvbWlzZTpcbiAgICAgIHJldHVybiBkZXNlcmlhbGl6ZVByb21pc2UoY3R4LCBkZXB0aCwgbm9kZSk7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuV0tTeW1ib2w6XG4gICAgICByZXR1cm4gZGVzZXJpYWxpemVLbm93blZhbHVlKG5vZGUsIFNZTUJPTF9SRUYsIG5vZGUucyk7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuQm94ZWQ6XG4gICAgICByZXR1cm4gZGVzZXJpYWxpemVCb3hlZChjdHgsIGRlcHRoLCBub2RlKTtcbiAgICBjYXNlIFNlcm92YWxOb2RlVHlwZS5QbHVnaW46XG4gICAgICByZXR1cm4gZGVzZXJpYWxpemVQbHVnaW4oY3R4LCBkZXB0aCwgbm9kZSk7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuUHJvbWlzZUNvbnN0cnVjdG9yOlxuICAgICAgcmV0dXJuIGRlc2VyaWFsaXplUHJvbWlzZUNvbnN0cnVjdG9yKGN0eCwgbm9kZSk7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuUHJvbWlzZVN1Y2Nlc3M6XG4gICAgICByZXR1cm4gZGVzZXJpYWxpemVQcm9taXNlUmVzb2x2ZShjdHgsIGRlcHRoLCBub2RlKTtcbiAgICBjYXNlIFNlcm92YWxOb2RlVHlwZS5Qcm9taXNlRmFpbHVyZTpcbiAgICAgIHJldHVybiBkZXNlcmlhbGl6ZVByb21pc2VSZWplY3QoY3R4LCBkZXB0aCwgbm9kZSk7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuSXRlcmF0b3JGYWN0b3J5SW5zdGFuY2U6XG4gICAgICByZXR1cm4gZGVzZXJpYWxpemVJdGVyYXRvckZhY3RvcnlJbnN0YW5jZShjdHgsIGRlcHRoLCBub2RlKTtcbiAgICBjYXNlIFNlcm92YWxOb2RlVHlwZS5Bc3luY0l0ZXJhdG9yRmFjdG9yeUluc3RhbmNlOlxuICAgICAgcmV0dXJuIGRlc2VyaWFsaXplQXN5bmNJdGVyYXRvckZhY3RvcnlJbnN0YW5jZShjdHgsIGRlcHRoLCBub2RlKTtcbiAgICBjYXNlIFNlcm92YWxOb2RlVHlwZS5TdHJlYW1Db25zdHJ1Y3RvcjpcbiAgICAgIHJldHVybiBkZXNlcmlhbGl6ZVN0cmVhbUNvbnN0cnVjdG9yKGN0eCwgZGVwdGgsIG5vZGUpO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLlN0cmVhbU5leHQ6XG4gICAgICByZXR1cm4gZGVzZXJpYWxpemVTdHJlYW1OZXh0KGN0eCwgZGVwdGgsIG5vZGUpO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLlN0cmVhbVRocm93OlxuICAgICAgcmV0dXJuIGRlc2VyaWFsaXplU3RyZWFtVGhyb3coY3R4LCBkZXB0aCwgbm9kZSk7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuU3RyZWFtUmV0dXJuOlxuICAgICAgcmV0dXJuIGRlc2VyaWFsaXplU3RyZWFtUmV0dXJuKGN0eCwgZGVwdGgsIG5vZGUpO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLkl0ZXJhdG9yRmFjdG9yeTpcbiAgICAgIHJldHVybiBkZXNlcmlhbGl6ZUl0ZXJhdG9yRmFjdG9yeShjdHgsIGRlcHRoLCBub2RlKTtcbiAgICBjYXNlIFNlcm92YWxOb2RlVHlwZS5Bc3luY0l0ZXJhdG9yRmFjdG9yeTpcbiAgICAgIHJldHVybiBkZXNlcmlhbGl6ZUFzeW5jSXRlcmF0b3JGYWN0b3J5KGN0eCwgZGVwdGgsIG5vZGUpO1xuICAgIC8vIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLlNwZWNpYWxSZWZlcmVuY2U6XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuU2VxdWVuY2U6XG4gICAgICByZXR1cm4gZGVzZXJpYWxpemVTZXF1ZW5jZShjdHgsIGRlcHRoLCBub2RlKTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IFNlcm92YWxVbnN1cHBvcnRlZE5vZGVFcnJvcihub2RlKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVzZXJpYWxpemVUb3AoXG4gIGN0eDogRGVzZXJpYWxpemVyQ29udGV4dCxcbiAgbm9kZTogU2Vyb3ZhbE5vZGUsXG4pOiB1bmtub3duIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVzZXJpYWxpemUoY3R4LCAwLCBub2RlKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgU2Vyb3ZhbERlc2VyaWFsaXphdGlvbkVycm9yKGVycm9yKTtcbiAgfVxufVxuIiwiZGVjbGFyZSBjb25zdCBUOiB1bmtub3duO1xuXG5jb25zdCBSRVRVUk4gPSAoKSA9PiBUO1xuY29uc3QgU0VSSUFMSVpFRF9SRVRVUk4gPSAvKiBAX19QVVJFX18gKi8gUkVUVVJOLnRvU3RyaW5nKCk7XG5cbmNvbnN0IElTX01PREVSTiA9IC8qIEBfX1BVUkVfXyAqLyAvPT4vLnRlc3QoU0VSSUFMSVpFRF9SRVRVUk4pO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRnVuY3Rpb24ocGFyYW1ldGVyczogc3RyaW5nW10sIGJvZHk6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChJU19NT0RFUk4pIHtcbiAgICBjb25zdCBqb2luZWQgPVxuICAgICAgcGFyYW1ldGVycy5sZW5ndGggPT09IDFcbiAgICAgICAgPyBwYXJhbWV0ZXJzWzBdXG4gICAgICAgIDogJygnICsgcGFyYW1ldGVycy5qb2luKCcsJykgKyAnKSc7XG4gICAgcmV0dXJuIGpvaW5lZCArICc9PicgKyAoYm9keS5zdGFydHNXaXRoKCd7JykgPyAnKCcgKyBib2R5ICsgJyknIDogYm9keSk7XG4gIH1cbiAgcmV0dXJuICdmdW5jdGlvbignICsgcGFyYW1ldGVycy5qb2luKCcsJykgKyAnKXtyZXR1cm4gJyArIGJvZHkgKyAnfSc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFZmZlY3RmdWxGdW5jdGlvbihcbiAgcGFyYW1ldGVyczogc3RyaW5nW10sXG4gIGJvZHk6IHN0cmluZyxcbik6IHN0cmluZyB7XG4gIGlmIChJU19NT0RFUk4pIHtcbiAgICBjb25zdCBqb2luZWQgPVxuICAgICAgcGFyYW1ldGVycy5sZW5ndGggPT09IDFcbiAgICAgICAgPyBwYXJhbWV0ZXJzWzBdXG4gICAgICAgIDogJygnICsgcGFyYW1ldGVycy5qb2luKCcsJykgKyAnKSc7XG4gICAgcmV0dXJuIGpvaW5lZCArICc9PnsnICsgYm9keSArICd9JztcbiAgfVxuICByZXR1cm4gJ2Z1bmN0aW9uKCcgKyBwYXJhbWV0ZXJzLmpvaW4oJywnKSArICcpeycgKyBib2R5ICsgJ30nO1xufVxuIiwiLy8gV3JpdHRlbiBieSBodHRwczovL2dpdGh1Yi5jb20vRHlsYW5QaWVyY2V5IGFuZCBpcyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5jb25zdCBSRUZfU1RBUlRfQ0hBUlMgPSAvKiBAX19QVVJFX18gKi8gJ2hqa21vcXV4ekFCQ0RFRkdISUpLTE5QUVJUVVZXWFlaJF8nOyAvLyBBdm9pZHMgY2hhcnMgdGhhdCBjb3VsZCBldmFsdWF0ZSB0byBhIHJlc2VydmVkIHdvcmQuXG5jb25zdCBSRUZfU1RBUlRfQ0hBUlNfTEVOID0gLyogQF9fUFVSRV9fICovIFJFRl9TVEFSVF9DSEFSUy5sZW5ndGg7XG5jb25zdCBSRUZfQ0hBUlMgPVxuICAvKiBAX19QVVJFX18gKi8gJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVowMTIzNDU2Nzg5JF8nO1xuY29uc3QgUkVGX0NIQVJTX0xFTiA9IC8qIEBfX1BVUkVfXyAqLyBSRUZfQ0hBUlMubGVuZ3RoO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRJZGVudGlmaWVyKGluZGV4OiBudW1iZXIpOiBzdHJpbmcge1xuICBsZXQgbW9kID0gaW5kZXggJSBSRUZfU1RBUlRfQ0hBUlNfTEVOO1xuICBsZXQgcmVmID0gUkVGX1NUQVJUX0NIQVJTW21vZF07XG4gIGluZGV4ID0gKGluZGV4IC0gbW9kKSAvIFJFRl9TVEFSVF9DSEFSU19MRU47XG4gIHdoaWxlIChpbmRleCA+IDApIHtcbiAgICBtb2QgPSBpbmRleCAlIFJFRl9DSEFSU19MRU47XG4gICAgcmVmICs9IFJFRl9DSEFSU1ttb2RdO1xuICAgIGluZGV4ID0gKGluZGV4IC0gbW9kKSAvIFJFRl9DSEFSU19MRU47XG4gIH1cbiAgcmV0dXJuIHJlZjtcbn1cbiIsImNvbnN0IElERU5USUZJRVJfQ0hFQ0sgPSAvXlskQS1aX11bMC05QS1aXyRdKiQvaTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRJZGVudGlmaWVyKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBjaGFyID0gbmFtZVswXTtcbiAgcmV0dXJuIChcbiAgICAoY2hhciA9PT0gJyQnIHx8XG4gICAgICBjaGFyID09PSAnXycgfHxcbiAgICAgIChjaGFyID49ICdBJyAmJiBjaGFyIDw9ICdaJykgfHxcbiAgICAgIChjaGFyID49ICdhJyAmJiBjaGFyIDw9ICd6JykpICYmXG4gICAgSURFTlRJRklFUl9DSEVDSy50ZXN0KG5hbWUpXG4gICk7XG59XG4iLCJpbXBvcnQgeyBGZWF0dXJlIH0gZnJvbSAnLi4vY29tcGF0JztcbmltcG9ydCB7XG4gIENPTlNUQU5UX1NUUklORyxcbiAgRVJST1JfQ09OU1RSVUNUT1JfU1RSSU5HLFxuICBOSUwsXG4gIFNlcm92YWxOb2RlVHlwZSxcbiAgU2Vyb3ZhbE9iamVjdEZsYWdzLFxuICBTWU1CT0xfU1RSSU5HLFxufSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHtcbiAgU0VSSUFMSVpFRF9BU1lOQ19JVEVSQVRPUl9DT05TVFJVQ1RPUixcbiAgU0VSSUFMSVpFRF9JVEVSQVRPUl9DT05TVFJVQ1RPUixcbn0gZnJvbSAnLi4vY29uc3RydWN0b3JzJztcbmltcG9ydCB7XG4gIFNlcm92YWxNaXNzaW5nUGx1Z2luRXJyb3IsXG4gIFNlcm92YWxTZXJpYWxpemF0aW9uRXJyb3IsXG4gIFNlcm92YWxVbnN1cHBvcnRlZE5vZGVFcnJvcixcbn0gZnJvbSAnLi4vZXJyb3JzJztcbmltcG9ydCB7IGNyZWF0ZUVmZmVjdGZ1bEZ1bmN0aW9uLCBjcmVhdGVGdW5jdGlvbiB9IGZyb20gJy4uL2Z1bmN0aW9uLXN0cmluZyc7XG5pbXBvcnQgeyBHTE9CQUxfQ09OVEVYVF9SRUZFUkVOQ0VTLCBSRUZFUkVOQ0VTX0tFWSB9IGZyb20gJy4uL2tleXMnO1xuaW1wb3J0IHR5cGUgeyBQbHVnaW5BY2Nlc3NPcHRpb25zIH0gZnJvbSAnLi4vcGx1Z2luJztcbmltcG9ydCB7IFNlcm92YWxNb2RlIH0gZnJvbSAnLi4vcGx1Z2luJztcbmltcG9ydCB7IFNQRUNJQUxfUkVGX1NUUklORyB9IGZyb20gJy4uL3NwZWNpYWwtcmVmZXJlbmNlJztcbmltcG9ydCB7IHNlcmlhbGl6ZVN0cmluZyB9IGZyb20gJy4uL3N0cmluZyc7XG5pbXBvcnQgdHlwZSB7XG4gIFNlcm92YWxBZ2dyZWdhdGVFcnJvck5vZGUsXG4gIFNlcm92YWxBcnJheUJ1ZmZlck5vZGUsXG4gIFNlcm92YWxBcnJheU5vZGUsXG4gIFNlcm92YWxBc3luY0l0ZXJhdG9yRmFjdG9yeUluc3RhbmNlTm9kZSxcbiAgU2Vyb3ZhbEFzeW5jSXRlcmF0b3JGYWN0b3J5Tm9kZSxcbiAgU2Vyb3ZhbEJpZ0ludFR5cGVkQXJyYXlOb2RlLFxuICBTZXJvdmFsQm94ZWROb2RlLFxuICBTZXJvdmFsRGF0YVZpZXdOb2RlLFxuICBTZXJvdmFsRGF0ZU5vZGUsXG4gIFNlcm92YWxFcnJvck5vZGUsXG4gIFNlcm92YWxJbmRleGVkVmFsdWVOb2RlLFxuICBTZXJvdmFsSXRlcmF0b3JGYWN0b3J5SW5zdGFuY2VOb2RlLFxuICBTZXJvdmFsSXRlcmF0b3JGYWN0b3J5Tm9kZSxcbiAgU2Vyb3ZhbE1hcE5vZGUsXG4gIFNlcm92YWxOb2RlLFxuICBTZXJvdmFsTm9kZVdpdGhJRCxcbiAgU2Vyb3ZhbE51bGxDb25zdHJ1Y3Rvck5vZGUsXG4gIFNlcm92YWxPYmplY3ROb2RlLFxuICBTZXJvdmFsT2JqZWN0UmVjb3JkS2V5LFxuICBTZXJvdmFsT2JqZWN0UmVjb3JkTm9kZSxcbiAgU2Vyb3ZhbFBsdWdpbk5vZGUsXG4gIFNlcm92YWxQcm9taXNlQ29uc3RydWN0b3JOb2RlLFxuICBTZXJvdmFsUHJvbWlzZU5vZGUsXG4gIFNlcm92YWxQcm9taXNlUmVqZWN0Tm9kZSxcbiAgU2Vyb3ZhbFByb21pc2VSZXNvbHZlTm9kZSxcbiAgU2Vyb3ZhbFJlZmVyZW5jZU5vZGUsXG4gIFNlcm92YWxSZWdFeHBOb2RlLFxuICBTZXJvdmFsU2VxdWVuY2VOb2RlLFxuICBTZXJvdmFsU2V0Tm9kZSxcbiAgU2Vyb3ZhbFN0cmVhbUNvbnN0cnVjdG9yTm9kZSxcbiAgU2Vyb3ZhbFN0cmVhbU5leHROb2RlLFxuICBTZXJvdmFsU3RyZWFtUmV0dXJuTm9kZSxcbiAgU2Vyb3ZhbFN0cmVhbVRocm93Tm9kZSxcbiAgU2Vyb3ZhbFR5cGVkQXJyYXlOb2RlLFxufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgZ2V0SWRlbnRpZmllciBmcm9tICcuLi91dGlscy9nZXQtaWRlbnRpZmllcic7XG5pbXBvcnQgeyBpc1ZhbGlkSWRlbnRpZmllciB9IGZyb20gJy4uL3V0aWxzL2lzLXZhbGlkLWlkZW50aWZpZXInO1xuXG5jb25zdCBlbnVtIEFzc2lnbm1lbnRUeXBlIHtcbiAgSW5kZXggPSAwLFxuICBBZGQgPSAxLFxuICBTZXQgPSAyLFxuICBEZWxldGUgPSAzLFxufVxuXG5pbnRlcmZhY2UgSW5kZXhBc3NpZ25tZW50IHtcbiAgdDogQXNzaWdubWVudFR5cGUuSW5kZXg7XG4gIHM6IHN0cmluZztcbiAgazogdW5kZWZpbmVkO1xuICB2OiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBTZXRBc3NpZ25tZW50IHtcbiAgdDogQXNzaWdubWVudFR5cGUuU2V0O1xuICBzOiBzdHJpbmc7XG4gIGs6IHN0cmluZztcbiAgdjogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgQWRkQXNzaWdubWVudCB7XG4gIHQ6IEFzc2lnbm1lbnRUeXBlLkFkZDtcbiAgczogc3RyaW5nO1xuICBrOiB1bmRlZmluZWQ7XG4gIHY6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIERlbGV0ZUFzc2lnbm1lbnQge1xuICB0OiBBc3NpZ25tZW50VHlwZS5EZWxldGU7XG4gIHM6IHN0cmluZztcbiAgazogc3RyaW5nO1xuICB2OiB1bmRlZmluZWQ7XG59XG5cbi8vIEFycmF5IG9mIGFzc2lnbm1lbnRzIHRvIGJlIGRvbmUgKHVzZWQgZm9yIHJlY3Vyc2lvbilcbnR5cGUgQXNzaWdubWVudCA9XG4gIHwgSW5kZXhBc3NpZ25tZW50XG4gIHwgQWRkQXNzaWdubWVudFxuICB8IFNldEFzc2lnbm1lbnRcbiAgfCBEZWxldGVBc3NpZ25tZW50O1xuXG5leHBvcnQgaW50ZXJmYWNlIEZsYWdnZWRPYmplY3Qge1xuICB0eXBlOiBTZXJvdmFsT2JqZWN0RmxhZ3M7XG4gIHZhbHVlOiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGdldEFzc2lnbm1lbnRFeHByZXNzaW9uKGFzc2lnbm1lbnQ6IEFzc2lnbm1lbnQpOiBzdHJpbmcge1xuICBzd2l0Y2ggKGFzc2lnbm1lbnQudCkge1xuICAgIGNhc2UgQXNzaWdubWVudFR5cGUuSW5kZXg6XG4gICAgICByZXR1cm4gYXNzaWdubWVudC5zICsgJz0nICsgYXNzaWdubWVudC52O1xuICAgIGNhc2UgQXNzaWdubWVudFR5cGUuU2V0OlxuICAgICAgcmV0dXJuIGFzc2lnbm1lbnQucyArICcuc2V0KCcgKyBhc3NpZ25tZW50LmsgKyAnLCcgKyBhc3NpZ25tZW50LnYgKyAnKSc7XG4gICAgY2FzZSBBc3NpZ25tZW50VHlwZS5BZGQ6XG4gICAgICByZXR1cm4gYXNzaWdubWVudC5zICsgJy5hZGQoJyArIGFzc2lnbm1lbnQudiArICcpJztcbiAgICBjYXNlIEFzc2lnbm1lbnRUeXBlLkRlbGV0ZTpcbiAgICAgIHJldHVybiBhc3NpZ25tZW50LnMgKyAnLmRlbGV0ZSgnICsgYXNzaWdubWVudC5rICsgJyknO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1lcmdlQXNzaWdubWVudHMoYXNzaWdubWVudHM6IEFzc2lnbm1lbnRbXSk6IEFzc2lnbm1lbnRbXSB7XG4gIGNvbnN0IG5ld0Fzc2lnbm1lbnRzOiBBc3NpZ25tZW50W10gPSBbXTtcbiAgbGV0IGN1cnJlbnQgPSBhc3NpZ25tZW50c1swXTtcbiAgZm9yIChcbiAgICBsZXQgaSA9IDEsIGxlbiA9IGFzc2lnbm1lbnRzLmxlbmd0aCwgaXRlbTogQXNzaWdubWVudCwgcHJldiA9IGN1cnJlbnQ7XG4gICAgaSA8IGxlbjtcbiAgICBpKytcbiAgKSB7XG4gICAgaXRlbSA9IGFzc2lnbm1lbnRzW2ldO1xuICAgIGlmIChpdGVtLnQgPT09IEFzc2lnbm1lbnRUeXBlLkluZGV4ICYmIGl0ZW0udiA9PT0gcHJldi52KSB7XG4gICAgICAvLyBNZXJnZSBpZiB0aGUgcmlnaHQtaGFuZCB2YWx1ZSBpcyB0aGUgc2FtZVxuICAgICAgLy8gc2F2ZXMgYXQgbGVhc3QgMiBjaGFyc1xuICAgICAgY3VycmVudCA9IHtcbiAgICAgICAgdDogQXNzaWdubWVudFR5cGUuSW5kZXgsXG4gICAgICAgIHM6IGl0ZW0ucyxcbiAgICAgICAgazogTklMLFxuICAgICAgICB2OiBnZXRBc3NpZ25tZW50RXhwcmVzc2lvbihjdXJyZW50KSxcbiAgICAgIH0gYXMgSW5kZXhBc3NpZ25tZW50O1xuICAgIH0gZWxzZSBpZiAoaXRlbS50ID09PSBBc3NpZ25tZW50VHlwZS5TZXQgJiYgaXRlbS5zID09PSBwcmV2LnMpIHtcbiAgICAgIC8vIE1hcHMgaGFzIGNoYWluaW5nIG1ldGhvZHMsIG1lcmdlIGlmIHNvdXJjZSBpcyB0aGUgc2FtZVxuICAgICAgY3VycmVudCA9IHtcbiAgICAgICAgdDogQXNzaWdubWVudFR5cGUuU2V0LFxuICAgICAgICBzOiBnZXRBc3NpZ25tZW50RXhwcmVzc2lvbihjdXJyZW50KSxcbiAgICAgICAgazogaXRlbS5rLFxuICAgICAgICB2OiBpdGVtLnYsXG4gICAgICB9IGFzIFNldEFzc2lnbm1lbnQ7XG4gICAgfSBlbHNlIGlmIChpdGVtLnQgPT09IEFzc2lnbm1lbnRUeXBlLkFkZCAmJiBpdGVtLnMgPT09IHByZXYucykge1xuICAgICAgLy8gU2V0cyBoYXMgY2hhaW5pbmcgbWV0aG9kcyB0b29cbiAgICAgIGN1cnJlbnQgPSB7XG4gICAgICAgIHQ6IEFzc2lnbm1lbnRUeXBlLkFkZCxcbiAgICAgICAgczogZ2V0QXNzaWdubWVudEV4cHJlc3Npb24oY3VycmVudCksXG4gICAgICAgIGs6IE5JTCxcbiAgICAgICAgdjogaXRlbS52LFxuICAgICAgfSBhcyBBZGRBc3NpZ25tZW50O1xuICAgIH0gZWxzZSBpZiAoaXRlbS50ID09PSBBc3NpZ25tZW50VHlwZS5EZWxldGUgJiYgaXRlbS5zID09PSBwcmV2LnMpIHtcbiAgICAgIC8vIE1hcHMgaGFzIGNoYWluaW5nIG1ldGhvZHMsIG1lcmdlIGlmIHNvdXJjZSBpcyB0aGUgc2FtZVxuICAgICAgY3VycmVudCA9IHtcbiAgICAgICAgdDogQXNzaWdubWVudFR5cGUuRGVsZXRlLFxuICAgICAgICBzOiBnZXRBc3NpZ25tZW50RXhwcmVzc2lvbihjdXJyZW50KSxcbiAgICAgICAgazogaXRlbS5rLFxuICAgICAgICB2OiBOSUwsXG4gICAgICB9IGFzIERlbGV0ZUFzc2lnbm1lbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERpZmZlcmVudCBhc3NpZ25tZW50LCBwdXNoIGN1cnJlbnRcbiAgICAgIG5ld0Fzc2lnbm1lbnRzLnB1c2goY3VycmVudCk7XG4gICAgICBjdXJyZW50ID0gaXRlbTtcbiAgICB9XG4gICAgcHJldiA9IGl0ZW07XG4gIH1cblxuICBuZXdBc3NpZ25tZW50cy5wdXNoKGN1cnJlbnQpO1xuXG4gIHJldHVybiBuZXdBc3NpZ25tZW50cztcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUFzc2lnbm1lbnRzKGFzc2lnbm1lbnRzOiBBc3NpZ25tZW50W10pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICBpZiAoYXNzaWdubWVudHMubGVuZ3RoKSB7XG4gICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgIGNvbnN0IG1lcmdlZCA9IG1lcmdlQXNzaWdubWVudHMoYXNzaWdubWVudHMpO1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBtZXJnZWQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHJlc3VsdCArPSBnZXRBc3NpZ25tZW50RXhwcmVzc2lvbihtZXJnZWRbaV0pICsgJywnO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHJldHVybiBOSUw7XG59XG5cbmNvbnN0IE5VTExfQ09OU1RSVUNUT1IgPSAnT2JqZWN0LmNyZWF0ZShudWxsKSc7XG5jb25zdCBTRVRfQ09OU1RSVUNUT1IgPSAnbmV3IFNldCc7XG5jb25zdCBNQVBfQ09OU1RSVUNUT1IgPSAnbmV3IE1hcCc7XG5cbmNvbnN0IFBST01JU0VfUkVTT0xWRSA9ICdQcm9taXNlLnJlc29sdmUnO1xuY29uc3QgUFJPTUlTRV9SRUpFQ1QgPSAnUHJvbWlzZS5yZWplY3QnO1xuXG5jb25zdCBPQkpFQ1RfRkxBR19DT05TVFJVQ1RPUjogUmVjb3JkPFNlcm92YWxPYmplY3RGbGFncywgc3RyaW5nIHwgdW5kZWZpbmVkPiA9XG4gIHtcbiAgICBbU2Vyb3ZhbE9iamVjdEZsYWdzLkZyb3plbl06ICdPYmplY3QuZnJlZXplJyxcbiAgICBbU2Vyb3ZhbE9iamVjdEZsYWdzLlNlYWxlZF06ICdPYmplY3Quc2VhbCcsXG4gICAgW1Nlcm92YWxPYmplY3RGbGFncy5Ob25FeHRlbnNpYmxlXTogJ09iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucycsXG4gICAgW1Nlcm92YWxPYmplY3RGbGFncy5Ob25lXTogTklMLFxuICB9O1xuXG50eXBlIFNlcm92YWxOb2RlV2l0aFByb3BlcnRpZXMgPVxuICB8IFNlcm92YWxPYmplY3ROb2RlXG4gIHwgU2Vyb3ZhbE51bGxDb25zdHJ1Y3Rvck5vZGVcbiAgfCBTZXJvdmFsQWdncmVnYXRlRXJyb3JOb2RlXG4gIHwgU2Vyb3ZhbEVycm9yTm9kZTtcblxuZXhwb3J0IGludGVyZmFjZSBCYXNlU2VyaWFsaXplckNvbnRleHRPcHRpb25zIGV4dGVuZHMgUGx1Z2luQWNjZXNzT3B0aW9ucyB7XG4gIGZlYXR1cmVzOiBudW1iZXI7XG4gIG1hcmtlZFJlZnM6IG51bWJlcltdIHwgU2V0PG51bWJlcj47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmFzZVNlcmlhbGl6ZXJDb250ZXh0IGV4dGVuZHMgUGx1Z2luQWNjZXNzT3B0aW9ucyB7XG4gIHJlYWRvbmx5IG1vZGU6IFNlcm92YWxNb2RlO1xuXG4gIGZlYXR1cmVzOiBudW1iZXI7XG4gIC8qXG4gICAqIFRvIGNoZWNrIGlmIGFuIG9iamVjdCBpcyBzeW5jaHJvbm91c2x5IHJlZmVyZW5jaW5nIGl0c2VsZlxuICAgKi9cbiAgc3RhY2s6IG51bWJlcltdO1xuICAvKipcbiAgICogQXJyYXkgb2Ygb2JqZWN0IG11dGF0aW9uc1xuICAgKi9cbiAgZmxhZ3M6IEZsYWdnZWRPYmplY3RbXTtcbiAgLyoqXG4gICAqIEFycmF5IG9mIGFzc2lnbm1lbnRzIHRvIGJlIGRvbmUgKHVzZWQgZm9yIHJlY3Vyc2lvbilcbiAgICovXG4gIGFzc2lnbm1lbnRzOiBBc3NpZ25tZW50W107XG4gIC8qKlxuICAgKiBSZWZzIHRoYXQgYXJlLi4ucmVmZXJlbmNlZFxuICAgKi9cbiAgbWFya2VkOiBTZXQ8bnVtYmVyPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDcm9zc0NvbnRleHRPcHRpb25zIHtcbiAgc2NvcGVJZD86IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUJhc2VTZXJpYWxpemVyQ29udGV4dChcbiAgbW9kZTogU2Vyb3ZhbE1vZGUsXG4gIG9wdGlvbnM6IEJhc2VTZXJpYWxpemVyQ29udGV4dE9wdGlvbnMsXG4pOiBCYXNlU2VyaWFsaXplckNvbnRleHQge1xuICByZXR1cm4ge1xuICAgIG1vZGUsXG4gICAgcGx1Z2luczogb3B0aW9ucy5wbHVnaW5zLFxuICAgIGZlYXR1cmVzOiBvcHRpb25zLmZlYXR1cmVzLFxuICAgIG1hcmtlZDogbmV3IFNldChvcHRpb25zLm1hcmtlZFJlZnMpLFxuICAgIHN0YWNrOiBbXSxcbiAgICBmbGFnczogW10sXG4gICAgYXNzaWdubWVudHM6IFtdLFxuICB9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFZhbmlsbGFTZXJpYWxpemVyU3RhdGUge1xuICB2YWxpZDogTWFwPG51bWJlciwgbnVtYmVyPjtcbiAgdmFyczogc3RyaW5nW107XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVZhbmlsbGFTZXJpYWxpemVyU3RhdGUoKTogVmFuaWxsYVNlcmlhbGl6ZXJTdGF0ZSB7XG4gIHJldHVybiB7XG4gICAgdmFsaWQ6IG5ldyBNYXAoKSxcbiAgICB2YXJzOiBbXSxcbiAgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBWYW5pbGxhU2VyaWFsaXplckNvbnRleHQge1xuICBtb2RlOiBTZXJvdmFsTW9kZS5WYW5pbGxhO1xuICBiYXNlOiBCYXNlU2VyaWFsaXplckNvbnRleHQ7XG4gIHN0YXRlOiBWYW5pbGxhU2VyaWFsaXplclN0YXRlO1xuICBjaGlsZDogU2VyaWFsaXplUGx1Z2luQ29udGV4dCB8IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IHR5cGUgVmFuaWxsYVNlcmlhbGl6ZXJDb250ZXh0T3B0aW9ucyA9IEJhc2VTZXJpYWxpemVyQ29udGV4dE9wdGlvbnM7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVWYW5pbGxhU2VyaWFsaXplckNvbnRleHQoXG4gIG9wdGlvbnM6IFZhbmlsbGFTZXJpYWxpemVyQ29udGV4dE9wdGlvbnMsXG4pOiBWYW5pbGxhU2VyaWFsaXplckNvbnRleHQge1xuICByZXR1cm4ge1xuICAgIG1vZGU6IFNlcm92YWxNb2RlLlZhbmlsbGEsXG4gICAgYmFzZTogY3JlYXRlQmFzZVNlcmlhbGl6ZXJDb250ZXh0KFNlcm92YWxNb2RlLlZhbmlsbGEsIG9wdGlvbnMpLFxuICAgIHN0YXRlOiBjcmVhdGVWYW5pbGxhU2VyaWFsaXplclN0YXRlKCksXG4gICAgY2hpbGQ6IE5JTCxcbiAgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDcm9zc1NlcmlhbGl6ZXJDb250ZXh0IHtcbiAgbW9kZTogU2Vyb3ZhbE1vZGUuQ3Jvc3M7XG4gIGJhc2U6IEJhc2VTZXJpYWxpemVyQ29udGV4dDtcbiAgc3RhdGU6IENyb3NzQ29udGV4dE9wdGlvbnM7XG4gIGNoaWxkOiBTZXJpYWxpemVQbHVnaW5Db250ZXh0IHwgdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENyb3NzU2VyaWFsaXplckNvbnRleHRPcHRpb25zXG4gIGV4dGVuZHMgQmFzZVNlcmlhbGl6ZXJDb250ZXh0T3B0aW9ucyxcbiAgICBDcm9zc0NvbnRleHRPcHRpb25zIHtcbiAgLy8gZW1wdHlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNyb3NzU2VyaWFsaXplckNvbnRleHQoXG4gIG9wdGlvbnM6IENyb3NzU2VyaWFsaXplckNvbnRleHRPcHRpb25zLFxuKTogQ3Jvc3NTZXJpYWxpemVyQ29udGV4dCB7XG4gIHJldHVybiB7XG4gICAgbW9kZTogU2Vyb3ZhbE1vZGUuQ3Jvc3MsXG4gICAgYmFzZTogY3JlYXRlQmFzZVNlcmlhbGl6ZXJDb250ZXh0KFNlcm92YWxNb2RlLkNyb3NzLCBvcHRpb25zKSxcbiAgICBzdGF0ZTogb3B0aW9ucyxcbiAgICBjaGlsZDogTklMLFxuICB9O1xufVxuXG50eXBlIFNlcmlhbGl6ZXJDb250ZXh0ID0gVmFuaWxsYVNlcmlhbGl6ZXJDb250ZXh0IHwgQ3Jvc3NTZXJpYWxpemVyQ29udGV4dDtcblxuZXhwb3J0IGNsYXNzIFNlcmlhbGl6ZVBsdWdpbkNvbnRleHQge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wOiBTZXJpYWxpemVyQ29udGV4dCkge31cblxuICBzZXJpYWxpemUobm9kZTogU2Vyb3ZhbE5vZGUpIHtcbiAgICByZXR1cm4gc2VyaWFsaXplKHRoaXMuX3AsIG5vZGUpO1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgcmVmZXJlbmNlIHBhcmFtIChpZGVudGlmaWVyKSBmcm9tIHRoZSBnaXZlbiByZWZlcmVuY2UgSURcbiAqIENhbGxpbmcgdGhpcyBmdW5jdGlvbiBtZWFucyB0aGUgdmFsdWUgaGFzIGJlZW4gcmVmZXJlbmNlZCBzb21ld2hlcmVcbiAqL1xuZnVuY3Rpb24gZ2V0VmFuaWxsYVJlZlBhcmFtKFxuICBzdGF0ZTogVmFuaWxsYVNlcmlhbGl6ZXJTdGF0ZSxcbiAgaW5kZXg6IG51bWJlcixcbik6IHN0cmluZyB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHJlZmVyZW5jZSBJRCBmcm9tIGEgZ2l2ZW4gcmVmZXJlbmNlIElEXG4gICAqIFRoaXMgbmV3IHJlZmVyZW5jZSBJRCBtZWFucyB0aGF0IHRoZSByZWZlcmVuY2UgaXRzZWxmXG4gICAqIGhhcyBiZWVuIHJlZmVyZW5jZWQgYXQgbGVhc3Qgb25jZSwgYW5kIGlzIHVzZWQgdG8gZ2VuZXJhdGVcbiAgICogdGhlIHZhcmlhYmxlc1xuICAgKi9cbiAgbGV0IGFjdHVhbEluZGV4ID0gc3RhdGUudmFsaWQuZ2V0KGluZGV4KTtcbiAgaWYgKGFjdHVhbEluZGV4ID09IG51bGwpIHtcbiAgICBhY3R1YWxJbmRleCA9IHN0YXRlLnZhbGlkLnNpemU7XG4gICAgc3RhdGUudmFsaWQuc2V0KGluZGV4LCBhY3R1YWxJbmRleCk7XG4gIH1cbiAgbGV0IGlkZW50aWZpZXIgPSBzdGF0ZS52YXJzW2FjdHVhbEluZGV4XTtcbiAgaWYgKGlkZW50aWZpZXIgPT0gbnVsbCkge1xuICAgIGlkZW50aWZpZXIgPSBnZXRJZGVudGlmaWVyKGFjdHVhbEluZGV4KTtcbiAgICBzdGF0ZS52YXJzW2FjdHVhbEluZGV4XSA9IGlkZW50aWZpZXI7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXI7XG59XG5cbmZ1bmN0aW9uIGdldENyb3NzUmVmUGFyYW0oaWQ6IG51bWJlcik6IHN0cmluZyB7XG4gIHJldHVybiBHTE9CQUxfQ09OVEVYVF9SRUZFUkVOQ0VTICsgJ1snICsgaWQgKyAnXSc7XG59XG5cbi8qKlxuICogQ29udmVydHMgdGhlIElEIG9mIGEgcmVmZXJlbmNlIGludG8gYSBpZGVudGlmaWVyIHN0cmluZ1xuICogdGhhdCBpcyB1c2VkIHRvIHJlZmVyIHRvIHRoZSBvYmplY3QgaW5zdGFuY2UgaW4gdGhlXG4gKiBnZW5lcmF0ZWQgc2NyaXB0LlxuICovXG5mdW5jdGlvbiBnZXRSZWZQYXJhbShjdHg6IFNlcmlhbGl6ZXJDb250ZXh0LCBpZDogbnVtYmVyKTogc3RyaW5nIHtcbiAgcmV0dXJuIGN0eC5tb2RlID09PSBTZXJvdmFsTW9kZS5WYW5pbGxhXG4gICAgPyBnZXRWYW5pbGxhUmVmUGFyYW0oY3R4LnN0YXRlLCBpZClcbiAgICA6IGdldENyb3NzUmVmUGFyYW0oaWQpO1xufVxuXG5mdW5jdGlvbiBtYXJrU2VyaWFsaXplclJlZihjdHg6IEJhc2VTZXJpYWxpemVyQ29udGV4dCwgaWQ6IG51bWJlcik6IHZvaWQge1xuICBjdHgubWFya2VkLmFkZChpZCk7XG59XG5cbmZ1bmN0aW9uIGlzU2VyaWFsaXplclJlZk1hcmtlZChcbiAgY3R4OiBCYXNlU2VyaWFsaXplckNvbnRleHQsXG4gIGlkOiBudW1iZXIsXG4pOiBib29sZWFuIHtcbiAgcmV0dXJuIGN0eC5tYXJrZWQuaGFzKGlkKTtcbn1cblxuZnVuY3Rpb24gcHVzaE9iamVjdEZsYWcoXG4gIGN0eDogU2VyaWFsaXplckNvbnRleHQsXG4gIGZsYWc6IFNlcm92YWxPYmplY3RGbGFncyxcbiAgaWQ6IG51bWJlcixcbik6IHZvaWQge1xuICBpZiAoZmxhZyAhPT0gU2Vyb3ZhbE9iamVjdEZsYWdzLk5vbmUpIHtcbiAgICBtYXJrU2VyaWFsaXplclJlZihjdHguYmFzZSwgaWQpO1xuICAgIGN0eC5iYXNlLmZsYWdzLnB1c2goe1xuICAgICAgdHlwZTogZmxhZyxcbiAgICAgIHZhbHVlOiBnZXRSZWZQYXJhbShjdHgsIGlkKSxcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZXNvbHZlRmxhZ3MoY3R4OiBCYXNlU2VyaWFsaXplckNvbnRleHQpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICBsZXQgcmVzdWx0ID0gJyc7XG4gIGZvciAobGV0IGkgPSAwLCBjdXJyZW50ID0gY3R4LmZsYWdzLCBsZW4gPSBjdXJyZW50Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgY29uc3QgZmxhZyA9IGN1cnJlbnRbaV07XG4gICAgcmVzdWx0ICs9IE9CSkVDVF9GTEFHX0NPTlNUUlVDVE9SW2ZsYWcudHlwZV0gKyAnKCcgKyBmbGFnLnZhbHVlICsgJyksJztcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiByZXNvbHZlUGF0Y2hlcyhjdHg6IEJhc2VTZXJpYWxpemVyQ29udGV4dCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IGFzc2lnbm1lbnRzID0gcmVzb2x2ZUFzc2lnbm1lbnRzKGN0eC5hc3NpZ25tZW50cyk7XG4gIGNvbnN0IGZsYWdzID0gcmVzb2x2ZUZsYWdzKGN0eCk7XG4gIGlmIChhc3NpZ25tZW50cykge1xuICAgIGlmIChmbGFncykge1xuICAgICAgcmV0dXJuIGFzc2lnbm1lbnRzICsgZmxhZ3M7XG4gICAgfVxuICAgIHJldHVybiBhc3NpZ25tZW50cztcbiAgfVxuICByZXR1cm4gZmxhZ3M7XG59XG5cbi8qKlxuICogR2VuZXJhdGVzIHRoZSBpbmxpbmVkIGFzc2lnbm1lbnQgZm9yIHRoZSByZWZlcmVuY2VcbiAqIFRoaXMgaXMgZGlmZmVyZW50IGZyb20gdGhlIGFzc2lnbm1lbnRzIGFycmF5IGFzIHRoaXMgb25lXG4gKiBzaWduaWZpZXMgY3JlYXRpb24gcmF0aGVyIHRoYW4gbXV0YXRpb25cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQXNzaWdubWVudChcbiAgY3R4OiBCYXNlU2VyaWFsaXplckNvbnRleHQsXG4gIHNvdXJjZTogc3RyaW5nLFxuICB2YWx1ZTogc3RyaW5nLFxuKTogdm9pZCB7XG4gIGN0eC5hc3NpZ25tZW50cy5wdXNoKHtcbiAgICB0OiBBc3NpZ25tZW50VHlwZS5JbmRleCxcbiAgICBzOiBzb3VyY2UsXG4gICAgazogTklMLFxuICAgIHY6IHZhbHVlLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQWRkQXNzaWdubWVudChcbiAgY3R4OiBTZXJpYWxpemVyQ29udGV4dCxcbiAgcmVmOiBudW1iZXIsXG4gIHZhbHVlOiBzdHJpbmcsXG4pOiB2b2lkIHtcbiAgY3R4LmJhc2UuYXNzaWdubWVudHMucHVzaCh7XG4gICAgdDogQXNzaWdubWVudFR5cGUuQWRkLFxuICAgIHM6IGdldFJlZlBhcmFtKGN0eCwgcmVmKSxcbiAgICBrOiBOSUwsXG4gICAgdjogdmFsdWUsXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTZXRBc3NpZ25tZW50KFxuICBjdHg6IFNlcmlhbGl6ZXJDb250ZXh0LFxuICByZWY6IG51bWJlcixcbiAga2V5OiBzdHJpbmcsXG4gIHZhbHVlOiBzdHJpbmcsXG4pOiB2b2lkIHtcbiAgY3R4LmJhc2UuYXNzaWdubWVudHMucHVzaCh7XG4gICAgdDogQXNzaWdubWVudFR5cGUuU2V0LFxuICAgIHM6IGdldFJlZlBhcmFtKGN0eCwgcmVmKSxcbiAgICBrOiBrZXksXG4gICAgdjogdmFsdWUsXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVEZWxldGVBc3NpZ25tZW50KFxuICBjdHg6IFNlcmlhbGl6ZXJDb250ZXh0LFxuICByZWY6IG51bWJlcixcbiAga2V5OiBzdHJpbmcsXG4pOiB2b2lkIHtcbiAgY3R4LmJhc2UuYXNzaWdubWVudHMucHVzaCh7XG4gICAgdDogQXNzaWdubWVudFR5cGUuRGVsZXRlLFxuICAgIHM6IGdldFJlZlBhcmFtKGN0eCwgcmVmKSxcbiAgICBrOiBrZXksXG4gICAgdjogTklMLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQXJyYXlBc3NpZ24oXG4gIGN0eDogU2VyaWFsaXplckNvbnRleHQsXG4gIHJlZjogbnVtYmVyLFxuICBpbmRleDogbnVtYmVyIHwgc3RyaW5nLFxuICB2YWx1ZTogc3RyaW5nLFxuKTogdm9pZCB7XG4gIGNyZWF0ZUFzc2lnbm1lbnQoY3R4LmJhc2UsIGdldFJlZlBhcmFtKGN0eCwgcmVmKSArICdbJyArIGluZGV4ICsgJ10nLCB2YWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU9iamVjdEFzc2lnbihcbiAgY3R4OiBTZXJpYWxpemVyQ29udGV4dCxcbiAgcmVmOiBudW1iZXIsXG4gIGtleTogc3RyaW5nLFxuICB2YWx1ZTogc3RyaW5nLFxuKTogdm9pZCB7XG4gIGNyZWF0ZUFzc2lnbm1lbnQoY3R4LmJhc2UsIGdldFJlZlBhcmFtKGN0eCwgcmVmKSArICcuJyArIGtleSwgdmFsdWUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTZXF1ZW5jZUFzc2lnbihcbiAgY3R4OiBTZXJpYWxpemVyQ29udGV4dCxcbiAgcmVmOiBudW1iZXIsXG4gIGluZGV4OiBudW1iZXIgfCBzdHJpbmcsXG4gIHZhbHVlOiBzdHJpbmcsXG4pOiB2b2lkIHtcbiAgY3JlYXRlQXNzaWdubWVudChcbiAgICBjdHguYmFzZSxcbiAgICBnZXRSZWZQYXJhbShjdHgsIHJlZikgKyAnLnZbJyArIGluZGV4ICsgJ10nLFxuICAgIHZhbHVlLFxuICApO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgdmFsdWUgaXMgaW4gdGhlIHN0YWNrLiBTdGFjayBoZXJlIGlzIGEgcmVmZXJlbmNlXG4gKiBzdHJ1Y3R1cmUgdG8ga25vdyBpZiBhIG9iamVjdCBpcyB0byBiZSBhY2Nlc3NlZCBpbiBhIFREWi5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleGVkVmFsdWVJblN0YWNrKFxuICBjdHg6IEJhc2VTZXJpYWxpemVyQ29udGV4dCxcbiAgbm9kZTogU2Vyb3ZhbE5vZGUsXG4pOiBib29sZWFuIHtcbiAgcmV0dXJuIG5vZGUudCA9PT0gU2Vyb3ZhbE5vZGVUeXBlLkluZGV4ZWRWYWx1ZSAmJiBjdHguc3RhY2suaW5jbHVkZXMobm9kZS5pKTtcbn1cblxuLyoqXG4gKiBQcm9kdWNlcyBhbiBhc3NpZ25tZW50IGV4cHJlc3Npb24uIGBpZGAgZ2VuZXJhdGVzIGEgcmVmZXJlbmNlXG4gKiBwYXJhbWV0ZXIgKHRocm91Z2ggYGdldFJlZlBhcmFtYCkgYW5kIGhhcyB0aGUgb3B0aW9uIHRvXG4gKiByZXR1cm4gdGhlIHJlZmVyZW5jZSBwYXJhbWV0ZXIgZGlyZWN0bHkgb3IgYXNzaWduIGEgdmFsdWUgdG9cbiAqIGl0LlxuICovXG5mdW5jdGlvbiBhc3NpZ25JbmRleGVkVmFsdWUoXG4gIGN0eDogU2VyaWFsaXplckNvbnRleHQsXG4gIGluZGV4OiBudW1iZXIsXG4gIHZhbHVlOiBzdHJpbmcsXG4pOiBzdHJpbmcge1xuICBpZiAoXG4gICAgY3R4Lm1vZGUgPT09IFNlcm92YWxNb2RlLlZhbmlsbGEgJiZcbiAgICAhaXNTZXJpYWxpemVyUmVmTWFya2VkKGN0eC5iYXNlLCBpbmRleClcbiAgKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIC8qKlxuICAgKiBJbiBjcm9zcy1yZWZlcmVuY2UsIHdlIGhhdmUgdG8gYXNzdW1lIHRoYXRcbiAgICogZXZlcnkgcmVmZXJlbmNlIGFyZSBnb2luZyB0byBiZSByZWZlcmVuY2VkXG4gICAqIGluIHRoZSBmdXR1cmUsIGFuZCBzbyB3ZSBuZWVkIHRvIHN0b3JlXG4gICAqIGFsbCBvZiBpdCBpbnRvIHRoZSByZWZlcmVuY2UgYXJyYXkuXG4gICAqXG4gICAqIG90aGVyd2lzZSBpbiB2YW5pbGxhLCB3ZSBvbmx5IGRvIHRoaXMgaWYgaXRcbiAgICogaXMgYWN0dWFsbHkgcmVmZXJlbmNlZFxuICAgKi9cbiAgcmV0dXJuIGdldFJlZlBhcmFtKGN0eCwgaW5kZXgpICsgJz0nICsgdmFsdWU7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZVJlZmVyZW5jZShub2RlOiBTZXJvdmFsUmVmZXJlbmNlTm9kZSk6IHN0cmluZyB7XG4gIHJldHVybiBSRUZFUkVOQ0VTX0tFWSArICcuZ2V0KFwiJyArIG5vZGUucyArICdcIiknO1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVBcnJheUl0ZW0oXG4gIGN0eDogU2VyaWFsaXplckNvbnRleHQsXG4gIGlkOiBudW1iZXIsXG4gIGl0ZW06IFNlcm92YWxOb2RlIHwgMCxcbiAgaW5kZXg6IG51bWJlcixcbik6IHN0cmluZyB7XG4gIC8vIENoZWNrIGlmIGluZGV4IGlzIGEgaG9sZVxuICBpZiAoaXRlbSkge1xuICAgIC8vIENoZWNrIGlmIGl0ZW0gaXMgYSBwYXJlbnRcbiAgICBpZiAoaXNJbmRleGVkVmFsdWVJblN0YWNrKGN0eC5iYXNlLCBpdGVtKSkge1xuICAgICAgbWFya1NlcmlhbGl6ZXJSZWYoY3R4LmJhc2UsIGlkKTtcbiAgICAgIGNyZWF0ZUFycmF5QXNzaWduKFxuICAgICAgICBjdHgsXG4gICAgICAgIGlkLFxuICAgICAgICBpbmRleCxcbiAgICAgICAgZ2V0UmVmUGFyYW0oY3R4LCAoaXRlbSBhcyBTZXJvdmFsSW5kZXhlZFZhbHVlTm9kZSkuaSksXG4gICAgICApO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gc2VyaWFsaXplKGN0eCwgaXRlbSk7XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVBcnJheShcbiAgY3R4OiBTZXJpYWxpemVyQ29udGV4dCxcbiAgbm9kZTogU2Vyb3ZhbEFycmF5Tm9kZSxcbik6IHN0cmluZyB7XG4gIGNvbnN0IGlkID0gbm9kZS5pO1xuICBjb25zdCBsaXN0ID0gbm9kZS5hO1xuICBjb25zdCBsZW4gPSBsaXN0Lmxlbmd0aDtcbiAgaWYgKGxlbiA+IDApIHtcbiAgICBjdHguYmFzZS5zdGFjay5wdXNoKGlkKTtcbiAgICBsZXQgdmFsdWVzID0gc2VyaWFsaXplQXJyYXlJdGVtKGN0eCwgaWQsIGxpc3RbMF0sIDApO1xuICAgIC8vIFRoaXMgaXMgZGlmZmVyZW50IHRoYW4gTWFwIGFuZCBTZXRcbiAgICAvLyBiZWNhdXNlIHdlIGFsc28gbmVlZCB0byBzZXJpYWxpemVcbiAgICAvLyB0aGUgaG9sZXMgb2YgdGhlIEFycmF5XG4gICAgbGV0IGlzSG9sZXkgPSB2YWx1ZXMgPT09ICcnO1xuICAgIGZvciAobGV0IGkgPSAxLCBpdGVtOiBzdHJpbmc7IGkgPCBsZW47IGkrKykge1xuICAgICAgaXRlbSA9IHNlcmlhbGl6ZUFycmF5SXRlbShjdHgsIGlkLCBsaXN0W2ldLCBpKTtcbiAgICAgIHZhbHVlcyArPSAnLCcgKyBpdGVtO1xuICAgICAgaXNIb2xleSA9IGl0ZW0gPT09ICcnO1xuICAgIH1cbiAgICBjdHguYmFzZS5zdGFjay5wb3AoKTtcbiAgICBwdXNoT2JqZWN0RmxhZyhjdHgsIG5vZGUubywgbm9kZS5pKTtcbiAgICByZXR1cm4gJ1snICsgdmFsdWVzICsgKGlzSG9sZXkgPyAnLF0nIDogJ10nKTtcbiAgfVxuICByZXR1cm4gJ1tdJztcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplUHJvcGVydHkoXG4gIGN0eDogU2VyaWFsaXplckNvbnRleHQsXG4gIHNvdXJjZTogU2Vyb3ZhbE5vZGVXaXRoUHJvcGVydGllcyxcbiAga2V5OiBTZXJvdmFsT2JqZWN0UmVjb3JkS2V5LFxuICB2YWw6IFNlcm92YWxOb2RlLFxuKTogc3RyaW5nIHtcbiAgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc3QgY2hlY2sgPSBOdW1iZXIoa2V5KTtcbiAgICBjb25zdCBpc0lkZW50aWZpZXIgPVxuICAgICAgLy8gVGVzdCBpZiBrZXkgaXMgYSB2YWxpZCBwb3NpdGl2ZSBudW1iZXIgb3IgSlMgaWRlbnRpZmllclxuICAgICAgLy8gc28gdGhhdCB3ZSBkb24ndCBoYXZlIHRvIHNlcmlhbGl6ZSB0aGUga2V5IGFuZCB3cmFwIHdpdGggYnJhY2tldHNcbiAgICAgIChjaGVjayA+PSAwICYmXG4gICAgICAgIC8vIEl0J3MgYWxzbyBpbXBvcnRhbnQgdG8gY29uc2lkZXIgdGhhdCBpZiB0aGUga2V5IGlzXG4gICAgICAgIC8vIGluZGVlZCBudW1lcmljLCB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IHdoZW5cbiAgICAgICAgLy8gY29udmVydGVkIGJhY2sgaW50byBhIHN0cmluZywgaXQncyBzdGlsbCB0aGUgc2FtZVxuICAgICAgICAvLyB0byB0aGUgb3JpZ2luYWwga2V5LiBUaGlzIGFsbG93cyB1cyB0byBkaWZmZXJlbnRpYXRlXG4gICAgICAgIC8vIGtleXMgdGhhdCBoYXMgbnVtZXJpYyBmb3JtYXRzIGJ1dCBpbiBhIGRpZmZlcmVudFxuICAgICAgICAvLyBmb3JtYXQsIHdoaWNoIGNhbiBjYXVzZSB1bmludGVudGlvbmFsIGtleSBkZWNsYXJhdGlvblxuICAgICAgICAvLyBFeGFtcGxlOiB7IDB4MTogMSB9IHZzIHsgJzB4MSc6IDEgfVxuICAgICAgICBjaGVjay50b1N0cmluZygpID09PSBrZXkpIHx8XG4gICAgICBpc1ZhbGlkSWRlbnRpZmllcihrZXkpO1xuICAgIGlmIChpc0luZGV4ZWRWYWx1ZUluU3RhY2soY3R4LmJhc2UsIHZhbCkpIHtcbiAgICAgIGNvbnN0IHJlZlBhcmFtID0gZ2V0UmVmUGFyYW0oY3R4LCAodmFsIGFzIFNlcm92YWxJbmRleGVkVmFsdWVOb2RlKS5pKTtcbiAgICAgIG1hcmtTZXJpYWxpemVyUmVmKGN0eC5iYXNlLCBzb3VyY2UuaSk7XG4gICAgICAvLyBTdHJpY3QgaWRlbnRpZmllciBjaGVjaywgbWFrZSBzdXJlXG4gICAgICAvLyB0aGF0IGl0IGlzbid0IG51bWVyaWMgKGV4Y2VwdCBOYU4pXG4gICAgICBpZiAoaXNJZGVudGlmaWVyICYmIGNoZWNrICE9PSBjaGVjaykge1xuICAgICAgICBjcmVhdGVPYmplY3RBc3NpZ24oY3R4LCBzb3VyY2UuaSwga2V5LCByZWZQYXJhbSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjcmVhdGVBcnJheUFzc2lnbihcbiAgICAgICAgICBjdHgsXG4gICAgICAgICAgc291cmNlLmksXG4gICAgICAgICAgaXNJZGVudGlmaWVyID8ga2V5IDogJ1wiJyArIGtleSArICdcIicsXG4gICAgICAgICAgcmVmUGFyYW0sXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiAoaXNJZGVudGlmaWVyID8ga2V5IDogJ1wiJyArIGtleSArICdcIicpICsgJzonICsgc2VyaWFsaXplKGN0eCwgdmFsKTtcbiAgfVxuICByZXR1cm4gJ1snICsgc2VyaWFsaXplKGN0eCwga2V5KSArICddOicgKyBzZXJpYWxpemUoY3R4LCB2YWwpO1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVQcm9wZXJ0aWVzKFxuICBjdHg6IFNlcmlhbGl6ZXJDb250ZXh0LFxuICBzb3VyY2U6IFNlcm92YWxOb2RlV2l0aFByb3BlcnRpZXMsXG4gIHJlY29yZDogU2Vyb3ZhbE9iamVjdFJlY29yZE5vZGUsXG4pOiBzdHJpbmcge1xuICBjb25zdCBrZXlzID0gcmVjb3JkLms7XG4gIGNvbnN0IGxlbiA9IGtleXMubGVuZ3RoO1xuICBpZiAobGVuID4gMCkge1xuICAgIGNvbnN0IHZhbHVlcyA9IHJlY29yZC52O1xuICAgIGN0eC5iYXNlLnN0YWNrLnB1c2goc291cmNlLmkpO1xuICAgIGxldCByZXN1bHQgPSBzZXJpYWxpemVQcm9wZXJ0eShjdHgsIHNvdXJjZSwga2V5c1swXSwgdmFsdWVzWzBdKTtcbiAgICBmb3IgKGxldCBpID0gMSwgaXRlbSA9IHJlc3VsdDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpdGVtID0gc2VyaWFsaXplUHJvcGVydHkoY3R4LCBzb3VyY2UsIGtleXNbaV0sIHZhbHVlc1tpXSk7XG4gICAgICByZXN1bHQgKz0gKGl0ZW0gJiYgcmVzdWx0ICYmICcsJykgKyBpdGVtO1xuICAgIH1cbiAgICBjdHguYmFzZS5zdGFjay5wb3AoKTtcbiAgICByZXR1cm4gJ3snICsgcmVzdWx0ICsgJ30nO1xuICB9XG4gIHJldHVybiAne30nO1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVPYmplY3QoXG4gIGN0eDogU2VyaWFsaXplckNvbnRleHQsXG4gIG5vZGU6IFNlcm92YWxPYmplY3ROb2RlLFxuKTogc3RyaW5nIHtcbiAgcHVzaE9iamVjdEZsYWcoY3R4LCBub2RlLm8sIG5vZGUuaSk7XG4gIHJldHVybiBzZXJpYWxpemVQcm9wZXJ0aWVzKGN0eCwgbm9kZSwgbm9kZS5wKTtcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplV2l0aE9iamVjdEFzc2lnbihcbiAgY3R4OiBTZXJpYWxpemVyQ29udGV4dCxcbiAgc291cmNlOiBTZXJvdmFsTm9kZVdpdGhQcm9wZXJ0aWVzLFxuICB2YWx1ZTogU2Vyb3ZhbE9iamVjdFJlY29yZE5vZGUsXG4gIHNlcmlhbGl6ZWQ6IHN0cmluZyxcbik6IHN0cmluZyB7XG4gIGNvbnN0IGZpZWxkcyA9IHNlcmlhbGl6ZVByb3BlcnRpZXMoY3R4LCBzb3VyY2UsIHZhbHVlKTtcbiAgaWYgKGZpZWxkcyAhPT0gJ3t9Jykge1xuICAgIHJldHVybiAnT2JqZWN0LmFzc2lnbignICsgc2VyaWFsaXplZCArICcsJyArIGZpZWxkcyArICcpJztcbiAgfVxuICByZXR1cm4gc2VyaWFsaXplZDtcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplU3RyaW5nS2V5QXNzaWdubWVudChcbiAgY3R4OiBTZXJpYWxpemVyQ29udGV4dCxcbiAgc291cmNlOiBTZXJvdmFsTm9kZVdpdGhQcm9wZXJ0aWVzLFxuICBtYWluQXNzaWdubWVudHM6IEFzc2lnbm1lbnRbXSxcbiAga2V5OiBzdHJpbmcsXG4gIHZhbHVlOiBTZXJvdmFsTm9kZSxcbik6IHZvaWQge1xuICBjb25zdCBiYXNlID0gY3R4LmJhc2U7XG4gIGNvbnN0IHNlcmlhbGl6ZWQgPSBzZXJpYWxpemUoY3R4LCB2YWx1ZSk7XG4gIGNvbnN0IGNoZWNrID0gTnVtYmVyKGtleSk7XG4gIGNvbnN0IGlzSWRlbnRpZmllciA9XG4gICAgLy8gVGVzdCBpZiBrZXkgaXMgYSB2YWxpZCBwb3NpdGl2ZSBudW1iZXIgb3IgSlMgaWRlbnRpZmllclxuICAgIC8vIHNvIHRoYXQgd2UgZG9uJ3QgaGF2ZSB0byBzZXJpYWxpemUgdGhlIGtleSBhbmQgd3JhcCB3aXRoIGJyYWNrZXRzXG4gICAgKGNoZWNrID49IDAgJiZcbiAgICAgIC8vIEl0J3MgYWxzbyBpbXBvcnRhbnQgdG8gY29uc2lkZXIgdGhhdCBpZiB0aGUga2V5IGlzXG4gICAgICAvLyBpbmRlZWQgbnVtZXJpYywgd2UgbmVlZCB0byBtYWtlIHN1cmUgdGhhdCB3aGVuXG4gICAgICAvLyBjb252ZXJ0ZWQgYmFjayBpbnRvIGEgc3RyaW5nLCBpdCdzIHN0aWxsIHRoZSBzYW1lXG4gICAgICAvLyB0byB0aGUgb3JpZ2luYWwga2V5LiBUaGlzIGFsbG93cyB1cyB0byBkaWZmZXJlbnRpYXRlXG4gICAgICAvLyBrZXlzIHRoYXQgaGFzIG51bWVyaWMgZm9ybWF0cyBidXQgaW4gYSBkaWZmZXJlbnRcbiAgICAgIC8vIGZvcm1hdCwgd2hpY2ggY2FuIGNhdXNlIHVuaW50ZW50aW9uYWwga2V5IGRlY2xhcmF0aW9uXG4gICAgICAvLyBFeGFtcGxlOiB7IDB4MTogMSB9IHZzIHsgJzB4MSc6IDEgfVxuICAgICAgY2hlY2sudG9TdHJpbmcoKSA9PT0ga2V5KSB8fFxuICAgIGlzVmFsaWRJZGVudGlmaWVyKGtleSk7XG4gIGlmIChpc0luZGV4ZWRWYWx1ZUluU3RhY2soYmFzZSwgdmFsdWUpKSB7XG4gICAgLy8gU3RyaWN0IGlkZW50aWZpZXIgY2hlY2ssIG1ha2Ugc3VyZVxuICAgIC8vIHRoYXQgaXQgaXNuJ3QgbnVtZXJpYyAoZXhjZXB0IE5hTilcbiAgICBpZiAoaXNJZGVudGlmaWVyICYmIGNoZWNrICE9PSBjaGVjaykge1xuICAgICAgY3JlYXRlT2JqZWN0QXNzaWduKGN0eCwgc291cmNlLmksIGtleSwgc2VyaWFsaXplZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNyZWF0ZUFycmF5QXNzaWduKFxuICAgICAgICBjdHgsXG4gICAgICAgIHNvdXJjZS5pLFxuICAgICAgICBpc0lkZW50aWZpZXIgPyBrZXkgOiAnXCInICsga2V5ICsgJ1wiJyxcbiAgICAgICAgc2VyaWFsaXplZCxcbiAgICAgICk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IHBhcmVudEFzc2lnbm1lbnQgPSBiYXNlLmFzc2lnbm1lbnRzO1xuICAgIGJhc2UuYXNzaWdubWVudHMgPSBtYWluQXNzaWdubWVudHM7XG4gICAgaWYgKGlzSWRlbnRpZmllciAmJiBjaGVjayAhPT0gY2hlY2spIHtcbiAgICAgIGNyZWF0ZU9iamVjdEFzc2lnbihjdHgsIHNvdXJjZS5pLCBrZXksIHNlcmlhbGl6ZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjcmVhdGVBcnJheUFzc2lnbihcbiAgICAgICAgY3R4LFxuICAgICAgICBzb3VyY2UuaSxcbiAgICAgICAgaXNJZGVudGlmaWVyID8ga2V5IDogJ1wiJyArIGtleSArICdcIicsXG4gICAgICAgIHNlcmlhbGl6ZWQsXG4gICAgICApO1xuICAgIH1cbiAgICBiYXNlLmFzc2lnbm1lbnRzID0gcGFyZW50QXNzaWdubWVudDtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVBc3NpZ25tZW50KFxuICBjdHg6IFNlcmlhbGl6ZXJDb250ZXh0LFxuICBzb3VyY2U6IFNlcm92YWxOb2RlV2l0aFByb3BlcnRpZXMsXG4gIG1haW5Bc3NpZ25tZW50czogQXNzaWdubWVudFtdLFxuICBrZXk6IFNlcm92YWxPYmplY3RSZWNvcmRLZXksXG4gIHZhbHVlOiBTZXJvdmFsTm9kZSxcbik6IHZvaWQge1xuICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpIHtcbiAgICBzZXJpYWxpemVTdHJpbmdLZXlBc3NpZ25tZW50KGN0eCwgc291cmNlLCBtYWluQXNzaWdubWVudHMsIGtleSwgdmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGJhc2UgPSBjdHguYmFzZTtcbiAgICBjb25zdCBwYXJlbnQgPSBiYXNlLnN0YWNrO1xuICAgIGJhc2Uuc3RhY2sgPSBbXTtcbiAgICBjb25zdCBzZXJpYWxpemVkID0gc2VyaWFsaXplKGN0eCwgdmFsdWUpO1xuICAgIGJhc2Uuc3RhY2sgPSBwYXJlbnQ7XG4gICAgY29uc3QgcGFyZW50QXNzaWdubWVudCA9IGJhc2UuYXNzaWdubWVudHM7XG4gICAgYmFzZS5hc3NpZ25tZW50cyA9IG1haW5Bc3NpZ25tZW50cztcbiAgICBjcmVhdGVBcnJheUFzc2lnbihjdHgsIHNvdXJjZS5pLCBzZXJpYWxpemUoY3R4LCBrZXkpLCBzZXJpYWxpemVkKTtcbiAgICBiYXNlLmFzc2lnbm1lbnRzID0gcGFyZW50QXNzaWdubWVudDtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVBc3NpZ25tZW50cyhcbiAgY3R4OiBTZXJpYWxpemVyQ29udGV4dCxcbiAgc291cmNlOiBTZXJvdmFsTm9kZVdpdGhQcm9wZXJ0aWVzLFxuICBub2RlOiBTZXJvdmFsT2JqZWN0UmVjb3JkTm9kZSxcbik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IGtleXMgPSBub2RlLms7XG4gIGNvbnN0IGxlbiA9IGtleXMubGVuZ3RoO1xuICBpZiAobGVuID4gMCkge1xuICAgIGNvbnN0IG1haW5Bc3NpZ25tZW50czogQXNzaWdubWVudFtdID0gW107XG4gICAgY29uc3QgdmFsdWVzID0gbm9kZS52O1xuICAgIGN0eC5iYXNlLnN0YWNrLnB1c2goc291cmNlLmkpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHNlcmlhbGl6ZUFzc2lnbm1lbnQoY3R4LCBzb3VyY2UsIG1haW5Bc3NpZ25tZW50cywga2V5c1tpXSwgdmFsdWVzW2ldKTtcbiAgICB9XG4gICAgY3R4LmJhc2Uuc3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIHJlc29sdmVBc3NpZ25tZW50cyhtYWluQXNzaWdubWVudHMpO1xuICB9XG4gIHJldHVybiBOSUw7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZURpY3Rpb25hcnkoXG4gIGN0eDogU2VyaWFsaXplckNvbnRleHQsXG4gIG5vZGU6IFNlcm92YWxOb2RlV2l0aFByb3BlcnRpZXMsXG4gIGluaXQ6IHN0cmluZyxcbik6IHN0cmluZyB7XG4gIGlmIChub2RlLnApIHtcbiAgICBjb25zdCBiYXNlID0gY3R4LmJhc2U7XG4gICAgaWYgKGJhc2UuZmVhdHVyZXMgJiBGZWF0dXJlLk9iamVjdEFzc2lnbikge1xuICAgICAgaW5pdCA9IHNlcmlhbGl6ZVdpdGhPYmplY3RBc3NpZ24oY3R4LCBub2RlLCBub2RlLnAsIGluaXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtYXJrU2VyaWFsaXplclJlZihiYXNlLCBub2RlLmkpO1xuICAgICAgY29uc3QgYXNzaWdubWVudHMgPSBzZXJpYWxpemVBc3NpZ25tZW50cyhjdHgsIG5vZGUsIG5vZGUucCk7XG4gICAgICBpZiAoYXNzaWdubWVudHMpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAnKCcgK1xuICAgICAgICAgIGFzc2lnbkluZGV4ZWRWYWx1ZShjdHgsIG5vZGUuaSwgaW5pdCkgK1xuICAgICAgICAgICcsJyArXG4gICAgICAgICAgYXNzaWdubWVudHMgK1xuICAgICAgICAgIGdldFJlZlBhcmFtKGN0eCwgbm9kZS5pKSArXG4gICAgICAgICAgJyknXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBpbml0O1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVOdWxsQ29uc3RydWN0b3IoXG4gIGN0eDogU2VyaWFsaXplckNvbnRleHQsXG4gIG5vZGU6IFNlcm92YWxOdWxsQ29uc3RydWN0b3JOb2RlLFxuKTogc3RyaW5nIHtcbiAgcHVzaE9iamVjdEZsYWcoY3R4LCBub2RlLm8sIG5vZGUuaSk7XG4gIHJldHVybiBzZXJpYWxpemVEaWN0aW9uYXJ5KGN0eCwgbm9kZSwgTlVMTF9DT05TVFJVQ1RPUik7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZURhdGUobm9kZTogU2Vyb3ZhbERhdGVOb2RlKTogc3RyaW5nIHtcbiAgcmV0dXJuICduZXcgRGF0ZShcIicgKyBub2RlLnMgKyAnXCIpJztcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplUmVnRXhwKFxuICBjdHg6IFNlcmlhbGl6ZXJDb250ZXh0LFxuICBub2RlOiBTZXJvdmFsUmVnRXhwTm9kZSxcbik6IHN0cmluZyB7XG4gIGlmIChjdHguYmFzZS5mZWF0dXJlcyAmIEZlYXR1cmUuUmVnRXhwKSB7XG4gICAgcmV0dXJuICcvJyArIG5vZGUuYyArICcvJyArIG5vZGUubTtcbiAgfVxuICB0aHJvdyBuZXcgU2Vyb3ZhbFVuc3VwcG9ydGVkTm9kZUVycm9yKG5vZGUpO1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVTZXRJdGVtKFxuICBjdHg6IFNlcmlhbGl6ZXJDb250ZXh0LFxuICBpZDogbnVtYmVyLFxuICBpdGVtOiBTZXJvdmFsTm9kZSxcbik6IHN0cmluZyB7XG4gIGNvbnN0IGJhc2UgPSBjdHguYmFzZTtcbiAgaWYgKGlzSW5kZXhlZFZhbHVlSW5TdGFjayhiYXNlLCBpdGVtKSkge1xuICAgIG1hcmtTZXJpYWxpemVyUmVmKGJhc2UsIGlkKTtcbiAgICBjcmVhdGVBZGRBc3NpZ25tZW50KFxuICAgICAgY3R4LFxuICAgICAgaWQsXG4gICAgICBnZXRSZWZQYXJhbShjdHgsIChpdGVtIGFzIFNlcm92YWxJbmRleGVkVmFsdWVOb2RlKS5pKSxcbiAgICApO1xuICAgIHJldHVybiAnJztcbiAgfVxuICByZXR1cm4gc2VyaWFsaXplKGN0eCwgaXRlbSk7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZVNldChjdHg6IFNlcmlhbGl6ZXJDb250ZXh0LCBub2RlOiBTZXJvdmFsU2V0Tm9kZSk6IHN0cmluZyB7XG4gIGxldCBzZXJpYWxpemVkID0gU0VUX0NPTlNUUlVDVE9SO1xuICBjb25zdCBpdGVtcyA9IG5vZGUuYTtcbiAgY29uc3Qgc2l6ZSA9IGl0ZW1zLmxlbmd0aDtcbiAgY29uc3QgaWQgPSBub2RlLmk7XG4gIGlmIChzaXplID4gMCkge1xuICAgIGN0eC5iYXNlLnN0YWNrLnB1c2goaWQpO1xuICAgIGxldCByZXN1bHQgPSBzZXJpYWxpemVTZXRJdGVtKGN0eCwgaWQsIGl0ZW1zWzBdKTtcbiAgICBmb3IgKGxldCBpID0gMSwgaXRlbSA9IHJlc3VsdDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgaXRlbSA9IHNlcmlhbGl6ZVNldEl0ZW0oY3R4LCBpZCwgaXRlbXNbaV0pO1xuICAgICAgcmVzdWx0ICs9IChpdGVtICYmIHJlc3VsdCAmJiAnLCcpICsgaXRlbTtcbiAgICB9XG4gICAgY3R4LmJhc2Uuc3RhY2sucG9wKCk7XG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgc2VyaWFsaXplZCArPSAnKFsnICsgcmVzdWx0ICsgJ10pJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNlcmlhbGl6ZWQ7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZU1hcEVudHJ5KFxuICBjdHg6IFNlcmlhbGl6ZXJDb250ZXh0LFxuICBpZDogbnVtYmVyLFxuICBrZXk6IFNlcm92YWxOb2RlLFxuICB2YWw6IFNlcm92YWxOb2RlLFxuICBzZW50aW5lbDogc3RyaW5nLFxuKTogc3RyaW5nIHtcbiAgY29uc3QgYmFzZSA9IGN0eC5iYXNlO1xuICBpZiAoaXNJbmRleGVkVmFsdWVJblN0YWNrKGJhc2UsIGtleSkpIHtcbiAgICAvLyBDcmVhdGUgcmVmZXJlbmNlIGZvciB0aGUgbWFwIGluc3RhbmNlXG4gICAgY29uc3Qga2V5UmVmID0gZ2V0UmVmUGFyYW0oY3R4LCAoa2V5IGFzIFNlcm92YWxJbmRleGVkVmFsdWVOb2RlKS5pKTtcbiAgICBtYXJrU2VyaWFsaXplclJlZihiYXNlLCBpZCk7XG4gICAgLy8gQ2hlY2sgaWYgdmFsdWUgaXMgYSBwYXJlbnRcbiAgICBpZiAoaXNJbmRleGVkVmFsdWVJblN0YWNrKGJhc2UsIHZhbCkpIHtcbiAgICAgIGNvbnN0IHZhbHVlUmVmID0gZ2V0UmVmUGFyYW0oY3R4LCAodmFsIGFzIFNlcm92YWxJbmRleGVkVmFsdWVOb2RlKS5pKTtcbiAgICAgIC8vIFJlZ2lzdGVyIGFuIGFzc2lnbm1lbnQgc2luY2VcbiAgICAgIC8vIGJvdGgga2V5IGFuZCB2YWx1ZSBhcmUgYSBwYXJlbnQgb2YgdGhpc1xuICAgICAgLy8gTWFwIGluc3RhbmNlXG4gICAgICBjcmVhdGVTZXRBc3NpZ25tZW50KGN0eCwgaWQsIGtleVJlZiwgdmFsdWVSZWYpO1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICAvLyBSZXNldCB0aGUgc3RhY2tcbiAgICAvLyBUaGlzIGlzIHJlcXVpcmVkIGJlY2F1c2UgdGhlIHNlcmlhbGl6ZWRcbiAgICAvLyB2YWx1ZSBpcyBubyBsb25nZXIgcGFydCBvZiB0aGUgZXhwcmVzc2lvblxuICAgIC8vIHRyZWUgYW5kIGhhcyBiZWVuIG1vdmVkIHRvIHRoZSBkZWZlcnJlZFxuICAgIC8vIGFzc2lnbm1lbnRcbiAgICBpZiAoXG4gICAgICB2YWwudCAhPT0gU2Vyb3ZhbE5vZGVUeXBlLkluZGV4ZWRWYWx1ZSAmJlxuICAgICAgdmFsLmkgIT0gbnVsbCAmJlxuICAgICAgaXNTZXJpYWxpemVyUmVmTWFya2VkKGJhc2UsIHZhbC5pKVxuICAgICkge1xuICAgICAgLy8gV2UgdXNlIGEgdHJpY2sgaGVyZSB1c2luZyBzZXF1ZW5jZSAob3IgY29tbWEpIGV4cHJlc3Npb25zXG4gICAgICAvLyBiYXNpY2FsbHkgd2Ugc2VyaWFsaXplIHRoZSBpbnRlbmRlZCBvYmplY3QgaW4gcGxhY2UgV0lUSE9VVFxuICAgICAgLy8gYWN0dWFsbHkgcmV0dXJuaW5nIGl0LCB0aGlzIGlzIGJ5IHJldHVybmluZyBhIHBsYWNlaG9sZGVyXG4gICAgICAvLyB2YWx1ZSB0aGF0IHdlIHdpbGwgcmVtb3ZlIHNvbWV0aW1lIGFmdGVyLlxuICAgICAgY29uc3Qgc2VyaWFsaXplZCA9XG4gICAgICAgICcoJyArIHNlcmlhbGl6ZShjdHgsIHZhbCkgKyAnLFsnICsgc2VudGluZWwgKyAnLCcgKyBzZW50aW5lbCArICddKSc7XG4gICAgICBjcmVhdGVTZXRBc3NpZ25tZW50KGN0eCwgaWQsIGtleVJlZiwgZ2V0UmVmUGFyYW0oY3R4LCB2YWwuaSkpO1xuICAgICAgY3JlYXRlRGVsZXRlQXNzaWdubWVudChjdHgsIGlkLCBzZW50aW5lbCk7XG4gICAgICByZXR1cm4gc2VyaWFsaXplZDtcbiAgICB9XG4gICAgY29uc3QgcGFyZW50ID0gYmFzZS5zdGFjaztcbiAgICBiYXNlLnN0YWNrID0gW107XG4gICAgY3JlYXRlU2V0QXNzaWdubWVudChjdHgsIGlkLCBrZXlSZWYsIHNlcmlhbGl6ZShjdHgsIHZhbCkpO1xuICAgIGJhc2Uuc3RhY2sgPSBwYXJlbnQ7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGlmIChpc0luZGV4ZWRWYWx1ZUluU3RhY2soYmFzZSwgdmFsKSkge1xuICAgIC8vIENyZWF0ZSByZWYgZm9yIHRoZSBNYXAgaW5zdGFuY2VcbiAgICBjb25zdCB2YWx1ZVJlZiA9IGdldFJlZlBhcmFtKGN0eCwgKHZhbCBhcyBTZXJvdmFsSW5kZXhlZFZhbHVlTm9kZSkuaSk7XG4gICAgbWFya1NlcmlhbGl6ZXJSZWYoYmFzZSwgaWQpO1xuICAgIGlmIChcbiAgICAgIGtleS50ICE9PSBTZXJvdmFsTm9kZVR5cGUuSW5kZXhlZFZhbHVlICYmXG4gICAgICBrZXkuaSAhPSBudWxsICYmXG4gICAgICBpc1NlcmlhbGl6ZXJSZWZNYXJrZWQoYmFzZSwga2V5LmkpXG4gICAgKSB7XG4gICAgICBjb25zdCBzZXJpYWxpemVkID1cbiAgICAgICAgJygnICsgc2VyaWFsaXplKGN0eCwga2V5KSArICcsWycgKyBzZW50aW5lbCArICcsJyArIHNlbnRpbmVsICsgJ10pJztcbiAgICAgIGNyZWF0ZVNldEFzc2lnbm1lbnQoY3R4LCBpZCwgZ2V0UmVmUGFyYW0oY3R4LCBrZXkuaSksIHZhbHVlUmVmKTtcbiAgICAgIGNyZWF0ZURlbGV0ZUFzc2lnbm1lbnQoY3R4LCBpZCwgc2VudGluZWwpO1xuICAgICAgcmV0dXJuIHNlcmlhbGl6ZWQ7XG4gICAgfVxuICAgIC8vIFJlc2V0IHN0YWNrIGZvciB0aGUga2V5IHNlcmlhbGl6YXRpb25cbiAgICBjb25zdCBwYXJlbnQgPSBiYXNlLnN0YWNrO1xuICAgIGJhc2Uuc3RhY2sgPSBbXTtcbiAgICBjcmVhdGVTZXRBc3NpZ25tZW50KGN0eCwgaWQsIHNlcmlhbGl6ZShjdHgsIGtleSksIHZhbHVlUmVmKTtcbiAgICBiYXNlLnN0YWNrID0gcGFyZW50O1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHJldHVybiAnWycgKyBzZXJpYWxpemUoY3R4LCBrZXkpICsgJywnICsgc2VyaWFsaXplKGN0eCwgdmFsKSArICddJztcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplTWFwKGN0eDogU2VyaWFsaXplckNvbnRleHQsIG5vZGU6IFNlcm92YWxNYXBOb2RlKTogc3RyaW5nIHtcbiAgbGV0IHNlcmlhbGl6ZWQgPSBNQVBfQ09OU1RSVUNUT1I7XG4gIGNvbnN0IGtleXMgPSBub2RlLmUuaztcbiAgY29uc3Qgc2l6ZSA9IGtleXMubGVuZ3RoO1xuICBjb25zdCBpZCA9IG5vZGUuaTtcbiAgY29uc3Qgc2VudGluZWwgPSBub2RlLmY7XG4gIGNvbnN0IHNlbnRpbmVsSWQgPSBnZXRSZWZQYXJhbShjdHgsIHNlbnRpbmVsLmkpO1xuICBjb25zdCBiYXNlID0gY3R4LmJhc2U7XG4gIGlmIChzaXplID4gMCkge1xuICAgIGNvbnN0IHZhbHMgPSBub2RlLmUudjtcbiAgICBiYXNlLnN0YWNrLnB1c2goaWQpO1xuICAgIGxldCByZXN1bHQgPSBzZXJpYWxpemVNYXBFbnRyeShjdHgsIGlkLCBrZXlzWzBdLCB2YWxzWzBdLCBzZW50aW5lbElkKTtcbiAgICBmb3IgKGxldCBpID0gMSwgaXRlbSA9IHJlc3VsdDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgaXRlbSA9IHNlcmlhbGl6ZU1hcEVudHJ5KGN0eCwgaWQsIGtleXNbaV0sIHZhbHNbaV0sIHNlbnRpbmVsSWQpO1xuICAgICAgcmVzdWx0ICs9IChpdGVtICYmIHJlc3VsdCAmJiAnLCcpICsgaXRlbTtcbiAgICB9XG4gICAgYmFzZS5zdGFjay5wb3AoKTtcbiAgICAvLyBDaGVjayBpZiB0aGVyZSBhcmUgYW55IHZhbHVlc1xuICAgIC8vIHNvIHRoYXQgdGhlIGVtcHR5IE1hcCBjb25zdHJ1Y3RvclxuICAgIC8vIGNhbiBiZSB1c2VkIGluc3RlYWRcbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICBzZXJpYWxpemVkICs9ICcoWycgKyByZXN1bHQgKyAnXSknO1xuICAgIH1cbiAgfVxuICBpZiAoc2VudGluZWwudCA9PT0gU2Vyb3ZhbE5vZGVUeXBlLlNwZWNpYWxSZWZlcmVuY2UpIHtcbiAgICBtYXJrU2VyaWFsaXplclJlZihiYXNlLCBzZW50aW5lbC5pKTtcbiAgICBzZXJpYWxpemVkID0gJygnICsgc2VyaWFsaXplKGN0eCwgc2VudGluZWwpICsgJywnICsgc2VyaWFsaXplZCArICcpJztcbiAgfVxuICByZXR1cm4gc2VyaWFsaXplZDtcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplQXJyYXlCdWZmZXIoXG4gIGN0eDogU2VyaWFsaXplckNvbnRleHQsXG4gIG5vZGU6IFNlcm92YWxBcnJheUJ1ZmZlck5vZGUsXG4pOiBzdHJpbmcge1xuICByZXR1cm4gZ2V0Q29uc3RydWN0b3IoY3R4LCBub2RlLmYpICsgJyhcIicgKyBub2RlLnMgKyAnXCIpJztcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplVHlwZWRBcnJheShcbiAgY3R4OiBTZXJpYWxpemVyQ29udGV4dCxcbiAgbm9kZTogU2Vyb3ZhbFR5cGVkQXJyYXlOb2RlIHwgU2Vyb3ZhbEJpZ0ludFR5cGVkQXJyYXlOb2RlLFxuKTogc3RyaW5nIHtcbiAgcmV0dXJuIChcbiAgICAnbmV3ICcgK1xuICAgIG5vZGUuYyArXG4gICAgJygnICtcbiAgICBzZXJpYWxpemUoY3R4LCBub2RlLmYpICtcbiAgICAnLCcgK1xuICAgIG5vZGUuYiArXG4gICAgJywnICtcbiAgICBub2RlLmwgK1xuICAgICcpJ1xuICApO1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVEYXRhVmlldyhcbiAgY3R4OiBTZXJpYWxpemVyQ29udGV4dCxcbiAgbm9kZTogU2Vyb3ZhbERhdGFWaWV3Tm9kZSxcbik6IHN0cmluZyB7XG4gIHJldHVybiAoXG4gICAgJ25ldyBEYXRhVmlldygnICsgc2VyaWFsaXplKGN0eCwgbm9kZS5mKSArICcsJyArIG5vZGUuYiArICcsJyArIG5vZGUubCArICcpJ1xuICApO1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVBZ2dyZWdhdGVFcnJvcihcbiAgY3R4OiBTZXJpYWxpemVyQ29udGV4dCxcbiAgbm9kZTogU2Vyb3ZhbEFnZ3JlZ2F0ZUVycm9yTm9kZSxcbik6IHN0cmluZyB7XG4gIGNvbnN0IGlkID0gbm9kZS5pO1xuICAvLyBgQWdncmVnYXRlRXJyb3JgIG1pZ2h0J3ZlIGJlZW4gZXh0ZW5kZWRcbiAgLy8gZWl0aGVyIHRocm91Z2ggY2xhc3Mgb3IgY3VzdG9tIHByb3BlcnRpZXNcbiAgLy8gTWFrZSBzdXJlIHRvIGFzc2lnbiBleHRyYSBwcm9wZXJ0aWVzXG4gIGN0eC5iYXNlLnN0YWNrLnB1c2goaWQpO1xuICBjb25zdCBzZXJpYWxpemVkID0gc2VyaWFsaXplRGljdGlvbmFyeShcbiAgICBjdHgsXG4gICAgbm9kZSxcbiAgICAnbmV3IEFnZ3JlZ2F0ZUVycm9yKFtdLFwiJyArIG5vZGUubSArICdcIiknLFxuICApO1xuICBjdHguYmFzZS5zdGFjay5wb3AoKTtcbiAgcmV0dXJuIHNlcmlhbGl6ZWQ7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZUVycm9yKFxuICBjdHg6IFNlcmlhbGl6ZXJDb250ZXh0LFxuICBub2RlOiBTZXJvdmFsRXJyb3JOb2RlLFxuKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNlcmlhbGl6ZURpY3Rpb25hcnkoXG4gICAgY3R4LFxuICAgIG5vZGUsXG4gICAgJ25ldyAnICsgRVJST1JfQ09OU1RSVUNUT1JfU1RSSU5HW25vZGUuc10gKyAnKFwiJyArIG5vZGUubSArICdcIiknLFxuICApO1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVQcm9taXNlKFxuICBjdHg6IFNlcmlhbGl6ZXJDb250ZXh0LFxuICBub2RlOiBTZXJvdmFsUHJvbWlzZU5vZGUsXG4pOiBzdHJpbmcge1xuICBsZXQgc2VyaWFsaXplZDogc3RyaW5nO1xuICAvLyBDaGVjayBpZiByZXNvbHZlZCB2YWx1ZSBpcyBhIHBhcmVudCBleHByZXNzaW9uXG4gIGNvbnN0IGZ1bGZpbGxlZCA9IG5vZGUuZjtcbiAgY29uc3QgaWQgPSBub2RlLmk7XG4gIGNvbnN0IHByb21pc2VDb25zdHJ1Y3RvciA9IG5vZGUucyA/IFBST01JU0VfUkVTT0xWRSA6IFBST01JU0VfUkVKRUNUO1xuICBjb25zdCBiYXNlID0gY3R4LmJhc2U7XG4gIGlmIChpc0luZGV4ZWRWYWx1ZUluU3RhY2soYmFzZSwgZnVsZmlsbGVkKSkge1xuICAgIC8vIEEgUHJvbWlzZSB0cmljaywgcmVmZXJlbmNlIHRoZSB2YWx1ZVxuICAgIC8vIGluc2lkZSB0aGUgYHRoZW5gIGV4cHJlc3Npb24gc28gdGhhdFxuICAgIC8vIHRoZSBQcm9taXNlIGV2YWx1YXRlcyBhZnRlciB0aGUgcGFyZW50XG4gICAgLy8gaGFzIGluaXRpYWxpemVkXG4gICAgY29uc3QgcmVmID0gZ2V0UmVmUGFyYW0oY3R4LCAoZnVsZmlsbGVkIGFzIFNlcm92YWxJbmRleGVkVmFsdWVOb2RlKS5pKTtcbiAgICBzZXJpYWxpemVkID1cbiAgICAgIHByb21pc2VDb25zdHJ1Y3RvciArXG4gICAgICAobm9kZS5zXG4gICAgICAgID8gJygpLnRoZW4oJyArIGNyZWF0ZUZ1bmN0aW9uKFtdLCByZWYpICsgJyknXG4gICAgICAgIDogJygpLmNhdGNoKCcgKyBjcmVhdGVFZmZlY3RmdWxGdW5jdGlvbihbXSwgJ3Rocm93ICcgKyByZWYpICsgJyknKTtcbiAgfSBlbHNlIHtcbiAgICBiYXNlLnN0YWNrLnB1c2goaWQpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHNlcmlhbGl6ZShjdHgsIGZ1bGZpbGxlZCk7XG4gICAgYmFzZS5zdGFjay5wb3AoKTtcbiAgICAvLyBqdXN0IGlubGluZSB0aGUgdmFsdWUvcmVmZXJlbmNlIGhlcmVcbiAgICBzZXJpYWxpemVkID0gcHJvbWlzZUNvbnN0cnVjdG9yICsgJygnICsgcmVzdWx0ICsgJyknO1xuICB9XG4gIHJldHVybiBzZXJpYWxpemVkO1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVCb3hlZChcbiAgY3R4OiBTZXJpYWxpemVyQ29udGV4dCxcbiAgbm9kZTogU2Vyb3ZhbEJveGVkTm9kZSxcbik6IHN0cmluZyB7XG4gIHJldHVybiAnT2JqZWN0KCcgKyBzZXJpYWxpemUoY3R4LCBub2RlLmYpICsgJyknO1xufVxuXG5mdW5jdGlvbiBnZXRDb25zdHJ1Y3RvcihcbiAgY3R4OiBTZXJpYWxpemVyQ29udGV4dCxcbiAgbm9kZTogU2Vyb3ZhbE5vZGVXaXRoSUQsXG4pOiBzdHJpbmcge1xuICBjb25zdCBjdXJyZW50ID0gc2VyaWFsaXplKGN0eCwgbm9kZSk7XG4gIHJldHVybiBub2RlLnQgPT09IFNlcm92YWxOb2RlVHlwZS5JbmRleGVkVmFsdWVcbiAgICA/IGN1cnJlbnRcbiAgICA6ICcoJyArIGN1cnJlbnQgKyAnKSc7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZVByb21pc2VDb25zdHJ1Y3RvcihcbiAgY3R4OiBTZXJpYWxpemVyQ29udGV4dCxcbiAgbm9kZTogU2Vyb3ZhbFByb21pc2VDb25zdHJ1Y3Rvck5vZGUsXG4pOiBzdHJpbmcge1xuICBpZiAoY3R4Lm1vZGUgPT09IFNlcm92YWxNb2RlLlZhbmlsbGEpIHtcbiAgICB0aHJvdyBuZXcgU2Vyb3ZhbFVuc3VwcG9ydGVkTm9kZUVycm9yKG5vZGUpO1xuICB9XG4gIGNvbnN0IHJlc29sdmVyID0gYXNzaWduSW5kZXhlZFZhbHVlKFxuICAgIGN0eCxcbiAgICBub2RlLnMsXG4gICAgZ2V0Q29uc3RydWN0b3IoY3R4LCBub2RlLmYpICsgJygpJyxcbiAgKTtcbiAgcmV0dXJuICcoJyArIHJlc29sdmVyICsgJykucCc7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZVByb21pc2VSZXNvbHZlKFxuICBjdHg6IFNlcmlhbGl6ZXJDb250ZXh0LFxuICBub2RlOiBTZXJvdmFsUHJvbWlzZVJlc29sdmVOb2RlLFxuKTogc3RyaW5nIHtcbiAgaWYgKGN0eC5tb2RlID09PSBTZXJvdmFsTW9kZS5WYW5pbGxhKSB7XG4gICAgdGhyb3cgbmV3IFNlcm92YWxVbnN1cHBvcnRlZE5vZGVFcnJvcihub2RlKTtcbiAgfVxuICByZXR1cm4gKFxuICAgIGdldENvbnN0cnVjdG9yKGN0eCwgbm9kZS5hWzBdKSArXG4gICAgJygnICtcbiAgICBnZXRSZWZQYXJhbShjdHgsIG5vZGUuaSkgK1xuICAgICcsJyArXG4gICAgc2VyaWFsaXplKGN0eCwgbm9kZS5hWzFdKSArXG4gICAgJyknXG4gICk7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZVByb21pc2VSZWplY3QoXG4gIGN0eDogU2VyaWFsaXplckNvbnRleHQsXG4gIG5vZGU6IFNlcm92YWxQcm9taXNlUmVqZWN0Tm9kZSxcbik6IHN0cmluZyB7XG4gIGlmIChjdHgubW9kZSA9PT0gU2Vyb3ZhbE1vZGUuVmFuaWxsYSkge1xuICAgIHRocm93IG5ldyBTZXJvdmFsVW5zdXBwb3J0ZWROb2RlRXJyb3Iobm9kZSk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICBnZXRDb25zdHJ1Y3RvcihjdHgsIG5vZGUuYVswXSkgK1xuICAgICcoJyArXG4gICAgZ2V0UmVmUGFyYW0oY3R4LCBub2RlLmkpICtcbiAgICAnLCcgK1xuICAgIHNlcmlhbGl6ZShjdHgsIG5vZGUuYVsxXSkgK1xuICAgICcpJ1xuICApO1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVQbHVnaW4oXG4gIGN0eDogU2VyaWFsaXplckNvbnRleHQsXG4gIG5vZGU6IFNlcm92YWxQbHVnaW5Ob2RlLFxuKTogc3RyaW5nIHtcbiAgY29uc3QgY3VycmVudFBsdWdpbnMgPSBjdHguYmFzZS5wbHVnaW5zO1xuICBpZiAoY3VycmVudFBsdWdpbnMpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gY3VycmVudFBsdWdpbnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGN1cnJlbnRQbHVnaW5zW2ldO1xuICAgICAgaWYgKHBsdWdpbi50YWcgPT09IG5vZGUuYykge1xuICAgICAgICBpZiAoY3R4LmNoaWxkID09IG51bGwpIHtcbiAgICAgICAgICBjdHguY2hpbGQgPSBuZXcgU2VyaWFsaXplUGx1Z2luQ29udGV4dChjdHgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwbHVnaW4uc2VyaWFsaXplKG5vZGUucywgY3R4LmNoaWxkLCB7XG4gICAgICAgICAgaWQ6IG5vZGUuaSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBTZXJvdmFsTWlzc2luZ1BsdWdpbkVycm9yKG5vZGUuYyk7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZUl0ZXJhdG9yRmFjdG9yeShcbiAgY3R4OiBTZXJpYWxpemVyQ29udGV4dCxcbiAgbm9kZTogU2Vyb3ZhbEl0ZXJhdG9yRmFjdG9yeU5vZGUsXG4pOiBzdHJpbmcge1xuICBsZXQgcmVzdWx0ID0gJyc7XG4gIGxldCBpbml0aWFsaXplZCA9IGZhbHNlO1xuICBpZiAobm9kZS5mLnQgIT09IFNlcm92YWxOb2RlVHlwZS5JbmRleGVkVmFsdWUpIHtcbiAgICBtYXJrU2VyaWFsaXplclJlZihjdHguYmFzZSwgbm9kZS5mLmkpO1xuICAgIHJlc3VsdCA9ICcoJyArIHNlcmlhbGl6ZShjdHgsIG5vZGUuZikgKyAnLCc7XG4gICAgaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG4gIHJlc3VsdCArPSBhc3NpZ25JbmRleGVkVmFsdWUoXG4gICAgY3R4LFxuICAgIG5vZGUuaSxcbiAgICAnKCcgK1xuICAgICAgU0VSSUFMSVpFRF9JVEVSQVRPUl9DT05TVFJVQ1RPUiArXG4gICAgICAnKSgnICtcbiAgICAgIGdldFJlZlBhcmFtKGN0eCwgbm9kZS5mLmkpICtcbiAgICAgICcpJyxcbiAgKTtcbiAgaWYgKGluaXRpYWxpemVkKSB7XG4gICAgcmVzdWx0ICs9ICcpJztcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVJdGVyYXRvckZhY3RvcnlJbnN0YW5jZShcbiAgY3R4OiBTZXJpYWxpemVyQ29udGV4dCxcbiAgbm9kZTogU2Vyb3ZhbEl0ZXJhdG9yRmFjdG9yeUluc3RhbmNlTm9kZSxcbik6IHN0cmluZyB7XG4gIHJldHVybiBnZXRDb25zdHJ1Y3RvcihjdHgsIG5vZGUuYVswXSkgKyAnKCcgKyBzZXJpYWxpemUoY3R4LCBub2RlLmFbMV0pICsgJyknO1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVBc3luY0l0ZXJhdG9yRmFjdG9yeShcbiAgY3R4OiBTZXJpYWxpemVyQ29udGV4dCxcbiAgbm9kZTogU2Vyb3ZhbEFzeW5jSXRlcmF0b3JGYWN0b3J5Tm9kZSxcbik6IHN0cmluZyB7XG4gIGNvbnN0IHByb21pc2UgPSBub2RlLmFbMF07XG4gIGNvbnN0IHN5bWJvbCA9IG5vZGUuYVsxXTtcbiAgY29uc3QgYmFzZSA9IGN0eC5iYXNlO1xuXG4gIGxldCByZXN1bHQgPSAnJztcblxuICBpZiAocHJvbWlzZS50ICE9PSBTZXJvdmFsTm9kZVR5cGUuSW5kZXhlZFZhbHVlKSB7XG4gICAgbWFya1NlcmlhbGl6ZXJSZWYoYmFzZSwgcHJvbWlzZS5pKTtcbiAgICByZXN1bHQgKz0gJygnICsgc2VyaWFsaXplKGN0eCwgcHJvbWlzZSk7XG4gIH1cbiAgaWYgKHN5bWJvbC50ICE9PSBTZXJvdmFsTm9kZVR5cGUuSW5kZXhlZFZhbHVlKSB7XG4gICAgbWFya1NlcmlhbGl6ZXJSZWYoYmFzZSwgc3ltYm9sLmkpO1xuICAgIHJlc3VsdCArPSAocmVzdWx0ID8gJywnIDogJygnKSArIHNlcmlhbGl6ZShjdHgsIHN5bWJvbCk7XG4gIH1cbiAgaWYgKHJlc3VsdCkge1xuICAgIHJlc3VsdCArPSAnLCc7XG4gIH1cblxuICBjb25zdCBpdGVyYXRvciA9IGFzc2lnbkluZGV4ZWRWYWx1ZShcbiAgICBjdHgsXG4gICAgbm9kZS5pLFxuICAgICcoJyArXG4gICAgICBTRVJJQUxJWkVEX0FTWU5DX0lURVJBVE9SX0NPTlNUUlVDVE9SICtcbiAgICAgICcpKCcgK1xuICAgICAgZ2V0UmVmUGFyYW0oY3R4LCBzeW1ib2wuaSkgK1xuICAgICAgJywnICtcbiAgICAgIGdldFJlZlBhcmFtKGN0eCwgcHJvbWlzZS5pKSArXG4gICAgICAnKScsXG4gICk7XG5cbiAgaWYgKHJlc3VsdCkge1xuICAgIHJldHVybiByZXN1bHQgKyBpdGVyYXRvciArICcpJztcbiAgfVxuXG4gIHJldHVybiBpdGVyYXRvcjtcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplQXN5bmNJdGVyYXRvckZhY3RvcnlJbnN0YW5jZShcbiAgY3R4OiBTZXJpYWxpemVyQ29udGV4dCxcbiAgbm9kZTogU2Vyb3ZhbEFzeW5jSXRlcmF0b3JGYWN0b3J5SW5zdGFuY2VOb2RlLFxuKTogc3RyaW5nIHtcbiAgcmV0dXJuIGdldENvbnN0cnVjdG9yKGN0eCwgbm9kZS5hWzBdKSArICcoJyArIHNlcmlhbGl6ZShjdHgsIG5vZGUuYVsxXSkgKyAnKSc7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZVN0cmVhbUNvbnN0cnVjdG9yKFxuICBjdHg6IFNlcmlhbGl6ZXJDb250ZXh0LFxuICBub2RlOiBTZXJvdmFsU3RyZWFtQ29uc3RydWN0b3JOb2RlLFxuKTogc3RyaW5nIHtcbiAgY29uc3QgcmVzdWx0ID0gYXNzaWduSW5kZXhlZFZhbHVlKFxuICAgIGN0eCxcbiAgICBub2RlLmksXG4gICAgZ2V0Q29uc3RydWN0b3IoY3R4LCBub2RlLmYpICsgJygpJyxcbiAgKTtcbiAgY29uc3QgbGVuID0gbm9kZS5hLmxlbmd0aDtcbiAgaWYgKGxlbikge1xuICAgIGxldCB2YWx1ZXMgPSBzZXJpYWxpemUoY3R4LCBub2RlLmFbMF0pO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHZhbHVlcyArPSAnLCcgKyBzZXJpYWxpemUoY3R4LCBub2RlLmFbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gJygnICsgcmVzdWx0ICsgJywnICsgdmFsdWVzICsgJywnICsgZ2V0UmVmUGFyYW0oY3R4LCBub2RlLmkpICsgJyknO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZVN0cmVhbU5leHQoXG4gIGN0eDogU2VyaWFsaXplckNvbnRleHQsXG4gIG5vZGU6IFNlcm92YWxTdHJlYW1OZXh0Tm9kZSxcbik6IHN0cmluZyB7XG4gIHJldHVybiBnZXRSZWZQYXJhbShjdHgsIG5vZGUuaSkgKyAnLm5leHQoJyArIHNlcmlhbGl6ZShjdHgsIG5vZGUuZikgKyAnKSc7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZVN0cmVhbVRocm93KFxuICBjdHg6IFNlcmlhbGl6ZXJDb250ZXh0LFxuICBub2RlOiBTZXJvdmFsU3RyZWFtVGhyb3dOb2RlLFxuKTogc3RyaW5nIHtcbiAgcmV0dXJuIGdldFJlZlBhcmFtKGN0eCwgbm9kZS5pKSArICcudGhyb3coJyArIHNlcmlhbGl6ZShjdHgsIG5vZGUuZikgKyAnKSc7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZVN0cmVhbVJldHVybihcbiAgY3R4OiBTZXJpYWxpemVyQ29udGV4dCxcbiAgbm9kZTogU2Vyb3ZhbFN0cmVhbVJldHVybk5vZGUsXG4pOiBzdHJpbmcge1xuICByZXR1cm4gZ2V0UmVmUGFyYW0oY3R4LCBub2RlLmkpICsgJy5yZXR1cm4oJyArIHNlcmlhbGl6ZShjdHgsIG5vZGUuZikgKyAnKSc7XG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZVNlcXVlbmNlSXRlbShcbiAgY3R4OiBTZXJpYWxpemVyQ29udGV4dCxcbiAgaWQ6IG51bWJlcixcbiAgaW5kZXg6IG51bWJlcixcbiAgaXRlbTogU2Vyb3ZhbE5vZGUsXG4pOiBzdHJpbmcge1xuICBjb25zdCBiYXNlID0gY3R4LmJhc2U7XG4gIGlmIChpc0luZGV4ZWRWYWx1ZUluU3RhY2soYmFzZSwgaXRlbSkpIHtcbiAgICBtYXJrU2VyaWFsaXplclJlZihiYXNlLCBpZCk7XG4gICAgY3JlYXRlU2VxdWVuY2VBc3NpZ24oXG4gICAgICBjdHgsXG4gICAgICBpZCxcbiAgICAgIGluZGV4LFxuICAgICAgZ2V0UmVmUGFyYW0oY3R4LCAoaXRlbSBhcyBTZXJvdmFsSW5kZXhlZFZhbHVlTm9kZSkuaSksXG4gICAgKTtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgcmV0dXJuIHNlcmlhbGl6ZShjdHgsIGl0ZW0pO1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemVTZXF1ZW5jZShcbiAgY3R4OiBTZXJpYWxpemVyQ29udGV4dCxcbiAgbm9kZTogU2Vyb3ZhbFNlcXVlbmNlTm9kZSxcbik6IHN0cmluZyB7XG4gIGNvbnN0IGl0ZW1zID0gbm9kZS5hO1xuICBjb25zdCBzaXplID0gaXRlbXMubGVuZ3RoO1xuICBjb25zdCBpZCA9IG5vZGUuaTtcbiAgaWYgKHNpemUgPiAwKSB7XG4gICAgY3R4LmJhc2Uuc3RhY2sucHVzaChpZCk7XG4gICAgbGV0IHJlc3VsdCA9IHNlcmlhbGl6ZVNlcXVlbmNlSXRlbShjdHgsIGlkLCAwLCBpdGVtc1swXSk7XG4gICAgZm9yIChsZXQgaSA9IDEsIGl0ZW0gPSByZXN1bHQ7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgIGl0ZW0gPSBzZXJpYWxpemVTZXF1ZW5jZUl0ZW0oY3R4LCBpZCwgaSwgaXRlbXNbaV0pO1xuICAgICAgcmVzdWx0ICs9IChpdGVtICYmIHJlc3VsdCAmJiAnLCcpICsgaXRlbTtcbiAgICB9XG4gICAgY3R4LmJhc2Uuc3RhY2sucG9wKCk7XG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgJ3tfX1NFUk9WQUxfU0VRVUVOQ0VfXzohMCx2OlsnICtcbiAgICAgICAgcmVzdWx0ICtcbiAgICAgICAgJ10sdDonICtcbiAgICAgICAgbm9kZS5zICtcbiAgICAgICAgJyxkOicgK1xuICAgICAgICBub2RlLmwgK1xuICAgICAgICAnfSdcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIHJldHVybiAne19fU0VST1ZBTF9TRVFVRU5DRV9fOiEwLHY6W10sdDotMSxkOjB9Jztcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplQXNzaWduYWJsZShcbiAgY3R4OiBTZXJpYWxpemVyQ29udGV4dCxcbiAgbm9kZTogU2Vyb3ZhbE5vZGUsXG4pOiBzdHJpbmcge1xuICBzd2l0Y2ggKG5vZGUudCkge1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLldLU3ltYm9sOlxuICAgICAgcmV0dXJuIFNZTUJPTF9TVFJJTkdbbm9kZS5zXTtcbiAgICBjYXNlIFNlcm92YWxOb2RlVHlwZS5SZWZlcmVuY2U6XG4gICAgICByZXR1cm4gc2VyaWFsaXplUmVmZXJlbmNlKG5vZGUpO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLkFycmF5OlxuICAgICAgcmV0dXJuIHNlcmlhbGl6ZUFycmF5KGN0eCwgbm9kZSk7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuT2JqZWN0OlxuICAgICAgcmV0dXJuIHNlcmlhbGl6ZU9iamVjdChjdHgsIG5vZGUpO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLk51bGxDb25zdHJ1Y3RvcjpcbiAgICAgIHJldHVybiBzZXJpYWxpemVOdWxsQ29uc3RydWN0b3IoY3R4LCBub2RlKTtcbiAgICBjYXNlIFNlcm92YWxOb2RlVHlwZS5EYXRlOlxuICAgICAgcmV0dXJuIHNlcmlhbGl6ZURhdGUobm9kZSk7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuUmVnRXhwOlxuICAgICAgcmV0dXJuIHNlcmlhbGl6ZVJlZ0V4cChjdHgsIG5vZGUpO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLlNldDpcbiAgICAgIHJldHVybiBzZXJpYWxpemVTZXQoY3R4LCBub2RlKTtcbiAgICBjYXNlIFNlcm92YWxOb2RlVHlwZS5NYXA6XG4gICAgICByZXR1cm4gc2VyaWFsaXplTWFwKGN0eCwgbm9kZSk7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuQXJyYXlCdWZmZXI6XG4gICAgICByZXR1cm4gc2VyaWFsaXplQXJyYXlCdWZmZXIoY3R4LCBub2RlKTtcbiAgICBjYXNlIFNlcm92YWxOb2RlVHlwZS5CaWdJbnRUeXBlZEFycmF5OlxuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLlR5cGVkQXJyYXk6XG4gICAgICByZXR1cm4gc2VyaWFsaXplVHlwZWRBcnJheShjdHgsIG5vZGUpO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLkRhdGFWaWV3OlxuICAgICAgcmV0dXJuIHNlcmlhbGl6ZURhdGFWaWV3KGN0eCwgbm9kZSk7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuQWdncmVnYXRlRXJyb3I6XG4gICAgICByZXR1cm4gc2VyaWFsaXplQWdncmVnYXRlRXJyb3IoY3R4LCBub2RlKTtcbiAgICBjYXNlIFNlcm92YWxOb2RlVHlwZS5FcnJvcjpcbiAgICAgIHJldHVybiBzZXJpYWxpemVFcnJvcihjdHgsIG5vZGUpO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLlByb21pc2U6XG4gICAgICByZXR1cm4gc2VyaWFsaXplUHJvbWlzZShjdHgsIG5vZGUpO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLkJveGVkOlxuICAgICAgcmV0dXJuIHNlcmlhbGl6ZUJveGVkKGN0eCwgbm9kZSk7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuUHJvbWlzZUNvbnN0cnVjdG9yOlxuICAgICAgcmV0dXJuIHNlcmlhbGl6ZVByb21pc2VDb25zdHJ1Y3RvcihjdHgsIG5vZGUpO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLlBsdWdpbjpcbiAgICAgIHJldHVybiBzZXJpYWxpemVQbHVnaW4oY3R4LCBub2RlKTtcbiAgICBjYXNlIFNlcm92YWxOb2RlVHlwZS5TcGVjaWFsUmVmZXJlbmNlOlxuICAgICAgcmV0dXJuIFNQRUNJQUxfUkVGX1NUUklOR1tub2RlLnNdO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLlNlcXVlbmNlOlxuICAgICAgcmV0dXJuIHNlcmlhbGl6ZVNlcXVlbmNlKGN0eCwgbm9kZSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBTZXJvdmFsVW5zdXBwb3J0ZWROb2RlRXJyb3Iobm9kZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplKGN0eDogU2VyaWFsaXplckNvbnRleHQsIG5vZGU6IFNlcm92YWxOb2RlKTogc3RyaW5nIHtcbiAgc3dpdGNoIChub2RlLnQpIHtcbiAgICBjYXNlIFNlcm92YWxOb2RlVHlwZS5Db25zdGFudDpcbiAgICAgIHJldHVybiBDT05TVEFOVF9TVFJJTkdbbm9kZS5zXTtcbiAgICBjYXNlIFNlcm92YWxOb2RlVHlwZS5OdW1iZXI6XG4gICAgICByZXR1cm4gJycgKyBub2RlLnM7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuU3RyaW5nOlxuICAgICAgcmV0dXJuICdcIicgKyBub2RlLnMgKyAnXCInO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLkJpZ0ludDpcbiAgICAgIHJldHVybiBub2RlLnMgKyAnbic7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuSW5kZXhlZFZhbHVlOlxuICAgICAgcmV0dXJuIGdldFJlZlBhcmFtKGN0eCwgbm9kZS5pKTtcbiAgICBjYXNlIFNlcm92YWxOb2RlVHlwZS5Qcm9taXNlU3VjY2VzczpcbiAgICAgIHJldHVybiBzZXJpYWxpemVQcm9taXNlUmVzb2x2ZShjdHgsIG5vZGUpO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLlByb21pc2VGYWlsdXJlOlxuICAgICAgcmV0dXJuIHNlcmlhbGl6ZVByb21pc2VSZWplY3QoY3R4LCBub2RlKTtcbiAgICBjYXNlIFNlcm92YWxOb2RlVHlwZS5JdGVyYXRvckZhY3Rvcnk6XG4gICAgICByZXR1cm4gc2VyaWFsaXplSXRlcmF0b3JGYWN0b3J5KGN0eCwgbm9kZSk7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuSXRlcmF0b3JGYWN0b3J5SW5zdGFuY2U6XG4gICAgICByZXR1cm4gc2VyaWFsaXplSXRlcmF0b3JGYWN0b3J5SW5zdGFuY2UoY3R4LCBub2RlKTtcbiAgICBjYXNlIFNlcm92YWxOb2RlVHlwZS5Bc3luY0l0ZXJhdG9yRmFjdG9yeTpcbiAgICAgIHJldHVybiBzZXJpYWxpemVBc3luY0l0ZXJhdG9yRmFjdG9yeShjdHgsIG5vZGUpO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLkFzeW5jSXRlcmF0b3JGYWN0b3J5SW5zdGFuY2U6XG4gICAgICByZXR1cm4gc2VyaWFsaXplQXN5bmNJdGVyYXRvckZhY3RvcnlJbnN0YW5jZShjdHgsIG5vZGUpO1xuICAgIGNhc2UgU2Vyb3ZhbE5vZGVUeXBlLlN0cmVhbUNvbnN0cnVjdG9yOlxuICAgICAgcmV0dXJuIHNlcmlhbGl6ZVN0cmVhbUNvbnN0cnVjdG9yKGN0eCwgbm9kZSk7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuU3RyZWFtTmV4dDpcbiAgICAgIHJldHVybiBzZXJpYWxpemVTdHJlYW1OZXh0KGN0eCwgbm9kZSk7XG4gICAgY2FzZSBTZXJvdmFsTm9kZVR5cGUuU3RyZWFtVGhyb3c6XG4gICAgICByZXR1cm4gc2VyaWFsaXplU3RyZWFtVGhyb3coY3R4LCBub2RlKTtcbiAgICBjYXNlIFNlcm92YWxOb2RlVHlwZS5TdHJlYW1SZXR1cm46XG4gICAgICByZXR1cm4gc2VyaWFsaXplU3RyZWFtUmV0dXJuKGN0eCwgbm9kZSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBhc3NpZ25JbmRleGVkVmFsdWUoY3R4LCBub2RlLmksIHNlcmlhbGl6ZUFzc2lnbmFibGUoY3R4LCBub2RlKSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZVJvb3QoXG4gIGN0eDogU2VyaWFsaXplckNvbnRleHQsXG4gIG5vZGU6IFNlcm92YWxOb2RlLFxuKTogc3RyaW5nIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gc2VyaWFsaXplKGN0eCwgbm9kZSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgZXJyb3IgaW5zdGFuY2VvZiBTZXJvdmFsU2VyaWFsaXphdGlvbkVycm9yXG4gICAgICA/IGVycm9yXG4gICAgICA6IG5ldyBTZXJvdmFsU2VyaWFsaXphdGlvbkVycm9yKGVycm9yKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplVG9wVmFuaWxsYShcbiAgY3R4OiBWYW5pbGxhU2VyaWFsaXplckNvbnRleHQsXG4gIHRyZWU6IFNlcm92YWxOb2RlLFxuKTogc3RyaW5nIHtcbiAgY29uc3QgcmVzdWx0ID0gc2VyaWFsaXplKGN0eCwgdHJlZSk7XG4gIC8vIFNoYXJlZCByZWZlcmVuY2VzIGRldGVjdGVkXG4gIGlmICh0cmVlLmkgIT0gbnVsbCAmJiBjdHguc3RhdGUudmFycy5sZW5ndGgpIHtcbiAgICBjb25zdCBwYXRjaGVzID0gcmVzb2x2ZVBhdGNoZXMoY3R4LmJhc2UpO1xuICAgIGxldCBib2R5ID0gcmVzdWx0O1xuICAgIGlmIChwYXRjaGVzKSB7XG4gICAgICAvLyBHZXQgKG9yIGNyZWF0ZSkgYSByZWYgZnJvbSB0aGUgc291cmNlXG4gICAgICBjb25zdCBpbmRleCA9IGdldFJlZlBhcmFtKGN0eCwgdHJlZS5pKTtcbiAgICAgIGJvZHkgPSByZXN1bHQgKyAnLCcgKyBwYXRjaGVzICsgaW5kZXg7XG4gICAgICBpZiAoIXJlc3VsdC5zdGFydHNXaXRoKGluZGV4ICsgJz0nKSkge1xuICAgICAgICBib2R5ID0gaW5kZXggKyAnPScgKyBib2R5O1xuICAgICAgfVxuICAgICAgYm9keSA9ICcoJyArIGJvZHkgKyAnKSc7XG4gICAgfVxuICAgIHJldHVybiAnKCcgKyBjcmVhdGVGdW5jdGlvbihjdHguc3RhdGUudmFycywgYm9keSkgKyAnKSgpJztcbiAgfVxuICBpZiAodHJlZS50ID09PSBTZXJvdmFsTm9kZVR5cGUuT2JqZWN0KSB7XG4gICAgcmV0dXJuICcoJyArIHJlc3VsdCArICcpJztcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplVG9wQ3Jvc3MoXG4gIGN0eDogQ3Jvc3NTZXJpYWxpemVyQ29udGV4dCxcbiAgdHJlZTogU2Vyb3ZhbE5vZGUsXG4pOiBzdHJpbmcge1xuICAvLyBHZXQgdGhlIHNlcmlhbGl6ZWQgcmVzdWx0XG4gIGNvbnN0IHJlc3VsdCA9IHNlcmlhbGl6ZShjdHgsIHRyZWUpO1xuICAvLyBJZiB0aGUgbm9kZSBpcyBhIG5vbi1yZWZlcmVuY2UsIHJldHVyblxuICAvLyB0aGUgcmVzdWx0IGltbWVkaWF0ZWx5XG4gIGNvbnN0IGlkID0gdHJlZS5pO1xuICBpZiAoaWQgPT0gbnVsbCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgLy8gR2V0IHRoZSBwYXRjaGVzXG4gIGNvbnN0IHBhdGNoZXMgPSByZXNvbHZlUGF0Y2hlcyhjdHguYmFzZSk7XG4gIC8vIEdldCB0aGUgdmFyaWFibGUgdGhhdCByZXByZXNlbnRzIHRoZSByb290XG4gIGNvbnN0IHJlZiA9IGdldFJlZlBhcmFtKGN0eCwgaWQpO1xuICBjb25zdCBzY29wZUlkID0gY3R4LnN0YXRlLnNjb3BlSWQ7XG4gIC8vIFBhcmFtZXRlcnMgbmVlZGVkIGZvciBzY29waW5nXG4gIGNvbnN0IHBhcmFtcyA9IHNjb3BlSWQgPT0gbnVsbCA/ICcnIDogR0xPQkFMX0NPTlRFWFRfUkVGRVJFTkNFUztcbiAgLy8gSWYgdGhlcmUgYXJlIHBhdGNoZXMsIGFwcGVuZCBpdCBhZnRlciB0aGUgcmVzdWx0XG4gIGNvbnN0IGJvZHkgPSBwYXRjaGVzID8gJygnICsgcmVzdWx0ICsgJywnICsgcGF0Y2hlcyArIHJlZiArICcpJyA6IHJlc3VsdDtcbiAgLy8gSWYgdGhlcmUgYXJlIG5vIHBhcmFtcywgdGhlcmUncyBubyBuZWVkIHRvIGdlbmVyYXRlIGEgZnVuY3Rpb25cbiAgaWYgKHBhcmFtcyA9PT0gJycpIHtcbiAgICBpZiAodHJlZS50ID09PSBTZXJvdmFsTm9kZVR5cGUuT2JqZWN0ICYmICFwYXRjaGVzKSB7XG4gICAgICByZXR1cm4gJygnICsgYm9keSArICcpJztcbiAgICB9XG4gICAgcmV0dXJuIGJvZHk7XG4gIH1cbiAgLy8gR2V0IHRoZSBhcmd1bWVudHMgZm9yIHRoZSBJSUZFXG4gIGNvbnN0IGFyZ3MgPVxuICAgIHNjb3BlSWQgPT0gbnVsbFxuICAgICAgPyAnKCknXG4gICAgICA6ICcoJyArXG4gICAgICAgIEdMT0JBTF9DT05URVhUX1JFRkVSRU5DRVMgK1xuICAgICAgICAnW1wiJyArXG4gICAgICAgIHNlcmlhbGl6ZVN0cmluZyhzY29wZUlkKSArXG4gICAgICAgICdcIl0pJztcbiAgLy8gQ3JlYXRlIHRoZSBJSUZFXG4gIHJldHVybiAnKCcgKyBjcmVhdGVGdW5jdGlvbihbcGFyYW1zXSwgYm9keSkgKyAnKScgKyBhcmdzO1xufVxuIiwiaW1wb3J0IHtcbiAgY3JlYXRlQWdncmVnYXRlRXJyb3JOb2RlLFxuICBjcmVhdGVBcnJheU5vZGUsXG4gIGNyZWF0ZUFzeW5jSXRlcmF0b3JGYWN0b3J5SW5zdGFuY2VOb2RlLFxuICBjcmVhdGVCaWdJbnROb2RlLFxuICBjcmVhdGVCaWdJbnRUeXBlZEFycmF5Tm9kZSxcbiAgY3JlYXRlQm94ZWROb2RlLFxuICBjcmVhdGVEYXRhVmlld05vZGUsXG4gIGNyZWF0ZURhdGVOb2RlLFxuICBjcmVhdGVFcnJvck5vZGUsXG4gIGNyZWF0ZUl0ZXJhdG9yRmFjdG9yeUluc3RhbmNlTm9kZSxcbiAgY3JlYXRlTnVtYmVyTm9kZSxcbiAgY3JlYXRlUGx1Z2luTm9kZSxcbiAgY3JlYXRlUmVnRXhwTm9kZSxcbiAgY3JlYXRlU2VxdWVuY2VOb2RlLFxuICBjcmVhdGVTZXROb2RlLFxuICBjcmVhdGVTdHJlYW1Db25zdHJ1Y3Rvck5vZGUsXG4gIGNyZWF0ZVN0cmVhbU5leHROb2RlLFxuICBjcmVhdGVTdHJlYW1SZXR1cm5Ob2RlLFxuICBjcmVhdGVTdHJlYW1UaHJvd05vZGUsXG4gIGNyZWF0ZVN0cmluZ05vZGUsXG4gIGNyZWF0ZVR5cGVkQXJyYXlOb2RlLFxufSBmcm9tICcuLi9iYXNlLXByaW1pdGl2ZXMnO1xuaW1wb3J0IHsgRmVhdHVyZSB9IGZyb20gJy4uL2NvbXBhdCc7XG5pbXBvcnQgeyBOSUwsIFNlcm92YWxOb2RlVHlwZSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQge1xuICBTZXJvdmFsRGVwdGhMaW1pdEVycm9yLFxuICBTZXJvdmFsUGFyc2VyRXJyb3IsXG4gIFNlcm92YWxVbnN1cHBvcnRlZFR5cGVFcnJvcixcbn0gZnJvbSAnLi4vZXJyb3JzJztcbmltcG9ydCB7IEZBTFNFX05PREUsIE5VTExfTk9ERSwgVFJVRV9OT0RFLCBVTkRFRklORURfTk9ERSB9IGZyb20gJy4uL2xpdGVyYWxzJztcbmltcG9ydCB7IGNyZWF0ZVNlcm92YWxOb2RlIH0gZnJvbSAnLi4vbm9kZSc7XG5pbXBvcnQgeyBPcGFxdWVSZWZlcmVuY2UgfSBmcm9tICcuLi9vcGFxdWUtcmVmZXJlbmNlJztcbmltcG9ydCB7IHR5cGUgUGx1Z2luLCBTZXJvdmFsTW9kZSB9IGZyb20gJy4uL3BsdWdpbic7XG5pbXBvcnQge1xuICBjcmVhdGVTZXF1ZW5jZUZyb21JdGVyYWJsZSxcbiAgaXNTZXF1ZW5jZSxcbiAgdHlwZSBTZXF1ZW5jZSxcbn0gZnJvbSAnLi4vc2VxdWVuY2UnO1xuaW1wb3J0IHsgU3BlY2lhbFJlZmVyZW5jZSB9IGZyb20gJy4uL3NwZWNpYWwtcmVmZXJlbmNlJztcbmltcG9ydCB0eXBlIHsgU3RyZWFtIH0gZnJvbSAnLi4vc3RyZWFtJztcbmltcG9ydCB7XG4gIGNyZWF0ZVN0cmVhbSxcbiAgY3JlYXRlU3RyZWFtRnJvbUFzeW5jSXRlcmFibGUsXG4gIGlzU3RyZWFtLFxufSBmcm9tICcuLi9zdHJlYW0nO1xuaW1wb3J0IHsgc2VyaWFsaXplU3RyaW5nIH0gZnJvbSAnLi4vc3RyaW5nJztcbmltcG9ydCB7XG4gIFNZTV9BU1lOQ19JVEVSQVRPUixcbiAgU1lNX0lTX0NPTkNBVF9TUFJFQURBQkxFLFxuICBTWU1fSVRFUkFUT1IsXG4gIFNZTV9UT19TVFJJTkdfVEFHLFxufSBmcm9tICcuLi9zeW1ib2xzJztcbmltcG9ydCB0eXBlIHtcbiAgU2Vyb3ZhbEFnZ3JlZ2F0ZUVycm9yTm9kZSxcbiAgU2Vyb3ZhbEFycmF5Tm9kZSxcbiAgU2Vyb3ZhbEJpZ0ludFR5cGVkQXJyYXlOb2RlLFxuICBTZXJvdmFsQm94ZWROb2RlLFxuICBTZXJvdmFsRGF0YVZpZXdOb2RlLFxuICBTZXJvdmFsRXJyb3JOb2RlLFxuICBTZXJvdmFsTWFwTm9kZSxcbiAgU2Vyb3ZhbE5vZGUsXG4gIFNlcm92YWxOb2RlV2l0aElELFxuICBTZXJvdmFsTnVsbENvbnN0cnVjdG9yTm9kZSxcbiAgU2Vyb3ZhbE9iamVjdE5vZGUsXG4gIFNlcm92YWxPYmplY3RSZWNvcmRLZXksXG4gIFNlcm92YWxPYmplY3RSZWNvcmROb2RlLFxuICBTZXJvdmFsUGx1Z2luTm9kZSxcbiAgU2Vyb3ZhbFByb21pc2VDb25zdHJ1Y3Rvck5vZGUsXG4gIFNlcm92YWxTZXF1ZW5jZU5vZGUsXG4gIFNlcm92YWxTZXROb2RlLFxuICBTZXJvdmFsVHlwZWRBcnJheU5vZGUsXG59IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGdldEVycm9yT3B0aW9ucyB9IGZyb20gJy4uL3V0aWxzL2Vycm9yJztcbmltcG9ydCB0eXBlIHtcbiAgQmlnSW50VHlwZWRBcnJheVZhbHVlLFxuICBUeXBlZEFycmF5VmFsdWUsXG59IGZyb20gJy4uL3V0aWxzL3R5cGVkLWFycmF5JztcbmltcG9ydCB0eXBlIHsgQmFzZVBhcnNlckNvbnRleHQsIEJhc2VQYXJzZXJDb250ZXh0T3B0aW9ucyB9IGZyb20gJy4vcGFyc2VyJztcbmltcG9ydCB7XG4gIGNyZWF0ZUFycmF5QnVmZmVyTm9kZSxcbiAgY3JlYXRlQmFzZVBhcnNlckNvbnRleHQsXG4gIGNyZWF0ZUluZGV4Rm9yVmFsdWUsXG4gIGNyZWF0ZU1hcE5vZGUsXG4gIGNyZWF0ZU9iamVjdE5vZGUsXG4gIGNyZWF0ZVByb21pc2VDb25zdHJ1Y3Rvck5vZGUsXG4gIGdldFJlZmVyZW5jZU5vZGUsXG4gIHBhcnNlQXN5bmNJdGVyYXRvckZhY3RvcnksXG4gIHBhcnNlSXRlcmF0b3JGYWN0b3J5LFxuICBQYXJzZXJOb2RlVHlwZSxcbiAgcGFyc2VTcGVjaWFsUmVmZXJlbmNlLFxuICBwYXJzZVdlbGxLbm93blN5bWJvbCxcbn0gZnJvbSAnLi9wYXJzZXInO1xuXG50eXBlIE9iamVjdExpa2VOb2RlID0gU2Vyb3ZhbE9iamVjdE5vZGUgfCBTZXJvdmFsTnVsbENvbnN0cnVjdG9yTm9kZTtcblxuZXhwb3J0IHR5cGUgU3luY1BhcnNlckNvbnRleHRPcHRpb25zID0gQmFzZVBhcnNlckNvbnRleHRPcHRpb25zO1xuXG5jb25zdCBlbnVtIFBhcnNlck1vZGUge1xuICBTeW5jID0gMSxcbiAgU3RyZWFtID0gMixcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTeW5jUGFyc2VyQ29udGV4dCB7XG4gIHR5cGU6IFBhcnNlck1vZGUuU3luYztcbiAgYmFzZTogQmFzZVBhcnNlckNvbnRleHQ7XG4gIGNoaWxkOiBTeW5jUGFyc2VQbHVnaW5Db250ZXh0IHwgdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3luY1BhcnNlckNvbnRleHQoXG4gIG1vZGU6IFNlcm92YWxNb2RlLFxuICBvcHRpb25zOiBTeW5jUGFyc2VyQ29udGV4dE9wdGlvbnMsXG4pOiBTeW5jUGFyc2VyQ29udGV4dCB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogUGFyc2VyTW9kZS5TeW5jLFxuICAgIGJhc2U6IGNyZWF0ZUJhc2VQYXJzZXJDb250ZXh0KG1vZGUsIG9wdGlvbnMpLFxuICAgIGNoaWxkOiBOSUwsXG4gIH07XG59XG5cbmV4cG9ydCBjbGFzcyBTeW5jUGFyc2VQbHVnaW5Db250ZXh0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfcDogU3luY1BhcnNlckNvbnRleHQsXG4gICAgcHJpdmF0ZSBkZXB0aDogbnVtYmVyLFxuICApIHt9XG5cbiAgcGFyc2U8VD4oY3VycmVudDogVCk6IFNlcm92YWxOb2RlIHtcbiAgICByZXR1cm4gcGFyc2VTT1ModGhpcy5fcCwgdGhpcy5kZXB0aCwgY3VycmVudCk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdHJlYW1QYXJzZXJDb250ZXh0T3B0aW9ucyBleHRlbmRzIFN5bmNQYXJzZXJDb250ZXh0T3B0aW9ucyB7XG4gIG9uUGFyc2U6IChub2RlOiBTZXJvdmFsTm9kZSwgaW5pdGlhbDogYm9vbGVhbikgPT4gdm9pZDtcbiAgb25FcnJvcj86IChlcnJvcjogdW5rbm93bikgPT4gdm9pZDtcbiAgb25Eb25lPzogKCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdHJlYW1QYXJzZXJDb250ZXh0IHtcbiAgdHlwZTogUGFyc2VyTW9kZS5TdHJlYW07XG4gIGJhc2U6IEJhc2VQYXJzZXJDb250ZXh0O1xuICBzdGF0ZTogU3RyZWFtUGFyc2VyU3RhdGU7XG59XG5leHBvcnQgY2xhc3MgU3RyZWFtUGFyc2VQbHVnaW5Db250ZXh0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfcDogU3RyZWFtUGFyc2VyQ29udGV4dCxcbiAgICBwcml2YXRlIGRlcHRoOiBudW1iZXIsXG4gICkge31cblxuICBwYXJzZTxUPihjdXJyZW50OiBUKTogU2Vyb3ZhbE5vZGUge1xuICAgIHJldHVybiBwYXJzZVNPUyh0aGlzLl9wLCB0aGlzLmRlcHRoLCBjdXJyZW50KTtcbiAgfVxuXG4gIHBhcnNlV2l0aEVycm9yPFQ+KGN1cnJlbnQ6IFQpOiBTZXJvdmFsTm9kZSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHBhcnNlV2l0aEVycm9yKHRoaXMuX3AsIHRoaXMuZGVwdGgsIGN1cnJlbnQpO1xuICB9XG5cbiAgaXNBbGl2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcC5zdGF0ZS5hbGl2ZTtcbiAgfVxuXG4gIHB1c2hQZW5kaW5nU3RhdGUoKTogdm9pZCB7XG4gICAgcHVzaFBlbmRpbmdTdGF0ZSh0aGlzLl9wKTtcbiAgfVxuXG4gIHBvcFBlbmRpbmdTdGF0ZSgpOiB2b2lkIHtcbiAgICBwb3BQZW5kaW5nU3RhdGUodGhpcy5fcCk7XG4gIH1cblxuICBvblBhcnNlKG5vZGU6IFNlcm92YWxOb2RlKTogdm9pZCB7XG4gICAgb25QYXJzZSh0aGlzLl9wLCBub2RlKTtcbiAgfVxuXG4gIG9uRXJyb3IoZXJyb3I6IHVua25vd24pOiB2b2lkIHtcbiAgICBvbkVycm9yKHRoaXMuX3AsIGVycm9yKTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgU3RyZWFtUGFyc2VyU3RhdGUge1xuICAvLyBMaWZlIGN5Y2xlXG4gIGFsaXZlOiBib29sZWFuO1xuICAvLyBOdW1iZXIgb2YgcGVuZGluZyB0aGluZ3NcbiAgcGVuZGluZzogbnVtYmVyO1xuICAvL1xuICBpbml0aWFsOiBib29sZWFuO1xuICAvL1xuICBidWZmZXI6IFNlcm92YWxOb2RlW107XG4gIC8vIENhbGxiYWNrc1xuICBvblBhcnNlOiAobm9kZTogU2Vyb3ZhbE5vZGUsIGluaXRpYWw6IGJvb2xlYW4pID0+IHZvaWQ7XG4gIG9uRXJyb3I/OiAoZXJyb3I6IHVua25vd24pID0+IHZvaWQ7XG4gIG9uRG9uZT86ICgpID0+IHZvaWQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0cmVhbVBhcnNlclN0YXRlKFxuICBvcHRpb25zOiBTdHJlYW1QYXJzZXJDb250ZXh0T3B0aW9ucyxcbik6IFN0cmVhbVBhcnNlclN0YXRlIHtcbiAgcmV0dXJuIHtcbiAgICBhbGl2ZTogdHJ1ZSxcbiAgICBwZW5kaW5nOiAwLFxuICAgIGluaXRpYWw6IHRydWUsXG4gICAgYnVmZmVyOiBbXSxcbiAgICBvblBhcnNlOiBvcHRpb25zLm9uUGFyc2UsXG4gICAgb25FcnJvcjogb3B0aW9ucy5vbkVycm9yLFxuICAgIG9uRG9uZTogb3B0aW9ucy5vbkRvbmUsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdHJlYW1QYXJzZXJDb250ZXh0KFxuICBvcHRpb25zOiBTdHJlYW1QYXJzZXJDb250ZXh0T3B0aW9ucyxcbik6IFN0cmVhbVBhcnNlckNvbnRleHQge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFBhcnNlck1vZGUuU3RyZWFtLFxuICAgIGJhc2U6IGNyZWF0ZUJhc2VQYXJzZXJDb250ZXh0KFNlcm92YWxNb2RlLkNyb3NzLCBvcHRpb25zKSxcbiAgICBzdGF0ZTogY3JlYXRlU3RyZWFtUGFyc2VyU3RhdGUob3B0aW9ucyksXG4gIH07XG59XG5cbnR5cGUgU09TUGFyc2VyQ29udGV4dCA9IFN5bmNQYXJzZXJDb250ZXh0IHwgU3RyZWFtUGFyc2VyQ29udGV4dDtcblxuZnVuY3Rpb24gcGFyc2VJdGVtcyhcbiAgY3R4OiBTT1NQYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBjdXJyZW50OiB1bmtub3duW10sXG4pOiAoU2Vyb3ZhbE5vZGUgfCAwKVtdIHtcbiAgY29uc3Qgbm9kZXM6IChTZXJvdmFsTm9kZSB8IDApW10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGN1cnJlbnQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoaSBpbiBjdXJyZW50KSB7XG4gICAgICBub2Rlc1tpXSA9IHBhcnNlU09TKGN0eCwgZGVwdGgsIGN1cnJlbnRbaV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2Rlc1tpXSA9IDA7XG4gICAgfVxuICB9XG4gIHJldHVybiBub2Rlcztcbn1cblxuZnVuY3Rpb24gcGFyc2VBcnJheShcbiAgY3R4OiBTT1NQYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiB1bmtub3duW10sXG4pOiBTZXJvdmFsQXJyYXlOb2RlIHtcbiAgcmV0dXJuIGNyZWF0ZUFycmF5Tm9kZShpZCwgY3VycmVudCwgcGFyc2VJdGVtcyhjdHgsIGRlcHRoLCBjdXJyZW50KSk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlUHJvcGVydGllcyhcbiAgY3R4OiBTT1NQYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBwcm9wZXJ0aWVzOiBSZWNvcmQ8c3RyaW5nIHwgc3ltYm9sLCB1bmtub3duPixcbik6IFNlcm92YWxPYmplY3RSZWNvcmROb2RlIHtcbiAgY29uc3QgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKHByb3BlcnRpZXMpO1xuICBjb25zdCBrZXlOb2RlczogU2Vyb3ZhbE9iamVjdFJlY29yZEtleVtdID0gW107XG4gIGNvbnN0IHZhbHVlTm9kZXM6IFNlcm92YWxOb2RlW10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGVudHJpZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBrZXlOb2Rlcy5wdXNoKHNlcmlhbGl6ZVN0cmluZyhlbnRyaWVzW2ldWzBdKSk7XG4gICAgdmFsdWVOb2Rlcy5wdXNoKHBhcnNlU09TKGN0eCwgZGVwdGgsIGVudHJpZXNbaV1bMV0pKTtcbiAgfVxuICAvLyBDaGVjayBzcGVjaWFsIHByb3BlcnRpZXMsIHN5bWJvbHMgaW4gdGhpcyBjYXNlXG4gIGlmIChTWU1fSVRFUkFUT1IgaW4gcHJvcGVydGllcykge1xuICAgIGtleU5vZGVzLnB1c2gocGFyc2VXZWxsS25vd25TeW1ib2woY3R4LmJhc2UsIFNZTV9JVEVSQVRPUikpO1xuICAgIHZhbHVlTm9kZXMucHVzaChcbiAgICAgIGNyZWF0ZUl0ZXJhdG9yRmFjdG9yeUluc3RhbmNlTm9kZShcbiAgICAgICAgcGFyc2VJdGVyYXRvckZhY3RvcnkoY3R4LmJhc2UpLFxuICAgICAgICBwYXJzZVNPUyhcbiAgICAgICAgICBjdHgsXG4gICAgICAgICAgZGVwdGgsXG4gICAgICAgICAgY3JlYXRlU2VxdWVuY2VGcm9tSXRlcmFibGUoXG4gICAgICAgICAgICBwcm9wZXJ0aWVzIGFzIHVua25vd24gYXMgSXRlcmFibGU8dW5rbm93bj4sXG4gICAgICAgICAgKSxcbiAgICAgICAgKSBhcyBTZXJvdmFsTm9kZVdpdGhJRCxcbiAgICAgICksXG4gICAgKTtcbiAgfVxuICBpZiAoU1lNX0FTWU5DX0lURVJBVE9SIGluIHByb3BlcnRpZXMpIHtcbiAgICBrZXlOb2Rlcy5wdXNoKHBhcnNlV2VsbEtub3duU3ltYm9sKGN0eC5iYXNlLCBTWU1fQVNZTkNfSVRFUkFUT1IpKTtcbiAgICB2YWx1ZU5vZGVzLnB1c2goXG4gICAgICBjcmVhdGVBc3luY0l0ZXJhdG9yRmFjdG9yeUluc3RhbmNlTm9kZShcbiAgICAgICAgcGFyc2VBc3luY0l0ZXJhdG9yRmFjdG9yeShjdHguYmFzZSksXG4gICAgICAgIHBhcnNlU09TKFxuICAgICAgICAgIGN0eCxcbiAgICAgICAgICBkZXB0aCxcbiAgICAgICAgICBjdHgudHlwZSA9PT0gUGFyc2VyTW9kZS5TeW5jXG4gICAgICAgICAgICA/IGNyZWF0ZVN0cmVhbSgpXG4gICAgICAgICAgICA6IGNyZWF0ZVN0cmVhbUZyb21Bc3luY0l0ZXJhYmxlKFxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgYXMgdW5rbm93biBhcyBBc3luY0l0ZXJhYmxlPHVua25vd24+LFxuICAgICAgICAgICAgICApLFxuICAgICAgICApIGFzIFNlcm92YWxOb2RlV2l0aElELFxuICAgICAgKSxcbiAgICApO1xuICB9XG4gIGlmIChTWU1fVE9fU1RSSU5HX1RBRyBpbiBwcm9wZXJ0aWVzKSB7XG4gICAga2V5Tm9kZXMucHVzaChwYXJzZVdlbGxLbm93blN5bWJvbChjdHguYmFzZSwgU1lNX1RPX1NUUklOR19UQUcpKTtcbiAgICB2YWx1ZU5vZGVzLnB1c2goY3JlYXRlU3RyaW5nTm9kZShwcm9wZXJ0aWVzW1NZTV9UT19TVFJJTkdfVEFHXSBhcyBzdHJpbmcpKTtcbiAgfVxuICBpZiAoU1lNX0lTX0NPTkNBVF9TUFJFQURBQkxFIGluIHByb3BlcnRpZXMpIHtcbiAgICBrZXlOb2Rlcy5wdXNoKHBhcnNlV2VsbEtub3duU3ltYm9sKGN0eC5iYXNlLCBTWU1fSVNfQ09OQ0FUX1NQUkVBREFCTEUpKTtcbiAgICB2YWx1ZU5vZGVzLnB1c2goXG4gICAgICBwcm9wZXJ0aWVzW1NZTV9JU19DT05DQVRfU1BSRUFEQUJMRV0gPyBUUlVFX05PREUgOiBGQUxTRV9OT0RFLFxuICAgICk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBrOiBrZXlOb2RlcyxcbiAgICB2OiB2YWx1ZU5vZGVzLFxuICB9O1xufVxuXG5mdW5jdGlvbiBwYXJzZVBsYWluT2JqZWN0KFxuICBjdHg6IFNPU1BhcnNlckNvbnRleHQsXG4gIGRlcHRoOiBudW1iZXIsXG4gIGlkOiBudW1iZXIsXG4gIGN1cnJlbnQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICBlbXB0eTogYm9vbGVhbixcbik6IE9iamVjdExpa2VOb2RlIHtcbiAgcmV0dXJuIGNyZWF0ZU9iamVjdE5vZGUoXG4gICAgaWQsXG4gICAgY3VycmVudCxcbiAgICBlbXB0eSxcbiAgICBwYXJzZVByb3BlcnRpZXMoY3R4LCBkZXB0aCwgY3VycmVudCksXG4gICk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlQm94ZWQoXG4gIGN0eDogU09TUGFyc2VyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgaWQ6IG51bWJlcixcbiAgY3VycmVudDogb2JqZWN0LFxuKTogU2Vyb3ZhbEJveGVkTm9kZSB7XG4gIHJldHVybiBjcmVhdGVCb3hlZE5vZGUoaWQsIHBhcnNlU09TKGN0eCwgZGVwdGgsIGN1cnJlbnQudmFsdWVPZigpKSk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVHlwZWRBcnJheShcbiAgY3R4OiBTT1NQYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiBUeXBlZEFycmF5VmFsdWUsXG4pOiBTZXJvdmFsVHlwZWRBcnJheU5vZGUge1xuICByZXR1cm4gY3JlYXRlVHlwZWRBcnJheU5vZGUoXG4gICAgaWQsXG4gICAgY3VycmVudCxcbiAgICBwYXJzZVNPUyhjdHgsIGRlcHRoLCBjdXJyZW50LmJ1ZmZlciksXG4gICk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlQmlnSW50VHlwZWRBcnJheShcbiAgY3R4OiBTT1NQYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiBCaWdJbnRUeXBlZEFycmF5VmFsdWUsXG4pOiBTZXJvdmFsQmlnSW50VHlwZWRBcnJheU5vZGUge1xuICByZXR1cm4gY3JlYXRlQmlnSW50VHlwZWRBcnJheU5vZGUoXG4gICAgaWQsXG4gICAgY3VycmVudCxcbiAgICBwYXJzZVNPUyhjdHgsIGRlcHRoLCBjdXJyZW50LmJ1ZmZlciksXG4gICk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlRGF0YVZpZXcoXG4gIGN0eDogU09TUGFyc2VyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgaWQ6IG51bWJlcixcbiAgY3VycmVudDogRGF0YVZpZXcsXG4pOiBTZXJvdmFsRGF0YVZpZXdOb2RlIHtcbiAgcmV0dXJuIGNyZWF0ZURhdGFWaWV3Tm9kZShpZCwgY3VycmVudCwgcGFyc2VTT1MoY3R4LCBkZXB0aCwgY3VycmVudC5idWZmZXIpKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VFcnJvcihcbiAgY3R4OiBTT1NQYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiBFcnJvcixcbik6IFNlcm92YWxFcnJvck5vZGUge1xuICBjb25zdCBvcHRpb25zID0gZ2V0RXJyb3JPcHRpb25zKGN1cnJlbnQsIGN0eC5iYXNlLmZlYXR1cmVzKTtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yTm9kZShcbiAgICBpZCxcbiAgICBjdXJyZW50LFxuICAgIG9wdGlvbnMgPyBwYXJzZVByb3BlcnRpZXMoY3R4LCBkZXB0aCwgb3B0aW9ucykgOiBOSUwsXG4gICk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlQWdncmVnYXRlRXJyb3IoXG4gIGN0eDogU09TUGFyc2VyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgaWQ6IG51bWJlcixcbiAgY3VycmVudDogQWdncmVnYXRlRXJyb3IsXG4pOiBTZXJvdmFsQWdncmVnYXRlRXJyb3JOb2RlIHtcbiAgY29uc3Qgb3B0aW9ucyA9IGdldEVycm9yT3B0aW9ucyhjdXJyZW50LCBjdHguYmFzZS5mZWF0dXJlcyk7XG4gIHJldHVybiBjcmVhdGVBZ2dyZWdhdGVFcnJvck5vZGUoXG4gICAgaWQsXG4gICAgY3VycmVudCxcbiAgICBvcHRpb25zID8gcGFyc2VQcm9wZXJ0aWVzKGN0eCwgZGVwdGgsIG9wdGlvbnMpIDogTklMLFxuICApO1xufVxuXG5mdW5jdGlvbiBwYXJzZU1hcChcbiAgY3R4OiBTT1NQYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiBNYXA8dW5rbm93biwgdW5rbm93bj4sXG4pOiBTZXJvdmFsTWFwTm9kZSB7XG4gIGNvbnN0IGtleU5vZGVzOiBTZXJvdmFsTm9kZVtdID0gW107XG4gIGNvbnN0IHZhbHVlTm9kZXM6IFNlcm92YWxOb2RlW10gPSBbXTtcbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgY3VycmVudC5lbnRyaWVzKCkpIHtcbiAgICBrZXlOb2Rlcy5wdXNoKHBhcnNlU09TKGN0eCwgZGVwdGgsIGtleSkpO1xuICAgIHZhbHVlTm9kZXMucHVzaChwYXJzZVNPUyhjdHgsIGRlcHRoLCB2YWx1ZSkpO1xuICB9XG4gIHJldHVybiBjcmVhdGVNYXBOb2RlKGN0eC5iYXNlLCBpZCwga2V5Tm9kZXMsIHZhbHVlTm9kZXMpO1xufVxuXG5mdW5jdGlvbiBwYXJzZVNldChcbiAgY3R4OiBTT1NQYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiBTZXQ8dW5rbm93bj4sXG4pOiBTZXJvdmFsU2V0Tm9kZSB7XG4gIGNvbnN0IGl0ZW1zOiBTZXJvdmFsTm9kZVtdID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBjdXJyZW50LmtleXMoKSkge1xuICAgIGl0ZW1zLnB1c2gocGFyc2VTT1MoY3R4LCBkZXB0aCwgaXRlbSkpO1xuICB9XG4gIHJldHVybiBjcmVhdGVTZXROb2RlKGlkLCBpdGVtcyk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlU3RyZWFtKFxuICBjdHg6IFNPU1BhcnNlckNvbnRleHQsXG4gIGRlcHRoOiBudW1iZXIsXG4gIGlkOiBudW1iZXIsXG4gIGN1cnJlbnQ6IFN0cmVhbTx1bmtub3duPixcbik6IFNlcm92YWxOb2RlIHtcbiAgY29uc3QgcmVzdWx0ID0gY3JlYXRlU3RyZWFtQ29uc3RydWN0b3JOb2RlKFxuICAgIGlkLFxuICAgIHBhcnNlU3BlY2lhbFJlZmVyZW5jZShjdHguYmFzZSwgU3BlY2lhbFJlZmVyZW5jZS5TdHJlYW1Db25zdHJ1Y3RvciksXG4gICAgW10sXG4gICk7XG4gIGlmIChjdHgudHlwZSA9PT0gUGFyc2VyTW9kZS5TeW5jKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBwdXNoUGVuZGluZ1N0YXRlKGN0eCk7XG4gIGN1cnJlbnQub24oe1xuICAgIG5leHQ6IHZhbHVlID0+IHtcbiAgICAgIGlmIChjdHguc3RhdGUuYWxpdmUpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VXaXRoRXJyb3IoY3R4LCBkZXB0aCwgdmFsdWUpO1xuICAgICAgICBpZiAocGFyc2VkKSB7XG4gICAgICAgICAgb25QYXJzZShjdHgsIGNyZWF0ZVN0cmVhbU5leHROb2RlKGlkLCBwYXJzZWQpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgdGhyb3c6IHZhbHVlID0+IHtcbiAgICAgIGlmIChjdHguc3RhdGUuYWxpdmUpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VXaXRoRXJyb3IoY3R4LCBkZXB0aCwgdmFsdWUpO1xuICAgICAgICBpZiAocGFyc2VkKSB7XG4gICAgICAgICAgb25QYXJzZShjdHgsIGNyZWF0ZVN0cmVhbVRocm93Tm9kZShpZCwgcGFyc2VkKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHBvcFBlbmRpbmdTdGF0ZShjdHgpO1xuICAgIH0sXG4gICAgcmV0dXJuOiB2YWx1ZSA9PiB7XG4gICAgICBpZiAoY3R4LnN0YXRlLmFsaXZlKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlV2l0aEVycm9yKGN0eCwgZGVwdGgsIHZhbHVlKTtcbiAgICAgICAgaWYgKHBhcnNlZCkge1xuICAgICAgICAgIG9uUGFyc2UoY3R4LCBjcmVhdGVTdHJlYW1SZXR1cm5Ob2RlKGlkLCBwYXJzZWQpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcG9wUGVuZGluZ1N0YXRlKGN0eCk7XG4gICAgfSxcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVByb21pc2VTdWNjZXNzKFxuICB0aGlzOiBTdHJlYW1QYXJzZXJDb250ZXh0LFxuICBpZDogbnVtYmVyLFxuICBkZXB0aDogbnVtYmVyLFxuICBkYXRhOiB1bmtub3duLFxuKTogdm9pZCB7XG4gIGlmICh0aGlzLnN0YXRlLmFsaXZlKSB7XG4gICAgY29uc3QgcGFyc2VkID0gcGFyc2VXaXRoRXJyb3IodGhpcywgZGVwdGgsIGRhdGEpO1xuICAgIGlmIChwYXJzZWQpIHtcbiAgICAgIG9uUGFyc2UoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIGNyZWF0ZVNlcm92YWxOb2RlKFxuICAgICAgICAgIFNlcm92YWxOb2RlVHlwZS5Qcm9taXNlU3VjY2VzcyxcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBOSUwsXG4gICAgICAgICAgTklMLFxuICAgICAgICAgIE5JTCxcbiAgICAgICAgICBOSUwsXG4gICAgICAgICAgTklMLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHBhcnNlU3BlY2lhbFJlZmVyZW5jZSh0aGlzLmJhc2UsIFNwZWNpYWxSZWZlcmVuY2UuUHJvbWlzZVN1Y2Nlc3MpLFxuICAgICAgICAgICAgcGFyc2VkLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgTklMLFxuICAgICAgICAgIE5JTCxcbiAgICAgICAgICBOSUwsXG4gICAgICAgICAgTklMLFxuICAgICAgICApLFxuICAgICAgKTtcbiAgICB9XG4gICAgcG9wUGVuZGluZ1N0YXRlKHRoaXMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVByb21pc2VGYWlsdXJlKFxuICB0aGlzOiBTdHJlYW1QYXJzZXJDb250ZXh0LFxuICBpZDogbnVtYmVyLFxuICBkZXB0aDogbnVtYmVyLFxuICBkYXRhOiB1bmtub3duLFxuKTogdm9pZCB7XG4gIGlmICh0aGlzLnN0YXRlLmFsaXZlKSB7XG4gICAgY29uc3QgcGFyc2VkID0gcGFyc2VXaXRoRXJyb3IodGhpcywgZGVwdGgsIGRhdGEpO1xuICAgIGlmIChwYXJzZWQpIHtcbiAgICAgIG9uUGFyc2UoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIGNyZWF0ZVNlcm92YWxOb2RlKFxuICAgICAgICAgIFNlcm92YWxOb2RlVHlwZS5Qcm9taXNlRmFpbHVyZSxcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBOSUwsXG4gICAgICAgICAgTklMLFxuICAgICAgICAgIE5JTCxcbiAgICAgICAgICBOSUwsXG4gICAgICAgICAgTklMLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHBhcnNlU3BlY2lhbFJlZmVyZW5jZSh0aGlzLmJhc2UsIFNwZWNpYWxSZWZlcmVuY2UuUHJvbWlzZUZhaWx1cmUpLFxuICAgICAgICAgICAgcGFyc2VkLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgTklMLFxuICAgICAgICAgIE5JTCxcbiAgICAgICAgICBOSUwsXG4gICAgICAgICAgTklMLFxuICAgICAgICApLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgcG9wUGVuZGluZ1N0YXRlKHRoaXMpO1xufVxuXG5mdW5jdGlvbiBwYXJzZVByb21pc2UoXG4gIGN0eDogU09TUGFyc2VyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgaWQ6IG51bWJlcixcbiAgY3VycmVudDogUHJvbWlzZTx1bmtub3duPixcbik6IFNlcm92YWxQcm9taXNlQ29uc3RydWN0b3JOb2RlIHtcbiAgLy8gQ3JlYXRlcyBhIHVuaXF1ZSByZWZlcmVuY2UgZm9yIHRoZSBwcm9taXNlIHJlc29sdmVyXG4gIGNvbnN0IHJlc29sdmVyID0gY3JlYXRlSW5kZXhGb3JWYWx1ZShjdHguYmFzZSwge30pO1xuICBpZiAoY3R4LnR5cGUgPT09IFBhcnNlck1vZGUuU3RyZWFtKSB7XG4gICAgcHVzaFBlbmRpbmdTdGF0ZShjdHgpO1xuICAgIGN1cnJlbnQudGhlbihcbiAgICAgIGhhbmRsZVByb21pc2VTdWNjZXNzLmJpbmQoY3R4LCByZXNvbHZlciwgZGVwdGgpLFxuICAgICAgaGFuZGxlUHJvbWlzZUZhaWx1cmUuYmluZChjdHgsIHJlc29sdmVyLCBkZXB0aCksXG4gICAgKTtcbiAgfVxuICByZXR1cm4gY3JlYXRlUHJvbWlzZUNvbnN0cnVjdG9yTm9kZShjdHguYmFzZSwgaWQsIHJlc29sdmVyKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VQbHVnaW5TeW5jKFxuICBjdHg6IFN5bmNQYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiB1bmtub3duLFxuICBjdXJyZW50UGx1Z2luczogUGx1Z2luPGFueSwgYW55PltdLFxuKTogU2Vyb3ZhbFBsdWdpbk5vZGUgfCB1bmRlZmluZWQge1xuICBmb3IgKGxldCBpID0gMCwgbGVuID0gY3VycmVudFBsdWdpbnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBjb25zdCBwbHVnaW4gPSBjdXJyZW50UGx1Z2luc1tpXTtcbiAgICBpZiAocGx1Z2luLnBhcnNlLnN5bmMgJiYgcGx1Z2luLnRlc3QoY3VycmVudCkpIHtcbiAgICAgIHJldHVybiBjcmVhdGVQbHVnaW5Ob2RlKFxuICAgICAgICBpZCxcbiAgICAgICAgcGx1Z2luLnRhZyxcbiAgICAgICAgcGx1Z2luLnBhcnNlLnN5bmMoY3VycmVudCwgbmV3IFN5bmNQYXJzZVBsdWdpbkNvbnRleHQoY3R4LCBkZXB0aCksIHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgfSksXG4gICAgICApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gTklMO1xufVxuXG5mdW5jdGlvbiBwYXJzZVBsdWdpblN0cmVhbShcbiAgY3R4OiBTdHJlYW1QYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiB1bmtub3duLFxuICBjdXJyZW50UGx1Z2luczogUGx1Z2luPGFueSwgYW55PltdLFxuKTogU2Vyb3ZhbFBsdWdpbk5vZGUgfCB1bmRlZmluZWQge1xuICBmb3IgKGxldCBpID0gMCwgbGVuID0gY3VycmVudFBsdWdpbnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBjb25zdCBwbHVnaW4gPSBjdXJyZW50UGx1Z2luc1tpXTtcbiAgICBpZiAocGx1Z2luLnBhcnNlLnN0cmVhbSAmJiBwbHVnaW4udGVzdChjdXJyZW50KSkge1xuICAgICAgcmV0dXJuIGNyZWF0ZVBsdWdpbk5vZGUoXG4gICAgICAgIGlkLFxuICAgICAgICBwbHVnaW4udGFnLFxuICAgICAgICBwbHVnaW4ucGFyc2Uuc3RyZWFtKGN1cnJlbnQsIG5ldyBTdHJlYW1QYXJzZVBsdWdpbkNvbnRleHQoY3R4LCBkZXB0aCksIHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgfSksXG4gICAgICApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gTklMO1xufVxuXG5mdW5jdGlvbiBwYXJzZVBsdWdpbihcbiAgY3R4OiBTT1NQYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiB1bmtub3duLFxuKTogU2Vyb3ZhbFBsdWdpbk5vZGUgfCB1bmRlZmluZWQge1xuICBjb25zdCBjdXJyZW50UGx1Z2lucyA9IGN0eC5iYXNlLnBsdWdpbnM7XG4gIGlmIChjdXJyZW50UGx1Z2lucykge1xuICAgIHJldHVybiBjdHgudHlwZSA9PT0gUGFyc2VyTW9kZS5TeW5jXG4gICAgICA/IHBhcnNlUGx1Z2luU3luYyhjdHgsIGRlcHRoLCBpZCwgY3VycmVudCwgY3VycmVudFBsdWdpbnMpXG4gICAgICA6IHBhcnNlUGx1Z2luU3RyZWFtKGN0eCwgZGVwdGgsIGlkLCBjdXJyZW50LCBjdXJyZW50UGx1Z2lucyk7XG4gIH1cbiAgcmV0dXJuIE5JTDtcbn1cblxuZnVuY3Rpb24gcGFyc2VTZXF1ZW5jZShcbiAgY3R4OiBTT1NQYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBpZDogbnVtYmVyLFxuICBjdXJyZW50OiBTZXF1ZW5jZSxcbik6IFNlcm92YWxTZXF1ZW5jZU5vZGUge1xuICBjb25zdCBub2RlczogU2Vyb3ZhbE5vZGVbXSA9IFtdO1xuICBmb3IgKGxldCBpID0gMCwgbGVuID0gY3VycmVudC52Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgbm9kZXNbaV0gPSBwYXJzZVNPUyhjdHgsIGRlcHRoLCBjdXJyZW50LnZbaV0pO1xuICB9XG4gIHJldHVybiBjcmVhdGVTZXF1ZW5jZU5vZGUoaWQsIG5vZGVzLCBjdXJyZW50LnQsIGN1cnJlbnQuZCk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlT2JqZWN0UGhhc2UyKFxuICBjdHg6IFNPU1BhcnNlckNvbnRleHQsXG4gIGRlcHRoOiBudW1iZXIsXG4gIGlkOiBudW1iZXIsXG4gIGN1cnJlbnQ6IG9iamVjdCxcbiAgY3VycmVudENsYXNzOiB1bmtub3duLFxuKTogU2Vyb3ZhbE5vZGUge1xuICBzd2l0Y2ggKGN1cnJlbnRDbGFzcykge1xuICAgIGNhc2UgT2JqZWN0OlxuICAgICAgcmV0dXJuIHBhcnNlUGxhaW5PYmplY3QoXG4gICAgICAgIGN0eCxcbiAgICAgICAgZGVwdGgsXG4gICAgICAgIGlkLFxuICAgICAgICBjdXJyZW50IGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICAgICAgICBmYWxzZSxcbiAgICAgICk7XG4gICAgY2FzZSBOSUw6XG4gICAgICByZXR1cm4gcGFyc2VQbGFpbk9iamVjdChcbiAgICAgICAgY3R4LFxuICAgICAgICBkZXB0aCxcbiAgICAgICAgaWQsXG4gICAgICAgIGN1cnJlbnQgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gICAgICAgIHRydWUsXG4gICAgICApO1xuICAgIGNhc2UgRGF0ZTpcbiAgICAgIHJldHVybiBjcmVhdGVEYXRlTm9kZShpZCwgY3VycmVudCBhcyB1bmtub3duIGFzIERhdGUpO1xuICAgIGNhc2UgRXJyb3I6XG4gICAgY2FzZSBFdmFsRXJyb3I6XG4gICAgY2FzZSBSYW5nZUVycm9yOlxuICAgIGNhc2UgUmVmZXJlbmNlRXJyb3I6XG4gICAgY2FzZSBTeW50YXhFcnJvcjpcbiAgICBjYXNlIFR5cGVFcnJvcjpcbiAgICBjYXNlIFVSSUVycm9yOlxuICAgICAgcmV0dXJuIHBhcnNlRXJyb3IoY3R4LCBkZXB0aCwgaWQsIGN1cnJlbnQgYXMgdW5rbm93biBhcyBFcnJvcik7XG4gICAgY2FzZSBOdW1iZXI6XG4gICAgY2FzZSBCb29sZWFuOlxuICAgIGNhc2UgU3RyaW5nOlxuICAgIGNhc2UgQmlnSW50OlxuICAgICAgcmV0dXJuIHBhcnNlQm94ZWQoY3R4LCBkZXB0aCwgaWQsIGN1cnJlbnQpO1xuICAgIGNhc2UgQXJyYXlCdWZmZXI6XG4gICAgICByZXR1cm4gY3JlYXRlQXJyYXlCdWZmZXJOb2RlKFxuICAgICAgICBjdHguYmFzZSxcbiAgICAgICAgaWQsXG4gICAgICAgIGN1cnJlbnQgYXMgdW5rbm93biBhcyBBcnJheUJ1ZmZlcixcbiAgICAgICk7XG4gICAgY2FzZSBJbnQ4QXJyYXk6XG4gICAgY2FzZSBJbnQxNkFycmF5OlxuICAgIGNhc2UgSW50MzJBcnJheTpcbiAgICBjYXNlIFVpbnQ4QXJyYXk6XG4gICAgY2FzZSBVaW50MTZBcnJheTpcbiAgICBjYXNlIFVpbnQzMkFycmF5OlxuICAgIGNhc2UgVWludDhDbGFtcGVkQXJyYXk6XG4gICAgY2FzZSBGbG9hdDMyQXJyYXk6XG4gICAgY2FzZSBGbG9hdDY0QXJyYXk6XG4gICAgICByZXR1cm4gcGFyc2VUeXBlZEFycmF5KFxuICAgICAgICBjdHgsXG4gICAgICAgIGRlcHRoLFxuICAgICAgICBpZCxcbiAgICAgICAgY3VycmVudCBhcyB1bmtub3duIGFzIFR5cGVkQXJyYXlWYWx1ZSxcbiAgICAgICk7XG4gICAgY2FzZSBEYXRhVmlldzpcbiAgICAgIHJldHVybiBwYXJzZURhdGFWaWV3KGN0eCwgZGVwdGgsIGlkLCBjdXJyZW50IGFzIHVua25vd24gYXMgRGF0YVZpZXcpO1xuICAgIGNhc2UgTWFwOlxuICAgICAgcmV0dXJuIHBhcnNlTWFwKFxuICAgICAgICBjdHgsXG4gICAgICAgIGRlcHRoLFxuICAgICAgICBpZCxcbiAgICAgICAgY3VycmVudCBhcyB1bmtub3duIGFzIE1hcDx1bmtub3duLCB1bmtub3duPixcbiAgICAgICk7XG4gICAgY2FzZSBTZXQ6XG4gICAgICByZXR1cm4gcGFyc2VTZXQoY3R4LCBkZXB0aCwgaWQsIGN1cnJlbnQgYXMgdW5rbm93biBhcyBTZXQ8dW5rbm93bj4pO1xuICAgIGRlZmF1bHQ6XG4gICAgICBicmVhaztcbiAgfVxuICAvLyBQcm9taXNlc1xuICBpZiAoY3VycmVudENsYXNzID09PSBQcm9taXNlIHx8IGN1cnJlbnQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgcmV0dXJuIHBhcnNlUHJvbWlzZShjdHgsIGRlcHRoLCBpZCwgY3VycmVudCBhcyB1bmtub3duIGFzIFByb21pc2U8dW5rbm93bj4pO1xuICB9XG4gIGNvbnN0IGN1cnJlbnRGZWF0dXJlcyA9IGN0eC5iYXNlLmZlYXR1cmVzO1xuICBpZiAoY3VycmVudEZlYXR1cmVzICYgRmVhdHVyZS5SZWdFeHAgJiYgY3VycmVudENsYXNzID09PSBSZWdFeHApIHtcbiAgICByZXR1cm4gY3JlYXRlUmVnRXhwTm9kZShpZCwgY3VycmVudCBhcyB1bmtub3duIGFzIFJlZ0V4cCk7XG4gIH1cbiAgLy8gQmlnSW50IFR5cGVkIEFycmF5c1xuICBpZiAoY3VycmVudEZlYXR1cmVzICYgRmVhdHVyZS5CaWdJbnRUeXBlZEFycmF5KSB7XG4gICAgc3dpdGNoIChjdXJyZW50Q2xhc3MpIHtcbiAgICAgIGNhc2UgQmlnSW50NjRBcnJheTpcbiAgICAgIGNhc2UgQmlnVWludDY0QXJyYXk6XG4gICAgICAgIHJldHVybiBwYXJzZUJpZ0ludFR5cGVkQXJyYXkoXG4gICAgICAgICAgY3R4LFxuICAgICAgICAgIGRlcHRoLFxuICAgICAgICAgIGlkLFxuICAgICAgICAgIGN1cnJlbnQgYXMgdW5rbm93biBhcyBCaWdJbnRUeXBlZEFycmF5VmFsdWUsXG4gICAgICAgICk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgaWYgKFxuICAgIGN1cnJlbnRGZWF0dXJlcyAmIEZlYXR1cmUuQWdncmVnYXRlRXJyb3IgJiZcbiAgICB0eXBlb2YgQWdncmVnYXRlRXJyb3IgIT09ICd1bmRlZmluZWQnICYmXG4gICAgKGN1cnJlbnRDbGFzcyA9PT0gQWdncmVnYXRlRXJyb3IgfHwgY3VycmVudCBpbnN0YW5jZW9mIEFnZ3JlZ2F0ZUVycm9yKVxuICApIHtcbiAgICByZXR1cm4gcGFyc2VBZ2dyZWdhdGVFcnJvcihcbiAgICAgIGN0eCxcbiAgICAgIGRlcHRoLFxuICAgICAgaWQsXG4gICAgICBjdXJyZW50IGFzIHVua25vd24gYXMgQWdncmVnYXRlRXJyb3IsXG4gICAgKTtcbiAgfVxuICAvLyBTbG93IHBhdGguIFdlIG9ubHkgbmVlZCB0byBoYW5kbGUgRXJyb3JzIGFuZCBJdGVyYXRvcnNcbiAgLy8gc2luY2UgdGhleSBoYXZlIHZlcnkgYnJvYWQgaW1wbGVtZW50YXRpb25zLlxuICBpZiAoY3VycmVudCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgcmV0dXJuIHBhcnNlRXJyb3IoY3R4LCBkZXB0aCwgaWQsIGN1cnJlbnQpO1xuICB9XG4gIC8vIEdlbmVyYXRvciBmdW5jdGlvbnMgZG9uJ3QgaGF2ZSBhIGdsb2JhbCBjb25zdHJ1Y3RvclxuICAvLyBkZXNwaXRlIGV4aXN0aW5nXG4gIGlmIChTWU1fSVRFUkFUT1IgaW4gY3VycmVudCB8fCBTWU1fQVNZTkNfSVRFUkFUT1IgaW4gY3VycmVudCkge1xuICAgIHJldHVybiBwYXJzZVBsYWluT2JqZWN0KGN0eCwgZGVwdGgsIGlkLCBjdXJyZW50LCAhIWN1cnJlbnRDbGFzcyk7XG4gIH1cbiAgdGhyb3cgbmV3IFNlcm92YWxVbnN1cHBvcnRlZFR5cGVFcnJvcihjdXJyZW50KTtcbn1cblxuZnVuY3Rpb24gcGFyc2VPYmplY3QoXG4gIGN0eDogU09TUGFyc2VyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgaWQ6IG51bWJlcixcbiAgY3VycmVudDogb2JqZWN0LFxuKTogU2Vyb3ZhbE5vZGUge1xuICBpZiAoQXJyYXkuaXNBcnJheShjdXJyZW50KSkge1xuICAgIHJldHVybiBwYXJzZUFycmF5KGN0eCwgZGVwdGgsIGlkLCBjdXJyZW50KTtcbiAgfVxuICBpZiAoaXNTdHJlYW0oY3VycmVudCkpIHtcbiAgICByZXR1cm4gcGFyc2VTdHJlYW0oY3R4LCBkZXB0aCwgaWQsIGN1cnJlbnQpO1xuICB9XG4gIGlmIChpc1NlcXVlbmNlKGN1cnJlbnQpKSB7XG4gICAgcmV0dXJuIHBhcnNlU2VxdWVuY2UoY3R4LCBkZXB0aCwgaWQsIGN1cnJlbnQpO1xuICB9XG4gIGNvbnN0IGN1cnJlbnRDbGFzcyA9IGN1cnJlbnQuY29uc3RydWN0b3I7XG4gIGlmIChjdXJyZW50Q2xhc3MgPT09IE9wYXF1ZVJlZmVyZW5jZSkge1xuICAgIHJldHVybiBwYXJzZVNPUyhcbiAgICAgIGN0eCxcbiAgICAgIGRlcHRoLFxuICAgICAgKGN1cnJlbnQgYXMgT3BhcXVlUmVmZXJlbmNlPHVua25vd24sIHVua25vd24+KS5yZXBsYWNlbWVudCxcbiAgICApO1xuICB9XG4gIGNvbnN0IHBhcnNlZCA9IHBhcnNlUGx1Z2luKGN0eCwgZGVwdGgsIGlkLCBjdXJyZW50KTtcbiAgaWYgKHBhcnNlZCkge1xuICAgIHJldHVybiBwYXJzZWQ7XG4gIH1cbiAgcmV0dXJuIHBhcnNlT2JqZWN0UGhhc2UyKGN0eCwgZGVwdGgsIGlkLCBjdXJyZW50LCBjdXJyZW50Q2xhc3MpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUZ1bmN0aW9uKFxuICBjdHg6IFNPU1BhcnNlckNvbnRleHQsXG4gIGRlcHRoOiBudW1iZXIsXG4gIGN1cnJlbnQ6IHVua25vd24sXG4pOiBTZXJvdmFsTm9kZSB7XG4gIGNvbnN0IHJlZiA9IGdldFJlZmVyZW5jZU5vZGUoY3R4LmJhc2UsIGN1cnJlbnQpO1xuICBpZiAocmVmLnR5cGUgIT09IFBhcnNlck5vZGVUeXBlLkZyZXNoKSB7XG4gICAgcmV0dXJuIHJlZi52YWx1ZTtcbiAgfVxuICBjb25zdCBwbHVnaW4gPSBwYXJzZVBsdWdpbihjdHgsIGRlcHRoLCByZWYudmFsdWUsIGN1cnJlbnQpO1xuICBpZiAocGx1Z2luKSB7XG4gICAgcmV0dXJuIHBsdWdpbjtcbiAgfVxuICB0aHJvdyBuZXcgU2Vyb3ZhbFVuc3VwcG9ydGVkVHlwZUVycm9yKGN1cnJlbnQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTT1M8VD4oXG4gIGN0eDogU09TUGFyc2VyQ29udGV4dCxcbiAgZGVwdGg6IG51bWJlcixcbiAgY3VycmVudDogVCxcbik6IFNlcm92YWxOb2RlIHtcbiAgaWYgKGRlcHRoID49IGN0eC5iYXNlLmRlcHRoTGltaXQpIHtcbiAgICB0aHJvdyBuZXcgU2Vyb3ZhbERlcHRoTGltaXRFcnJvcihjdHguYmFzZS5kZXB0aExpbWl0KTtcbiAgfVxuICBzd2l0Y2ggKHR5cGVvZiBjdXJyZW50KSB7XG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICByZXR1cm4gY3VycmVudCA/IFRSVUVfTk9ERSA6IEZBTFNFX05PREU7XG4gICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgIHJldHVybiBVTkRFRklORURfTk9ERTtcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgcmV0dXJuIGNyZWF0ZVN0cmluZ05vZGUoY3VycmVudCBhcyBzdHJpbmcpO1xuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gY3JlYXRlTnVtYmVyTm9kZShjdXJyZW50IGFzIG51bWJlcik7XG4gICAgY2FzZSAnYmlnaW50JzpcbiAgICAgIHJldHVybiBjcmVhdGVCaWdJbnROb2RlKGN1cnJlbnQgYXMgYmlnaW50KTtcbiAgICBjYXNlICdvYmplY3QnOiB7XG4gICAgICBpZiAoY3VycmVudCkge1xuICAgICAgICBjb25zdCByZWYgPSBnZXRSZWZlcmVuY2VOb2RlKGN0eC5iYXNlLCBjdXJyZW50KTtcbiAgICAgICAgcmV0dXJuIHJlZi50eXBlID09PSBQYXJzZXJOb2RlVHlwZS5GcmVzaFxuICAgICAgICAgID8gcGFyc2VPYmplY3QoY3R4LCBkZXB0aCArIDEsIHJlZi52YWx1ZSwgY3VycmVudCBhcyBvYmplY3QpXG4gICAgICAgICAgOiByZWYudmFsdWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gTlVMTF9OT0RFO1xuICAgIH1cbiAgICBjYXNlICdzeW1ib2wnOlxuICAgICAgcmV0dXJuIHBhcnNlV2VsbEtub3duU3ltYm9sKGN0eC5iYXNlLCBjdXJyZW50KTtcbiAgICBjYXNlICdmdW5jdGlvbic6IHtcbiAgICAgIHJldHVybiBwYXJzZUZ1bmN0aW9uKGN0eCwgZGVwdGgsIGN1cnJlbnQpO1xuICAgIH1cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IFNlcm92YWxVbnN1cHBvcnRlZFR5cGVFcnJvcihjdXJyZW50KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUb3A8VD4oY3R4OiBTeW5jUGFyc2VyQ29udGV4dCwgY3VycmVudDogVCk6IFNlcm92YWxOb2RlIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gcGFyc2VTT1MoY3R4LCAwLCBjdXJyZW50KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBlcnJvciBpbnN0YW5jZW9mIFNlcm92YWxQYXJzZXJFcnJvclxuICAgICAgPyBlcnJvclxuICAgICAgOiBuZXcgU2Vyb3ZhbFBhcnNlckVycm9yKGVycm9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBvblBhcnNlKGN0eDogU3RyZWFtUGFyc2VyQ29udGV4dCwgbm9kZTogU2Vyb3ZhbE5vZGUpOiB2b2lkIHtcbiAgLy8gSWYgdGhlIHZhbHVlIGVtaXR0ZWQgaGFwcGVucyB0byBiZSBkdXJpbmcgcGFyc2luZywgd2UgcHVzaCB0byB0aGVcbiAgLy8gYnVmZmVyIGFuZCBlbWl0IGFmdGVyIHRoZSBpbml0aWFsIHBhcnNpbmcgaXMgZG9uZS5cbiAgaWYgKGN0eC5zdGF0ZS5pbml0aWFsKSB7XG4gICAgY3R4LnN0YXRlLmJ1ZmZlci5wdXNoKG5vZGUpO1xuICB9IGVsc2Uge1xuICAgIG9uUGFyc2VJbnRlcm5hbChjdHgsIG5vZGUsIGZhbHNlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBvbkVycm9yKGN0eDogU3RyZWFtUGFyc2VyQ29udGV4dCwgZXJyb3I6IHVua25vd24pOiB2b2lkIHtcbiAgaWYgKGN0eC5zdGF0ZS5vbkVycm9yKSB7XG4gICAgY3R4LnN0YXRlLm9uRXJyb3IoZXJyb3IpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IGVycm9yIGluc3RhbmNlb2YgU2Vyb3ZhbFBhcnNlckVycm9yXG4gICAgICA/IGVycm9yXG4gICAgICA6IG5ldyBTZXJvdmFsUGFyc2VyRXJyb3IoZXJyb3IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG9uRG9uZShjdHg6IFN0cmVhbVBhcnNlckNvbnRleHQpOiB2b2lkIHtcbiAgaWYgKGN0eC5zdGF0ZS5vbkRvbmUpIHtcbiAgICBjdHguc3RhdGUub25Eb25lKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gb25QYXJzZUludGVybmFsKFxuICBjdHg6IFN0cmVhbVBhcnNlckNvbnRleHQsXG4gIG5vZGU6IFNlcm92YWxOb2RlLFxuICBpbml0aWFsOiBib29sZWFuLFxuKTogdm9pZCB7XG4gIHRyeSB7XG4gICAgY3R4LnN0YXRlLm9uUGFyc2Uobm9kZSwgaW5pdGlhbCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgb25FcnJvcihjdHgsIGVycm9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwdXNoUGVuZGluZ1N0YXRlKGN0eDogU3RyZWFtUGFyc2VyQ29udGV4dCk6IHZvaWQge1xuICBjdHguc3RhdGUucGVuZGluZysrO1xufVxuXG5mdW5jdGlvbiBwb3BQZW5kaW5nU3RhdGUoY3R4OiBTdHJlYW1QYXJzZXJDb250ZXh0KTogdm9pZCB7XG4gIGlmICgtLWN0eC5zdGF0ZS5wZW5kaW5nIDw9IDApIHtcbiAgICBvbkRvbmUoY3R4KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZVdpdGhFcnJvcjxUPihcbiAgY3R4OiBTdHJlYW1QYXJzZXJDb250ZXh0LFxuICBkZXB0aDogbnVtYmVyLFxuICBjdXJyZW50OiBULFxuKTogU2Vyb3ZhbE5vZGUgfCB1bmRlZmluZWQge1xuICB0cnkge1xuICAgIHJldHVybiBwYXJzZVNPUyhjdHgsIGRlcHRoLCBjdXJyZW50KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgb25FcnJvcihjdHgsIGVycik7XG4gICAgcmV0dXJuIE5JTDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRTdHJlYW1QYXJzZTxUPihcbiAgY3R4OiBTdHJlYW1QYXJzZXJDb250ZXh0LFxuICBjdXJyZW50OiBULFxuKTogdm9pZCB7XG4gIGNvbnN0IHBhcnNlZCA9IHBhcnNlV2l0aEVycm9yKGN0eCwgMCwgY3VycmVudCk7XG4gIGlmIChwYXJzZWQpIHtcbiAgICBvblBhcnNlSW50ZXJuYWwoY3R4LCBwYXJzZWQsIHRydWUpO1xuICAgIGN0eC5zdGF0ZS5pbml0aWFsID0gZmFsc2U7XG4gICAgZmx1c2hTdHJlYW1QYXJzZShjdHgsIGN0eC5zdGF0ZSk7XG5cbiAgICAvLyBDaGVjayBpZiB0aGVyZSdzIGFueSBwZW5kaW5nIHB1c2hlc1xuICAgIGlmIChjdHguc3RhdGUucGVuZGluZyA8PSAwKSB7XG4gICAgICBkZXN0cm95U3RyZWFtUGFyc2UoY3R4KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZmx1c2hTdHJlYW1QYXJzZShcbiAgY3R4OiBTdHJlYW1QYXJzZXJDb250ZXh0LFxuICBzdGF0ZTogU3RyZWFtUGFyc2VyU3RhdGUsXG4pOiB2b2lkIHtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHN0YXRlLmJ1ZmZlci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIG9uUGFyc2VJbnRlcm5hbChjdHgsIHN0YXRlLmJ1ZmZlcltpXSwgZmFsc2UpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXN0cm95U3RyZWFtUGFyc2UoY3R4OiBTdHJlYW1QYXJzZXJDb250ZXh0KTogdm9pZCB7XG4gIGlmIChjdHguc3RhdGUuYWxpdmUpIHtcbiAgICBvbkRvbmUoY3R4KTtcbiAgICBjdHguc3RhdGUuYWxpdmUgPSBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBBc3luY1BhcnNlckNvbnRleHRPcHRpb25zIH0gZnJvbSAnLi4vY29udGV4dC9hc3luYy1wYXJzZXInO1xuaW1wb3J0IHtcbiAgY3JlYXRlQXN5bmNQYXJzZXJDb250ZXh0LFxuICBwYXJzZVRvcEFzeW5jLFxufSBmcm9tICcuLi9jb250ZXh0L2FzeW5jLXBhcnNlcic7XG5pbXBvcnQgdHlwZSB7IENyb3NzRGVzZXJpYWxpemVyQ29udGV4dE9wdGlvbnMgfSBmcm9tICcuLi9jb250ZXh0L2Rlc2VyaWFsaXplcic7XG5pbXBvcnQge1xuICBjcmVhdGVDcm9zc0Rlc2VyaWFsaXplckNvbnRleHQsXG4gIGRlc2VyaWFsaXplVG9wLFxufSBmcm9tICcuLi9jb250ZXh0L2Rlc2VyaWFsaXplcic7XG5pbXBvcnQgdHlwZSB7IENyb3NzQ29udGV4dE9wdGlvbnMgfSBmcm9tICcuLi9jb250ZXh0L3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtcbiAgY3JlYXRlQ3Jvc3NTZXJpYWxpemVyQ29udGV4dCxcbiAgc2VyaWFsaXplVG9wQ3Jvc3MsXG59IGZyb20gJy4uL2NvbnRleHQvc2VyaWFsaXplcic7XG5pbXBvcnQgdHlwZSB7XG4gIFN0cmVhbVBhcnNlckNvbnRleHRPcHRpb25zLFxuICBTeW5jUGFyc2VyQ29udGV4dE9wdGlvbnMsXG59IGZyb20gJy4uL2NvbnRleHQvc3luYy1wYXJzZXInO1xuaW1wb3J0IHtcbiAgY3JlYXRlU3RyZWFtUGFyc2VyQ29udGV4dCxcbiAgY3JlYXRlU3luY1BhcnNlckNvbnRleHQsXG4gIGRlc3Ryb3lTdHJlYW1QYXJzZSxcbiAgcGFyc2VUb3AsXG4gIHN0YXJ0U3RyZWFtUGFyc2UsXG59IGZyb20gJy4uL2NvbnRleHQvc3luYy1wYXJzZXInO1xuaW1wb3J0IHsgcmVzb2x2ZVBsdWdpbnMsIFNlcm92YWxNb2RlIH0gZnJvbSAnLi4vcGx1Z2luJztcbmltcG9ydCB0eXBlIHsgU2Vyb3ZhbE5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ3Jvc3NTZXJpYWxpemVPcHRpb25zXG4gIGV4dGVuZHMgU3luY1BhcnNlckNvbnRleHRPcHRpb25zLFxuICAgIENyb3NzQ29udGV4dE9wdGlvbnMge31cblxuZXhwb3J0IGZ1bmN0aW9uIGNyb3NzU2VyaWFsaXplPFQ+KFxuICBzb3VyY2U6IFQsXG4gIG9wdGlvbnM6IENyb3NzU2VyaWFsaXplT3B0aW9ucyA9IHt9LFxuKTogc3RyaW5nIHtcbiAgY29uc3QgcGx1Z2lucyA9IHJlc29sdmVQbHVnaW5zKG9wdGlvbnMucGx1Z2lucyk7XG4gIGNvbnN0IGN0eCA9IGNyZWF0ZVN5bmNQYXJzZXJDb250ZXh0KFNlcm92YWxNb2RlLkNyb3NzLCB7XG4gICAgcGx1Z2lucyxcbiAgICBkaXNhYmxlZEZlYXR1cmVzOiBvcHRpb25zLmRpc2FibGVkRmVhdHVyZXMsXG4gICAgcmVmczogb3B0aW9ucy5yZWZzLFxuICB9KTtcbiAgY29uc3QgdHJlZSA9IHBhcnNlVG9wKGN0eCwgc291cmNlKTtcbiAgY29uc3Qgc2VyaWFsID0gY3JlYXRlQ3Jvc3NTZXJpYWxpemVyQ29udGV4dCh7XG4gICAgcGx1Z2lucyxcbiAgICBmZWF0dXJlczogY3R4LmJhc2UuZmVhdHVyZXMsXG4gICAgc2NvcGVJZDogb3B0aW9ucy5zY29wZUlkLFxuICAgIG1hcmtlZFJlZnM6IGN0eC5iYXNlLm1hcmtlZCxcbiAgfSk7XG4gIHJldHVybiBzZXJpYWxpemVUb3BDcm9zcyhzZXJpYWwsIHRyZWUpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENyb3NzU2VyaWFsaXplQXN5bmNPcHRpb25zXG4gIGV4dGVuZHMgQXN5bmNQYXJzZXJDb250ZXh0T3B0aW9ucyxcbiAgICBDcm9zc0NvbnRleHRPcHRpb25zIHt9XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcm9zc1NlcmlhbGl6ZUFzeW5jPFQ+KFxuICBzb3VyY2U6IFQsXG4gIG9wdGlvbnM6IENyb3NzU2VyaWFsaXplQXN5bmNPcHRpb25zID0ge30sXG4pOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCBwbHVnaW5zID0gcmVzb2x2ZVBsdWdpbnMob3B0aW9ucy5wbHVnaW5zKTtcbiAgY29uc3QgY3R4ID0gY3JlYXRlQXN5bmNQYXJzZXJDb250ZXh0KFNlcm92YWxNb2RlLkNyb3NzLCB7XG4gICAgcGx1Z2lucyxcbiAgICBkaXNhYmxlZEZlYXR1cmVzOiBvcHRpb25zLmRpc2FibGVkRmVhdHVyZXMsXG4gICAgcmVmczogb3B0aW9ucy5yZWZzLFxuICB9KTtcbiAgY29uc3QgdHJlZSA9IGF3YWl0IHBhcnNlVG9wQXN5bmMoY3R4LCBzb3VyY2UpO1xuICBjb25zdCBzZXJpYWwgPSBjcmVhdGVDcm9zc1NlcmlhbGl6ZXJDb250ZXh0KHtcbiAgICBwbHVnaW5zLFxuICAgIGZlYXR1cmVzOiBjdHguYmFzZS5mZWF0dXJlcyxcbiAgICBzY29wZUlkOiBvcHRpb25zLnNjb3BlSWQsXG4gICAgbWFya2VkUmVmczogY3R4LmJhc2UubWFya2VkLFxuICB9KTtcbiAgcmV0dXJuIHNlcmlhbGl6ZVRvcENyb3NzKHNlcmlhbCwgdHJlZSk7XG59XG5cbmV4cG9ydCB0eXBlIFRvQ3Jvc3NKU09OT3B0aW9ucyA9IFN5bmNQYXJzZXJDb250ZXh0T3B0aW9ucztcblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ3Jvc3NKU09OPFQ+KFxuICBzb3VyY2U6IFQsXG4gIG9wdGlvbnM6IFRvQ3Jvc3NKU09OT3B0aW9ucyA9IHt9LFxuKTogU2Vyb3ZhbE5vZGUge1xuICBjb25zdCBwbHVnaW5zID0gcmVzb2x2ZVBsdWdpbnMob3B0aW9ucy5wbHVnaW5zKTtcbiAgY29uc3QgY3R4ID0gY3JlYXRlU3luY1BhcnNlckNvbnRleHQoU2Vyb3ZhbE1vZGUuQ3Jvc3MsIHtcbiAgICBwbHVnaW5zLFxuICAgIGRpc2FibGVkRmVhdHVyZXM6IG9wdGlvbnMuZGlzYWJsZWRGZWF0dXJlcyxcbiAgICByZWZzOiBvcHRpb25zLnJlZnMsXG4gIH0pO1xuICByZXR1cm4gcGFyc2VUb3AoY3R4LCBzb3VyY2UpO1xufVxuXG5leHBvcnQgdHlwZSBUb0Nyb3NzSlNPTkFzeW5jT3B0aW9ucyA9IEFzeW5jUGFyc2VyQ29udGV4dE9wdGlvbnM7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0b0Nyb3NzSlNPTkFzeW5jPFQ+KFxuICBzb3VyY2U6IFQsXG4gIG9wdGlvbnM6IFRvQ3Jvc3NKU09OQXN5bmNPcHRpb25zID0ge30sXG4pOiBQcm9taXNlPFNlcm92YWxOb2RlPiB7XG4gIGNvbnN0IHBsdWdpbnMgPSByZXNvbHZlUGx1Z2lucyhvcHRpb25zLnBsdWdpbnMpO1xuICBjb25zdCBjdHggPSBjcmVhdGVBc3luY1BhcnNlckNvbnRleHQoU2Vyb3ZhbE1vZGUuQ3Jvc3MsIHtcbiAgICBwbHVnaW5zLFxuICAgIGRpc2FibGVkRmVhdHVyZXM6IG9wdGlvbnMuZGlzYWJsZWRGZWF0dXJlcyxcbiAgICByZWZzOiBvcHRpb25zLnJlZnMsXG4gIH0pO1xuICByZXR1cm4gYXdhaXQgcGFyc2VUb3BBc3luYyhjdHgsIHNvdXJjZSk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ3Jvc3NTZXJpYWxpemVTdHJlYW1PcHRpb25zXG4gIGV4dGVuZHMgT21pdDxTdHJlYW1QYXJzZXJDb250ZXh0T3B0aW9ucywgJ29uUGFyc2UnPixcbiAgICBDcm9zc0NvbnRleHRPcHRpb25zIHtcbiAgb25TZXJpYWxpemU6IChkYXRhOiBzdHJpbmcsIGluaXRpYWw6IGJvb2xlYW4pID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcm9zc1NlcmlhbGl6ZVN0cmVhbTxUPihcbiAgc291cmNlOiBULFxuICBvcHRpb25zOiBDcm9zc1NlcmlhbGl6ZVN0cmVhbU9wdGlvbnMsXG4pOiAoKSA9PiB2b2lkIHtcbiAgY29uc3QgcGx1Z2lucyA9IHJlc29sdmVQbHVnaW5zKG9wdGlvbnMucGx1Z2lucyk7XG4gIGNvbnN0IGN0eCA9IGNyZWF0ZVN0cmVhbVBhcnNlckNvbnRleHQoe1xuICAgIHBsdWdpbnMsXG4gICAgcmVmczogb3B0aW9ucy5yZWZzLFxuICAgIGRpc2FibGVkRmVhdHVyZXM6IG9wdGlvbnMuZGlzYWJsZWRGZWF0dXJlcyxcbiAgICBvblBhcnNlKG5vZGUsIGluaXRpYWwpOiB2b2lkIHtcbiAgICAgIGNvbnN0IHNlcmlhbCA9IGNyZWF0ZUNyb3NzU2VyaWFsaXplckNvbnRleHQoe1xuICAgICAgICBwbHVnaW5zLFxuICAgICAgICBmZWF0dXJlczogY3R4LmJhc2UuZmVhdHVyZXMsXG4gICAgICAgIHNjb3BlSWQ6IG9wdGlvbnMuc2NvcGVJZCxcbiAgICAgICAgbWFya2VkUmVmczogY3R4LmJhc2UubWFya2VkLFxuICAgICAgfSk7XG5cbiAgICAgIGxldCBzZXJpYWxpemVkOiBzdHJpbmc7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHNlcmlhbGl6ZWQgPSBzZXJpYWxpemVUb3BDcm9zcyhzZXJpYWwsIG5vZGUpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmIChvcHRpb25zLm9uRXJyb3IpIHtcbiAgICAgICAgICBvcHRpb25zLm9uRXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMub25TZXJpYWxpemUoc2VyaWFsaXplZCwgaW5pdGlhbCk7XG4gICAgfSxcbiAgICBvbkVycm9yOiBvcHRpb25zLm9uRXJyb3IsXG4gICAgb25Eb25lOiBvcHRpb25zLm9uRG9uZSxcbiAgfSk7XG5cbiAgc3RhcnRTdHJlYW1QYXJzZShjdHgsIHNvdXJjZSk7XG5cbiAgcmV0dXJuIGRlc3Ryb3lTdHJlYW1QYXJzZS5iaW5kKG51bGwsIGN0eCk7XG59XG5cbmV4cG9ydCB0eXBlIFRvQ3Jvc3NKU09OU3RyZWFtT3B0aW9ucyA9IFN0cmVhbVBhcnNlckNvbnRleHRPcHRpb25zO1xuXG5leHBvcnQgZnVuY3Rpb24gdG9Dcm9zc0pTT05TdHJlYW08VD4oXG4gIHNvdXJjZTogVCxcbiAgb3B0aW9uczogVG9Dcm9zc0pTT05TdHJlYW1PcHRpb25zLFxuKTogKCkgPT4gdm9pZCB7XG4gIGNvbnN0IHBsdWdpbnMgPSByZXNvbHZlUGx1Z2lucyhvcHRpb25zLnBsdWdpbnMpO1xuICBjb25zdCBjdHggPSBjcmVhdGVTdHJlYW1QYXJzZXJDb250ZXh0KHtcbiAgICBwbHVnaW5zLFxuICAgIHJlZnM6IG9wdGlvbnMucmVmcyxcbiAgICBkaXNhYmxlZEZlYXR1cmVzOiBvcHRpb25zLmRpc2FibGVkRmVhdHVyZXMsXG4gICAgZGVwdGhMaW1pdDogb3B0aW9ucy5kZXB0aExpbWl0LFxuICAgIG9uUGFyc2U6IG9wdGlvbnMub25QYXJzZSxcbiAgICBvbkVycm9yOiBvcHRpb25zLm9uRXJyb3IsXG4gICAgb25Eb25lOiBvcHRpb25zLm9uRG9uZSxcbiAgfSk7XG5cbiAgc3RhcnRTdHJlYW1QYXJzZShjdHgsIHNvdXJjZSk7XG5cbiAgcmV0dXJuIGRlc3Ryb3lTdHJlYW1QYXJzZS5iaW5kKG51bGwsIGN0eCk7XG59XG5cbmV4cG9ydCB0eXBlIEZyb21Dcm9zc0pTT05PcHRpb25zID0gQ3Jvc3NEZXNlcmlhbGl6ZXJDb250ZXh0T3B0aW9ucztcblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21Dcm9zc0pTT048VD4oXG4gIHNvdXJjZTogU2Vyb3ZhbE5vZGUsXG4gIG9wdGlvbnM6IEZyb21Dcm9zc0pTT05PcHRpb25zLFxuKTogVCB7XG4gIGNvbnN0IHBsdWdpbnMgPSByZXNvbHZlUGx1Z2lucyhvcHRpb25zLnBsdWdpbnMpO1xuICBjb25zdCBjdHggPSBjcmVhdGVDcm9zc0Rlc2VyaWFsaXplckNvbnRleHQoe1xuICAgIHBsdWdpbnMsXG4gICAgcmVmczogb3B0aW9ucy5yZWZzLFxuICAgIGZlYXR1cmVzOiBvcHRpb25zLmZlYXR1cmVzLFxuICAgIGRpc2FibGVkRmVhdHVyZXM6IG9wdGlvbnMuZGlzYWJsZWRGZWF0dXJlcyxcbiAgICBkZXB0aExpbWl0OiBvcHRpb25zLmRlcHRoTGltaXQsXG4gIH0pO1xuICByZXR1cm4gZGVzZXJpYWxpemVUb3AoY3R4LCBzb3VyY2UpIGFzIFQ7XG59XG4iLCJpbXBvcnQgeyBjcm9zc1NlcmlhbGl6ZVN0cmVhbSB9IGZyb20gJy4vY3Jvc3MnO1xuaW1wb3J0IHtcbiAgcmVzb2x2ZVBsdWdpbnMsXG4gIHR5cGUgUGx1Z2luLFxuICB0eXBlIFBsdWdpbkFjY2Vzc09wdGlvbnMsXG59IGZyb20gJy4vcGx1Z2luJztcbmltcG9ydCB7IHNlcmlhbGl6ZVN0cmluZyB9IGZyb20gJy4vc3RyaW5nJztcblxuZXhwb3J0IGludGVyZmFjZSBTZXJpYWxpemVyT3B0aW9ucyBleHRlbmRzIFBsdWdpbkFjY2Vzc09wdGlvbnMge1xuICBnbG9iYWxJZGVudGlmaWVyOiBzdHJpbmc7XG4gIHNjb3BlSWQ/OiBzdHJpbmc7XG4gIGRpc2FibGVkRmVhdHVyZXM/OiBudW1iZXI7XG4gIG9uRGF0YTogKHJlc3VsdDogc3RyaW5nKSA9PiB2b2lkO1xuICBvbkVycm9yOiAoZXJyb3I6IHVua25vd24pID0+IHZvaWQ7XG4gIG9uRG9uZT86ICgpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcmlhbGl6ZXIge1xuICBwcml2YXRlIGFsaXZlID0gdHJ1ZTtcblxuICBwcml2YXRlIGZsdXNoZWQgPSBmYWxzZTtcblxuICBwcml2YXRlIGRvbmUgPSBmYWxzZTtcblxuICBwcml2YXRlIHBlbmRpbmcgPSAwO1xuXG4gIHByaXZhdGUgY2xlYW51cHM6ICgoKSA9PiB2b2lkKVtdID0gW107XG5cbiAgcHJpdmF0ZSByZWZzID0gbmV3IE1hcDx1bmtub3duLCBudW1iZXI+KCk7XG5cbiAgcHJpdmF0ZSBwbHVnaW5zPzogUGx1Z2luPGFueSwgYW55PltdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgb3B0aW9uczogU2VyaWFsaXplck9wdGlvbnMpIHtcbiAgICB0aGlzLnBsdWdpbnMgPSByZXNvbHZlUGx1Z2lucyhvcHRpb25zLnBsdWdpbnMpO1xuICB9XG5cbiAga2V5cyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG4gIHdyaXRlKGtleTogc3RyaW5nLCB2YWx1ZTogdW5rbm93bik6IHZvaWQge1xuICAgIGlmICh0aGlzLmFsaXZlICYmICF0aGlzLmZsdXNoZWQpIHtcbiAgICAgIHRoaXMucGVuZGluZysrO1xuICAgICAgdGhpcy5rZXlzLmFkZChrZXkpO1xuICAgICAgdGhpcy5jbGVhbnVwcy5wdXNoKFxuICAgICAgICBjcm9zc1NlcmlhbGl6ZVN0cmVhbSh2YWx1ZSwge1xuICAgICAgICAgIHBsdWdpbnM6IHRoaXMucGx1Z2lucyxcbiAgICAgICAgICBzY29wZUlkOiB0aGlzLm9wdGlvbnMuc2NvcGVJZCxcbiAgICAgICAgICByZWZzOiB0aGlzLnJlZnMsXG4gICAgICAgICAgZGlzYWJsZWRGZWF0dXJlczogdGhpcy5vcHRpb25zLmRpc2FibGVkRmVhdHVyZXMsXG4gICAgICAgICAgb25FcnJvcjogdGhpcy5vcHRpb25zLm9uRXJyb3IsXG4gICAgICAgICAgb25TZXJpYWxpemU6IChkYXRhLCBpbml0aWFsKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5hbGl2ZSkge1xuICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMub25EYXRhKFxuICAgICAgICAgICAgICAgIGluaXRpYWxcbiAgICAgICAgICAgICAgICAgID8gdGhpcy5vcHRpb25zLmdsb2JhbElkZW50aWZpZXIgK1xuICAgICAgICAgICAgICAgICAgICAgICdbXCInICtcbiAgICAgICAgICAgICAgICAgICAgICBzZXJpYWxpemVTdHJpbmcoa2V5KSArXG4gICAgICAgICAgICAgICAgICAgICAgJ1wiXT0nICtcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhXG4gICAgICAgICAgICAgICAgICA6IGRhdGEsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBvbkRvbmU6ICgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFsaXZlKSB7XG4gICAgICAgICAgICAgIHRoaXMucGVuZGluZy0tO1xuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdGhpcy5wZW5kaW5nIDw9IDAgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmZsdXNoZWQgJiZcbiAgICAgICAgICAgICAgICAhdGhpcy5kb25lICYmXG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLm9uRG9uZVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMub25Eb25lKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBpZHMgPSAwO1xuXG4gIHByaXZhdGUgZ2V0TmV4dElEKCk6IHN0cmluZyB7XG4gICAgd2hpbGUgKHRoaXMua2V5cy5oYXMoJycgKyB0aGlzLmlkcykpIHtcbiAgICAgIHRoaXMuaWRzKys7XG4gICAgfVxuICAgIHJldHVybiAnJyArIHRoaXMuaWRzO1xuICB9XG5cbiAgcHVzaCh2YWx1ZTogdW5rbm93bik6IHN0cmluZyB7XG4gICAgY29uc3QgbmV3SUQgPSB0aGlzLmdldE5leHRJRCgpO1xuICAgIHRoaXMud3JpdGUobmV3SUQsIHZhbHVlKTtcbiAgICByZXR1cm4gbmV3SUQ7XG4gIH1cblxuICBmbHVzaCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5hbGl2ZSkge1xuICAgICAgdGhpcy5mbHVzaGVkID0gdHJ1ZTtcbiAgICAgIGlmICh0aGlzLnBlbmRpbmcgPD0gMCAmJiAhdGhpcy5kb25lICYmIHRoaXMub3B0aW9ucy5vbkRvbmUpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLm9uRG9uZSgpO1xuICAgICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNsb3NlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmFsaXZlKSB7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy5jbGVhbnVwcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICB0aGlzLmNsZWFudXBzW2ldKCk7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuZG9uZSAmJiB0aGlzLm9wdGlvbnMub25Eb25lKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5vbkRvbmUoKTtcbiAgICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYWxpdmUgPSBmYWxzZTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIGNyZWF0ZUFzeW5jUGFyc2VyQ29udGV4dCxcbiAgcGFyc2VUb3BBc3luYyxcbn0gZnJvbSAnLi4vY29udGV4dC9hc3luYy1wYXJzZXInO1xuaW1wb3J0IHtcbiAgY3JlYXRlVmFuaWxsYURlc2VyaWFsaXplckNvbnRleHQsXG4gIGRlc2VyaWFsaXplVG9wLFxufSBmcm9tICcuLi9jb250ZXh0L2Rlc2VyaWFsaXplcic7XG5pbXBvcnQgdHlwZSB7IEJhc2VQYXJzZXJDb250ZXh0T3B0aW9ucyB9IGZyb20gJy4uL2NvbnRleHQvcGFyc2VyJztcbmltcG9ydCB7XG4gIGNyZWF0ZVZhbmlsbGFTZXJpYWxpemVyQ29udGV4dCxcbiAgc2VyaWFsaXplVG9wVmFuaWxsYSxcbn0gZnJvbSAnLi4vY29udGV4dC9zZXJpYWxpemVyJztcbmltcG9ydCB7IGNyZWF0ZVN5bmNQYXJzZXJDb250ZXh0LCBwYXJzZVRvcCB9IGZyb20gJy4uL2NvbnRleHQvc3luYy1wYXJzZXInO1xuaW1wb3J0IHtcbiAgdHlwZSBQbHVnaW5BY2Nlc3NPcHRpb25zLFxuICByZXNvbHZlUGx1Z2lucyxcbiAgU2Vyb3ZhbE1vZGUsXG59IGZyb20gJy4uL3BsdWdpbic7XG5pbXBvcnQgdHlwZSB7IFNlcm92YWxOb2RlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgQUxMX0VOQUJMRUQgfSBmcm9tICcuLi9jb21wYXQnO1xuZXhwb3J0IHR5cGUgU3luY1BhcnNlckNvbnRleHRPcHRpb25zID0gT21pdDxCYXNlUGFyc2VyQ29udGV4dE9wdGlvbnMsICdyZWZzJz47XG5leHBvcnQgdHlwZSBBc3luY1BhcnNlckNvbnRleHRPcHRpb25zID0gT21pdDxCYXNlUGFyc2VyQ29udGV4dE9wdGlvbnMsICdyZWZzJz47XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemU8VD4oXG4gIHNvdXJjZTogVCxcbiAgb3B0aW9uczogU3luY1BhcnNlckNvbnRleHRPcHRpb25zID0ge30sXG4pOiBzdHJpbmcge1xuICBjb25zdCBwbHVnaW5zID0gcmVzb2x2ZVBsdWdpbnMob3B0aW9ucy5wbHVnaW5zKTtcbiAgY29uc3QgY3R4ID0gY3JlYXRlU3luY1BhcnNlckNvbnRleHQoU2Vyb3ZhbE1vZGUuVmFuaWxsYSwge1xuICAgIHBsdWdpbnMsXG4gICAgZGlzYWJsZWRGZWF0dXJlczogb3B0aW9ucy5kaXNhYmxlZEZlYXR1cmVzLFxuICB9KTtcbiAgY29uc3QgdHJlZSA9IHBhcnNlVG9wKGN0eCwgc291cmNlKTtcbiAgY29uc3Qgc2VyaWFsID0gY3JlYXRlVmFuaWxsYVNlcmlhbGl6ZXJDb250ZXh0KHtcbiAgICBwbHVnaW5zLFxuICAgIGZlYXR1cmVzOiBjdHguYmFzZS5mZWF0dXJlcyxcbiAgICBtYXJrZWRSZWZzOiBjdHguYmFzZS5tYXJrZWQsXG4gIH0pO1xuICByZXR1cm4gc2VyaWFsaXplVG9wVmFuaWxsYShzZXJpYWwsIHRyZWUpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VyaWFsaXplQXN5bmM8VD4oXG4gIHNvdXJjZTogVCxcbiAgb3B0aW9uczogQXN5bmNQYXJzZXJDb250ZXh0T3B0aW9ucyA9IHt9LFxuKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgcGx1Z2lucyA9IHJlc29sdmVQbHVnaW5zKG9wdGlvbnMucGx1Z2lucyk7XG4gIGNvbnN0IGN0eCA9IGNyZWF0ZUFzeW5jUGFyc2VyQ29udGV4dChTZXJvdmFsTW9kZS5WYW5pbGxhLCB7XG4gICAgcGx1Z2lucyxcbiAgICBkaXNhYmxlZEZlYXR1cmVzOiBvcHRpb25zLmRpc2FibGVkRmVhdHVyZXMsXG4gIH0pO1xuICBjb25zdCB0cmVlID0gYXdhaXQgcGFyc2VUb3BBc3luYyhjdHgsIHNvdXJjZSk7XG4gIGNvbnN0IHNlcmlhbCA9IGNyZWF0ZVZhbmlsbGFTZXJpYWxpemVyQ29udGV4dCh7XG4gICAgcGx1Z2lucyxcbiAgICBmZWF0dXJlczogY3R4LmJhc2UuZmVhdHVyZXMsXG4gICAgbWFya2VkUmVmczogY3R4LmJhc2UubWFya2VkLFxuICB9KTtcbiAgcmV0dXJuIHNlcmlhbGl6ZVRvcFZhbmlsbGEoc2VyaWFsLCB0cmVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlc2VyaWFsaXplPFQ+KHNvdXJjZTogc3RyaW5nKTogVCB7XG4gIHJldHVybiAoMCwgZXZhbCkoc291cmNlKSBhcyBUO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNlcm92YWxKU09OIHtcbiAgdDogU2Vyb3ZhbE5vZGU7XG4gIGY6IG51bWJlcjtcbiAgbTogbnVtYmVyW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRnJvbUpTT05PcHRpb25zIGV4dGVuZHMgUGx1Z2luQWNjZXNzT3B0aW9ucyB7XG4gIGRpc2FibGVkRmVhdHVyZXM/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0pTT048VD4oXG4gIHNvdXJjZTogVCxcbiAgb3B0aW9uczogU3luY1BhcnNlckNvbnRleHRPcHRpb25zID0ge30sXG4pOiBTZXJvdmFsSlNPTiB7XG4gIGNvbnN0IHBsdWdpbnMgPSByZXNvbHZlUGx1Z2lucyhvcHRpb25zLnBsdWdpbnMpO1xuICBjb25zdCBjdHggPSBjcmVhdGVTeW5jUGFyc2VyQ29udGV4dChTZXJvdmFsTW9kZS5WYW5pbGxhLCB7XG4gICAgcGx1Z2lucyxcbiAgICBkaXNhYmxlZEZlYXR1cmVzOiBvcHRpb25zLmRpc2FibGVkRmVhdHVyZXMsXG4gIH0pO1xuICByZXR1cm4ge1xuICAgIHQ6IHBhcnNlVG9wKGN0eCwgc291cmNlKSxcbiAgICBmOiBjdHguYmFzZS5mZWF0dXJlcyxcbiAgICBtOiBBcnJheS5mcm9tKGN0eC5iYXNlLm1hcmtlZCksXG4gIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0b0pTT05Bc3luYzxUPihcbiAgc291cmNlOiBULFxuICBvcHRpb25zOiBBc3luY1BhcnNlckNvbnRleHRPcHRpb25zID0ge30sXG4pOiBQcm9taXNlPFNlcm92YWxKU09OPiB7XG4gIGNvbnN0IHBsdWdpbnMgPSByZXNvbHZlUGx1Z2lucyhvcHRpb25zLnBsdWdpbnMpO1xuICBjb25zdCBjdHggPSBjcmVhdGVBc3luY1BhcnNlckNvbnRleHQoU2Vyb3ZhbE1vZGUuVmFuaWxsYSwge1xuICAgIHBsdWdpbnMsXG4gICAgZGlzYWJsZWRGZWF0dXJlczogb3B0aW9ucy5kaXNhYmxlZEZlYXR1cmVzLFxuICB9KTtcbiAgcmV0dXJuIHtcbiAgICB0OiBhd2FpdCBwYXJzZVRvcEFzeW5jKGN0eCwgc291cmNlKSxcbiAgICBmOiBjdHguYmFzZS5mZWF0dXJlcyxcbiAgICBtOiBBcnJheS5mcm9tKGN0eC5iYXNlLm1hcmtlZCksXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlSlNPTihcbiAgc291cmNlOiBTZXJvdmFsSlNPTixcbiAgb3B0aW9uczogUGx1Z2luQWNjZXNzT3B0aW9ucyA9IHt9LFxuKTogc3RyaW5nIHtcbiAgY29uc3QgcGx1Z2lucyA9IHJlc29sdmVQbHVnaW5zKG9wdGlvbnMucGx1Z2lucyk7XG4gIGNvbnN0IGN0eCA9IGNyZWF0ZVZhbmlsbGFTZXJpYWxpemVyQ29udGV4dCh7XG4gICAgcGx1Z2lucyxcbiAgICBmZWF0dXJlczogc291cmNlLmYsXG4gICAgbWFya2VkUmVmczogc291cmNlLm0sXG4gIH0pO1xuICByZXR1cm4gc2VyaWFsaXplVG9wVmFuaWxsYShjdHgsIHNvdXJjZS50KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21KU09OPFQ+KFxuICBzb3VyY2U6IFNlcm92YWxKU09OLFxuICBvcHRpb25zOiBGcm9tSlNPTk9wdGlvbnMgPSB7fSxcbik6IFQge1xuICBjb25zdCBwbHVnaW5zID0gcmVzb2x2ZVBsdWdpbnMob3B0aW9ucy5wbHVnaW5zKTtcbiAgY29uc3QgZGlzYWJsZWRGZWF0dXJlcyA9IG9wdGlvbnMuZGlzYWJsZWRGZWF0dXJlcyB8fCAwO1xuICBjb25zdCBzb3VyY2VGZWF0dXJlcyA9IHNvdXJjZS5mID8/IEFMTF9FTkFCTEVEO1xuICBjb25zdCBjdHggPSBjcmVhdGVWYW5pbGxhRGVzZXJpYWxpemVyQ29udGV4dCh7XG4gICAgcGx1Z2lucyxcbiAgICBtYXJrZWRSZWZzOiBzb3VyY2UubSxcbiAgICBmZWF0dXJlczogc291cmNlRmVhdHVyZXMgJiB+ZGlzYWJsZWRGZWF0dXJlcyxcbiAgICBkaXNhYmxlZEZlYXR1cmVzLFxuICB9KTtcbiAgcmV0dXJuIGRlc2VyaWFsaXplVG9wKGN0eCwgc291cmNlLnQpIGFzIFQ7XG59XG4iXSwibWFwcGlu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O0FBQUEsSUFDQSxZQUFZLE9BQU87QUFBQSxJQUNuQixVQUFVLGlCQUFpQixDQUFDO0FBQUEsSUFDNUI7QUFBQSxFQUNGLENBQUM7QUFDRCxTQUFPLGVBQWUsS0FBSyxPQUFPLENBQUM7QUFDckM7IiwibmFtZXMiOlsiRmVhdHVyZSIsImluZGV4IiwiU2Vyb3ZhbE1vZGUiLCJsZW4iLCJhc3NpZ25JbmRleGVkVmFsdWUiLCJwYXJzZUl0ZW1zIiwicGFyc2VBcnJheSIsInBhcnNlUHJvcGVydGllcyIsInBhcnNlUGxhaW5PYmplY3QiLCJwYXJzZUJveGVkIiwicGFyc2VUeXBlZEFycmF5IiwicGFyc2VCaWdJbnRUeXBlZEFycmF5IiwicGFyc2VEYXRhVmlldyIsInBhcnNlRXJyb3IiLCJwYXJzZUFnZ3JlZ2F0ZUVycm9yIiwicGFyc2VNYXAiLCJwYXJzZVNldCIsInBhcnNlU3RyZWFtIiwicGFyc2VQcm9taXNlIiwicGFyc2VQbHVnaW4iLCJwYXJzZVNlcXVlbmNlIiwic2VyaWFsaXplIiwiZGVzZXJpYWxpemUiXSwieF9nb29nbGVfaWdub3JlTGlzdCI6WzAsMSwyLDMsNCw1LDYsNyw4LDksMTAsMTEsMTIsMTMsMTQsMTUsMTYsMTcsMTgsMTksMjAsMjEsMjIsMjMsMjQsMjUsMjYsMjcsMjgsMjksMzBdfQ==