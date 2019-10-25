package org.codice.jsonrpc;

import java.util.Collections;

public class Error {

  public final int code;
  public final String message;
  public final Object data;

  public Error(int code, String message) {
    this(code, message, null);
  }

  public Error(int code, String message, Object data) {
    this.code = code;
    this.message = message != null ? message : "";
    this.data = data != null ? data : Collections.emptyMap();
  }
}
