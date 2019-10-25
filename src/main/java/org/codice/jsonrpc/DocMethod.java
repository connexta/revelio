package org.codice.jsonrpc;

import java.util.Map;

public class DocMethod implements Method {
  private final Method method;

  public final String docstring;

  public DocMethod(Method method, String docstring) {
    this.method = method;
    this.docstring = docstring;
  }

  @Override
  public Object apply(Map<String, Object> arg) {
    return method.apply(arg);
  }
}
