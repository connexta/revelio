package org.codice.jsonrpc;

import java.util.Map;
import java.util.function.Function;

public interface Method extends Function<Map<String, Object>, Object> {}
