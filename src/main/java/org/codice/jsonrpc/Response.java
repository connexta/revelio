package org.codice.jsonrpc;

import static org.codice.jsonrpc.JsonRpc.VERSION;

public class Response {
  public final String jsonrpc = VERSION;
  public final Object result;
  public final Error error;
  public final Object id;

  public Response(Error error, Object id) {
    this.result = null;
    this.error = error;
    this.id = id;
  }

  public Response(Object result, Object id) {
    this.result = result;
    this.error = null;
    this.id = id;
  }
}
