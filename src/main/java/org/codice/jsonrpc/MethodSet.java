package org.codice.jsonrpc;

import java.util.Map;

public interface MethodSet {
  Map<String, DocMethod> getMethods();
}
