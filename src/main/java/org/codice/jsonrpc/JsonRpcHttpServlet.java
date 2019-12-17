package org.codice.jsonrpc;

import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.zip.GZIPOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class JsonRpcHttpServlet extends HttpServlet {

  private static final Gson GSON =
      new GsonBuilder().disableHtmlEscaping().setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ").create();

  private Method method;

  public JsonRpcHttpServlet(Method method) {
    this.method = method;
  }

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    resp.setHeader("Content-Type", "application/json");
    Map<String, Object> request =
        ImmutableMap.of("id", 0, "method", "list-methods", "params", ImmutableMap.of());
    Object methods = method.apply(request);

    try (Writer writer = getWriter(req, resp)) {
      GSON.toJson(methods, writer);
    }
  }

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    resp.setHeader("Content-Type", "application/json");

    Object request = GSON.fromJson(req.getReader(), Object.class);
    Object response;

    if (request instanceof List) {
      List<Map<String, Object>> requests = (List<Map<String, Object>>) request;
      response = requests.stream().map(method::apply).collect(Collectors.toList());
    } else {
      response = method.apply((Map<String, Object>) request);
    }

    try (Writer writer = getWriter(req, resp)) {
      GSON.toJson(response, writer);
    }
  }

  private Writer getWriter(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    boolean wantsGzip =
        Optional.of(req)
            .map(r -> r.getHeader("Accept-Encoding"))
            .map(s -> s.contains("gzip"))
            .orElse(false);

    if (!wantsGzip) {
      return resp.getWriter();
    }

    resp.addHeader("Content-Encoding", "gzip");
    return new OutputStreamWriter(new GZIPOutputStream(resp.getOutputStream(), true));
  }
}
