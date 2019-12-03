package org.codice.jsonrpc;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableMap.Builder;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class JsonRpc implements Method {
  public static final int PARSE_ERROR = -32700;
  public static final int INVALID_REQUEST = -32600;
  public static final int METHOD_NOT_FOUND = -32601;
  public static final int INVALID_PARAMS = 32602;
  public static final int INTERNAL_ERROR = -32603;
  public static final int NOT_LOGGED_IN_ERROR = -32000;

  public static final String VERSION = "2.0";
  private static final String METHOD = "method";
  private static final String ID = "id";
  private static final String PARAMS = "params";

  private final Map<String, DocMethod> methods;

  public JsonRpc(List<MethodSet> methodSets) {
    Builder<String, DocMethod> builder = ImmutableMap.builder();
    builder.put("list-methods", new DocMethod(this::listMethods, "list all available methods"));
    for (MethodSet methods : methodSets) {
      builder.putAll(methods.getMethods());
    }
    this.methods = builder.build();
  }

  @Override
  public Object apply(Map<String, Object> request) {
    return process(request);
  }

  private Object process(Map<String, Object> request) {
    Object id = request.get(ID);

    Instant start = Instant.now();
    Object response = dispatch(request);
    Duration duration = Duration.between(start, Instant.now());
    if (response instanceof Error) {
      Error error = (Error) response;
      if (error.data instanceof Map) {
        error =
            new Error(
                error.code,
                error.message,
                ImmutableMap.builder()
                    .putAll((Map) error.data)
                    .put("request_duration_millis", duration.toMillis())
                    .build());
      }
      return new Response(error, id);
    } else if (response instanceof Map) {
      Map updatedResponse =
          ImmutableMap.builder()
              .putAll((Map) response)
              .put("request_duration_millis", duration.toMillis())
              .build();
      return new Response(updatedResponse, id);
    } else {
      return new Response(response, id);
    }
  }

  private Object dispatch(Map request) {
    if (request.get(ID) == null) {
      return new Error(INVALID_REQUEST, "Missing/Invalid id");
    }

    if (!request.containsKey(METHOD)) {
      return new Error(
          METHOD_NOT_FOUND,
          "Unknown method - use \"method\": \"list-methods\" to see available methods");
    }

    if (!(request.get(METHOD) instanceof String)) {
      return new Error(
          METHOD_NOT_FOUND,
          "Unknown method - use \"method\": \"list-methods\" to see available methods");
    }
    String method = (String) request.get(METHOD);

    DocMethod target = methods.get(method);
    if (target == null) {
      return new Error(
          METHOD_NOT_FOUND,
          "Unknown method - use \"method\": \"list-methods\" to see available methods");
    }

    if (!(request.get(PARAMS) instanceof Map)) {
      return new Error(INVALID_PARAMS, "params were not a map");
    }
    Map<String, Object> params = (Map) request.get(PARAMS);

    try {
      return target.apply(params);
    } catch (RuntimeException e) {
      return new Error(INTERNAL_ERROR, "Error occured - " + e.getMessage());
    }
  }

  private Object listMethods(Map<String, Object> params) {
    return methods
        .entrySet()
        .stream()
        .map(e -> ImmutableMap.of("method", e.getKey(), "docstring", e.getValue().docstring))
        .collect(Collectors.toList());
  }
}
